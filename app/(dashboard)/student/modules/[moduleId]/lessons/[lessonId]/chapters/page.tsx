"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter, useParams } from "next/navigation";
import { LessonTopBar } from "@/components/layout/lesson-topbar";
import { Progress } from "@/components/ui/progress";
import ReadText from "@/components/read-text-tts";

const LessonDiscussion = () => {
  const router = useRouter();
  const params = useParams();
  const { moduleId, lessonId, chapterId } = params as {
    moduleId: string;
    lessonId: string;
    chapterId: string;
  };

  const [chapters, setChapters] = useState<any[]>([]);
  const [lessonName, setLessonName] = useState<string>("");
  const [currentChapterIndex, setCurrentChapterIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [completedChapters, setCompletedChapters] = useState<number>(0);

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
        const { data } = await axios.get(
          `/api/modules/${moduleId}/lessons/${lessonId}/getlesson`
        );
        setLessonName(data?.lesson?.title || "Lesson Name Not Found");
      } catch (error) {
        console.error("Error fetching lesson name:", error);
      }
    };

    const fetchCompletedChapters = async () => {
      try {
        const { data: userData } = await axios.get("/api/get-current-user");
        const userId = userData?.id;

        const { data } = await axios.get(
          `/api/modules/${moduleId}/lessons/${lessonId}/get-completed-chapters`,
          { params: { userId } }
        );
        setCompletedChapters(data.completedChapters || 0);
      } catch (error) {
        console.error("Error fetching completed chapters:", error);
      }
    };

    fetchCompletedChapters();
    fetchChapters();
    fetchLessonName();
  }, [lessonId, moduleId]);

  const goToNextChapter = async () => {
    if (currentChapterIndex < chapters.length - 1) {
      const currentChapter = chapters[currentChapterIndex];
      await axios.post(
        `/api/modules/${moduleId}/lessons/${lessonId}/chapters/${currentChapter.id}/progress`,
        { isCompleted: true }
      );
      setCompletedChapters((prev) => prev + 1);
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
          `/api/modules/${moduleId}/lessons/${lessonId}/exercise-result`
        );

        const currentAttempt = existingResult ? existingResult.attempt + 1 : 1;

        await axios.post(
          `/api/modules/${moduleId}/lessons/${lessonId}/create-attempt`,
          {
            studentId: userId,
            lessonId,
            score: 0,
            attempt: currentAttempt,
          }
        );

        router.push(
          `/student/modules/${moduleId}/lessons/${lessonId}/exercise`
        );
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

  const progressPercentage = (completedChapters / chapters.length) * 100;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-slate-100 dark:bg-slate-900 text-black dark:text-white">
      <LessonTopBar params={{ moduleId, lessonId }} lessonName={lessonName} />

      <div className="flex-grow pt-24 pb-20 px-4 sm:px-8">
        <div className="mx-auto max-w-4xl">
          {/* Progress Bar */}
          <Progress value={progressPercentage} className="h-2 w-full mb-4" />

          {/* ReadText Section */}
          <div className="text-base sm:text-lg text-gray-700 dark:text-gray-200">
            <ReadText
              value={
                chapters[currentChapterIndex]?.description ||
                "No description provided."
              }
            />
          </div>

          {/* Video Section */}
          {chapters[currentChapterIndex]?.videoUrl && (
            <div className="relative aspect-video">
              {chapters[currentChapterIndex]?.videoUrl.includes(
                "youtube.com"
              ) ||
              chapters[currentChapterIndex]?.videoUrl.includes("youtu.be") ? (
                <iframe
                  className="w-full h-full rounded-md"
                  src={`https://www.youtube.com/embed/${
                    new URL(
                      chapters[currentChapterIndex]?.videoUrl
                    ).searchParams.get("v") ||
                    chapters[currentChapterIndex]?.videoUrl.split("/").pop()
                  }`}
                  allowFullScreen
                />
              ) : (
                <video
                  controls
                  className="object-cover rounded-md w-full h-auto max-h-[500px]"
                  src={chapters[currentChapterIndex]?.videoUrl + "?raw=true"}
                >
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          )}

          {/* Image Section */}
          {chapters[currentChapterIndex]?.imageUrl && (
            <Image
              width={800}
              height={600}
              src={chapters[currentChapterIndex]?.imageUrl}
              alt={chapters[currentChapterIndex]?.title || "Chapter Image"}
              className="w-full h-auto mt-4 rounded-md"
            />
          )}
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="p-4 bg-slate-100 dark:bg-slate-800 shadow-lg fixed bottom-0 left-0 right-0 z-10">
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
          <Button
            onClick={goToPreviousChapter}
            disabled={currentChapterIndex === 0}
          >
            Previous
          </Button>
          {currentChapterIndex === chapters.length - 1 ? (
            <Button onClick={completeChapters}>Take Exercise</Button>
          ) : (
            <Button
              onClick={goToNextChapter}
              disabled={currentChapterIndex === chapters.length - 1}
            >
              Next
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LessonDiscussion;
