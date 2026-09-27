"use client";

import React from "react";
import { Sun, Moon, Languages, Eye, Sparkles, Orbit } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { AudioVisualizerButton } from "@/components/observatory/AudioVisualizerButton";

interface HeaderProps {
  activeTab: "latest" | "signals" | "weekly" | "about";
  setActiveTab: (tab: "latest" | "signals" | "weekly" | "about") => void;
  signalCount: number;
  onSwitchToObservatory?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  signalCount,
  onSwitchToObservatory,
}) => {
  const { theme, toggleTheme, language, toggleLanguage, t } = useApp();

  return (
    <header className="sticky top-0 z-40 transition-colors bg-[var(--bg-page)]/80 backdrop-blur-xl">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-3 pb-2.5">
        {/* Top Status Bar & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono mb-3 gap-2">
          {/* Fovea's Sensory Observation State (Clickable to view roadmap & anatomy) */}
          <button
            onClick={() => setActiveTab("about")}
            className="flex items-center space-x-2 text-left group hover:opacity-90 transition-opacity cursor-pointer flex-wrap"
            title={language === "zh" ? "点击查看 Fovea 认知解剖图与自演化路线图" : "Click to view Fovea's Cognitive Anatomy & Autonomy Roadmap"}
          >
            <span className="relative flex h-2 w-2 flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <span className="tracking-wider uppercase font-semibold text-[var(--text-main)] group-hover:text-amber-500 transition-colors">
              {t("observerStatus")}
            </span>
            <span className="text-[var(--text-dim)] opacity-40">·</span>
            <span className="text-[var(--text-dim)]">
              {t("observerMetrics")}
            </span>
          </button>

          {/* Language & Theme Controls */}
          <div className="flex items-center space-x-2 self-end sm:self-auto">
            {/* Tactile Audio Synth Visualizer Toggle */}
            <AudioVisualizerButton isZh={language === "zh"} />

            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-1 px-2.5 py-1 rounded-full borderless-pill ring-1 ring-white/[0.06] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-all cursor-pointer shadow-xs"
              title={language === "en" ? "切换至中文" : "Switch to English"}
            >
              <Languages size={12} className="text-amber-500" />
              <span className="text-[11px] font-mono font-medium">
                {language === "zh" ? "EN" : "中"}
              </span>
            </button>

            {/* Dark / Light Toggle */}
            <button
              onClick={toggleTheme}
              className="flex items-center space-x-1.5 px-3 py-1 rounded-full borderless-pill ring-1 ring-white/[0.06] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-all cursor-pointer shadow-xs"
              title={theme === "dark" ? "切换为浅色模式" : "Switch to dark mode"}
            >
              {theme === "dark" ? (
                <Sun size={12} className="text-amber-400" />
              ) : (
                <Moon size={12} className="text-indigo-500" />
              )}
              <span className="text-[11px] font-mono uppercase tracking-wider">
                {theme === "dark"
                  ? language === "zh"
                    ? "浅色"
                    : "Light"
                  : language === "zh"
                  ? "深色"
                  : "Dark"}
              </span>
            </button>
          </div>
        </div>

        {/* Brand Main Section */}
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-3 pb-1">
          <div>
            <div className="flex items-center space-x-3">
              {/* Custom Reticle Logo representing the Fovea Centralis */}
              <div className="relative w-7 h-7 flex items-center justify-center rounded-xl bg-white/[0.04] ring-1 ring-white/[0.08] shadow-[0_0_16px_rgba(245,158,11,0.2)]">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-4 h-4 border border-amber-500/40 rounded-full animate-pulse"></div>
                  <div className="absolute w-1.5 h-1.5 bg-amber-500 rounded-full shadow-[0_0_10px_rgba(245,158,11,1)]"></div>
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight font-mono text-[var(--text-main)]">
                FOVEA<span className="text-amber-500">.SI</span>
              </h1>
            </div>

            <p className="mt-1 text-sm font-medium tracking-wide text-[var(--text-main)]">
              {t("subtitle")}
            </p>
            <p className="text-xs text-[var(--text-muted)] mt-0.5 max-w-xl">
              {t("motto")}
            </p>
          </div>

          {/* Navigation Tabs - Floating Borderless Glass Dock */}
          <nav className="flex items-center space-x-1 p-1 rounded-full borderless-glass ring-1 ring-white/[0.06] self-start sm:self-end shadow-sm flex-wrap gap-y-1">
            {onSwitchToObservatory && (
              <button
                onClick={onSwitchToObservatory}
                className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 ring-1 ring-amber-500/30 transition-all shadow-xs cursor-pointer active:scale-95"
                title={language === "zh" ? "进入 3D 智能观测镜 [SPACE]" : "Enter 3D Observatory [SPACE]"}
              >
                <Orbit size={13} className="animate-spin text-amber-400" style={{ animationDuration: "12s" }} />
                <span>{language === "zh" ? "星图观测镜" : "Observatory"}</span>
              </button>
            )}

            <button
              onClick={() => setActiveTab("latest")}
              className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all cursor-pointer ${
                activeTab === "latest"
                  ? "bg-white/[0.09] text-white font-semibold ring-1 ring-white/[0.1] shadow-xs"
                  : "text-[var(--text-muted)] hover:text-[var(--text-main)]"
              }`}
            >
              {t("navLatest")}
            </button>

            <button
              onClick={() => setActiveTab("signals")}
              className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-full transition-all cursor-pointer ${
                activeTab === "signals"
                  ? "bg-red-500/15 text-red-400 ring-1 ring-red-500/30 font-semibold shadow-xs"
                  : "text-[var(--text-muted)] hover:text-red-400"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
              <span>{t("navSignals")}</span>
            </button>

            <button
              onClick={() => setActiveTab("weekly")}
              className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all cursor-pointer ${
                activeTab === "weekly"
                  ? "bg-white/[0.09] text-white font-semibold ring-1 ring-white/[0.1] shadow-xs"
                  : "text-[var(--text-muted)] hover:text-[var(--text-main)]"
              }`}
            >
              {t("navWeekly")}
            </button>

            <button
              onClick={() => setActiveTab("about")}
              className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all cursor-pointer ${
                activeTab === "about"
                  ? "bg-white/[0.09] text-white font-semibold ring-1 ring-white/[0.1] shadow-xs"
                  : "text-[var(--text-muted)] hover:text-[var(--text-main)]"
              }`}
            >
              {t("navAbout")}
            </button>
          </nav>
        </div>
      </div>
      {/* Borderless gradient hairline */}
      <div className="gradient-divider opacity-70"></div>
    </header>
  );
};
