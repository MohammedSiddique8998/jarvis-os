"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Mic, MicOff, RefreshCw, Waves } from "lucide-react";
import type { SystemStatus } from "./StatusPanel";

type SpeechRecognitionResultEvent = Event & {
  results: SpeechRecognitionResultList;
};

type SpeechRecognitionErrorEvent = Event & {
  error?: string;
};

type BrowserSpeechRecognition = EventTarget & {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionResultEvent) => void) | null;
  onspeechend: (() => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
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
  onTranscript: (text: string) => Promise<string>;
};

const statusCopy: Record<SystemStatus, string> = {
  idle: "Ready for voice command",
  listening: "Listening...",
  thinking: "Processing command",
  speaking: "Speaking reply",
  error: "Voice needs browser permission",
};

export default function VoiceOrb({
  status,
  onStatusChange,
  onTranscript,
}: VoiceOrbProps) {
  const recognitionRef = useRef<BrowserSpeechRecognition | null>(null);
  const isRunningRef = useRef(false);
  const handledResultRef = useRef(false);
  const conversationModeRef = useRef(false);
  const statusRef = useRef(status);
  const [conversationMode, setConversationMode] = useState(false);
  const [lastHeard, setLastHeard] = useState("");
  const [voiceError, setVoiceError] = useState("");

  const isActive = status === "listening" || status === "thinking" || status === "speaking";

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  function getRecognition() {
    return window.SpeechRecognition ?? window.webkitSpeechRecognition;
  }

  function stopCurrentRecognition() {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.stop();
    } catch {
      recognitionRef.current.abort();
    }
  }

  function speakReply(text: string) {
    if (!("speechSynthesis" in window)) {
      onStatusChange("idle");
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-GB";
    utterance.rate = 0.9;
    utterance.pitch = 0.76;
    utterance.volume = 0.92;
    utterance.onstart = () => onStatusChange("speaking");
    utterance.onend = () => {
      if (conversationModeRef.current) {
        window.setTimeout(() => startListening(), 360);
      } else {
        onStatusChange("idle");
      }
    };
    utterance.onerror = () => onStatusChange("idle");
    window.speechSynthesis.speak(utterance);
  }

  async function handleTranscript(transcript: string) {
    const cleanTranscript = transcript.trim();
    if (!cleanTranscript) {
      onStatusChange("idle");
      return;
    }

    handledResultRef.current = true;
    setLastHeard(cleanTranscript);
    setVoiceError("");
    onStatusChange("thinking");

    try {
      const reply = await onTranscript(cleanTranscript);
      speakReply(reply);
    } catch {
      setVoiceError("I heard you, but the command handler failed.");
      onStatusChange("error");
    }
  }

  function startListening() {
    const Recognition = getRecognition();

    if (!Recognition) {
      setVoiceError("Use Chrome or Edge for browser speech recognition.");
      onStatusChange("error");
      return;
    }

    if (isRunningRef.current) {
      stopCurrentRecognition();
      return;
    }

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    const recognition = new Recognition();
    recognitionRef.current = recognition;
    handledResultRef.current = false;
    recognition.lang = "en-GB";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      isRunningRef.current = true;
      setVoiceError("");
      onStatusChange("listening");
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript ?? "";
      void handleTranscript(transcript);
    };

    recognition.onspeechend = () => {
      stopCurrentRecognition();
    };

    recognition.onerror = (event) => {
      isRunningRef.current = false;
      const error = event.error ?? "unknown";
      setVoiceError(`Voice recognition error: ${error}. Try the mic again.`);
      onStatusChange("error");
    };

    recognition.onend = () => {
      isRunningRef.current = false;
      recognitionRef.current = null;

      if (!handledResultRef.current && statusRef.current === "listening") {
        onStatusChange("idle");
      }
    };

    try {
      recognition.start();
    } catch {
      isRunningRef.current = false;
      setVoiceError("The microphone is already starting. Please try again.");
      onStatusChange("error");
    }
  }

  function toggleConversationMode() {
    const nextValue = !conversationMode;
    conversationModeRef.current = nextValue;
    setConversationMode(nextValue);
  }

  return (
    <div className="voice-console pointer-events-auto">
      <div className="flex items-center gap-4">
        <button
          onClick={startListening}
          className={`voice-core-button ${isActive ? "active" : ""}`}
          aria-label="Start voice command"
        >
          <motion.span
            animate={
              isActive
                ? { scale: [1, 1.55, 1], opacity: [0.5, 0.04, 0.5] }
                : { scale: [1, 1.16, 1], opacity: [0.22, 0.08, 0.22] }
            }
            transition={{ duration: 1.6, repeat: Infinity }}
            className="absolute inset-0 rounded-full border border-cyan-200/60"
          />
          {status === "error" ? <MicOff size={26} /> : <Mic size={26} />}
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-cyan-200/75">
              <Waves size={15} />
              {statusCopy[status]}
            </div>
            <button
              type="button"
              onClick={toggleConversationMode}
              className={`conversation-toggle ${conversationMode ? "enabled" : ""}`}
            >
              <RefreshCw size={13} />
              Continuous
            </button>
          </div>

          <div className="voice-bars mt-3">
            {Array.from({ length: 17 }).map((_, index) => (
              <span key={index} className={isActive ? "active" : ""} />
            ))}
          </div>

          <p className="mt-2 truncate text-xs text-slate-400">
            {voiceError || (lastHeard ? `Heard: ${lastHeard}` : "Click mic, speak, then Jarvis replies.")}
          </p>
        </div>
      </div>
    </div>
  );
}
