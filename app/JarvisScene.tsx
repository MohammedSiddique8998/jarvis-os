"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Stars, Sparkles } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function HologramCore() {
  const core = useRef<THREE.Mesh>(null);
  const ringA = useRef<THREE.Mesh>(null);
  const ringB = useRef<THREE.Mesh>(null);
  const ringC = useRef<THREE.Mesh>(null);
  const halo = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (core.current) {
      core.current.rotation.x += 0.006;
      core.current.rotation.y += 0.013;
    }

    if (ringA.current) ringA.current.rotation.z += 0.012;
    if (ringB.current) ringB.current.rotation.x += 0.009;
    if (ringC.current) ringC.current.rotation.y += 0.007;
    if (halo.current) halo.current.rotation.z -= 0.004;
  });

  return (
    <Float speed={2.4} rotationIntensity={0.8} floatIntensity={1.4}>
      <mesh ref={halo} rotation={[Math.PI / 2.25, 0, 0]}>
        <torusGeometry args={[3.35, 0.018, 32, 260]} />
        <meshStandardMaterial
          color="#0ea5e9"
          emissive="#0ea5e9"
          emissiveIntensity={1.5}
          transparent
          opacity={0.85}
        />
      </mesh>

      <mesh ref={ringA}>
        <torusGeometry args={[2.05, 0.025, 32, 220]} />
        <meshStandardMaterial
          color="#22d3ee"
          emissive="#22d3ee"
          emissiveIntensity={2.4}
        />
      </mesh>

      <mesh ref={ringB} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.45, 0.018, 32, 220]} />
        <meshStandardMaterial
          color="#a855f7"
          emissive="#a855f7"
          emissiveIntensity={1.9}
        />
      </mesh>

      <mesh ref={ringC} rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[2.85, 0.014, 32, 220]} />
        <meshStandardMaterial
          color="#67e8f9"
          emissive="#67e8f9"
          emissiveIntensity={1.7}
        />
      </mesh>

      <mesh ref={core}>
        <icosahedronGeometry args={[1.15, 4]} />
        <meshStandardMaterial
          color="#67e8f9"
          emissive="#22d3ee"
          emissiveIntensity={2.5}
          wireframe
        />
      </mesh>

      <mesh>
        <sphereGeometry args={[0.38, 32, 32]} />
        <meshStandardMaterial
          color="#e0faff"
          emissive="#67e8f9"
          emissiveIntensity={3}
        />
      </mesh>

      <pointLight color="#22d3ee" intensity={4} distance={9} />
    </Float>
  );
}

function EnergyFloor() {
  const floor = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (floor.current) floor.current.rotation.z += 0.002;
  });

  return (
    <mesh ref={floor} rotation={[Math.PI / 2, 0, 0]} position={[0, -2.25, 0]}>
      <torusGeometry args={[3.8, 0.018, 32, 260]} />
      <meshStandardMaterial
        color="#22d3ee"
        emissive="#22d3ee"
        emissiveIntensity={1.3}
        transparent
        opacity={0.72}
      />
    </mesh>
  );
}

export default function JarvisScene() {
  return (
    <Canvas camera={{ position: [0, 0, 7.2], fov: 52 }}>
      <color attach="background" args={["#020617"]} />

      <ambientLight intensity={0.35} />
      <pointLight position={[4, 5, 5]} intensity={2.5} color="#22d3ee" />
      <pointLight position={[-4, -2, 4]} intensity={1.5} color="#a855f7" />

      <Stars
        radius={120}
        depth={65}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />

      <Sparkles
        count={90}
        scale={[8, 5, 5]}
        size={2.2}
        speed={0.55}
        color="#22d3ee"
      />

      <EnergyFloor />
      <HologramCore />
    </Canvas>
  );
}