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
    const latestResult = await prisma.exerciseResult.findFirst({
      where: {
        studentId: Number(userId),
        lessonId,
      },
      orderBy: {
        attempt: "desc",
      },
    });

    if (!latestResult) {
      console.log("No exercise results found for user:", { userId, lessonId });
      return NextResponse.json({ message: "No exercise result found for this lesson." }, { status: 200 });
    }

    const passed = latestResult.score >= PASSING_SCORE;
    console.log("Latest exercise result found:", {
      id: latestResult.id,
      score: latestResult.score,
      attempt: latestResult.attempt,
      passed,
    });

    // Format the response
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
    console.error("Error fetching latest exercise result:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}