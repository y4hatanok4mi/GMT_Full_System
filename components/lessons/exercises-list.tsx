"use client";

import { cn } from "@/lib/utils";
import { Exercise } from "@prisma/client";
import { NotebookPen, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "../ui/badge";

interface ExercisesListProps {
  items: Exercise[];
  onEdit: (id: string) => void;
}

export const ExercisesList = ({ items, onEdit }: ExercisesListProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [exercises, setExercises] = useState(items);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setExercises(items);
  }, [items]);

  if (!isMounted) {
    return null;
  }

  return (
    <div>
      {exercises.map((exercise) => (
        <div
          key={exercise.id}
          className={cn(
            "flex items-center gap-x-2 bg-slate-200 border-slate-200 border text-slate-700 rounded-md mb-4 text-sm",
            exercise.isPublished && "bg-green-100 border-green-200 text-green-700"
          )}
        >
          <div
            className={cn(
              "px-2 py-3 border-r border-r-slate-200 hover:bg-slate-300 rounded-l-md transition",
              exercise.isPublished && "border-r-green-200 hover:bg-green-200"
            )}
          >
            <NotebookPen />
          </div>
          {exercise.title}
          <div className="ml-auto pr-2 flex items-center gap-x-2">
            <Badge
              className={cn(
                "bg-slate-500",
                exercise.isPublished && "bg-green-700"
              )}
            >
              {exercise.isPublished ? "Published" : "Draft"}
            </Badge>
            <Pencil
              onClick={() => onEdit(exercise.id)}
              className="w-4 h-4 cursor-pointer hover:opacity-75 transition"
            />
          </div>
        </div>
      ))}
    </div>
  );
};
