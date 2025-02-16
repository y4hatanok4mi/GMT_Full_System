import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: { moduleId: string; lessonId: string; questionId: string; optionId: string } }) {
  try {
    const { optionId } = params;
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required." }, { status: 400 });
    }

    const updatedOption = await prisma.option.update({
      where: { id: optionId },
      data: { text },
    });

    return NextResponse.json(updatedOption);
  } catch (error) {
    console.error("Error updating option:", error);
    return NextResponse.json({ error: "Failed to update option." }, { status: 500 });
  }
}