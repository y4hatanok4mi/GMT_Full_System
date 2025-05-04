'use client';

import AnglePairsCanvas from '@/components/games/angle-pair-canvas';
import { useState } from 'react';

const AnglePairsTool = () => {
  const [angle1, setAngle1] = useState<number>(60); // Default to an acute angle
  const [angle2, setAngle2] = useState<number>(120); // Default to a supplementary angle

  const getAnglePairType = (): string => {
    if (angle1 + angle2 === 90) return 'Complementary Angles';
    if (angle1 + angle2 === 180) return 'Supplementary Angles';
    if (angle1 === angle2) return 'Vertical Angles';
    return 'Adjacent Angles';
  };

  return (
    <div className="bg-slate-100 dark:bg-slate-800 p-2 flex flex-col items-center min-h-screen">
      {/* Top Background Section */}
      <div className="w-full p-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-white text-center">
          Interactive Tool for Angle Pairs
        </h1>
      </div>

      {/* Main Content Section */}
      <div className="bg-slate-100 dark:bg-slate-800 p-4 flex flex-col items-center rounded-lg w-full lg:w-3/4 mx-auto">
        <div className="flex flex-col lg:flex-row w-full">
          {/* Description Section */}
          <div className="w-full lg:w-1/2 text-sm sm:text-lg md:text-2xl px-4 text-gray-900 dark:text-gray-300">
            <p className="mb-4">
              Using this tool, you can identify whether the angle pair is Complementary, Supplementary, or Adjacent by dragging the slider.
            </p>
            <p className="mb-4">
              Drag the slider and observe the angle pair change in real time on the canvas.
            </p>
          </div>

          {/* Canvas & Controls Section */}
          <div className="w-full lg:w-1/2 flex flex-col items-center">
            {/* Angle Pairs Canvas */}
            <div className="w-full flex justify-center mb-6">
              <AnglePairsCanvas angle1={angle1} angle2={angle2} />
            </div>

            {/* Angle Sliders */}
            <div className="w-full max-w-md px-4">
              <div className="mb-4">
                <label className="block text-sm sm:text-lg font-semibold mb-2 text-center text-gray-900 dark:text-gray-200">
                  Adjust Angle 1 (degrees):
                </label>
                <input
                  type="range"
                  min="0"
                  max="180"
                  value={angle1}
                  onChange={(e) => setAngle1(parseInt(e.target.value, 10))}
                  className="w-full"
                />
                <p className="mt-2 text-center text-sm sm:text-lg font-medium text-gray-900 dark:text-gray-300">{angle1}°</p>
              </div>

              <div>
                <label className="block text-sm sm:text-lg font-semibold mb-2 text-center text-gray-900 dark:text-gray-200">
                  Adjust Angle 2 (degrees):
                </label>
                <input
                  type="range"
                  min="0"
                  max="180"
                  value={angle2}
                  onChange={(e) => setAngle2(parseInt(e.target.value, 10))}
                  className="w-full"
                />
                <p className="mt-2 text-center text-sm sm:text-lg font-medium text-gray-900 dark:text-gray-300">{angle2}°</p>
              </div>
            </div>

            {/* Angle Pair Type Display */}
            <div className="text-center mt-6 text-gray-900 dark:text-gray-300">
              <h2 className="text-lg sm:text-xl font-semibold mb-2">Angle Pair Relationship:</h2>
              <p className="text-sm sm:text-lg">
                {angle1 + angle2 === 90 && 'This is a Complementary Angle Pair.'}
                {angle1 + angle2 === 180 && 'This is a Supplementary Angle Pair.'}
                {angle1 === angle2 && 'This is a Vertical Angle Pair.'}
                {angle1 !== angle2 && angle1 + angle2 !== 180 && angle1 + angle2 !== 90 && 'This is an Adjacent Angle Pair.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnglePairsTool;
