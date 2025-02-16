import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: { lessonId: string } }) {
  const { lessonId } = params;

  try {
    // Count the number of questions for the given lesson
    const questionCount = await prisma.question.count({
      where: { lessonId: lessonId },
    });

    if (questionCount === 0) {
      return NextResponse.json({ message: "Questions not found." }, { status: 404 });
    }

    // Return the question count
    return NextResponse.json({ count: questionCount });
  } catch (error) {
    console.error("Error fetching question count:", error);
    return NextResponse.json({ message: "Error fetching question data." }, { status: 500 });
  }
}
