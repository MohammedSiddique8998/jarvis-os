"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles, Stars } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { SystemStatus } from "./StatusPanel";

const AVATAR_MODEL_PATH = "/models/jarvis-avatar.glb";

function ReactiveCamera() {
  useFrame(({ camera, pointer }) => {
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.x * 1.2, 0.04);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, 1.2 + pointer.y * 0.55, 0.04);
    camera.lookAt(0, 0.25, 0);
  });

  return null;
}

function HolographicRings({ status }: { status: SystemStatus }) {
  const groupRef = useRef<THREE.Group>(null);
  const ringColor = status === "Listening" ? "#67e8f9" : "#8b5cf6";
  const ringMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: ringColor,
        transparent: true,
        opacity: 0.42,
        side: THREE.DoubleSide,
      }),
    [ringColor],
  );

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.32;
    groupRef.current.rotation.z -= delta * 0.18;
  });

  return (
    <group ref={groupRef}>
      {[1.15, 1.55, 2.05].map((radius, index) => (
        <mesh
          key={radius}
          rotation={[
            Math.PI / 2 + index * 0.24,
            index * 0.28,
            index * 0.15,
          ]}
        >
          <torusGeometry args={[radius, 0.008, 16, 160]} />
          <primitive object={ringMaterial} attach="material" />
        </mesh>
      ))}
    </group>
  );
}

function ProceduralAvatar({ status }: { status: SystemStatus }) {
  const avatarRef = useRef<THREE.Group>(null);
  const pulse = status === "Listening" ? 1.14 : status === "Thinking" ? 1.08 : 1;

  useFrame(({ clock }) => {
    if (!avatarRef.current) return;
    avatarRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.45) * 0.16;
    avatarRef.current.position.y = Math.sin(clock.elapsedTime * 1.2) * 0.045;
    avatarRef.current.scale.setScalar(
      THREE.MathUtils.lerp(avatarRef.current.scale.x, pulse, 0.04),
    );
  });

  return (
    <Float speed={1.8} rotationIntensity={0.18} floatIntensity={0.38}>
      <group ref={avatarRef} position={[0, -0.1, 0]}>
        <mesh position={[0, 0.92, 0]}>
          <sphereGeometry args={[0.42, 64, 64]} />
          <meshStandardMaterial
            color="#79f2ff"
            emissive="#0ea5e9"
            emissiveIntensity={1.9}
            metalness={0.82}
            roughness={0.18}
            transparent
            opacity={0.82}
          />
        </mesh>
        <mesh position={[0, 0.18, 0]} scale={[0.76, 1, 0.34]}>
          <capsuleGeometry args={[0.36, 0.92, 8, 28]} />
          <meshStandardMaterial
            color="#4dd8ff"
            emissive="#2563eb"
            emissiveIntensity={1.1}
            metalness={0.9}
            roughness={0.2}
            transparent
            opacity={0.48}
            wireframe
          />
        </mesh>
        <mesh position={[-0.52, 0.2, 0]} rotation={[0, 0, -0.38]}>
          <capsuleGeometry args={[0.08, 0.72, 8, 18]} />
          <meshStandardMaterial color="#a5f3fc" emissive="#06b6d4" emissiveIntensity={1.2} />
        </mesh>
        <mesh position={[0.52, 0.2, 0]} rotation={[0, 0, 0.38]}>
          <capsuleGeometry args={[0.08, 0.72, 8, 18]} />
          <meshStandardMaterial color="#a5f3fc" emissive="#06b6d4" emissiveIntensity={1.2} />
        </mesh>
        <mesh position={[0, 0.92, 0.37]}>
          <ringGeometry args={[0.18, 0.2, 64]} />
          <meshBasicMaterial color="#f0fdff" transparent opacity={0.75} />
        </mesh>
      </group>
    </Float>
  );
}

function SceneContent({ status }: { status: SystemStatus }) {
  return (
    <>
      <color attach="background" args={["#02040b"]} />
      <ambientLight intensity={0.6} />
      <pointLight position={[0, 2.4, 2.5]} intensity={55} color="#67e8f9" />
      <pointLight position={[-3, -1.5, -2]} intensity={25} color="#a855f7" />
      <Stars radius={80} depth={42} count={1500} factor={4} saturation={0} fade speed={0.65} />
      <Sparkles count={90} scale={[5.5, 3.8, 5.5]} size={2.2} speed={0.45} color="#67e8f9" />
      <HolographicRings status={status} />
      <ProceduralAvatar status={status} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.96, 0]}>
        <ringGeometry args={[0.74, 1.8, 160]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.16} side={THREE.DoubleSide} />
      </mesh>
      <ReactiveCamera />
    </>
  );
}

export default function AvatarScene({ status }: { status: SystemStatus }) {
  return (
    <div className="absolute inset-0">
      <Canvas camera={{ position: [0, 1.2, 4.2], fov: 45 }} dpr={[1, 1.65]}>
        <SceneContent status={status} />
      </Canvas>
      <div className="pointer-events-none absolute right-5 top-5 rounded-full border border-cyan-200/20 bg-black/35 px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-cyan-100/70">
        GLB ready: {AVATAR_MODEL_PATH}
      </div>
    </div>
  );
}
