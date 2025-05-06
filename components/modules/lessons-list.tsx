"use client";

import { cn } from "@/lib/utils";
import { Lesson } from "@prisma/client";
import { BookOpen, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "../ui/badge";

interface LessonsListProps {
  items: Lesson[];
  onEdit: (id: string) => void;
}

export const LessonsList = ({ items, onEdit }: LessonsListProps) => {
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
            "flex items-center gap-x-2 bg-slate-200 dark:bg-slate-700 border-slate-200 dark:border-slate-600 border text-slate-700 dark:text-white rounded-md mb-4 text-sm",
            lesson.isPublished && "bg-green-100 border-green-200 text-green-700 dark:bg-green-800 dark:border-green-700 dark:text-white"
          )}
        >
          <div
            className={cn(
              "px-2 py-3 border-r border-r-slate-200 dark:border-r-slate-600 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-l-md transition",
              lesson.isPublished && "border-r-green-200 dark:border-r-green-600 hover:bg-green-200 dark:hover:bg-green-700"
            )}
          >
            <BookOpen />
          </div>
          {lesson.title}
          <div className="ml-auto pr-2 flex items-center gap-x-2">
            <Badge
              className={cn(
                "bg-slate-500 dark:bg-slate-600",
                lesson.isPublished && "bg-green-700 dark:bg-green-600"
              )}
            >
              {lesson.isPublished ? "Published" : "Draft"}
            </Badge>
            <Pencil
              onClick={() => onEdit(lesson.id)}
              className="w-4 h-4 cursor-pointer hover:opacity-75 transition"
            />
          </div>
        </div>
      ))}
    </div>
  );
};
