import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest, { params }: { params: { moduleId: string } }) => {
  try {
    const { moduleId } = params;
    const user = await auth();
    const userId = user?.user.id;

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Count total number of lessons in this module
    const totalLessons = await prisma.lesson.count({
      where: { 
        moduleId,
        isPublished: true
      },
    });

    console.log("Total lessons in module:", totalLessons);

    // Count completed lessons for the user in this module
    const completedLessons = await prisma.lessonProgress.count({
      where: {
        userId: Number(userId),
        isCompleted: true,
        lesson: {
          moduleId,
        },
      },
    });

    console.log("Completed lessons for user:", completedLessons);

    // Check if all lessons in the module are completed
    if (completedLessons === totalLessons && totalLessons > 0) {
      // Check if the module is already marked completed
      const existingCompletedModule = await prisma.completedModule.findUnique({
        where: {
          userId_moduleId: {
            userId: Number(userId),
            moduleId,
          },
        },
      });

      if (!existingCompletedModule) {
        // Insert a record into CompletedModule
        await prisma.completedModule.create({
          data: { 
            userId: Number(userId), 
            moduleId 
          },
        });

        return NextResponse.json({ message: "Module marked as completed for this user." }, { status: 200 });
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
