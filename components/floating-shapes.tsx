import { motion } from "framer-motion";

interface FloatingShapeProps {
  color: string;
  size: string;
  top: string | number;
  left: string | number;
  delay?: number;
  shape: 'circle' | 'rectangle' | 'square' | 'triangle';
  direction?: 'normal' | 'reverse';
}

const FloatingShape: React.FC<FloatingShapeProps> = ({ 
  color, 
  size, 
  top, 
  left, 
  delay = 0,
  shape,
  direction = 'normal',
}) => {
  const shapeClass = shape === 'circle' 
    ? 'rounded-full' 
    : shape === 'rectangle' 
    ? 'rounded-none' 
    : '';

    const isTriangle = shape === 'triangle';
    
    const animation = {
        y: direction === 'normal' ? ["0%", "100%", "0%"] : ["100%", "0%", "100%"],
        x: direction === 'normal' ? ["0%", "100%", "0%"] : ["100%", "0%", "100%"],
        rotate: [0, 360],
      };

      return (
        <motion.div
          className={`absolute ${!isTriangle ? `${shapeClass} ${color} ${size}` : ''}`}
          style={{
            top,
            left,
            zIndex: 0,
            ...(isTriangle && {
              width: 0,
              height: 0,
              borderLeft: "50px solid transparent",
              borderRight: "50px solid transparent",
              borderBottom: `100px solid ${color.replace("bg-", "").replace("-500", "")}`,
            }),
          }}
          animate={animation}
          transition={{
            duration: 20,
            ease: "linear",
            repeat: Infinity,
            delay,
          }}
          aria-hidden="true"
        />
      );
    };

export default FloatingShape;
