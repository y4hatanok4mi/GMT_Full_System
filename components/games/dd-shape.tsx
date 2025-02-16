import React from 'react';
import { BoxGeometryProps, ConeGeometryProps, SphereGeometryProps } from '@react-three/fiber';

type ShapeProps = {
    shapeId: string;
    onDrop: (labelType: 'Cube' | 'Cone' | 'Sphere') => void;
    isMatched: boolean;
    type: 'Cube' | 'Cone' | 'Sphere';
    dimensions: [number, number, number];
  };
const Shape: React.FC<ShapeProps> = ({ type, dimensions }) => {
  switch (type) {
    case 'Cube':
      return <mesh>
        <boxGeometry args={dimensions} /> {/* Box geometry expects 3 dimensions */}
        <meshStandardMaterial color="orange" />
      </mesh>;
    case 'Cone':
      return <mesh>
        <coneGeometry args={[dimensions[0], dimensions[1], 32]} /> {/* Cone expects [radiusTop, radiusBottom, height, radialSegments] */}
        <meshStandardMaterial color="blue" />
      </mesh>;
    case 'Sphere':
      return <mesh>
        <sphereGeometry args={[dimensions[0], 32, 32]} /> {/* Sphere expects [radius, widthSegments, heightSegments] */}
        <meshStandardMaterial color="green" />
      </mesh>;
    default:
      return null;
  }
};

export default Shape;
