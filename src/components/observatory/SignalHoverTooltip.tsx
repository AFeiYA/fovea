"use client";

import React from "react";
import { SignalItem } from "@/types/signal";
import { useApp } from "@/context/AppContext";
import { Sparkles, ArrowRight, Flame } from "lucide-react";

interface SignalHoverTooltipProps {
  signal: SignalItem | null;
  pos: { x: number; y: number };
  onClick: (item: SignalItem) => void;
}

export const SignalHoverTooltip: React.FC<SignalHoverTooltipProps> = ({
  signal,
  pos,
  onClick,
}) => {
  const { language } = useApp();
  if (!signal) return null;

  const isZh = language === "zh";
  const title = isZh ? signal.titleZh || signal.title : signal.title;
  const isLandmark = signal.isSignal;

  // Clamp tooltip position within screen boundary
  const tooltipWidth = 320;
  const left = Math.min(Math.max(pos.x - tooltipWidth / 2, 20), window.innerWidth - tooltipWidth - 20);
  const top = pos.y > 220 ? pos.y - 140 : pos.y + 35;

  return (
    <div
      style={{ left: `${left}px`, top: `${top}px` }}
      onClick={() => onClick(signal)}
      className="pointer-events-auto absolute z-40 w-[320px] rounded-xl border border-amber-500/40 bg-zinc-950/85 backdrop-blur-md p-3.5 shadow-[0_0_30px_rgba(245,158,11,0.25)] transition-all duration-150 cursor-pointer hover:border-amber-400 group animate-in fade-in zoom-in-95"
    >
      {/* Top Meta Line */}
      <div className="flex items-center justify-between gap-2 mb-2 text-[10px] font-mono">
        <div className="flex items-center space-x-1.5">
          {isLandmark ? (
            <span className="flex items-center space-x-1 px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/40 font-semibold">
              <Flame size={10} className="text-red-400" />
              <span>PARADIGM</span>
            </span>
          ) : (
            <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
              SIGNAL
            </span>
          )}
          <span className="text-amber-400 font-semibold">{signal.tags[0]}</span>
        </div>

        <span className="text-zinc-500">{signal.source.name}</span>
      </div>

      {/* Title */}
      <h3 className="text-xs font-semibold text-zinc-100 group-hover:text-amber-300 transition-colors line-clamp-2 leading-relaxed mb-2">
        {title}
      </h3>

      {/* Action Prompt */}
      <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80 text-[10px] font-mono text-zinc-400 group-hover:text-amber-400 transition-colors">
        <span className="flex items-center space-x-1">
          <Sparkles size={11} className="text-amber-500" />
          <span>{isZh ? "点击穿透进入公报" : "Click to Inspect"}</span>
        </span>
        <ArrowRight size={11} className="transform group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
};
