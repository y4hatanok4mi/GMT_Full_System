import { auth } from "@/auth";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import prisma from "@/lib/prisma";
import { BookText, ListChecks } from "lucide-react";
import { notFound, redirect } from "next/navigation";
import { TitleForm } from "@/components/modules/title-form";
import { DescriptionForm } from "@/components/modules/description-form";
import { ImageForm } from "@/components/modules/image-form";
import { LessonsForm } from "@/components/modules/lesson-form";
import PublishButton from "@/components/publish-button";
import Delete from "@/components/delete";
import IconCircle from "@/components/icon-bg";
import RequiredFieldStatus from "@/components/required-field";

export default async function ModulePage({
  params,
}: {
  params: { moduleId: string; lessonId: string };
}) {
  const { moduleId, lessonId } = params;

  if (!moduleId) {
    notFound();
  }

  const moduleData = await prisma.module.findUnique({
    where: {
      id: moduleId,
    },
    include: {
      lesson: true
    },
  });

  if (!moduleData) {
    notFound();
  }

  const user = await auth();
  const userId = user?.user.id;

  if (!userId) {
    return redirect("/auth/signin");
  }

  const requiredFields = [
    moduleData?.name,
    moduleData?.description,
    moduleData?.imageUrl,
    moduleData?.lesson.length > 0,
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
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center justify-between gap-2 px-4 h-full w-full">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href={`/admin/data-management/modules`}>
                      Module Management
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbPage>{moduleData.name}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </div>
        </header>
        <div className="px-6 pb-6">
          <div className="flex justify-between">
            <h1 className="text-2xl font-bold">Module Setup</h1>
            <div className="flex gap-5 items-start justify-end">
              <PublishButton
                disabled={!isCompleted}
                lessonId={lessonId}
                moduleId={moduleId}
                isPublished={moduleData.isPublished}
                page="Module"
              />
              <Delete item="module" moduleId={moduleId} lessonId={lessonId} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div>
              <div className="flex items-center gap-x-2">
                <IconCircle
                  Icon={BookText}
                  size={24}
                  bgColor="bg-green-500"
                  iconColor="text-white"
                />
                <h2>Customize your module</h2>
              </div>
              <RequiredFieldStatus isCompleted={Boolean(moduleData?.name)} />
              <TitleForm initialData={moduleData} moduleId={moduleId} />
              <RequiredFieldStatus isCompleted={Boolean(moduleData?.description)} />
              <DescriptionForm initialData={moduleData} moduleId={moduleId} />
              <RequiredFieldStatus isCompleted={Boolean(moduleData?.imageUrl)} />
              <ImageForm initialData={moduleData} moduleId={moduleId} />
            </div>
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-x-2">
                  <IconCircle
                    Icon={ListChecks}
                    size={24}
                    bgColor="bg-green-500"
                    iconColor="text-white"
                  />
                  <h2>Module Lessons</h2>
                </div>
                <RequiredFieldStatus isCompleted={Boolean(moduleData?.lesson.length)} />
                <LessonsForm initialData={moduleData} moduleId={moduleId} />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </div>
  );
}