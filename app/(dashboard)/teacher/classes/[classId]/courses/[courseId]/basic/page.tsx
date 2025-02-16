import { auth } from "@/auth";
import AlertBanner from "@/components/alert-banner";
import EditCourseForm from "@/components/lessons/course-edit";
import prisma from "@/lib/prisma";
import { redirect, useParams } from "next/navigation";

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

const CourseBasics = async ({ params }: { params: { courseId: string, classId: string } }) => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return redirect("/auth/signin");
  }

  if (!params.courseId) {
    return redirect(`/teacher/classes/${params.classId}/courses`);
  }

  const course = await prisma.course.findUnique({
    where: {
      id: params.courseId,
      instructorId: userId,
    },
    include: {
      sections: true,
    },
  });

  if (!course) {
    return redirect(`/teacher/classes/${params.classId}/courses`);
  }

  const categories = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
    include: {
      subCategories: true,
    },
  });

  const weeks = await prisma.week.findMany();
  const quarters = await prisma.quarter.findMany();

  const requiredFields = [
    course?.title,
    course?.description,
    course?.categoryId,
    course?.subCategoryId,
    course?.weekId,
    course?.imageUrl,
    course?.quarterId,
    course.sections.some((section) => section.isPublished),
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
          <header className="flex h-16 shrink-0 items-center gap-2">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href={`/teacher/classes/${params.classId}/courses`}>Lesson Management</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Lessons Creation</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          <div className="px-10">
          <div className="flex items-center justify-end">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href={`/teacher/classes/${params.classId}/courses/${course.id}/sections`}>Contents</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator/>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <AlertBanner
              isCompleted={isCompleted}
              missingFieldsCount={missingFieldsCount}
              requiredFieldsCount={requiredFieldsCount}
            />
            <EditCourseForm
              course={course}
              categories={categories.map((category) => ({
                label: category.name,
                value: category.id,
                subCategories: category.subCategories.map((subcategory) => ({
                  label: subcategory.name,
                  value: subcategory.id,
                })),
              }))}
              quarters={quarters.map((quarter) => ({
                label: quarter.name,
                value: quarter.id,
              }))}
              weeks={weeks.map((week) => ({
                label: week.name,
                value: week.id,
              }))}
              isCompleted={isCompleted}
            />
          </div>
        </SidebarInset>
      </div>
    </div>
  );
};

export default CourseBasics;