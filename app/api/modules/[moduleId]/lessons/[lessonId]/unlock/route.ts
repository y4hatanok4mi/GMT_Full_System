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

    // 🔥 Fetch the first lesson from LessonOrder for this user
    const firstLessonOrder = await prisma.lessonOrder.findFirst({
      where: { moduleId, userId: Number(userId) },
      orderBy: { order: "asc" },
      select: { lessonId: true },
    });

    if (!firstLessonOrder) {
      return new NextResponse("No lessons found in LessonOrder", { status: 404 });
    }

    // 🔍 Check if progress already exists for this lesson
    const existingProgress = await prisma.lessonProgress.findUnique({
      where: { userId_lessonId: { userId: Number(userId), lessonId: firstLessonOrder.lessonId } },
    });

    if (existingProgress) {
      return NextResponse.json({ message: "Lesson already unlocked!", lessonProgress: existingProgress }, { status: 200 });
    }

    // 🔓 Unlock the first lesson for the user in LessonProgress
    const lessonProgress = await prisma.lessonProgress.upsert({
      where: { userId_lessonId: { userId: Number(userId), lessonId: firstLessonOrder.lessonId } },
      update: { isLocked: false },
      create: { userId: Number(userId), lessonId: firstLessonOrder.lessonId, isLocked: false, isCompleted: false },
    });

    return NextResponse.json({ message: "First lesson unlocked!", lessonProgress }, { status: 200 });
  } catch (err) {
    console.error("[lesson_unlock_POST]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
