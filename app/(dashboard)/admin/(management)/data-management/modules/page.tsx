import { redirect } from "next/navigation";
import {
  SidebarInset,
  SidebarTrigger
} from '@/components/ui/sidebar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from '@radix-ui/react-separator';


import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { ModuleDataTable } from "@/components/module-data-table";
import { columns } from "@/components/modules/module-columns";
import { useRouter } from "next/navigation";

const ModulesPage = async ({ params }: { params: { moduleId: string } }) => {

  const { moduleId } = params;

  const user = await auth();
  const userId = user?.user.id;

  if (!userId) {
    return redirect("/auth/signin");
  }

  const modules = await prisma.module.findMany({
    where: {
      instructorId: userId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  console.log(modules);

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
                    <BreadcrumbPage>Module Management</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
            <div className="px-4 mt-5">
              <ModuleDataTable columns={columns} data={modules} />
            </div>
        </SidebarInset>
      </div>
    </div>
  );
};

export default ModulesPage;