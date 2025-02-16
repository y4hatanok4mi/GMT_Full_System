import React from 'react';
import * as THREE from 'three';

type ShapeProps = {
  type: 'Cube' | 'Cone' | 'Sphere';
  dimensions: number[];
};

const Shape: React.FC<ShapeProps> = ({ type, dimensions }) => {
  let geometry;

  switch (type) {
    case 'Cube':
      const side = dimensions[0];
      geometry = new THREE.BoxGeometry(side, side, side);
      break;
    case 'Cone':
      const [radius, height] = dimensions;
      geometry = new THREE.ConeGeometry(radius, height, 32);
      break;
    case 'Sphere':
      geometry = new THREE.SphereGeometry(dimensions[0], 32, 32);
      break;
    default:
      geometry = new THREE.BoxGeometry(1, 1, 1);
  }

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial color="teal" roughness={0.5} metalness={0.1} />
    </mesh>
  );
};

export default Shape;
