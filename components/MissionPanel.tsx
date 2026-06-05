"use client";

import { motion } from "framer-motion";
import { Anchor, BriefcaseBusiness, GraduationCap, Sparkles } from "lucide-react";

const missions = [
  {
    title: "Bibby Marine Internship",
    detail: "Placement readiness, domain notes, daily learning loops",
    progress: 78,
    Icon: Anchor,
  },
  {
    title: "MSc Dissertation",
    detail: "Research question, methodology, experiments, write-up",
    progress: 62,
    Icon: GraduationCap,
  },
  {
    title: "Job Applications",
    detail: "UK placements, tailored CVs, recruiter messages",
    progress: 54,
    Icon: BriefcaseBusiness,
  },
  {
    title: "AI Portfolio",
    detail: "Demo-ready projects with evaluation and documentation",
    progress: 46,
    Icon: Sparkles,
  },
];

export default function MissionPanel() {
  return (
    <section className="hud-panel p-4">
      <div className="mb-4">
        <p className="text-xs uppercase tracking-[0.34em] text-cyan-200/70">
          Mission Widgets
        </p>
        <h2 className="text-xl font-bold text-white">Floating priorities</h2>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
        {missions.map(({ title, detail, progress, Icon }, index) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            className="group rounded-3xl border border-cyan-200/15 bg-white/[0.035] p-4 transition hover:border-cyan-200/50 hover:bg-cyan-300/10"
          >
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-cyan-200/20 bg-cyan-300/10 text-cyan-100 shadow-[0_0_24px_rgba(34,211,238,0.12)]">
                <Icon size={20} />
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold text-white">{title}</h3>
                <p className="mt-1 text-xs leading-5 text-slate-400">{detail}</p>
              </div>
              <span className="text-sm font-semibold text-cyan-100">{progress}%</span>
            </div>
            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.9, delay: 0.15 + index * 0.08 }}
                className="h-full rounded-full bg-gradient-to-r from-cyan-200 via-blue-400 to-violet-400 shadow-[0_0_18px_rgba(34,211,238,0.45)]"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
