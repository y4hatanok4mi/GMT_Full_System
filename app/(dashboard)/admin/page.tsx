import { auth } from "@/auth";
import { AccountCreationChart } from "@/components/charts/account-creation";
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
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

// Helper function to format date as YYYY-MM-DD
const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default async function AdminPage() {
  const session = await auth();
  const role = session?.user.role;

  if (role !== "admin") {
    return redirect("/auth/signin");
  }

  // Query data and group by date
  const creationStats = await prisma.user.groupBy({
    by: ["createdAt"],
    _count: {
      createdAt: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  // Transform data to group by date (ignoring time) and count occurrences
  const formattedData = creationStats.map(entry => ({
    date: formatDate(entry.createdAt), // Format to "YYYY-MM-DD"
    count: entry._count.createdAt, // Get the count of accounts created on that date
  }));

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
                  <BreadcrumbPage>Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
                <BreadcrumbItem className="hidden md:block"></BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex justify-center items-center p-4">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <ModuleChart />
            <VisitorChart />
            <div className="span-2 col-span-1 md:col-span-2">
              <AccountCreationChart data={formattedData} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </div>
  );
}
