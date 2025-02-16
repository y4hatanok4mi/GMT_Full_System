import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";  // Import Prisma client

// POST API to save exercise result after each attempt
export async function POST(request: Request) {
  try {
    const { studentId, lessonId, score, attempt } = await request.json();

    // Ensure all required data is present
    if (!studentId || !lessonId || score === undefined || attempt === undefined) {
      return NextResponse.json({ message: "Missing required fields." }, { status: 400 });
    }

    // Fetch the latest exercise result for the student
    console.log("Fetching the latest exercise result for user:", { studentId, lessonId });
    const latestResult = await prisma.exerciseResult.findFirst({
      where: {
        studentId: Number(studentId),
        lessonId,
      },
      orderBy: {
        attempt: "desc",
      },
    });

    if (!latestResult) {
      console.log("No exercise results found for user:", { studentId, lessonId });

      // Create a new exercise result if none exists
      console.log("Creating a new exercise result for user:", { studentId, lessonId });
      const newResult = await prisma.exerciseResult.create({
        data: {
          studentId: Number(studentId),
          lessonId,
          score: 0, // Default score, can be updated later
          attempt: 1, // First attempt
          isPassed: false, // Default to false, can be updated later
        },
      });

      console.log("New exercise result created:", newResult);

      return NextResponse.json({ message: "No previous result found, created a new exercise result.", result: newResult }, { status: 201 });
    } else {
      // Increment the attempt count and create a new exercise result
      console.log("Creating a new attempt based on the latest result:", latestResult);
      const newAttempt = await prisma.exerciseResult.create({
        data: {
          studentId: Number(studentId),
          lessonId,
          score: 0, // Default score
          attempt: latestResult.attempt + 1, // Increment attempt
          isPassed: false, // Default to false, can be updated later
        },
      });

      console.log("New attempt created:", newAttempt);

      return NextResponse.json({ message: "New attempt created.", result: newAttempt }, { status: 201 });
    }
  } catch (error) {
    console.error("Error creating exercise result:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
