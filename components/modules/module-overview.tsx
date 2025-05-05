"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import ReadText from "../read-text";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Album, Lock, Unlock, Check } from "lucide-react";
import { Separator } from "../ui/separator";
import { cn } from "@/lib/utils";

interface LessonWithCategory {
  id: string;
  title: string;
  description: string | null;
  isLocked: boolean;
  isCompleted: boolean;
  isPublished: boolean;
  category?: { name: string } | null;
  createdAt: string;
}

interface ModuleLessonsProps {
  module: {
    id: string;
    name: string;
    description: string | null;
  };
  currentUserId: string;
}

export const ModuleLessons = ({ module, currentUserId }: ModuleLessonsProps) => {
  const [hasJoined, setHasJoined] = useState(false);
  const [lessons, setLessons] = useState<LessonWithCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModuleCompleted, setIsModuleCompleted] = useState(false);
  const moduleId = module.id;
  const router = useRouter();

  useEffect(() => {
    const checkIfJoined = async () => {
      try {
        const { data } = await axios.get(`/api/modules/${moduleId}/join`, {
          params: { userId: currentUserId },
        });
        setHasJoined(data.hasJoined);
      } catch (error) {
        console.error("Error fetching join status:", error);
      }
    };

    const fetchLessons = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get(`/api/modules/${moduleId}/getlessons`);
        setLessons(data.lessons);
        router.refresh();
      } catch (error) {
        console.error("Failed to fetch lessons", error);
      } finally {
        setIsLoading(false);
      }
    };

    const checkModuleCompletion = async () => {
      try {
        const { data } = await axios.get(`/api/modules/${moduleId}/completion`, {
          params: { userId: currentUserId },
        });
        setIsModuleCompleted(data.isCompleted);
      } catch (error) {
        console.error("Error fetching module completion status:", error);
      }
    };

    checkIfJoined();
    fetchLessons();
    checkModuleCompletion();
  }, [currentUserId, moduleId, router]);

  const startModule = async () => {
    try {
      await axios.post(`/api/modules/${moduleId}/join`, { userId: currentUserId });

      if (lessons.length > 0) {
        const firstLessonId = lessons[0]?.id;
        if (firstLessonId) {
          await axios.post(`/api/modules/${moduleId}/lessons/${firstLessonId}/unlock`, {
            userId: currentUserId,
          });

          setLessons((prevLessons) =>
            prevLessons.map((lesson) =>
              lesson.id === firstLessonId ? { ...lesson, isLocked: false } : lesson
            )
          );
        }
      }

      setHasJoined(true);
    } catch (error) {
      console.error("Error joining module:", error);
    }
  };

  return (
    <div className="mt-6 border bg-white dark:bg-slate-800 dark:border-slate-700 rounded-md p-4">
      <p className="text-2xl font-bold mt-2 text-slate-900 dark:text-white">{module.name}</p>
      <ReadText value={module.description || "No description provided."} />

      <div className="mt-4 flex justify-end">
        {isModuleCompleted ? (
          <Badge className="bg-green-500 text-white px-3 py-1">Completed</Badge>
        ) : hasJoined ? (
          <Button disabled className="bg-gray-400 dark:bg-gray-600 text-white">
            Started
          </Button>
        ) : (
          <Button
            onClick={startModule}
            className="bg-green-500 text-white hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
          >
            Start Module
          </Button>
        )}
      </div>

      <Separator className="m-2" />
      <div className="mt-6 rounded-md">
        <div className="font-medium text-slate-800 dark:text-slate-100">Module Lessons</div>
        {isLoading ? (
          <div className="text-slate-700 dark:text-slate-200">Loading...</div>
        ) : (
          <div className="text-sm mt-2 text-slate-800 dark:text-slate-100">
            {!lessons.length ? "No lessons available" : null}
            <div>
              {lessons.map((lesson) => (
                <Link
                  key={lesson.id}
                  href={`/student/modules/${moduleId}/lessons/${lesson.id}/chapters`}
                  passHref
                >
                  <div
                    className={cn(
                      "bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-100 rounded-md mb-4 text-sm cursor-pointer",
                      lesson.isPublished
                    )}
                  >
                    <div className="flex items-center font-bold gap-x-2 px-2 py-3 border-b border-b-slate-200 dark:border-b-slate-600">
                      <Album />
                      {lesson.title}
                      {lesson.category && (
                        <span className="ml-2 text-gray-500 dark:text-gray-300 text-sm">
                          {lesson.category.name}
                        </span>
                      )}
                      <div className="ml-auto flex items-center gap-x-2">
                        <Badge
                          className={cn(
                            "bg-green-500 dark:bg-green-600",
                            lesson.isLocked && "bg-green-700 dark:bg-green-800",
                            lesson.isCompleted && "bg-green-500"
                          )}
                        >
                          {lesson.isCompleted ? (
                            <Check className="h-4 w-4 text-white" />
                          ) : lesson.isLocked ? (
                            <Lock className="h-4 w-4 text-white" />
                          ) : (
                            <Unlock className="h-4 w-4 text-white" />
                          )}
                        </Badge>
                      </div>
                    </div>
                    <div className="px-2 py-2">
                      {!lesson.isLocked ? (
                        <Button
                          size="sm"
                          className={cn(
                            "w-full text-white",
                            lesson.isCompleted
                              ? "bg-green-500 dark:bg-green-600"
                              : "bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
                          )}
                          disabled={lesson.isCompleted}
                        >
                          {lesson.isCompleted ? "Review" : "Learn"}
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          className="w-full bg-gray-400 text-white dark:bg-gray-700"
                          disabled
                        >
                          Locked
                        </Button>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
