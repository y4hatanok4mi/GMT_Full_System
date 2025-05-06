"use client";

import { cn } from "@/lib/utils";
import { Question, Option } from "@prisma/client";
import { FileQuestion, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button"; // Assuming you have a Button component

interface QuestionsListProps {
  items: (Question & { options: Option[] })[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void; // Callback for delete action
}

export const QuestionsList = ({ items, onEdit, onDelete }: QuestionsListProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [questions, setQuestions] = useState(items);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const sortedItems = [...items].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    setQuestions(sortedItems);
  }, [items]);

  if (!isMounted) return null;

  return (
    <div>
      {questions.map((question, index) => (
        <div
          key={question.id}
          className="p-4 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md mb-4 space-y-2 text-slate-800 dark:text-slate-200"
        >
          <div className="flex items-start gap-2">
            <FileQuestion className="mt-1 text-slate-500 dark:text-slate-400" />
            <div className="flex-1">
              <p className="font-medium">
                {index + 1}. {question.question}
              </p>
              <div className="flex flex-row items-center gap-4 mt-2">
                {question.image && (
                  <div className="mt-2">
                    <Image
                      src={question.image}
                      alt="Question Image"
                      width={400}
                      height={300}
                      className="rounded-md border"
                    />
                  </div>
                )}

                {/* Render options only for multiple-choice questions */}
                {question.type === "MULTIPLE_CHOICE" && question.options?.length > 0 && (
                  <div className="mt-3 space-y-1 text-sm">
                    {question.options.map((opt, i) => (
                      <p
                        key={opt.id}
                        className={cn(
                          "px-2 py-1 rounded",
                          question.correctAnswer === opt.id &&
                            "bg-green-100 dark:bg-green-900 font-semibold"
                        )}
                      >
                        {String.fromCharCode(65 + i)}. {opt.text}
                      </p>
                    ))}
                    <p className="mt-2 text-green-700 dark:text-green-400 font-medium">
                      Correct Answer:{" "}
                      {question.options.find(
                        (opt) => opt.id === question.correctAnswer
                      )?.text || "N/A"}
                    </p>
                  </div>
                )}

                {/* Render blank for fill-in-the-blank questions */}
                {question.type === "FILL_IN_THE_BLANK" && (
                  <div className="mt-3 text-sm">
                    <p className="text-gray-700 dark:text-gray-300">Fill in the blank:</p>
                    <p className="mt-2 text-green-700 dark:text-green-400 font-medium">
                      Correct Answer:{" "}
                      {question.correctAnswer || "N/A"}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="ml-auto flex items-center gap-2">
              {/* Edit Button */}
              <Button
                onClick={() => onEdit(question.id)}
                variant="ghost"
                size="sm"
                className="text-sm text-green-600 dark:text-green-400 hover:opacity-75"
              >
                Edit
              </Button>

              {/* Delete Button */}
              <Button
                onClick={() => onDelete(question.id)}
                variant="ghost"
                size="sm"
                className="text-sm text-slate-800 dark:text-slate-200 hover:bg-red-700 hover:text-white"
              >
                <Trash className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
