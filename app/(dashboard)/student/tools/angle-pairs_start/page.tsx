'use client';

import AngleCanvas from '@/components/games/angle-canvas';
import Quiz from '@/components/games/angle-quiz';
import { useState } from 'react';
import Link from "next/link";

const StartAnglePairsTool = () => {
  return (
    <div className="min-h-screen flex justify-center p-4">
      <div className="w-full max-w-3xl p-6 rounded">
        <h1 className="text-3xl font-bold mt-5 mb-7 text-center">Understanding Angle Pairs</h1>

        <p className="text-lg text-gray-700 max-w-2xl mb-6">
          In geometry, <strong>angle pairs</strong> are two angles that have a special relationship based on their measurements or positions. 
          Understanding these relationships helps in solving problems related to parallel lines, triangles, and polygons.
        </p>

        <div className="w-full bg-white p-4 rounded shadow-lg mb-6">
          <h2 className="text-xl font-semibold mb-3">Types of Angle Pairs</h2>
          <ul className="list-disc list-inside text-gray-700">
            <li><strong>Complementary Angles:</strong> Two angles that sum up to 90° (e.g., 30° + 60°).</li>
            <li><strong>Supplementary Angles:</strong> Two angles that sum up to 180° (e.g., 110° + 70°).</li>
            <li><strong>Adjacent Angles:</strong> Angles that share a common side and vertex without overlapping.</li>
            <li><strong>Vertical (Opposite) Angles:</strong> Angles formed by two intersecting lines, always equal.</li>
            <li><strong>Linear Pair:</strong> Two adjacent angles that form a straight line (sum of 180°).</li>
          </ul>
        </div>

        {/* Continue Button */}
        <Link
          href="/student/tools/angle-pairs_start/angle-pairs"
          className="flex justify-center text-green-600 font-extrabold py-1 px-4 hover:text-green-800 rounded-md transition-colors duration-160"
        >
          <button className="mt-8 bg-green-500 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-green-600 transition">
            Continue
          </button>
        </Link>
      </div>
    </div>
  );
};

export default StartAnglePairsTool;