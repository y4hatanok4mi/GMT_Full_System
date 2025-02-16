import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: { moduleId: string; lessonId: string } }) {
  try {
    const { lessonId } = params;
    const { studentId, questionId, selectedOptionId } = await req.json();
    console.log("Student ID:", studentId);
    console.log("Question ID:", questionId);
    console.log("Selected Option ID:", selectedOptionId);

    if (!studentId || !questionId || !selectedOptionId) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    // Fetch the question and its correct answer
    const question = await prisma.question.findUnique({
      where: { id: questionId },
      select: { correctAnswer: true },
    });

    if (!question) {
      return NextResponse.json({ error: "Question not found." }, { status: 404 });
    }

    const isCorrect = question.correctAnswer === selectedOptionId;

    // Save the student's answer
    await prisma.answer.create({
      data: {
        studentId,
        questionId,
        selectedOptionId,
        isCorrect,
      },
    });

    // Fetch the latest attempt for this lesson
    let latestResult = await prisma.exerciseResult.findFirst({
      where: { studentId, lessonId },
      orderBy: { attempt: "desc" }, // Get the most recent attempt
    });

    if (!latestResult) {
      // First attempt if no previous record exists
      latestResult = await prisma.exerciseResult.create({
        data: {
          studentId,
          lessonId,
          attempt: 1,
          score: isCorrect ? 1 : 0, // Initialize with first correct answer
        },
      });
    } else {
      // Update the existing attempt score
      await prisma.exerciseResult.update({
        where: { id: latestResult.id },
        data: {
          score: isCorrect ? { increment: 1 } : undefined, // Increment score if correct
        },
      });
    }

    return NextResponse.json({ message: "Answer submitted successfully.", isCorrect });
  } catch (error) {
    console.error("Error submitting answer:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}