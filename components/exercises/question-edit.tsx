"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import RichEditor from "@/components/rich-editor";
import { useParams } from "next/navigation";
import { useEffect } from "react";

// Define the interfaces here
interface Option {
  text: string;
}

interface Question {
  question: string;
  options: Option[]; // Options are an array of Option objects
  correctAnswer: string;
  id?: string; // Assuming `id` is optional, adjust as needed
}

interface QuizData {
  questions: Question[];
  error?: string;
}

interface QuizResponse {
  error?: string; // Optional error message if there is an error
  questions?: Question[]; // Optional questions array if the response is successful
}

const quizSchema = z.object({
  questions: z
    .array(
      z.object({
        question: z.string().min(1, { message: "Question is required" }),
        options: z
          .array(z.string().min(1, { message: "Option is required" }))
          .min(2, { message: "At least 2 options are required" }),
        correctAnswer: z.string().min(1, { message: "Correct answer is required" }),
        index: z.number(), // Adding index for each question
      })
    )
    .min(1, { message: "At least one question is required" }), // Require at least one question
});

type QuizFormValues = z.infer<typeof quizSchema>;

const QuizEditForm = () => {
  const { moduleId, lessonId, exerciseId, } = useParams();
  const form = useForm<QuizFormValues>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      questions: [],
    },
  });

  const { fields: questionFields, append: addQuestion, remove: removeQuestion } = useFieldArray({
    control: form.control,
    name: "questions",
  });

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await fetch(`/api/modules/${moduleId}/lessons/${lessonId}/exercises/${exerciseId}`);
        const data: QuizData = await response.json();

        if (response.ok) {
          const formattedQuestions = data.questions.map((question: Question, idx: number) => ({
            question: question.question,
            options: question.options.map((option) => option.text), // Extracting option texts
            correctAnswer: question.correctAnswer,
            index: idx + 1,
          }));

          // Set the fetched questions in the form
          form.setValue("questions", formattedQuestions);
        } else {
          toast.error(data.error || "Error fetching quiz data");
        }
      } catch (error) {
        console.error("Error fetching quiz data:", error);
        toast.error("An error occurred while fetching quiz data");
      }
    };

    fetchQuizData();
  }, [exerciseId, moduleId, lessonId, form]);


  const handleAddQuestion = () => {
    const newIndex = questionFields.length
      ? questionFields[questionFields.length - 1].index + 1
      : 1;
    addQuestion({
      question: "",
      options: ["", ""],
      correctAnswer: "",
      index: newIndex,
    });
  };

  const handleRemoveQuestion = (indexToRemove: number) => {
    removeQuestion(indexToRemove);
    const updatedQuestions = form.getValues("questions").map((question, idx) => ({
      ...question,
      index: idx + 1,
    }));
    form.setValue("questions", updatedQuestions);
  };

  const onSubmit = async (data: QuizFormValues) => {
  try {
    const response = await fetch(`/api/modules/${moduleId}/lessons/${lessonId}/exercises/${exerciseId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data.questions), // Send all questions in a single request
    });

    const result = await response.json();

    if (response.ok) {
      toast.success(result.message || "Quiz updated successfully");
    } else {
      toast.error(result.error || "Failed to update quiz");
    }
  } catch (error) {
    console.error("Error submitting quiz:", error);
    toast.error("An unexpected error occurred");
  }
};

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="p-4 space-y-8">
        <div>
          {questionFields.map((question, qIndex) => (
            <div key={question.id} className="border p-4 rounded">
              {/* Question Text */}
              <FormField
                control={form.control}
                name={`questions.${qIndex}.question`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Question</FormLabel>
                    <FormControl>
                      <RichEditor placeholder="Enter the question" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2 mt-2">
                <h4 className="font-medium">Choices:</h4>
                {question.options.map((option, oIndex) => (
                  <div key={oIndex} className="flex gap-4 items-center">
                    <FormField
                      control={form.control}
                      name={`questions.${qIndex}.options.${oIndex}`}
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <Input placeholder={`Option ${oIndex + 1}`} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => {
                        const currentOptions = form.getValues(`questions.${qIndex}.options`);
                        form.setValue(
                          `questions.${qIndex}.options`,
                          currentOptions.filter((_, i) => i !== oIndex) // Remove selected option
                        );
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  size={"sm"}
                  variant="outline"
                  type="button"
                  onClick={() => {
                    const currentOptions = form.getValues(`questions.${qIndex}.options`);
                    form.setValue(`questions.${qIndex}.options`, [...currentOptions, ""]);
                  }}
                >
                  Add Choice
                </Button>
              </div>

              <FormField
                control={form.control}
                name={`questions.${qIndex}.correctAnswer`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correct Answer:</FormLabel>
                    <FormControl>
                      <select {...field} className="w-full p-2 border rounded">
                        {form.getValues(`questions.${qIndex}.options`).map((option, oIndex) => (
                          <option key={oIndex} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />


              <div className="flex justify-end mt-2">
                <Button
                  variant="destructive"
                  type="button"
                  onClick={() => handleRemoveQuestion(qIndex)}
                  size={"sm"}
                >
                  Remove Question
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-4">
          <Link href="/teacher/quizzes">
            <Button variant="outline" type="button" size={"sm"}>
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            size="sm"
            disabled={
              !form.formState.isValid || form.formState.isSubmitting || questionFields.length === 0
            }
          >
            {form.formState.isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
          </Button>


          <div className="ml-auto flex items-center">
            <Button size={"sm"} variant="outline" type="button" onClick={handleAddQuestion}>
              Add Question
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default QuizEditForm;
