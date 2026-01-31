
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { RoundedBox, Environment } from '@react-three/drei';
import * as THREE from 'three';

const DarkCube = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    // Slow, elegant rotation
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.15;
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
  });

  return (
    <group ref={groupRef}>
      {/* Main dark glossy cube */}
      <RoundedBox args={[2.5, 2.5, 2.5]} radius={0.15} smoothness={8}>
        <meshPhysicalMaterial
          color="#0a0a0a"
          metalness={0.9}
          roughness={0.1}
          clearcoat={1}
          clearcoatRoughness={0.1}
          reflectivity={1}
          envMapIntensity={1.5}
        />
      </RoundedBox>

      {/* Subtle edge highlights */}
      <RoundedBox args={[2.52, 2.52, 2.52]} radius={0.15} smoothness={8}>
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.03}
          side={THREE.BackSide}
        />
      </RoundedBox>
    </group>
  );
};

export default function RubiksCube() {
  return (
    <div className="w-full h-full min-h-[500px]">
      <Canvas camera={{ position: [4, 3, 4], fov: 50 }}>
        {/* Dramatic lighting setup */}
        <ambientLight intensity={0.1} />

        {/* Key light */}
        <spotLight
          position={[10, 10, 5]}
          angle={0.3}
          penumbra={1}
          intensity={2}
          castShadow
        />

        {/* Rim light */}
        <spotLight
          position={[-8, 5, -5]}
          angle={0.4}
          penumbra={1}
          intensity={1.5}
          color="#1a1a2e"
        />

        {/* Fill light */}
        <pointLight position={[0, -5, 3]} intensity={0.5} color="#0a0a0a" />

        <DarkCube />

        {/* Environment for reflections */}
        <Environment preset="night" />
      </Canvas>
    </div>
  );
}
