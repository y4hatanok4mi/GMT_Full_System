import Link from "next/link";

export const ToolCard = async () => {
  return (
    <div className="bg-white p-4 rounded-lg border">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg">Interactive Tools</h3>
        <Link
          href="/student/tools"
          className="text-green-600 font-extrabold py-1 px-4 hover:text-green-800 hover:bg-slate-300 rounded-md transition-colors duration-160"
        >
          View All
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Link
          href="/student/tools/angle_start"
          className="h-16 w-full text-white rounded-lg btn btn-primary p-2 flex items-center justify-center"
          style={{ backgroundColor: "#f25757" }}
        >
          Angles
        </Link>
        <Link
          href="/student/tools/angle-pairs_start"
          className="h-16 w-full text-white rounded-lg btn btn-primary p-2 flex items-center justify-center"
          style={{ backgroundColor: "#F58585" }}
        >
          Angle Pairs
        </Link>
        <Link
          href="/student/tools/area_start"
          className="h-16 w-full text-white rounded-lg btn btn-primary p-2 flex items-center justify-center"
          style={{ backgroundColor: "#f2cd60" }}
        >
          Area
        </Link>
        <Link
          href="/student/tools/volume_start"
          className="h-16 w-full text-white rounded-lg btn btn-primary p-2 flex items-center justify-center"
          style={{ backgroundColor: "#61e8e1" }}
        >
          Volume
        </Link>
      </div>
    </div>
  );
};
