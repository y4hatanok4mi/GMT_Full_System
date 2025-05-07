"use client";

import { useState } from "react";
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
import LoadingButton from "@/components/loading-button";
import ErrorMessage from "@/components/error-message";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signUpSchema } from "@/lib/schema";
import { handleSignUp } from "@/app/actions/authActions";
import { PasswordInput } from "@/components/ui/password-input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PasswordStrengthMeter from "@/components/password-meter";
import SignUpSuccessModal from "@/components/email-verification-modal";
import FloatingShape from "@/components/floating-shapes";

export default function SignUp() {
  const [globalError, setGlobalError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fname: "",
      lname: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "student",
      id_no: "",
    },
  });

  const { trigger, control } = form;

  const onSubmit = async (values: z.infer<typeof signUpSchema>) => {
    try {
      const result: ServerActionResponse = await handleSignUp(values);
      if (result.success) {
        setIsModalOpen(true);
        setTimeout(() => {
          router.push("/auth/verification");
        }, 2000);
      } else {
        setGlobalError(result.message);
      }
    } catch (error) {
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
              Create Account
            </p>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              {/* Email */}
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
                      />
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

              {/* Name */}
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-6">
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
                </div>
                <div className="col-span-6">
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
                </div>
              </div>

              {/* Gender */}
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className="w-full border rounded-md px-3 py-2 dark:bg-black dark:text-white"
                      >
                        <option value="">Select gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Birthday */}
              <FormField
                control={form.control}
                name="bday"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        value={
                          field.value
                            ? new Date(field.value).toISOString().split("T")[0]
                            : ""
                        }
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
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
                    <FormControl>
                      <select
                        {...field}
                        className="w-full border rounded-md px-3 py-2 dark:bg-black dark:text-white"
                      >
                        <option value="">Select school</option>
                        <option value="SNHS">Sayao National High School</option>
                        <option value="BNHS">
                          Balanacan National High School
                        </option>
                        <option value="MNCHS">
                          Mogpog National Comprehensive High School
                        </option>
                        <option value="BSNHS">
                          Butansapa National High School
                        </option>
                        <option value="PBNHS">
                          Puting Buhangin National High School
                        </option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* ID Number */}
              <FormField
                control={form.control}
                name="id_no"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ID Number</FormLabel>
                    <FormControl>
                      <Input placeholder="21B1569" type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit & Error */}
              <div className="flex flex-col">
                {globalError && <ErrorMessage error={globalError} />}
                <LoadingButton pending={form.formState.isSubmitting}>
                  Sign Up
                </LoadingButton>
              </div>
            </form>
          </Form>

          {/* Bottom Link */}
          <div className="flex flex-col justify-center items-center mt-2">
            <p className="text-sm">
              Already have an account?{" "}
              <Link
                href="/auth/signin"
                className="text-green-400 hover:underline"
              >
                Sign in
              </Link>
            </p>
            <p className="text-xs mt-1 text-gray-500">@GeomeTriks</p>
          </div>
        </CardContent>
      </Card>

      <SignUpSuccessModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
