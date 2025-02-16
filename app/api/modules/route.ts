import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const modules = await prisma.module.findMany({
      include: {
        lesson: true,
      },
    });

    return NextResponse.json(modules);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch modules" },
      { status: 500 }
    );
  }
}

export const POST = async (req: NextRequest) => {
  try {
    const user = await auth();
    const userId = user?.user.id;

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { name } = await req.json();
    if (!name || typeof name !== "string") {
      return NextResponse.json({ message: "Missing or invalid required fields!" }, { status: 400 });
    }


    const newModule = await prisma.module.create({
      data: {
        name,
        instructorId: userId,
        isPublished: false,
      },
    });

    return NextResponse.json(
      { message: "Module created successfully!", data: newModule },
      { status: 201 }
    );
  } catch (error) {
    console.error("[modules_POST]", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
};


