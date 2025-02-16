import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, { params }: { params: { moduleId: string } }) => {
  try {
    const moduleId = params.moduleId;
    const user = await auth();
    const userId = user?.user.id;

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Fetch the module data along with students who joined
    const moduleData = await prisma.module.findUnique({
      where: { id: moduleId },
      include: {
        joined: {
          include: {
            student: {
              select: { id: true, name: true, email: true, school: true },
            },
          },
        },
      },
    });

    if (!moduleData) {
      return NextResponse.json({ message: "Module not found" }, { status: 404 });
    }

    // Fetch completion status for the current user and module
    const completedModules = await prisma.completedModule.findMany({
      where: { moduleId: moduleId, userId: Number(userId) },
    });

    // Map students with completion status
    const students = await Promise.all(
      moduleData.joined.map(async (join) => {
        const studentCompleted = completedModules.some(
          (completedModule) => completedModule.userId === join.student.id
        );

        return {
          id: join.student.id,
          name: join.student.name,
          email: join.student.email,
          school: join.student.school,
          completed: studentCompleted, // If the student has completed the module
        };
      })
    );

    return NextResponse.json(
      { message: "Module fetched successfully!", students },
      { status: 200 }
    );
  } catch (err) {
    console.error("[MODULE_GET]", err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
};
