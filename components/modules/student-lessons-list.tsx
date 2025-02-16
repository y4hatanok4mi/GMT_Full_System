"use client";

import { cn } from "@/lib/utils";
import { Lesson } from "@prisma/client";
import { Album, Lock, Unlock, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import Link from "next/link";

interface StudentLessonsListProps {
  items: Lesson[];
  moduleId: string;
}

export const StudentLessonsList = ({ items, moduleId }: StudentLessonsListProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [lessons, setLessons] = useState(items);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const sortedItems = [...items].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    setLessons(sortedItems);
  }, [items]);

  if (!isMounted) {
    return null;
  }

  return (
    <div>
      {lessons.map((lesson) => (
        <div
          key={lesson.id}
          className={cn(
            "bg-white border-slate-100 text-slate-700 rounded-md mb-4 text-sm",
            lesson.isPublished
          )}
        >
          <div className="flex items-center font-bold gap-x-2 px-2 py-3 border-b border-b-slate-200">
            <Album />
            {lesson.title}
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
            {/* Conditionally render the "Learn" button based on isLocked or isCompleted */}
            {!lesson.isCompleted && !lesson.isLocked && (
              <Link href={`/student/modules/${moduleId}/lessons/${lesson.id}`}>
                <Button color="green" size="sm" className="w-full">
                  Learn
                </Button>
              </Link>
            )}
            {lesson.isLocked && (
              <Button color="gray" size="sm" className="w-full" disabled>
                Locked
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
