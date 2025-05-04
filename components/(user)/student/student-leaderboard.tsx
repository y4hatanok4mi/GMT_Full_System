import { Separator } from "@/components/ui/separator";
import prisma from "@/lib/prisma";
import { Trophy } from "lucide-react";
import Link from "next/link";

export const StudentLeaderboard = async () => {
  const topStudents = await prisma.user.findMany({
    where: {
      role: "student",
    },
    select: {
      name: true,
      points: true,
    },
  });

  return (
    <div className="border dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800">
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-lg mb-2 text-black dark:text-white">Top Students</h3>
          <Link
            href="/student/leaderboard"
            className="text-green-600 dark:text-green-400 font-extrabold py-1 px-4 hover:text-green-800 dark:hover:text-green-300 hover:bg-slate-300 dark:hover:bg-gray-700 rounded-md transition-colors duration-200"
          >
            View All
          </Link>
        </div>
        <ul>
          {topStudents.map((student, index) => (
            <div key={index}>
              <li className="flex items-center gap-4 text-sm text-gray-800 dark:text-gray-200">
                <Trophy className="text-gray-700 dark:text-yellow-400" />
                <span className="flex-1">{student.name}</span>
                <span>{student.points} points</span>
              </li>
              {index < topStudents.length - 1 && (
                <Separator className="my-2 dark:bg-gray-600" />
              )}
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
};