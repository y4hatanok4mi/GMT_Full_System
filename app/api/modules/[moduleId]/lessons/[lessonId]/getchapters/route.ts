import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { moduleId: string } }) {
  try {
    const user = await auth();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { moduleId } = params;
    const userId = Number(user.user.id);

    const existingChapterOrder = await prisma.chapterOrder.findMany({
      where: { userId },
      orderBy: { order: "asc" },
      include: { chapter: { include: { lesson: true, category: true } } },
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

    const preferences = await prisma.userPreferences.findUnique({
      where: { userId },
      select: { primaryStyle: true, secondaryStyle: true },
    });

    if (!preferences) {
      return NextResponse.json({ error: "Preferences not found" }, { status: 404 });
    }

    const { primaryStyle, secondaryStyle } = preferences;
    const allStyles = ["Visual", "Read & Write", "Auditory"];
    const tertiaryStyle = allStyles.find(
      (style) => style !== primaryStyle && style !== secondaryStyle
    ) || "Visual";

    const allChapters = await prisma.chapter.findMany({
      where: {
        isPublished: true,
        lesson: {
          isPublished: true,
          moduleId,
        },
      },
      include: {
        lesson: true,
        category: true,
      },
    });

    const groupedChapters = {
      primary: allChapters.filter((c) => c.category?.name === primaryStyle),
      secondary: allChapters.filter((c) => c.category?.name === secondaryStyle),
      tertiary: allChapters.filter((c) => c.category?.name === tertiaryStyle),
    };

    const totalChapters = allChapters.length;

    const limits = {
      primary: Math.round(totalChapters * 0.5),
      secondary: Math.round(totalChapters * 0.3),
      tertiary: totalChapters - (
        Math.round(totalChapters * 0.5) + Math.round(totalChapters * 0.3)
      ),
    };

    const selectedChapters: typeof allChapters = [];
    const usedChapterIds = new Set<string>();

    const addChapters = (type: "primary" | "secondary" | "tertiary") => {
      let count = 0;
      for (const chapter of groupedChapters[type]) {
        if (count >= limits[type]) break;
        if (!usedChapterIds.has(chapter.id)) {
          selectedChapters.push(chapter);
          usedChapterIds.add(chapter.id);
          count++;
        }
      }
    };

    addChapters("primary");
    addChapters("secondary");
    addChapters("tertiary");

    // Optionally: Limit to 10 chapters max
    if (selectedChapters.length < 10) {
      for (const chapter of allChapters) {
        if (selectedChapters.length >= 10) break;
        if (!usedChapterIds.has(chapter.id)) {
          selectedChapters.push(chapter);
          usedChapterIds.add(chapter.id);
        }
      }
    }

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
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
