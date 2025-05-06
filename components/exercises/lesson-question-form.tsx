"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ImageIcon, Pencil, PlusCircle, Trash } from "lucide-react";
import { Input } from "../ui/input";
import { OptionsForm } from "./options-form";
import { Option } from "@prisma/client";
import { QuestionType } from "@/types/question"; // Import from types folder
import Image from "next/image";
import FileUpload from "../file-upload";

interface QuestionFormProps {
  initialData: {
    question: string;
    type: QuestionType;
    image: string | null;
  };
  lessonId: string;
  moduleId: string;
  questionId: string;
}

const formSchema = z.object({
  question: z.string().min(1, {
    message: "Question is required!",
  }),
  type: z.enum([
    "MULTIPLE_CHOICE",
    "FILL_IN_THE_BLANK",
  ]) as z.ZodType<QuestionType>,
  image: z.string().optional(), // Optional image field
});

export const QuestionForm = ({
  initialData,
  questionId,
  lessonId,
  moduleId,
}: QuestionFormProps) => {
  const router = useRouter();
  const [questionData, setQuestionData] = useState<{
    id: string;
    lessonId: string;
    question: string;
    image: string | null;
    createdAt: Date;
    updatedAt: Date;
    correctAnswer: string;
    type: QuestionType;
    options: Option[];
  }>({
    id: "",
    lessonId: lessonId,
    question: "",
    image: initialData.image || null,
    createdAt: new Date(),
    updatedAt: new Date(),
    correctAnswer: "",
    type: "MULTIPLE_CHOICE" as QuestionType,
    options: [] as Option[],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isEditingImage, setIsEditingImage] = useState(false); // State for image editing
  const [refreshKey, setRefreshKey] = useState(0);
  const triggerReRender = () => setRefreshKey((prevKey) => prevKey + 1);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...initialData,
      image: initialData.image ?? undefined,
    },
  });

  useEffect(() => {
    const fetchQuestionData = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get(
          `/api/modules/${moduleId}/lessons/${lessonId}/questions/${questionId}/getquestion`
        );

        setQuestionData({
          id: data.id || "",
          lessonId: data.lessonId || lessonId,
          question: data.question || "",
          image: data.image || "",
          createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
          updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
          correctAnswer: data.correctAnswer || "",
          type: (data.type as QuestionType) || "MULTIPLE_CHOICE",
          options: data.options || [],
        });

        setIsLoading(false);
      } catch (error) {
        toast.error("Failed to load question data");
        setIsLoading(false);
      }
    };

    fetchQuestionData();
  }, [moduleId, lessonId, questionId]);

  useEffect(() => {
    if (questionData.question) {
      form.reset({
        question: questionData.question,
        type: questionData.type,
        image: questionData.image || "",
      });
    }
  }, [questionData, form]);

  const { isSubmitting, isValid, isDirty } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);

      // Update question with the form data
      await axios.patch(
        `/api/modules/${moduleId}/lessons/${lessonId}/questions/${questionId}`,
        {
          ...values,
          lessonId,
        }
      );

      // Refresh data after update (ensure the latest data is fetched)
      setQuestionData((prevData) => ({
        ...prevData,
        question: values.question,
        type: values.type,
        image: values.image ?? prevData.image, // Ensure image is updated
      }));

      toast.success("Question updated!");
    } catch {
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageDelete = async () => {
    try {
      // Call API to delete image
      await axios.patch(
        `/api/modules/${moduleId}/lessons/${lessonId}/questions/${questionId}`,
        { image: null }
      );

      // Clear image from state after successful deletion
      setQuestionData((prevData) => ({
        ...prevData,
        image: null, // Set image to null
      }));

      toast.success("Image deleted!");
    } catch {
      toast.error("Failed to delete the image!");
    }
  };

  return (
    <div className="my-4 border bg-slate-100 dark:bg-slate-800 rounded-md p-4">
      <div className="font-medium text-slate-800 dark:text-white">Question Title</div>
      <p className="text-sm mt-2 text-slate-700 dark:text-slate-300">{questionData.question}</p>

      {/* Edit Form for Question */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <FormField
            control={form.control}
            name="question"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    disabled={isSubmitting || isLoading}
                    placeholder="What is the..."
                    {...field}
                    className="dark:bg-slate-700 dark:text-white dark:border-slate-600"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Dropdown to Select Question Type */}
          <div className="flex gap-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <select
                      className="border rounded-md p-2 w-full dark:bg-slate-700 dark:text-white dark:border-slate-600"
                      disabled={isSubmitting || isLoading}
                      value={field.value}
                      onChange={(e) => {
                        const newType = e.target.value as QuestionType;
                        field.onChange(newType);

                        // Trigger state update to force re-render
                        setQuestionData((prevData) => ({
                          ...prevData,
                          type: newType,
                        }));
                      }}
                    >
                      <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                      <option value="FILL_IN_THE_BLANK">Fill in the Blank</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              disabled={!isValid || !isDirty || isSubmitting || isLoading}
              type="submit"
              className="dark:bg-green-600 dark:text-white dark:hover:bg-slate-700"
            >
              {isLoading ? "Loading..." : "Save"}
            </Button>
          </div>
        </form>
      </Form>

      {/* Image Upload Form */}
      <div className="mt-6 bg-slate-100 dark:bg-slate-800 rounded-md">
        <div className="font-medium flex items-center justify-between text-slate-800 dark:text-white">
          Question Image (optional)
          <div className="flex gap-2">
            <Button
              onClick={() => setIsEditingImage(!isEditingImage)}
              variant={"ghost"}
            >
              {!questionData.image && (
                <>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add an image
                </>
              )}
              {questionData.image && !isEditingImage && (
                <>
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </>
              )}
              {questionData.image && isEditingImage && (
                <>
                  <Pencil className="h-4 w-4 mr-2" />
                  Change
                </>
              )}
            </Button>
            {questionData.image && !isEditingImage && (
              <Button onClick={handleImageDelete} variant="ghost">
                <Trash className="h-4 w-4 mr-2 text-red-500" />
                Delete
              </Button>
            )}
          </div>
        </div>

        {/* Conditionally Render Image or File Upload */}
        {!questionData.image && !isEditingImage && (
          <div className="flex items-center justify-center h-60 bg-slate-200 dark:bg-slate-800 rounded-md">
            <ImageIcon className="h-10 w-10 text-slate-500 dark:text-slate-300" />
          </div>
        )}

        {questionData.image && !isEditingImage && (
          <div className="relative mt-2 w-full max-w-md mx-auto">
            <Image
              alt="Upload"
              src={questionData.image}
              width={600} // Set the fixed width for the image
              height={400} // Set the fixed height for the image
              className="object-cover rounded-md"
            />
          </div>
        )}

        {isEditingImage && (
          <FileUpload
            endpoint="questionImage"
            onChange={async (url) => {
              if (url) {
                // Optimistically update the state immediately with the new image URL
                setQuestionData((prevData) => ({
                  ...prevData,
                  image: url, // Set the new image URL in state
                }));
                triggerReRender(); // Trigger re-render

                // Now submit the form to save the new image to the backend
                try {
                  await onSubmit({
                    question: questionData.question,
                    type: questionData.type,
                    image: url, // Pass the new image URL to the backend
                  });

                  // Optionally trigger a refresh of the page
                  router.refresh(); // This can be used to force a reload if needed
                } catch (error) {
                  toast.error("Failed to update image.");
                }
              }
            }}
          />
        )}
      </div>

      {/* Conditionally Render OptionsForm for Multiple Choice */}
      {questionData.type === "MULTIPLE_CHOICE" && (
        <OptionsForm
          initialData={questionData}
          moduleId={moduleId}
          lessonId={lessonId}
          questionId={questionId}
        />
      )}

      {/* Show Fill in the Blank Correct Answer Input */}
      {questionData.type === "FILL_IN_THE_BLANK" && (
        <div className="mt-4">
          <label className="block font-medium text-slate-800 dark:text-white">Correct Answer:</label>
          <div className="flex flex-col gap-2 mt-2">
            <Input
              className="flex-1 dark:bg-slate-700 dark:text-white dark:border-slate-600"
              placeholder="Enter correct answer..."
              value={questionData.correctAnswer || ""}
              disabled={isLoading}
              onChange={(e) =>
                setQuestionData({
                  ...questionData,
                  correctAnswer: e.target.value,
                })
              }
            />
            <Button
              className="w-28 mt-2 dark:bg-green-600 dark:text-white dark:hover:bg-green-700"
              onClick={async () => {
                try {
                  setIsLoading(true);
                  await axios.patch(
                    `/api/modules/${moduleId}/lessons/${lessonId}/questions/${questionId}`,
                    { correctAnswer: questionData.correctAnswer }
                  );
                  toast.success("Correct answer updated!");
                  router.refresh(); // Refresh after correct answer update
                } catch (error) {
                  toast.error("Failed to update answer.");
                } finally {
                  setIsLoading(false);
                }
              }}
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Save"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
