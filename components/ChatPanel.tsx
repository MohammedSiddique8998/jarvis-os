"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SendHorizonal } from "lucide-react";

export type ChatMessage = {
  id: string;
  role: "sid" | "jarvis";
  text: string;
};

type ChatPanelProps = {
  messages: ChatMessage[];
  isTyping: boolean;
  onSend: (message: string) => void;
};

const promptSuggestions = [
  "Plan my day",
  "Bibby internship status",
  "MSc dissertation focus",
  "Tailor my CV",
];

export default function ChatPanel({ messages, isTyping, onSend }: ChatPanelProps) {
  const [value, setValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isTyping]);

  function submit(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    const command = value.trim();
    if (!command) return;
    onSend(command);
    setValue("");
  }

  return (
    <section className="hud-panel flex min-h-0 flex-1 flex-col p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.34em] text-cyan-200/70">
            Conversation
          </p>
          <h2 className="text-xl font-bold text-white">AI command channel</h2>
        </div>
        <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs text-emerald-100">
          Live
        </span>
      </div>

      <div
        ref={scrollRef}
        className="min-h-[320px] flex-1 space-y-3 overflow-y-auto rounded-3xl border border-white/10 bg-black/25 p-4"
      >
        <AnimatePresence initial={false}>
          {messages.map((message) => {
            const isSid = message.role === "sid";

            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8 }}
                className={`flex ${isSid ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[88%] rounded-3xl px-4 py-3 text-sm leading-6 shadow-lg ${
                    isSid
                      ? "rounded-br-md bg-cyan-300 text-slate-950"
                      : "rounded-bl-md border border-cyan-200/15 bg-cyan-950/40 text-cyan-50"
                  }`}
                >
                  <p className="mb-1 text-[10px] uppercase tracking-[0.24em] opacity-70">
                    {isSid ? "Sid" : "Jarvis"}
                  </p>
                  {message.text}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-cyan-200/15 bg-cyan-950/40 px-4 py-2 text-xs text-cyan-100"
          >
            <span className="typing-dot" />
            <span className="typing-dot delay-100" />
            <span className="typing-dot delay-200" />
            Thinking...
          </motion.div>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {promptSuggestions.map((prompt) => (
          <button
            key={prompt}
            onClick={() => onSend(prompt)}
            className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-slate-300 transition hover:border-cyan-200/50 hover:text-cyan-100"
          >
            {prompt}
          </button>
        ))}
      </div>

      <form onSubmit={submit} className="mt-3 flex items-center gap-2 rounded-3xl border border-cyan-200/20 bg-black/35 p-2">
        <input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Type a command, Sid..."
          className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm text-white outline-none placeholder:text-slate-500"
        />
        <button
          type="submit"
          className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-300 text-slate-950 shadow-[0_0_24px_rgba(103,232,249,0.45)] transition hover:scale-105"
          aria-label="Send message"
        >
          <SendHorizonal size={20} />
        </button>
      </form>
    </section>
  );
}
