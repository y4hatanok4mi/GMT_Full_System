import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AngleClassCard from "@/components/i-lessons/angle-class-card";
import AnglePClassCard from "@/components/i-lessons/anglep-class-card";
import AreaClassCard from "@/components/i-lessons/area-class-card";
import VolumeClassCard from "@/components/i-lessons/volume-class-card";
import prisma from "@/lib/prisma";

const LearningPage = async () => {
  const user = await auth();
  const userId = user?.user.id;
  const role = user?.user.role;

  if (role !== "student") {
    return redirect("/auth/signin");
  }

  if (!userId) {
    return redirect("/auth/signin");
  }

  const modules = await prisma.module.findMany({
    where: {
      isPublished: true
    },
    include: {
      lesson: true,
    },
  });

  return (
    <div className="flex flex-col gap-6 p-6 mt-16 min-h-screen bg-slate-200 dark:bg-slate-800 text-black dark:text-white">
      <div className="p-4 mt-8 md:px-10 xl:px-12">
        <div className="flex flex-col items-center py-2 w-full text-center">
          <h1 className="text-2xl font-semibold">Interactive Tools</h1>
        </div>
        {/* Use grid layout with explicit card widths */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex justify-center">
            <AngleClassCard />
          </div>
          <div className="flex justify-center">
            <AnglePClassCard />
          </div>
          <div className="flex justify-center">
            <AreaClassCard />
          </div>
          <div className="flex justify-center">
            <VolumeClassCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningPage;
