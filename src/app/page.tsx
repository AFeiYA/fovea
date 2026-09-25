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
import { Search, SlidersHorizontal, Flame } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"latest" | "signals" | "weekly" | "about">("latest");
  const [selectedTag, setSelectedTag] = useState<TagType | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

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

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesSummary = item.summary.toLowerCase().includes(q);
        const matchesWhy = item.whyItMatters.toLowerCase().includes(q);
        const matchesSource = item.source.name.toLowerCase().includes(q);
        if (!matchesTitle && !matchesSummary && !matchesWhy && !matchesSource) {
          return false;
        }
      }

      return true;
    });
  }, [signals, activeTab, selectedTag, searchQuery]);

  // Group filtered signals by dateLabel
  const groupedSignals = useMemo(() => {
    const groups: { [key: string]: SignalItem[] } = {};
    filteredSignals.forEach((item) => {
      if (!groups[item.dateLabel]) {
        groups[item.dateLabel] = [];
      }
      groups[item.dateLabel].push(item);
    });
    return groups;
  }, [filteredSignals]);

  const dateOrder = ["TODAY", "YESTERDAY", "SEP 23", "SEP 22"];

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100 selection:bg-amber-500/20 selection:text-amber-200">
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
            <div className="space-y-3 pb-2 border-b border-zinc-900">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Filter signals (e.g. o1, nuclear, compute)..."
                    className="w-full pl-9 pr-4 py-1.5 rounded-lg bg-zinc-900/80 border border-zinc-800 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-700 font-mono transition-colors"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-zinc-500 hover:text-zinc-300"
                    >
                      CLEAR
                    </button>
                  )}
                </div>

                {activeTab === "signals" && (
                  <div className="flex items-center space-x-2 text-xs font-mono text-red-400 bg-red-950/40 border border-red-900/40 px-3 py-1.5 rounded-lg self-start sm:self-auto">
                    <Flame size={13} className="text-red-500" />
                    <span>Filtering: Major Paradigm Shifts Only</span>
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
              <div className="text-center py-16 border border-dashed border-zinc-800 rounded-xl bg-zinc-900/20">
                <p className="text-sm font-mono text-zinc-400">
                  No signals match the current filters.
                </p>
                <button
                  onClick={() => {
                    setSelectedTag("ALL");
                    setSearchQuery("");
                  }}
                  className="mt-3 text-xs font-mono text-amber-500 hover:underline"
                >
                  Reset all filters
                </button>
              </div>
            ) : (
              <div className="space-y-10">
                {Object.keys(groupedSignals).map((dateLabel) => (
                  <section key={dateLabel} className="space-y-4">
                    {/* Day Group Header */}
                    <div className="flex items-center space-x-3">
                      <span className="text-xs font-mono font-bold tracking-widest text-zinc-400 uppercase bg-zinc-900 px-2.5 py-1 rounded border border-zinc-800">
                        {dateLabel}
                      </span>
                      <div className="h-px flex-1 bg-zinc-850"></div>
                      <span className="text-[11px] font-mono text-zinc-600">
                        {groupedSignals[dateLabel].length} signals
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
