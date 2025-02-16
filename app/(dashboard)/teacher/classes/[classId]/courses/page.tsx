import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  SidebarInset,
  SidebarTrigger
} from '@/components/ui/sidebar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from '@radix-ui/react-separator';


import prisma from "@/lib/prisma";
import { DataTable } from "@/components/data-table";
import { auth } from "@/auth";
import { ModeToggle } from "@/components/mode-toggle";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { BadgeInfo } from "lucide-react";
import { columns } from "@/components/lessons/lessons-columns";

const Courses = async ({ params }: { params: { classId: string } }) => {

  const { classId } = params;
  console.log(params);
  console.log("Class ID from params:", classId);

  if (!classId) {
    notFound();
  }

  const classData = await prisma.class.findUnique({
    where: { id: classId },
  });

  if (!classData) {
    notFound();
  }

  const user = await auth();
  const userId = user?.user.id;

  if (!userId) {
    return redirect("/auth/signin");
  }

  const courses = await prisma.course.findMany({
    where: {
      instructorId: userId,
      classId: classId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  console.log(courses);


  console.log(courses)

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
                    <BreadcrumbPage>Lessons Management</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <div className="flex items-center justify-end gap-2 px-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button size="sm" className="rounded-full p-2 bg-transparent">
                    <BadgeInfo className="text-black" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-4 w-30 z-10 mr-4">
                  <div>
                    <h2 className="font-semibold text-lg">{classData.name}</h2>
                    <p className="text-sm text-muted-foreground mt-2">
                      <strong>Code:</strong> {classData.code || "N/A"}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      <strong>Section:</strong> {classData.section || "N/A"}
                    </p>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </header>

          <div className="px-6 py-4">
            <Link href={`/teacher/classes/${classData.id}/courses/create-course`}>
              <Button>Create New Lesson</Button>
            </Link>

            <div className="mt-5">
              <DataTable columns={columns} data={courses} />
            </div>
          </div>
        </SidebarInset>
      </div>
    </div>
  );
};

export default Courses;