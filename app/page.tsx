"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mic,
  Send,
  Brain,
  Briefcase,
  GraduationCap,
  Shield,
  Rocket,
  Settings,
  Zap,
} from "lucide-react";
import JarvisScene from "./JarvisScene";

declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
}

const agents = [
  ["Chief", Brain],
  ["Career", Briefcase],
  ["Study", GraduationCap],
  ["Internship", Shield],
  ["Dissertation", Rocket],
  ["System", Settings],
];

export default function Home() {
  const [input, setInput] = useState("");
  const [status, setStatus] = useState("ONLINE");
  const [agent, setAgent] = useState("Chief");
  const [messages, setMessages] = useState([
    "JARVIS: Online. Good evening, Sid.",
    "JARVIS: Companion interface activated.",
  ]);

  function speak(text: string) {
    window.speechSynthesis.cancel();
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-GB";
    speech.rate = 0.82;
    speech.pitch = 0.62;
    speech.volume = 1;
    window.speechSynthesis.speak(speech);
  }

  function reply(command: string) {
    const lower = command.toLowerCase();
    let response = `${agent} mode active. Command received, Sid.`;

    if (lower.includes("plan")) {
      response =
        "Today’s mission stack: internship preparation, dissertation progress, job applications, and portfolio refinement.";
    } else if (lower.includes("internship")) {
      response =
        "Internship protocol active. Learn fast, document daily, ask precise questions, and build trust from day one.";
    } else if (lower.includes("study")) {
      response =
        "Study mode active. Forty five minutes of focused execution. No distractions, Sid.";
    } else if (lower.includes("motivate")) {
      response =
        "You are not behind, Sid. You are building momentum. Stay sharp, execute calmly, and keep moving.";
    }

    setMessages((prev) => [...prev, `SID: ${command}`, `JARVIS: ${response}`]);
    speak(response);
  }

  function sendMessage() {
    if (!input.trim()) return;
    reply(input);
    setInput("");
  }

  function listen() {
    const SpeechRecognition = window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice recognition works best in Google Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-GB";
    recognition.start();

    setStatus("LISTENING");

    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      setInput(text);
      setStatus("THINKING");
      reply(text);
      setStatus("ONLINE");
    };

    recognition.onend = () => setStatus("ONLINE");
  }

  return (
    <main className="relative h-screen overflow-hidden bg-[#020617] text-cyan-200">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(34,211,238,0.22),transparent_30%),radial-gradient(circle_at_20%_80%,rgba(168,85,247,0.18),transparent_30%),linear-gradient(135deg,#020617,#020617,#06111f)]" />
      <div className="scanline absolute inset-0 opacity-20" />

      <div className="relative z-10 grid h-screen grid-cols-[280px_1fr_320px] gap-5 p-5">
        <motion.aside
          initial={{ x: -80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="hud-glass hud-border rounded-3xl p-5"
        >
          <h1 className="glow-text text-3xl font-black tracking-[0.25em]">
            JARVIS
          </h1>
          <p className="mb-8 mt-2 text-xs tracking-[0.35em] text-cyan-400">
            COMPANION OS
          </p>

          <div className="space-y-3">
            {agents.map(([name, Icon]: any) => (
              <button
                key={name}
                onClick={() => {
                  setAgent(name);
                  speak(`${name} mode activated, Sid.`);
                }}
                className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-4 transition hover:scale-[1.03] ${
                  agent === name
                    ? "border-cyan-300 bg-cyan-400/20 text-white shadow-[0_0_25px_rgba(34,211,238,0.35)]"
                    : "border-cyan-400/25 bg-black/30"
                }`}
              >
                <Icon size={21} />
                <span>{name} Mode</span>
              </button>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-cyan-400/30 bg-black/35 p-4 text-sm">
            <p className="text-emerald-400">● ONLINE</p>
            <p>● Voice System Ready</p>
            <p>● Visual Core Active</p>
            <p>● Agent: {agent}</p>
          </div>
        </motion.aside>

        <section className="relative flex flex-col items-center justify-between">
          <motion.div
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="hud-glass hud-border w-full rounded-3xl p-4 text-center"
          >
            <p className="text-xs uppercase tracking-[0.5em] text-cyan-400">
              Good Evening Sid
            </p>
            <h2 className="glow-text text-5xl font-black tracking-[0.25em]">
              JARVIS ONLINE
            </h2>
            <p className="text-cyan-300">Status: {status}</p>
          </motion.div>

          <motion.div
            initial={{ scale: 0.88, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="relative h-[520px] w-full"
          >
            <div className="absolute inset-0">
              <JarvisScene />
            </div>

            <motion.div
              animate={{
                scale: [1, 1.06, 1],
                opacity: [0.65, 1, 0.65],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
              className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/30 shadow-[0_0_120px_rgba(34,211,238,0.45)]"
            />

            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
              className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-purple-400/25"
            />

            <div className="absolute bottom-8 left-1/2 w-[72%] -translate-x-1/2 rounded-3xl border border-cyan-400/35 bg-black/55 p-4 text-center shadow-[0_0_45px_rgba(34,211,238,0.25)] backdrop-blur">
              <p className="text-xl font-semibold text-white">
                How can I assist you, Sid?
              </p>
              <p className="text-sm text-cyan-300">
                Speak naturally. I am listening.
              </p>
            </div>
          </motion.div>

          <div className="hud-glass hud-border flex w-full items-center gap-4 rounded-3xl p-4">
            <button
              onClick={listen}
              className="flex h-16 w-16 items-center justify-center rounded-full border border-cyan-300 bg-cyan-400/20 shadow-[0_0_45px_rgba(34,211,238,0.55)] transition hover:scale-110"
            >
              <Mic size={30} />
            </button>

            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Speak or type your command, Sid..."
              className="flex-1 rounded-2xl border border-cyan-400/30 bg-black/60 px-5 py-4 outline-none"
            />

            <button
              onClick={sendMessage}
              className="rounded-2xl bg-cyan-600 p-4 text-white shadow-[0_0_30px_rgba(34,211,238,0.45)] transition hover:scale-105"
            >
              <Send />
            </button>
          </div>
        </section>

        <motion.aside
          initial={{ x: 80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="space-y-5"
        >
          <div className="hud-glass hud-border rounded-3xl p-5">
            <h3 className="mb-4 text-xl font-bold text-white">
              Live Conversation
            </h3>

            <div className="h-[300px] overflow-y-auto rounded-2xl border border-cyan-400/25 bg-black/40 p-4 text-sm">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-3 rounded-xl bg-cyan-950/35 p-3"
                >
                  {msg}
                </motion.div>
              ))}
            </div>
          </div>

          <div className="hud-glass hud-border rounded-3xl p-5">
            <h3 className="mb-4 text-xl font-bold text-white">
              Voice Activity
            </h3>

            <div className="voice-bars">
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>

            <p className="mt-4 text-sm text-cyan-300">
              Current State: {status}
            </p>
          </div>

          <div className="hud-glass hud-border rounded-3xl p-5">
            <h3 className="mb-4 text-xl font-bold text-white">
              Mission Stack
            </h3>

            {[
              "Bibby Marine Internship",
              "MSc Dissertation",
              "Job Applications",
              "AI Portfolio",
            ].map((task) => (
              <div
                key={task}
                className="mb-3 flex items-center gap-3 rounded-xl border border-cyan-400/25 bg-black/35 p-3"
              >
                <Zap size={18} className="text-cyan-300" />
                <span>{task}</span>
              </div>
            ))}
          </div>
        </motion.aside>
      </div>
    </main>
  );
}