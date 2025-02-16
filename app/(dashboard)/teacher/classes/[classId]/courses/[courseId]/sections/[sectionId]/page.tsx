import { auth } from "@/auth";
import AlertBanner from "@/components/alert-banner";
import EditSectionForm from "@/components/sections/section-edit";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
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

const SectionDetailsPage = async ({
  params,
}: {
  params: { courseId: string; sectionId: string, classId: string };
}) => {
  const user = await auth();
  const userId = user?.user.id;

  if (!userId) {
    return redirect("/auth/signin");
  }

  const course = await prisma.course.findUnique({
    where: {
      id: params.courseId,
      instructorId: userId,
    },
  });

  if (!course) {
    return redirect(`/teacher/classes/${params.classId}/courses`);
  }

  const section = await prisma.section.findUnique({
    where: {
      id: params.sectionId,
      courseId: params.courseId,
    },
    include: {
      resources: true,
    },
  });

  if (!section) {
    return redirect(`/teacher/classes/${params.classId}/courses/${params.courseId}/sections`);
  }

  const requiredFields = [
    section.title, 
    section.description, 
    section.videoUrl,
    section.imageUrl,
    section.imageDescription
  ];
  
  const requiredFieldsCount = requiredFields.length;
  const missingFields = requiredFields.filter((field) => !Boolean(field));
  const missingFieldsCount = missingFields.length;
  const isCompleted = requiredFields.every(Boolean);

  return (
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
      <AlertBanner
        isCompleted={isCompleted}
        requiredFieldsCount={requiredFieldsCount}
        missingFieldsCount={missingFieldsCount}
      />
      <EditSectionForm
        section={section}
        courseId={params.courseId}
        isCompleted={isCompleted}
      />
    </div>
    </SidebarInset>
  </div>
  );
};

export default SectionDetailsPage;