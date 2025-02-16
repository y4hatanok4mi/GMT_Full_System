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
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Option, Question } from "@prisma/client";
import { Input } from "../ui/input";
import { OptionsList } from "./options-list";


interface OptionFormProps {
    initialData: Question & { options: Option[] };
    moduleId: string;
    lessonId: string;
    questionId: string;
};

const formSchema = z.object({
    text: z.string().min(1),
});

export const OptionsForm = ({
    initialData,
    moduleId,
    lessonId,
    questionId
}: OptionFormProps) => {
    const router = useRouter();
    const [isCreating, setIsCreating] = useState(false);
    const [options, setOptions] = useState<Option[]>(initialData.options);

    const toggleCreating = () => setIsCreating((current) => !current);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            text: "",
        }
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            // Post new option
            const response = await axios.post(`/api/modules/${moduleId}/lessons/${lessonId}/questions/${questionId}/options`, values);
            toast.success("Option added!");
            // Update options state with the newly added option
            setOptions((prevOptions) => [...prevOptions, response.data]);
            toggleCreating();  // Hide the form after submission
        } catch {
            toast.error("Something went wrong!");
        }
    }

    useEffect(() => {
        // You can also refetch options here when needed
        // Example: if the parent component needs to refresh options
        setOptions(initialData.options);
    }, [initialData.options]);

    return (
        <div className="mt-2 bg-slate-100 rounded-md">
            <div className="font-medium flex items-center justify-between">
                Question Options
                <Button onClick={toggleCreating} variant={"ghost"}>
                    {isCreating ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add an option
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
                            name="text"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder="A. ..."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
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
            {!isCreating && (
                <div className={cn(
                    "text-sm mt-2",
                    !options.length && "text-slate-500 italic"
                )}>
                    {!options.length && "No options"}
                    <OptionsList
                        items={options}
                        moduleId={moduleId}
                        lessonId={lessonId}
                        questionId={questionId}
                    />
                </div>
            )}
        </div>
    )
}