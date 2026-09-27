"use client";

import React, { useState, useMemo } from "react";
import { INITIAL_SIGNALS } from "@/data/signals";
import { TagType, SignalItem } from "@/types/signal";
import { Header } from "@/components/Header";
import { TagFilter } from "@/components/TagFilter";
import { SignalCard } from "@/components/SignalCard";
import { WeeklyView } from "@/components/WeeklyView";
import { AboutView } from "@/components/AboutView";
import { ObserverBriefing } from "@/components/ObserverBriefing";
import { FoveaLivingEntity } from "@/components/FoveaLivingEntity";
import { ObservatoryView } from "@/components/observatory/ObservatoryView";
import { SignalReadingSheet } from "@/components/reading/SignalReadingSheet";
import { AskFoveaModal } from "@/components/AskFoveaModal";
import { NewsletterBanner } from "@/components/NewsletterBanner";
import { Footer } from "@/components/Footer";
import { useApp } from "@/context/AppContext";
import { Search, Flame, Orbit } from "lucide-react";
import { playApertureWarpSound } from "@/utils/foveaAudio";

export default function Home() {
  const [viewMode, setViewMode] = useState<"observatory" | "feed">("observatory");
  const [isWarping, setIsWarping] = useState(false);
  const [selectedSignalForReading, setSelectedSignalForReading] = useState<SignalItem | null>(null);
  const [activeTab, setActiveTab] = useState<"latest" | "signals" | "weekly" | "about">("latest");
  const [selectedTag, setSelectedTag] = useState<TagType | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const { language, t } = useApp();
  const isZh = language === "zh";

  const signals = INITIAL_SIGNALS;

  // Warp Transition Orchestrator (Cinematic Aperture Dilation)
  const switchModeWithWarp = (targetMode: "observatory" | "feed") => {
    if (targetMode === viewMode) return;
    playApertureWarpSound();
    setIsWarping(true);
    setTimeout(() => {
      setViewMode(targetMode);
    }, 280);
    setTimeout(() => {
      setIsWarping(false);
    }, 640);
  };

  // Compute tag counts
  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: signals.length };
    signals.forEach((s) => {
      s.tags.forEach((t) => {
        counts[t] = (counts[t] || 0) + 1;
      });
    });
    return counts;
  }, [signals]);

  // Filter signals based on activeTab, selectedTag, and searchQuery
  const filteredSignals = useMemo(() => {
    return signals.filter((item) => {
      // Tab filter
      if (activeTab === "signals" && !item.isSignal) {
        return false;
      }

      // Tag filter
      if (selectedTag !== "ALL" && !item.tags.includes(selectedTag)) {
        return false;
      }

      // Search query filter (matches both English and Chinese fields)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesEn =
          item.title.toLowerCase().includes(q) ||
          item.summary.toLowerCase().includes(q) ||
          item.whyItMatters.toLowerCase().includes(q);
        const matchesZh =
          (item.titleZh && item.titleZh.toLowerCase().includes(q)) ||
          (item.summaryZh && item.summaryZh.toLowerCase().includes(q)) ||
          (item.whyItMattersZh && item.whyItMattersZh.toLowerCase().includes(q));
        const matchesSource = item.source.name.toLowerCase().includes(q);

        if (!matchesEn && !matchesZh && !matchesSource) {
          return false;
        }
      }

      return true;
    });
  }, [signals, activeTab, selectedTag, searchQuery]);

  // Group filtered signals by localized date label
  const groupedSignals = useMemo(() => {
    const groups: { [key: string]: SignalItem[] } = {};
    filteredSignals.forEach((item) => {
      const key = isZh ? item.dateLabelZh : item.dateLabel;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(item);
    });
    return groups;
  }, [filteredSignals, isZh]);

  // Space shortcut to toggle modes
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.code === "Space" &&
        viewMode === "feed" &&
        e.target === document.body &&
        !searchQuery &&
        !selectedSignalForReading
      ) {
        e.preventDefault();
        switchModeWithWarp("observatory");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [viewMode, searchQuery, selectedSignalForReading]);

  // Check URL hash on load for deep linking
  React.useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash) {
      const hashId = window.location.hash.replace("#", "");
      const matched = signals.find((s) => s.id === hashId);
      if (matched && viewMode === "feed") {
        setSelectedSignalForReading(matched);
      }
    }
  }, [signals, viewMode]);

  // Dual-Mode: Experience Mode (Observatory) by default
  if (viewMode === "observatory") {
    return (
      <>
        {/* Optical Iris Warp Flash */}
        {isWarping && (
          <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center overflow-hidden">
            <div className="absolute w-[500px] h-[500px] rounded-full border border-amber-400/60 shadow-[0_0_80px_rgba(245,158,11,0.5)] animate-iris-warp" />
            <div className="absolute inset-0 bg-[#050507]/50 backdrop-blur-md" />
          </div>
        )}
        <ObservatoryView
          signals={signals}
          onSwitchToFeed={() => switchModeWithWarp("feed")}
        />
        <AskFoveaModal />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col transition-colors selection:bg-amber-500/20 selection:text-amber-500 animate-aperture-in">
      {/* Optical Iris Warp Flash */}
      {isWarping && (
        <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center overflow-hidden">
          <div className="absolute w-[500px] h-[500px] rounded-full border border-amber-400/60 shadow-[0_0_80px_rgba(245,158,11,0.5)] animate-iris-warp" />
          <div className="absolute inset-0 bg-[#050507]/50 backdrop-blur-md" />
        </div>
      )}

      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        signalCount={signals.length}
        onSwitchToObservatory={() => switchModeWithWarp("observatory")}
      />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8">
        {/* Main Feed Content (Latest & Signals) */}
        {(activeTab === "latest" || activeTab === "signals") && (
          <div key={activeTab} className="space-y-6 animate-in fade-in zoom-in-[0.99] duration-300">
            {/* Fovea Living Core (Organic Liquid Iris) */}
            {activeTab === "latest" && !searchQuery && selectedTag === "ALL" && (
              <FoveaLivingEntity />
            )}

            {/* Search & Tag Filter Bar - Borderless */}
            <div className="space-y-3 pb-3">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search
                    size={14}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-dim)]"
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t("searchPlaceholder")}
                    className="w-full pl-10 pr-14 py-2.5 rounded-full borderless-pill ring-1 ring-white/[0.06] focus:ring-amber-500/40 text-xs text-[var(--text-main)] placeholder-[var(--text-dim)] font-mono transition-all outline-none shadow-xs"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-[var(--text-dim)] hover:text-white bg-white/[0.06] px-2 py-0.5 rounded-full cursor-pointer transition-colors"
                    >
                      {t("clear")}
                    </button>
                  )}
                </div>

                {activeTab === "signals" && (
                  <div className="flex items-center space-x-2 text-xs font-mono text-red-300 bg-red-500/15 ring-1 ring-red-500/30 px-3.5 py-1.5 rounded-full self-start sm:self-auto shadow-xs">
                    <Flame size={13} className="text-red-400" />
                    <span>{t("filteringSignalsOnly")}</span>
                  </div>
                )}
              </div>

              {/* Tag Filters */}
              <TagFilter
                selectedTag={selectedTag}
                onSelectTag={setSelectedTag}
                tagCounts={tagCounts}
              />
            </div>
            <div className="gradient-divider opacity-50 mb-6"></div>

            {/* List Feed Grouped by Date */}
            {filteredSignals.length === 0 ? (
              <div className="text-center py-16 rounded-3xl borderless-glass ring-1 ring-white/[0.04]">
                <p className="text-sm font-mono text-[var(--text-muted)]">
                  {t("noSignals")}
                </p>
                <button
                  onClick={() => {
                    setSelectedTag("ALL");
                    setSearchQuery("");
                  }}
                  className="mt-3 text-xs font-mono text-amber-400 hover:underline cursor-pointer"
                >
                  {t("resetFilters")}
                </button>
              </div>
            ) : (
              <div className="space-y-10">
                {Object.keys(groupedSignals).map((dateLabel) => (
                  <section key={dateLabel} className="space-y-4">
                    {/* Day Group Header - Borderless Pill + Gradient Line */}
                    <div className="flex items-center space-x-3">
                      <span className="text-xs font-mono font-bold tracking-widest text-[var(--text-muted)] uppercase bg-white/[0.03] ring-1 ring-white/[0.06] px-3.5 py-1 rounded-full shadow-xs">
                        {dateLabel}
                      </span>
                      <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent"></div>
                      <span className="text-[11px] font-mono text-[var(--text-dim)]">
                        {groupedSignals[dateLabel].length}{" "}
                        {isZh ? "条信号" : "signals"}
                      </span>
                    </div>

                    {/* Cards */}
                    <div className="space-y-4">
                      {groupedSignals[dateLabel].map((item) => (
                        <SignalCard
                          key={item.id}
                          item={item}
                          onTagClick={(tag) => setSelectedTag(tag as TagType)}
                          onSelectSignal={(item) => setSelectedSignalForReading(item)}
                        />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            )}

            {/* Newsletter Callout */}
            <NewsletterBanner />
          </div>
        )}

        {/* Weekly View */}
        {activeTab === "weekly" && (
          <div key="weekly" className="animate-in fade-in zoom-in-[0.99] duration-300">
            <WeeklyView signals={signals} />
            <NewsletterBanner />
          </div>
        )}

        {/* About / Manifesto View */}
        {activeTab === "about" && (
          <div key="about" className="animate-in fade-in zoom-in-[0.99] duration-300">
            <AboutView />
          </div>
        )}
      </main>

      {/* Global Interactive Ask Fovea Modal */}
      <AskFoveaModal />

      {/* Dispatch Reading Sheet in Feed mode */}
      {selectedSignalForReading && (
        <SignalReadingSheet
          signal={selectedSignalForReading}
          allSignals={signals}
          onClose={() => {
            setSelectedSignalForReading(null);
            if (typeof window !== "undefined") {
              window.history.replaceState(null, "", " ");
            }
          }}
          onNavigate={(item) => {
            setSelectedSignalForReading(item);
            if (typeof window !== "undefined") {
              window.history.replaceState(null, "", `#${item.id}`);
            }
          }}
        />
      )}

      {/* Floating Return to Observatory Button in Feed mode - Borderless Glass Pill */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => switchModeWithWarp("observatory")}
          className="flex items-center space-x-2.5 px-4.5 py-2.5 rounded-full borderless-pill ring-1 ring-amber-500/40 bg-zinc-950/80 hover:bg-zinc-900 text-amber-300 hover:text-amber-200 shadow-[0_0_30px_rgba(245,158,11,0.25)] font-mono text-xs font-semibold backdrop-blur-xl transition-all active:scale-95 cursor-pointer"
          title={isZh ? "返回 3D 星图观测镜 [SPACE]" : "Return to 3D Observatory [SPACE]"}
        >
          <Orbit size={14} className="animate-spin text-amber-400" style={{ animationDuration: "12s" }} />
          <span>{isZh ? "星图观测镜 [SPACE]" : "OBSERVATORY [SPACE]"}</span>
        </button>
      </div>

      <Footer />
    </div>
  );
}
