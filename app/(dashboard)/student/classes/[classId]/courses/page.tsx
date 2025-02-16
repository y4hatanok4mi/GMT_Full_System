import getCoursesByCategory from "@/app/actions/getCourses";
import Categories from "@/components/categories";
import CourseCard from "@/components/modules/module-card";
import Topbar from "@/components/layout/topbar";
import { ModeToggle } from "@/components/mode-toggle";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import prisma from "@/lib/prisma";
import { BadgeInfo } from "lucide-react";
import { notFound } from "next/navigation";


export default async function StudentPage({ params }: { params: { classId: string } }) {
  const categories = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
    include: {
      subCategories: {
        orderBy: {
          name: "asc",
        },
      },
    },
  });

  if (!params.classId) {
    notFound();
  }

  const classData = await prisma.class.findUnique({
    where: { id: params.classId },
  });

  if (!classData) {
    notFound();
  }

  const courses = await getCoursesByCategory(null);
  return (
    <div>
      <SidebarInset>
      <header className="flex h-12 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbPage>{classData.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="px-5">
        <div className="flex justify-end items-center gap-2">
                    <div className="flex items-center">
                        <ModeToggle />
                    <Popover>
                        <PopoverTrigger asChild>
                        <Button size="sm" className="rounded-full p-2 bg-transparent">
                            <BadgeInfo className="text-black"/>
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
                </div>
        <div className="flex flex-wrap justify-center gap-7 mt-4">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
      </SidebarInset>
    </div>
  );
}