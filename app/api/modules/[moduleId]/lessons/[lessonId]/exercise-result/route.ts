import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(req: NextRequest, { params }: { params: { moduleId: string, lessonId: string } }) {
  try {
    const { moduleId, lessonId } = params;
    console.log("Request received for lesson exercise result:", { moduleId, lessonId });

    // Authenticate user
    const user = await auth();
    const userId = user?.user.id;
    console.log("Authenticated user:", { userId });

    if (!userId || !lessonId) {
      console.log("Missing required parameters:", { userId, lessonId });
      return NextResponse.json({ error: "Missing studentId or lessonId." }, { status: 400 });
    }

    // Fetch the number of questions associated with the lesson
    const questionCount = await prisma.question.count({
      where: {
        lessonId: lessonId,
      },
    });

    if (questionCount === 0) {
      console.log("No questions found for the lesson:", { lessonId });
      return NextResponse.json({ error: "No questions found for this lesson." }, { status: 404 });
    }

    const PASSING_SCORE = questionCount * 0.60; // 60% of the total score (based on the number of questions)

    // Fetch the latest exercise result for the student
    console.log("Fetching the latest exercise result for user:", { userId, lessonId });
    const exerciseResults = await prisma.exerciseResult.findMany({
      where: {
        studentId: Number(userId),
        lessonId,
      },
      orderBy: {
        attempt: "desc",  // Get the latest attempt
      },
      take: 1,  // Only the latest result
    });

    if (!exerciseResults || exerciseResults.length === 0) {
      console.log("No exercise results found for user:", { userId, lessonId });
      return NextResponse.json({ message: "No exercise result found for this lesson." }, { status: 200 });
    }

    // Format the results
    const latestResult = exerciseResults[0];
    const passed = latestResult.score >= PASSING_SCORE;
    const formattedResult = {
      id: latestResult.id,
      lessonId: latestResult.lessonId,
      attempt: latestResult.attempt,
      score: latestResult.score,
      passed,
      createdAt: latestResult.createdAt,
      updatedAt: latestResult.updatedAt,
    };

    console.log("Formatted result:", formattedResult);
    return NextResponse.json(formattedResult);
  } catch (error) {
    console.error("Error fetching exercise results:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: { moduleId: string, lessonId: string } }) {
  try {
    const { moduleId, lessonId } = params;
    const { score } = await req.json(); // Receive the score from the frontend

    const user = await auth();
    const userId = user?.user.id;

    if (!userId || !lessonId || score === undefined) {
      return NextResponse.json({ error: "Missing required parameters." }, { status: 400 });
    }

    // Get question count for the lesson
    const questionCount = await prisma.question.count({
      where: { lessonId },
    });

    if (questionCount === 0) {
      return NextResponse.json({ error: "No questions found for this lesson." }, { status: 404 });
    }

    const PASSING_SCORE = questionCount * 0.60;

    // Get the latest attempt
    const latestResult = await prisma.exerciseResult.findFirst({
      where: {
        studentId: Number(userId),
        lessonId,
      },
      orderBy: {
        attempt: "desc",
      },
    });

    // CASE 1: No previous result - create the first attempt
    if (!latestResult) {
      const newResult = await prisma.exerciseResult.create({
        data: {
          studentId: Number(userId),
          lessonId,
          score,
          attempt: 1,
          isPassed: score >= PASSING_SCORE,
        },
      });
      return NextResponse.json({ message: "First attempt submitted.", newResult });
    }

    // CASE 2: Previous result exists and was failed - update same attempt
    if (!latestResult.isPassed) {
      const updatedResult = await prisma.exerciseResult.update({
        where: { id: latestResult.id },
        data: {
          score,
          isPassed: true,
          updatedAt: new Date(),
        },
      });
      return NextResponse.json({ message: "Failed attempt updated.", updatedResult });
    }
  } catch (error) {
    console.error("Error submitting or updating exercise result:", error);
    return NextResponse.json({ error: "Failed to process exercise result" }, { status: 500 });
  }
}

