"use client";

import Quiz from '@/components/games/area-quiz';
import Shape from '@/components/games/area-shape';
import { useState } from 'react';

const AreaTool = () => {
  const [shape, setShape] = useState<'rectangle' | 'circle' | 'triangle'>('rectangle'); // Added triangle
  const [dimensions, setDimensions] = useState({ width: 100, height: 100, radius: 50, base: 100, triangleHeight: 100 });

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center w-full lg:w-3/4 mx-auto">
      <h1 className="text-3xl font-bold mb-4">Interactive Tool for Area</h1>

      <div className="flex flex-col lg:flex-row w-full">
        <div className="w-full lg:w-1/2 text-lg md:text-2xl px-4">
          <p className="mb-4">
            Using this tool, you can identify the area of the polygon by dragging the slider.
          </p>
          <p className="mb-4">
            Drag the slider and observe the polygon and its area change in real time and on the canvas.
          </p>
        </div>
        <div className='w-full lg:w-1/2 flex flex-col items-center'>
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => setShape('rectangle')}
              className={`px-4 py-2 rounded ${shape === 'rectangle' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
            >
              Rectangle
            </button>
            <button
              onClick={() => setShape('circle')}
              className={`px-4 py-2 rounded ${shape === 'circle' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
            >
              Circle
            </button>
            <button
              onClick={() => setShape('triangle')}
              className={`px-4 py-2 rounded ${shape === 'triangle' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
            >
              Triangle
            </button>
          </div>

          <Shape shape={shape} dimensions={dimensions} setDimensions={setDimensions} />

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-2">Formula:</h2>
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
