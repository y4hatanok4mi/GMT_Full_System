'use client';

import Link from "next/link";

const StartVolumeTool = () => {

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center justify-center">
      <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-6 text-center">Understanding Volume</h1>

        <p className="text-lg text-gray-700 text-center max-w-3xl mb-6">
          <strong>Volume</strong> is the amount of <strong>space</strong> a three-dimensional (3D) object occupies. It is measured in <strong>cubic units</strong> such as cubic centimeters (cm³), cubic meters (m³), or cubic inches (in³).
        </p>

        <div className="w-full max-w-2xl bg-white p-6 rounded shadow-lg mb-6">
          <h2 className="text-xl font-semibold mb-3">Why is Volume Important?</h2>
          <ul className="list-disc list-inside text-gray-700">
            <li><strong>Construction:</strong> Used in buildings, containers, and storage planning.</li>
            <li><strong>Cooking:</strong> Helps measure liquids like water or oil.</li>
            <li><strong>Shipping:</strong> Determines package size and shipping costs.</li>
          </ul>
        </div>

        <div className="w-full max-w-2xl bg-white p-6 rounded shadow-lg mb-6">
          <h2 className="text-xl font-semibold mb-3">Volume of Common 3D Shapes</h2>
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

        <div className="w-full max-w-2xl bg-white p-6 rounded shadow-lg mb-6">
          <h2 className="text-xl font-semibold mb-3">Fun Fact! 🎉</h2>
          <p className="text-gray-700">Did you know a <strong>sphere</strong> has the <strong>smallest surface area</strong> for a given volume? That’s why <strong>soap bubbles</strong> are always round!</p>
        </div>
      </div>

      <Link
        href="/student/tools/volume_start/volume"
        className="text-green-600 font-extrabold py-1 px-4 hover:text-green-800  rounded-md transition-colors duration-160"
      >
        <button className="mt-8 bg-green-500 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-green-600 transition">
          Continue
        </button>
      </Link>

    </div>
  );
};

export default StartVolumeTool;
