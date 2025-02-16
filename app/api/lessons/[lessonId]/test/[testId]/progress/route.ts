import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (
  req: NextRequest,
  { params }: { params: { courseId: string; testId: string } }
) => {
  try {
    // Authenticate user
    const user = await auth();
    const studentId = user?.user.id;

    if (!studentId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse and validate the request body
    const { isCompleted } = await req.json();

    if (typeof isCompleted !== "boolean") {
      return NextResponse.json(
        { error: "Invalid 'isCompleted' value. It must be a boolean." },
        { status: 400 }
      );
    }

    const { courseId, testId } = params;

    // Verify course existence
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return NextResponse.json({ error: "Course Not Found" }, { status: 404 });
    }

    // Verify test existence within the course
    const test = await prisma.test.findFirst({
      where: { id: testId, courseId },
    });

    if (!test) {
      return NextResponse.json({ error: "Test Not Found" }, { status: 404 });
    }

    // Use upsert for progress creation or update
    const progress = await prisma.progress.upsert({
      where: {
        studentId_testId: {
          studentId,
          testId,
        },
      },
      update: {
        isCompleted,
      },
      create: {
        studentId,
        testId,
        isCompleted,
      },
    });

    return NextResponse.json(progress, { status: 200 });
  } catch (err) {
    console.error("[POST /api/progress]", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
