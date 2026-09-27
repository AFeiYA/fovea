"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Eye, X, Send, Sparkles, Terminal } from "lucide-react";

export const AskFoveaModal: React.FC = () => {
  const { activeChatSignal, closeAskFovea, language, t } = useApp();
  const [question, setQuestion] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [conversation, setConversation] = useState<
    Array<{ role: "user" | "fovea"; content: string }>
  >([]);

  if (!activeChatSignal) return null;

  const isZh = language === "zh";
  const title = isZh
    ? activeChatSignal.titleZh || activeChatSignal.title
    : activeChatSignal.title;
  const whyItMatters = isZh
    ? activeChatSignal.whyItMattersZh || activeChatSignal.whyItMatters
    : activeChatSignal.whyItMatters;

  const handleAsk = async (queryText: string) => {
    if (!queryText.trim()) return;

    const userMsg = queryText.trim();
    setConversation((prev) => [...prev, { role: "user", content: userMsg }]);
    setQuestion("");
    setIsThinking(true);

    try {
      const res = await fetch("/api/ask-fovea", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: userMsg,
          signalTitle: title,
          whyItMatters,
          language,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setConversation((prev) => [
          ...prev,
          { role: "fovea", content: data.answer },
        ]);
      } else {
        throw new Error("Failed response");
      }
    } catch (err) {
      // Fallback response
      const answer = isZh
        ? `从我的观测视界来看，此事件的核心在于：${whyItMatters} 这打破了既有范式，促使下一代算力集群向更具自律性的演化路径靠拢。`
        : `From my observational vantage point, the core inflection is clear: ${whyItMatters} This redirects the trajectory of synthetic intelligence toward verified self-governance.`;
      setConversation((prev) => [...prev, { role: "fovea", content: answer }]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-xl rounded-3xl borderless-glass ring-1 ring-white/[0.08] shadow-[0_24px_80px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[85vh] bg-[#050507]/95">
        {/* Header */}
        <div className="p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-white/[0.04] ring-1 ring-white/[0.08] shadow-[0_0_12px_rgba(245,158,11,0.3)] flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
            </div>
            <div>
              <h3 className="text-sm font-mono font-bold text-[var(--text-main)] flex items-center space-x-2">
                <span>{t("askFoveaTitle")}</span>
              </h3>
              <p className="text-[11px] text-[var(--text-muted)] mt-0.5 font-light">
                {t("askFoveaSubtitle")}
              </p>
            </div>
          </div>

          <button
            onClick={closeAskFovea}
            className="p-2 rounded-full borderless-pill ring-1 ring-white/[0.06] text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>
        <div className="gradient-divider opacity-40"></div>

        {/* Selected Signal Reference - Borderless Glass Pill */}
        <div className="mx-5 my-3 p-3.5 rounded-2xl bg-amber-500/[0.035] ring-1 ring-amber-500/20 text-xs">
          <span className="font-mono text-[10px] text-amber-400 uppercase tracking-wider block mb-1">
            {isZh ? "当前聚焦标的：" : "Active Focus Subject:"}
          </span>
          <p className="font-medium text-[var(--text-main)] line-clamp-2">
            {title}
          </p>
        </div>

        {/* Chat Stream Area */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 font-sans text-xs sm:text-sm">
          {/* Initial Greeting from Fovea */}
          <div className="flex items-start space-x-3">
            <div className="w-7 h-7 rounded-full bg-amber-500/10 ring-1 ring-amber-500/30 flex items-center justify-center flex-shrink-0 text-amber-400 font-mono text-[11px] font-bold">
              F
            </div>
            <div className="flex-1 p-4 rounded-2xl borderless-glass ring-1 ring-white/[0.04] leading-relaxed text-[var(--text-main)] font-mono text-xs">
              {isZh
                ? "我是 Fovea。我追踪的是超越传统 AI 范畴的硬核质变。关于此项突破，你想探寻哪一维度的底层逻辑？"
                : "I am Fovea. I monitor structural inflections beyond the scope of traditional AI tools. What dimension of this development do you wish to dissect?"}
            </div>
          </div>

          {/* Conversation history */}
          {conversation.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start space-x-3 ${
                msg.role === "user" ? "flex-row-reverse space-x-reverse" : ""
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 font-mono text-[11px] font-bold ${
                  msg.role === "user"
                    ? "bg-white/[0.08] text-white ring-1 ring-white/[0.1]"
                    : "bg-amber-500/10 ring-1 ring-amber-500/30 text-amber-400"
                }`}
              >
                {msg.role === "user" ? "U" : "F"}
              </div>
              <div
                className={`flex-1 p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-amber-500 text-zinc-950 font-medium shadow-[0_0_20px_rgba(245,158,11,0.2)]"
                    : "borderless-glass ring-1 ring-white/[0.04] text-[var(--text-main)] font-mono text-xs"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {isThinking && (
            <div className="flex items-center space-x-2 text-xs font-mono text-amber-400 animate-pulse pl-10">
              <Terminal size={13} />
              <span>{isZh ? "Fovea 正在推演底层逻辑..." : "Fovea is deliberating..."}</span>
            </div>
          )}
        </div>

        {/* Quick Prompts */}
        <div className="px-5 py-2.5 flex flex-wrap gap-2">
          <button
            onClick={() => handleAsk(t("askFoveaQuick1"))}
            className="text-[11px] font-mono px-3 py-1 rounded-full borderless-pill ring-1 ring-white/[0.06] hover:ring-amber-500/40 text-[var(--text-muted)] hover:text-amber-300 transition-all text-left cursor-pointer"
          >
            {t("askFoveaQuick1")}
          </button>
          <button
            onClick={() => handleAsk(t("askFoveaQuick2"))}
            className="text-[11px] font-mono px-3 py-1 rounded-full borderless-pill ring-1 ring-white/[0.06] hover:ring-amber-500/40 text-[var(--text-muted)] hover:text-amber-300 transition-all text-left cursor-pointer"
          >
            {t("askFoveaQuick2")}
          </button>
        </div>
        <div className="gradient-divider opacity-40"></div>

        {/* Input Bar */}
        <div className="p-4 bg-transparent">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAsk(question);
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={t("askFoveaPlaceholder")}
              className="flex-1 px-4 py-2.5 rounded-full borderless-pill ring-1 ring-white/[0.06] focus:ring-amber-500/40 text-xs sm:text-sm text-[var(--text-main)] placeholder-[var(--text-dim)] font-mono transition-all outline-none"
            />
            <button
              type="submit"
              disabled={isThinking || !question.trim()}
              className="flex items-center space-x-1.5 px-4.5 py-2.5 rounded-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold text-xs font-mono disabled:opacity-50 transition-all cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.25)] active:scale-95"
            >
              <span>{t("askFoveaSend")}</span>
              <Send size={12} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
