import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (
  req: NextRequest,
  { params }: { params: { chapterId: string } }
) => {
  try {
    const user = await auth();
    const id = user?.user.id;
    const { chapterId } = params;

    if (!id) {
      return new Response("Unauthorized", { status: 401 });
    }

    const chapter = await prisma.chapter.findUnique({
      where: { id: chapterId,},
    });

    if (!chapter) {
      return new Response("Chapter not found!", { status: 404 });
    }

    if (
      !chapter.title ||
      !chapter.description
    ) {
      return new NextResponse("Missing required fields!", { status: 400 });
    }

    const publishedChapter = await prisma.chapter.update({
      where: { id: chapterId },
      data: { isPublished: true },
    });

    return NextResponse.json(publishedChapter, { status: 200 });
  } catch (err) {
    console.log("[chapterId_publish_POST]", err);
    return new Response("Internal Server Error", { status: 500 });
  }
};
