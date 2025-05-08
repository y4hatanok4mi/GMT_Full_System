'use client';

import { useState } from 'react';
import Link from "next/link";

const StartAreaTool = () => {
  const [angle, setAngle] = useState<number>(45); // Default to an acute angle

  return (
    <div className="min-h-screen flex justify-center p-4 mt-16 bg-slate-100 dark:bg-slate-800">
      <div className="w-full max-w-4xl p-4 sm:p-6 rounded">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-center text-gray-900 dark:text-white">
          Understanding Area
        </h1>

        <p className="text-sm sm:text-base md:text-lg text-gray-700 dark:text-gray-300 mb-6">
          <strong>Area</strong> is the amount of space inside a two-dimensional shape. It is measured in <strong>square units</strong> such as square centimeters (cm²), square meters (m²), or square inches (in²).
        </p>

        <div className="w-full bg-white dark:bg-slate-700 p-4 sm:p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-3 text-gray-900 dark:text-white">
            Why is Area Important?
          </h2>
          <ul className="list-disc list-inside text-sm sm:text-base text-gray-700 dark:text-gray-300">
            <li><strong>Construction:</strong> Builders calculate area for flooring, walls, and ceilings.</li>
            <li><strong>Gardening:</strong> Farmers and gardeners measure land area for crops.</li>
            <li><strong>Design & Art:</strong> Graphic designers consider area when creating layouts.</li>
          </ul>
        </div>

        <div className="w-full overflow-x-auto bg-white dark:bg-slate-700 p-4 sm:p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-3 text-gray-900 dark:text-white">
            Area of Common Shapes
          </h2>
          <table className="w-full min-w-[600px] border-collapse border border-gray-300 dark:border-gray-500 text-sm sm:text-base text-gray-700 dark:text-gray-300">
            <thead>
              <tr className="bg-gray-200 dark:bg-slate-600 text-gray-900 dark:text-white">
                <th className="border p-2">Shape</th>
                <th className="border p-2">Formula</th>
                <th className="border p-2">Example Calculation</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2">Square</td>
                <td className="border p-2">A = s × s</td>
                <td className="border p-2">s = 5 cm → A = 5 × 5 = 25 cm²</td>
              </tr>
              <tr>
                <td className="border p-2">Rectangle</td>
                <td className="border p-2">A = length × width</td>
                <td className="border p-2">l = 8 cm, w = 4 cm → A = 8 × 4 = 32 cm²</td>
              </tr>
              <tr>
                <td className="border p-2">Triangle</td>
                <td className="border p-2">A = (base × height) ÷ 2</td>
                <td className="border p-2">b = 10 cm, h = 6 cm → A = (10 × 6) ÷ 2 = 30 cm²</td>
              </tr>
              <tr>
                <td className="border p-2">Circle</td>
                <td className="border p-2">A = π × r²</td>
                <td className="border p-2">r = 7 cm → A ≈ 153.94 cm²</td>
              </tr>
            </tbody>
          </table>
        </div>

        <Link
          href="/student/tools/area_start/area"
          className="flex justify-center"
        >
          <button className="mt-6 sm:mt-8 bg-green-500 text-white px-5 sm:px-6 py-2 sm:py-3 rounded-lg text-sm sm:text-base md:text-lg font-semibold hover:bg-green-600 transition">
            Continue
          </button>
        </Link>
      </div>
    </div>
  );
};

export default StartAreaTool;
