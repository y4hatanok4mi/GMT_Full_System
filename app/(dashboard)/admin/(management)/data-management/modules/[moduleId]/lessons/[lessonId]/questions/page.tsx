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

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import CreateTestForm from "@/components/exercises/exercise-create";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

const CourseCurriculumPage = async ({ params }: { params: { courseId: string, classId: string } }) => {
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
    include: {
      sections: {
        orderBy: {
          position: "asc",
        },
      },
      // Fetch the tests related to this course
      tests: {
        orderBy: {
          createdAt: "desc", // Assuming you have a `createdAt` field to order by
        },
      },
    },
  });

  if (!course) {
    return redirect(`/teacher/classes/${params.classId}/courses`);
  }

  return (
    <div className="container mx-auto px-4">
      <SidebarInset>
        <header className="flex flex-col mt-2 md:flex-row items-start md:items-center gap-4 md:gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href={`/teacher/classes/${params.classId}/courses`}>Lesson Creation</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbLink href={`/teacher/classes/${params.classId}/courses/${params.courseId}/sections`}>Contents</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Exercises</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="mt-4 pl-4">
          <Breadcrumb>
            <BreadcrumbList>
              <ChevronLeft />
              <BreadcrumbItem>
                <BreadcrumbLink href={`/teacher/classes/${params.classId}/courses/${course.id}/sections`}>Contents</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        {/* Content Container */}
        <div className="my-3 px-8">
          <h2 className="text-2xl font-bold mb-4">Created Tests</h2>
          <div className="bg-white shadow-sm rounded-lg p-4">
            <ul>
              {course.tests && course.tests.length > 0 ? (
                course.tests.map((test) => (
                  <li key={test.id} className="flex justify-between items-center mb-4 px-4">
                    <div className="flex items-center space-x-4">
                      <span className="text-sm md:text-base">{test.title}</span>
                      <span className="text-xs md:text-sm text-gray-500">
                        {new Date(test.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center space-x-3">
                      {/* Edit Button */}
                      <Link href={`/teacher/classes/${params.classId}/courses/${course.id}/exercises/${test.id}/questions`}>
                        <Button variant="outline" size="sm" className="px-3 py-1 text-xs">
                          Edit
                        </Button>
                      </Link>

                      {/* Delete Button */}
                      <Button
                        variant="outline"
                        size="sm"
                        className="px-3 py-1 text-xs"
                      >
                        Delete
                      </Button>
                    </div>
                  </li>
                ))
              ) : (
                <p>No tests created yet.</p>
              )}
            </ul>
          </div>
        </div>


        {/* The form to create a new test */}
        <div className=" md:mt-8">
          <CreateTestForm course={course} />
        </div>
      </SidebarInset>
    </div>
  );
}

export default CourseCurriculumPage;