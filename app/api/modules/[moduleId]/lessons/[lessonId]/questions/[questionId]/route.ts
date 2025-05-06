import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

// Fetch the correct answer for a question (GET method)
export async function GET(
  request: Request,
  { params }: { params: { questionId: string } }
) {
  const { questionId } = params;

  try {
    const question = await prisma.question.findUnique({
      where: { id: questionId },
    });

    if (!question) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    return NextResponse.json({ correctAnswer: question.correctAnswer });
  } catch (error) {
    console.error("Error fetching correct answer:", error);
    return NextResponse.json({ error: "Failed to fetch correct answer" }, { status: 500 });
  }
}

// Update the question (PATCH method)
export async function PATCH(
  req: Request,
  { params }: { params: { questionId: string } }
) {
  try {
    const user = await auth();
    const { questionId } = params;
    const values = await req.json();

    if (!user?.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const question = await prisma.question.update({
      where: {
        id: questionId,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(question);
  } catch (error) {
    console.log("QUESTION_ID", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// Delete the question (DELETE method)
export async function DELETE(
  req: Request,
  { params }: { params: { questionId: string } }
) {
  try {
    const user = await auth();
    const { questionId } = params;

    // Ensure the user is authorized to delete the question
    if (!user?.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Delete the question from the database
    const question = await prisma.question.delete({
      where: {
        id: questionId,
      },
    });

    return NextResponse.json({ message: "Question deleted successfully" });
  } catch (error) {
    console.error("Error deleting question:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
