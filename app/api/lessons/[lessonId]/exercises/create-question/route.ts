import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { auth } from "@/auth";

// Define schema for validating the request body
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
        id: z.string().optional(), // Added optional `id` field to track existing question
      })
    )
    .min(1, { message: "At least one question is required" }),
});

export async function POST(request: NextRequest, { params }: { params: { testId: string } }): Promise<NextResponse> {
  const { testId } = params;
  const body = await request.json();

  // Validate the input data using Zod schema
  const parsedData = quizSchema.safeParse(body);
  if (!parsedData.success) {
    return NextResponse.json({ error: parsedData.error.errors.map(err => err.message) }, { status: 400 });
  }

  const { questions } = parsedData.data;

  try {
    // Authenticate user
    const user = await auth();
    if (!user || !user.user.id) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    // Check if the user is an instructor or admin
    if (user.user.role !== "admin" && user.user.role !== "instructor") {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
    }

    const creatorId = Number(user.user.id);
    if (isNaN(creatorId)) {
      return NextResponse.json({ error: "Invalid creator ID" }, { status: 400 });
    }

    // Check if the test exists
    const test = await prisma.test.findUnique({
      where: { id: testId },
    });
    if (!test) {
      return NextResponse.json({ error: "Test not found" }, { status: 404 });
    }

    // Create options in the database
    const createdOptions = await prisma.option.createMany({
        data: questions.flatMap(question =>
          question.options.map(option => ({
            text: option,
            questionId: testId, // Associate options with the question
          }))
        ),
      });
      // Fetch options by text to connect them to the new question
    const optionsWithIds = await prisma.option.findMany({
        where: {
          questionId: testId, // Ensure we fetch options for this specific question
          text: {
            in: questions.flatMap(question => question.options), // Match options based on text
          },
        },
      });
      // Create the question and connect the options using their ids
      const newQuestions = await Promise.all(
        questions.map(async ({ question, correctAnswer, options }) => {
          const correctOption = options.find(option => option === correctAnswer);
          const newQuestion = await prisma.question.create({
            data: {
              question,
              testId,
              creatorId,
              correctAnswer, // Store the correct answer as text
              options: {
                connect: optionsWithIds.filter(option => options.includes(option.text)).map(option => ({ id: option.id })),
              },
            },
          });
          return newQuestion;
        })
      );
      
      return NextResponse.json({ questions: newQuestions, message: "Questions created successfully" }, { status: 201 });
    } catch (error: any) {
      console.error("Failed to create questions:", error.message);
      return NextResponse.json(
        { error: "Something went wrong while creating the question" },
        { status: 500 }
      );
    }
}
