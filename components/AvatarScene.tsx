"use client";

import { Canvas } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";
import AvatarEffects from "./AvatarEffects";
import AvatarRenderer from "./AvatarRenderer";
import VoiceReactiveAvatar from "./VoiceReactiveAvatar";
import type { SystemStatus } from "./StatusPanel";

export const AVATAR_MODEL_PATH = "/models/jarvis-avatar.glb";

export default function AvatarScene({ status }: { status: SystemStatus }) {
  return (
    <div className="absolute inset-0">
      <Canvas
        camera={{ position: [0, 1.05, 4.45], fov: 43 }}
        dpr={[0.85, 1.2]}
        gl={{ antialias: false, powerPreference: "high-performance" }}
      >
        <color attach="background" args={["#02040b"]} />
        <ambientLight intensity={0.62} />
        <pointLight position={[0, 2.8, 2.4]} intensity={58} color="#67e8f9" />
        <pointLight position={[-3.2, -1.4, -2.2]} intensity={24} color="#a855f7" />
        <pointLight position={[2.8, 0.2, 1.4]} intensity={16} color="#60a5fa" />
        <Stars radius={88} depth={44} count={520} factor={4} saturation={0} fade speed={0.3} />
        <AvatarEffects status={status} />
        <VoiceReactiveAvatar status={status}>
          <AvatarRenderer status={status} modelPath={AVATAR_MODEL_PATH} />
        </VoiceReactiveAvatar>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.04, 0]}>
          <ringGeometry args={[0.96, 2.44, 180]} />
          <meshBasicMaterial color="#22d3ee" transparent opacity={0.16} side={THREE.DoubleSide} />
        </mesh>
      </Canvas>

      <div className="pointer-events-none absolute right-5 top-5 rounded-full border border-cyan-200/20 bg-black/25 px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-cyan-100/70 backdrop-blur">
        Premium avatar path: {AVATAR_MODEL_PATH}
      </div>

      <div className="avatar-data-label left-[18%] top-[28%] max-md:hidden">
        Neural face mesh
      </div>
      <div className="avatar-data-label right-[18%] top-[42%] max-md:hidden">
        Voice-linked core
      </div>
      <div className="avatar-data-label bottom-[28%] left-[24%] max-md:hidden">
        Cursor tracking online
      </div>
    </div>
  );
}
