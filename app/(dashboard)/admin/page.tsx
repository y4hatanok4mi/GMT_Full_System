import { auth } from "@/auth";
import ModuleChart from "@/components/charts/module-chart";
import VisitorChart from "@/components/charts/student-chart";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const session = await auth();
  const role = session?.user.role;

  if (role !== "admin") {
    return redirect("/auth/signin");
  }

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
                  <BreadcrumbPage>Analytics</BreadcrumbPage>
                </BreadcrumbItem>
                <BreadcrumbItem className="hidden md:block">
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="grid p-4 auto-rows-min gap-4 md:grid-cols-3">
          <div className="md:col-span-2"> {/* Makes ModuleChart take up 2 columns */}
            <ModuleChart />
          </div>
          <VisitorChart />
        </div>

      </SidebarInset>
    </div>
  );
}
