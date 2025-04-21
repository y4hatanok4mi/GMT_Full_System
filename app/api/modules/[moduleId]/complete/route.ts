import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest, { params }: { params: { moduleId: string } }) => {
  try {
    const { moduleId } = params;
    const user = await auth();
    const userIdString = user?.user.id;

    if (!userIdString) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(userIdString);
    if (isNaN(userId)) {
      return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });
    }

    // ✅ Count total number of lessons in this module
    const totalLessons = await prisma.lesson.count({
      where: { moduleId },
    });

    // ✅ Count completed lessons for the user in this module
    const completedLessons = await prisma.lessonProgress.count({
      where: {
        userId,
        isCompleted: true,
        lesson: {
          moduleId,
        },
      },
    });

    // ✅ Check if all lessons in the module are completed
    if (completedLessons === totalLessons && totalLessons > 0) {
      // ✅ Check if the module is already marked completed
      const existingCompletedModule = await prisma.completedModule.findUnique({
        where: {
          userId_moduleId: {
            userId,
            moduleId,
          },
        },
      });

      if (!existingCompletedModule) {
        // ✅ Insert a record into CompletedModule
        await prisma.completedModule.create({
          data: { userId, moduleId },
        });

        return NextResponse.json({ message: "Module marked as completed for this user." }, { status: 200 });
      } else {
        return NextResponse.json(
          { message: "Module already marked as completed for this user." },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      {
        error: "Not all lessons in the module are completed.",
        completedLessons,
        totalLessons,
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error marking module as complete:", error);
    return NextResponse.json({ error: "Failed to mark module as complete" }, { status: 500 });
  }
};
