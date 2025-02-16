"use client"

import * as z from "zod";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { File, Loader2, PlusCircle, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Lesson, Resource } from "@prisma/client";
import FileUpload from "../file-upload";


interface AttachmentFormProps {
    initialData: Lesson & { resources: Resource[] };
    lessonId: string;
    moduleId: string;
};

const formSchema = z.object({
    fileUrl: z.string().min(1),
});

export const AttachmentForm = ({
    initialData,
    lessonId,
    moduleId
}: AttachmentFormProps) => {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const toggleEdit = () => setIsEditing((current) => !current);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post(`/api/modules/${moduleId}/lessons/${lessonId}/attachments`, values);
            toast.success("Lesson updated!")
            toggleEdit();
            router.refresh();
        } catch {
            toast.error("Something went wrong!");
        }
    }

    const onDelete = async (id: string) => {
        try {
            setDeletingId(id);
            await axios.delete(`/api/modules/${moduleId}/lessons/${lessonId}/attachments/${id}`);
            toast.success("Attachment deleted!");
            router.refresh();
        } catch {
            toast.error("Something went wrong!");
        } finally {
            setDeletingId(null);
        }
    }

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Lesson Attachments
                <Button onClick={toggleEdit} variant={"ghost"}>
                    {isEditing && (
                        <>Cancel</>
                    )}
                    {!isEditing && (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add a file
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (<>
                {initialData.resources.length === 0 && (
                    <p className="text-sm mt-2 text-slate-500 italic">
                        No attachments yet
                    </p>
                )}
                {initialData.resources.length > 0 && (
                    <div className="space-y-2">
                        {initialData.resources.map((resource) => (
                            <div
                                key={resource.id}
                                className="flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md"
                            >
                                <File className="h-4 w-4 mr-2 flex-shrink-0" />
                                <p className="text-xs line-clamp-1">
                                    {resource.name}
                                </p>
                                {deletingId === resource.id && (
                                    <div>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    </div>
                                )}
                                {deletingId !== resource.id && (
                                    <button 
                                    onClick={() => onDelete(resource.id)}
                                    className="ml-auto hover:opacity-75 transition"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </>
            )}
            {isEditing && (
                <div>
                    <FileUpload
                        endpoint="lessonResource"
                        onChange={(url) => {
                            if (url) {
                                onSubmit({ fileUrl: url })
                            }
                        }}
                    />
                    <div className="text-xs text-muted-foreground mt-4">
                        Add anything for extra lessons
                    </div>
                </div>
            )}
        </div>
    )
}
