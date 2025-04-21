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

    // ✅ Fetch the current lesson to get its order
    const currentLesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
    });

    if (!currentLesson) {
      return NextResponse.json({ error: "Lesson not found." }, { status: 404 });
    }

    // ✅ Check if all chapters in the lesson are completed
    const chapterOrders = await prisma.chapterOrder.findMany({
      where: {
        userId,
        chapter: {
          lessonId,
        },
      },
    });

    const chapterStatuses = await Promise.all(
      chapterOrders.map((order) =>
        prisma.chapterProgress.findUnique({
          where: {
            userId_chapterId: {
              userId,
              chapterId: order.chapterId,
            },
          },
          select: {
            isCompleted: true,
          },
        })
      )
    );

    const allChaptersCompleted = chapterStatuses.every((progress) => progress?.isCompleted);

    if (!allChaptersCompleted) {
      return NextResponse.json({ message: "Complete all chapters before unlocking the lesson." }, { status: 400 });
    }

    // ✅ Check if lesson is already completed
    const existingProgress = await prisma.lessonProgress.findUnique({
      where: { userId_lessonId: { userId, lessonId } },
    });

    if (existingProgress?.isCompleted) {
      return NextResponse.json({ message: "Lesson already completed!" }, { status: 200 });
    }

    // ✅ Mark lesson as completed
    await prisma.lessonProgress.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      update: { isCompleted: true, isLocked: false },
      create: { userId, lessonId, isCompleted: true, isLocked: false },
    });

    // ✅ Award points on first completion
    await prisma.user.update({
      where: { id: userId },
      data: { points: { increment: 10 } },
    });

    // ✅ Find the next lesson based on order in the same module
    const nextLesson = await prisma.lesson.findFirst({
      where: {
        moduleId,
        order: { gt: currentLesson.order },
      },
      orderBy: { order: "asc" },
    });

    if (nextLesson) {
      await prisma.lessonProgress.upsert({
        where: { userId_lessonId: { userId, lessonId: nextLesson.id } },
        update: { isLocked: false },
        create: { userId, lessonId: nextLesson.id, isLocked: false, isCompleted: false },
      });

      return NextResponse.json({ message: "Next lesson unlocked, 10 points awarded!" }, { status: 200 });
    } else {
      return NextResponse.json({ message: "All lessons completed in this module, 10 points awarded!" }, { status: 200 });
    }
  } catch (err) {
    console.error("[lesson_progress_POST]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
