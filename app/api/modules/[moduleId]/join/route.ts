import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(req: Request,
  { params } : { params: { moduleId: string }}
) {
  const { moduleId } = params;
  try {
    const moduleData = await prisma.module.findUnique({
      where: { id: moduleId },
    });

    if (!moduleData) {
      return NextResponse.json(
        { message: "Module not found!" },
        { status: 404 }
      );
    }

    const user = await auth();

    if (!user || !user.user.id) {
      return NextResponse.json(
        { message: "Unauthorized: No user found." },
        { status: 401 }
      );
    }
    const studentId = user?.user.id;

    const existingJoin = await prisma.joined.findUnique({
      where: {
        studentId_moduleId: {
          studentId: Number(studentId),
          moduleId: moduleData.id,
        },
      },
    });

    if (existingJoin) {
      return NextResponse.json(
        { message: "You are already enrolled in this module" },
        { status: 400 }
      );
    }

    await prisma.joined.create({
      data: {
        studentId: Number(studentId),
        moduleId: moduleData.id,
      },
    });

    // Return the module ID to the frontend
    return NextResponse.json(
      { message: "Successfully joined the module.", moduleId: moduleData.id },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error joining module:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request, { params }: { params: { moduleId: string } }) {
  const { moduleId } = params;
  const user = await auth();
  const userId = user?.user.id;

  if (!moduleId || !userId) {
    return NextResponse.json({ hasJoined: false }, { status: 400 });
  }

  try {
    // Check if the user has joined the module
    const joined = await prisma.joined.findFirst({
      where: {
        studentId: Number(userId),
        moduleId: moduleId
      },
    });

    return NextResponse.json({ hasJoined: !!joined });
  } catch (error) {
    console.error("Error checking join status:", error);
    return NextResponse.json({ message: "Error checking join status" }, { status: 500 });
  }
}

