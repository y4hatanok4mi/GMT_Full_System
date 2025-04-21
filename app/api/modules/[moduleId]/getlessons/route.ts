import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

type LessonWithCategoryAndProgress = {
  id: string;
  title: string;
  description: string | null;
  isPublished: boolean;
  order: number;
  moduleId: string;
  createdAt: Date;
  updatedAt: Date;
  category?: { name: string } | null;
  isLocked: boolean;
  isCompleted: boolean;
};

export async function GET(req: Request, { params }: { params: { moduleId: string } }) {
  try {
    const user = await auth();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { moduleId } = params;
    const userId = Number(user.user.id);

    // Fetch all lessons in the module along with their progress for the specific user
    const lessons = await prisma.lesson.findMany({
      where: {
        moduleId,
        isPublished: true,
      },
      orderBy: {
        order: "asc",
      },
      include: {
        progress: {
          where: { userId },
          select: {
            isLocked: true,
            isCompleted: true,
          },
        },
      },
    });

    // Include progress data (if progress exists, otherwise set default values)
    const lessonsWithProgress: LessonWithCategoryAndProgress[] = lessons.map((lesson) => {
      const progress = lesson.progress[0] || { isLocked: true, isCompleted: false };

      return {
        ...lesson,
        isLocked: progress.isLocked,
        isCompleted: progress.isCompleted,
      };
    });

    return NextResponse.json({ lessons: lessonsWithProgress });

  } catch (error) {
    console.error("Error fetching lessons:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
