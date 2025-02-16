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
import { Lesson, Module } from "@prisma/client";
import { Input } from "../ui/input";
import { LessonsList } from "./lessons-list";


interface LessonFormProps {
    initialData: Module & { lesson: Lesson[] };
    moduleId: string;
};

const formSchema = z.object({
    title: z.string().min(1),
});

export const LessonsForm = ({
    initialData,
    moduleId
}: LessonFormProps) => {
    const router = useRouter();
    const [isCreating, setIsCreating] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const toggleCreating = ( ) => setIsCreating((current) => !current);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
        }
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post(`/api/modules/${moduleId}/lessons`, values);
            toast.success("Lesson updated!")
            toggleCreating();
            router.refresh();
        } catch {
            toast.error("Something went wrong!");
        }
    }

    const onEdit = (id: string) => {
        router.push(`/admin/data-management/modules/${moduleId}/lessons/${id}`);
    }

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Module Lessons
                <Button onClick={toggleCreating} variant={"ghost"}>
                    {isCreating ? (
                        <>Cancel</>
                    ) : (
                        <>
                        <PlusCircle className="h-4 w-4 mr-2" />
                            Add a lesson
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
                                        placeholder="e.g.: Introduction to the module..."
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
                    !initialData?.lesson.length && "text-slate-500 italic"
                )}>
                   {!initialData?.lesson.length && "No lessons"}
                   <LessonsList
                   onEdit={onEdit}
                   items={initialData.lesson || []}
                   />
                </div>
            )}
        </div>
    )
}
