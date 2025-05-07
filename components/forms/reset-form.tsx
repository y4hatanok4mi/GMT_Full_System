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

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { ResetSchema } from "@/lib/schema";
import LoadingButton from "@/components/loading-button";
import Link from "next/link";
import toast from "react-hot-toast";
import { handleResetPasswordRequest } from "@/app/actions/authActions";
import FloatingShape from "@/components/floating-shapes";

export default function ResetPasswordForm() {
  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof ResetSchema>) => {
    toast.dismiss();

    try {
      const result = await handleResetPasswordRequest({ email: values.email });

      if (result.success) {
        toast.success(result.message);
        form.reset();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-white dark:bg-black overflow-hidden">

      {/* Responsive Floating Shapes */}
      <FloatingShape
        color="bg-yellow-500"
        size="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24"
        position="top-[65%] left-[60%] sm:top-[50%] sm:left-[70%] md:top-[30%] md:left-[80%]"
        delay={1}
        shape="triangle"
        direction="reverse"
      />
      <FloatingShape
        color="bg-green-500"
        size="w-32 h-32 sm:w-40 sm:h-40 md:w-64 md:h-64"
        position="top-[-30%] left-[5%] sm:top-[-25%] sm:left-[10%] md:top-[-40%] md:left-[10%]"
        delay={0}
        shape="circle"
        direction="normal"
      />
      <FloatingShape
        color="bg-emerald-500"
        size="w-40 h-24 sm:w-48 sm:h-32 md:w-64 md:h-48"
        position="top-[-40%] left-[50%] sm:top-[-35%] sm:left-[55%] md:top-[-50%] md:left-[60%]"
        delay={0}
        shape="rectangle"
        direction="reverse"
      />
      <FloatingShape
        color="bg-lime-500"
        size="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48"
        position="top-[70%] left-[10%] sm:top-[60%] sm:left-[15%] md:top-[60%] md:left-[10%]"
        delay={0}
        shape="square"
        direction="normal"
      />
      <FloatingShape
        color="bg-pink-500"
        size="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48"
        position="top-[40%] left-[40%] sm:top-[45%] sm:left-[50%] md:top-[50%] md:left-[50%]"
        delay={0}
        shape="circle"
        direction="reverse"
      />

      <Card className="w-full max-w-md z-10 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
        <CardHeader className="flex flex-col items-center justify-center text-center">
          <CardTitle className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            <p>
              Geome<span className="text-green-700 dark:text-green-400">Triks</span>
            </p>
          </CardTitle>
          <p className="mt-2 font-semibold text-gray-700 dark:text-gray-300">
            Forgot Password
          </p>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-800 dark:text-gray-200">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your registered email"
                        autoComplete="off"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <LoadingButton pending={form.formState.isSubmitting}>
                Send Request
              </LoadingButton>
            </form>
          </Form>

          <div className="flex flex-col justify-center items-center mt-2">
            <p className="text-sm flex justify-center text-gray-700 dark:text-gray-300">
              <Link href={"/auth/signin"} className="text-green-400 hover:underline">
                Back to Sign In
              </Link>
            </p>
            <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">
              @GeomeTriks
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
