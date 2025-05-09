"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";

interface LessonRetakeProps {
  params: {
    moduleId: string;
    lessonId: string;
  };
}

const LessonRetake = ({ params }: LessonRetakeProps) => {
  const { moduleId, lessonId } = params;
  const router = useRouter();

  const goBackToLesson = async () => {
    router.push(`/student/modules/${moduleId}/lessons/${lessonId}/chapters`);
  };

  return (
    <div className="flex flex-col min-h-screen p-4 bg-slate-100 dark:bg-slate-800 dark:text-white">
      <div className="flex-grow flex flex-col items-center justify-center text-center">
        <div className="w-full max-w-xs sm:max-w-sm md:max-w-md">
          <Image
            src="/sad-face.png"
            alt="Sad face"
            width={200}
            height={200}
            className="h-auto mx-auto"
          />
        </div>

        <h1 className="mt-6 text-2xl md:text-3xl font-semibold">
          Aww! You failed the lesson exercise.
        </h1>
        <p className="mt-4 text-base text-slate-600 dark:text-slate-300">
          But don&apos;t worry — you can still retake the lesson to review.
        </p>
        <p className="mt-2 text-base text-slate-600 dark:text-slate-300">Fighting!</p>
      </div>

      <div className="w-full p-4 bg-white shadow-lg dark:bg-slate-900">
        <div className="max-w-md mx-auto">
          <Button
            onClick={goBackToLesson}
            className="w-full text-white bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
          >
            Retake Lesson
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LessonRetake;
