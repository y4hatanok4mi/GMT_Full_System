import { auth } from "@/auth";
import CertificateForm from "@/components/modules/certificate-form";
import { ModuleLessons } from "@/components/modules/module-overview";
import { Progress } from "@/components/ui/progress";
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import React from "react";

const ModuleOverviewPage = async ({
  params,
}: {
  params: { moduleId: string };
}) => {
  const user = await auth();
  const userId = user?.user.id;
  const userName = user?.user.name;

  if (!userName) return notFound();
  if (!userId) return redirect("/auth/signin");

  const moduleId = params.moduleId;

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

  return (
    <div className="flex flex-col items-center px-4 py-6 mt-16 bg-slate-50 dark:bg-gray-900 text-black dark:text-white min-h-screen">
      <div className="w-full max-w-4xl space-y-6">
        {/* Progress Bar */}
        <div className="w-full">
          <h2 className="text-lg font-semibold mb-2">Module Progress</h2>
          <Progress value={progressPercentage} className="h-2 w-full" />
          <p className="text-sm mt-2 text-gray-700 dark:text-gray-300 text-right">
            {Math.round(progressPercentage)}% completed
          </p>
        </div>

        {/* Lessons */}
        <div className="w-full">
          <ModuleLessons currentUserId={userId} module={moduleData} />
        </div>

        {/* Certificate */}
        <div className="w-full">
          <CertificateForm
            userName={userName}
            moduleName={moduleData.name}
            moduleId={moduleId}
          />
        </div>
      </div>
    </div>
  );
};

export default ModuleOverviewPage;
