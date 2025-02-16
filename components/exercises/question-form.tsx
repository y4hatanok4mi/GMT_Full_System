"use client"

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Pencil, PlusCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Exercise, Question } from "@prisma/client";
import { Input } from "../ui/input";
import { QuestionsList } from "./questions-list";


interface QuestionFormProps {
    initialData: Exercise & { questions: Question[] };
    moduleId: string;
    lessonId: string;
    exerciseId: string;
    questionId: string;
};

const formSchema = z.object({
    question: z.string().min(1),
});

export const QuestionsForm = ({
    initialData,
    moduleId,
    lessonId,
    exerciseId,
    questionId
}: QuestionFormProps) => {
    const router = useRouter();
    const [isCreating, setIsCreating] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const toggleCreating = ( ) => setIsCreating((current) => !current);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            question: "",
        }
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post(`/api/modules/${moduleId}/lessons/${lessonId}/exercises/${exerciseId}/questions`, values);
            toast.success("Exercise updated!")
            toggleCreating();
            router.refresh();
        } catch {
            toast.error("Something went wrong!");
        }
    }

    const onEdit = (id: string) => {
        router.push(`/admin/data-management/modules/${moduleId}/lessons/${lessonId}/exercises/${exerciseId}/questions/${id}`);
    }

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Exercise Questions
                <Button onClick={toggleCreating} variant={"ghost"}>
                    {isCreating ? (
                        <>Cancel</>
                    ) : (
                        <>
                        <PlusCircle className="h-4 w-4 mr-2" />
                            Add a question
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
                            name="question"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                        disabled={isSubmitting}
                                        placeholder="What is formula for the area of..."
                                        {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )} 
                        />
                            <Button
                            disabled={!isValid || isSubmitting}
                            type="submit"
                            >
                                Create
                            </Button>
                    </form>
                </Form>
            )}
            {!isCreating &&(
                <div className={cn(
                    "text-sm mt-2",
                    !initialData?.questions.length && "text-slate-500 italic"
                )}>
                   {!initialData?.questions.length && "No questions"}
                   <QuestionsList
                   onEdit={onEdit}
                   items={initialData.questions || []}
                   />
                </div>
            )}
        </div>
    )
}
