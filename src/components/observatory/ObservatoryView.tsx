"use client";

import React, { useState, useEffect, useCallback } from "react";
import { SignalItem } from "@/types/signal";
import { useApp } from "@/context/AppContext";
import { ObservatoryCanvas } from "./ObservatoryCanvas";
import { SignalHoverTooltip } from "./SignalHoverTooltip";
import { SignalReadingSheet } from "@/components/reading/SignalReadingSheet";
import { Volume2, VolumeX, Eye, ListFilter, Sparkles, Orbit } from "lucide-react";
import { isSoundEnabled, toggleSound } from "@/utils/foveaAudio";

interface ObservatoryViewProps {
  signals: SignalItem[];
  onSwitchToFeed: () => void;
}

export const ObservatoryView: React.FC<ObservatoryViewProps> = ({
  signals,
  onSwitchToFeed,
}) => {
  const { language, toggleLanguage } = useApp();
  const isZh = language === "zh";

  const [hoveredSignal, setHoveredSignal] = useState<SignalItem | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [selectedSignal, setSelectedSignal] = useState<SignalItem | null>(null);
  const [soundOn, setSoundOn] = useState(true);

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

  const handleAudioToggle = () => {
    const next = toggleSound();
    setSoundOn(next);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#050507] text-zinc-100 select-none">
      {/* 3D WebGL Canvas Layer */}
      <ObservatoryCanvas
        signals={signals}
        onSelectSignal={handleSelectSignal}
        hoveredSignal={hoveredSignal}
        setHoveredSignal={setHoveredSignal}
        tooltipPos={tooltipPos}
        setTooltipPos={setTooltipPos}
      />

      {/* Floating HUD Tooltip */}
      <SignalHoverTooltip
        signal={hoveredSignal}
        pos={tooltipPos}
        onClick={handleSelectSignal}
      />

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

        {/* Middle Telemetry Readout (Desktop) */}
        <div className="hidden md:flex items-center space-x-3 px-4 py-1.5 rounded-full borderless-pill ring-1 ring-white/[0.06] text-[11px] font-mono text-zinc-400 shadow-xs">
          <span className="flex items-center space-x-1.5 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>LIVE</span>
          </span>
          <span className="text-zinc-700">·</span>
          <span>{signals.length} {isZh ? "条信号在轨" : "SIGNALS IN ORBIT"}</span>
          <span className="text-zinc-700">·</span>
          <span className="text-amber-400/90 font-medium">ACUITY: 99.8%</span>
        </div>

        {/* Right Controls: Mode Toggle, Sound, Language */}
        <div className="flex items-center space-x-2 font-mono text-xs">
          {/* Switch to Classic Feed */}
          <button
            onClick={onSwitchToFeed}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full borderless-pill ring-1 ring-white/[0.08] hover:ring-amber-500/40 text-zinc-200 hover:text-white transition-all shadow-xs cursor-pointer active:scale-95"
            title="Switch to Index List View [SPACE]"
          >
            <ListFilter size={13} className="text-amber-400" />
            <span className="hidden sm:inline">{isZh ? "列表视角 [SPACE]" : "Feed Index [SPACE]"}</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={handleAudioToggle}
            className="p-2 rounded-full borderless-pill ring-1 ring-white/[0.06] hover:ring-white/[0.15] text-zinc-400 hover:text-white transition-colors cursor-pointer"
            title={soundOn ? "Mute Sound" : "Enable Tactile Sounds"}
          >
            {soundOn ? <Volume2 size={13} className="text-amber-400" /> : <VolumeX size={13} />}
          </button>

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

      {/* Bottom Status Ticker & Interactive Hints */}
      <footer className="pointer-events-none absolute bottom-0 inset-x-0 z-20 flex flex-col sm:flex-row items-center justify-between px-4 sm:px-8 py-3.5 bg-gradient-to-t from-[#050507]/90 via-[#050507]/30 to-transparent text-[11px] font-mono text-zinc-500">
        <div className="flex items-center space-x-2">
          <Eye size={12} className="text-amber-500" />
          <span className="tracking-wide">
            {isZh
              ? "光标凝视处即刻高锐度聚焦 · 外围微弱降采样"
              : "FOVEAL FOCUS ACTIVATED // PERIPHERAL VISION DAMPED"}
          </span>
        </div>

        <div className="hidden sm:flex items-center space-x-3 text-[10px] text-zinc-600">
          <span>[HOVER NODE TO FOCUS]</span>
          <span>·</span>
          <span>[CLICK TO READ DISPATCH]</span>
          <span>·</span>
          <span>[SPACE FOR LIST]</span>
        </div>
      </footer>

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
