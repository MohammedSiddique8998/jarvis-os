"use client";

import { Sparkles } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { SystemStatus } from "./StatusPanel";

function TargetingRings({ status }: { status: SystemStatus }) {
  const groupRef = useRef<THREE.Group>(null);
  const ringColor =
    status === "listening" ? "#67e8f9" : status === "speaking" ? "#60a5fa" : "#8b5cf6";
  const material = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: ringColor,
        transparent: true,
        opacity: status === "idle" ? 0.36 : 0.52,
        side: THREE.DoubleSide,
      }),
    [ringColor, status],
  );

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const speed = status === "thinking" ? 1.05 : status === "listening" ? 0.78 : 0.42;
    groupRef.current.rotation.y += delta * speed;
    groupRef.current.rotation.z -= delta * 0.22;
  });

  return (
    <group ref={groupRef}>
      {[1.05, 1.48, 1.95, 2.38].map((radius, index) => (
        <mesh
          key={radius}
          rotation={[
            Math.PI / 2 + index * 0.18,
            index * 0.22,
            index * 0.13,
          ]}
        >
          <torusGeometry args={[radius, index === 0 ? 0.012 : 0.007, 16, 168]} />
          <primitive object={material} attach="material" />
        </mesh>
      ))}
      {Array.from({ length: 16 }).map((_, index) => {
        const angle = (index / 16) * Math.PI * 2;
        return (
          <mesh
            key={index}
            position={[Math.cos(angle) * 1.78, Math.sin(angle) * 0.12, Math.sin(angle) * 1.78]}
            rotation={[Math.PI / 2, 0, angle]}
          >
            <boxGeometry args={[0.2, 0.006, 0.006]} />
            <meshBasicMaterial color="#67e8f9" transparent opacity={0.46} />
          </mesh>
        );
      })}
    </group>
  );
}

function ScanningPlane({ status }: { status: SystemStatus }) {
  const planeRef = useRef<THREE.Mesh>(null);
  const opacity = status === "thinking" ? 0.18 : 0.1;

  useFrame(({ clock }) => {
    if (!planeRef.current) return;
    planeRef.current.position.y = Math.sin(clock.elapsedTime * 1.35) * 0.88 + 0.34;
  });

  return (
    <mesh ref={planeRef} position={[0, 0.1, 0.02]} rotation={[0, 0, 0]}>
      <planeGeometry args={[2.6, 0.018]} />
      <meshBasicMaterial color="#67e8f9" transparent opacity={opacity} />
    </mesh>
  );
}

export default function AvatarEffects({ status }: { status: SystemStatus }) {
  const particleCount = status === "thinking" ? 84 : status === "listening" ? 68 : 48;

  return (
    <>
      <Sparkles
        count={particleCount}
        scale={[6.2, 4.8, 6.2]}
        size={status === "thinking" ? 3 : 2.25}
        speed={status === "thinking" ? 0.78 : 0.42}
        color="#67e8f9"
      />
      <TargetingRings status={status} />
      <ScanningPlane status={status} />
    </>
  );
}
