import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (
  req: NextRequest,
  { params }: { params: { moduleId: string } }
) => {
  try {
    const user = await auth();
    const id = user?.user.id;
    const { moduleId } = params;

    if (!id) {
      return new Response("Unauthorized", { status: 401 });
    }

    const module = await prisma.module.findUnique({
      where: { id: moduleId, instructorId: id },
    });

    if (!module) {
      return new Response("Module not found", { status: 404 });
    }

    const unpusblishedModule = await prisma.module.update({
      where: { id: moduleId, instructorId: id },
      data: { isPublished: false },
    });

    return NextResponse.json(unpusblishedModule, { status: 200 });
  } catch (err) {
    console.log("[moduleId_unpublish_POST]", err);
    return new Response("Internal Server Error", { status: 500 });
  }
};