'use client';

import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Shape from './dd-shape';
import DropZone from './dd-dropzone';
import Label from './dd-label';

type ShapeData = {
  id: string;
  type: 'Cube' | 'Cone' | 'Sphere';
};

const shapes: ShapeData[] = [
  { id: '1', type: 'Cube' },
  { id: '2', type: 'Cone' },
  { id: '3', type: 'Sphere' },
];

const Game: React.FC = () => {
  const [score, setScore] = useState(0);
  const [matched, setMatched] = useState<Record<string, boolean>>({});

  const handleDrop = (shapeId: string, labelType: string) => {
    const shape = shapes.find((s) => s.id === shapeId);

    if (shape && shape.type === labelType) {
      setMatched((prev) => ({ ...prev, [shapeId]: true }));
      setScore((prev) => prev + 10);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col items-center h-screen bg-gray-100">
        <h1 className="text-2xl font-bold mt-4">Drag-and-Drop Geometry Game</h1>
        <p className="text-lg">Score: {score}</p>

        <div className="flex justify-center items-start gap-8 mt-6">
          {/* Shapes with Drop Zones */}
          {shapes.map((shape) => (
            <div key={shape.id} className="relative w-48 h-48">
              <Canvas>
                <ambientLight intensity={0.5} />
                <directionalLight position={[5, 5, 5]} intensity={1} />
                <Shape type={shape.type} dimensions={[2, 2, 2]} />
                <OrbitControls />
              </Canvas>
              <DropZone
                shapeId={shape.id}
                onDrop={(labelType) => handleDrop(shape.id, labelType)}
                isMatched={!!matched[shape.id]}
              />
            </div>
          ))}
        </div>

        {/* Labels */}
        <div className="flex gap-4 mt-8">
          {shapes.map((shape) => (
            <Label key={shape.type} type={shape.type} />
          ))}
        </div>
      </div>
    </DndProvider>
  );
};

export default Game;
