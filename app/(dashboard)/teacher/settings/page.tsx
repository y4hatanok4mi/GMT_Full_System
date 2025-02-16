import { auth } from "@/auth"
import CourseCard from "@/components/modules/module-card";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { JoinClassDialog } from "@/components/modules/join-module";
import ClassCard from "@/components/modules/module-card-student";

const LearningPage = async () => {
  const user = await auth();
  const userId = user?.user.id;
  const role = user?.user.role;

  if (role !== "teacher") {
    return redirect("/auth/signin");
  }

  if (!userId) {
    return redirect("/auth/signin");
  }

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
                  <BreadcrumbPage>Settings</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
      </SidebarInset>
    </div>
  );
};  

export default LearningPage