import getCoursesByCategory from "@/app/actions/getCourses";
import Categories from "@/components/categories";
import CourseCard from "@/components/modules/module-card";
import prisma from "@/lib/prisma";

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
import Topbar from "@/components/layout/topbar";


const CoursesByCategory = async ({
  params,
}: {
  params: { categoryId: string };
}) => {
  const categories = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const courses = await getCoursesByCategory(params.categoryId);

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
                <BreadcrumbPage>Lessons</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
        <div className="px-5">
        <Topbar/>
        <Categories categories={categories} selectedCategory={params.categoryId} />
        <div className="flex flex-wrap justify-center gap-7">
            {courses.map((course) => (
            <CourseCard key={course.id} course={course}/>
            ))}
        </div>
        </div>
        </SidebarInset>
    </div>

  );
};

export default CoursesByCategory;