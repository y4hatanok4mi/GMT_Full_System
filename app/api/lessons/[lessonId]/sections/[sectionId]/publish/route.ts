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

    console.log("Authenticated User:", user);

    if (!id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { courseId, sectionId } = params;

    console.log("CourseId:", courseId);
    console.log("SectionId:", sectionId);

    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
        instructorId: id,
      },
    });

    console.log("Course:", course);
    if (!course) {
      return new NextResponse("Course Not Found", { status: 404 });
    }

    const section = await prisma.section.findUnique({
      where: {
        id: sectionId,
        courseId,
      },
    });

    console.log("Section:", section);
    if (!section) {
      return new NextResponse("Section Not Found", { status: 404 });
    }

    if (!section.title || !section.description || !section.videoUrl) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const publishedSection = await prisma.section.update({
      where: {
        id: sectionId,
        courseId,
      },
      data: {
        isPublished: true,
      },
    });

    return NextResponse.json(publishedSection, { status: 200 });
  } catch (err) {
    console.log("[section_publish_POST]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
