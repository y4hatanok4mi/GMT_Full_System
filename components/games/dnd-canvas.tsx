'use client';

import React, { useState, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';

interface DragItem {
  type: string;
  id: string;
  x: number;
  y: number;
}

const DragAngleCanvas = () => {
  const canvasSize = 300;
  const center = canvasSize / 2;

  const [points, setPoints] = useState({
    startX: center,
    startY: center,
    endX: center + 100,
    endY: center - 100,
  });

  const calculateAngle = () => {
    const { startX, startY, endX, endY } = points;
    const dx = endX - startX;
    const dy = startY - endY;
    const radians = Math.atan2(dy, dx);
    const degrees = (radians * 180) / Math.PI;
    return Math.round(degrees >= 0 ? degrees : degrees + 360);
  };

  const canvasRef = useRef<HTMLDivElement | null>(null);

  const [, drop] = useDrop({
    accept: 'point',
    drop: (item: DragItem, monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset();
      if (!delta) return;

      const newEndX = item.x + delta.x;
      const newEndY = item.y + delta.y;

      setPoints((prev) => ({
        ...prev,
        endX: Math.min(Math.max(newEndX, 0), canvasSize),
        endY: Math.min(Math.max(newEndY, 0), canvasSize),
      }));
    },
  });

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'point',
    item: { id: 'endPoint', x: points.endX, y: points.endY },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  // Use a ref function to combine the drag behavior with the element's ref
  const dragRef = (node: SVGCircleElement | null) => {
    drag(node); // Attach the drag functionality
    if (node && canvasRef.current) {
      drop(canvasRef.current); // Attach drop functionality to the canvas
    }
  };

  return (
    <div className="relative" ref={canvasRef}>
      <svg
        width={canvasSize}
        height={canvasSize}
        className="border border-gray-300 bg-white rounded"
      >
        {/* Axis lines */}
        <line
          x1={points.startX}
          y1={points.startY}
          x2={points.startX + 150}
          y2={points.startY}
          stroke="black"
          strokeWidth="2"
        />
        {/* Angle line */}
        <line
          x1={points.startX}
          y1={points.startY}
          x2={points.endX}
          y2={points.endY}
          stroke="blue"
          strokeWidth="2"
        />
        {/* Angle Arc */}
        <path
          d={`M${points.startX},${points.startY} L${points.startX + 150},${points.startY} A150,150 0 0,1 ${points.endX},${points.endY} Z`}
          fill="rgba(0, 0, 255, 0.1)"
        />
        {/* Draggable endpoint */}
        <circle
          ref={dragRef} // Use the combined drag and ref function here
          cx={points.endX}
          cy={points.endY}
          r="10"
          fill="red"
          className={`cursor-pointer ${isDragging ? 'opacity-50' : ''}`}
        />
      </svg>
      <div className="text-center mt-4">
        <h2 className="text-xl font-semibold">Angle Measurement:</h2>
        <p className="text-lg">{calculateAngle()}°</p>
      </div>
    </div>
  );
};

export default DragAngleCanvas;
