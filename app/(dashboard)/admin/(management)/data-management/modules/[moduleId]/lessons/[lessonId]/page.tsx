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
import { BookOpen, ListChecks } from "lucide-react";
import { LessonTitleForm } from "@/components/lessons/title-form";
import { ChaptersForm } from "@/components/lessons/chapters-form";
import { QuestionsForm } from "@/components/lessons/questions-form";
import PublishButton from "@/components/publish-button";
import Delete from "@/components/delete";
import IconCircle from "@/components/icon-bg";
import RequiredFieldStatus from "@/components/required-field";

const LessonsPage = async ({
  params,
}: {
  params: { moduleId: string; lessonId: string; };
}) => {
  const { moduleId, lessonId } = params;

  if (!moduleId) {
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

  if (!moduleData) {
    notFound();
  }

  const lesson = await prisma.lesson.findUnique({
    where: {
      id: lessonId,
    },
    include: {
      chapter: true,
      question: {
        include: {
          options: true,
        },
      }
    },
  });

  if (!lesson) {
    notFound();
  }

  const requiredFields = [
    lesson?.title,
    lesson?.chapter.length > 0,
    lesson?.question.length > 0,
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
    <div className="dark:bg-slate-900 dark:text-white">
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 justify-between">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink
                    href={`/admin/data-management/modules/${moduleId}`}
                  >
                    {moduleData.name}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Lessons Management</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="px-6 pb-6">
          <div className="flex justify-between">
            <h1 className="text-2xl font-bold">Lesson Setup</h1>
            <div className="flex gap-5 items-start justify-end">
              <PublishButton
                disabled={!isCompleted}
                lessonId={lesson.id}
                moduleId={moduleId}
                isPublished={lesson.isPublished}
                page="Lesson"
              />
              <Delete item="lesson" lessonId={lesson.id} moduleId={moduleId}/>
            </div>
          </div>
          <div className="gap-6 mt-4 space-y-6">
            <div>
              <div className="flex items-center gap-x-2">
                <IconCircle
                  Icon={BookOpen}
                  size={24}
                  bgColor="bg-green-500 dark:bg-green-700"
                  iconColor="text-slate-200"
                />
                <h2>Customize Lesson</h2>
              </div>
              <RequiredFieldStatus isCompleted={Boolean(lesson?.title)} />
              <LessonTitleForm
                initialData={lesson}
                lessonId={lesson.id}
                moduleId={moduleId}
              />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconCircle
                  Icon={ListChecks}
                  size={24}
                  bgColor="bg-green-500 dark:bg-green-700"
                  iconColor="text-slate-200"
                />
                <h2>Lesson Chapters</h2>
              </div>
              <div>
                <RequiredFieldStatus
                  isCompleted={Boolean(lesson?.chapter.length)}
                />
                <ChaptersForm
                  initialData={lesson}
                  lessonId={lesson.id}
                  moduleId={moduleId}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconCircle
                  Icon={ListChecks}
                  size={24}
                  bgColor="bg-green-500 dark:bg-green-700"
                  iconColor="text-slate-200"
                />
                <h2>Lesson Questions</h2>
              </div>
              <div>
                <RequiredFieldStatus
                  isCompleted={Boolean(lesson?.question.length)}
                />
                <QuestionsForm
                  initialData={lesson}
                  lessonId={lesson.id}
                  moduleId={moduleId}
                />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </div>
  );
};

export default LessonsPage;
