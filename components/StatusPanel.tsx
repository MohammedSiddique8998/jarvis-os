"use client";

import { motion } from "framer-motion";
import { Activity, RadioTower, ShieldCheck } from "lucide-react";

export type SystemStatus = "idle" | "listening" | "thinking" | "speaking" | "error";

type StatusPanelProps = {
  agent: string;
  status: SystemStatus;
  latestMessage: string;
};

const statusClasses: Record<SystemStatus, string> = {
  idle: "border-slate-300/20 bg-slate-300/10 text-slate-100",
  listening: "border-cyan-200/50 bg-cyan-300/20 text-cyan-50 shadow-[0_0_22px_rgba(34,211,238,0.24)]",
  thinking: "border-violet-200/50 bg-violet-300/20 text-violet-50 shadow-[0_0_22px_rgba(168,85,247,0.22)]",
  speaking: "border-blue-200/50 bg-blue-300/20 text-blue-50 shadow-[0_0_22px_rgba(96,165,250,0.24)]",
  error: "border-rose-200/50 bg-rose-300/20 text-rose-50",
};

const statusLabels: Record<SystemStatus, string> = {
  idle: "Idle",
  listening: "Listening",
  thinking: "Thinking",
  speaking: "Speaking",
  error: "Error",
};

export default function StatusPanel({ agent, status, latestMessage }: StatusPanelProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      className="hud-surface relative z-10 flex items-center justify-between gap-4 p-4 max-md:flex-col max-md:items-start"
    >
      <div>
        <p className="text-xs uppercase tracking-[0.38em] text-cyan-200/70">
          Good evening, Sid.
        </p>
        <h1 className="mt-1 text-2xl font-black tracking-[0.18em] text-white max-sm:text-xl">
          Cinematic Companion Core
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-400">{latestMessage}</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className={`rounded-full border px-3 py-1.5 text-xs ${statusClasses[status]}`}>
          {statusLabels[status]}
        </span>
        <span className="inline-flex items-center gap-2 rounded-full border border-cyan-200/15 bg-black/25 px-3 py-1.5 text-xs text-cyan-100">
          <Activity size={14} />
          {agent}
        </span>
        <span className="inline-flex items-center gap-2 rounded-full border border-cyan-200/15 bg-black/25 px-3 py-1.5 text-xs text-cyan-100">
          <RadioTower size={14} />
          Voice
        </span>
        <span className="inline-flex items-center gap-2 rounded-full border border-cyan-200/15 bg-black/25 px-3 py-1.5 text-xs text-cyan-100">
          <ShieldCheck size={14} />
          Local UI
        </span>
      </div>
    </motion.header>
  );
}
