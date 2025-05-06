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

    if (!id) {
      return new Response("Unauthorized", { status: 401 });
    }

    const question = await prisma.question.findUnique({
      where: { id: questionId },
      include: { options: true },
    });

    if (!question) {
      return new Response("Question not found!", { status: 404 });
    }

    if (!question.question || !question.options) {
      return new NextResponse("Missing required fields!", { status: 400 });
    }

    const publishedQuestion = await prisma.question.update({
      where: { id: questionId },
      data: { isPublished: true },
    });

    return NextResponse.json(publishedQuestion, { status: 200 });
  } catch (err) {
    console.log("[questionId_publish_POST]", err);
    return new Response("Internal Server Error", { status: 500 });
  }
};
