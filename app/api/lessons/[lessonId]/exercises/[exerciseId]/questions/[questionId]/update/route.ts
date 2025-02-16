import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function PUT(request: NextRequest, { params }: { params: { courseId: string; exerciseId: string; questionId: string } }) {
    const { courseId, exerciseId, questionId } = params;
    const { question, options, correctAnswer } = await request.json();  // Assume these are the fields you want to update

    try {
      const quiz = await prisma.test.findUnique({
        where: { id: exerciseId, courseId: courseId },
      });

      if (!quiz) {
        return NextResponse.json({ error: "Quiz not found!" }, { status: 404 });
      }

      // Get the existing question
      const existingQuestion = await prisma.question.findUnique({
        where: { id: questionId },
        include: { options: true }, // Include the existing options
      });

      if (!existingQuestion) {
        return NextResponse.json({ error: "Question not found!" }, { status: 404 });
      }

      // Prepare options updates (upsert logic)
      const upsertOptions = options.map((optionText: string, idx: number) => ({
        where: { id: existingQuestion.options[idx]?.id },  // If the option exists, update it
        update: { text: optionText },
        create: { text: optionText, questionId: questionId },  // If the option doesn't exist, create it
      }));

      // Now update the question
      const updatedQuestion = await prisma.question.update({
        where: { id: questionId },
        data: {
          question,         // Update question text
          correctAnswer,    // Update correct answer
          options: {
            upsert: upsertOptions,  // Handle options update
          },
        },
      });

      return NextResponse.json({ updatedQuestion });
    } catch (error) {
      console.error("Failed to update question:", error);
      return NextResponse.json({ error: "Something went wrong while updating the question" }, { status: 500 });
    }
}
