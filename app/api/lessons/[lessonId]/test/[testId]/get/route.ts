import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, { params }: { params: { courseId: string, testId: string } }) => {
  const { courseId, testId } = params;

  try {
    // Fetch the test and its associated questions and options from the database
    const test = await prisma.test.findUnique({
      where: { id: testId },
      include: {
        questions: {
          include: {
            options: true, // Ensure options are included
          },
        },
      },
    });
    console.log(test)

    if (!test) {
      return NextResponse.json({ error: "Test not found" }, { status: 404 });
    }

    // Format the questions and their options
    const formattedQuestions = test.questions.map((question) => ({
      id: question.id, // Add question id
      question: question.question,
      options: question.options.map((option) => option.text), // Ensure options are mapped correctly
      correctAnswer: question.correctAnswer,
    }));
    console.log("API format: ", formattedQuestions)

    return NextResponse.json({ ...test, questions: formattedQuestions });
  } catch (err) {
    console.error("Error fetching test:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
