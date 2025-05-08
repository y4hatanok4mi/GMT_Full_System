import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { ModeToggle } from "@/components/mode-toggle";
import { EditPasswordDialog } from "@/components/(user)/student/edit-password";
import { EditProfileDialog } from "@/components/(user)/admin/edit-profile";

const StudentSettingsPage = async () => {
  const user = await auth();
  const userId = user?.user.id;
  const currentUser = await prisma.user.findUnique({
    where: {
      id: Number(userId),
    },
  });

  return (
    <div className="min-h-screen flex flex-col items-center gap-4 pt-6 pb-16 bg-slate-200 dark:bg-gray-800 px-4 sm:px-6">
      <div className="flex flex-col gap-4 p-6 sm:p-8 bg-slate-100 border-slate-300 dark:bg-gray-900 border dark:border-gray-700 w-full sm:w-4/5 md:w-2/3 lg:w-1/2 rounded-md">
        <div>
          <p className="text-xl sm:text-2xl font-semibold text-slate-800 dark:text-white">
            Account Settings
          </p>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            To edit your profile,
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
          </p>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            To change your password,
            <EditPasswordDialog />
          </p>
        </div>

        <h1 className="text-xl sm:text-2xl font-semibold text-slate-800 dark:text-white">
          System Settings
        </h1>
        <div className="flex flex-col gap-2 text-slate-800 dark:text-slate-200 text-sm">
          <p className="font-medium">System Theme</p>
          <ModeToggle />
        </div>
      </div>
    </div>
  );
};

export default StudentSettingsPage;
