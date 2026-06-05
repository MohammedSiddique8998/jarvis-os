"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Stars, Sparkles, OrbitControls } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function JarvisCore() {
  const coreRef = useRef<THREE.Mesh>(null);
  const ringOneRef = useRef<THREE.Mesh>(null);
  const ringTwoRef = useRef<THREE.Mesh>(null);
  const ringThreeRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (coreRef.current) {
      coreRef.current.rotation.x += 0.006;
      coreRef.current.rotation.y += 0.012;
    }

    if (ringOneRef.current) ringOneRef.current.rotation.z += 0.01;
    if (ringTwoRef.current) ringTwoRef.current.rotation.x += 0.008;
    if (ringThreeRef.current) ringThreeRef.current.rotation.y += 0.006;
  });

  return (
    <Float speed={2.2} rotationIntensity={1.1} floatIntensity={1.6}>
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[1.25, 3]} />
        <meshStandardMaterial
          color="#22d3ee"
          emissive="#06b6d4"
          emissiveIntensity={2}
          wireframe
        />
      </mesh>

      <mesh ref={ringOneRef}>
        <torusGeometry args={[2.1, 0.018, 32, 180]} />
        <meshStandardMaterial
          color="#67e8f9"
          emissive="#22d3ee"
          emissiveIntensity={1.8}
        />
      </mesh>

      <mesh ref={ringTwoRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.55, 0.014, 32, 180]} />
        <meshStandardMaterial
          color="#a855f7"
          emissive="#a855f7"
          emissiveIntensity={1.5}
        />
      </mesh>

      <mesh ref={ringThreeRef} rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[3.0, 0.01, 32, 180]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#38bdf8"
          emissiveIntensity={1.2}
        />
      </mesh>

      <pointLight color="#22d3ee" intensity={3} distance={8} />
    </Float>
  );
}

function GalaxyDisk() {
  const diskRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (diskRef.current) {
      diskRef.current.rotation.z += 0.0018;
    }
  });

  return (
    <mesh ref={diskRef} rotation={[Math.PI / 2.4, 0, 0]} position={[0, -1.2, -2]}>
      <torusGeometry args={[3.6, 0.025, 32, 240]} />
      <meshStandardMaterial
        color="#0ea5e9"
        emissive="#0284c7"
        emissiveIntensity={1.2}
      />
    </mesh>
  );
}

export default function JarvisScene() {
  return (
    <Canvas camera={{ position: [0, 0, 7], fov: 55 }}>
      <color attach="background" args={["#020617"]} />

      <ambientLight intensity={0.35} />
      <pointLight position={[5, 5, 5]} intensity={2.4} color="#22d3ee" />
      <pointLight position={[-5, -3, 4]} intensity={1.6} color="#a855f7" />

      <Stars
        radius={120}
        depth={70}
        count={8000}
        factor={5}
        saturation={0}
        fade
        speed={1.2}
      />

      <Sparkles
        count={140}
        scale={[9, 5, 5]}
        size={2}
        speed={0.6}
        color="#22d3ee"
      />

      <GalaxyDisk />
      <JarvisCore />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.8}
      />
    </Canvas>
  );
}