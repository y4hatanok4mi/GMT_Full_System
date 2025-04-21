import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, { params } : { params: { moduleId: string }}) => {
  try {
    const moduleId = params.moduleId;
    const user = await auth();
    const userId = user?.user.id;

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const moduleData = await prisma.module.findUnique({
      where: { id: moduleId },
    });

    return NextResponse.json(
      { message: "Module fetched successfully!", moduleData },
      { status: 200 }
    );
  } catch (err) {
    console.error("[MODULE_GET]", err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
};

export async function PATCH(
    req: Request,
    { params } : { params: { moduleId: string }}
) {
    try {
        const user = await auth();
        const { moduleId } = params;
        const values = await req.json();

        if(!user?.user.id) {
            return new NextResponse("Unautorized", { status: 401 });
        }

        const modules = await prisma.module.update({
            where: {
                id: moduleId,
                instructorId: user.user.id
            },
            data: {
                ...values,
            }
        });

        return NextResponse.json(modules); 
    } catch (error) {
        console.log("MODULE_ID", error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export const DELETE = async (
    req: NextRequest,
    { params }: { params: { moduleId: string } }
  ) => {
    try {
      const user = await auth();
      const userId = user?.user.id;
      const { moduleId } = params;
  
      if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
      }
  
      const moduleData = await prisma.module.findUnique({
        where: { id: moduleId, instructorId: userId },
        include: {
          lesson: {
          }
        }
      });
  
      if (!moduleData) {
        return new NextResponse("Module not found!", { status: 404 });
      }
  
      await prisma.module.delete({
        where: { id: moduleId, instructorId: userId },
      });
  
      return new NextResponse("Module Deleted!", { status: 200 });
    } catch (err) {
      console.error(["moduleId_DELETE", err]);
      return new NextResponse("Internal Server Error", { status: 500 });
    }
  };
  
/*   export async function POST(req: Request, { params }: { params: { moduleId: string } }) {
    const { moduleId } = params;
  
    try {
      // Fetch all lessons in the module that are published
      const lessons = await prisma.lesson.findMany({
        where: {
          moduleId,
          isPublished: true, // Only consider published lessons
        },
        select: {
          isCompleted: true,
        },
      });
  
      // Check if all published lessons are completed
      const allLessonsCompleted = lessons.every(lesson => lesson.isCompleted);
  
      if (allLessonsCompleted) {
        // If all lessons are completed, mark the module as completed
        await prisma.module.update({
          where: { id: moduleId },
          data: { isCompleted: true },
        });
  
        return NextResponse.json({ message: "Module marked as completed." }, { status: 200 });
      } else {
        // If not all lessons are completed, return an error
        return NextResponse.json({ error: "Not all published lessons are completed." }, { status: 400 });
      }
    } catch (error) {
      console.error("Error marking module as complete:", error);
      return NextResponse.json({ error: "Failed to mark module as complete" }, { status: 500 });
    }
  } */
  
