"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Chapter } from "@prisma/client";
import { Button } from "../ui/button";
import RichEditor from "../rich-editor";
import ReadText from "../read-text";

interface ChapterDiscussionFormProps {
  initialData: Chapter;
  chapterId: string;
  lessonId: string;
  moduleId: string;
}

const formSchema = z.object({
  description: z.string().min(1, {
    message: "Description is required!",
  }),
});

export const ChapterDiscussionForm = ({
  initialData,
  chapterId,
  lessonId,
  moduleId,
}: ChapterDiscussionFormProps) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: initialData.description || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(
        `/api/modules/${moduleId}/lessons/${lessonId}/chapters/${chapterId}`,
        values
      );
      toast.success("Chapter updated!");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="border bg-slate-100 dark:bg-slate-800 dark:border-slate-700 rounded-md p-4">
      <div className="font-medium flex items-center justify-between text-slate-800 dark:text-white">
        Chapter Discussion
        <Button
          onClick={toggleEdit}
          variant={"ghost"}
          className="text-slate-700 dark:text-white"
        >
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <div
          className={cn(
            "text-sm mt-2 text-slate-700 dark:text-slate-300",
            !initialData.description &&
              "text-slate-500 italic dark:text-slate-400"
          )}
        >
          {initialData.description ? (
            <ReadText value={initialData.description} />
          ) : (
            "No discussion yet"
          )}
        </div>
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RichEditor
                      placeholder="What is this chapter about?"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button
                disabled={!isValid || isSubmitting}
                type="submit"
                className="dark:bg-slate-700 dark:text-white"
              >
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
