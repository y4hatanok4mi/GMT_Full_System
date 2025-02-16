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
      include: {
        sections: {
        },
      },
    });

    if (!course) {
      return new Response("Course not found!", { status: 404 });
    }

    const isPublishedSections = course.sections.some(
      (section) => section.isPublished
    );

    if (
      !course.title ||
      !course.description ||
      !course.categoryId ||
      !course.subCategoryId ||
      !course.weekId ||
      !course.imageUrl ||
      !course.quarterId ||
      !isPublishedSections
    ) {
      return new NextResponse("Missing required fields!", { status: 400 });
    }

    const publishedCourse = await prisma.course.update({
      where: { id: courseId, instructorId: id },
      data: { isPublished: true },
    });

    return NextResponse.json(publishedCourse, { status: 200 });
  } catch (err) {
    console.log("[courseId_publish_POST]", err);
    return new Response("Internal Server Error", { status: 500 });
  }
};
