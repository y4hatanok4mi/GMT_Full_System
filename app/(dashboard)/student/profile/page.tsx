import { Separator } from "@/components/ui/separator";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import Image from "next/image";
import { format } from "date-fns";

const StudentProfilePage = async () => {
  const user = await auth();
  const userId = user?.user.id;
  const currentUser = await prisma.user.findUnique({
    where: {
      id: Number(userId),
    },
  });

  return (
    <div className="min-h-screen flex justify-center items-start bg-slate-200 dark:bg-gray-800 py-8 px-4">
      <div className="w-full sm:w-4/5 md:w-2/3 lg:w-1/2 bg-white dark:bg-gray-900 border rounded-md p-6 shadow-md dark:border-gray-700">
        <h1 className="text-2xl font-semibold mb-4 text-slate-800 dark:text-white">
          Profile
        </h1>
        <div className="flex flex-col gap-4 text-slate-800 dark:text-slate-200 text-sm">
          <div>
            <p className="font-medium">Profile Picture</p>
            <div className="relative w-20 h-20 mt-2">
              <Image
                src={currentUser?.image || "/user.png"}
                alt="Profile"
                layout="fill"
                objectFit="cover"
                className="rounded-full"
              />
            </div>
          </div>

          <p>
            <span className="font-bold">Name:</span> {currentUser?.name}
          </p>
          <p>
            <span className="font-bold">Email:</span> {currentUser?.email}
          </p>
          <p>
            <span className="font-bold">School:</span> {currentUser?.school}
          </p>
          <p>
            <span className="font-bold">ID Number:</span> {currentUser?.id_no}
          </p>
          <p>
            <span className="font-bold">Birthday:</span>{" "}
            {currentUser?.birthday
              ? format(currentUser.birthday, "MMMM dd, yyyy")
              : "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentProfilePage;
