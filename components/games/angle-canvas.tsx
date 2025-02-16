import React from 'react';

interface AngleCanvasProps {
  angle: number;
}

const AngleCanvas = ({ angle }: AngleCanvasProps) => {
  const radius = 100;
  const radians = (angle * Math.PI) / 180;
  const endX = 150 + radius * Math.cos(radians);
  const endY = 150 - radius * Math.sin(radians);

  return (
    <svg
      width="300"
      height="300"
      viewBox="0 0 300 300"
      className="bg-white border border-gray-300 rounded"
    >
      {/* Draw axes */}
      <line x1="150" y1="150" x2="250" y2="150" stroke="black" strokeWidth="2" />
      <line x1="150" y1="150" x2={endX} y2={endY} stroke="blue" strokeWidth="2" />
      {/* Draw arc */}
      {angle > 0 && (
        <path
          d={`M150,150 L250,150 A100,100 0 ${angle > 90 ? 1 : 0},1 ${endX},${endY} Z`}
          fill="rgba(0, 0, 255, 0.1)"
        />
      )}
      {/* Label angle */}
      <text x="160" y="130" fontSize="16" fill="black">
        {angle}°
      </text>
    </svg>
  );
};

export default AngleCanvas;
