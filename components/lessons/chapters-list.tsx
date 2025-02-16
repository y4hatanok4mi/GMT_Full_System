"use client";

import { cn } from "@/lib/utils";
import { Chapter } from "@prisma/client";
import { NotebookText, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "../ui/badge";

interface ChaptersListProps {
  items: Chapter[];
  onEdit: (id: string) => void;
}

export const ChaptersList = ({ items, onEdit }: ChaptersListProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [chapters, setChapters] = useState(items);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const sortedItems = [...items].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    setChapters(sortedItems);
  }, [items]);

  if (!isMounted) {
    return null;
  }

  return (
    <div>
      {chapters.map((chapter) => (
        <div
          key={chapter.id}
          className={cn(
            "flex items-center gap-x-2 bg-slate-200 border-slate-200 border text-slate-700 rounded-md mb-4 text-sm",
            chapter.isPublished && "bg-green-100 border-green-200 text-green-700"
          )}
        >
          <div
            className={cn(
              "px-2 py-3 border-r border-r-slate-200 hover:bg-slate-300 rounded-l-md transition",
              chapter.isPublished && "border-r-green-200 hover:bg-green-200"
            )}
          >
            <NotebookText />
          </div>
          {chapter.title}
          <div className="ml-auto pr-2 flex items-center gap-x-2">
            <Badge
              className={cn(
                "bg-slate-500",
                chapter.isPublished && "bg-green-700"
              )}
            >
              {chapter.isPublished ? "Published" : "Draft"}
            </Badge>
            <Pencil
              onClick={() => onEdit(chapter.id)}
              className="w-4 h-4 cursor-pointer hover:opacity-75 transition"
            />
          </div>
        </div>
      ))}
    </div>
  );
};
