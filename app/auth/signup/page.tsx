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

import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signUpSchema } from "@/lib/schema";
import { handleSignUp } from "@/app/actions/authActions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Calendar as CalendarIcon
} from "lucide-react";
import Calendar from "react-calendar"; // Import react-calendar
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

  const { trigger, control, handleSubmit } = form;

  const onSubmit = async (values: z.infer<typeof signUpSchema>) => {
    try {
      const result: ServerActionResponse = await handleSignUp(values);
      if (result.success) {
        console.log("Account created successfully!");
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
    <div className="relative grow flex items-center justify-center p-4">
      {/* Background Shapes */}
      <FloatingShape
                color="bg-yellow-500"
                size=""
                top="30%"
                left="80%"
                delay={1}
                shape="triangle"
                direction="reverse"
            />
            <FloatingShape color='bg-green-500' size='w-64 h-64' top='50%' left='10%' delay={0} shape='circle' direction="normal" />
            <FloatingShape color='bg-emerald-500' size='w-64 h-48' top='5%' left='10%' delay={0} shape='rectangle' direction="reverse" />
            <FloatingShape color='bg-lime-500' size='w-48 h-48' top='5%' left='50%'  delay={0} shape='square' direction="normal" />
            <FloatingShape color='bg-pink-500' size='w-48 h-48' top='50%' left='50%' delay={0} shape='circle' direction="reverse" />
      <Card className="w-full max-w-md relative z-10">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-gray-800">
            Geome<span className="text-green-600">Triks</span>
            <p className="text-2xl text-gray-700">Create Account</p>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-3"
            >
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
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-6">
                  <FormField
                    control={form.control}
                    name="fname"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="John"
                            type="text"
                            {...field}
                          />
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
                          <Input
                            placeholder="Doe"
                            type="text"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
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
              
              <FormField
                control={form.control}
                name="bday"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        value={field.value ? new Date(field.value).toISOString().split("T")[0] : ""}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />


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
                        <SelectItem value="SNHS">Sayao National High School</SelectItem>
                        <SelectItem value="BNHS">Balanacan National High School</SelectItem>
                        <SelectItem value="MNCHS">Mogpog National Comprehensive High School</SelectItem>
                        <SelectItem value="BSNHS">Butansapa National High School</SelectItem>
                        <SelectItem value="PBNHS">Puting Buhangin National High School</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="id_no"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ID Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="21B1569"
                        type="text"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-col">
                {globalError && <ErrorMessage error={globalError} />}
                <LoadingButton
                  pending={form.formState.isSubmitting}
                >
                  Sign Up
                </LoadingButton>
              </div>
            </form>
          </Form>
          <div className="flex justify-center items-center mt-2">
            <p className='text-sm flex justify-center'>
              Already have an account? {" "}
              <Link href={"/auth/signin"} className='text-green-400 hover:underline'>
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
      <SignUpSuccessModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
