import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: { questionId: string } }) {
  const { questionId } = params;

  try {
    const question = await prisma.question.findUnique({
      where: { id: questionId },
      include: {
        options: true
      },
    });

    if (!question) {
      return NextResponse.json({ message: "Question not found." }, { status: 404 });
    }

    return NextResponse.json(question);
  } catch (error) {
    console.error("Error fetching question:", error);
    return NextResponse.json({ message: "Error fetching question data." }, { status: 500 });
  }
}