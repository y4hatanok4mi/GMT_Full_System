"use client";

import { Course, Test } from "@prisma/client";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import axios from "axios";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title is required and must be at least 2 characters long",
  }),
  description: z.string().optional(),
});

const CreateTestForm = ({ course }: { course: Course }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { classId } = useParams();

/*   const routes = [
    { label: "Lesson Information", path: `/teacher/classes/${classId}/courses/${course.id}/basic` },
    { label: "Contents", path: `/teacher/classes/${classId}/courses/${course.id}/sections` },
    { label: "Exercises", path: `/teacher/classes/${classId}/courses/${course.id}/exercises` },
  ]; */

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const { isValid, isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post(`/api/courses/${course.id}/exercises`, values);
      router.push(`/teacher/classes/${classId}/courses/${course.id}/exercises/${response.data.id}/edit`);
      toast.success("Test created successfully!");
    } catch (err) {
      toast.error("Something went wrong while creating the test!");
      console.log("Failed to create the test", err);
    }
  };

  return (
    <div className="px-4 sm:px-6 md:px-10 py-6">
      {/* Responsive Navigation Buttons */}
{/*       <div className="flex flex-wrap gap-5 mb-5">
        {routes.map((route) => (
          <Link key={route.path} href={route.path}>
            <Button variant={pathname === route.path ? "default" : "outline"} className="flex-1 sm:flex-none">
              {route.label}
            </Button>
          </Link>
        ))}
      </div> */}

      <h1 className="text-sm md:text-2xl font-bold">Create Exercise for {course.title}</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-5">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Test Title</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Midterm Exam" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description (optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: This is the midterm for the course..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Responsive Button Layout */}
          <div className="flex flex-wrap gap-5">
            <Link href={`/teacher/classes/${classId}/courses`}>
              <Button variant="outline" type="button" className="w-full sm:w-auto">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={!isValid || isSubmitting}
              className="sm:w-auto md:w-1/2 lg:w-1/3 xl:w-1/4"
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateTestForm;
