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
        setIsLessonCompleted(true); // Update state
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
    <div className="flex flex-col items-center pt-10 h-screen p-4 dark:bg-slate-800 dark:text-white">
      <div className="flex flex-col items-center justify-center text-center">
        <Image width={300} height={300} src="/three-stars.png" alt="Stars" />
        <h1 className="text-2xl md:text-3xl font-bold text-center dark:text-white">
          Congratulations! Lesson Completed!
        </h1>
        <p className="mt-4 text-md text-slate-600 dark:text-slate-300">
          You’re one step closer to reaching your goal!
        </p>
        <p className="mt-2 text-md text-slate-600 dark:text-slate-300">Well done!</p>

        {!isLessonCompleted && (
          <div className="flex flex-row items-center gap-2 p-4">
            <Image width={50} height={50} src="/star.png" alt="Stars" />
            <p className="text-slate-600 dark:text-slate-300">+10 points</p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-center p-8 bg-white shadow-lg fixed bottom-0 left-0 right-0 z-10 dark:bg-slate-900">
        <Button
          onClick={completeLesson}
          className="w-60 text-white bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default LessonCompletion;