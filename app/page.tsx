"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import AgentSidebar from "@/components/AgentSidebar";
import AvatarScene from "@/components/AvatarScene";
import ChatPanel, { ChatMessage } from "@/components/ChatPanel";
import MissionPanel from "@/components/MissionPanel";
import StatusPanel, { SystemStatus } from "@/components/StatusPanel";
import VoiceOrb from "@/components/VoiceOrb";

type AgentMode = "Core" | "Study" | "Career" | "Mission" | "Portfolio" | "Voice";

const initialMessages: ChatMessage[] = [
  {
    id: "boot-1",
    role: "jarvis",
    text: "Good evening, Sid. Companion interface online.",
  },
  {
    id: "boot-2",
    role: "jarvis",
    text: "Mission stack loaded: internship, dissertation, applications, and AI portfolio.",
  },
];

const startupSequence = [
  "Initializing JARVIS...",
  "Loading Systems...",
  "Good evening, Sid.",
];

const responseMap = [
  {
    match: ["internship", "bibby", "marine"],
    status: "thinking" as SystemStatus,
    agent: "Mission" as AgentMode,
    response:
      "Bibby Marine protocol active, Sid. Focus on domain notes, stakeholder questions, and one useful technical artefact per week.",
  },
  {
    match: ["dissertation", "msc", "research"],
    status: "thinking" as SystemStatus,
    agent: "Study" as AgentMode,
    response:
      "Dissertation mode engaged. I recommend a tight research question, reproducible experiments, and a leakage check before every result claim.",
  },
  {
    match: ["job", "application", "cv", "cover letter", "linkedin"],
    status: "thinking" as SystemStatus,
    agent: "Career" as AgentMode,
    response:
      "Career systems ready. I can frame a UK placement application around evidence, impact, tools, and ATS-friendly language.",
  },
  {
    match: ["portfolio", "project", "github"],
    status: "thinking" as SystemStatus,
    agent: "Portfolio" as AgentMode,
    response:
      "Portfolio lane selected. Build one polished AI project with a clear README, demo path, and honest model evaluation.",
  },
  {
    match: ["plan", "today", "priority", "mission"],
    status: "thinking" as SystemStatus,
    agent: "Core" as AgentMode,
    response:
      "Today I would run three blocks: dissertation progress, one targeted application, then portfolio refinement. Clean, calm execution.",
  },
  {
    match: ["voice", "listen", "speak"],
    status: "listening" as SystemStatus,
    agent: "Voice" as AgentMode,
    response: "Voice channel is live, Sid. Speak naturally and I will route the command.",
  },
];

function createMessage(role: ChatMessage["role"], text: string): ChatMessage {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    role,
    text,
  };
}

function generateResponse(command: string) {
  const normalized = command.toLowerCase();
  const match = responseMap.find((item) =>
    item.match.some((keyword) => normalized.includes(keyword)),
  );

  return (
    match ?? {
      status: "idle" as SystemStatus,
      agent: "Core" as AgentMode,
      response:
        "Command received, Sid. I have logged the intent and I am ready for the next instruction.",
    }
  );
}

export default function Home() {
  const [agent, setAgent] = useState<AgentMode>("Core");
  const [status, setStatus] = useState<SystemStatus>("idle");
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [isTyping, setIsTyping] = useState(false);
  const [startupStep, setStartupStep] = useState(0);
  const [showStartup, setShowStartup] = useState(true);

  const lastJarvisMessage = useMemo(
    () => [...messages].reverse().find((message) => message.role === "jarvis"),
    [messages],
  );

  useEffect(() => {
    const timers = startupSequence.map((_, index) =>
      window.setTimeout(() => setStartupStep(index), index * 820),
    );
    const doneTimer = window.setTimeout(() => setShowStartup(false), 3100);

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      window.clearTimeout(doneTimer);
    };
  }, []);

  function handleAgentChange(nextAgent: AgentMode) {
    setAgent(nextAgent);
    setStatus("idle");
    const response = `${nextAgent} mode activated, Sid.`;
    setMessages((previous) => [...previous, createMessage("jarvis", response)]);
  }

  function handleCommand(command: string, options: { voice?: boolean } = {}): Promise<string> {
    const trimmed = command.trim();
    if (!trimmed) return Promise.resolve("");

    const userMessage = createMessage("sid", trimmed);
    const result = generateResponse(trimmed);
    setMessages((previous) => [...previous, userMessage]);
    setAgent(result.agent);
    setStatus(result.status);
    setIsTyping(true);

    return new Promise((resolve) => {
      window.setTimeout(() => {
        setMessages((previous) => [
          ...previous,
          createMessage("jarvis", result.response),
        ]);
        setIsTyping(false);
        if (!options.voice) {
          setStatus("idle");
        }
        resolve(result.response);
      }, 620);
    });
  }

  async function handleVoiceResult(text: string) {
    setStatus("thinking");
    return handleCommand(text, { voice: true });
  }

  return (
    <main className={`cinematic-shell status-${status}`}>
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(103,232,249,0.22),transparent_28%),radial-gradient(circle_at_80%_70%,rgba(168,85,247,0.18),transparent_32%),linear-gradient(145deg,#02040b_0%,#06121f_44%,#030712_100%)]" />
      <div className="fixed inset-0 starscape opacity-65" />
      <div className="fixed inset-0 radial-grid opacity-70" />
      <div className="fixed inset-0 scanline opacity-25" />
      <div className="fixed inset-0 hud-vignette" />

      <AnimatePresence>
        {showStartup && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#02040b]/90 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="startup-card text-center"
            >
              <div className="startup-core mx-auto mb-6" />
              <p className="text-xs uppercase tracking-[0.56em] text-cyan-200/70">
                Companion boot sequence
              </p>
              <AnimatePresence mode="wait">
                <motion.h2
                  key={startupSequence[startupStep]}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35 }}
                  className="mt-4 text-3xl font-black tracking-[0.18em] text-white glow-text max-sm:text-xl"
                >
                  {startupSequence[startupStep]}
                </motion.h2>
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65 }}
        className="fixed left-1/2 top-4 z-20 w-[min(820px,calc(100vw-2rem))] -translate-x-1/2"
      >
        <StatusPanel
          agent={agent}
          status={status}
          latestMessage={lastJarvisMessage?.text ?? "Systems standing by."}
        />
      </motion.div>

      <section className="pointer-events-none fixed inset-0 z-10">
        <AvatarScene status={status} />
        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.12 }}
          className="absolute bottom-[22vh] left-1/2 w-[min(820px,82vw)] -translate-x-1/2 text-center"
        >
          <p className="text-xs uppercase tracking-[0.58em] text-cyan-200/80 max-sm:tracking-[0.32em]">
            Original Holographic Companion System
          </p>
          <h1 className="mt-3 text-6xl font-black tracking-[0.28em] text-white glow-text max-xl:text-5xl max-md:text-4xl max-sm:text-3xl">
            JARVIS OS
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-cyan-100/75">
            How may I assist you today, Sid?
          </p>
        </motion.div>

        <AnimatePresence>
          {status === "listening" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute left-1/2 top-[18vh] -translate-x-1/2 rounded-full border border-cyan-300/40 bg-cyan-950/40 px-5 py-2 text-sm text-cyan-100 shadow-[0_0_45px_rgba(34,211,238,0.35)] backdrop-blur"
            >
              Listening for your command, Sid.
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <div className="relative z-30 flex min-h-screen items-stretch justify-between gap-4 p-4 pt-36 max-xl:grid max-xl:grid-cols-[260px_1fr] max-lg:block max-lg:overflow-y-auto max-lg:pt-32">
        <div className="floating-hud-left w-[260px] shrink-0 max-lg:mb-4 max-lg:w-full">
          <AgentSidebar activeAgent={agent} onAgentChange={handleAgentChange} />
        </div>

        <div className="pointer-events-none min-h-[580px] flex-1 max-lg:hidden" />

        <aside className="floating-hud-right flex w-[390px] shrink-0 flex-col gap-4 max-xl:col-span-2 max-xl:w-full max-lg:w-full">
          <ChatPanel
            messages={messages}
            isTyping={isTyping}
            onSend={handleCommand}
          />
          <MissionPanel />
        </aside>
      </div>

      <div className="fixed bottom-4 left-1/2 z-40 w-[min(520px,calc(100vw-2rem))] -translate-x-1/2">
        <VoiceOrb
          status={status}
          onStatusChange={setStatus}
          onTranscript={handleVoiceResult}
        />
      </div>
    </main>
  );
}
