import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const publishedModuleCount = await prisma.module.count({
      where: {
        isPublished: true,
      },
    });

    return NextResponse.json({ totalPublishedModules: publishedModuleCount });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch published module count" },
      { status: 500 }
    );
  }
}
