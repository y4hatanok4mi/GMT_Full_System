"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import React from 'react';

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
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { ComboBox } from "@/components/combo-box";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title is required and minimum 2 characters",
  }),
  categoryId: z.string().min(1, {
    message: "Category is required",
  }),
  subCategoryId: z.string().min(1, {
    message: "Subcategory is required",
  }),
  quarterId: z.string().min(1, {
    message: "Quarter is required",
  }),
});

interface CreateCourseFormProps {
  categories: {
    label: string;
    value: string;
    subCategories: { label: string; value: string }[];
  }[];
  quarters: { label: string; value: string }[];
}

const CreateCourseForm = ({ categories, quarters }: CreateCourseFormProps) => {
  const router = useRouter();
  const { classId } = useParams();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      categoryId: "",
      subCategoryId: "",
      quarterId: "",
    },
  });

  const { isValid, isSubmitting } = form.formState;

  const selectedCategoryId = form.watch("categoryId");

  const filteredSubCategories = categories.find(
    (category) => category.value === selectedCategoryId
  )?.subCategories || [];

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post("/api/courses", values);
      console.log(response.data);
      if (response.data && response.data.course && response.data.course.id) {
        const courseId = response.data.course.id; // Access course.id
        router.push(`/teacher/classes/${classId}/courses/${courseId}/basic`);
        router.refresh();
        toast.success("New Course Created!");
      } else {
        toast.error("Course ID missing in response.");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || "Something went wrong!");
      } else {
        toast.error("Unexpected error occurred!");
      }
    }
  };
  

  return (
    <div className="p-10">
      <h1 className="text-xl font-bold">
        Provide information for your lessons
      </h1>
      <p className="text-sm mt-3">
        It is ok if you cannot think of a good title or correct category now.
        You can change them later.
      </p>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 mt-10"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ex: Area of Polygons"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <ComboBox options={categories} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="subCategoryId"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Subcategory</FormLabel>
                <FormControl>
                  <ComboBox
                    options={filteredSubCategories}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="quarterId"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>
                  Quarter <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <ComboBox options={quarters} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={!isValid || isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Create"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CreateCourseForm;