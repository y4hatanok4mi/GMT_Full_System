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
import { ModeToggle } from "@/components/mode-toggle";
import { EditProfileDialog } from "@/components/(user)/admin/edit-profile";

const AdminSettingsPage = async () => {
  const user = await auth();
  const userId = user?.user.id;
  const currentUser = await prisma.user.findUnique({
    where: {
      id: Number(userId),
    },
  });

  return (
    <div className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 min-h-screen">
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-8" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/admin/settings">
                    Settings
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-col items-center gap-6 p-6">
          {/* Profile Card */}
          <div className="flex flex-col gap-4 p-6 border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 w-full md:w-1/2 rounded-md shadow-sm">
            <h1 className="text-2xl font-semibold">Profile</h1>
            <div className="flex flex-col gap-2 text-sm">
              <p className="font-medium">Profile Picture</p>
              <Image
                width={50}
                height={50}
                src={currentUser?.image || "/user.png"}
                alt="Profile Picture"
                className="ml-2 rounded-full"
              />
              <Separator className="my-2" />
              <p className="font-medium">Account Settings</p>
              <div className="text-slate-600 dark:text-slate-300">
                To edit your profile, go to
                <EditProfileDialog
                  user={{
                    image: currentUser?.image || "",
                    name: currentUser?.name || "",
                    username: currentUser?.username || "",
                    school: currentUser?.school || "",
                    birthday: currentUser?.birthday
                      ? currentUser.birthday.toISOString().split("T")[0]
                      : "",
                  }}
                />
              </div>
            </div>
          </div>

          {/* System Settings Card */}
          <div className="flex flex-col gap-4 p-6 border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 w-full md:w-1/2 rounded-md shadow-sm">
            <h1 className="text-2xl font-semibold">System Settings</h1>
            <div className="flex flex-col gap-2 text-sm">
              <p className="font-medium">System Theme</p>
              <ModeToggle />
            </div>
          </div>
        </div>
      </SidebarInset>
    </div>
  );
};

export default AdminSettingsPage;
