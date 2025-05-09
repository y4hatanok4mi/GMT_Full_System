"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import { toast } from "react-hot-toast";

interface LessonCompletionProps {
  params: {
    moduleId: string;
    lessonId: string;
  };
}

const LessonCompletion = ({ params }: LessonCompletionProps) => {
  const { moduleId, lessonId } = params;
  const router = useRouter();
  const [isLessonCompleted, setIsLessonCompleted] = useState(false);

  useEffect(() => {
    const fetchLessonStatus = async () => {
      try {
        const response = await axios.get(
          `/api/modules/${moduleId}/lessons/${lessonId}/status`
        );
        setIsLessonCompleted(response.data.isCompleted);
      } catch (error) {
        console.error("Error fetching lesson status:", error);
      }
    };

    fetchLessonStatus();
  }, [moduleId, lessonId]);

  const checkAndCompleteModule = async () => {
    try {
      const lessonsResponse = await axios.get(
        `/api/modules/${moduleId}/get-complete-lessons`
      );

      const lessons = lessonsResponse.data;
      const allLessonsCompleted = lessons.every(
        (lesson: any) => lesson.isCompleted
      );

      if (allLessonsCompleted && lessons.length > 0) {
        await axios.post(`/api/modules/${moduleId}/complete`);
        toast.success("Module completed! 🎉");
      }
    } catch (error) {
      console.error("Error checking module completion:", error);
    }
  };

  const completeLesson = async () => {
    try {
      const response = await axios.post(
        `/api/modules/${moduleId}/lessons/${lessonId}/progress`,
        { isCompleted: true }
      );

      if (response.status === 200) {
        setIsLessonCompleted(true);
        await checkAndCompleteModule();
      } else {
        throw new Error("Failed to complete lesson");
      }

      router.push(`/student/modules/${moduleId}/overview`);
    } catch (error) {
      console.error("Error completing lesson:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen p-4 bg-slate-100 dark:bg-slate-800 dark:text-white">
      <div className="flex-grow flex flex-col items-center justify-center text-center">
        <div className="w-full max-w-xs sm:max-w-sm md:max-w-md">
          <Image
            src="/three-stars.png"
            alt="Stars"
            width={200}
            height={200}
            className="h-auto mx-auto mb-6"
          />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          Congratulations! Lesson Completed!
        </h1>
        <p className="mt-2 text-base sm:text-lg text-slate-600 dark:text-slate-300">
          You’re one step closer to reaching your goal!
        </p>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300">
          Well done!
        </p>

        {!isLessonCompleted && (
          <div className="flex items-center gap-2 mt-4">
            <Image src="/star.png" alt="Stars" width={40} height={40} />
            <p className="text-slate-600 dark:text-slate-300">+10 points</p>
          </div>
        )}
      </div>

      <div className="w-full p-4 bg-white shadow-lg dark:bg-slate-900">
        <div className="max-w-md mx-auto">
          <Button
            onClick={completeLesson}
            className="w-full text-white bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LessonCompletion;