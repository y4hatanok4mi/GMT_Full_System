import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export const PATCH = async (
  req: NextRequest,
  { params }: { params: { courseId: string } }
) => {
  try {
    const user = await auth();
    const userId = user?.user.id;
    const { courseId } = params;

    if (!userId) {
      return new Response('Unauthorized', { status: 401 });
    }

    const values = await req.json();

    const course = await prisma.course.update({
      where: { id: courseId, instructorId: userId },
      data: { ...values },
    });

    return NextResponse.json(course, { status: 200 });
  } catch (err) {
    console.error('courseId_PATCH Error:', err);
    return new Response('Internal Server Error', { status: 500 });
  }
};

export const DELETE = async (
  req: NextRequest,
  { params }: { params: { courseId: string } }
) => {
  try {
    const user = await auth();
    const userId = user?.user.id;
    const { courseId } = params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId, instructorId: userId },
      include: {
        sections: {
        }
      }
    });

    if (!course) {
      return new NextResponse("Course not found!", { status: 404 });
    }

    await prisma.course.delete({
      where: { id: courseId, instructorId: userId },
    });

    return new NextResponse("Course Deleted!", { status: 200 });
  } catch (err) {
    console.error(["courseId_DELETE", err]);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
