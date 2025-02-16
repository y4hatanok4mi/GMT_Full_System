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

const Courses = async ({ params }: { params: { moduleId: string } }) => {

  const { moduleId } = params;
  console.log(params);
  console.log("Class ID from params:", moduleId);

  if (!moduleId) {
    notFound();
  }

  const moduleData = await prisma.module.findUnique({
    where: { id: moduleId },
  });

  if (!moduleData) {
    notFound();
  }

  const user = await auth();
  const userId = user?.user.id;

  if (!userId) {
    return redirect("/auth/signin");
  }

  const courses = await prisma.lesson.findMany({
    where: {
      instructorId: userId,
      moduleId: moduleId,
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
          </header>

          <div className="px-6 py-4">
            <Link href={`/teacher/classes/${moduleData.id}/courses/create-course`}>
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