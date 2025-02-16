// API route for unlocking the next lesson
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (
  req: NextRequest,
  { params }: { params: { moduleId: string; lessonId: string } }
) => {
  try {
    const { userId } = await req.json();
    const { moduleId, lessonId } = params;

    await prisma.lesson.update({
      where: { id: lessonId },
      data: { isCompleted: true },
    });

    const currentLesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
    });

    const nextLesson = await prisma.lesson.findFirst({
      where: {
        moduleId: moduleId,
        order: {
          gt: currentLesson?.order,
        },
      },
      orderBy: {
        order: "asc",
      },
    });

    if (nextLesson) {
      await prisma.lesson.update({
        where: { id: nextLesson.id },
        data: { isLocked: false },
      });

      return NextResponse.json({ message: "Next lesson unlocked!" }, { status: 200 });
    } else {
      return NextResponse.json({ message: "No more lessons in this module." }, { status: 200 });
    }
  } catch (err) {
    console.log("[lesson_unlock_POST]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
