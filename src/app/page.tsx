"use client";

import React, { useState, useMemo } from "react";
import { INITIAL_SIGNALS } from "@/data/signals";
import { TagType, SignalItem } from "@/types/signal";
import { Header } from "@/components/Header";
import { TagFilter } from "@/components/TagFilter";
import { SignalCard } from "@/components/SignalCard";
import { WeeklyView } from "@/components/WeeklyView";
import { AboutView } from "@/components/AboutView";
import { NewsletterBanner } from "@/components/NewsletterBanner";
import { Footer } from "@/components/Footer";
import { useApp } from "@/context/AppContext";
import { Search, Flame } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"latest" | "signals" | "weekly" | "about">("latest");
  const [selectedTag, setSelectedTag] = useState<TagType | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const { language, t } = useApp();
  const isZh = language === "zh";

  const signals = INITIAL_SIGNALS;

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

  return (
    <div className="min-h-screen flex flex-col transition-colors selection:bg-amber-500/20 selection:text-amber-500">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        signalCount={signals.length}
      />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8">
        {/* Main Feed Content (Latest & Signals) */}
        {(activeTab === "latest" || activeTab === "signals") && (
          <div className="space-y-6">
            {/* Search & Tag Filter Bar */}
            <div className="space-y-3 pb-3 border-b border-[var(--border-card)]">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-dim)]"
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t("searchPlaceholder")}
                    className="w-full pl-9 pr-14 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border-card)] text-xs text-[var(--text-main)] placeholder-[var(--text-dim)] focus:outline-none focus:border-amber-500 font-mono transition-colors shadow-xs"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-[var(--text-dim)] hover:text-[var(--text-main)] bg-[var(--bg-subtle)] px-1.5 py-0.5 rounded"
                    >
                      {t("clear")}
                    </button>
                  )}
                </div>

                {activeTab === "signals" && (
                  <div className="flex items-center space-x-2 text-xs font-mono text-red-600 dark:text-red-300 bg-red-500/10 border border-red-500/30 px-3 py-1.5 rounded-lg self-start sm:self-auto shadow-xs">
                    <Flame size={13} className="text-red-500" />
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

            {/* List Feed Grouped by Date */}
            {filteredSignals.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-[var(--border-card)] rounded-xl bg-[var(--bg-card)]">
                <p className="text-sm font-mono text-[var(--text-muted)]">
                  {t("noSignals")}
                </p>
                <button
                  onClick={() => {
                    setSelectedTag("ALL");
                    setSearchQuery("");
                  }}
                  className="mt-3 text-xs font-mono text-amber-500 hover:underline"
                >
                  {t("resetFilters")}
                </button>
              </div>
            ) : (
              <div className="space-y-10">
                {Object.keys(groupedSignals).map((dateLabel) => (
                  <section key={dateLabel} className="space-y-4">
                    {/* Day Group Header */}
                    <div className="flex items-center space-x-3">
                      <span className="text-xs font-mono font-bold tracking-widest text-[var(--text-muted)] uppercase bg-[var(--bg-card)] px-2.5 py-1 rounded border border-[var(--border-card)] shadow-xs">
                        {dateLabel}
                      </span>
                      <div className="h-px flex-1 bg-[var(--border-card)]"></div>
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
          <div>
            <WeeklyView signals={signals} />
            <NewsletterBanner />
          </div>
        )}

        {/* About / Manifesto View */}
        {activeTab === "about" && <AboutView />}
      </main>

      <Footer />
    </div>
  );
}
