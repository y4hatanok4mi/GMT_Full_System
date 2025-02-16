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
      where: { id:moduleId },
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