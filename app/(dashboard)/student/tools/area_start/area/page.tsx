'use client';

import Shape from '@/components/games/area-shape';
import { useState } from 'react';

const AreaTool = () => {
  const [shape, setShape] = useState<'rectangle' | 'circle' | 'triangle'>('rectangle');
  const [dimensions, setDimensions] = useState({
    width: 100,
    height: 100,
    radius: 50,
    base: 100,
    triangleHeight: 100
  });

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white p-4 mt-16 flex flex-col items-center w-full lg:w-3/4 mx-auto">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold p-4 text-center">Interactive Tool for Area</h1>

      <div className="flex flex-col lg:flex-row w-full gap-6">
        {/* Text Content */}
        <div className="w-full lg:w-1/2 text-sm sm:text-base md:text-lg px-4">
          <p className="mb-4">
            Using this tool, you can identify the area of the polygon by dragging the slider.
          </p>
          <p className="mb-4">
            Drag the slider and observe the polygon and its area change in real time and on the canvas.
          </p>
        </div>

        {/* Shape and Controls */}
        <div className="w-full lg:w-1/2 flex flex-col items-center text-sm sm:text-base md:text-lg">
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            {['rectangle', 'circle', 'triangle'].map((s) => (
              <button
                key={s}
                onClick={() => setShape(s as typeof shape)}
                className={`px-4 py-2 rounded font-medium transition 
                  ${shape === s ? 'bg-blue-600 text-white' : 'bg-gray-300 dark:bg-gray-700 dark:text-white'}
                  hover:brightness-110`}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>

          <Shape shape={shape} dimensions={dimensions} setDimensions={setDimensions} />

          <div className="mt-8 w-full text-center">
            <h2 className="text-base sm:text-lg font-semibold mb-2">Formula:</h2>
            {shape === 'rectangle' && (
              <p>
                Area = Width × Height = {dimensions.width} × {dimensions.height} ={' '}
                <b>{(dimensions.width * dimensions.height).toFixed(2)}</b>
              </p>
            )}
            {shape === 'circle' && (
              <p>
                Area = π × Radius² = 3.14 × {dimensions.radius}² ={' '}
                <b>{(Math.PI * dimensions.radius ** 2).toFixed(2)}</b>
              </p>
            )}
            {shape === 'triangle' && (
              <p>
                Area = ½ × Base × Height = ½ × {dimensions.base} × {dimensions.triangleHeight} ={' '}
                <b>{(0.5 * dimensions.base * dimensions.triangleHeight).toFixed(2)}</b>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AreaTool;
