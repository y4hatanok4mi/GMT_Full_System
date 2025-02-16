import CreateCourseForm from "@/components/lessons/create-course";
import prisma from "@/lib/prisma";

import { 
    SidebarInset, 
    SidebarTrigger 
} from "@/components/ui/sidebar";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@radix-ui/react-separator";

const CreateCoursePage = async () => {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { subCategories: true },
  });

  const quarters = await prisma.quarter.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>Lesson Creation</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div>
          <CreateCourseForm
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
          />
        </div>
      </SidebarInset>
    </div>
  );
};

export default CreateCoursePage;