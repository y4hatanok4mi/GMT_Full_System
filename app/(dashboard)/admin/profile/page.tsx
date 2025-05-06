import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import Image from "next/image";
import { format } from "date-fns";

const getFullSchoolName = (code?: string | null) => {
  switch (code) {
    case "SNHS":
      return "Sayao National High School";
    case "BNHS":
      return "Balancan National High School";
    case "MNCHS":
      return "Marinduque National Comprehensive High School";
    case "BSNHS":
      return "Butansapa National High School";
    case "PBNHS":
      return "Puting Buhangin National High School";
    default:
      return code || "N/A";
  }
};

const AdminProfilePage = async () => {
  const user = await auth();
  const userId = user?.user.id;
  const currentUser = await prisma.user.findUnique({
    where: {
      id: Number(userId),
    },
  });

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-800 text-gray-900 dark:text-gray-100">
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-8" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/admin/settings">Profile</BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-col items-center gap-2">
          <div className="flex flex-col gap-4 p-8 border w-full md:w-1/2 rounded-md bg-slate-100 dark:bg-slate-800 border-slate-2200 dark:border-slate-700 shadow-sm">
            <h1 className="text-2xl font-semibold text-black dark:text-white">Profile</h1>
            <div className="flex flex-col gap-2 text-slate-800 dark:text-slate-200 text-sm">
              <p className="font-medium">Profile Picture</p>
              <Image
                width={50}
                height={50}
                src={currentUser?.image || "/user.png"}
                alt="Profile Picture"
                className="ml-2 rounded-full"
              />
              <p><span className="font-bold">Name:</span> {currentUser?.name}</p>
              <p><span className="font-bold">Email:</span> {currentUser?.email}</p>
              <p><span className="font-bold">School:</span> {getFullSchoolName(currentUser?.school)}</p>
              <p><span className="font-bold">ID Number:</span> {currentUser?.id_no}</p>
              <p>
                <span className="font-bold">Birthday:</span>{" "}
                {currentUser?.birthday ? format(currentUser.birthday, "MMMM dd, yyyy") : "N/A"}
              </p>
            </div>
          </div>
        </div>
      </SidebarInset>
    </div>
  );
};

export default AdminProfilePage;
