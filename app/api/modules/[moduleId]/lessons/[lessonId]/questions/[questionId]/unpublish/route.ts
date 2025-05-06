import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (
  req: NextRequest,
  { params }: { params: { questionId: string } }
) => {
  try {
    const user = await auth();
    const id = user?.user.id;
    const { questionId } = params;
    console.log("questionId", questionId);

    if (!id) {
      return new Response("Unauthorized", { status: 401 });
    }

    const question = await prisma.question.findUnique({
      where: { id: questionId },
    });

    if (!question) {
      return new Response("Question not found", { status: 404 });
    }

    const unpusblishedQuestion = await prisma.question.update({
      where: { id: questionId },
      data: { isPublished: false },
    });

    return NextResponse.json(unpusblishedQuestion, { status: 200 });
  } catch (err) {
    console.log("[questionId_unpublish_POST]", err);
    return new Response("Internal Server Error", { status: 500 });
  }
};