'use client';

import AngleCanvas from '@/components/games/angle-canvas';
import { useState } from 'react';

const AnglesTool = () => {
  const [angle, setAngle] = useState<number>(45); // Default to an acute angle

  return (
    <div className="bg-slate-100 dark:bg-slate-800 p-4 mt-16 flex flex-col items-center min-h-screen">
      {/* Top Background Section */}
      <div className="w-full p-4">
        <h1 className="text-xl sm:text-3xl font-bold text-center">
          Interactive Tool for Angles
        </h1>
      </div>

      {/* Main Content Section */}
      <div className="bg-slate-100 dark:bg-slate-800 p-4 flex flex-col items-center rounded-lg w-full lg:w-3/4 mx-auto">
        <div className="flex flex-col lg:flex-row w-full">
          {/* Description Section */}
          <div className="w-full lg:w-1/2 text-sm sm:text-lg md:text-2xl px-4 text-gray-900 dark:text-gray-300">
            <p className="mb-4">
              Using this tool, you can identify whether the angle is acute, right, obtuse, or straight by dragging the slider.
            </p>
            <p className="mb-4">
              Drag the slider and observe the angle change in real time on the canvas.
            </p>
          </div>

          {/* Canvas & Controls Section */}
          <div className="w-full lg:w-1/2 flex flex-col items-center">
            {/* Angle Canvas */}
            <div className="w-full flex justify-center mb-6">
              <AngleCanvas angle={angle} />
            </div>

            {/* Angle Slider */}
            <div className="w-full max-w-md px-4">
              <label className="block text-sm sm:text-lg font-semibold mb-2 text-center text-gray-900 dark:text-gray-200">
                Adjust Angle (degrees):
              </label>
              <input
                type="range"
                min="0"
                max="180"
                value={angle}
                onChange={(e) => setAngle(parseInt(e.target.value, 10))}
                className="w-full"
              />
              <p className="mt-2 text-center text-sm sm:text-lg font-medium text-gray-900 dark:text-gray-300">{angle}°</p>
            </div>

            {/* Angle Type Display */}
            <div className="text-center mt-6 text-gray-900 dark:text-gray-300">
              <h2 className="text-lg sm:text-xl font-semibold mb-2">Angle Type:</h2>
              <p className="text-sm sm:text-lg">
                {angle === 90 && 'This is a Right Angle.'}
                {angle < 90 && angle > 0 && 'This is an Acute Angle.'}
                {angle > 90 && angle < 180 && 'This is an Obtuse Angle.'}
                {angle === 180 && 'This is a Straight Angle.'}
                {angle === 0 && 'This is no angle (0°).'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnglesTool;
