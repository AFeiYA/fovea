"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { SignalItem } from "@/types/signal";
import { useApp } from "@/context/AppContext";
import { ObservatoryCanvas } from "./ObservatoryCanvas";
import { SignalHoverTooltip } from "./SignalHoverTooltip";
import { SignalReadingSheet } from "@/components/reading/SignalReadingSheet";
import { AudioVisualizerButton } from "./AudioVisualizerButton";
import { Eye, ListFilter, Sparkles, Orbit, MessageSquare } from "lucide-react";
import { playTelemetryTick } from "@/utils/foveaAudio";

interface ObservatoryViewProps {
  signals: SignalItem[];
  onSwitchToFeed: () => void;
}

const SPECTRUM_FILTERS = [
  {
    id: "ALL",
    zh: "全光谱",
    en: "All Spectra",
    dot: "bg-amber-400",
    activeClass:
      "bg-amber-500/20 text-amber-300 ring-1 ring-amber-500/50 shadow-[0_0_18px_rgba(245,158,11,0.3)]",
  },
  {
    id: "REASONING",
    zh: "深度推理",
    en: "Reasoning",
    dot: "bg-sky-400",
    activeClass:
      "bg-sky-500/20 text-sky-300 ring-1 ring-sky-500/50 shadow-[0_0_18px_rgba(56,189,248,0.3)]",
  },
  {
    id: "COMPUTE",
    zh: "异构算力",
    en: "Compute",
    dot: "bg-rose-400",
    activeClass:
      "bg-rose-500/20 text-rose-300 ring-1 ring-rose-500/50 shadow-[0_0_18px_rgba(244,63,94,0.3)]",
  },
  {
    id: "ENERGY",
    zh: "吉瓦能源",
    en: "Energy",
    dot: "bg-emerald-400",
    activeClass:
      "bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/50 shadow-[0_0_18px_rgba(16,185,129,0.3)]",
  },
  {
    id: "MODELS",
    zh: "基座模型",
    en: "Models",
    dot: "bg-purple-400",
    activeClass:
      "bg-purple-500/20 text-purple-300 ring-1 ring-purple-500/50 shadow-[0_0_18px_rgba(168,85,247,0.3)]",
  },
  {
    id: "GOVERNANCE",
    zh: "主权治理",
    en: "Governance",
    dot: "bg-amber-400",
    activeClass:
      "bg-amber-500/20 text-amber-300 ring-1 ring-amber-500/50 shadow-[0_0_18px_rgba(245,158,11,0.3)]",
  },
];

export const ObservatoryView: React.FC<ObservatoryViewProps> = ({
  signals,
  onSwitchToFeed,
}) => {
  const { language, toggleLanguage, openAskFovea } = useApp();
  const isZh = language === "zh";

  const [activeFilter, setActiveFilter] = useState<string>("ALL");
  const [hoveredSignal, setHoveredSignal] = useState<SignalItem | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [selectedSignal, setSelectedSignal] = useState<SignalItem | null>(null);
  const [isHoveringTooltip, setIsHoveringTooltip] = useState(false);

  // Core Physical Interaction & Thought Dialogue
  const [coreThought, setCoreThought] = useState<string>("");
  const [isHoveringCore, setIsHoveringCore] = useState(false);
  const thoughtTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Check URL hash on load for deep linking (e.g. #sig-001)
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash) {
      const hashId = window.location.hash.replace("#", "");
      const matched = signals.find((s) => s.id === hashId);
      if (matched) {
        setSelectedSignal(matched);
      }
    }
  }, [signals]);

  // Spacebar to toggle between Observatory and Feed
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && !selectedSignal && e.target === document.body) {
        e.preventDefault();
        onSwitchToFeed();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onSwitchToFeed, selectedSignal]);

  const handleSelectSignal = useCallback((item: SignalItem) => {
    setSelectedSignal(item);
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", `#${item.id}`);
    }
  }, []);

  const handleCloseReading = useCallback(() => {
    setSelectedSignal(null);
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", " ");
    }
  }, []);

  // Handler when user clicks/pokes the central 3D Fovea Core
  const handlePokeCore = useCallback((thought: string) => {
    setCoreThought(thought);
    if (thoughtTimerRef.current) clearTimeout(thoughtTimerRef.current);
    thoughtTimerRef.current = setTimeout(() => {
      setCoreThought("");
    }, 5500);
  }, []);

  // Handler when user hovers the central 3D Fovea Core
  const handleHoverCore = useCallback((hovering: boolean) => {
    setIsHoveringCore(hovering);
  }, []);

  return (
    <div className="dark relative w-screen h-screen overflow-hidden bg-[#050507] text-zinc-100 select-none">
      {/* 3D WebGL Canvas Layer */}
      <ObservatoryCanvas
        signals={signals}
        onSelectSignal={handleSelectSignal}
        hoveredSignal={hoveredSignal}
        setHoveredSignal={setHoveredSignal}
        tooltipPos={tooltipPos}
        setTooltipPos={setTooltipPos}
        activeFilter={activeFilter}
        onPokeCore={handlePokeCore}
        onHoverCore={handleHoverCore}
        isZh={isZh}
        isHoveringTooltip={isHoveringTooltip}
      />

      {/* Floating HUD Tooltip for Signals */}
      <SignalHoverTooltip
        signal={hoveredSignal}
        pos={tooltipPos}
        onClick={handleSelectSignal}
        onHoverChange={setIsHoveringTooltip}
      />

      {/* Mobile Subtle Single-line Telemetry Pill for Fovea Thought */}
      {coreThought && (
        <div className="md:hidden pointer-events-none absolute bottom-24 inset-x-0 z-30 flex justify-center px-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="max-w-md px-3.5 py-1.5 rounded-full bg-zinc-950/90 backdrop-blur-xl ring-1 ring-amber-500/40 text-[11px] font-mono text-zinc-200 shadow-lg flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse flex-shrink-0" />
            <span className="text-amber-400 font-bold flex-shrink-0">FOVEA //</span>
            <span className="text-zinc-100 truncate">{coreThought}</span>
          </div>
        </div>
      )}

      {/* Top Floating Glass Telemetry Bar */}
      <header className="pointer-events-auto absolute top-0 inset-x-0 z-30 flex items-center justify-between px-4 sm:px-8 py-4 bg-gradient-to-b from-[#050507]/90 via-[#050507]/40 to-transparent backdrop-blur-[2px]">
        {/* Brand & Persona Identifier */}
        <div className="flex items-center space-x-3">
          <div className="relative w-8 h-8 flex items-center justify-center rounded-xl bg-white/[0.04] ring-1 ring-white/[0.08] shadow-[0_0_16px_rgba(245,158,11,0.25)]">
            <Orbit size={16} className="text-amber-400 animate-spin" style={{ animationDuration: "16s" }} />
          </div>

          <div>
            <div className="flex items-center space-x-2 text-xs font-mono font-bold tracking-widest text-zinc-100">
              <span>FOVEA.SI</span>
              <span className="text-zinc-600">/</span>
              <span className="text-amber-400 font-semibold text-[11px]">OBSERVATORY</span>
              <span className="text-[10px] text-zinc-500 font-normal">v0.32</span>
            </div>
            <div className="text-[10px] font-mono text-zinc-500 hidden sm:block">
              {isZh ? "智能观测镜 · 凝视超智能演进" : "The Living Lens on Superintelligence"}
            </div>
          </div>
        </div>

        {/* Middle Telemetry Readout (Desktop): Morphs seamlessly into live thought transmission */}
        <div className="hidden md:flex items-center space-x-3 px-4 py-1.5 rounded-full bg-zinc-950/85 ring-1 ring-white/[0.08] text-[11px] font-mono shadow-xs backdrop-blur-xl transition-all max-w-xl">
          {coreThought ? (
            <div className="flex items-center space-x-2 text-amber-300 animate-in fade-in duration-200">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping flex-shrink-0" />
              <span className="font-bold text-amber-400 flex-shrink-0">FOVEA //</span>
              <span className="text-zinc-100 font-medium truncate">{coreThought}</span>
            </div>
          ) : (
            <>
              <div className="flex items-center space-x-1.5 text-emerald-400">
                {/* Live Micro-Waveform Equalizer */}
                <div className="flex items-end space-x-0.5 h-3">
                  <span className="w-0.5 h-2 bg-emerald-400 animate-pulse" style={{ animationDuration: "0.8s" }} />
                  <span className="w-0.5 h-3 bg-emerald-400 animate-pulse" style={{ animationDuration: "0.5s" }} />
                  <span className="w-0.5 h-1.5 bg-emerald-400 animate-pulse" style={{ animationDuration: "1.1s" }} />
                  <span className="w-0.5 h-2.5 bg-emerald-400 animate-pulse" style={{ animationDuration: "0.7s" }} />
                </div>
                <span>LIVE</span>
              </div>
              <span className="text-zinc-700">·</span>
              <span>{signals.length} {isZh ? "条信号在轨" : "SIGNALS IN ORBIT"}</span>
              <span className="text-zinc-700">·</span>
              <span className="text-amber-400/90 font-medium">ACUITY: 99.8%</span>
            </>
          )}
        </div>

        {/* Right Controls: Ask Fovea, Feed Switch, Lusion Audio Visualizer, Language */}
        <div className="flex items-center space-x-2 font-mono text-xs">
          {/* Ask Fovea AI Modal Trigger */}
          <button
            onClick={() => openAskFovea()}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full borderless-pill ring-1 ring-amber-500/30 hover:ring-amber-500/60 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 transition-all shadow-xs cursor-pointer active:scale-95"
            title={isZh ? "询问 Fovea 观测镜 AI" : "Ask Fovea Observer AI"}
          >
            <MessageSquare size={12} className="text-amber-400" />
            <span className="hidden sm:inline">{isZh ? "询问 Fovea" : "Ask Fovea"}</span>
          </button>

          {/* Switch to Classic Feed */}
          <button
            onClick={onSwitchToFeed}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full borderless-pill ring-1 ring-white/[0.08] hover:ring-amber-500/40 text-zinc-200 hover:text-white transition-all shadow-xs cursor-pointer active:scale-95"
            title="Switch to Index List View [SPACE]"
          >
            <ListFilter size={13} className="text-amber-400" />
            <span className="hidden sm:inline">{isZh ? "公报列表 [SPACE]" : "Feed Index [SPACE]"}</span>
          </button>

          {/* Lusion-Grade Interactive Mini-Canvas Audio Visualizer Button */}
          <AudioVisualizerButton isZh={isZh} />

          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="px-2.5 py-1.5 rounded-full borderless-pill ring-1 ring-white/[0.06] hover:ring-white/[0.15] text-zinc-400 hover:text-amber-400 transition-colors text-[11px] cursor-pointer"
            title="Toggle Language"
          >
            {isZh ? "EN" : "中"}
          </button>
        </div>
      </header>

      {/* Unified Floating Observatory Spectrum Console */}
      <div className="pointer-events-auto absolute bottom-4 sm:bottom-6 inset-x-0 z-30 flex flex-col items-center px-4 space-y-2">
        {/* Spectrum Prism Lens Dock */}
        <div className="flex items-center space-x-1 sm:space-x-1.5 p-1.5 rounded-full borderless-glass ring-1 ring-white/[0.08] bg-[#07070b]/90 shadow-[0_16px_48px_rgba(0,0,0,0.7)] backdrop-blur-2xl max-w-full overflow-x-auto no-scrollbar">
          {SPECTRUM_FILTERS.map((item) => {
            const isSelected = activeFilter === item.id;
            const count =
              item.id === "ALL"
                ? signals.length
                : signals.filter((s) => s.tags.includes(item.id as any)).length;

            return (
              <button
                key={item.id}
                onClick={() => {
                  playTelemetryTick();
                  setActiveFilter(item.id);
                }}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-mono tracking-wider transition-all whitespace-nowrap cursor-pointer active:scale-95 ${
                  isSelected
                    ? `${item.activeClass} font-semibold`
                    : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
                }`}
                title={isZh ? `切换至 ${item.zh} 光谱` : `Filter by ${item.en}`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${item.dot} ${
                    isSelected ? "animate-pulse" : "opacity-60"
                  }`}
                />
                <span>{isZh ? item.zh : item.en}</span>
                <span className="text-[10px] opacity-40 font-normal">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Integrated Sub-Telemetry & Interactive Cues */}
        <div className="flex items-center space-x-3 text-[10px] font-mono text-zinc-500 bg-zinc-950/75 backdrop-blur-md px-4 py-1 rounded-full ring-1 ring-white/[0.05] shadow-xs">
          <div className="flex items-center space-x-1.5">
            <Eye
              size={11}
              className={isHoveringCore ? "text-amber-400 animate-ping" : "text-amber-500/70"}
            />
            <span
              className={`transition-colors ${
                isHoveringCore ? "text-amber-300 font-semibold" : "text-zinc-400"
              }`}
            >
              {isHoveringCore
                ? isZh
                  ? "⚡ 锁定中央核心视网膜 · 点击进行神经元戳击"
                  : "⚡ FOVEA CENTRALIS LOCKED · CLICK TO POKE"
                : isZh
                ? "光标凝视聚焦 · 节点悬停定格"
                : "FOVEAL GAZE LOCK · NODE ANCHORED"}
            </span>
          </div>

          <span className="text-zinc-700">·</span>

          <div className="hidden sm:flex items-center space-x-2 text-zinc-500">
            <span>[拖拽旋转]</span>
            <span>·</span>
            <span>[滚轮缩放]</span>
            <span>·</span>
            <span>[SPACE 切换列表]</span>
          </div>
          <div className="sm:hidden text-zinc-500">
            <span>[双指旋转 · 缩放]</span>
          </div>
        </div>
      </div>

      {/* Reading Sheet Overlay (When a signal is selected) */}
      {selectedSignal && (
        <SignalReadingSheet
          signal={selectedSignal}
          allSignals={signals}
          onClose={handleCloseReading}
          onNavigate={handleSelectSignal}
        />
      )}
    </div>
  );
};
