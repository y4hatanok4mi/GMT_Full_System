import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (
  req: NextRequest,
  { params }: { params: { moduleId: string; lessonId: string; chapterId: string } }
) => {
  try {
    const user = await auth();
    const userId = Number(user?.user.id);
    const { isCompleted } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { moduleId, lessonId, chapterId } = params;

    const moduleData = await prisma.module.findUnique({
      where: {
        id: moduleId,
      },
    });

    if (!moduleData) {
      return new NextResponse("Module Not Found", { status: 404 });
    }

    const lesson = await prisma.lesson.findUnique({
      where: {
        id: lessonId,
        moduleId,
      },
    });

    if (!lesson) {
      return new NextResponse("Lesson Not Found", { status: 404 });
    }

    const chapter = await prisma.chapter.findUnique({
      where: {
        id: chapterId,
        lessonId,
      },
    });

    if (!chapter) {
      return new NextResponse("Chapter Not Found", { status: 404 });
    }

    // Mark chapter progress
    let progress = await prisma.chapterProgress.findUnique({
      where: {
        userId_chapterId: {
          userId: userId,
          chapterId,
        },
      },
    });

    if (progress) {
      progress = await prisma.chapterProgress.update({
        where: {
          userId_chapterId: {
            userId: userId,
            chapterId,
          },
        },
        data: {
          isCompleted,
        },
      });
    } else {
      progress = await prisma.chapterProgress.create({
        data: {
          userId: userId,
          chapterId,
          isCompleted,
        },
      });
    }

    return NextResponse.json(progress, { status: 200 });
  } catch (err) {
    console.log("[chapterId_progress_POST]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
