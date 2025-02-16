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

    const lastSection = await prisma.section.findFirst({
      where: { courseId: params.courseId },
      orderBy: { position: "desc" },
    });

    const newPosition = lastSection ? lastSection.position + 1 : 0;

    const { title } = await req.json();

    const newSection = await prisma.section.create({
      data: {
        title,
        courseId: params.courseId,
        position: newPosition,
      },
    });

    return NextResponse.json(newSection, { status: 200 });
  } catch (err) {
    console.log("[sections_POST]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};