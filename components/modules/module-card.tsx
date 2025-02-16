import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import { Lesson, Module } from "@prisma/client";
import { Check } from "lucide-react";

type ModuleCardProps = {
  module: Module & { lesson: Lesson[] },
  userId: string;
};

const ModuleCard = async ({ module, userId }: ModuleCardProps) => {
  const moduleId = module.id;

  if (!moduleId) {
    console.warn("moduleData or moduleId is missing");
  }

  const instructor = await prisma.user.findUnique({
    where: { id: Number(module.instructorId) },
  });

  const publishedLessons = await prisma.lesson.findMany({
    where: { 
      moduleId: moduleId, 
      isPublished: true 
    },
    orderBy: {
      createdAt: "asc",
    }
  });

  const publishedLessonIds = publishedLessons.map((lesson) => lesson.id);

  const completedLessons = await prisma.lessonProgress.count({
    where: {
      userId: Number(userId),
      lessonId: { 
        in: publishedLessonIds 
      },
      isCompleted: true,
    },
  });

  const progressPercentage = publishedLessonIds.length
    ? (completedLessons / publishedLessonIds.length) * 100
    : 0;

  return (
    <Link
      href={`/student/modules/${moduleId}/overview`}
      className="border rounded-lg cursor-pointer"
    >
      <Image
        src={module.imageUrl ? module.imageUrl : "/image_placeholder.webp"}
        alt={module.name}
        width={500}
        height={300}
        className="rounded-t-xl w-[320px] h-[180px] object-cover"
      />

      {/* Course Info */}
      <div className="px-4 py-3 flex flex-col gap-2 bg-white rounded-b-lg">
        <h2 className="text-lg font-bold hover:[#FDAB04]">{module.name}</h2>

        {/* Instructor and Quarter */}
        <div className="flex flex-col gap-1 justify-between text-sm font-medium">
          {instructor && (
            <div className="flex gap-2 items-center">
              <Image
                src={instructor.image ? instructor.image : "/user.png"}
                alt={instructor.name ? instructor.name : "Instructor photo"}
                width={30}
                height={30}
                className="rounded-full"
              />
              <p>{instructor.name}</p>
            </div>
          )}
        </div>

        {/* Progress Bar or Completed Text */}
        <div>
          {progressPercentage === 100 ? (
            <p className="text-sm mt-1 text-green-500 flex flex-row items-center"> <Check/> Completed</p>
          ) : (
            <>
              <Progress value={progressPercentage} className="h-2" />
              <p className="text-xs mt-1">{Math.round(progressPercentage)}% completed</p>
            </>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ModuleCard;