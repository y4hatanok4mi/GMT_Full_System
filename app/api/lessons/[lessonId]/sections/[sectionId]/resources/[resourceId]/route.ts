import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (
  req: NextRequest,
  { params }: { params: { courseId: string; sectionId: string, resourceId: string } }
) => {
  try {
    const user = await auth();
    const id = user?.user.id;

    if (!id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { courseId, sectionId, resourceId } = params;

    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
        instructorId: id,
      },
    });

    if (!course) {
      return new NextResponse("Lesson Not Found!", { status: 404 });
    }

    const section = await prisma.section.findUnique({
      where: {
        id: sectionId,
        courseId,
      },
    });

    if (!section) {
      return new NextResponse("Content not found!", { status: 404 });
    }

    await prisma.resource.delete({
      where: {
        id: resourceId,
        sectionId,
      },
    });
    
    return NextResponse.json("Resource deleted!", { status: 200 });
  } catch (err) {
    console.log("[resourceId_DELETE", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};