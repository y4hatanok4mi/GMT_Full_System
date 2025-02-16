import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (
  req: NextRequest,
  { params }: { params: { courseId: string } }
) => {
  try {
    const user = await auth();
    const id = user?.user.id;
    const { courseId } = params;

    if (!id) {
      return new Response("Unauthorized", { status: 401 });
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId, instructorId: id },
    });

    if (!course) {
      return new Response("Course not found", { status: 404 });
    }

    const unpusblishedCourse = await prisma.course.update({
      where: { id: courseId, instructorId: id },
      data: { isPublished: false },
    });

    return NextResponse.json(unpusblishedCourse, { status: 200 });
  } catch (err) {
    console.log("[courseId_unpublish_POST]", err);
    return new Response("Internal Server Error", { status: 500 });
  }
};