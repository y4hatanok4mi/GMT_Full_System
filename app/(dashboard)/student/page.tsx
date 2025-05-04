import { auth } from "@/auth";
import { ModuleCard } from "@/components/(user)/student/module-card";
import { StudentLeaderboard } from "@/components/(user)/student/student-leaderboard";
import { ToolCard } from "@/components/(user)/student/tool-card";
import SurveyModalWrapper from "@/components/survey-modal-wrapper";
import prisma from "@/lib/prisma";
import Image from "next/image";
import { redirect } from "next/navigation";

const LearningPage = async () => {
  const user = await auth();
  const userId = user?.user.id;
  const role = user?.user.role;

  if (role !== "student" || !userId) {
    return redirect("/auth/signin");
  }

  const currentUser = await prisma.user.findUnique({
    where: { id: Number(userId) },
    select: {
      name: true,
      school: true,
      id_no: true,
      points: true,
      image: true,
    },
  });

  if (!currentUser) {
    return redirect("/auth/signin");
  }

  return (
    <div
      className="min-h-screen flex flex-col gap-4 px-4 pb-16 w-full pt-8 items-center bg-slate-100 dark:bg-gray-800 dark:bg-[url('/background-dark.svg')]"
      style={{
        backgroundImage: `url("/background.svg")`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Survey Modal Wrapper */}
      <SurveyModalWrapper userId={userId} />

      {/* User Info */}
      <div className="flex flex-col sm:flex-row gap-6 justify-start items-center p-8 w-full sm:w-3/4">
        <Image
          src={currentUser.image || "/user.png"}
          alt="Profile"
          width={120}
          height={120}
          className="rounded-full object-cover"
        />
        <div className="text-white dark:text-gray-200">
          <div className="flex items-center gap-2">
            <p className="text-2xl font-semibold">{user.user.name}</p>
          </div>

          <div className="flex items-center gap-2">
            <Image src="/school.png" alt="School" width={30} height={30} className="object-contain" />
            <p className="text-sm">{user.user.school}</p>
          </div>

          <div className="flex items-center gap-2">
            <Image src="/student-card.png" alt="ID Number" width={30} height={30} className="object-contain" />
            <p className="text-sm">{user.user.id_no}</p>
          </div>

          <div className="flex items-center gap-2">
            <Image src="/star.png" alt="Points" width={30} height={30} className="object-contain" />
            <p className="text-sm">{`${currentUser.points} pts`}</p>
          </div>
        </div>
      </div>

      {/* Lesson Progress */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 w-full sm:w-3/4">
        <div className="w-full">
          <ModuleCard />
        </div>

        {/* Tools and Top Students */}
        <div className="flex flex-col gap-4 sm:w-1/2">
          <ToolCard />
          <StudentLeaderboard />
        </div>
      </div>
    </div>
  );
};

export default LearningPage;