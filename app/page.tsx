"use client";

import { useState } from "react";
import { Mic, Send, Brain, Briefcase, GraduationCap, Rocket } from "lucide-react";

declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
}

export default function Home() {
  const [input, setInput] = useState("");
  const [status, setStatus] = useState("ONLINE");
  const [messages, setMessages] = useState([
    "JARVIS: Online. Good evening, Sid.",
    "JARVIS: Voice systems ready. Speak your command.",
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
    let response = "Command received, Sid. I am ready to assist.";

    if (command.toLowerCase().includes("plan")) {
      response =
        "Certainly, Sid. Priority one: internship preparation. Priority two: dissertation. Priority three: job applications. Priority four: portfolio improvement.";
    }

    if (command.toLowerCase().includes("study")) {
      response =
        "Study mode activated. Focus for forty five minutes. No distractions. I will hold the line.";
    }

    if (command.toLowerCase().includes("internship")) {
      response =
        "Internship protocol activated. Learn fast, document daily, ask precise questions, and build trust from day one.";
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
    <main className="galaxy-bg relative min-h-screen overflow-hidden text-cyan-200">
      <div className="stars absolute inset-0" />

      <div className="relative z-10 grid h-screen grid-cols-[310px_1fr_360px] gap-5 p-5">
        <aside className="hud-card rounded-3xl p-6">
          <h1 className="mb-8 text-3xl font-black tracking-[0.25em] text-cyan-300">
            JARVIS OS
          </h1>

          {[
            "Chief of Staff",
            "Career Coach",
            "Study Mentor",
            "Dissertation AI",
            "Internship Coach",
            "Life Admin",
          ].map((agent) => (
            <button
              key={agent}
              onClick={() => speak(`${agent} activated, Sid.`)}
              className="mb-4 w-full rounded-2xl border border-cyan-400/30 bg-cyan-950/30 px-5 py-4 text-left text-lg hover:bg-cyan-400/20"
            >
              {agent} ›
            </button>
          ))}

          <div className="mt-8 rounded-2xl border border-cyan-400/30 p-4">
            <p className="text-cyan-300">SYSTEM STATUS</p>
            <p className="mt-2 text-emerald-400">● JARVIS Online</p>
            <p>● Voice Engine Ready</p>
            <p>● Visual Core Active</p>
          </div>
        </aside>

        <section className="flex flex-col gap-5">
          <header className="hud-card rounded-3xl p-6">
            <p className="text-sm uppercase tracking-[0.5em] text-cyan-400">
              Personal AI Command Center
            </p>
            <h2 className="text-5xl font-black text-white">
              Good evening, Sid
            </h2>
            <p className="mt-2 text-cyan-300">
              Speak naturally. I am listening.
            </p>
          </header>

          <div className="hud-card relative flex-1 overflow-hidden rounded-3xl p-6">
            <div className="absolute right-6 top-6 text-emerald-400">
              ● {status}
            </div>

            <div className="flex h-full items-center gap-10">
              <div className="flex w-1/2 flex-col items-center justify-center">
                <div className="robot-head mb-8" />
                <div className="arc-reactor" />
                <p className="mt-6 text-4xl font-black tracking-[0.25em] text-cyan-300">
                  JARVIS
                </p>
                <p className="text-cyan-400">ONLINE</p>
              </div>

              <div className="w-1/2">
                <div className="mb-5 rounded-2xl border border-cyan-400/30 bg-black/50 p-5 text-xl">
                  How can I assist you today, Sid?
                </div>

                <div className="h-[360px] overflow-y-auto rounded-2xl border border-cyan-400/30 bg-black/50 p-5">
                  {messages.map((msg, i) => (
                    <div key={i} className="mb-4 rounded-xl bg-cyan-950/30 p-4">
                      {msg}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={listen}
              className="rounded-2xl bg-cyan-500/20 px-6 shadow-[0_0_35px_rgba(34,211,238,0.35)]"
            >
              <Mic />
            </button>

            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Speak or type your command, Sid..."
              className="flex-1 rounded-2xl border border-cyan-400/30 bg-black/70 px-6 py-5 outline-none"
            />

            <button
              onClick={sendMessage}
              className="rounded-2xl bg-cyan-600 px-7 text-white"
            >
              <Send />
            </button>
          </div>
        </section>

        <aside className="space-y-5">
          <div className="hud-card rounded-3xl p-6">
            <h3 className="mb-5 text-2xl font-bold text-white">
              Mission Dashboard
            </h3>

            <div className="space-y-4">
              <Card icon={<Rocket />} title="Bibby Marine" status="In Progress" />
              <Card icon={<GraduationCap />} title="MSc Dissertation" status="Planning" />
              <Card icon={<Briefcase />} title="Job Applications" status="Active" />
              <Card icon={<Brain />} title="Memory Core" status="Ready" />
            </div>
          </div>

          <div className="hud-card rounded-3xl p-6">
            <h3 className="mb-3 text-2xl font-bold text-white">Memory Core</h3>
            <p>
              I track your priorities: internship, dissertation, career,
              portfolio, and daily execution.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}

function Card({
  icon,
  title,
  status,
}: {
  icon: React.ReactNode;
  title: string;
  status: string;
}) {
  return (
    <div className="rounded-2xl border border-cyan-400/30 bg-black/40 p-4">
      <div className="mb-2 text-cyan-300">{icon}</div>
      <p className="font-bold text-white">{title}</p>
      <p className="text-sm text-cyan-300">{status}</p>
    </div>
  );
}