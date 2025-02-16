import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET({ params }: { params: { lessonId: string } }) {
  const { lessonId } = params;

  try {
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      select: { isCompleted: true },
    });

    if (!lesson) {
      return NextResponse.json({ message: "Lesson not found" }, { status: 404 });
    }

    return NextResponse.json({ isCompleted: lesson.isCompleted });
  } catch (error) {
    return NextResponse.json({ message: "Error fetching lesson status" }, { status: 500 });
  }
}

export async function POST({ params, request }: { params: { moduleId: string; lessonId: string }; request: Request }) {
  const { lessonId } = params;
  const { userId, points } = await request.json();

  try {
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
    });

    if (!lesson) {
      return NextResponse.json({ message: "Lesson not found" }, { status: 404 });
    }

    if (lesson.isCompleted) {
      return NextResponse.json({ message: "Lesson already completed. No points awarded." }, { status: 400 });
    }

    await prisma.lesson.update({
      where: { id: lessonId },
      data: { isCompleted: true },
    });

    const user = await prisma.user.update({
      where: { id: userId },
      data: { points: { increment: points } },
    });

    return NextResponse.json({ updatedPoints: user.points });
  } catch (error) {
    return NextResponse.json({ message: "Error completing lesson or updating points." }, { status: 500 });
  }
}
