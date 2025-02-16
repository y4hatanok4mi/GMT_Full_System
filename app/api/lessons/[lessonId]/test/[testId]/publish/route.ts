import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (
  req: NextRequest,
  { params }: { params: { courseId: string; testId: string } }
) => {
  try {
    const user = await auth();
    const id = user?.user.id;

    console.log("Authenticated User:", user);

    if (!id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { courseId, testId } = params;

    console.log("CourseId:", courseId);
    console.log("TestId:", testId);

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

    const test = await prisma.test.findUnique({
      where: {
        id: testId,
        courseId,
      },
    });

    console.log("Test:", test);
    if (!test) {
      return new NextResponse("Test Not Found", { status: 404 });
    }

    if (!test.title || !test.description ) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const publishedTest = await prisma.test.update({
      where: {
        id: testId,
        courseId,
      },
      data: {
        isPublished: true,
      },
    });

    return NextResponse.json(publishedTest, { status: 200 });
  } catch (err) {
    console.log("[section_publish_POST]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
