import Link from "next/link";

export const ToolCard = async () => {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border dark:border-gray-700 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg text-black dark:text-white">
          Interactive Tools
        </h3>
        <Link
          href="/student/tools"
          className="text-green-600 dark:text-green-400 font-extrabold py-1 px-4 hover:text-green-800 dark:hover:text-green-300 hover:bg-slate-300 dark:hover:bg-gray-700 rounded-md transition-colors duration-160"
        >
          View All
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Link
          href="/student/tools/angle_start"
          className="h-14 w-full text-white rounded-lg flex items-center justify-center p-2"
          style={{ backgroundColor: "#f25757" }}
        >
          Angles
        </Link>
        <Link
          href="/student/tools/angle-pairs_start"
          className="h-14 w-full text-white rounded-lg flex items-center justify-center p-2"
          style={{ backgroundColor: "#F58585" }}
        >
          Angle Pairs
        </Link>
        <Link
          href="/student/tools/area_start"
          className="h-14 w-full text-white rounded-lg flex items-center justify-center p-2"
          style={{ backgroundColor: "#f2cd60", color: "#000" }}
        >
          Area
        </Link>
        <Link
          href="/student/tools/volume_start"
          className="h-14 w-full text-white rounded-lg flex items-center justify-center p-2"
          style={{ backgroundColor: "#61e8e1", color: "#000" }}
        >
          Volume
        </Link>
      </div>
    </div>
  );
};
