"use client"

import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { LessonTopBar } from "@/components/layout/lesson-topbar";
import { Progress } from "@/components/ui/progress";
import ReadText from "@/components/read-text-tts";

interface LessonDiscussionProps {
  params: {
    moduleId: string;
    lessonId: string;
    chapterId: string;
  };
  userId: string;
  isCompleted: boolean;
}

const LessonDiscussion = ({ params, userId, isCompleted }: LessonDiscussionProps) => {
  const { moduleId, lessonId, chapterId } = params;
  const [chapters, setChapters] = useState<any[]>([]);
  const [lessonName, setLessonName] = useState<string>("");
  const [currentChapterIndex, setCurrentChapterIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [completedChapters, setCompletedChapters] = useState<number>(0); // Track completed chapters
  const router = useRouter();

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const { data } = await axios.get(
          `/api/modules/${moduleId}/lessons/${lessonId}/getchapters`
        );
        setChapters(data.chapters || []);
      } catch (error) {
        console.error("Error fetching chapters:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchLessonName = async () => {
      try {
        const { data } = await axios.get(`/api/modules/${moduleId}/lessons/${lessonId}/getlesson`);
        setLessonName(data?.lesson?.title || "Lesson Name Not Found");
      } catch (error) {
        console.error("Error fetching lesson name:", error);
      }
    };

    const fetchCompletedChapters = async () => {
      try {
        const { data } = await axios.get(`/api/modules/${moduleId}/lessons/${lessonId}/get-completed-chapters`, {
          params: { userId }
        });
        setCompletedChapters(data.completedChapters || 0);
      } catch (error) {
        console.error("Error fetching completed chapters:", error);
      }
    };

    fetchCompletedChapters();
    fetchChapters();
    fetchLessonName();
  }, [lessonId, moduleId, userId]);

  const goToNextChapter = async () => {
    if (currentChapterIndex < chapters.length - 1) {
      const currentChapter = chapters[currentChapterIndex];
      await axios.post(
        `/api/modules/${moduleId}/lessons/${lessonId}/chapters/${currentChapter.id}/progress`,
        { isCompleted: true }
      );
      setCompletedChapters((prev) => prev + 1); // Update the completed chapters
      setCurrentChapterIndex(currentChapterIndex + 1);
    }
  };

  const completeChapters = async () => {
    try {
      const currentChapter = chapters[currentChapterIndex];
      const { data: userData } = await axios.get("/api/get-current-user");

      const userId = userData?.id;
      if (!userId) {
        console.error("User not authenticated");
        return;
      }

      await axios.post(
        `/api/modules/${moduleId}/lessons/${lessonId}/chapters/${currentChapter.id}/progress`,
        { isCompleted: true }
      );

      if (currentChapterIndex === chapters.length - 1) {
        const { data: existingResult } = await axios.get(
          `/api/modules/${moduleId}/lessons/${lessonId}/get-exercise-result`
        );

        const currentAttempt = existingResult ? existingResult.attempt + 1 : 1;

        await axios.post(`/api/modules/${moduleId}/lessons/${lessonId}/create-attempt`, {
          studentId: userId,
          lessonId: lessonId,
          score: 0,
          attempt: currentAttempt,
        });

        router.push(`/student/modules/${moduleId}/lessons/${lessonId}/exercise`);
      }
    } catch (error) {
      console.error("Error completing lesson:", error);
      alert("An error occurred while completing the lesson.");
    }
  };

  const goToPreviousChapter = () => {
    if (currentChapterIndex > 0) {
      setCurrentChapterIndex(currentChapterIndex - 1);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  // Calculate the progress percentage based on the completed chapters
  const progressPercentage = (completedChapters / chapters.length) * 100;

  return (
    <div className="h-screen flex flex-col">
      {/* Fixed Lesson Top Bar */}
      <LessonTopBar params={params} lessonName={lessonName} />

      {/* Scrollable Content */}
      <div className="flex-grow overflow-y-auto pt-16 pb-20 w-full flex flex-col items-center">
        {/* Progress Bar */}
        <div className="mt-2 w-full sm:w-3/4 md:w-2/3 lg:w-1/2">
          <Progress value={progressPercentage} className="h-2 w-full" />
        </div>

        {/* Main content section */}
        <div className="flex flex-col justify-center items-center p-2 sm:p-4 w-full sm:w-2/3">
          {/* Text content */}
          <div className="text-lg sm:text-2xl text-gray-600 w-full sm:w-2/3">
            <ReadText value={chapters[currentChapterIndex]?.description || "No description provided."} />
          </div>

          {/* Video rendering */}
          {chapters[currentChapterIndex]?.videoUrl && (
            <div className="relative aspect-video mt-2 w-full max-w-2xl">
              {chapters[currentChapterIndex]?.videoUrl.includes("youtube.com") ||
                chapters[currentChapterIndex]?.videoUrl.includes("youtu.be") ? (
                // YouTube video rendering
                <iframe
                  className="w-full h-full rounded-md"
                  src={`https://www.youtube.com/embed/${new URL(chapters[currentChapterIndex]?.videoUrl).searchParams.get("v") || chapters[currentChapterIndex]?.videoUrl.split("/").pop()}`}
                  allowFullScreen
                />
              ) : (
                // Uploaded video rendering
                <video
                  controls
                  className="object-cover rounded-md w-full h-96"
                  src={chapters[currentChapterIndex]?.videoUrl + "?raw=true"} // Force raw playback
                >
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          )}

          {/* Image rendering */}
          {chapters[currentChapterIndex]?.imageUrl && (
            <Image
              width={400}
              height={300}
              src={chapters[currentChapterIndex]?.imageUrl}
              alt={chapters[currentChapterIndex]?.title || "Chapter Image"}
              className="w-full mt-4 rounded-lg"
            />
          )}
        </div>
      </div>

      {/* Fixed Footer */}
      <div className="p-4 bg-white shadow-lg fixed bottom-0 left-0 right-0 z-10">
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
          <Button onClick={goToPreviousChapter} disabled={currentChapterIndex === 0}>
            Previous
          </Button>

          {currentChapterIndex === chapters.length - 1 ? (
            <Button onClick={completeChapters}>Take Exercise</Button>
          ) : (
            <Button onClick={goToNextChapter} disabled={currentChapterIndex === chapters.length - 1}>
              Next
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LessonDiscussion;
