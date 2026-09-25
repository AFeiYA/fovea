"use client";

import React, { useState } from "react";
import { SignalItem } from "@/types/signal";
import { ExternalLink, Check, Share2, Compass } from "lucide-react";
import { useApp } from "@/context/AppContext";

interface SignalCardProps {
  item: SignalItem;
  onTagClick?: (tag: string) => void;
}

export const SignalCard: React.FC<SignalCardProps> = ({ item, onTagClick }) => {
  const [copied, setCopied] = useState(false);
  const { language, t } = useApp();

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
      className={`group relative rounded-xl border p-5 sm:p-6 transition-all duration-200 fovea-card shadow-xs ${
        item.isSignal ? "ring-1 ring-red-500/20" : ""
      }`}
    >
      {/* Top Meta Line: Badges, Tags, Source */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {item.isSignal && (
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-300 font-mono text-[11px] font-semibold tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
              <span>{t("signalBadge")}</span>
            </span>
          )}

          {item.tags.map((tag) => (
            <button
              key={tag}
              onClick={() => onTagClick && onTagClick(tag)}
              className="px-2 py-0.5 rounded bg-[var(--bg-subtle)] hover:bg-[var(--border-card)] text-[var(--text-muted)] hover:text-[var(--text-main)] font-mono text-[10px] tracking-wider transition-colors border border-[var(--border-subtle)]"
            >
              {t(`tag_${tag}`)}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2 text-[var(--text-dim)] font-mono text-[11px]">
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

          <span className="text-[var(--border-strong)]">·</span>

          <button
            onClick={handleCopyLink}
            className="text-[var(--text-dim)] hover:text-[var(--text-main)] transition-colors p-1"
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
          className="hover:underline decoration-[var(--border-strong)] underline-offset-4"
        >
          {title}
        </a>
      </h2>

      {/* Concise 1-sentence summary */}
      <p className="mt-2 text-sm text-[var(--text-muted)] leading-relaxed font-sans">
        {summary}
      </p>

      {/* "Why it matters" Block - The Heart of FOVEA */}
      <div className="mt-4 pt-3.5 border-t border-[var(--border-card)]">
        <div className="flex items-center space-x-1.5 text-xs font-mono font-semibold tracking-wider text-amber-600 dark:text-amber-400 mb-1.5 uppercase">
          <Compass size={13} />
          <span>{t("whyItMatters")}</span>
        </div>
        <p className="text-xs sm:text-sm leading-relaxed fovea-why-box rounded-lg p-3 border-l-3 border font-sans">
          {whyItMatters}
        </p>
      </div>
    </article>
  );
};
