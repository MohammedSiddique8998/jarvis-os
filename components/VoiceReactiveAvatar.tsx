"use client";

import { useFrame } from "@react-three/fiber";
import { ReactNode, useRef } from "react";
import * as THREE from "three";
import type { SystemStatus } from "./StatusPanel";

type VoiceReactiveAvatarProps = {
  children: ReactNode;
  status: SystemStatus;
};

export default function VoiceReactiveAvatar({
  children,
  status,
}: VoiceReactiveAvatarProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ camera, clock, pointer }) => {
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.x * 1.28, 0.04);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, 1.1 + pointer.y * 0.52, 0.04);
    camera.lookAt(0, 0.2, 0);

    if (!groupRef.current) return;
    const targetScale =
      status === "listening" ? 1.08 : status === "speaking" ? 1.06 : status === "thinking" ? 1.04 : 1;
    groupRef.current.scale.setScalar(
      THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.055),
    );
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      pointer.x * 0.22 + Math.sin(clock.elapsedTime * 0.4) * 0.05,
      0.045,
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      -pointer.y * 0.08,
      0.04,
    );
    groupRef.current.position.y = Math.sin(clock.elapsedTime * 1.05) * 0.045;
  });

  return (
    <group ref={groupRef} position={[0, -0.22, 0]}>
      {children}
    </group>
  );
}
