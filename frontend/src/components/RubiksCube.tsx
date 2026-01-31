import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { RoundedBox, Environment, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

const CUBE_SIZE = 0.95;
const GAP = 0.05;

// Apple-style monochrome colors
const COLORS = {
  darkGray: '#2a2a2a',
  mediumGray: '#4a4a4a',
  lightGray: '#6a6a6a',
};

interface CubeletProps {
  position: [number, number, number];
  rotationOffset: number;
}

const Cubelet = ({ position, rotationOffset }: CubeletProps) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3 + rotationOffset;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2 + rotationOffset) * 0.2;
    }
  });

  return (
    <RoundedBox ref={meshRef} args={[CUBE_SIZE, CUBE_SIZE, CUBE_SIZE]} position={position} radius={0.1} smoothness={4}>
      <meshStandardMaterial
        color={COLORS.mediumGray}
        metalness={0.4}
        roughness={0.3}
      />
    </RoundedBox>
  );
};

const AnimatedCube = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.15;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.3;
    }
  });

  // Generate 3x3x3 cube
  const cubelets = [];
  let rotOffset = 0;
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        cubelets.push({
          pos: [x * (CUBE_SIZE + GAP), y * (CUBE_SIZE + GAP), z * (CUBE_SIZE + GAP)] as [number, number, number],
          offset: rotOffset
        });
        rotOffset += 0.1;
      }
    }
  }

  return (
    <group ref={groupRef} scale={1.3}>
      {cubelets.map((c, i) => (
        <Cubelet key={i} position={c.pos} rotationOffset={c.offset} />
      ))}
    </group>
  );
};

export default function RubiksCube() {
  return (
    <div className="w-full h-[700px] flex items-center justify-center">
      <Canvas shadows dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
        <PerspectiveCamera makeDefault position={[8, 6, 8]} fov={40} />

        <color attach="background" args={['transparent']} />

        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={1.2} castShadow />
        <directionalLight position={[-5, 5, -5]} intensity={0.5} />
        <pointLight position={[0, 10, 0]} intensity={0.6} />

        <AnimatedCube />

        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
