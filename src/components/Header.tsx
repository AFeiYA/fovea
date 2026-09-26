"use client";

import React from "react";
import { Sun, Moon, Languages, Eye, Sparkles } from "lucide-react";
import { useApp } from "@/context/AppContext";

interface HeaderProps {
  activeTab: "latest" | "signals" | "weekly" | "about";
  setActiveTab: (tab: "latest" | "signals" | "weekly" | "about") => void;
  signalCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  signalCount,
}) => {
  const { theme, toggleTheme, language, toggleLanguage, t } = useApp();

  return (
    <header className="fovea-header border-b backdrop-blur-md sticky top-0 z-40 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
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
            <span className="text-[var(--border-strong)]">·</span>
            <span className="text-[var(--text-dim)]">
              {t("observerMetrics")}
            </span>
          </button>

          {/* Language & Theme Controls */}
          <div className="flex items-center space-x-2 self-end sm:self-auto">
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-1 px-2 py-1 rounded border border-[var(--border-card)] hover:border-[var(--border-strong)] bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors shadow-xs"
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
              className="flex items-center space-x-1.5 px-2.5 py-1 rounded border border-[var(--border-card)] hover:border-[var(--border-strong)] bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors shadow-xs"
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
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-3 pb-2">
          <div>
            <div className="flex items-center space-x-3">
              {/* Custom Reticle Logo representing the Fovea Centralis */}
              <div className="relative w-7 h-7 flex items-center justify-center rounded-lg border border-[var(--border-card)] bg-[var(--bg-card)] shadow-xs">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-4 h-4 border border-[var(--border-strong)] rounded-full"></div>
                  <div className="absolute w-1.5 h-1.5 bg-amber-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.9)]"></div>
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

          {/* Navigation Tabs */}
          <nav className="flex items-center space-x-1 p-1 rounded-lg border border-[var(--border-card)] bg-[var(--bg-card)] self-start sm:self-end shadow-xs">
            <button
              onClick={() => setActiveTab("latest")}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                activeTab === "latest"
                  ? "bg-[var(--bg-subtle)] text-[var(--text-main)] font-semibold shadow-xs"
                  : "text-[var(--text-muted)] hover:text-[var(--text-main)]"
              }`}
            >
              {t("navLatest")}
            </button>

            <button
              onClick={() => setActiveTab("signals")}
              className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                activeTab === "signals"
                  ? "bg-red-500/10 text-red-600 dark:text-red-300 border border-red-500/30 shadow-xs"
                  : "text-[var(--text-muted)] hover:text-red-500"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
              <span>{t("navSignals")}</span>
            </button>

            <button
              onClick={() => setActiveTab("weekly")}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                activeTab === "weekly"
                  ? "bg-[var(--bg-subtle)] text-[var(--text-main)] font-semibold shadow-xs"
                  : "text-[var(--text-muted)] hover:text-[var(--text-main)]"
              }`}
            >
              {t("navWeekly")}
            </button>

            <button
              onClick={() => setActiveTab("about")}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                activeTab === "about"
                  ? "bg-[var(--bg-subtle)] text-[var(--text-main)] font-semibold shadow-xs"
                  : "text-[var(--text-muted)] hover:text-[var(--text-main)]"
              }`}
            >
              {t("navAbout")}
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
