import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, { params }: { params: { courseId: string } }) => {
  try {
    const { courseId } = params;

    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found!" }, { status: 404 });
    }

    const instructorId = parseInt(course.instructorId, 10); // Convert to Int
    console.log(instructorId)

    const instructor = await prisma.user.findUnique({
      where: { id: instructorId },
    });

    if (!instructor) {
      return NextResponse.json({ error: "Instructor not found!" }, { status: 404 });
    }

    return NextResponse.json(instructor, { status: 200 });
  } catch (error) {
    console.error("Error fetching instructor information:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
