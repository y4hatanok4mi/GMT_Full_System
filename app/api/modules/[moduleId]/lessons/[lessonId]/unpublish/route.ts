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
    });

    if (!lesson) {
      return new Response("Course not found", { status: 404 });
    }

    const unpusblishedLesson = await prisma.lesson.update({
      where: { id: lessonId, instructorId: id },
      data: { isPublished: false },
    });

    return NextResponse.json(unpusblishedLesson, { status: 200 });
  } catch (err) {
    console.log("[lessonId_unpublish_POST]", err);
    return new Response("Internal Server Error", { status: 500 });
  }
};