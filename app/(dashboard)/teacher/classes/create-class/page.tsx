import CreateCourseForm from "@/components/lessons/create-course"
import prisma from "@/lib/prisma"

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
import CreateClassForm from "@/components/modules/create-module";

const CreateCoursePage = async () => {

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
                  <BreadcrumbLink href="#">Class Management</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Class Creation</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div>
          <CreateClassForm/>
        </div>
      </SidebarInset>
    </div>
  )
}

export default CreateCoursePage