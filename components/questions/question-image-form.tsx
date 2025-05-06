"use client"

import * as z from "zod";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { ImageIcon, Pencil, PlusCircle, Trash } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Question } from "@prisma/client";
import Image from "next/image";
import FileUpload from "../file-upload";


interface QuestionImageFormProps {
    initialData: Question;
    questionId: string;
    lessonId: string;
    moduleId: string;
};

const formSchema = z.object({
    image: z.string().min(1)
});

export const QuestionImageForm = ({
    initialData,
    questionId,
    lessonId,
    moduleId
}: QuestionImageFormProps) => {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => setIsEditing((current) => !current);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/modules/${moduleId}/lessons/${lessonId}/questions/${questionId}`, values);
            toast.success("Question updated!")
            toggleEdit();
            router.refresh();
        } catch {
            toast.error("Something went wrong!");
        }
    }

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Question Image (optional)
                <div className="flex gap-2">
                    <Button onClick={toggleEdit} variant={"ghost"}>
                        {isEditing && <>Cancel</>}
                        {!isEditing && !initialData.image && (
                            <>
                                <PlusCircle className="h-4 w-4 mr-2" />
                                Add an image
                            </>
                        )}
                        {!isEditing && initialData.image && (
                            <>
                                <Pencil className="h-4 w-4 mr-2" />
                                Edit
                            </>
                        )}
                    </Button>
                    {initialData.image && !isEditing && (
                        <Button
                            onClick={async () => {
                                try {
                                    await axios.patch(
                                        `/api/modules/${moduleId}/lessons/${lessonId}/questions/${questionId}`,
                                        { image: null }
                                    );
                                    toast.success("Image deleted!");
                                    router.refresh();
                                } catch {
                                    toast.error("Failed to delete the image!");
                                }
                            }}
                            variant="ghost"
                        >
                            <Trash className="h-4 w-4 mr-2 text-red-500" />
                            Delete
                        </Button>
                    )}
                </div>
            </div>
            {!isEditing && (
                !initialData.image ? (
                    <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
                        <ImageIcon className="h-10 w-10 text-slate-500" />
                    </div>
                ) : (
                    <div className="relative aspect-video mt-2">
                        <Image
                            alt="Upload"
                            fill
                            className="object-cover rounded-md"
                            src={initialData.image}
                        />
                    </div>
                )
            )}
            {isEditing && (
                <div>
                    <FileUpload
                        endpoint="questionImage"
                        onChange={(url) => {
                            if (url) {
                                onSubmit({ image: url })
                            }
                        }}
                    />
                    <div className="text-xs text-muted-foreground mt-4">
                        16:9 aspect ratio recommended
                    </div>
                </div>
            )}
        </div>
    )
}