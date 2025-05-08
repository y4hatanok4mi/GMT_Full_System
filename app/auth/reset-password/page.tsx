"use client"; // Ensure client-side rendering

import { useState, useEffect, Suspense } from "react"; // Add Suspense import
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import LoadingButton from "@/components/loading-button";
import ErrorMessage from "@/components/error-message";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ResetPasswordSchema } from "@/lib/schema";
import { PasswordInput } from "@/components/ui/password-input";
import { useRouter, useSearchParams } from "next/navigation"; // Ensure useSearchParams is used properly
import PasswordStrengthMeter from "@/components/password-meter";
import FloatingShape from "@/components/floating-shapes";
import { Input } from "@/components/ui/input";
import { handleResetPassword } from "@/app/actions/authActions";
import toast from "react-hot-toast";

// Component to wrap useSearchParams
function ResetPasswordWrapper() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  return <ResetPassword email={email} />;
}

export default function ResetPassword({ email }: { email: string | null }) {
  const [globalError, setGlobalError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      email: email || "",
      password: "",
      confirmPassword: "",
    },
  });

  const { trigger, control } = form;

  useEffect(() => {
    if (!email) {
      setGlobalError("Invalid reset link. Please check the URL.");
    }
  }, [email]);

  const onSubmit = async (values: z.infer<typeof ResetPasswordSchema>) => {
    try {
      const result: ServerActionResponse = await handleResetPassword({
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
      });

      if (result.success) {
        toast.success("Password successfully reset!");
        setIsModalOpen(true);
        setTimeout(() => {
          router.push("/auth/signin");
        }, 2000);
      } else {
        toast.error(result.message || "Failed to reset password.");
        setGlobalError(result.message);
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
      setGlobalError("An unexpected error occurred. Please try again.");
    }
  };

  const validateConfirmPassword = async () => {
    await trigger("confirmPassword");
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative p-4 bg-white dark:bg-black overflow-x-hidden">
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

      <Card className="w-full max-w-md relative z-10">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-slate-900 dark:text-slate-100">
            Geome<span className="text-green-600">Triks</span>
            <p className="text-lg sm:text-xl font-normal text-slate-900 dark:text-slate-100 mt-1">
              Reset Password
            </p>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              {/* Email (Read-Only) */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} disabled placeholder="Your email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <PasswordInput placeholder="********" {...field} />
                    </FormControl>
                    <FormMessage />
                    <PasswordStrengthMeter password={field.value || ""} />
                  </FormItem>
                )}
              />

              {/* Confirm Password */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder="Confirm your password"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          validateConfirmPassword();
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit & Error */}
              <div className="flex flex-col">
                {globalError && <ErrorMessage error={globalError} />}
                <LoadingButton pending={form.formState.isSubmitting}>
                  Reset Password
                </LoadingButton>
              </div>
            </form>
          </Form>

          {/* Bottom Link */}
          <p className="text-xs mt-2 text-center text-gray-500">@GeomeTriks</p>
        </CardContent>
      </Card>
    </div>
  );
}

export function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordWrapper />
    </Suspense>
  );
}
