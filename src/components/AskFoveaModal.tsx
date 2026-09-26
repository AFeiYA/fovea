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

  const handleAsk = (queryText: string) => {
    if (!queryText.trim()) return;

    const userMsg = queryText.trim();
    setConversation((prev) => [...prev, { role: "user", content: userMsg }]);
    setQuestion("");
    setIsThinking(true);

    // Generate Fovea's calm, evidence-first analytical response
    setTimeout(() => {
      let answer = "";
      const lower = userMsg.toLowerCase();

      if (lower.includes("si") || lower.includes("超智能") || lower.includes("benchmark") || lower.includes("刷榜")) {
        answer = isZh
          ? `常规的 AI 刷榜依赖过拟合特定测试集，而此项突破之所以被我标记为 SI 级异动，是因为它改变了计算发生的时间拓扑与自主验证机制。它不再是统计记忆的机械输出，而是模型在未见空间中展开的真正自省与推演。`
          : `Conventional AI benchmarks rely on overfitting static distributions. I isolated this specifically as an SI-grade signal because it fundamentally shifts the temporal topology of computation—moving from memory recall to autonomous search and verification in unseen problem spaces.`;
      } else if (lower.includes("bottleneck") || lower.includes("瓶颈") || lower.includes("热力学") || lower.includes("thermodynamic") || lower.includes("算力")) {
        answer = isZh
          ? `最底层的硬约束从来不是软件代码，而是微秒级晶圆通信延迟与吉瓦级持续供电。当单模型吞吐跨过阈值，必须用专属核能或片上光互联来抵消热力学损耗，这是纯算法工程师无法通过调参解决的物理墙。`
          : `The binding constraint is never the algorithm; it is microsecond interconnect latency and gigawatt continuous baseload power. As model clusters scale, overcoming thermodynamic dissipation requires physical infrastructure that cannot be bypassed via prompt tuning.`;
      } else {
        answer = isZh
          ? `从我的观测视界来看，此事件的核心在于：${whyItMatters} 这打破了既有范式，促使下一代算力集群向更具自律性的演化路径靠拢。`
          : `From my observational vantage point, the core inflection is clear: ${whyItMatters} This redirects the trajectory of synthetic intelligence toward verified self-governance.`;
      }

      setConversation((prev) => [...prev, { role: "fovea", content: answer }]);
      setIsThinking(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl rounded-xl border border-[var(--border-strong)] bg-[var(--bg-card)] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[var(--border-card)] flex items-start justify-between bg-[var(--bg-subtle)]">
          <div className="flex items-center space-x-2.5">
            <div className="w-6 h-6 rounded-md bg-zinc-950 border border-amber-500/50 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div>
            </div>
            <div>
              <h3 className="text-sm font-mono font-bold text-[var(--text-main)] flex items-center space-x-2">
                <span>{t("askFoveaTitle")}</span>
              </h3>
              <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                {t("askFoveaSubtitle")}
              </p>
            </div>
          </div>

          <button
            onClick={closeAskFovea}
            className="p-1 rounded-md text-[var(--text-dim)] hover:text-[var(--text-main)] hover:bg-[var(--border-card)] transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Selected Signal Reference */}
        <div className="px-5 py-3 border-b border-[var(--border-card)] bg-[var(--bg-card)] text-xs">
          <span className="font-mono text-[10px] text-amber-500 uppercase tracking-wider block mb-1">
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
            <div className="w-6 h-6 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center flex-shrink-0 text-amber-500 font-mono text-[10px] font-bold">
              F
            </div>
            <div className="flex-1 p-3.5 rounded-xl border border-[var(--border-card)] bg-[var(--bg-subtle)] leading-relaxed text-[var(--text-main)] font-mono text-xs">
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
                className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 font-mono text-[10px] font-bold ${
                  msg.role === "user"
                    ? "bg-[var(--text-main)] text-[var(--bg-page)]"
                    : "bg-zinc-900 border border-zinc-700 text-amber-500"
                }`}
              >
                {msg.role === "user" ? "U" : "F"}
              </div>
              <div
                className={`flex-1 p-3.5 rounded-xl text-xs sm:text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-[var(--text-main)] text-[var(--bg-page)] font-medium"
                    : "border border-[var(--border-card)] bg-[var(--bg-subtle)] text-[var(--text-main)] font-mono text-xs"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {isThinking && (
            <div className="flex items-center space-x-2 text-xs font-mono text-amber-500 animate-pulse pl-9">
              <Terminal size={13} />
              <span>{isZh ? "Fovea 正在推演底层逻辑..." : "Fovea is deliberating..."}</span>
            </div>
          )}
        </div>

        {/* Quick Prompts */}
        <div className="px-5 py-2.5 border-t border-[var(--border-card)] bg-[var(--bg-card)] flex flex-wrap gap-1.5">
          <button
            onClick={() => handleAsk(t("askFoveaQuick1"))}
            className="text-[11px] font-mono px-2.5 py-1 rounded-full border border-[var(--border-card)] bg-[var(--bg-subtle)] text-[var(--text-muted)] hover:text-amber-500 hover:border-amber-500/40 transition-colors text-left"
          >
            {t("askFoveaQuick1")}
          </button>
          <button
            onClick={() => handleAsk(t("askFoveaQuick2"))}
            className="text-[11px] font-mono px-2.5 py-1 rounded-full border border-[var(--border-card)] bg-[var(--bg-subtle)] text-[var(--text-muted)] hover:text-amber-500 hover:border-amber-500/40 transition-colors text-left"
          >
            {t("askFoveaQuick2")}
          </button>
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-[var(--border-card)] bg-[var(--bg-subtle)]">
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
              className="flex-1 px-3.5 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border-card)] text-xs sm:text-sm text-[var(--text-main)] placeholder-[var(--text-dim)] focus:outline-none focus:border-amber-500 font-mono transition-colors"
            />
            <button
              type="submit"
              disabled={isThinking || !question.trim()}
              className="flex items-center space-x-1 px-4 py-2 rounded-lg bg-[var(--text-main)] text-[var(--bg-page)] hover:opacity-90 font-medium text-xs font-mono disabled:opacity-50 transition-all cursor-pointer shadow-xs"
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
