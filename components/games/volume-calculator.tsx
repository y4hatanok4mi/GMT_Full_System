"use client"

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
      <div>
        <ShapeVisualization shape={shape} side={side} height={height} radius={radius} />
      </div>

      {/* Shape Selector */}
      <div>
        <label htmlFor="shape" className="text-xl font-medium">Select Shape:</label>
        <select
          id="shape"
          value={shape}
          onChange={(e) => setShape(e.target.value)}
          className="w-full p-2 mt-2"
        >
          <option value="cube">Cube</option>
          <option value="cylinder">Cylinder</option>
          <option value="cone">Cone</option>
        </select>
      </div>

      {/* Cube Volume */}
      {shape === "cube" && (
        <div>
          <h2 className="text-xl font-medium">Cube Volume</h2>
          <input
            type="range"
            min="1"
            max="20"
            step="1"
            value={side}
            onChange={handleSideChange}
            className="w-full"
          />
          <p>Side: {side} units</p>
          <p>Formula: Volume = Side³ = {side}³ = <b>{volumeCube.toFixed(2)} cubic units</b></p>
        </div>
      )}

      {/* Cylinder Volume */}
      {shape === "cylinder" && (
        <div>
          <h2 className="text-xl font-medium">Cylinder Volume</h2>
          <input
            type="range"
            min="1"
            max="100"
            step="1"
            value={radius}
            onChange={handleRadiusChange}
            className="w-full"
          />
          <p>Radius: {radius} units</p>
          <input
            type="range"
            min="1"
            max="200"
            step="1"
            value={height}
            onChange={handleHeightChange}
            className="w-full"
          />
          <p>Height: {height} units</p>
          <p>Formula: Volume = π × Radius² × Height = 3.14 × {radius}² × {height} = <b>{volumeCylinder.toFixed(2)} cubic units</b></p>
        </div>
      )}

      {/* Cone Volume */}
      {shape === "cone" && (
        <div>
          <h2 className="text-xl font-medium">Cone Volume</h2>
          <input
            type="range"
            min="1"
            max="100"
            step="1"
            value={radius}
            onChange={handleRadiusChange}
            className="w-full"
          />
          <p>Radius: {radius} units</p>
          <input
            type="range"
            min="1"
            max="200"
            step="1"
            value={height}
            onChange={handleHeightChange}
            className="w-full"
          />
          <p>Height: {height} units</p>
          <p>Formula: Volume = (π × Radius² × Height) / 3 = (3.14 × {radius}² × {height}) / 3 = <b>{volumeCone.toFixed(2)} cubic units</b></p>
        </div>
      )}
    </div>
  );
};

export { VolumeCalculator };
