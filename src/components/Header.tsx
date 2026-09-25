"use client";

import React, { useEffect, useState } from "react";
import { Sun, Moon, Radio } from "lucide-react";

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
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Initial theme check
    const stored = localStorage.getItem("fovea_theme");
    if (stored === "light") {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    } else {
      setIsDark(true);
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
      localStorage.setItem("fovea_theme", "light");
      setIsDark(false);
    } else {
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
      localStorage.setItem("fovea_theme", "dark");
      setIsDark(true);
    }
  };

  return (
    <header className="border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
        {/* Top Status Bar */}
        <div className="flex items-center justify-between text-xs text-zinc-500 font-mono mb-3">
          <div className="flex items-center space-x-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="tracking-wider uppercase">Foveal Radar: Active</span>
            <span className="text-zinc-600">·</span>
            <span className="text-zinc-400">{signalCount} signals indexed</span>
          </div>

          <button
            onClick={toggleTheme}
            className="flex items-center space-x-1.5 px-2 py-1 rounded border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200 transition-colors"
            title="Toggle color theme"
          >
            {isDark ? <Sun size={13} /> : <Moon size={13} />}
            <span className="text-[11px] uppercase tracking-wider">{isDark ? "Light" : "Dark"}</span>
          </button>
        </div>

        {/* Brand Main Section */}
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-3 pb-3">
          <div>
            <div className="flex items-center space-x-3">
              {/* Custom Reticle Logo representing the Fovea Centralis */}
              <div className="relative w-7 h-7 flex items-center justify-center rounded-lg bg-zinc-900 border border-zinc-700/80 shadow-inner">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-4 h-4 border border-zinc-600 rounded-full"></div>
                  <div className="absolute w-1.5 h-1.5 bg-amber-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.8)]"></div>
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight font-mono text-zinc-100">
                FOVEA<span className="text-amber-500">.SI</span>
              </h1>
            </div>

            <p className="mt-1 text-sm font-medium text-zinc-300 tracking-wide">
              Superintelligence, in focus.
            </p>
            <p className="text-xs text-zinc-500 mt-0.5 max-w-lg">
              Not everything that happens in AI matters. Fovea tracks what might.
            </p>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center space-x-1 bg-zinc-900/90 p-1 rounded-lg border border-zinc-800 self-start sm:self-end">
            <button
              onClick={() => setActiveTab("latest")}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                activeTab === "latest"
                  ? "bg-zinc-800 text-zinc-100 shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Latest
            </button>

            <button
              onClick={() => setActiveTab("signals")}
              className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                activeTab === "signals"
                  ? "bg-red-950/60 text-red-300 border border-red-800/40 shadow-sm"
                  : "text-zinc-400 hover:text-red-400"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
              <span>Signals</span>
            </button>

            <button
              onClick={() => setActiveTab("weekly")}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                activeTab === "weekly"
                  ? "bg-zinc-800 text-zinc-100 shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Weekly
            </button>

            <button
              onClick={() => setActiveTab("about")}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                activeTab === "about"
                  ? "bg-zinc-800 text-zinc-100 shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              About
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
