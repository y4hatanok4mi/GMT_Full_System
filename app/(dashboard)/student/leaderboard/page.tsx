import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

const Leaderboard = async () => {
  const user = await auth();
  const userId = user?.user.id;
  const role = user?.user.role;

  if (role !== "student") {
    return redirect("/auth/signin");
  }

  if (!userId) {
    return redirect("/auth/signin");
  }

  // Fetch users with points
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

  // Sort by points in descending order
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
      <div className="flex flex-col py-4 items-center justify-center px-12">
        <h2 className="text-2xl text-white font-bold p-8">Leaderboard</h2>
        <div className="w-full max-w-6xl">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Student Leaderboard</h2>
            <ul className="space-y-4">
              {leaderboardData.map((user, index) => (
                <li
                  key={user.id}
                  className={`flex justify-between items-center border-b p-2 ${
                    user.id.toString() === userId
                      ? "flex items-center justify-center p-2 bg-blue-100 text-blue-900 font-bold"
                      : ""
                  }`}
                >
                  <span className="flex-shrink-0 w-10 text-center">{index + 1}</span>
                  <span className="flex-1">{user.name}</span>
                  <span className="flex-1">{user.school}</span>
                  <span className="flex-shrink-0 w-20 text-center">
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
