import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET lesson completion status
export async function GET(request: Request, { params }: { params: { lessonId: string } }) {
  const { lessonId } = params;

  try {
    const lesson = await prisma.lessonProgress.findUnique({
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

// POST to mark lesson completed and add points
export async function POST(request: Request, { params }: { params: { moduleId: string; lessonId: string } }) {
  const { lessonId } = params;
  const { userId, points } = await request.json();

  try {
    const lessonProgress = await prisma.lessonProgress.findFirst({
      where: {
        lessonId,
        userId,
      },
    });

    if (!lessonProgress) {
      return NextResponse.json({ message: "Progress record not found" }, { status: 404 });
    }

    if (lessonProgress.isCompleted) {
      return NextResponse.json({ message: "Lesson already completed. No points awarded." }, { status: 400 });
    }

    await prisma.lessonProgress.update({
      where: { id: lessonProgress.id },
      data: { isCompleted: true },
    });

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { points: { increment: points } },
    });

    return NextResponse.json({ updatedPoints: updatedUser.points });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ message: "Error completing lesson or updating points." }, { status: 500 });
  }
}
