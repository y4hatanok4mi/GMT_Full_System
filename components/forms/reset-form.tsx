"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { GitHubLogoIcon } from "@radix-ui/react-icons";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { ResetSchema } from "@/lib/schema";
import LoadingButton from "@/components/loading-button";
import { useState } from "react";
import ErrorMessage from "@/components/error-message";
import Link from "next/link";

export default function ResetPasswordForm () {

    const [globalError, setGlobalError] = useState<string>("");
    
    const onSubmit = async (values: z.infer<typeof ResetSchema>) => {
        /* try {
            const result = await handleCredentialsSignin(values);
            
            if (result?.error) {
                setGlobalError(result.error);
                return;
            }
    
            const updatedSession = await getSession();
    
            if (updatedSession?.user?.role) {
                router.push(`/${updatedSession.user.role}`);
            } else {
                setGlobalError("User role not found. Please contact support.");
            }
        } catch (error) {
            console.error("An unexpected error occurred: ", error);
            setGlobalError("An unexpected error occurred. Please try again.");
        } */
    };

    const form = useForm<z.infer<typeof ResetSchema>>({
        resolver: zodResolver(ResetSchema),
        defaultValues: {
            email: "",
        },
    });

    return (
        <div className="grow flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
            <CardHeader className="flex flex-col items-center justify-center text-center">
                <CardTitle className="text-3xl font-bold text-gray-800">
                    <p>Geome<span className="text-green-700">Triks</span></p>
                </CardTitle>
                <p className="mt-2 font-semibold">Forgot Password</p>
            </CardHeader>

                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-4"
                        >
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="email"
                                                placeholder="Enter your email"
                                                autoComplete="off"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            
                             {globalError && <ErrorMessage error={globalError} />}
                            <LoadingButton
                                pending={form.formState.isSubmitting}
                            >
                                Send Request
                            </LoadingButton>
                        </form>
                    </Form>

                    <div className="flex flex-col justify-center items-center mt-2">
                        <p className="text-sm flex justify-center">
                        <Link href={"/auth/signin"} className="text-green-400 hover:underline">
                            Back to Sign In
                        </Link>
                        </p>
                        <p className="text-xs mt-1 text-gray-500">@GeomeTriks</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
