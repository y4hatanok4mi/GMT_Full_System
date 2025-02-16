import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export const POST = async (
  req: NextRequest,
  { params }: { params: { courseId: string; sectionId: string } }
) => {
  try {
    const user = await auth();
    const id = user?.user.id;

    if (!id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const values = await req.json();
    const { courseId, sectionId } = params;

    // Validate the course belongs to the instructor
    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
        instructorId: id,
      },
    });

    if (!course) {
      return new NextResponse("Course Not Found", { status: 404 });
    }

    const updatedData = {
      title: values.title,
      description: values.description || null,
      videoUrl: values.videoUrl || null,
      imageUrl: values.imageUrl || null,
      imageDescription: values.imageDescription || null,
    };

    const section = await prisma.section.update({
      where: {
        id: sectionId,
      },
      data: updatedData,
    });

    return NextResponse.json(section, { status: 200 });
  } catch (err) {
    console.error("[sectionId_POST]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};


export const DELETE = async (
  req: NextRequest,
  { params }: { params: { courseId: string; sectionId: string } }
) => {
  try {
    const user = await auth();
    const id = user?.user.id;

    if (!id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { courseId, sectionId } = params;

    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
        instructorId: id,
      },
    });

    if (!course) {
      return new NextResponse("Course Not Found!", { status: 404 });
    }

    const section = await prisma.section.findUnique({
      where: {
        id: sectionId,
      },
    });

    if (!section) {
      return new NextResponse("Section Not Found", { status: 404 });
    }

    await prisma.section.delete({
      where: {
        id: sectionId,
      },
    });

    const publishedSectionsInCourse = await prisma.section.findMany({
      where: {
        courseId,
        isPublished: true,
      },
    });

    if (!publishedSectionsInCourse.length) {
      await prisma.course.update({
        where: {
          id: courseId,
        },
        data: {
          isPublished: false,
        },
      });
    }

    return new NextResponse("Section Deleted", { status: 200 });
  } catch (err) {
    console.error("[sectionId_DELETE]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
