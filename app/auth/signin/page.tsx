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

import { signInSchema } from "@/lib/schema";
import LoadingButton from "@/components/loading-button";
import { handleCredentialsSignin } from "@/app/actions/authActions";
import { useState, useEffect } from "react";
import ErrorMessage from "@/components/error-message";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { getSession, useSession } from "next-auth/react";
import FloatingShape from "@/components/floating-shapes";

export default function SignIn() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  const [globalError, setGlobalError] = useState<string>("");

  const onSubmit = async (values: z.infer<typeof signInSchema>) => {
    try {
      const result = await handleCredentialsSignin(values);

      if (result?.error) {
        setGlobalError(result.error);
        return;
      }

      const updatedSession = await getSession();

      if (updatedSession?.user?.role) {
        router.push(`/${updatedSession.user.role}`);
        router.refresh();
      } else {
        setGlobalError("User role not found. Please contact support.");
      }
    } catch (error) {
      console.error("An unexpected error occurred: ", error);
    }
  };

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role) {
      const role = session.user.role;
      const targetRoute = `/${role}`;

      if (pathname !== targetRoute) {
        router.push(targetRoute);
      }
    }
  }, [status, session, pathname, router]);

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      id_no: "",
      password: "",
    },
  });

  return (
    <div className="flex min-h-screen w-full items-center justify-center px-4 py-8 overflow-x-hidden">
      {/* Floating Shapes - hidden on mobile */}
      <FloatingShape
        color="bg-yellow-500"
        size="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24"
        top="30%"
        left="80%"
        delay={1}
        shape="triangle"
        direction="reverse"
      />

      <FloatingShape
        color="bg-green-500"
        size="w-32 h-32 sm:w-40 sm:h-40 md:w-64 md:h-64"
        top="-40%"
        left="10%"
        delay={0}
        shape="circle"
        direction="normal"
      />

      <FloatingShape
        color="bg-emerald-500"
        size="w-40 h-24 sm:w-48 sm:h-32 md:w-64 md:h-48"
        top="-50%"
        left="60%"
        delay={0}
        shape="rectangle"
        direction="reverse"
      />

      <FloatingShape
        color="bg-lime-500"
        size="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48"
        top="60%"
        left="10%"
        delay={0}
        shape="square"
        direction="normal"
      />

      <FloatingShape
        color="bg-pink-500"
        size="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48"
        top="50%"
        left="50%"
        delay={0}
        shape="circle"
        direction="reverse"
      />

      {/* Sign In Card */}
      <Card className="w-full max-w-lg sm:max-w-xl md:max-w-2xl relative z-10 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl sm:text-3xl font-bold text-center text-slate-900 dark:text-slate-100">
            Geome<span className="text-green-600">Triks</span>
            <p className="text-lg sm:text-xl font-normal text-slate-900 dark:text-slate-100 mt-1">
              Sign In
            </p>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="id_no"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ID No.</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter your ID No."
                        autoComplete="off"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {globalError && <ErrorMessage error={globalError} />}

              <LoadingButton pending={form.formState.isSubmitting}>
                Sign In
              </LoadingButton>
            </form>
          </Form>

          <div className="flex flex-col justify-center items-center mt-4">
            <p className="text-sm text-center">
              Don&apos;t have an account?{" "}
              <Link
                href={"/auth/signup"}
                className="text-green-400 hover:underline"
              >
                Sign up
              </Link>
            </p>
            <p className="text-xs mt-1 text-gray-500">@GeomeTriks</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
