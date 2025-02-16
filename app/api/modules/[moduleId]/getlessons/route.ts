import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

type LessonWithCategory = {
  id: string;
  title: string;
  description: string | null;
  isPublished: boolean;
  order: number;
  moduleId: string;
  categoryId: string | null;
  createdAt: Date;
  updatedAt: Date;
  category?: { name: string } | null;
};

export async function GET(req: Request, { params }: { params: { moduleId: string } }) {
  try {
    const user = await auth();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { moduleId } = params;
    const userId = Number(user.user.id);

    // 🔍 Check if lessons are already ordered for this user
    const existingLessonOrder = await prisma.lessonOrder.findMany({
      where: { userId, moduleId },
      orderBy: { order: "asc" },
      include: {
        lesson: { include: { category: true } },
      },
    });

    if (existingLessonOrder.length > 0) {
      // Fetch LessonProgress for each lesson
      const lessonsWithProgress = await Promise.all(
        existingLessonOrder.map(async (l) => {
          const progress = await prisma.lessonProgress.findUnique({
            where: { userId_lessonId: { userId, lessonId: l.lessonId } },
            select: { isLocked: true, isCompleted: true },
          });

          return {
            ...l.lesson,
            isLocked: progress?.isLocked ?? true, // Default to locked if no progress exists
            isCompleted: progress?.isCompleted ?? false,
          };
        })
      );

      return NextResponse.json({ lessons: lessonsWithProgress });
    }

    // 🔥 Fetch user's learning style preferences
    const preferences = await prisma.userPreferences.findUnique({
      where: { userId },
      select: { primaryStyle: true, secondaryStyle: true },
    });

    if (!preferences) {
      return NextResponse.json({ error: "Preferences not found" }, { status: 404 });
    }

    const { primaryStyle, secondaryStyle } = preferences;
    const allStyles = ["Visual", "Read & Write", "Audio"];
    const otherStyle = allStyles.find(
      (style) => style !== primaryStyle && style !== secondaryStyle
    ) || "Visual"; // Default to Visual if undefined

    // ✅ Lesson selection limits based on preference ratio
    const limits = { primary: 5, secondary: 3, other: 2 };

    // 🔥 Fetch all lessons in the module
    const allLessons: LessonWithCategory[] = await prisma.lesson.findMany({
      where: { moduleId, isPublished: true },
      include: { category: { select: { name: true } } },
      orderBy: { order: "asc" },
    });

    // 🔥 Group lessons by category
    const lessonsByCategory = {
      primary: allLessons.filter((l) => l.category?.name === primaryStyle),
      secondary: allLessons.filter((l) => l.category?.name === secondaryStyle),
      other: allLessons.filter((l) => l.category?.name === otherStyle),
    };

    const selectedLessons: LessonWithCategory[] = [];
    const usedTitles = new Set<string>();

    // ✅ Function to add lessons based on category limits
    const addLessons = (type: "primary" | "secondary" | "other") => {
      let count = 0;
      for (const lesson of lessonsByCategory[type]) {
        if (count >= limits[type]) break;
        if (!usedTitles.has(lesson.title)) {
          selectedLessons.push(lesson);
          usedTitles.add(lesson.title);
          count++;
        }
      }
    };

    addLessons("primary");
    addLessons("secondary");
    addLessons("other");

    // 🛠 If there aren't enough lessons, fill gaps with any remaining lessons
    if (selectedLessons.length < 10) {
      for (const lesson of allLessons) {
        if (selectedLessons.length >= 10) break;
        if (!usedTitles.has(lesson.title)) {
          selectedLessons.push(lesson);
          usedTitles.add(lesson.title);
        }
      }
    }

    // 🚀 Store the ordered lessons in LessonOrder
    await prisma.$transaction(
      selectedLessons.map((lesson, index) =>
        prisma.lessonOrder.create({
          data: {
            userId,
            moduleId,
            lessonId: lesson.id,
            order: index + 1,
          },
        })
      )
    );

    const lessonsWithProgress = await Promise.all(
      selectedLessons.map(async (lesson) => {
        const progress = await prisma.lessonProgress.upsert({
          where: { userId_lessonId: { userId, lessonId: lesson.id } },
          update: {},
          create: {
            userId,
            lessonId: lesson.id,
            isLocked: true, // Keep all lessons locked initially
          },
          select: { isLocked: true, isCompleted: true },
        });
    
        return {
          ...lesson,
          isLocked: progress.isLocked,
          isCompleted: progress.isCompleted,
        };
      })
    );    

    return NextResponse.json({ lessons: lessonsWithProgress });

  } catch (error) {
    console.error("Error fetching lessons:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

