import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";

import ClassCard from "@/components/modules/module-card-teacher";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";  // Import Link for navigation

const ClassesPage = async () => {

  const session = await auth();
  const role = session?.user.role;
  const instructorId = session?.user.id;

  if (role !== "teacher") {
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
                  <BreadcrumbPage>Homepage</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        {/* Create Class Button */}
        <div className="flex justify-end p-4">
          <Link
            href="/teacher/classes/create-class"  // Link to the class creation page
            className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
          >
            Create Class
          </Link>
        </div>

      </SidebarInset>
    </div>
  );
};

export default ClassesPage;