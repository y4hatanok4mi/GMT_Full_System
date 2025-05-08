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
      where: { id: chapterId },
    });

    if (!chapter) {
      return new Response("Chapter not found", { status: 404 });
    }

    const unpusblishedchapter = await prisma.chapter.update({
      where: { id: chapterId},
      data: { isPublished: false },
    });

    return NextResponse.json(unpusblishedchapter, { status: 200 });
  } catch (err) {
    console.log("[chapterId_unpublish_POST]", err);
    return new Response("Internal Server Error", { status: 500 });
  }
};