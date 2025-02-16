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

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      select:{
        title: true
      }
    });

    if (!lesson) {
      console.error("[API] Lesson not found");
      return NextResponse.json({ message: "Lesson not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Lesson fetched successfully!", lesson },
      { status: 200 }
    );
  } catch (err) {
    console.error("[LESSON_GET]", err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
};