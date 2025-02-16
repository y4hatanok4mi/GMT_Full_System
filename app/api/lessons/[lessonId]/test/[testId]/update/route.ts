import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function PUT(request: NextRequest, { params }: { params: { courseId: string; exerciseId: string; questionId: string } }) {
  const { courseId, exerciseId, questionId } = params;
  const { question, options, correctAnswer } = await request.json();  // Assume these are the fields you want to update

  try {
    // Fetch the quiz to ensure it exists
    const quiz = await prisma.test.findUnique({
      where: { id: exerciseId, courseId: courseId },
    });

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found!" }, { status: 404 });
    }

    // Fetch the existing question
    const existingQuestion = await prisma.question.findUnique({
      where: { id: questionId },
      include: { options: true },  // Include options to check existing options
    });

    if (!existingQuestion) {
      return NextResponse.json({ error: "Question not found!" }, { status: 404 });
    }

    // Ensure correctAnswer exists in options
    if (!options.includes(correctAnswer)) {
      return NextResponse.json(
        { error: `Correct answer must be one of the provided options.` },
        { status: 400 }
      );
    }

    // Prepare options update (upsert logic)
    const upsertOptions = options.map((optionText: string, idx: number) => {
      const existingOption = existingQuestion.options[idx];

      return {
        where: { id: existingOption?.id },  // Update existing option if it exists
        update: { text: optionText },
        create: { text: optionText, questionId: questionId },  // Create new option if not found
      };
    });

    // Update the question along with its options
    const updatedQuestion = await prisma.question.update({
      where: { id: questionId },
      data: {
        question,  // Update the question text
        correctAnswer,  // Update the correct answer
        options: {
          upsert: upsertOptions,  // Handle options upsert
        },
      },
    });

    return NextResponse.json({ updatedQuestion });

  } catch (error) {
    console.error("Failed to update question:", error);
    return NextResponse.json({ error: "Something went wrong while updating the question." }, { status: 500 });
  }
}