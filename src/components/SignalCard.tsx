"use client";

import React, { useState } from "react";
import { SignalItem } from "@/types/signal";
import { ExternalLink, Check, Share2, Compass, MessageSquareQuote, Eye } from "lucide-react";
import { useApp } from "@/context/AppContext";

interface SignalCardProps {
  item: SignalItem;
  onTagClick?: (tag: string) => void;
  onSelectSignal?: (item: SignalItem) => void;
}

export const SignalCard: React.FC<SignalCardProps> = ({ item, onTagClick, onSelectSignal }) => {
  const [copied, setCopied] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [spotlight, setSpotlight] = useState({ x: 0, y: 0, opacity: 0 });
  const { language, t, openAskFovea } = useApp();

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -3;
    const rotateY = ((x - centerX) / centerX) * 3;

    setTilt({ x: rotateX, y: rotateY });
    setSpotlight({ x, y, opacity: 0.14 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setSpotlight((prev) => ({ ...prev, opacity: 0 }));
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      const url = `${window.location.origin}#${item.id}`;
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const title = language === "zh" ? item.titleZh || item.title : item.title;
  const summary = language === "zh" ? item.summaryZh || item.summary : item.summary;
  const whyItMatters =
    language === "zh"
      ? item.whyItMattersZh || item.whyItMatters
      : item.whyItMatters;

  return (
    <article
      id={item.id}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: "transform 0.14s ease-out, background-color 0.25s ease, box-shadow 0.25s ease",
      }}
      className={`group relative rounded-2xl p-6 sm:p-7 fovea-card shadow-sm overflow-hidden bg-white/[0.025] hover:bg-white/[0.05] backdrop-blur-xl ring-1 ring-white/[0.03] hover:ring-amber-500/30 ${
        item.isSignal ? "ring-red-500/25 bg-red-500/[0.015]" : ""
      }`}
    >
      {/* Dynamic Cursor Spotlight Layer */}
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"
        style={{
          background: `radial-gradient(350px circle at ${spotlight.x}px ${spotlight.y}px, rgba(245, 158, 11, ${spotlight.opacity}), transparent 80%)`,
        }}
      />
      {/* Top Meta Line: Badges, Tags, Source */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {item.isSignal && (
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-500 dark:text-red-400 font-mono text-[11px] font-semibold tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
              <span>{t("signalBadge")}</span>
            </span>
          )}

          {item.tags.map((tag) => (
            <button
              key={tag}
              onClick={() => onTagClick && onTagClick(tag)}
              className="px-2.5 py-0.5 rounded-full bg-white/[0.04] hover:bg-white/[0.09] text-[var(--text-muted)] hover:text-white font-mono text-[10px] tracking-wider transition-colors cursor-pointer"
            >
              {t(`tag_${tag}`)}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2 text-[var(--text-dim)] font-mono text-[11px]">
          {onSelectSignal && (
            <>
              <button
                onClick={() => onSelectSignal(item)}
                className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-white/[0.04] hover:bg-white/[0.09] text-zinc-300 hover:text-amber-400 font-mono text-[10px] font-medium transition-colors cursor-pointer"
                title={language === "zh" ? "展开瑞士排版专报" : "Open full Swiss editorial dispatch"}
              >
                <Compass size={11} className="text-amber-500" />
                <span>{language === "zh" ? "阅读专报" : "Dispatch"}</span>
              </button>
              <span className="opacity-40">·</span>
            </>
          )}

          <a
            href={item.source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 text-[var(--text-muted)] hover:text-amber-500 transition-colors"
            title={`Source: ${item.source.name}`}
          >
            <span>{item.source.domain}</span>
            <ExternalLink size={11} className="opacity-70" />
          </a>

          <span className="opacity-40">·</span>

          {/* Ask Fovea Quick Trigger */}
          <button
            onClick={() => openAskFovea(item)}
            className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 hover:text-amber-400 font-mono text-[10px] font-medium transition-colors shadow-2xs cursor-pointer"
            title="Ask Fovea directly about this signal"
          >
            <MessageSquareQuote size={11} />
            <span>{t("askFovea")}</span>
          </button>

          <span className="opacity-40">·</span>

          <button
            onClick={handleCopyLink}
            className="text-[var(--text-dim)] hover:text-[var(--text-main)] transition-colors p-1 cursor-pointer"
            title={copied ? t("copiedLink") : "Copy link"}
          >
            {copied ? <Check size={12} className="text-emerald-500" /> : <Share2 size={12} />}
          </button>
        </div>
      </div>

      {/* Main Headline */}
      <h2 className="text-base sm:text-lg font-semibold text-[var(--text-main)] group-hover:text-amber-600 dark:group-hover:text-amber-200 transition-colors leading-snug tracking-tight">
        <a
          href={item.source.url}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline decoration-zinc-700 underline-offset-4"
        >
          {title}
        </a>
      </h2>

      {/* Concise 1-sentence summary */}
      <p className="mt-2 text-sm text-[var(--text-muted)] leading-relaxed font-sans font-light">
        {summary}
      </p>

      {/* "FOVEA'S VIEW" Persona Callout Block */}
      <div className="mt-4 pt-3.5 border-t border-white/[0.04]">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center space-x-1.5 text-xs font-mono font-bold tracking-wider text-amber-600 dark:text-amber-400 uppercase">
            <Eye size={13} className="text-amber-500" />
            <span>{t("foveasView")}</span>
          </div>

          <button
            onClick={() => openAskFovea(item)}
            className="text-[11px] font-mono text-[var(--text-dim)] hover:text-amber-500 transition-colors flex items-center space-x-1"
          >
            <span>{t("askFovea")}</span>
            <span>→</span>
          </button>
        </div>

        <p className="text-xs sm:text-sm leading-relaxed rounded-xl p-4 bg-amber-500/[0.03] text-zinc-200 border-l-2 border-amber-500/60 font-sans shadow-inner">
          {whyItMatters}
        </p>
      </div>
    </article>
  );
};
