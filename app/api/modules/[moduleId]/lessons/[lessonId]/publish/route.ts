import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (
  req: NextRequest,
  { params }: { params: { lessonId: string } }
) => {
  try {
    const user = await auth();
    const id = user?.user.id;
    const { lessonId } = params;

    if (!id) {
      return new Response("Unauthorized", { status: 401 });
    }

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId, instructorId: id },
      include: {
        chapter: {
        },
      },
    });

    if (!lesson) {
      return new Response("Lesson not found!", { status: 404 });
    }

    const isPublishedChapters = lesson.chapter.some(
      (chapter) => chapter.isPublished
    );

    if (
      !lesson.title ||
      !isPublishedChapters
    ) {
      return new NextResponse("Missing required fields!", { status: 400 });
    }

    const publishedModule = await prisma.lesson.update({
      where: { id: lessonId, instructorId: id },
      data: { isPublished: true },
    });

    return NextResponse.json(publishedModule, { status: 200 });
  } catch (err) {
    console.log("[lessonId_publish_POST]", err);
    return new Response("Internal Server Error", { status: 500 });
  }
};
