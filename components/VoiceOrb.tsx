"use client";

import { motion } from "framer-motion";
import { Mic, Waves } from "lucide-react";
import type { SystemStatus } from "./StatusPanel";

type SpeechRecognitionResultEvent = Event & {
  results: SpeechRecognitionResultList;
};

type BrowserSpeechRecognition = EventTarget & {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionResultEvent) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
};

type SpeechRecognitionConstructor = new () => BrowserSpeechRecognition;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

type VoiceOrbProps = {
  status: SystemStatus;
  onStatusChange: (status: SystemStatus) => void;
  onTranscript: (text: string) => void;
};

function speak(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-GB";
  utterance.rate = 0.9;
  utterance.pitch = 0.74;
  utterance.volume = 0.9;
  window.speechSynthesis.speak(utterance);
}

export default function VoiceOrb({
  status,
  onStatusChange,
  onTranscript,
}: VoiceOrbProps) {
  const isActive = status === "Listening" || status === "Thinking" || status === "Working";

  function listen() {
    const Recognition = window.SpeechRecognition ?? window.webkitSpeechRecognition;

    if (!Recognition) {
      const fallback = "Voice recognition works best in Chrome or Edge. Typed command mode is ready, Sid.";
      speak(fallback);
      onStatusChange("Completed");
      return;
    }

    const recognition = new Recognition();
    recognition.lang = "en-GB";
    recognition.continuous = false;
    recognition.interimResults = false;
    onStatusChange("Listening");
    speak("Yes Sid, I am listening.");

    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript ?? "";
      if (transcript.trim()) {
        onTranscript(transcript);
      } else {
        onStatusChange("Completed");
      }
    };

    recognition.onerror = () => {
      onStatusChange("Completed");
      speak("Voice channel did not connect. Typed mode is still ready.");
    };

    recognition.onend = () => {
      if (status === "Listening") {
        onStatusChange("Completed");
      }
    };

    recognition.start();
  }

  return (
    <div className="relative z-10 border-t border-cyan-200/10 bg-black/25 p-4 backdrop-blur-xl">
      <div className="mx-auto flex max-w-3xl items-center justify-center gap-5 rounded-full border border-cyan-200/15 bg-black/35 px-5 py-3">
        <button
          onClick={listen}
          className="relative flex h-16 w-16 items-center justify-center rounded-full border border-cyan-200/60 bg-cyan-300/15 text-cyan-50 shadow-[0_0_42px_rgba(34,211,238,0.35)] transition hover:scale-105"
          aria-label="Start voice command"
        >
          <motion.span
            animate={isActive ? { scale: [1, 1.35, 1], opacity: [0.45, 0.1, 0.45] } : { scale: 1, opacity: 0.2 }}
            transition={{ duration: 1.4, repeat: Infinity }}
            className="absolute inset-0 rounded-full border border-cyan-200/60"
          />
          <Mic size={24} />
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-cyan-200/70">
            <Waves size={15} />
            Voice waveform
          </div>
          <div className="voice-bars mt-3">
            {Array.from({ length: 13 }).map((_, index) => (
              <span key={index} className={isActive ? "active" : ""} />
            ))}
          </div>
        </div>

        <div className="hidden text-right sm:block">
          <p className="text-sm font-semibold text-white">Speech synthesis ready</p>
          <p className="text-xs text-slate-400">Listening, thinking, speaking states</p>
        </div>
      </div>
    </div>
  );
}
