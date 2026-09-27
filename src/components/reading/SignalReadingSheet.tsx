"use client";

import React, { useEffect } from "react";
import { SignalItem } from "@/types/signal";
import { useApp } from "@/context/AppContext";
import { ArrowLeft, ExternalLink, MessageSquareQuote, ChevronLeft, ChevronRight, Share2, Check, Flame } from "lucide-react";

interface SignalReadingSheetProps {
  signal: SignalItem;
  allSignals: SignalItem[];
  onClose: () => void;
  onNavigate: (item: SignalItem) => void;
}

export const SignalReadingSheet: React.FC<SignalReadingSheetProps> = ({
  signal,
  allSignals,
  onClose,
  onNavigate,
}) => {
  const { language, openAskFovea } = useApp();
  const [copied, setCopied] = React.useState(false);

  const isZh = language === "zh";
  const title = isZh ? signal.titleZh || signal.title : signal.title;
  const secondaryTitle = isZh ? signal.title : signal.titleZh;
  const summary = isZh ? signal.summaryZh || signal.summary : signal.summary;
  const whyItMatters = isZh ? signal.whyItMattersZh || signal.whyItMatters : signal.whyItMatters;

  // Find index for Previous / Next
  const currentIndex = allSignals.findIndex((s) => s.id === signal.id);
  const prevSignal = currentIndex > 0 ? allSignals[currentIndex - 1] : null;
  const nextSignal = currentIndex < allSignals.length - 1 ? allSignals[currentIndex + 1] : null;

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft" || e.key === "j" || e.key === "J") {
        if (prevSignal) onNavigate(prevSignal);
      } else if (e.key === "ArrowRight" || e.key === "k" || e.key === "K") {
        if (nextSignal) onNavigate(nextSignal);
      } else if (e.key === "a" || e.key === "A") {
        openAskFovea(signal);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, onNavigate, prevSignal, nextSignal, openAskFovea, signal]);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(`${window.location.origin}#${signal.id}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const [scrollProgress, setScrollProgress] = React.useState(0);
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const total = el.scrollHeight - el.clientHeight;
    if (total > 0) {
      setScrollProgress((el.scrollTop / total) * 100);
    }
  };

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="fixed inset-0 z-50 overflow-y-auto bg-[#050507] text-zinc-100 selection:bg-amber-500/20 selection:text-amber-400 animate-reading-sheet"
    >
      {/* Top Reading Progress Bar */}
      <div className="sticky top-0 z-50 h-[2px] w-full bg-white/[0.03]">
        <div
          className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-200 shadow-[0_0_8px_rgba(245,158,11,0.8)] transition-all duration-75"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Top Floating Glass Navigation Bar */}
      <nav className="sticky top-[2px] z-50 bg-[#050507]/80 backdrop-blur-2xl px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <button
          onClick={onClose}
          className="flex items-center space-x-2 text-xs font-mono text-zinc-400 hover:text-amber-400 transition-all borderless-pill ring-1 ring-white/[0.06] hover:ring-amber-500/30 px-3 py-1.5 cursor-pointer group"
        >
          <ArrowLeft size={13} className="transform group-hover:-translate-x-1 transition-transform text-amber-500" />
          <span>{isZh ? "返回观测镜 [ESC]" : "OBSERVATORY [ESC]"}</span>
        </button>

        <div className="flex items-center space-x-3 text-xs font-mono text-zinc-500">
          <span className="hidden sm:inline">
            ARCHIVE // {signal.id.slice(0, 14).toUpperCase()}
          </span>
          <span className="opacity-40">·</span>
          <span className="text-amber-400 font-semibold">{signal.tags.join(" / ")}</span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => openAskFovea(signal)}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 ring-1 ring-amber-500/35 text-xs font-mono transition-all shadow-xs cursor-pointer active:scale-95"
            title="Ask Fovea [A]"
          >
            <MessageSquareQuote size={13} />
            <span className="hidden sm:inline">{isZh ? "深度问答 [A]" : "Ask Fovea [A]"}</span>
          </button>

          <button
            onClick={handleCopyLink}
            className="p-2 rounded-full borderless-pill ring-1 ring-white/[0.06] hover:ring-white/[0.15] text-zinc-400 hover:text-white transition-all cursor-pointer"
            title={copied ? "Copied" : "Copy link"}
          >
            {copied ? <Check size={13} className="text-emerald-400" /> : <Share2 size={13} />}
          </button>
        </div>
      </nav>
      {/* Soft gradient divider below nav */}
      <div className="gradient-divider opacity-50"></div>

      {/* Main Swiss Editorial Container */}
      <main className="max-w-3xl mx-auto px-5 sm:px-8 py-10 sm:py-16 space-y-10">
        {/* Meta Header */}
        <header className="space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-zinc-400">
            {signal.isSignal && (
              <span className="flex items-center space-x-1 px-3 py-0.5 rounded-full bg-red-500/15 text-red-300 ring-1 ring-red-500/30 text-[11px] font-semibold">
                <Flame size={12} className="text-red-400" />
                <span>LANDMARK PARADIGM SHIFT</span>
              </span>
            )}
            <span className="px-3 py-0.5 rounded-full bg-white/[0.04] ring-1 ring-white/[0.06] text-zinc-300">
              {signal.dateLabel} · {new Date(signal.timestamp).toLocaleDateString()}
            </span>
            <span className="text-zinc-600">·</span>
            <span className="text-zinc-400">{signal.source.name}</span>
          </div>

          {/* Primary Big Title */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-white leading-snug">
            {title}
          </h1>

          {/* Subtitle / Alternate Language Title */}
          {secondaryTitle && (
            <p className="text-sm sm:text-base text-zinc-400 font-sans leading-relaxed">
              {secondaryTitle}
            </p>
          )}

          <div className="gradient-divider opacity-40 pt-2"></div>
        </header>

        {/* Section 01: What Happened (Factual Summary) */}
        <section className="space-y-2.5">
          <div className="text-[11px] font-mono tracking-widest text-zinc-500 uppercase font-semibold">
            [01 // {isZh ? "核心事实综述" : "WHAT HAPPENED"}]
          </div>
          <p className="text-base sm:text-lg text-zinc-200 leading-relaxed font-sans font-light">
            {summary}
          </p>
        </section>

        {/* Section 02: Why It Matters (Structural Impact) - Borderless Glass Box */}
        <section className="space-y-2.5">
          <div className="text-[11px] font-mono tracking-widest text-amber-400 uppercase font-semibold">
            [02 // {isZh ? "对超智能的结构性意义" : "WHY IT MATTERS TO SUPERINTELLIGENCE"}]
          </div>
          <div className="rounded-2xl ring-1 ring-amber-500/25 bg-amber-500/[0.035] p-5 sm:p-6 text-sm sm:text-base text-zinc-100 leading-relaxed font-sans backdrop-blur-xl shadow-[0_8px_32px_rgba(245,158,11,0.08)]">
            {whyItMatters}
          </div>
        </section>

        {/* Section 03: Source Citation */}
        <section className="space-y-3 pt-4">
          <div className="gradient-divider opacity-40 mb-4"></div>
          <div className="flex items-center justify-between text-xs font-mono text-zinc-500">
            <span>[03 // {isZh ? "文献溯源" : "SOURCE & CITATION"}]</span>
            <span>DOM: {signal.source.domain}</span>
          </div>

          <a
            href={signal.source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-white/[0.025] hover:bg-white/[0.05] ring-1 ring-white/[0.05] hover:ring-amber-500/30 backdrop-blur-xl transition-all group"
          >
            <div className="space-y-1">
              <div className="text-xs font-mono text-zinc-300 group-hover:text-amber-300 transition-colors">
                {signal.source.name}
              </div>
              <div className="text-xs text-zinc-500 font-mono truncate max-w-md">
                {signal.source.url}
              </div>
            </div>
            <ExternalLink size={14} className="text-zinc-400 group-hover:text-amber-400 transition-colors" />
          </a>
        </section>

        {/* Bottom Navigation: Previous / Next */}
        <footer className="pt-6">
          <div className="gradient-divider opacity-40 mb-6"></div>
          <div className="flex items-center justify-between text-xs font-mono">
            {prevSignal ? (
              <button
                onClick={() => onNavigate(prevSignal)}
                className="flex items-center space-x-2 text-zinc-400 hover:text-amber-400 transition-all borderless-pill ring-1 ring-white/[0.05] hover:ring-amber-500/30 px-3.5 py-1.5 cursor-pointer"
              >
                <ChevronLeft size={14} />
                <span>{isZh ? "上一条 [J]" : "PREV [J]"}</span>
              </button>
            ) : (
              <span className="text-zinc-600 px-3 py-1.5">{isZh ? "已是最早" : "FIRST SIGNAL"}</span>
            )}

            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-full borderless-pill ring-1 ring-white/[0.06] hover:ring-white/[0.15] text-zinc-300 hover:text-white transition-all cursor-pointer"
            >
              {isZh ? "返回星图" : "OBSERVATORY"}
            </button>

            {nextSignal ? (
              <button
                onClick={() => onNavigate(nextSignal)}
                className="flex items-center space-x-2 text-zinc-400 hover:text-amber-400 transition-all borderless-pill ring-1 ring-white/[0.05] hover:ring-amber-500/30 px-3.5 py-1.5 cursor-pointer"
              >
                <span>{isZh ? "下一条 [K]" : "NEXT [K]"}</span>
                <ChevronRight size={14} />
              </button>
            ) : (
              <span className="text-zinc-600 px-3 py-1.5">{isZh ? "已是最新" : "LATEST SIGNAL"}</span>
            )}
          </div>
        </footer>
      </main>
    </div>
  );
};
