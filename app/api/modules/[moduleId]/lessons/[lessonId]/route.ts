import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: Request, { params }: { params: { lessonId: string } }) {
  const { lessonId } = params;

  try {
    // Fetch lesson data using Prisma
    const lessonData = await prisma.lesson.findUnique({
      where: { 
        id: lessonId 
      },
      include: {
        chapter: true,
      },
    });

    if (!lessonData) {
      return NextResponse.json({ message: "Lesson not found" }, { status: 404 });
    }

    return NextResponse.json(lessonData);
  } catch (error) {
    console.error("Error fetching lesson:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(
    req: Request,
    { params } : { params: { lessonId: string }}
) {
    try {
        const user = await auth();
        const { lessonId } = params;
        const values = await req.json();

        if(!user?.user.id) {
            return new NextResponse("Unautorized", { status: 401 });
        }

        const lessons = await prisma.lesson.update({
            where: {
                id: lessonId,
                instructorId: user.user.id
            },
            data: {
                ...values,
            }
        });

        return NextResponse.json(lessons); 
    } catch (error) {
        console.log("LESSON_ID", error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export const PUT = async (req: NextRequest, { params }: { params: { moduleId: string; lessonId: string } }) => {
  try {
    const { moduleId, lessonId } = params;
    const { isCompleted } = await req.json();

    const updatedLesson = await prisma.lessonProgress.update({
      where: { 
        id: lessonId 
      },
      data: { 
        isCompleted 
      }
    });

    return NextResponse.json({ message: "Lesson updated successfully", updatedLesson }, { status: 200 });
  } catch (err) {
    console.error("[LESSON_PUT]", err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
};

export const DELETE = async (
  req: NextRequest,
  { params }: { params: { lessonId: string } }
) => {
  try {
    const user = await auth();
    const userId = user?.user.id;
    const { lessonId } = params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const lessonData = await prisma.lesson.findUnique({
      where: { id: lessonId, instructorId: userId },
      include: {
        chapter: {
        }
      }
    });

    if (!lessonData) {
      return new NextResponse("Lesson not found!", { status: 404 });
    }

    await prisma.lesson.delete({
      where: { id: lessonId, instructorId: userId },
    });

    return new NextResponse("Lesson Deleted!", { status: 200 });
  } catch (err) {
    console.error(["lessonId_DELETE", err]);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};