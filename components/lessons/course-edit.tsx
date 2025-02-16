"use client";

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
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Loader2, Trash } from "lucide-react";
import { ComboBox } from "@/components/combo-box";
import PublishButton from "@/components/publish-button";
import Delete from "@/components/delete";
import RichEditor from "@/components/rich-editor";
import FileUpload from "@/components/file-upload";
import { Lesson } from "@prisma/client";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title is required and must be at least 2 characters long",
  }),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  categoryId: z.string().min(1, {
    message: "Category is required",
  }),
  subCategoryId: z.string().min(1, {
    message: "Subcategory is required",
  }),
  weekId: z.string().optional(),
  imageUrl: z.string().optional(),
  quarterId: z.string().optional(),
});

interface EditLessonFormProps {
  lesson: Lesson;
  categories: {
    label: string;
    value: string;
    subCategories: { label: string; value: string }[];
  }[];
  quarters: { label: string; value: string }[];
  weeks: { label: string; value: string }[];
  isCompleted: boolean;
}

const EditCourseForm = ({
  lesson,
  categories,
  weeks,
  quarters,
  isCompleted,
}: EditLessonFormProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { classId, lessonId } = useParams();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: lesson.title,
      subtitle: lesson.subtitle || "",
      description: lesson.description || "",
      categoryId: lesson.categoryId,
      subCategoryId: lesson.subCategoryId,
      imageUrl: lesson.imageUrl || "",
    },
  });

  const { isValid, isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch(`/api/lessons/${lesson.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update the lesson');
      }
  
      const updatedCourse = await response.json();
      toast.success("Course Updated!");
      router.push(`/teacher/classes/${classId}/lessons/${lessonId}/sections`)
      router.refresh();
    } catch (err) {
      console.log("Failed to update the lesson!", err);
      toast.error("Something went wrong!");
    }
  };

/*   const routes = [
    {
      label: "Lesson Information",
      path: `/teacher/classes/${classId}/lessons/${lesson.id}/basic`,
    },
    { label: "Content", path: `/teacher/classes/${classId}/lessons/${lesson.id}/sections` },
  ]; */

  return (
    <>
      <div className="flex flex-col gap-2 justify-end mb-7">
{/*         <div className="flex gap-5">
          {routes.map((route) => (
            <Link key={route.path} href={route.path}>
              <Button variant={pathname === route.path ? "default" : "outline"}>
                {route.label}
              </Button>
            </Link>
          ))}
        </div> */}

        <div className="flex gap-5 items-start justify-end">
          <PublishButton
            disabled={!isCompleted}
            lessonId={lesson.id}
            isPublished={lesson.isPublished}
            page="Course"
          />
          <Delete item="lesson" lessonId={lesson.id} />
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Title <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ex: Area and Volume"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="subtitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subtitle</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ex: Exploring the properties of a polygon."
                    {...field}
                  />
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
                <FormLabel>
                  Description <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <RichEditor
                    placeholder="What is this lesson about?"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-wrap gap-10">
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>
                    Category <span className="text-red-500">*</span>
                  </FormLabel>
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
                  <FormLabel>
                    Subcategory <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <ComboBox
                      options={
                        categories.find(
                          (category) =>
                            category.value === form.watch("categoryId")
                        )?.subCategories || []
                      }
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>



          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>
                  Lesson Banner <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <FileUpload
                    value={field.value || ""}
                    onChange={(url) => field.onChange(url)}
                    endpoint="lessonBanner"
                    page="Edit Course"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-5 pb-4">
            <Link href="/admin/data-management/lessons" passHref>
              <div>
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </div>
            </Link>
            <Button type="submit" disabled={!isValid || isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Save"
              )}
            </Button>
          </div>

        </form>
      </Form>
    </>
  );
};

export default EditCourseForm;