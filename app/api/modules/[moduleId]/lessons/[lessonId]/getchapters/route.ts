import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, { params } : { params: { lessonId: string }}) => {
  try {
    const { lessonId } = params;
    const user = await auth();
    const userId = user?.user.id;

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const chapters = await prisma.chapter.findMany({
      where: { lessonId, isPublished: true  },
      orderBy: {
        createdAt: "asc",
      }
    });
    return NextResponse.json(
      { message: "Chapters fetched successfully!", chapters },
      { status: 200 }
    );
  } catch (err) {
    console.error("[CHAPTERS_GET]", err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
};