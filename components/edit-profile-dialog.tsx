"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import LoadingButton from "@/components/loading-button";
import ErrorMessage from "@/components/error-message";

import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { updateProfileSchema } from "@/lib/schema";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { useRouter } from "next/navigation";
import { auth } from "@/auth";

// Define types for form data and error state
interface UpdateProfileFormData {
    email: string;
    fname: string;
    lname: string;
    gender: string;
    bday: Date | null;
    school: string;
    id_no: string;
}

interface UserComponents {
    user: User | undefined; // Assuming User is the correct type for the user object
}

export default function UpdateProfile() {
    const [globalError, setGlobalError] = useState<string>("");
    const [userData, setUserData] = useState<any>(null); // Replace 'any' with an appropriate type for user data
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter();

    useEffect(() => {
        async function fetchUserData() {
            try {
                const user = await auth();
                console.log('Fetched user data:', user); // Log the user data to debug
                setUserData(user);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching user data:', error); // Log the error if any
                setGlobalError('Failed to fetch user data');
                setLoading(false);
            }
        }
    
        fetchUserData();
    }, []);    

    // Ensure userData is fetched before rendering the form
    if (loading || !userData) {
        return <div>Loading...</div>;
    }

    const form = useForm<UpdateProfileFormData>({
        resolver: zodResolver(updateProfileSchema),
        defaultValues: {
            bday: userData?.user.birthday ? new Date(userData?.user.birthday) : undefined,
            school: userData?.user.school || "",
            id_no: userData?.user.id_no || "",
        },
    });

    const { trigger, control, handleSubmit } = form;

    const onSubmit = async (values: UpdateProfileFormData) => {
        try {
            const { gender, bday, school, id_no } = values;
 
            const response = await fetch("/api/update-user", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ gender, bday, school, id_no }),
            });
    
            const result = await response.json();
    
            if (response.ok) {
                console.log("Profile updated successfully!");
                router.push("/teacher/profile");
            } else {
                setGlobalError(result.message || "An error occurred. Please try again.");
            }
        } catch (error) {
            setGlobalError("An unexpected error occurred. Please try again.");
        }
    };
    

    return (
        <div className="grow flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold text-center text-gray-800">
                        Update Profile
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                            {/* Email field (readonly) */}
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="geometriks@example.com"
                                                type="email"
                                                {...field}
                                                readOnly
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/* First Name */}
                            <FormField
                                control={form.control}
                                name="fname"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>First Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="John" type="text" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/* Last Name */}
                            <FormField
                                control={form.control}
                                name="lname"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Last Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Doe" type="text" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/* Gender */}
                            <FormField
                                control={form.control}
                                name="gender"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Gender</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select gender" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Male">Male</SelectItem>
                                                <SelectItem value="Female">Female</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/* Date of Birth */}
                            <FormField
                                control={form.control}
                                name="bday"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Date of Birth</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "pl-3 text-left font-normal",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value ? format(field.value, "PPP") : "Pick a date"}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value ?? undefined}
                                                    onSelect={(date) => field.onChange(date)}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/* School */}
                            <FormField
                                control={form.control}
                                name="school"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>School</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select school" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="SNHS">SNHS</SelectItem>
                                                <SelectItem value="BNHS">BNHS</SelectItem>
                                                <SelectItem value="MNCHS">MNCHS</SelectItem>
                                                <SelectItem value="BSNHS">BSNHS</SelectItem>
                                                <SelectItem value="PBNHS">PBNHS</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/* School ID */}
                            <FormField
                                control={form.control}
                                name="id_no"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>School ID</FormLabel>
                                        <FormControl>
                                            <Input placeholder="21B1569" type="text" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex flex-col">
                                {globalError && <ErrorMessage error={globalError} />}
                                <LoadingButton pending={form.formState.isSubmitting}>
                                    Update Profile
                                </LoadingButton>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
