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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";


interface QuestionTitleFormProps {
    initialData: {
        question: string;
    };
    exerciseId: string
    lessonId: string;
    moduleId: string;
    questionId: string;
};

const formSchema = z.object({
    question: z.string().min(1, {
        message: "Title is required!",
    }),
});

export const QuestionTitleForm = ({
    initialData,
    exerciseId,
    lessonId,
    moduleId,
    questionId
}: QuestionTitleFormProps) => {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = ( ) => setIsEditing((current) => !current);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData,
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/modules/${moduleId}/lessons/${lessonId}/exercises/${exerciseId}/questions/${questionId}`, values);
            toast.success("Exercise updated!")
            toggleEdit();
            router.refresh();
        } catch {
            toast.error("Something went wrong!");
        }
    }

    return (
        <div className="my-4 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Question
                <Button onClick={toggleEdit} variant={"ghost"}>
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
                <p className="text-sm mt-2">
                    {initialData.question}
                </p>
            )}
            {isEditing && (
                <Form {...form}>
                    <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4 mt-10"
                    >
                        <FormField
                            control={form.control}
                            name="question"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                        disabled={isSubmitting}
                                        placeholder="What is...?"
                                        {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )} 
                        />
                        <div className="flex items-center gap-2">
                            <Button
                            disabled={!isValid || isSubmitting}
                            type="submit"
                            >
                                Save
                            </Button>
                        </div>
                    </form>
                </Form>
            )}
        </div>
    )
}
