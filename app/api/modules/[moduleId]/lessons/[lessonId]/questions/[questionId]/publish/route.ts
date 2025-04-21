/* import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (
  req: NextRequest,
  { params }: { params: { exerciseId: string } }
) => {
  try {
    const user = await auth();
    const id = user?.user.id;
    const { exerciseId } = params;

    if (!id) {
      return new Response("Unauthorized", { status: 401 });
    }

    const exercise = await prisma.exercise.findUnique({
      where: { id: exerciseId,},
      include: {
        questions: {
        },
      },
    });

    if (!exercise) {
      return new Response("Lesson not found!", { status: 404 });
    }

    if (
      !exercise.title
    ) {
      return new NextResponse("Missing required fields!", { status: 400 });
    }

    const publishedExercise = await prisma.exercise.update({
      where: { id: exerciseId },
      data: { isPublished: true },
    });

    return NextResponse.json(publishedExercise, { status: 200 });
  } catch (err) {
    console.log("[exerciseId_publish_POST]", err);
    return new Response("Internal Server Error", { status: 500 });
  }
};
 */