import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AngleClassCard from "@/components/i-lessons/angle-class-card";
import AnglePClassCard from "@/components/i-lessons/anglep-class-card";
import AreaClassCard from "@/components/i-lessons/area-class-card";
import VolumeClassCard from "@/components/i-lessons/volume-class-card";
import prisma from "@/lib/prisma";
import ModuleCard from "@/components/modules/module-card";

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

  const startedModules = await prisma.joined.findMany({
    where: {
      studentId: Number(userId)
    },
    include: {
      module: {
        include: {
          lesson: true,
        }
      }
    }
  })

  return (
    <div
      className="flex flex-col gap-6 p-4 min-h-screen bg-slate-200 w-full"
    >
      <div className="p-4 md:px-10 xl:px-12">
        <div className="flex flex-col justify-start py-2 w-full text-center">
          <h1 className="text-2xl font-semibold "> My Modules</h1>
        </div>
        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          {startedModules.map(({module}) => (
            <ModuleCard
              userId={userId}
              key={module.id}
              module={module}
            />
          ))}
        </div>
      </div>
      <div className="p-4 md:px-10 xl:px-12">
        <div className="flex flex-col justify-start py-2 w-full text-center">
          <h1 className="text-2xl font-semibold ">Explore our Modules</h1>
        </div>
        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          {modules.map((module) => (
            <ModuleCard
              userId={userId}
              key={module.id}
              module={module}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LearningPage;