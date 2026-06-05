"use client";

import { useState } from "react";
import {
  Mic,
  Send,
  Users,
  Briefcase,
  GraduationCap,
  Rocket,
  Brain,
  CalendarDays,
  Settings,
  FileText,
  Folder,
  Shield,
  Zap,
} from "lucide-react";

declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
}

const agents = [
  ["Chief of Staff", "Executive Overview", Users],
  ["Career Coach", "Career & Job Assistant", Briefcase],
  ["Study Mentor", "Learning & Productivity", GraduationCap],
  ["Dissertation AI", "Research & Writing", Rocket],
  ["Internship Coach", "Internship & Skills", Shield],
  ["Life Admin", "Tasks & Reminders", Settings],
];

export default function Home() {
  const [input, setInput] = useState("");
  const [status, setStatus] = useState("ONLINE");
  const [agent, setAgent] = useState("Chief of Staff");
  const [messages, setMessages] = useState([
    "JARVIS: Online. Good evening, Sid.",
    "JARVIS: What shall we achieve today?",
  ]);

  function speak(text: string) {
    window.speechSynthesis.cancel();
    const speech = new SpeechSynthesisUtterance(text);
    speech.rate = 0.82;
    speech.pitch = 0.65;
    speech.volume = 1;
    speech.lang = "en-GB";
    window.speechSynthesis.speak(speech);
  }

  function reply(command: string) {
    const lower = command.toLowerCase();
    let response = `${agent} mode active. Command received, Sid.`;

    if (lower.includes("plan")) {
      response =
        "Certainly, Sid. Internship preparation is high priority. Dissertation research is medium priority. Job applications are medium priority. Portfolio development is low priority for today.";
    } else if (lower.includes("internship")) {
      response =
        "Internship protocol activated. Learn fast, document daily, ask precise questions, and build trust from day one.";
    } else if (lower.includes("study")) {
      response =
        "Study mode activated. Forty five minutes of focus. No distractions. I will hold the line.";
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
      alert("Use Google Chrome for voice recognition.");
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
      <div
        className="absolute inset-0 bg-cover bg-center opacity-80"
        style={{ backgroundImage: "url('/jarvis-bg.png')" }}
      />

      <div className="absolute inset-0 bg-black/35" />
      <div className="scanline absolute inset-0 opacity-20" />

      <div className="relative z-10 grid h-screen grid-cols-[330px_1fr_390px] gap-4 p-4">
        <aside className="space-y-4">
          <div className="hud-panel rounded-2xl p-5">
            <h1 className="text-3xl font-black tracking-[0.28em] text-cyan-300">
              JARVIS OS
            </h1>
            <p className="mt-1 text-xs tracking-[0.3em] text-cyan-500">
              v2.0.1
            </p>
          </div>

          <div className="hud-panel rounded-2xl p-5">
            <p className="mb-4 text-sm uppercase tracking-[0.25em] text-cyan-400">
              Agent Command Center
            </p>

            <div className="space-y-3">
              {agents.map(([name, subtitle, Icon]: any) => (
                <button
                  key={name}
                  onClick={() => {
                    setAgent(name);
                    speak(`${name} activated, Sid.`);
                  }}
                  className="hud-button flex w-full items-center justify-between rounded-xl px-4 py-4 text-left transition"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="text-cyan-300" />
                    <div>
                      <p className="font-bold text-white">{name}</p>
                      <p className="text-xs text-cyan-300">{subtitle}</p>
                    </div>
                  </div>
                  <span className="text-2xl text-cyan-300">›</span>
                </button>
              ))}
            </div>
          </div>

          <div className="hud-panel rounded-2xl p-5 text-sm">
            <p className="mb-3 uppercase tracking-[0.2em] text-cyan-400">
              System Status
            </p>
            <p className="text-emerald-400">● JARVIS Online</p>
            <p>▣ Memory Core 100%</p>
            <p>▣ Voice Engine 100%</p>
            <p>▣ Connection Secure</p>
          </div>
        </aside>

        <section className="flex flex-col justify-between">
          <header className="hud-panel rounded-2xl p-4 text-center">
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-400">
              Good Evening, Sid
            </p>
            <h2 className="text-5xl font-black tracking-[0.18em] text-cyan-300">
              JARVIS
            </h2>
            <p className="tracking-[0.3em] text-cyan-400">ONLINE</p>
          </header>

          <div className="mx-auto w-[62%] rounded-2xl border border-cyan-400/40 bg-black/55 p-5 text-center shadow-[0_0_35px_rgba(34,211,238,0.25)]">
            <p className="text-xl text-white">How can I assist you today, Sid?</p>
            <p className="text-cyan-300">You can speak or type your command.</p>
          </div>

          <div className="mx-auto h-[260px] w-[70%] overflow-y-auto rounded-2xl border border-cyan-400/40 bg-black/60 p-5 shadow-[0_0_35px_rgba(34,211,238,0.2)]">
            {messages.map((msg, i) => (
              <div key={i} className="mb-3 text-sm">
                {msg}
              </div>
            ))}
          </div>

          <div className="mx-auto flex w-[75%] items-center gap-3">
            <button
              onClick={listen}
              className="rounded-xl border border-cyan-400/40 bg-cyan-950/70 p-4 shadow-[0_0_25px_rgba(34,211,238,0.3)]"
            >
              <Mic />
            </button>

            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Speak or type your command, Sid..."
              className="flex-1 rounded-xl border border-cyan-400/40 bg-black/70 px-5 py-4 outline-none"
            />

            <button
              onClick={sendMessage}
              className="rounded-xl bg-cyan-600 p-4 text-white shadow-[0_0_25px_rgba(34,211,238,0.35)]"
            >
              <Send />
            </button>
          </div>

          <div className="mx-auto grid w-[70%] grid-cols-3 gap-4">
            <div className="hud-panel rounded-xl p-3">
              <p className="text-xs">VOICE CONTROLS</p>
              <div className="wave mt-2" />
            </div>
            <button
              onClick={listen}
              className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-cyan-300 bg-cyan-500/20 shadow-[0_0_45px_rgba(34,211,238,0.5)]"
            >
              <Mic size={34} />
            </button>
            <div className="hud-panel rounded-xl p-3">
              <p className="text-xs">{status}</p>
              <div className="wave mt-2 bg-red-400" />
            </div>
          </div>
        </section>

        <aside className="space-y-4">
          <div className="hud-panel rounded-2xl p-5">
            <p className="mb-4 text-sm uppercase tracking-[0.25em] text-cyan-400">
              Mission Dashboard
            </p>

            {[
              ["Bibby Marine Internship", "In Progress", "text-emerald-400"],
              ["MSc Dissertation", "Planning", "text-yellow-400"],
              ["Job Applications", "Active", "text-emerald-400"],
              ["AI Portfolio Project", "In Development", "text-blue-400"],
            ].map(([title, status, color]) => (
              <div
                key={title}
                className="mb-3 rounded-xl border border-cyan-400/30 bg-black/40 p-3"
              >
                <p className="font-semibold text-white">{title}</p>
                <p className={`text-sm ${color}`}>{status}</p>
              </div>
            ))}
          </div>

          <div className="hud-panel rounded-2xl p-5">
            <p className="mb-3 text-sm uppercase tracking-[0.25em] text-cyan-400">
              JARVIS Memory Core
            </p>
            <Brain className="mb-3 text-cyan-300" />
            <p className="text-sm">
              I remember your priorities: internship, dissertation, applications,
              portfolio, and daily execution.
            </p>
          </div>

          <div className="hud-panel rounded-2xl p-5">
            <p className="mb-4 text-sm uppercase tracking-[0.25em] text-cyan-400">
              Upcoming Events
            </p>

            {[
              "Internship Check-in",
              "Dissertation Supervisor Meeting",
              "CV Review",
            ].map((event) => (
              <div
                key={event}
                className="mb-3 rounded-xl border border-cyan-400/30 bg-black/40 p-3"
              >
                <p className="text-white">{event}</p>
                <p className="text-xs text-cyan-300">Scheduled</p>
              </div>
            ))}
          </div>

          <div className="hud-panel rounded-2xl p-5">
            <p className="mb-4 text-sm uppercase tracking-[0.25em] text-cyan-400">
              System Shortcuts
            </p>
            <div className="grid grid-cols-5 gap-3">
              {[FileText, CalendarDays, Zap, Folder, Settings].map((Icon, i) => (
                <button
                  key={i}
                  className="rounded-xl border border-cyan-400/30 bg-black/40 p-3"
                >
                  <Icon size={20} />
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}