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
    <div className="mt-6 border bg-white rounded-md p-4">
      <p className="text-2xl font-bold mt-2">{module.name}</p>
      <ReadText value={module.description || "No description provided."} />

      <div className="mt-4 flex justify-end">
        {isModuleCompleted ? (
          <Badge className="bg-green-500 text-white px-3 py-1">Completed</Badge>
        ) : hasJoined ? (
          <Button disabled className="bg-gray-400 text-white">
            Started
          </Button>
        ) : (
          <Button onClick={startModule} className="bg-green-500 text-white hover:bg-green-600">
            Start Module
          </Button>
        )}
      </div>

      <Separator className="m-2" />
      <div className="mt-6 rounded-md">
        <div className="font-medium">Module Lessons</div>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <div className="text-sm mt-2">
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
                      "bg-white border-slate-100 text-slate-700 rounded-md mb-4 text-sm cursor-pointer",
                      lesson.isPublished
                    )}
                  >
                    <div className="flex items-center font-bold gap-x-2 px-2 py-3 border-b border-b-slate-200">
                      <Album />
                      {lesson.title}
                      {lesson.category && (
                        <span className="ml-2 text-gray-500 text-sm">{lesson.category.name}</span>
                      )}
                      <div className="ml-auto flex items-center gap-x-2">
                        <Badge
                          className={cn(
                            "bg-slate-500",
                            lesson.isLocked && "bg-gray-700",
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
                      {!lesson.isLocked && (
                        <Button
                          color="green"
                          size="sm"
                          className="w-full"
                          disabled={lesson.isCompleted}
                        >
                          {lesson.isCompleted ? "Review" : "Learn"}
                        </Button>
                      )}
                      {lesson.isLocked && (
                        <Button color="gray" size="sm" className="w-full" disabled>
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
