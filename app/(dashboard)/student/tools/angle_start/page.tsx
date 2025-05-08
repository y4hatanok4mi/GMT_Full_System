'use client';

import Link from "next/link";

const StartAnglesTool = () => {
  return (
    <div className="flex justify-center mt-16 bg-slate-100 dark:bg-slate-800 min-h-screen">
      <div className="w-full max-w-3xl p-6">
        <h1 className="text-xl md:text-3xl font-bold mt-5 mb-7 text-center text-gray-900 dark:text-white">
          Angles
        </h1>

        <p className="text-sm md:text-lg text-gray-700 dark:text-gray-300 max-w-2xl mb-6">
          An <strong>angle</strong> is formed when two rays meet at a common point called the <strong>vertex</strong>.
          Angles are measured in degrees (°) and can be found everywhere—from the hands of a clock to the corners of a book.
        </p>

        <div className="w-full bg-white dark:bg-slate-600 p-6 rounded shadow-lg mb-6">
          <h2 className="text-base md:text-xl font-semibold mb-3 text-gray-900 dark:text-white">
            Types of Angles
          </h2>
          <ul className="list-disc list-inside text-sm md:text-base text-gray-700 dark:text-gray-300">
            <li><strong>Acute Angle:</strong> Less than 90° (e.g., slightly opened scissors).</li>
            <li><strong>Right Angle:</strong> Exactly 90° (e.g., corner of a square).</li>
            <li><strong>Obtuse Angle:</strong> Greater than 90° but less than 180° (e.g., half-open door).</li>
            <li><strong>Straight Angle:</strong> Exactly 180° (a straight line).</li>
            <li><strong>Reflex Angle:</strong> Greater than 180° but less than 360°.</li>
            <li><strong>Full Rotation:</strong> Exactly 360° (a complete turn).</li>
          </ul>
        </div>

        <Link
          href="/student/tools/angle_start/angle"
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

export default StartAnglesTool;
