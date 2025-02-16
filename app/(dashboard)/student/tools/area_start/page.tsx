'use client';

import AngleCanvas from '@/components/games/angle-canvas';
import Quiz from '@/components/games/angle-quiz';
import { useState } from 'react';
import Link from "next/link";

const StartAreaTool = () => {
  const [angle, setAngle] = useState<number>(45); // Default to an acute angle

  return (
    <div className="min-h-screen flex justify-center p-4">
      <div className="w-full max-w-3xl p-6 rounded">
        <h1 className="text-3xl font-bold mb-6 text-center">Understanding Area</h1>

        <p className="text-lg text-gray-700 text-center max-w-3xl mb-6">
          <strong>Area</strong> is the amount of space inside a two-dimensional shape. It is measured in <strong>square units</strong> such as square centimeters (cm²), square meters (m²), or square inches (in²).
        </p>

        <div className="w-full max-w-2xl bg-white p-6 rounded shadow-lg mb-6">
          <h2 className="text-xl font-semibold mb-3">Why is Area Important?</h2>
          <ul className="list-disc list-inside text-gray-700">
            <li><strong>Construction:</strong> Builders calculate area for flooring, walls, and ceilings.</li>
            <li><strong>Gardening:</strong> Farmers and gardeners measure land area for crops.</li>
            <li><strong>Design & Art:</strong> Graphic designers consider area when creating layouts.</li>
          </ul>
        </div>

        <div className="w-full max-w-2xl bg-white p-6 rounded shadow-lg mb-6">
          <h2 className="text-xl font-semibold mb-3">Area of Common Shapes</h2>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
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

        <div className="w-full max-w-2xl bg-white p-6 rounded shadow-lg mb-6">
          <h2 className="text-xl font-semibold mb-3">Fun Fact! 🎉</h2>
          <p className="text-gray-700">Did you know the <strong>largest circle</strong>
            that fits inside a square has <strong>only 78.5%</strong>
            of the squares area? This shows how different shapes use space efficiently!</p>
        </div>

              {/* Continue Button */}
      <Link
        href="/student/tools/area_start/area"
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

export default StartAreaTool;
