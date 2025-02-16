"use client"

import * as z from "zod";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { ImageIcon, Pencil, PlusCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { User } from "@prisma/client";
import Image from "next/image";
import FileUpload from "@/components/file-upload";


interface UserImageFormProps {
    initialData: User;
};

const formSchema = z.object({
    image: z.string().min(1, {
        message: "Image is required!",
    }),
});

export const UserImageForm = ({
    initialData
}: UserImageFormProps) => {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => setIsEditing((current) => !current);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/update-profile`, values);
            toast.success("Profile updated!")
            toggleEdit();
            router.refresh();
        } catch {
            toast.error("Something went wrong!");
        }
    }

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Module Image
                <Button onClick={toggleEdit} variant={"ghost"}>
                    {isEditing && (
                        <>Cancel</>
                    )}
                    {!isEditing && !initialData.image && (
                        <>
                        <PlusCircle className="h-4 w-4 mr-2"/>
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
            </div>
            {!isEditing && (
                !initialData.image ? (
                    <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
                        <ImageIcon className="h-10 w-10 text-slate-500"/>
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
                        endpoint="profilePicture"
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
