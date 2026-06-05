"use client";

import { Float, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import type { SystemStatus } from "./StatusPanel";

type AvatarRendererProps = {
  modelPath: string;
  status: SystemStatus;
};

function PremiumModel({ modelPath }: { modelPath: string }) {
  const gltf = useGLTF(modelPath);

  return (
    <Float speed={1.25} rotationIntensity={0.12} floatIntensity={0.22}>
      <primitive object={gltf.scene} position={[0, -1.1, 0]} scale={1.28} />
    </Float>
  );
}

function Eye({ x, status }: { x: number; status: SystemStatus }) {
  const eyeRef = useRef<THREE.Mesh>(null);
  const intensity = status === "listening" ? 1 : status === "thinking" ? 0.86 : 0.68;

  useFrame(({ clock }) => {
    if (!eyeRef.current) return;
    const blink = Math.sin(clock.elapsedTime * 2.4) > 0.965 ? 0.28 : 1;
    eyeRef.current.scale.y = THREE.MathUtils.lerp(eyeRef.current.scale.y, blink, 0.2);
    eyeRef.current.scale.x = THREE.MathUtils.lerp(
      eyeRef.current.scale.x,
      status === "listening" ? 1.22 : 1,
      0.08,
    );
  });

  return (
    <mesh ref={eyeRef} position={[x, 0.92, 0.57]} scale={[0.16, 0.045, 0.02]}>
      <sphereGeometry args={[1, 32, 16]} />
      <meshBasicMaterial color="#e6fbff" transparent opacity={intensity} />
    </mesh>
  );
}

function HolographicFace({ status }: { status: SystemStatus }) {
  const faceRef = useRef<THREE.Group>(null);
  const mouthRef = useRef<THREE.Mesh>(null);
  const glow =
    status === "listening" ? 2.4 : status === "speaking" ? 2.2 : status === "thinking" ? 2 : 1.55;

  useFrame(({ clock, pointer }) => {
    if (faceRef.current) {
      faceRef.current.rotation.y = THREE.MathUtils.lerp(
        faceRef.current.rotation.y,
        pointer.x * 0.28,
        0.04,
      );
      faceRef.current.rotation.x = THREE.MathUtils.lerp(
        faceRef.current.rotation.x,
        -pointer.y * 0.12,
        0.04,
      );
      faceRef.current.position.y = Math.sin(clock.elapsedTime * 1.15) * 0.035;
    }

    if (mouthRef.current) {
      const pulse = status === "speaking" ? 0.06 + Math.abs(Math.sin(clock.elapsedTime * 12)) * 0.075 : 0.035;
      mouthRef.current.scale.y = THREE.MathUtils.lerp(mouthRef.current.scale.y, pulse, 0.28);
    }
  });

  return (
    <Float speed={1.7} rotationIntensity={0.1} floatIntensity={0.28}>
      <group ref={faceRef} position={[0, -0.08, 0]} scale={0.86}>
        <mesh position={[0, 0.82, 0]}>
          <sphereGeometry args={[0.5, 80, 80]} />
          <meshStandardMaterial
            color="#77f3ff"
            emissive="#0ea5e9"
            emissiveIntensity={glow}
            metalness={0.82}
            roughness={0.16}
            transparent
            opacity={0.34}
          />
        </mesh>
        <mesh position={[0, 0.82, 0.02]} scale={[0.68, 0.92, 0.46]}>
          <sphereGeometry args={[0.52, 28, 18]} />
          <meshStandardMaterial
            color="#a5f3fc"
            emissive="#22d3ee"
            emissiveIntensity={0.9}
            transparent
            opacity={0.18}
            wireframe
          />
        </mesh>
        <Eye x={-0.18} status={status} />
        <Eye x={0.18} status={status} />
        <mesh ref={mouthRef} position={[0, 0.64, 0.48]} scale={[0.2, 0.04, 0.02]}>
          <sphereGeometry args={[1, 32, 12]} />
          <meshBasicMaterial
            color={status === "speaking" ? "#ffffff" : "#67e8f9"}
            transparent
            opacity={status === "speaking" ? 0.9 : 0.48}
          />
        </mesh>
        <mesh position={[0, 0.0, 0]} scale={[0.94, 1.08, 0.38]}>
          <capsuleGeometry args={[0.42, 1.08, 8, 32]} />
          <meshStandardMaterial
            color="#4dd8ff"
            emissive="#2563eb"
            emissiveIntensity={status === "thinking" ? 1.5 : 1.1}
            metalness={0.9}
            roughness={0.2}
            transparent
            opacity={0.35}
            wireframe
          />
        </mesh>
        <mesh position={[0, 0.27, 0.42]} scale={[0.25, 0.25, 0.04]}>
          <sphereGeometry args={[1, 48, 24]} />
          <meshBasicMaterial
            color="#e0faff"
            transparent
            opacity={status === "thinking" || status === "speaking" ? 0.68 : 0.38}
          />
        </mesh>
      </group>
    </Float>
  );
}

export default function AvatarRenderer({ modelPath, status }: AvatarRendererProps) {
  const [modelAvailable, setModelAvailable] = useState(false);

  useEffect(() => {
    let active = true;

    fetch(modelPath, { method: "HEAD" })
      .then((response) => {
        if (active) setModelAvailable(response.ok);
      })
      .catch(() => {
        if (active) setModelAvailable(false);
      });

    return () => {
      active = false;
    };
  }, [modelPath]);

  if (modelAvailable) {
    return <PremiumModel modelPath={modelPath} />;
  }

  return <HolographicFace status={status} />;
}
