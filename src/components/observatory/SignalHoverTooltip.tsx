"use client";

import React from "react";
import { SignalItem } from "@/types/signal";
import { useApp } from "@/context/AppContext";
import { ArrowRight, Flame } from "lucide-react";
import { playTelemetryTick } from "@/utils/foveaAudio";

interface SignalHoverTooltipProps {
  signal: SignalItem | null;
  pos: { x: number; y: number };
  onClick: (item: SignalItem) => void;
  onHoverChange?: (isHovered: boolean) => void;
}

const SPECTRUM_THEMES: Record<
  string,
  {
    zh: string;
    en: string;
    color: string;
    borderGlow: string;
    accentText: string;
    badgeBg: string;
    dotColor: string;
  }
> = {
  REASONING: {
    zh: "深度推理",
    en: "REASONING",
    color: "#38bdf8",
    borderGlow: "ring-sky-500/40 shadow-[0_0_28px_rgba(56,189,248,0.22)]",
    accentText: "text-sky-300",
    badgeBg: "bg-sky-500/15 ring-sky-500/40 text-sky-300",
    dotColor: "bg-sky-400",
  },
  COMPUTE: {
    zh: "异构算力",
    en: "COMPUTE",
    color: "#f43f5e",
    borderGlow: "ring-rose-500/40 shadow-[0_0_28px_rgba(244,63,94,0.22)]",
    accentText: "text-rose-300",
    badgeBg: "bg-rose-500/15 ring-rose-500/40 text-rose-300",
    dotColor: "bg-rose-400",
  },
  ENERGY: {
    zh: "吉瓦能源",
    en: "ENERGY",
    color: "#10b981",
    borderGlow: "ring-emerald-500/40 shadow-[0_0_28px_rgba(16,185,129,0.22)]",
    accentText: "text-emerald-300",
    badgeBg: "bg-emerald-500/15 ring-emerald-500/40 text-emerald-300",
    dotColor: "bg-emerald-400",
  },
  MODELS: {
    zh: "基座模型",
    en: "MODELS",
    color: "#a855f7",
    borderGlow: "ring-purple-500/40 shadow-[0_0_28px_rgba(168,85,247,0.22)]",
    accentText: "text-purple-300",
    badgeBg: "bg-purple-500/15 ring-purple-500/40 text-purple-300",
    dotColor: "bg-purple-400",
  },
  GOVERNANCE: {
    zh: "主权治理",
    en: "GOVERNANCE",
    color: "#f59e0b",
    borderGlow: "ring-amber-500/40 shadow-[0_0_28px_rgba(245,158,11,0.22)]",
    accentText: "text-amber-300",
    badgeBg: "bg-amber-500/15 ring-amber-500/40 text-amber-300",
    dotColor: "bg-amber-400",
  },
};

export const SignalHoverTooltip: React.FC<SignalHoverTooltipProps> = ({
  signal,
  pos,
  onClick,
  onHoverChange,
}) => {
  const { language } = useApp();
  if (!signal) return null;

  const isZh = language === "zh";
  const title = isZh ? signal.titleZh || signal.title : signal.title;
  const isLandmark = signal.isSignal;

  const primaryTag = signal.tags[0] || "GOVERNANCE";
  const theme = SPECTRUM_THEMES[primaryTag] || SPECTRUM_THEMES.GOVERNANCE;

  // Offset smart positioning: place to the side of the 3D ball so it doesn't occlude the sphere
  const tooltipWidth = 270;
  const isScreenWide = typeof window !== "undefined" ? window.innerWidth > 640 : true;
  const screenW = typeof window !== "undefined" ? window.innerWidth : 1200;
  const screenH = typeof window !== "undefined" ? window.innerHeight : 800;

  let left = pos.x + 22;
  if (left + tooltipWidth > screenW - 20) {
    left = pos.x - tooltipWidth - 22;
  }
  left = Math.max(16, Math.min(left, screenW - tooltipWidth - 16));

  const top = Math.max(70, Math.min(pos.y - 65, screenH - 170));

  return (
    <div
      style={{ left: `${left}px`, top: `${top}px` }}
      onClick={() => {
        playTelemetryTick();
        onClick(signal);
      }}
      onMouseEnter={() => onHoverChange?.(true)}
      onMouseLeave={() => onHoverChange?.(false)}
      className={`pointer-events-auto absolute z-40 w-[270px] rounded-xl borderless-glass ring-1 bg-[#07070b]/90 backdrop-blur-2xl p-3.5 transition-all duration-150 cursor-pointer group animate-in fade-in zoom-in-95 ${theme.borderGlow}`}
    >
      {/* Sci-Fi Holographic Corner Reticle Brackets */}
      <div className="pointer-events-none absolute top-1 left-1 w-2 h-2 border-t border-l border-white/30" />
      <div className="pointer-events-none absolute top-1 right-1 w-2 h-2 border-t border-r border-white/30" />
      <div className="pointer-events-none absolute bottom-1 left-1 w-2 h-2 border-b border-l border-white/30" />
      <div className="pointer-events-none absolute bottom-1 right-1 w-2 h-2 border-b border-r border-white/30" />

      {/* Top Meta Line: Spectrum Dot & Source */}
      <div className="flex items-center justify-between gap-1.5 mb-2 text-[10px] font-mono">
        <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
          {/* Spectrum Beacon Badge */}
          <span
            className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full ring-1 font-semibold text-[9px] ${theme.badgeBg}`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full animate-ping mr-0.5 ${theme.dotColor}`}
            />
            <span>{isZh ? theme.zh : theme.en}</span>
          </span>

          {/* Paradigm Shift Pill */}
          {isLandmark && (
            <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-300 ring-1 ring-red-500/40 text-[9px] font-bold">
              <Flame size={9} className="text-red-400" />
              <span>{isZh ? "范式跃迁" : "PARADIGM"}</span>
            </span>
          )}
        </div>

        <span className="text-zinc-500 text-[10px] truncate max-w-[85px]">
          {signal.source.name}
        </span>
      </div>

      {/* Signal Title */}
      <h3
        className={`text-xs font-semibold text-zinc-100 group-hover:${theme.accentText} transition-colors line-clamp-2 leading-snug mb-2.5 font-sans`}
      >
        {title}
      </h3>

      {/* Sleek Gradient Hairline */}
      <div className="gradient-divider opacity-30 my-1.5" />

      {/* Action Prompt */}
      <div className="flex items-center justify-between pt-1 text-[10px] font-mono text-zinc-400 group-hover:text-amber-300 transition-colors">
        <span className="flex items-center space-x-1">
          <span className="text-amber-400">✦</span>
          <span>{isZh ? "点击调阅专报" : "Click to Inspect"}</span>
        </span>
        <span className="flex items-center space-x-1 text-zinc-500 group-hover:text-amber-400">
          <span className="text-[9px] hidden sm:inline">[SPACE]</span>
          <ArrowRight
            size={11}
            className="transform group-hover:translate-x-1 transition-transform"
          />
        </span>
      </div>
    </div>
  );
};
