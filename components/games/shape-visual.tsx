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
    const sketch = (p: p5) => {
      let canvasWidth = 500;
      let canvasHeight = 300;

      p.setup = () => {
        if (typeof window !== "undefined") {
          if (window.innerWidth < 640) {
            // Small screen (e.g., mobile)
            canvasWidth = 300;
            canvasHeight = 200;
          } else if (window.innerWidth < 1024) {
            // Medium screen (e.g., tablet)
            canvasWidth = 400;
            canvasHeight = 250;
          }
        }

        if (canvasRef.current) {
          p.createCanvas(canvasWidth, canvasHeight, p.WEBGL).parent(canvasRef.current);
        }
      };

      p.draw = () => {
        p.background(200);
        p.rotateX(p.frameCount * 0.01);
        p.rotateY(p.frameCount * 0.01);

        if (shape === "cube") {
          p.fill(100, 150, 255);
          p.box(side * 10 || 300);
        } else if (shape === "cylinder") {
          p.fill(255, 165, 0);
          p.cylinder(radius * 2 || 150, height * 2 || 300);
        } else if (shape === "cone") {
          p.fill(255, 0, 0);
          p.cone(radius * 2 || 150, height * 2 || 300);
        }
      };
    };

    const newP5Instance = new p5(sketch);

    return () => {
      newP5Instance.remove();
    };
  }, [shape, side, height, radius]);

  return <div ref={canvasRef}></div>;
};

export default ShapeVisualization;
