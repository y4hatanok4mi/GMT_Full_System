"use client";

import { cn } from "@/lib/utils";
import { Option } from "@prisma/client";
import { FileQuestion, Pencil, Save, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface OptionsListProps {
  items: Option[];
  moduleId: string;
  lessonId: string;
  questionId: string;
}

export const OptionsList = ({
  items,
  moduleId,
  lessonId,
  questionId,
}: OptionsListProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [options, setOptions] = useState(items);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedText, setEditedText] = useState("");
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);

    const fetchCorrectAnswer = async () => {
      try {
        const response = await axios.get(
          `/api/modules/${moduleId}/lessons/${lessonId}/questions/${questionId}`
        );
        setSelectedAnswer(response.data.correctAnswer);
        router.refresh();
      } catch (error) {
        console.error("Failed to fetch correct answer:", error);
      }
    };

    fetchCorrectAnswer();
  }, [moduleId, lessonId, questionId, router]);

  useEffect(() => {
    const sortedItems = [...items].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    setOptions(sortedItems);
  }, [items]);

  const handleEdit = (id: string, currentText: string) => {
    setEditingId(id);
    setEditedText(currentText);
  };

  const handleSave = async () => {
    if (editingId) {
      try {
        const response = await axios.patch(
          `/api/modules/${moduleId}/lessons/${lessonId}/questions/${questionId}/options/${editingId}`,
          { text: editedText }
        );

        const updatedOption = response.data;

        setOptions((prevOptions) =>
          prevOptions.map((option) =>
            option.id === updatedOption.id ? updatedOption : option
          )
        );

        toast.success("Option updated successfully!");
      } catch (error) {
        console.error("Failed to update option:", error);
        toast.error("Failed to update option!");
      } finally {
        setEditingId(null);
      }
    }
  };

  const handleSelectCorrectAnswer = async (value: string) => {
    try {
      await axios.patch(
        `/api/modules/${moduleId}/lessons/${lessonId}/questions/${questionId}`,
        { correctAnswer: value }
      );

      setSelectedAnswer(value);
      toast.success("Correct answer updated successfully!");
    } catch (error) {
      console.error("Failed to update correct answer:", error);
      toast.error("Failed to update correct answer!");
    }
  };

  const handleDelete = async (optionId: string) => {
    try {
      await axios.delete(
        `/api/modules/${moduleId}/lessons/${lessonId}/questions/${questionId}/options/${optionId}`
      );

      setOptions((prev) => prev.filter((opt) => opt.id !== optionId));
      toast.success("Option deleted successfully!");
    } catch (error) {
      console.error("Failed to delete option:", error);
      toast.error("Failed to delete option!");
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div>
      {options.map((option) => (
        <div
          key={option.id}
          className={cn(
            "flex items-center gap-x-2 border text-sm mb-4 rounded-md",
            "bg-slate-200 text-slate-700 border-slate-200",
            "dark:bg-slate-800 dark:text-white dark:border-slate-700"
          )}
        >
          <div
            className={cn(
              "px-2 py-3 border-r rounded-l-md transition",
              "border-r-slate-200 hover:bg-slate-300",
              "dark:border-r-slate-700 dark:hover:bg-slate-700"
            )}
          >
            <FileQuestion />
          </div>

          {editingId === option.id ? (
            <input
              type="text"
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              className="flex-grow px-2 py-1 rounded-md border dark:bg-slate-700 dark:border-slate-600 dark:text-white"
            />
          ) : (
            <span className="px-2">{option.text}</span>
          )}

          <div className="ml-auto pr-2 flex items-center gap-x-4">
            {editingId === option.id ? (
              <button
                onClick={handleSave}
                className="flex items-center gap-x-1 text-green-600 hover:opacity-75 transition"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
            ) : (
              <>
                <div
                  onClick={() => handleEdit(option.id, option.text)}
                  className="flex items-center gap-x-1 cursor-pointer text-blue-600 hover:opacity-75 transition"
                >
                  <Pencil className="w-4 h-4" />
                  Edit
                </div>
                <div
                  onClick={() => handleDelete(option.id)}
                  className="flex items-center gap-x-1 cursor-pointer text-red-600 hover:opacity-75 transition"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </div>
              </>
            )}
          </div>
        </div>
      ))}

      <Select
        value={selectedAnswer || ""}
        onValueChange={handleSelectCorrectAnswer}
      >
        <SelectTrigger className="w-full dark:bg-slate-700 dark:border-slate-600 dark:text-white">
          <SelectValue placeholder="Select correct answer" />
        </SelectTrigger>
        <SelectContent className="dark:bg-slate-800 dark:text-white">
          {options.map((opt) => (
            <SelectItem key={opt.id} value={opt.id} className="dark:text-white">
              {opt.text}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};