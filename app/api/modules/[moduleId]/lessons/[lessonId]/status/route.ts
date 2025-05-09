import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

// GET lesson completion status
export async function GET(request: Request, { params }: { params: { lessonId: string } }) {
  const { lessonId } = params;
  const user = await auth();
  const userId = Number(user?.user.id);

  if (!lessonId) {
    return NextResponse.json({ message: "Lesson not found!" }, { status: 404 });
  }

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const progress = await prisma.lessonProgress.findFirst({
      where: {
        userId: userId, 
        lessonId: lessonId,
        isCompleted: true,
      },
    });
    console.log("Lesson status:", progress);

    if (!progress) {
      return NextResponse.json({ message: "Lesson progress not found!" }, { status: 404 });
    }

    return NextResponse.json({ isCompleted: progress.isCompleted });
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
      return NextResponse.json({ message: "Lesson already completed. No points awarded." }, { status: 200 });
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
