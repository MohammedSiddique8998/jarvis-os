"use client";

import { useMemo, useState } from "react";
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

const responseMap = [
  {
    match: ["internship", "bibby", "marine"],
    status: "Working" as SystemStatus,
    agent: "Mission" as AgentMode,
    response:
      "Bibby Marine protocol active, Sid. Focus on domain notes, stakeholder questions, and one useful technical artefact per week.",
  },
  {
    match: ["dissertation", "msc", "research"],
    status: "Thinking" as SystemStatus,
    agent: "Study" as AgentMode,
    response:
      "Dissertation mode engaged. I recommend a tight research question, reproducible experiments, and a leakage check before every result claim.",
  },
  {
    match: ["job", "application", "cv", "cover letter", "linkedin"],
    status: "Working" as SystemStatus,
    agent: "Career" as AgentMode,
    response:
      "Career systems ready. I can frame a UK placement application around evidence, impact, tools, and ATS-friendly language.",
  },
  {
    match: ["portfolio", "project", "github"],
    status: "Working" as SystemStatus,
    agent: "Portfolio" as AgentMode,
    response:
      "Portfolio lane selected. Build one polished AI project with a clear README, demo path, and honest model evaluation.",
  },
  {
    match: ["plan", "today", "priority", "mission"],
    status: "Thinking" as SystemStatus,
    agent: "Core" as AgentMode,
    response:
      "Today I would run three blocks: dissertation progress, one targeted application, then portfolio refinement. Clean, calm execution.",
  },
  {
    match: ["voice", "listen", "speak"],
    status: "Listening" as SystemStatus,
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
      status: "Completed" as SystemStatus,
      agent: "Core" as AgentMode,
      response:
        "Command received, Sid. I have logged the intent and I am ready for the next instruction.",
    }
  );
}

function speak(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-GB";
  utterance.rate = 0.88;
  utterance.pitch = 0.72;
  utterance.volume = 0.9;
  window.speechSynthesis.speak(utterance);
}

export default function Home() {
  const [agent, setAgent] = useState<AgentMode>("Core");
  const [status, setStatus] = useState<SystemStatus>("Idle");
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [isTyping, setIsTyping] = useState(false);

  const lastJarvisMessage = useMemo(
    () => [...messages].reverse().find((message) => message.role === "jarvis"),
    [messages],
  );

  function handleAgentChange(nextAgent: AgentMode) {
    setAgent(nextAgent);
    setStatus("Completed");
    const response = `${nextAgent} mode activated, Sid.`;
    setMessages((previous) => [...previous, createMessage("jarvis", response)]);
    speak(response);
  }

  function handleCommand(command: string) {
    const trimmed = command.trim();
    if (!trimmed) return;

    const userMessage = createMessage("sid", trimmed);
    const result = generateResponse(trimmed);
    setMessages((previous) => [...previous, userMessage]);
    setAgent(result.agent);
    setStatus(result.status);
    setIsTyping(true);

    window.setTimeout(() => {
      setMessages((previous) => [
        ...previous,
        createMessage("jarvis", result.response),
      ]);
      setIsTyping(false);
      setStatus("Completed");
      speak(result.response);
    }, 520);
  }

  function handleVoiceResult(text: string) {
    setStatus("Thinking");
    handleCommand(text);
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#02040b] text-slate-100">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(103,232,249,0.2),transparent_28%),radial-gradient(circle_at_82%_74%,rgba(168,85,247,0.16),transparent_30%),linear-gradient(145deg,#02040b_0%,#06121f_46%,#030712_100%)]" />
      <div className="fixed inset-0 starscape opacity-70" />
      <div className="fixed inset-0 scanline opacity-20" />

      <div className="relative z-10 grid min-h-screen grid-cols-[minmax(220px,260px)_1fr_minmax(300px,380px)] gap-4 p-4 max-xl:grid-cols-[220px_1fr] max-lg:grid-cols-1 max-lg:overflow-y-auto">
        <AgentSidebar activeAgent={agent} onAgentChange={handleAgentChange} />

        <section className="relative flex min-h-[calc(100vh-2rem)] flex-col overflow-hidden rounded-[2rem] border border-cyan-300/20 bg-black/20 shadow-[0_0_80px_rgba(34,211,238,0.12)] backdrop-blur-xl max-lg:min-h-[740px]">
          <StatusPanel
            agent={agent}
            status={status}
            latestMessage={lastJarvisMessage?.text ?? "Systems standing by."}
          />

          <div className="relative flex flex-1 items-center justify-center overflow-hidden">
            <AvatarScene status={status} />

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              className="pointer-events-none absolute bottom-8 left-1/2 w-[min(760px,82%)] -translate-x-1/2 text-center"
            >
              <p className="text-xs uppercase tracking-[0.42em] text-cyan-200/80">
                Humanoid Companion Core
              </p>
              <h1 className="mt-2 text-5xl font-black tracking-[0.24em] text-white glow-text max-md:text-3xl">
                JARVIS OS
              </h1>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-cyan-100/75">
                How may I assist you today, Sid?
              </p>
            </motion.div>

            <AnimatePresence>
              {status === "Listening" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="absolute top-24 rounded-full border border-cyan-300/40 bg-cyan-950/50 px-5 py-2 text-sm text-cyan-100 shadow-[0_0_35px_rgba(34,211,238,0.28)] backdrop-blur"
                >
                  Listening for your command, Sid.
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <VoiceOrb
            status={status}
            onStatusChange={setStatus}
            onTranscript={handleVoiceResult}
          />
        </section>

        <aside className="flex min-h-[calc(100vh-2rem)] flex-col gap-4 max-xl:col-span-2 max-lg:col-span-1">
          <ChatPanel
            messages={messages}
            isTyping={isTyping}
            onSend={handleCommand}
          />
          <MissionPanel />
        </aside>
      </div>
    </main>
  );
}
