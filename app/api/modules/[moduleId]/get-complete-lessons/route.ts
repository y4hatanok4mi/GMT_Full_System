import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth"; // Ensure authentication

export async function GET(req: Request, { params }: { params: { moduleId: string } }) {
  try {
    const user = await auth();
    const userIdString = user?.user.id;

    if (!userIdString) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(userIdString);
    if (isNaN(userId)) {
      return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });
    }

    const { moduleId } = params;

    // Fetch all lessons in the module, including their completion status for the user
    const lessons = await prisma.lesson.findMany({
      where: {
        moduleId,
        isPublished: true,
      },
      select: {
        id: true,
        isPublished: true,
        progress: {
          where: { userId },
          select: { isCompleted: true },
        },
      },
    });

    // Format response to include `isCompleted`
    const formattedLessons = lessons.map((lesson) => ({
      id: lesson.id,
      isPublished: lesson.isPublished,
      isCompleted: lesson.progress.length > 0 ? lesson.progress[0].isCompleted : false,
    }));

    return NextResponse.json(formattedLessons, { status: 200 });
  } catch (error) {
    console.error("Error fetching lessons:", error);
    return NextResponse.json({ error: "Failed to fetch lessons" }, { status: 500 });
  }
}
