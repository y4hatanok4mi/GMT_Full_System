import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest, { params }: { params: { courseId: string; exerciseId: string; questionId: string } }) {
    const { courseId, exerciseId, questionId } = params;
  
    try {
      const quiz = await prisma.test.findUnique({
        where: { id: exerciseId, courseId: courseId },
      });
  
      if (!quiz) {
        return NextResponse.json({ error: "Quiz not found!" }, { status: 404 });
      }
  
      await prisma.question.delete({
        where: { id: questionId },
      });
  
      return NextResponse.json({ message: "Question deleted successfully!" });
    } catch (error) {
      console.error("Failed to delete question:", error);
      return NextResponse.json({ error: "Something went wrong while deleting the question" }, { status: 500 });
    }
  }
  