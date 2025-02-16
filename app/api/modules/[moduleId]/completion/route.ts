import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { moduleId: string } }) {
  try {
    const user = await auth();
    const userId = user?.user.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if the module is marked as completed for the user
    const completion = await prisma.completedModule.findUnique({
      where: { userId_moduleId: { userId: Number(userId), moduleId: params.moduleId } },
    });

    return NextResponse.json({ isCompleted: !!completion });
  } catch (error) {
    console.error("Error fetching module completion status:", error);
    return NextResponse.json({ error: "Failed to fetch completion status" }, { status: 500 });
  }
}
