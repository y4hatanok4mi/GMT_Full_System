import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

const Leaderboard = async () => {
  const user = await auth();
  const userId = user?.user.id;
  const role = user?.user.role;

  if (role !== "student" || !userId) {
    return redirect("/auth/signin");
  }

  const users = await prisma.user.findMany({
    where: {
      role: "student",
      points: {
        gt: 0, // Only get students with more than 0 points
      },
    },
    select: {
      id: true,
      name: true,
      school: true,
      points: true,
    },
  });

  const leaderboardData = users.sort((a, b) => (b.points || 0) - (a.points || 0));

  const isEmpty = leaderboardData.length === 0;

  return (
    <div
      className="flex flex-col gap-6 min-h-screen bg-gray-100 dark:bg-slate-800"
      style={{
        backgroundImage: `url("/background.svg")`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="flex flex-col py-4 items-center justify-center px-4 sm:px-6 lg:px-12">
        <h2 className="text-xl sm:text-2xl text-gray-900 dark:text-white font-bold p-4 sm:p-6">
          Leaderboard
        </h2>
        <div className="w-full max-w-6xl">
          <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-lg shadow-md overflow-x-auto">
            <h2 className="text-base sm:text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
              Student Leaderboard
            </h2>

            {isEmpty ? (
              <p className="text-center text-sm sm:text-base text-gray-600 dark:text-gray-400">
                No students have earned points yet.
              </p>
            ) : (
              <table className="w-full table-auto text-sm sm:text-base text-gray-800 dark:text-gray-300">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="py-3 px-4 text-left text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-200">
                      Rank
                    </th>
                    <th className="py-3 px-4 text-left text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-200">
                      Name
                    </th>
                    <th className="py-3 px-4 text-left text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-200">
                      School
                    </th>
                    <th className="py-3 px-4 text-left text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-200">
                      Points
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboardData.map((user, index) => (
                    <tr
                      key={user.id}
                      className={`border-b border-gray-200 dark:border-gray-700 ${
                        user.id.toString() === userId
                          ? "bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-white font-bold"
                          : "text-gray-800 dark:text-gray-300"
                      }`}
                    >
                      <td className="py-3 px-4 text-center sm:text-left">{index + 1}</td>
                      <td className="py-3 px-4 text-center sm:text-left">{user.name}</td>
                      <td className="py-3 px-4 text-center sm:text-left">{user.school}</td>
                      <td className="py-3 px-4 text-center sm:text-left">{user.points} pts</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
