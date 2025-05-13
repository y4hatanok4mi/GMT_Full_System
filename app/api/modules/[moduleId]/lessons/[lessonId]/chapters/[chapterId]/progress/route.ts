import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (
  req: NextRequest,
  { params }: { params: { moduleId: string; lessonId: string; chapterId: string } }
) => {
  try {
    const user = await auth();
    const userId = Number(user?.user.id);

    if (!userId) {
      console.log("[ERROR] User not authenticated");
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { isCompleted } = await req.json();

    if (typeof isCompleted !== "boolean") {
      console.log("[ERROR] Invalid isCompleted value:", isCompleted);
      return new NextResponse("Invalid value for isCompleted", { status: 400 });
    }

    const { moduleId, lessonId, chapterId } = params;

    console.log("[INFO] Incoming progress update:");
    console.log("User ID:", userId);
    console.log("Module ID:", moduleId);
    console.log("Lesson ID:", lessonId);
    console.log("Chapter ID:", chapterId);
    console.log("isCompleted:", isCompleted);

    const moduleData = await prisma.module.findUnique({
      where: { id: moduleId },
    });

    if (!moduleData) {
      console.log("[ERROR] Module not found:", moduleId);
      return new NextResponse("Module Not Found", { status: 404 });
    }

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
    });

    if (!lesson || lesson.moduleId !== moduleId) {
      console.log("[ERROR] Lesson not found or mismatched moduleId");
      return new NextResponse("Lesson Not Found", { status: 404 });
    }

    const chapter = await prisma.chapter.findUnique({
      where: { id: chapterId },
    });

    if (!chapter || chapter.lessonId !== lessonId) {
      console.log("[ERROR] Chapter not found or mismatched lessonId");
      return new NextResponse("Chapter Not Found", { status: 404 });
    }

    // Find or create chapterProgress
    let progress;
    try {
      progress = await prisma.chapterProgress.upsert({
        where: {
          userId_chapterId: {
            userId,
            chapterId,
          },
        },
        update: {
          isCompleted,
        },
        create: {
          userId,
          chapterId,
          isCompleted,
        },
      });
    } catch (e) {
      console.error("[ERROR] Failed to upsert chapterProgress:", e);
      return new NextResponse("Database Error", { status: 500 });
    }

    console.log("[SUCCESS] Chapter progress updated:", progress);

    return NextResponse.json(progress, { status: 200 });
  } catch (err) {
    console.error("[chapterId_progress_POST] Internal error:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
