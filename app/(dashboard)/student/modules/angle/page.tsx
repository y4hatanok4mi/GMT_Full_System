import { auth } from '@/auth';
import AngleClassCard from "@/components/i-lessons/angle-class-card";
import AnglePClassCard from "@/components/i-lessons/anglep-class-card";
import AreaClassCard from "@/components/i-lessons/area-class-card";
import VolumeClassCard from "@/components/i-lessons/volume-class-card";
import { MoveRight } from 'lucide-react';
import { redirect } from 'next/navigation';

const AnglesLesson = async () => {
  const user = await auth();
  const userId = user?.user.id;
  const role = user?.user.role;

  if (role !== "student") {
    return redirect("/auth/signin");
  }

  if (!userId) {
    return redirect("/auth/signin");
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center">
      <h3 className="text-2xl font-semibold text-gray-700">Lessons</h3>
      <div className="flex flex-inline justify-center gap-4 md:gap-6">
        <AnglePClassCard />
        <MoveRight/>
        <AnglePClassCard />
        <MoveRight/>
        <AnglePClassCard />
        <MoveRight/>
        <AnglePClassCard />
      </div>
    </div>
  );
};

export default AnglesLesson;
