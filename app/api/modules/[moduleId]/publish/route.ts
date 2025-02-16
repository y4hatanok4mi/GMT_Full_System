import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (
  req: NextRequest,
  { params }: { params: { moduleId: string } }
) => {
  try {
    const user = await auth();
    const id = user?.user.id;
    const { moduleId } = params;

    if (!id) {
      return new Response("Unauthorized", { status: 401 });
    }

    const moduleData = await prisma.module.findUnique({
      where: { id: moduleId, instructorId: id },
      include: {
        lesson: {
        },
      },
    });

    if (!moduleData) {
      return new Response("Module not found!", { status: 404 });
    }

    const isPublishedLessons = moduleData.lesson.some(
      (lesson) => lesson.isPublished
    );

    if (
      !moduleData.name ||
      !moduleData.description ||
      !moduleData.imageUrl ||
      !isPublishedLessons
    ) {
      return new NextResponse("Missing required fields!", { status: 400 });
    }

    const publishedModule = await prisma.module.update({
      where: { id: moduleId, instructorId: id },
      data: { isPublished: true },
    });

    return NextResponse.json(publishedModule, { status: 200 });
  } catch (err) {
    console.log("[moduleId_publish_POST]", err);
    return new Response("Internal Server Error", { status: 500 });
  }
};
