import React from 'react';

interface AnglePairsCanvasProps {
  angle1: number; // Angle for the blue arc
  angle2: number; // Angle for the red arc
}

const AnglePairsCanvas = ({ angle1, angle2 }: AnglePairsCanvasProps) => {
  const radius = 100;
  const centerX = 150;
  const centerY = 150;

  // Function to calculate the endpoint of an arc
  const calculateEndPoint = (angle: number) => {
    const radians = (angle * Math.PI) / 180;
    const x = centerX + radius * Math.cos(radians);
    const y = centerY - radius * Math.sin(radians); // SVG y-coordinates are inverted
    return { x, y };
  };

  // Endpoints for blue and red arcs
  const endBlue = calculateEndPoint(-angle1); // Using angle1 for counterclockwise blue arc
  const endRed = calculateEndPoint(angle2);

  // Flags for large arcs
  const largeArcBlue = angle1 > 180 ? 1 : 0;
  const largeArcRed = angle2 > 180 ? 1 : 0;

  return (
    <svg
      width="500"
      height="300"
      viewBox="0 0 300 300"
      className="bg-white border border-gray-300 rounded"
    >
      {/* Base Circle */}
      <circle cx={centerX} cy={centerY} r={radius} stroke="#ccc" fill="none" />

      {/* Axes */}
      <line
        x1={centerX}
        y1={centerY}
        x2={centerX + radius}
        y2={centerY}
        stroke="black"
        strokeWidth="2"
      />

      {/* Blue Arc (Counterclockwise) */}
      <path
        d={`M ${centerX},${centerY} L ${centerX + radius},${centerY} A ${radius},${radius} 0 ${largeArcBlue},1 ${endBlue.x},${endBlue.y} Z`} // Updated to sweep counterclockwise
        fill="rgba(0, 0, 255, 0.2)"
      />

      {/* Red Arc (Counterclockwise) */}
      <path
        d={`M ${centerX},${centerY} L ${centerX + radius},${centerY} A ${radius},${radius} 0 ${largeArcRed},0 ${endRed.x},${endRed.y} Z`}
        fill="rgba(255, 0, 0, 0.2)"
      />

      {/* Blue Angle Label */}
      <text
        x={(centerX + endBlue.x) / 2}
        y={(centerY + endBlue.y) / 2 - 10}
        fill="blue"
        fontSize="14"
        textAnchor="middle"
      >
        {angle1}°
      </text>

      {/* Red Angle Label */}
      <text
        x={(centerX + endRed.x) / 2}
        y={(centerY + endRed.y) / 2 + 10}
        fill="red"
        fontSize="14"
        textAnchor="middle"
      >
        {angle2}°
      </text>
    </svg>
  );
};

export default AnglePairsCanvas;
