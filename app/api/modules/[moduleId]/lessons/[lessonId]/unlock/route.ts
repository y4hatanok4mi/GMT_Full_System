import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (
  req: NextRequest,
  { params }: { params: { moduleId: string } }
) => {
  try {
    const { moduleId } = params;
    const { userId } = await req.json(); // Expect userId in request body

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // 🔥 Fetch the first lesson in the module based on the order field of the Lesson model
    const firstLesson = await prisma.lesson.findFirst({
      where: { moduleId },
      orderBy: { order: "asc" }, // Ordering lessons by the 'order' field in Lesson model
      select: { id: true }, // Selecting only the lesson ID for efficiency
    });

    if (!firstLesson) {
      return new NextResponse("No lessons found in this module", { status: 404 });
    }

    // 🔍 Check if progress already exists for this lesson
    const existingProgress = await prisma.lessonProgress.findUnique({
      where: { userId_lessonId: { userId: Number(userId), lessonId: firstLesson.id } },
    });

    if (existingProgress) {
      return NextResponse.json({ message: "Lesson already unlocked!", lessonProgress: existingProgress }, { status: 200 });
    }

    // 🔓 Unlock the first lesson for the user in LessonProgress
    const lessonProgress = await prisma.lessonProgress.upsert({
      where: { userId_lessonId: { userId: Number(userId), lessonId: firstLesson.id } },
      update: { isLocked: false },
      create: { userId: Number(userId), lessonId: firstLesson.id, isLocked: false, isCompleted: false },
    });

    return NextResponse.json({ message: "First lesson unlocked!", lessonProgress }, { status: 200 });
  } catch (err) {
    console.error("[lesson_unlock_POST]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
