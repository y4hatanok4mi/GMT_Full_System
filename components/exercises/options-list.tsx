"use client";

import { cn } from "@/lib/utils";
import { Option } from "@prisma/client";
import { FileQuestion, Pencil, Save } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
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

  if (!isMounted) {
    return null;
  }

  return (
    <div>
      {options.map((option) => (
        <div
          key={option.id}
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

          {editingId === option.id ? (
            <input
              type="text"
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              className="flex-grow px-2 py-1 rounded-md border border-slate-300"
            />
          ) : (
            <span>{option.text}</span>
          )}

          <div className="ml-auto pr-2 flex items-center gap-x-4">
            {editingId === option.id ? (
              <button
                onClick={handleSave}
                className="flex items-center flex-row gap-x-1 text-green-600 hover:opacity-75 transition"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
            ) : (
              <div
                onClick={() => handleEdit(option.id, option.text)}
                className="flex items-center gap-x-1 cursor-pointer text-blue-600 hover:opacity-75 transition"
              >
                <Pencil className="w-4 h-4" />
                Edit
              </div>
            )}
          </div>
        </div>
      ))}
      <Select value={selectedAnswer || ""} onValueChange={handleSelectCorrectAnswer}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select correct answer" />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.id} value={opt.id}>
              {opt.text}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
