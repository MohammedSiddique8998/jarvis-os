"use client";

import { motion } from "framer-motion";
import {
  BriefcaseBusiness,
  Cpu,
  GraduationCap,
  Mic2,
  Orbit,
  Rocket,
} from "lucide-react";

type AgentMode = "Core" | "Study" | "Career" | "Mission" | "Portfolio" | "Voice";

type AgentSidebarProps = {
  activeAgent: AgentMode;
  onAgentChange: (agent: AgentMode) => void;
};

const agents: Array<{
  name: AgentMode;
  label: string;
  detail: string;
  Icon: typeof Cpu;
}> = [
  { name: "Core", label: "Core AI", detail: "Command routing", Icon: Cpu },
  { name: "Study", label: "Study", detail: "MSc execution", Icon: GraduationCap },
  { name: "Career", label: "Career", detail: "UK applications", Icon: BriefcaseBusiness },
  { name: "Mission", label: "Mission", detail: "Internship ops", Icon: Orbit },
  { name: "Portfolio", label: "Portfolio", detail: "AI build lane", Icon: Rocket },
  { name: "Voice", label: "Voice", detail: "Speech interface", Icon: Mic2 },
];

export default function AgentSidebar({
  activeAgent,
  onAgentChange,
}: AgentSidebarProps) {
  return (
    <motion.aside
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.55 }}
      className="hud-panel flex max-h-[calc(100vh-10rem)] min-h-[520px] flex-col gap-5 p-5 max-lg:min-h-0 max-lg:max-h-none"
    >
      <div>
        <p className="text-xs uppercase tracking-[0.46em] text-cyan-200/70">
          Companion
        </p>
        <h2 className="mt-2 text-3xl font-black tracking-[0.2em] text-white glow-text">
          JARVIS
        </h2>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          Premium holographic interface configured for Sid.
        </p>
      </div>

      <div className="space-y-2">
        {agents.map(({ name, label, detail, Icon }, index) => {
          const isActive = activeAgent === name;

          return (
            <motion.button
              key={name}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.04 }}
              onClick={() => onAgentChange(name)}
              className={`group hud-command-button flex w-full items-center gap-3 p-3 text-left transition duration-300 ${
                isActive
                  ? "border-cyan-200/80 bg-cyan-300/15 text-white shadow-[0_0_30px_rgba(34,211,238,0.25)]"
                  : "border-white/10 bg-white/[0.03] text-slate-300 hover:border-cyan-200/40 hover:bg-cyan-300/10"
              }`}
            >
              <span
                className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${
                  isActive
                    ? "border-cyan-200/70 bg-cyan-300/20 text-cyan-100"
                    : "border-white/10 bg-black/25 text-cyan-200/70"
                }`}
              >
                <Icon size={20} />
              </span>
              <span>
                <span className="block text-sm font-semibold">{label}</span>
                <span className="text-xs text-slate-400">{detail}</span>
              </span>
            </motion.button>
          );
        })}
      </div>

      <div className="mt-auto rounded-[1.5rem] border border-cyan-200/15 bg-black/30 p-4">
        <p className="text-xs uppercase tracking-[0.34em] text-cyan-200/70">
          Identity Lock
        </p>
        <p className="mt-3 text-sm text-slate-300">
          Display profile: Sid. External identity fields are intentionally
          suppressed from the UI.
        </p>
      </div>
    </motion.aside>
  );
}
