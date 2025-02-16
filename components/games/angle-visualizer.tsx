import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

type AngleVisualizerProps = {
  angle: number;
  onAngleChange: (newAngle: number) => void;
};

const AngleVisualizer: React.FC<AngleVisualizerProps> = ({
  angle,
  onAngleChange,
}) => {
  const [dragging, setDragging] = useState(false);

  // Handle drag to calculate angle based on mouse position
  const handleDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!dragging) return;

    // Calculate mouse position relative to the center of the container
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const x = e.clientX - centerX;
    const y = e.clientY - centerY;

    // Calculate angle and update
    const newAngle = Math.round((Math.atan2(y, x) * (180 / Math.PI) + 360) % 360);
    onAngleChange(newAngle);
  };

  return (
    <div
      className="relative w-full h-64"
      onMouseMove={handleDrag}
      onMouseDown={() => setDragging(true)}
      onMouseUp={() => setDragging(false)}
      onMouseLeave={() => setDragging(false)} // Ensure drag stops if mouse leaves
    >
      <Canvas className="w-full h-full bg-gray-100">
        <OrbitControls />
        <ambientLight />
        <group>
          {/* Fixed line (black) */}
          <line>
            <bufferGeometry attach="geometry">
              <bufferAttribute
                attach="attributes-position"
                count={2}
                array={new Float32Array([0, 0, 0, 5, 0, 0])}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial attach="material" color="black" />
          </line>
        </group>
        <group rotation={[0, 0, (angle * Math.PI) / 180]}>
          {/* Rotatable line (red) */}
          <line>
            <bufferGeometry attach="geometry">
              <bufferAttribute
                attach="attributes-position"
                count={2}
                array={new Float32Array([0, 0, 0, 5, 0, 0])}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial attach="material" color="red" />
          </line>
        </group>
      </Canvas>
      <p className="absolute bottom-2 left-2 text-gray-700">
        Angle: {angle}°
      </p>
    </div>
  );
};

export default AngleVisualizer;
