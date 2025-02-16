import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (
  req: NextRequest,
  { params }: { params: { moduleId: string; lessonId: string } }
) => {
  try {
    const user = await auth();
    const userId = Number(user?.user.id);
    const { isCompleted } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { moduleId, lessonId } = params;

    // ✅ Fetch the current lesson order
    const currentLessonOrder = await prisma.lessonOrder.findUnique({
      where: { userId_moduleId_lessonId: { userId, moduleId, lessonId } },
    });

    if (!currentLessonOrder) {
      return NextResponse.json({ error: "Lesson order not found." }, { status: 404 });
    }

    // ✅ Check existing progress
    const existingProgress = await prisma.lessonProgress.findUnique({
      where: { userId_lessonId: { userId, lessonId } },
    });

    if (existingProgress?.isCompleted) {
      return NextResponse.json({ message: "Lesson already completed!" }, { status: 200 });
    }

    // ✅ Mark the lesson as completed
    await prisma.lessonProgress.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      update: { isCompleted: true, isLocked: false },
      create: { userId, lessonId, isCompleted: true, isLocked: false },
    });

    // ✅ Add 10 points only for the first completion
    await prisma.user.update({
      where: { id: userId },
      data: { points: { increment: 10 } },
    });

    // ✅ Find the next lesson based on `LessonOrder`
    const nextLessonOrder = await prisma.lessonOrder.findFirst({
      where: {
        userId,
        moduleId,
        order: { gt: currentLessonOrder.order }, // Get the next lesson in sequence
      },
      orderBy: { order: "asc" },
      select: { lessonId: true },
    });

    if (nextLessonOrder) {
      // ✅ Unlock the next lesson in `LessonProgress`
      await prisma.lessonProgress.upsert({
        where: { userId_lessonId: { userId, lessonId: nextLessonOrder.lessonId } },
        update: { isLocked: false },
        create: { userId, lessonId: nextLessonOrder.lessonId, isLocked: false, isCompleted: false },
      });

      return NextResponse.json({ message: "Next lesson unlocked, 10 points awarded!" }, { status: 200 });
    } else {
      return NextResponse.json({ message: "No more lessons in this module, 10 points awarded!" }, { status: 200 });
    }
  } catch (err) {
    console.error("[lessonId_progress_unlock_POST]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
