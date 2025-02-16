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
      return new NextResponse("Course Not Found", { status: 404 });
    }

    const unpublishedSection = await prisma.section.update({
      where: {
        id: sectionId,
        courseId,
      },
      data: {
        isPublished: false,
      },
    });

    const publishedSectionsInCourse = await prisma.section.findMany({
      where: {
        courseId,
        isPublished: true,
      },
    });

    if (publishedSectionsInCourse.length === 0) {
      await prisma.course.update({
        where: {
          id: courseId,
          instructorId: id,
        },
        data: {
          isPublished: false,
        },
      });
    }

    return NextResponse.json(unpublishedSection, { status: 200 });
  } catch (err) {
    console.log("[sectionId_unpublish_POST]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}