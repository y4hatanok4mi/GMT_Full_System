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
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Chapter, Lesson } from "@prisma/client";
import { Input } from "../ui/input";
import { ChaptersList } from "./chapters-list";

interface ChapterFormProps {
  initialData: Lesson & { chapter: Chapter[] };
  lessonId: string;
  moduleId: string;
}

const formSchema = z.object({
  title: z.string().min(1),
});

export const ChaptersForm = ({
  initialData,
  lessonId,
  moduleId,
}: ChapterFormProps) => {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);

  const toggleCreating = () => setIsCreating((current) => !current);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(
        `/api/modules/${moduleId}/lessons/${lessonId}/chapters`,
        values
      );
      toast.success("Chapter added!");
      toggleCreating();
      router.refresh();
    } catch {
      toast.error("Something went wrong!");
    }
  };

  const onEdit = (id: string) => {
    router.push(
      `/admin/data-management/modules/${moduleId}/lessons/${lessonId}/chapters/${id}`
    );
  };

  return (
    <div className="border bg-slate-100 dark:bg-slate-800 rounded-md p-4">
      <div className="font-medium flex items-center justify-between text-slate-800 dark:text-white">
        Lesson Chapters
        <Button
          onClick={toggleCreating}
          variant={"ghost"}
          className="text-slate-700 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700"
        >
          {isCreating ? (
            <>Cancel</>
          ) : (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a chapter
            </>
          )}
        </Button>
      </div>

      {isCreating && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g.: Introduction to the lesson..."
                      {...field}
                      className="dark:bg-slate-700 dark:text-white dark:placeholder-slate-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={!isValid || isSubmitting}
              type="submit"
              className="dark:bg-slate-700 dark:text-white"
            >
              Create
            </Button>
          </form>
        </Form>
      )}

      {!isCreating && (
        <div
          className={cn(
            "text-sm mt-2",
            !initialData?.chapter.length
              ? "text-slate-500 italic dark:text-slate-400"
              : "dark:text-white"
          )}
        >
          {!initialData?.chapter.length && "No chapters"}
          <ChaptersList onEdit={onEdit} items={initialData.chapter || []} />
        </div>
      )}
    </div>
  );
};
