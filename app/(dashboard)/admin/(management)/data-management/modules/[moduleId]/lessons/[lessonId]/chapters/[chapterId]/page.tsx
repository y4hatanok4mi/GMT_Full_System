import { notFound, redirect } from "next/navigation";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@radix-ui/react-separator";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { BookOpen } from "lucide-react";
import { ChapterTitleForm } from "@/components/chapters/title-form";
import { ChapterImageForm } from "@/components/chapters/image-form";
import { ChapterVideoForm } from "@/components/chapters/video-form";
import { ChapterDiscussionForm } from "@/components/chapters/discussion-form";
import LessonDelete from "@/components/lesson-delete";
import PublishButton from "@/components/chapter-publish-button";
import { ChapterCategoryForm } from "@/components/lessons/category-form";
import ChapterDelete from "@/components/chapter-delete";

const ChaptersPage = async ({
  params,
}: {
  params: { moduleId: string; lessonId: string; chapterId: string };
}) => {
  const { moduleId, lessonId, chapterId } = params;

  if (!chapterId) {
    notFound();
  }

  const user = await auth();
  const userId = user?.user.id;

  if (!userId) {
    return redirect("/auth/signin");
  }

  const moduleData = await prisma.module.findUnique({
    where: {
      id: moduleId,
    },
  });

  const chapter = await prisma.chapter.findUnique({
    where: {
      id: chapterId,
    },
  });

  if (!chapter) {
    notFound();
  }

  const categories = await prisma.category.findMany();

  const requiredFields = [
    chapter?.title,
    chapter?.description,
    /*     lesson.lesson.some((lesson) => lesson.isPublished), */
  ];

  const requiredFieldsCount = requiredFields.length;
  const missingFields = requiredFields.filter((field) => !Boolean(field));
  const missingFieldsCount = missingFields.length;
  const isCompleted = requiredFields.every(Boolean);

  console.log("Required Fields:", requiredFields);
  console.log("Missing Fields:", missingFields);
  console.log("Missing Fields Count:", missingFieldsCount);
  console.log("Required Fields Count:", requiredFieldsCount);

  return (
    <div>
      <div>
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 justify-between">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink
                      href={`/admin/data-management/modules/${moduleId}/lessons/${lessonId}`}
                    >
                      {moduleData?.name}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink
                      href={`/admin/data-management/modules/${moduleId}/lessons/${lessonId}`}
                    >
                      Lesson Management
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Chapter Management</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          <div className="px-6 pb-6">
            <div className="flex justify-between">
              <h1 className="text-2xl font-bold">Chapter Setup</h1>
              <div className="flex gap-5 items-start justify-end">
                <PublishButton
                  disabled={!isCompleted}
                  lessonId={lessonId}
                  moduleId={moduleId}
                  chapterId={chapterId}
                  isPublished={chapter.isPublished}
                  page="Chapter"
                />
                <ChapterDelete
                  chapterId={chapter.id}
                  lessonId={lessonId}
                  moduleId={moduleId}
                />
              </div>
            </div>
            <div className="gap-6 mt-4">
              <div>
                <div className="flex items-center gap-x-2">
                  <BookOpen className="size-8" />
                  <h2>Customize chapter</h2>
                </div>
                <ChapterTitleForm
                  initialData={chapter}
                  chapterId={chapter.id}
                  lessonId={lessonId}
                  moduleId={moduleId}
                />

                <ChapterCategoryForm
                  initialData={chapter}
                  chapterId={chapterId}
                  lessonId={lessonId}
                  moduleId={moduleId}
                  options={categories.map((category) => ({
                    label: category.name,
                    value: category.id,
                  }))}
                />

                <ChapterDiscussionForm
                  initialData={chapter}
                  chapterId={chapter.id}
                  lessonId={lessonId}
                  moduleId={moduleId}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ChapterImageForm
                    initialData={chapter}
                    chapterId={chapter.id}
                    lessonId={lessonId}
                    moduleId={moduleId}
                  />
                  <ChapterVideoForm
                    initialData={chapter}
                    chapterId={chapter.id}
                    lessonId={lessonId}
                    moduleId={moduleId}
                  />
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </div>
    </div>
  );
};

export default ChaptersPage;
