'use client';

import Link from "next/link";

const StartAnglePairsTool = () => {
  return (
    <div className="flex justify-center p-4 mt-16 bg-gray-100 dark:bg-slate-800 min-h-screen">
      <div className="w-full max-w-3xl p-6">
        <h1 className="text-xl md:text-3xl font-bold mt-5 mb-7 text-center text-gray-900 dark:text-white">
          Understanding Angle Pairs
        </h1>

        <p className="text-sm md:text-lg text-gray-700 dark:text-gray-300 max-w-2xl mb-6">
          In geometry, <strong>angle pairs</strong> are two angles that have a special relationship based on their measurements or positions. 
          Understanding these relationships helps in solving problems related to parallel lines, triangles, and polygons.
        </p>

        <div className="w-full bg-white dark:bg-slate-700 p-4 rounded shadow-lg mb-6">
          <h2 className="text-base md:text-xl font-semibold mb-3 text-gray-900 dark:text-white">
            Types of Angle Pairs
          </h2>
          <ul className="list-disc list-inside text-sm md:text-base text-gray-700 dark:text-gray-300">
            <li><strong>Complementary Angles:</strong> Two angles that sum up to 90° (e.g., 30° + 60°).</li>
            <li><strong>Supplementary Angles:</strong> Two angles that sum up to 180° (e.g., 110° + 70°).</li>
            <li><strong>Adjacent Angles:</strong> Angles that share a common side and vertex without overlapping.</li>
            <li><strong>Vertical (Opposite) Angles:</strong> Angles formed by two intersecting lines, always equal.</li>
            <li><strong>Linear Pair:</strong> Two adjacent angles that form a straight line (sum of 180°).</li>
          </ul>
        </div>

        <Link
          href="/student/tools/angle-pairs_start/angle-pairs"
          className="flex justify-center"
        >
          <button className="mt-8 bg-green-500 text-white px-6 py-3 rounded-lg text-base md:text-lg font-semibold hover:bg-green-600 transition">
            Continue
          </button>
        </Link>
      </div>
    </div>
  );
};

export default StartAnglePairsTool;
