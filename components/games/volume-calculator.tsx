"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const ShapeVisualization = dynamic(() => import("./shape-visual"), { ssr: false });

const VolumeCalculator = () => {
  const [shape, setShape] = useState<string>("cube");
  const [side, setSide] = useState<number>(4); // Cube side length
  const [height, setHeight] = useState<number>(100); // Cylinder and Cone height
  const [radius, setRadius] = useState<number>(50); // Cylinder and Cone radius

  const handleSideChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSide(Number(e.target.value));
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHeight(Number(e.target.value));
  };

  const handleRadiusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRadius(Number(e.target.value));
  };

  const volumeCube = side ** 3;
  const volumeCylinder = Math.PI * radius ** 2 * height;
  const volumeCone = (Math.PI * radius ** 2 * height) / 3;

  return (
    <div className="space-y-6">
      {/* Shape Visualization */}
      <div className="w-full mb-6 flex justify-center">
        <ShapeVisualization shape={shape} side={side} height={height} radius={radius} />
      </div>

      {/* Shape Selector */}
      <div className="w-full sm:w-2/3 lg:w-1/2 mx-auto">
        <label className="text-xl font-medium block mb-2 text-center text-gray-900 dark:text-white">
          Select Shape:
        </label>
        <select
          value={shape}
          onChange={(e) => setShape(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
        >
          <option value="cube">Cube</option>
          <option value="cylinder">Cylinder</option>
          <option value="cone">Cone</option>
        </select>
      </div>

      {/* Cube Volume */}
      {shape === "cube" && (
        <div className="space-y-4 sm:w-2/3 lg:w-1/2 mx-auto">
          <h2 className="text-xl font-medium text-center text-gray-900 dark:text-white">Cube Volume</h2>
          <input
            type="range"
            min="1"
            max="20"
            step="1"
            value={side}
            onChange={handleSideChange}
            className="w-full"
          />
          <p className="text-center">Side: {side} units</p>
          <p className="text-center">
            Formula: Volume = Side³ = {side}³ = <b>{volumeCube.toFixed(2)} cubic units</b>
          </p>
        </div>
      )}

      {/* Cylinder Volume */}
      {shape === "cylinder" && (
        <div className="space-y-4 sm:w-2/3 lg:w-1/2 mx-auto">
          <h2 className="text-xl font-medium text-center text-gray-900 dark:text-white">Cylinder Volume</h2>
          <input
            type="range"
            min="1"
            max="100"
            step="1"
            value={radius}
            onChange={handleRadiusChange}
            className="w-full"
          />
          <p className="text-center">Radius: {radius} units</p>
          <input
            type="range"
            min="1"
            max="200"
            step="1"
            value={height}
            onChange={handleHeightChange}
            className="w-full"
          />
          <p className="text-center">Height: {height} units</p>
          <p className="text-center">
            Formula: Volume = π × Radius² × Height = 3.14 × {radius}² × {height} = <b>{volumeCylinder.toFixed(2)} cubic units</b>
          </p>
        </div>
      )}

      {/* Cone Volume */}
      {shape === "cone" && (
        <div className="space-y-4 sm:w-2/3 lg:w-1/2 mx-auto">
          <h2 className="text-xl font-medium text-center text-gray-900 dark:text-white">Cone Volume</h2>
          <input
            type="range"
            min="1"
            max="100"
            step="1"
            value={radius}
            onChange={handleRadiusChange}
            className="w-full"
          />
          <p className="text-center">Radius: {radius} units</p>
          <input
            type="range"
            min="1"
            max="200"
            step="1"
            value={height}
            onChange={handleHeightChange}
            className="w-full"
          />
          <p className="text-center">Height: {height} units</p>
          <p className="text-center">
            Formula: Volume = (π × Radius² × Height) / 3 = (3.14 × {radius}² × {height}) / 3 = <b>{volumeCone.toFixed(2)} cubic units</b>
          </p>
        </div>
      )}
    </div>
  );
};

export default VolumeCalculator;
