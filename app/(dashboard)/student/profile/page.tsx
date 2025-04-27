import { Separator } from "@/components/ui/separator";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import Image from "next/image";
import { format } from "date-fns";
import { EditProfileDialog } from "@/components/(user)/admin/edit-profile";
import { EditPasswordDialog } from "@/components/(user)/student/edit-password";

const StudentProfilePage = async () => {
  const user = await auth();
  const userId = user?.user.id;
  const currentUser = await prisma.user.findUnique({
    where: {
      id: Number(userId),
    },
  });

  return (
    <div className="min-h-screen flex justify-center items-start bg-slate-200 py-8 px-4">
      <div className="w-full sm:w-4/5 md:w-2/3 lg:w-1/2 bg-white border rounded-md p-6 shadow-md">
        <h1 className="text-2xl font-semibold mb-4">Profile</h1>
        <div className="flex flex-col gap-4 text-slate-800 text-sm">
          <div>
            <p className="font-medium">Profile Picture</p>
            <div className="mt-2">
              <Image
                width={50}
                height={50}
                src={currentUser?.image || "/user.png"}
                alt="Profile Picture"
                className="rounded-full"
              />
            </div>
          </div>

          <p><span className="font-medium">Name:</span> {currentUser?.name}</p>
          <p><span className="font-medium">Email:</span> {currentUser?.email}</p>
          <p><span className="font-medium">School:</span> {currentUser?.school}</p>
          <p><span className="font-medium">ID Number:</span> {currentUser?.id_no}</p>
          <p>
            <span className="font-medium">Birthday:</span>{" "}
            {currentUser?.birthday
              ? format(currentUser.birthday, "MMMM dd, yyyy")
              : "N/A"}
          </p>

          <Separator />

          <div>
            <p className="font-medium">Account Settings</p>
            <p className="text-slate-600 mt-1">
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
            <p className="text-slate-600 mt-2">
              To change your password, 
              <EditPasswordDialog />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfilePage;
