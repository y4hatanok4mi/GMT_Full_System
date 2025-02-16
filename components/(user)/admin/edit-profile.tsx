"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Image from "next/image";
import FileUpload from "@/components/file-upload";
import toast from "react-hot-toast";
import axios from "axios";

type EditProfileDialogProps = {
    user: {
        name: string;
        username: string;
        school: string;
        birthday: string;
        image: string;
    };
};

export function EditProfileDialog({ user }: EditProfileDialogProps) {
    const [open, setOpen] = useState(false);
    const { register, handleSubmit, setValue, watch, reset } = useForm();
    const router = useRouter();
    const [schools, setSchools] = useState<string[]>([]); // Store the list of schools
    const [imagePreview, setImagePreview] = useState<string | null>(null); // Store the image preview URL
    const [imageUrl, setImageUrl] = useState<string | null>(null); // Store the uploaded image URL

    // Fetch list of schools from the database
    useEffect(() => {
        const fetchSchools = async () => {
            try {
                const response = await fetch("/api/schools");
                const data = await response.json();
                setSchools(data);
            } catch (error) {
                toast.error("Failed to fetch schools!");
                console.error("Error fetching schools:", error);
            }
        };

        fetchSchools();
    }, []);

    // onSubmit function to handle profile update
    const onSubmit = async (values: any) => {
        try {
            const data = {
                name: values.name,
                username: values.username,
                birthday: values.birthday,
                school: values.school,
                image: imageUrl || user.image, // Keep existing image if not changed
            };

            await axios.patch(`/api/update-profile`, data);
            
            toast.success("Profile updated successfully!");
            setOpen(false);
            reset(); // Reset form fields
            router.refresh();
        } catch (error: any) {
            if (error.response?.data?.error) {
                toast.error(`${error.response.data.error}`);
            } else {
                toast.error("Something went wrong!");
            }
            console.error(error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="link" className="text-blue-500 underline">
                    Edit Profile
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <div className="flex items-center justify-center gap-4">
                        {imagePreview ? (
                            <div className="relative aspect-video mt-2">
                                <Image
                                    alt="Upload"
                                    fill
                                    className="object-cover rounded-md"
                                    src={imagePreview}
                                />
                            </div>
                        ) : user.image ? (
                            <div className="relative aspect-video mt-2">
                                <Image
                                    alt="Profile Picture"
                                    fill
                                    className="object-cover rounded-md"
                                    src={user.image} // Use user image if available
                                />
                            </div>
                        ) : (
                            <div className="relative aspect-video mt-2 bg-slate-200">
                                <Image
                                    alt="No Image"
                                    fill
                                    className="object-cover rounded-md"
                                    src="/path/to/placeholder-image.jpg" // Default placeholder image
                                />
                            </div>
                        )}
                        <FileUpload
                            endpoint="profilePicture"
                            onChange={(url) => {
                                if (url) {
                                    setImageUrl(url); // Set the uploaded image URL
                                    setImagePreview(url); // Preview the uploaded image
                                    toast.success("Image uploaded successfully!");
                                } else {
                                    toast.error("Image upload failed!");
                                }
                            }}
                        />
                    </div>
                    <div>
                        <Label>Name</Label>
                        <Input defaultValue={user.name} {...register("name")} required />
                    </div>
                    <div>
                        <Label>Username</Label>
                        <Input defaultValue={user.username} {...register("username")} required />
                    </div>
                    <div>
                        <Label>Birthday</Label>
                        <Input type="date" defaultValue={user.birthday} {...register("birthday")} required />
                    </div>
                    <Button type="submit">Update Profile</Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}