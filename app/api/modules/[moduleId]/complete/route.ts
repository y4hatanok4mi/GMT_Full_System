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

    // ✅ Fetch total number of lessons assigned to the user in LessonOrder
    const totalOrderedLessons = await prisma.lessonOrder.count({
      where: { moduleId, userId },
    });

    const completedOrderedLessons = await prisma.lessonOrder.count({
      where: {
        moduleId,
        userId,
        lesson: {
          progress: {
            some: {
              userId,
              isCompleted: true,
            },
          },
        },
      },
    });

    // ✅ Check if all assigned lessons are completed
    if (completedOrderedLessons === totalOrderedLessons && totalOrderedLessons > 0) {
      // ✅ Check if the module is already completed for the user
      const existingCompletedModule = await prisma.completedModule.findUnique({
        where: {
          userId_moduleId: {
            userId,
            moduleId,
          },
        },
      });

      if (!existingCompletedModule) {
        // ✅ Insert record into CompletedModule table
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
        error: "Not all assigned lessons are completed.",
        completedOrderedLessons,
        totalOrderedLessons,
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error marking module as complete:", error);
    return NextResponse.json({ error: "Failed to mark module as complete" }, { status: 500 });
  }
};
