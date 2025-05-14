import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { moduleId: string; lessonId: string } }
) {
  try {
    const user = await auth();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { moduleId, lessonId } = params;
    const userId = Number(user.user.id);

    // Check existing order
    const existingChapterOrder = await prisma.chapterOrder.findMany({
      where: {
        userId,
        lessonId,
      },
      orderBy: { order: "asc" },
      include: {
        chapter: {
          include: {
            lesson: true,
            category: true,
          },
        },
      },
    });

    if (existingChapterOrder.length > 0) {
      const chaptersWithProgress = await Promise.all(
        existingChapterOrder.map(async (entry) => {
          const chapter = entry.chapter;
          const progress = await prisma.chapterProgress.findUnique({
            where: { userId_chapterId: { userId, chapterId: chapter.id } },
            select: { isCompleted: true },
          });

          return {
            ...chapter,
            isCompleted: progress?.isCompleted ?? false,
          };
        })
      );

      return NextResponse.json({ chapters: chaptersWithProgress });
    }

    // Get user preferences
    const preferences = await prisma.userPreferences.findUnique({
      where: { userId },
      select: { primaryStyle: true, secondaryStyle: true },
    });

    if (!preferences) {
      return NextResponse.json(
        { error: "Preferences not found" },
        { status: 404 }
      );
    }

    const { primaryStyle, secondaryStyle } = preferences;
    const allStyles = ["Visual", "Read & Write", "Auditory"];
    const tertiaryStyle =
      allStyles.find(
        (style) => style !== primaryStyle && style !== secondaryStyle
      ) || "Visual";

    // Fetch chapters by style
    const chapters = await prisma.chapter.findMany({
      where: {
        isPublished: true,
        lesson: {
          isPublished: true,
          moduleId,
          id: lessonId,
        },
        category: {
          name: {
            in: [primaryStyle, secondaryStyle, tertiaryStyle],
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
      include: {
        lesson: true,
        category: true,
      },
    });

    // Step 1: Group chapters by base title (e.g., "Chapter 1")
    const baseChapterMap = new Map<
      string,
      { [style: string]: (typeof chapters)[0] }
    >();

    for (const chapter of chapters) {
      const baseMatch = chapter.title.match(/^(Chapter\s*\d+)/i);
      if (!baseMatch) continue;

      const baseTitle = baseMatch[1].trim();

      if (!baseChapterMap.has(baseTitle)) {
        baseChapterMap.set(baseTitle, {});
      }

      const entry = baseChapterMap.get(baseTitle)!;
      if (chapter.category?.name) {
        entry[chapter.category.name] = chapter;
      }
    }

    // Step 2: Sort base chapters numerically
    const baseChapterEntries = Array.from(baseChapterMap.entries()).sort(
      ([a], [b]) => {
        const aNum = parseInt(a.replace(/\D/g, ""), 10);
        const bNum = parseInt(b.replace(/\D/g, ""), 10);
        return aNum - bNum;
      }
    );

    const totalBaseChapters = baseChapterEntries.length;
    const limitPrimary = Math.floor(totalBaseChapters * 0.5);
    const limitSecondary = Math.floor(totalBaseChapters * 0.3);
    const limitTertiary = totalBaseChapters - (limitPrimary + limitSecondary);

    const selectedChapters: typeof chapters = [];

    for (let i = 0; i < baseChapterEntries.length; i++) {
      const [_baseTitle, versions] = baseChapterEntries[i];

      if (i < limitPrimary && versions[primaryStyle]) {
        selectedChapters.push(versions[primaryStyle]);
      } else if (
        i < limitPrimary + limitSecondary &&
        versions[secondaryStyle]
      ) {
        selectedChapters.push(versions[secondaryStyle]);
      } else if (versions[tertiaryStyle]) {
        selectedChapters.push(versions[tertiaryStyle]);
      } else {
        // fallback
        const fallback =
          versions[primaryStyle] ||
          versions[secondaryStyle] ||
          versions[tertiaryStyle];
        if (fallback) selectedChapters.push(fallback);
      }
    }

    // Step 3: Always include lesson takeaway chapters if any
    const takeawayChapters = chapters.filter((ch) =>
      /takeaway/i.test(ch.title)
    );

    for (const chapter of takeawayChapters) {
      if (!selectedChapters.find((c) => c.id === chapter.id)) {
        selectedChapters.push(chapter);
      }
    }

    // Save order
    await prisma.$transaction(
      selectedChapters.map((chapter, index) =>
        prisma.chapterOrder.create({
          data: {
            userId,
            chapterId: chapter.id,
            lessonId: chapter.lessonId,
            order: index + 1,
          },
        })
      )
    );

    // Include progress
    const chaptersWithProgress = await Promise.all(
      selectedChapters.map(async (chapter) => {
        const progress = await prisma.chapterProgress.upsert({
          where: { userId_chapterId: { userId, chapterId: chapter.id } },
          update: {},
          create: {
            userId,
            chapterId: chapter.id,
          },
          select: { isCompleted: true },
        });

        return {
          ...chapter,
          isCompleted: progress.isCompleted,
        };
      })
    );

    return NextResponse.json({ chapters: chaptersWithProgress });
  } catch (error) {
    console.error("Error fetching chapters:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
