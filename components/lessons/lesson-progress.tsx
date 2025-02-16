import prisma from "@/lib/prisma";
import { Progress } from "@/components/ui/progress";
import { Lesson } from "@prisma/client";

type LessonProgressProps = {
  lesson: Lesson;
};

const LessonProgress = async ({ lesson }: LessonProgressProps) => {
  const lessonId = lesson.id;

  if (!lessonId) {
    console.warn("lessonData or lessonId is missing");
  } else {
    console.log("Lesson ID:", lessonId);
  }

  const publishedLesson = await prisma.lesson.findMany({
    where: { id: lessonId, isPublished: true },
  });

  const publishedLessonIds = publishedLesson.map((lesson) => lesson.id);

  const completedLessons = await prisma.lessonProgress.count({
    where: {
      lessonId: { in: publishedLessonIds },
      isCompleted: true,
    },
  });

  const progressPercentage = publishedLessonIds.length
    ? (completedLessons / publishedLessonIds.length) * 100
    : 0;

  return (
      <div>
        {/* Progress Bar */}
        <div className="m-2">
          <Progress value={progressPercentage} className="h-2" />
          <p className="text-xs mt-1">
            {Math.round(progressPercentage)}% completed
          </p>
        </div>
      </div>
  );
};

export default LessonProgress;