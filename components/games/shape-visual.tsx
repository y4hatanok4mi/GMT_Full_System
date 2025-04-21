import { useEffect, useRef } from "react";
import p5 from "p5";

const ShapeVisualization = ({
    shape,
    side = 100,
    height = 100,
    radius = 50,
}: {
  shape: string;
  side?: number;
  height?: number;
  radius?: number;
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize p5.js sketch
    const sketch = (p: p5) => {
      p.setup = () => {
        if (canvasRef.current) {
          p.createCanvas(500, 300, p.WEBGL).parent(canvasRef.current);
        }
      };

      p.draw = () => {
        p.background(200);

        p.rotateX(p.frameCount * 0.01);
        p.rotateY(p.frameCount * 0.01);


        if (shape === "cube") {
          p.box(side * 10  || 300); // Scale up the cube by multiplying side by 30
        } else if (shape === "cylinder") {
          p.cylinder(radius * 2 || 150, height * 2 || 300); // Scale up the cylinder's radius and height
        } else if (shape === "cone") {
          p.cone(radius * 2 || 150, height * 2 || 300); // Scale up the cone's radius and height
        }
      };
    };

    // Create a new p5 instance and bind it to the ref
    const newP5Instance = new p5(sketch);

    // Cleanup the P5 instance when the component unmounts
    return () => {
      newP5Instance.remove();
    };
  }, [shape, side, height, radius]); // Update the sketch when these props change

  return <div ref={canvasRef}></div>; // The canvas will be rendered inside this div
};


export default ShapeVisualization;

