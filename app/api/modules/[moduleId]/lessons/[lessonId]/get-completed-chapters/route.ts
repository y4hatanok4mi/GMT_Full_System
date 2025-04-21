import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET(request: Request, { params }: { params: { moduleId: string, lessonId: string } }) {
  const user = await auth();
  const userId = user?.user.id;
  
  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const { moduleId, lessonId } = params;
    
    const totalChapters = await prisma.chapter.count({
      where: {
        lessonId: lessonId,
      },
    });

    const completedChapters = await prisma.chapterProgress.count({
      where: {
        userId: Number(userId),
        isCompleted: true,
        chapter: {
          lessonId: lessonId,
        },
      },
    });

    const isLessonCompleted = completedChapters === totalChapters;

    return NextResponse.json({ completedChapters, totalChapters, isLessonCompleted });
  } catch (error) {
    console.error("Error fetching completed chapters:", error);
    return NextResponse.json({ error: "Failed to fetch completed chapters" }, { status: 500 });
  }
}