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
    },
    select: {
      id: true,
      name: true,
      school: true,
      points: true,
    },
  });

  const leaderboardData = users.sort((a, b) => (b.points || 0) - (a.points || 0));

  return (
    <div
      className="flex flex-col gap-6 min-h-screen bg-gray-100"
      style={{
        backgroundImage: `url("/background.svg")`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="flex flex-col py-4 items-center justify-center px-4 sm:px-6 lg:px-12">
        <h2 className="text-2xl text-white font-bold p-6 sm:p-8">Leaderboard</h2>
        <div className="w-full max-w-6xl">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md overflow-x-auto">
            <h2 className="text-lg font-semibold mb-4">Student Leaderboard</h2>
            <ul className="space-y-2">
              {leaderboardData.map((user, index) => (
                <li
                  key={user.id}
                  className={`flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0 border-b py-3 px-2 rounded-md ${
                    user.id.toString() === userId
                      ? "bg-blue-100 text-blue-900 font-bold"
                      : ""
                  }`}
                >
                  <span className="w-full sm:w-10 text-center text-xs sm:text-sm">
                    {index + 1}
                  </span>
                  <span className="w-full sm:flex-1 text-center sm:text-left text-sm md:text-base">
                    {user.name}
                  </span>
                  <span className="w-full sm:flex-1 text-center sm:text-left text-sm md:text-base">
                    {user.school}
                  </span>
                  <span className="w-full sm:w-20 text-center text-sm md:text-base">
                    {user.points || 0} pts
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
