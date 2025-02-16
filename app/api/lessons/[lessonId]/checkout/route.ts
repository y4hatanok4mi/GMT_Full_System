import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export const POST = async (
  req: NextRequest,
  { params }: { params: { courseId: string } }
) => {
  try {
    const user = await auth();

    // Ensure the user is authenticated
    if (!user || !user?.user.id || !user?.user.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check if the course exists and is published
    const course = await prisma.course.findUnique({
      where: { id: params.courseId, isPublished: true },
    });

    if (!course) {
      return new NextResponse("Course Not Found", { status: 404 });
    }

    // Check if the user is already enrolled in the course
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        studentId_courseId: { studentId: user.user.id, courseId: course.id },
      },
    });

    if (enrollment) {
      return new NextResponse("Already Enrolled", { status: 400 });
    }

    // Enroll the user in the course
    await prisma.enrollment.create({
      data: {
        studentId: user.user.id,
        courseId: course.id,
        enrolledAt: new Date(), // Track the enrollment date
      },
    });

    return new NextResponse("Enrolled Successfully", { status: 200 });
  } catch (err) {
    console.error("[courseId_enroll_POST]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
