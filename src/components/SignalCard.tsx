"use client";

import React, { useState } from "react";
import { SignalItem } from "@/types/signal";
import { ExternalLink, Check, Share2, Compass } from "lucide-react";

interface SignalCardProps {
  item: SignalItem;
  onTagClick?: (tag: string) => void;
}

export const SignalCard: React.FC<SignalCardProps> = ({ item, onTagClick }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      const url = `${window.location.origin}#${item.id}`;
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <article
      id={item.id}
      className={`group relative rounded-xl border p-5 sm:p-6 transition-all duration-200 ${
        item.isSignal
          ? "border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 hover:bg-zinc-900/60 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.5)]"
          : "border-zinc-850 bg-zinc-950 hover:border-zinc-800 hover:bg-zinc-900/20"
      }`}
    >
      {/* Top Meta Line: Badges, Tags, Source */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {item.isSignal && (
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-red-950/80 border border-red-800/60 text-red-300 font-mono text-[11px] font-semibold tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
              <span>SIGNAL</span>
            </span>
          )}

          {item.tags.map((tag) => (
            <button
              key={tag}
              onClick={() => onTagClick && onTagClick(tag)}
              className="px-2 py-0.5 rounded bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-400 hover:text-zinc-200 font-mono text-[10px] tracking-wider transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2 text-zinc-500 font-mono text-[11px]">
          <a
            href={item.source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 text-zinc-400 hover:text-amber-400 transition-colors"
            title={`Source: ${item.source.name}`}
          >
            <span>{item.source.domain}</span>
            <ExternalLink size={11} className="opacity-70" />
          </a>

          <span className="text-zinc-700">·</span>

          <button
            onClick={handleCopyLink}
            className="text-zinc-500 hover:text-zinc-300 transition-colors p-1"
            title="Copy permalink"
          >
            {copied ? <Check size={12} className="text-emerald-400" /> : <Share2 size={12} />}
          </button>
        </div>
      </div>

      {/* Main Headline */}
      <h2 className="text-base sm:text-lg font-semibold text-zinc-100 group-hover:text-amber-100 transition-colors leading-snug tracking-tight">
        <a
          href={item.source.url}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline decoration-zinc-600 underline-offset-4"
        >
          {item.title}
        </a>
      </h2>

      {/* Concise 1-sentence summary */}
      <p className="mt-2 text-sm text-zinc-400 leading-relaxed font-sans">
        {item.summary}
      </p>

      {/* "Why it matters" Block - The Heart of FOVEA */}
      <div className="mt-4 pt-3.5 border-t border-zinc-800/80">
        <div className="flex items-center space-x-1.5 text-xs font-mono font-semibold tracking-wider text-amber-500/90 mb-1.5 uppercase">
          <Compass size={13} className="text-amber-500" />
          <span>Why it matters for SI</span>
        </div>
        <p className="text-xs sm:text-sm text-zinc-300/90 leading-relaxed bg-zinc-900/60 rounded-lg p-3 border-l-2 border-amber-500/80 border-r border-t border-b border-zinc-800/40 font-sans">
          {item.whyItMatters}
        </p>
      </div>
    </article>
  );
};
