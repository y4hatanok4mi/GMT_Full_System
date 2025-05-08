'use client';

import Link from "next/link";

const StartVolumeTool = () => {
  return (
    <div className="min-h-screen flex justify-center p-4 mt-16 bg-slate-100 dark:bg-slate-800">
      <div className="w-full max-w-4xl p-4 sm:p-6 rounded">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-center text-gray-900 dark:text-white">
          Understanding Volume
        </h1>

        <p className="text-sm sm:text-base md:text-lg text-gray-700 dark:text-gray-300 mb-6">
          <strong>Volume</strong> is the amount of space that a three-dimensional object occupies. It is measured in <strong>cubic units</strong> such as cubic centimeters (cm³), cubic meters (m³), or cubic inches (in³).
        </p>

        <div className="w-full bg-white dark:bg-slate-700 p-4 sm:p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-3 text-gray-900 dark:text-white">
            Why is Volume Important?
          </h2>
          <ul className="list-disc list-inside text-sm sm:text-base text-gray-700 dark:text-gray-300">
            <li><strong>Storage:</strong> Helps determine how much space a container can hold.</li>
            <li><strong>Construction:</strong> Engineers calculate volume for materials like concrete.</li>
            <li><strong>Science:</strong> Scientists use volume in experiments with liquids and gases.</li>
          </ul>
        </div>

        <div className="w-full overflow-x-auto bg-white dark:bg-slate-700 p-4 sm:p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-3 text-gray-900 dark:text-white">
            Volume of Common 3D Shapes
          </h2>
          <table className="w-full min-w-[700px] border-collapse border border-gray-300 dark:border-gray-500 text-sm sm:text-base text-gray-700 dark:text-gray-300">
            <thead>
              <tr className="bg-gray-200 dark:bg-slate-600 text-gray-900 dark:text-white">
                <th className="border p-2">Shape</th>
                <th className="border p-2">Formula</th>
                <th className="border p-2">Example Calculation</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2">Cube</td>
                <td className="border p-2">V = s × s × s</td>
                <td className="border p-2">s = 4 cm → V = 4 × 4 × 4 = 64 cm³</td>
              </tr>
              <tr>
                <td className="border p-2">Rectangular Prism</td>
                <td className="border p-2">V = l × w × h</td>
                <td className="border p-2">l = 10 cm, w = 5 cm, h = 3 cm → V = 150 cm³</td>
              </tr>
              <tr>
                <td className="border p-2">Cylinder</td>
                <td className="border p-2">V = π × r² × h</td>
                <td className="border p-2">r = 7 cm, h = 10 cm → V ≈ 1539.38 cm³</td>
              </tr>
              <tr>
                <td className="border p-2">Sphere</td>
                <td className="border p-2">V = (4/3) × π × r³</td>
                <td className="border p-2">r = 6 cm → V ≈ 904.78 cm³</td>
              </tr>
              <tr>
                <td className="border p-2">Cone</td>
                <td className="border p-2">V = (1/3) × π × r² × h</td>
                <td className="border p-2">r = 5 cm, h = 12 cm → V ≈ 314.16 cm³</td>
              </tr>
            </tbody>
          </table>
        </div>

        <Link
          href="/student/tools/volume_start/volume"
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

export default StartVolumeTool;
