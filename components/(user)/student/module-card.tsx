import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import Image from "next/image";
import { CirclePlay, Check } from "lucide-react";

export const ModuleCard = async () => {
  const user = await auth();
  const userId = user?.user.id;

  if (!userId) {
    return redirect("/auth/signin");
  }

  const startedModules = await prisma.joined.findMany({
    where: {
      studentId: Number(userId),
    },
    include: {
      module: {
        select: {
          id: true,
          name: true,
          description: true,
          imageUrl: true,
          completedBy: {
            where: { userId: Number(userId) },
            select: { id: true },
          },
        },
      },
    },
  });

  return (
    <div className="bg-white border border-slate-100 dark:border-gray-900 dark:bg-gray-800 p-4 rounded-xl shadow w-full min-h-52">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg text-black dark:text-white">
          Modules Progress
        </h3>
        <Link
          href="/student/modules"
          className="text-green-600 dark:text-green-400 font-extrabold py-1 px-4 hover:text-green-800 hover:dark:text-green-300 hover:bg-slate-300 dark:hover:bg-gray-700 rounded-md transition-colors duration-200"
        >
          View All
        </Link>
      </div>
      <div className="flex flex-col">
        {startedModules.length === 0 ? (
          <div className="flex justify-center items-center text-gray-500 dark:text-gray-400">
            No modules started yet.
          </div>
        ) : (
          startedModules.map((moduleJoin, index) => {
            const { name, imageUrl, id, completedBy } = moduleJoin.module;
            const isCompleted = completedBy.length > 0;

            return (
              <Link key={index} href={`/student/modules/${id}/overview`} passHref>
                <div className="flex items-center justify-between px-4 relative w-full bg-slate-100 dark:bg-gray-700 h-24 rounded-md cursor-pointer hover:bg-slate-200 dark:hover:bg-gray-600 mb-4">
                  {/* Icon or Default Icon */}
                  <div>
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={name}
                        width={80}
                        height={80}
                        className="rounded-md object-cover w-40 h-20"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-400 dark:bg-gray-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">?</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-black dark:text-white">
                      {name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-300">
                      {isCompleted ? "Completed" : "In Progress"}
                    </p>
                  </div>
                  {isCompleted ? (
                    <Check className="h-8 w-8 text-green-500" />
                  ) : (
                    <CirclePlay className="h-8 w-8 text-black dark:text-white" />
                  )}
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
};
