import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";

export async function getModuleOverviewData(moduleId: string) {
  const user = await auth();
  const userId = user?.user.id;
  const userName = user?.user.name;

  if (!userName) return notFound();
  if (!userId) return redirect("/auth/signin");

  const moduleData = await prisma.module.findUnique({
    where: { id: moduleId },
    include: {
      lesson: {
        where: { isPublished: true },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!moduleData) return redirect("/student/modules");

  const publishedLessons = moduleData.lesson;
  const publishedLessonIds = publishedLessons.map((lesson) => lesson.id);

  const completedLessons = await prisma.lessonProgress.count({
    where: {
      userId: Number(userId),
      lessonId: { in: publishedLessonIds },
      isLocked: false,
      isCompleted: true,
    },
  });

  const progressPercentage = publishedLessonIds.length
    ? (completedLessons / publishedLessonIds.length) * 100
    : 0;

  return {
    userId,
    userName,
    moduleData,
    progressPercentage,
  };
}
