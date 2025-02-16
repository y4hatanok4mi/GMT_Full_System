import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const PUT = async (
  req: NextRequest,
  { params }: { params: { courseId: string } }
) => {
  try {
    const user = await auth();
    const id = user?.user.id;

    if (!id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { list } = await req.json();

    const course = await prisma.course.findUnique({
      where: {
        id: params.courseId,
        instructorId: id,
      },
    });

    if (!course) {
      return new NextResponse("Lesson not found!", { status: 404 });
    }

    for (let item of list) {
      await prisma.section.update({
        where: {
          id: item.id,
        },
        data: {
          position: item.position,
        },
      });
    }

    return new NextResponse("Reorder contents successfully", { status: 200 });
  } catch (err) {
    console.log("[reorder_PUT]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};