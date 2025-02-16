import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (
  req: NextRequest,
  { params }: { params: { courseId: string } }
) => {
  try {
    const user = await auth();
    const id =  user?.user.id;

    if (!id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const course = await prisma.course.findUnique({
      where: { id: params.courseId, instructorId: id },
    });

    if (!course) {
      return new NextResponse("Course Not Found", { status: 404 });
    }

    const lastTest = await prisma.test.findFirst({
      where: { courseId: params.courseId },
      orderBy: { position: "desc" },
    });

    const newPosition = lastTest ? lastTest.position + 1 : 0;

    const { title } = await req.json();

    const newTest = await prisma.test.create({
      data: {
        title,
        courseId: params.courseId,
        creatorId: Number(id),
        position: newPosition,
      },
    });

    return NextResponse.json(newTest, { status: 200 });
  } catch (err) {
    console.log("[tests_POST]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};