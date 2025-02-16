import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Updated schema to validate multiple questions
const quizSchema = z.object({
  questions: z
    .array(
      z.object({
        question: z.string().min(1, { message: "Question text is required" }),
        options: z
          .array(z.string().min(1, { message: "Option text is required" }))
          .min(2, { message: "At least 2 options are required" }),
        correctAnswer: z.string().min(1, { message: "Correct answer is required" }),
        index: z.number(),
      })
    )
    .min(1, { message: "At least one question is required" }),
});

export const POST = async (req: NextRequest, { params }: { params: { testId: string } }) => {
  const { testId } = params;
  console.log("Received Test ID:", testId);  // Log testId to check

  const body = await req.json();
  console.log("Request body:", body);  // Log the request body to inspect

  // Validate the request body using Zod
  const parsedData = quizSchema.safeParse(body);
  if (!parsedData.success) {
    console.error("Validation failed:", parsedData.error.errors);  // Log Zod validation errors
    return NextResponse.json({
      error: parsedData.error.errors.map((err) => ({
        message: err.message,
        path: err.path,
      })),
    }, { status: 400 });
  }

  const { questions } = parsedData.data;

  try {
    const user = await auth();
    console.log("Authenticated user:", user);  // Log user to check auth
    if (!user || !user.user.id) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const creatorId = Number(user.user.id);
    console.log("Creator ID:", creatorId);  // Log creatorId to ensure it's a valid number
    if (!creatorId) {
      return NextResponse.json({ error: "Invalid creator ID!" }, { status: 400 });
    }

    // Check if the testId exists in the database
    const testExists = await prisma.test.findUnique({
      where: { id: testId },
    });

    if (!testExists) {
      return NextResponse.json({ error: "Test not found!" }, { status: 404 });
    }

    // Create questions and options
    const createdQuestions = await Promise.all(
      questions.map(async (q) => {
        const createdQuestion = await prisma.question.create({
          data: {
            question: q.question,
            correctAnswer: q.correctAnswer,
            creatorId,
            testId,
          },
        });

        const createdOptions = await prisma.option.createMany({
          data: q.options.map((opt) => ({
            text: opt,
            questionId: createdQuestion.id,  // Use the created question's ID
          })),
        });

        return createdQuestion;
      })
    );

    console.log("Questions: ", createdQuestions)

    return NextResponse.json({
      message: "Questions created successfully!",
      createdQuestions,
    });
  } catch (err) {
    console.error("[courses_POST]", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
