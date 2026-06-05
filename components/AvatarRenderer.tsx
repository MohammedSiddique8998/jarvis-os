"use client";

import { Float, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import type { SystemStatus } from "./StatusPanel";

type AvatarRendererProps = {
  modelPath: string;
  status: SystemStatus;
};

type EmissiveMaterial = THREE.Material & {
  emissive?: THREE.Color;
  emissiveIntensity?: number;
};

function enhanceMaterial(material: THREE.Material) {
  const enhanced = material.clone() as EmissiveMaterial;
  if ("emissive" in enhanced) {
    enhanced.emissive = new THREE.Color("#38bdf8");
    enhanced.emissiveIntensity = 0.18;
  }
  enhanced.transparent = material.transparent;
  return enhanced;
}

function PremiumModel({ modelPath, status }: AvatarRendererProps) {
  const gltf = useGLTF(modelPath);
  const modelRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);

  const preparedModel = useMemo(() => {
    const clonedScene = gltf.scene.clone(true);
    const emissiveMaterials: EmissiveMaterial[] = [];

    clonedScene.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      object.castShadow = false;
      object.receiveShadow = false;

      if (Array.isArray(object.material)) {
        object.material = object.material.map((material) => {
          const enhanced = enhanceMaterial(material);
          emissiveMaterials.push(enhanced);
          return enhanced;
        });
      } else {
        const enhanced = enhanceMaterial(object.material);
        object.material = enhanced;
        emissiveMaterials.push(enhanced);
      }
    });

    const box = new THREE.Box3().setFromObject(clonedScene);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    const largestAxis = Math.max(size.x, size.y, size.z, 0.001);
    const scale = 2.45 / largestAxis;
    clonedScene.position.set(-center.x * scale, -center.y * scale + 0.18, -center.z * scale);
    return { scene: clonedScene, scale, materials: emissiveMaterials };
  }, [gltf.scene]);

  useFrame(({ clock }) => {
    const speakingPulse = Math.abs(Math.sin(clock.elapsedTime * 10));
    const thinkingPulse = Math.abs(Math.sin(clock.elapsedTime * 4.5));
    const statusBoost =
      status === "listening" ? 0.42 : status === "speaking" ? 0.34 + speakingPulse * 0.38 : status === "thinking" ? 0.28 + thinkingPulse * 0.25 : 0.16;

    if (modelRef.current) {
      modelRef.current.position.y = Math.sin(clock.elapsedTime * 1.1) * 0.055;
      modelRef.current.rotation.z = Math.sin(clock.elapsedTime * 0.62) * 0.018;
    }

    if (coreRef.current) {
      const scale = status === "speaking" ? 1 + speakingPulse * 0.26 : status === "thinking" ? 1 + thinkingPulse * 0.18 : 1;
      coreRef.current.scale.setScalar(scale);
    }

    preparedModel.materials.forEach((material) => {
      if (material.emissiveIntensity !== undefined) {
        material.emissiveIntensity = THREE.MathUtils.lerp(
          material.emissiveIntensity,
          statusBoost,
          0.08,
        );
      }
    });
  });

  return (
    <Float speed={1.15} rotationIntensity={0.08} floatIntensity={0.2}>
      <group ref={modelRef} scale={preparedModel.scale} position={[0, 0.02, 0]}>
        <primitive object={preparedModel.scene} />
      </group>
      <mesh ref={coreRef} position={[0, 0.22, 0.38]} scale={0.24}>
        <sphereGeometry args={[1, 48, 24]} />
        <meshBasicMaterial
          color={status === "thinking" ? "#c084fc" : "#e0faff"}
          transparent
          opacity={status === "speaking" ? 0.72 : 0.42}
        />
      </mesh>
      <pointLight
        position={[0, 0.55, 0.9]}
        intensity={status === "listening" ? 24 : status === "speaking" ? 22 : 14}
        color={status === "thinking" ? "#a855f7" : "#67e8f9"}
      />
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
      const pulse =
        status === "speaking"
          ? 0.06 + Math.abs(Math.sin(clock.elapsedTime * 12)) * 0.075
          : 0.035;
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

  if (!modelAvailable) {
    return <HolographicFace status={status} />;
  }

  return (
    <Suspense fallback={<HolographicFace status={status} />}>
      <PremiumModel modelPath={modelPath} status={status} />
    </Suspense>
  );
}

useGLTF.preload("/models/jarvis-avatar.glb");
