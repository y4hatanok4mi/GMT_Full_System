"use client";

import { cn } from "@/lib/utils";
import { Question } from "@prisma/client";
import { BookOpen, FileQuestion, Pencil } from "lucide-react";
import { useEffect, useState } from "react";

interface QuestionsListProps {
  items: Question[];
  onEdit: (id: string) => void;
}

export const QuestionsList = ({ items, onEdit }: QuestionsListProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [questions, setQuestions] = useState(items);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const sortedItems = [...items].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    setQuestions(sortedItems);
  }, [items]);
  
  if (!isMounted) {
    return null;
  }

  return (
    <div>
      {questions.map((question) => (
        <div
          key={question.id}
          className={cn(
            "flex items-center gap-x-2 bg-slate-200 border-slate-200 border text-slate-700 rounded-md mb-4 text-sm"
          )}
        >
          <div
            className={cn(
              "px-2 py-3 border-r border-r-slate-200 hover:bg-slate-300 rounded-l-md transition"
            )}
          >
            <FileQuestion />
          </div>
          {question.question}
          <div className="ml-auto pr-2 flex items-center gap-x-2">
            <Pencil
              onClick={() => onEdit(question.id)}
              className="w-4 h-4 cursor-pointer hover:opacity-75 transition"
            />
          </div>
        </div>
      ))}
    </div>
  );
};
