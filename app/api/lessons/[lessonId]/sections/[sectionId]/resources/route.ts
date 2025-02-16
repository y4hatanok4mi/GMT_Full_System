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

    const section = await prisma.section.findUnique({
      where: {
        id: sectionId,
        courseId,
      },
    });

    if (!section) {
      return new NextResponse("Section Not Found", { status: 404 });
    }

    const { name, fileUrl } = await req.json();

    const resource = await prisma.resource.create({
      data: {
        name,
        fileUrl,
        sectionId,
      },
    });

    return NextResponse.json(resource, { status: 200 });
  } catch (err) {
    console.log("[resources_POST", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};