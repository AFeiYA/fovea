"use client";

import React from "react";
import { SignalItem } from "@/types/signal";
import { ExternalLink, Sparkles, ArrowRight } from "lucide-react";

interface WeeklyViewProps {
  signals: SignalItem[];
}

export const WeeklyView: React.FC<WeeklyViewProps> = ({ signals }) => {
  const weeklyPicks = signals.filter((s) => s.weeklyPick);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Weekly Executive Summary */}
      <div className="rounded-xl border border-zinc-800 bg-gradient-to-b from-zinc-900/80 to-zinc-950 p-6">
        <div className="flex items-center space-x-2 text-amber-500 font-mono text-xs uppercase tracking-wider mb-2">
          <Sparkles size={14} />
          <span>Week 39 Edition · Curated Synthesis</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-zinc-100 tracking-tight">
          The Collision of Autonomous Reasoning & Sovereign Power
        </h2>
        <p className="mt-3 text-sm text-zinc-300 leading-relaxed">
          The past seven days proved that the term &ldquo;AI&rdquo; has officially been outgrown. While frontier labs demonstrated that test-time compute unlocks genuine self-correcting mathematical reasoning, the primary bottleneck has shifted irrevocably to the physical world: nuclear power plants recommissioned for clusters, and national leadership framing computation as sovereign state survival.
        </p>

        <div className="mt-4 pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400 font-mono">
          <span>{weeklyPicks.length} critical inflection points this week</span>
          <span className="text-zinc-500">Curated by Fovea Editorial</span>
        </div>
      </div>

      {/* Numbered Digest List */}
      <div className="space-y-4">
        <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-500 px-1">
          Essential Weekly Pivots
        </h3>

        {weeklyPicks.map((item, idx) => (
          <div
            key={item.id}
            className="flex items-start space-x-4 p-4 rounded-lg border border-zinc-850 bg-zinc-950/60 hover:border-zinc-800 transition-colors"
          >
            <span className="text-lg font-mono font-bold text-zinc-600 select-none pt-0.5">
              0{idx + 1}
            </span>

            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                {item.isSignal && (
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-red-950/80 text-red-400 border border-red-900/60">
                    SIGNAL
                  </span>
                )}
                <span className="text-[11px] font-mono text-zinc-500">
                  {item.source.name}
                </span>
              </div>

              <h4 className="text-sm sm:text-base font-semibold text-zinc-100 hover:text-amber-200 transition-colors">
                <a
                  href={item.source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1.5"
                >
                  <span>{item.title}</span>
                  <ExternalLink size={12} className="opacity-60 flex-shrink-0" />
                </a>
              </h4>

              <p className="mt-1 text-xs text-zinc-400 line-clamp-2">
                {item.summary}
              </p>

              <div className="mt-2 text-xs text-amber-500/90 font-mono bg-zinc-900/40 p-2 rounded border-l border-amber-500/60">
                <span className="font-semibold text-amber-400">SI Pivot: </span>
                {item.whyItMatters}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
