"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Resource, Section } from "@prisma/client";
import Link from "next/link";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ArrowLeft, ChevronLeft, Loader2 } from "lucide-react";

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
import PublishButton from "../publish-button";
import Delete from "../delete";
import RichEditor from "../rich-editor";
import ResourceForm from "./resource";
import FileUpload from "../file-upload";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "@/components/ui/breadcrumb";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title is required and must be at least 2 characters long",
  }),
  description: z.string().optional(),
  videoUrl: z.string().optional(),
  imageUrl: z.string().optional(),
  imageDescription: z.string().optional(),
});

interface EditSectionFormProps {
  section: Section & { resources: Resource[] };
  courseId: string;
  isCompleted: boolean;
}

const EditSectionForm = ({
  section,
  courseId,
  isCompleted,
}: EditSectionFormProps) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: section.title,
      description: section.description || "",
      videoUrl: section.videoUrl || "",
      imageUrl: section.imageUrl || "",
      imageDescription: section.imageDescription || "",
    },
  });

  const { isValid, isSubmitting } = form.formState;
  const { classId } = useParams();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(
        `/api/courses/${courseId}/sections/${section.id}`,
        values
      );
      toast.success("Content Updated!");
      router.push(`/teacher/classes/${classId}/courses/${courseId}/basic`)
      router.refresh();
    } catch (err) {
      console.error("Failed to update the section", err);
      toast.error("Something went wrong!");
    }
  };

/*   const renderYouTubeEmbed = (url: string) => {
    const videoId = url.split("v=")[1]?.split("&")[0] || url.split("/").pop();
    return videoId ? (
      <iframe
        width="600"
        height="315"
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="mt-5"
      />
    ) : (
      <p className="text-red-500">Invalid YouTube URL</p>
    );
  }; */

  return (
    <>
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-between mb-7">
        <div>
          <Breadcrumb>
              <BreadcrumbList>
                <ChevronLeft/>
                <BreadcrumbItem>
                  <BreadcrumbLink href={`/teacher/classes/${classId}/courses/${courseId}/sections`}>Contents</BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

        <div className="flex gap-5 items-start">
          <PublishButton
            disabled={!isCompleted}
            courseId={courseId}
            sectionId={section.id}
            isPublished={section.isPublished}
            page="Section"
          />
          <Delete item="section" courseId={courseId} sectionId={section.id} />
        </div>
      </div>

      <h1 className="text-xl font-bold">Content Details</h1>
      <p className="text-sm font-medium mt-2">
        Complete this content with detailed information to give your students the best learning experience.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-5">
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
                    placeholder="Ex: Introduction to Area"
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
                    placeholder="What is this content about?"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>
                  Image <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <FileUpload
                    value={field.value || ""}
                    onChange={(url) => field.onChange(url)}
                    endpoint="courseBanner"
                    page="Edit Course"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="videoUrl"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>
                  Video <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <FileUpload
                    value={field.value || ""}
                    onChange={(url) => field.onChange(url)}
                    endpoint="sectionVideo"
                    page="Edit Section"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />  


          <FormField
            control={form.control}
            name="imageDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Description <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <RichEditor
                    placeholder="What is this image about?"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-5">
            <Link href={`/teacher/classes/${classId}/courses/${courseId}/sections`}>
              <Button variant="outline" type="button">
                Cancel
              </Button>
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

      <ResourceForm section={section} courseId={courseId} />
    </>
  );
};

export default EditSectionForm;