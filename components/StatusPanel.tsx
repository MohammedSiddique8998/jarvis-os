"use client";

import { motion } from "framer-motion";
import { Activity, RadioTower, ShieldCheck } from "lucide-react";

export type SystemStatus = "Idle" | "Listening" | "Thinking" | "Working" | "Completed";

type StatusPanelProps = {
  agent: string;
  status: SystemStatus;
  latestMessage: string;
};

const statusClasses: Record<SystemStatus, string> = {
  Idle: "border-slate-300/20 bg-slate-300/10 text-slate-100",
  Listening: "border-cyan-200/40 bg-cyan-300/15 text-cyan-50",
  Thinking: "border-violet-200/40 bg-violet-300/15 text-violet-50",
  Working: "border-amber-200/40 bg-amber-300/15 text-amber-50",
  Completed: "border-emerald-200/40 bg-emerald-300/15 text-emerald-50",
};

export default function StatusPanel({ agent, status, latestMessage }: StatusPanelProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative z-10 flex items-center justify-between gap-4 border-b border-cyan-200/10 bg-black/24 p-5 backdrop-blur-xl max-md:flex-col max-md:items-start"
    >
      <div>
        <p className="text-xs uppercase tracking-[0.38em] text-cyan-200/70">
          Good evening, Sid.
        </p>
        <h1 className="mt-1 text-2xl font-black tracking-[0.18em] text-white">
          Companion Command Center
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-400">{latestMessage}</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className={`rounded-full border px-3 py-1.5 text-xs ${statusClasses[status]}`}>
          {status}
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
