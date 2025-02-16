import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: { lessonId: string } }) {
  const { lessonId } = params;

  try {
    const questions = await prisma.question.findMany({
      where: { lessonId: lessonId },
      include: {
        options: true
      },
    });

    if (!questions || questions.length === 0) {
      return NextResponse.json({ message: "Questions not found." }, { status: 404 });
    }

    return NextResponse.json({ questions });
  } catch (error) {
    console.error("Error fetching question:", error);
    return NextResponse.json({ message: "Error fetching question data." }, { status: 500 });
  }
}
