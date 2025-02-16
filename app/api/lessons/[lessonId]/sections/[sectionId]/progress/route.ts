import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (
  req: NextRequest,
  { params }: { params: { courseId: string; sectionId: string } }
) => {
  try {
    const user = await auth();
    const id = user?.user.id;
    const { isCompleted } = await req.json();

    if (!id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { courseId, sectionId } = params;

    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
    });

    if (!course) {
      return new NextResponse("Course Not Found", { status: 404 });
    }

    const section = await prisma.section.findUnique({
      where: {
        id: sectionId,
        courseId,
      },
    });

    if (!section) {
      return new NextResponse("Section Not Found", { status: 404 });
    }

    let progress = await prisma.progress.findUnique({
      where: {
        studentId_sectionId: {
          studentId: id,
          sectionId,
        },
      },
    });

    if (progress) {
      progress = await prisma.progress.update({
        where: {
          studentId_sectionId: {
            studentId: id,
            sectionId,
          },
        },
        data: {
          isCompleted,
        },
      });
    } else {
      progress = await prisma.progress.create({
        data: {
          studentId: id,
          sectionId,
          isCompleted,
        },
      });
    }

    return NextResponse.json(progress, { status: 200 });
  } catch (err) {
    console.log("[sectionId_progress_POST]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};