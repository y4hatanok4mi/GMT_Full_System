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
    FormMessage
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { Input } from "../ui/input";
import { OptionsForm } from "./options-form";
import { QuestionImageForm } from "../questions/question-image-form";
import { Option } from "@prisma/client";
import { QuestionType } from "@/types/question"; // Import from types folder

interface QuestionQuestionFormProps {
    initialData: {
        question: string;
        type: QuestionType;
    };
    lessonId: string;
    moduleId: string;
    questionId: string;
}

const formSchema = z.object({
    question: z.string().min(1, {
        message: "Question is required!",
    }),
    type: z.enum(["MULTIPLE_CHOICE", "FILL_IN_THE_BLANK"]) as z.ZodType<QuestionType>,
});

export const QuestionQuestionForm = ({
    initialData,
    questionId,
    lessonId,
    moduleId
}: QuestionQuestionFormProps) => {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [questionData, setQuestionData] = useState({
        id: "",
        lessonId: lessonId,
        question: "",
        image: "",
        createdAt: new Date(),
        updatedAt: new Date(),
        correctAnswer: "",
        type: "MULTIPLE_CHOICE" as QuestionType, // Default to MULTIPLE_CHOICE
        options: [] as Option[],
    });
    const [isLoading, setIsLoading] = useState(true);

    const toggleEdit = () => setIsEditing((current) => !current);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData,
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
            });
        }
    }, [questionData, form]);

    const { isSubmitting, isValid, isDirty } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setIsLoading(true);
            await axios.patch(
                `/api/modules/${moduleId}/lessons/${lessonId}/questions/${questionId}`,
                {
                    ...values,
                    lessonId,
                }
            );
            toast.success("Question updated!");
            toggleEdit();
            router.refresh();
        } catch {
            toast.error("Something went wrong!");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="my-4 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Question Title
                <Button onClick={toggleEdit} variant={"ghost"} disabled={isLoading}>
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
                <p className="text-sm mt-2">{questionData.question}</p>
            )}
            {isEditing && (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 mt-4"
                    >
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
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* Dropdown to Select Question Type */}
                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <select
                                            className="border rounded-md p-2 w-full"
                                            disabled={isSubmitting || isLoading}
                                            value={field.value}
                                            onChange={(e) =>
                                                field.onChange(e.target.value as QuestionType)
                                            }
                                        >
                                            <option value="MULTIPLE_CHOICE">
                                                Multiple Choice
                                            </option>
                                            <option value="FILL_IN_THE_BLANK">
                                                Fill in the Blank
                                            </option>
                                        </select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex items-center gap-2">
                            <Button
                                disabled={!isValid || !isDirty || isSubmitting || isLoading}
                                type="submit"
                            >
                                {isLoading ? "Loading..." : "Save"}
                            </Button>
                        </div>
                    </form>
                </Form>
            )}
            <QuestionImageForm
                initialData={questionData}
                moduleId={moduleId}
                lessonId={lessonId}
                questionId={questionId}
            />
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
                    <label className="block font-medium">Correct Answer:</label>
                    <div className="flex flex-col gap-2 mt-2">
                        <Input
                            className="flex-1"
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
                            className="w-28 mt-2"
                            onClick={async () => {
                                try {
                                    setIsLoading(true);
                                    await axios.patch(
                                        `/api/modules/${moduleId}/lessons/${lessonId}/questions/${questionId}`,
                                        { correctAnswer: questionData.correctAnswer }
                                    );
                                    toast.success("Correct answer updated!");
                                    router.refresh();
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
