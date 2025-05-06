import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (
  req: NextRequest,
  { params }: { params: { moduleId: string } }
) => {
  try {
    const { moduleId } = params;
    const user = await auth();
    const userId = user?.user.id;

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // ✅ Fetch all published lesson IDs in the module
    const publishedLessons = await prisma.lesson.findMany({
      where: { moduleId, isPublished: true },
      select: { id: true },
    });
    const publishedLessonIds = publishedLessons.map((l) => l.id);

    // ✅ Fetch all completed lesson IDs for this user
    const completedLessonProgress = await prisma.lessonProgress.findMany({
      where: {
        userId: Number(userId),
        isCompleted: true,
        lessonId: { in: publishedLessonIds },
      },
      select: { lessonId: true },
    });
    const completedLessonIds = completedLessonProgress.map((lp) => lp.lessonId);

    // ✅ Compare lesson IDs
    const allCompleted = publishedLessonIds.every((id) =>
      completedLessonIds.includes(id)
    );

    console.log("Total lessons:", publishedLessonIds.length);
    console.log("Completed lessons:", completedLessonIds.length);
    console.log("All completed:", allCompleted);

    if (publishedLessonIds.length > 0 && allCompleted) {
      // ✅ Check if already marked completed
      const existingCompletedModule = await prisma.completedModule.findUnique({
        where: {
          userId_moduleId: {
            userId: Number(userId),
            moduleId,
          },
        },
      });

      if (!existingCompletedModule) {
        // ✅ Mark module as completed
        await prisma.completedModule.create({
          data: {
            userId: Number(userId),
            moduleId,
          },
        });

        // ✅ Add 50 points to the user for completing the module
        await prisma.user.update({
          where: { id: Number(userId) },
          data: {
            points: {
              increment: 50, // Add 50 points
            },
          },
        });

        return NextResponse.json(
          { message: "Module marked as completed and 50 points awarded." },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          { message: "Module already marked as completed." },
          { status: 200 }
        );
      }
    }

    return NextResponse.json(
      {
        message: "Not all lessons in the module are completed.",
        completedLessonCount: completedLessonIds.length,
        totalLessons: publishedLessonIds.length,
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error marking module as complete:", error);
    return NextResponse.json(
      { error: "Failed to mark module as complete" },
      { status: 500 }
    );
  }
};
