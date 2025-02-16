"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";  // Import Axios

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
    <div className="flex flex-col items-center justify-center mt-10 p-4">
      <div className="flex flex-col items-center justify-center text-center">
        <Image
          width={300}
          height={300}
          src="/sad-face.png"
          alt="Face"
        />
        <h1 className="mt-4 text-2xl">Aww! You failed the lesson exercise.</h1>
        <p className="mt-4 text-md text-slate-600">
          But don&apos;t worry you can still retake the lesson to review.
        </p>
        <p className="mt-2 text-md text-slate-600">Fighting!</p>
      </div>
      <div className="flex items-center justify-center p-8 bg-white shadow-lg fixed bottom-0 left-0 right-0 z-10">
        <Button
          onClick={goBackToLesson} // Trigger the lesson completion and points update
          className="w-60"
        >
          Retake Lesson
        </Button>
      </div>
    </div>
  );
};

export default LessonRetake;