"use client";

import React from "react";
import { SignalItem } from "@/types/signal";
import { ExternalLink, Sparkles } from "lucide-react";
import { useApp } from "@/context/AppContext";

interface WeeklyViewProps {
  signals: SignalItem[];
}

export const WeeklyView: React.FC<WeeklyViewProps> = ({ signals }) => {
  const { language, t } = useApp();
  const weeklyPicks = signals.filter((s) => s.weeklyPick);

  const isZh = language === "zh";

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Weekly Executive Summary - Borderless Glass */}
      <div className="rounded-3xl borderless-glass ring-1 ring-black/[0.06] dark:ring-white/[0.06] p-6 sm:p-8 backdrop-blur-2xl shadow-[0_16px_40px_-12px_rgba(0,0,0,0.15)] dark:shadow-[0_16px_40px_-12px_rgba(0,0,0,0.5)]">
        <div className="flex items-center space-x-2 text-amber-600 dark:text-amber-400 font-mono text-xs uppercase tracking-wider mb-2">
          <Sparkles size={14} />
          <span>
            {isZh
              ? "第 39 周特辑 · 核心跃迁全景综述"
              : "Week 39 Edition · Curated Synthesis"}
          </span>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-main)] tracking-tight">
          {isZh
            ? "自主推理范式与国家算力主权的大碰撞"
            : "The Collision of Autonomous Reasoning & Sovereign Power"}
        </h2>

        <p className="mt-3 text-sm text-[var(--text-muted)] leading-relaxed font-light">
          {isZh
            ? "过去七天的重大突破证明，「AI」这一传统软件词汇已彻底不足以定义当前的演进烈度。当测试期算力扩展定律在前沿实验室中解锁了自主自我纠错的深层逻辑推理，算力的核心制约已不可逆转地撞向物理与地缘世界的实体边界：核电机组重启专属直供算力集群，全球顶层政要亦将超算建设直接定调为关乎文明主权的生存基石。"
            : "The past seven days proved that the term 'AI' has officially been outgrown. While frontier labs demonstrated that test-time compute unlocks genuine self-correcting mathematical reasoning, the primary bottleneck has shifted irrevocably to the physical world: nuclear power plants recommissioned for clusters, and national leadership framing computation as sovereign state survival."}
        </p>

        <div className="gradient-divider opacity-50 my-5"></div>

        <div className="flex items-center justify-between text-xs text-[var(--text-dim)] font-mono">
          <span>
            {weeklyPicks.length}{" "}
            {isZh ? "个本周关键转折点已收录" : "critical inflection points this week"}
          </span>
          <span className="text-amber-600 dark:text-amber-400 font-medium">{isZh ? "FOVEA 编辑部精选" : "Curated by Fovea Editorial"}</span>
        </div>
      </div>

      {/* Numbered Digest List */}
      <div className="space-y-4">
        <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--text-dim)] px-1">
          {isZh ? "本周核心转折点" : "Essential Weekly Pivots"}
        </h3>

        {weeklyPicks.map((item, idx) => {
          const title = isZh ? item.titleZh || item.title : item.title;
          const summary = isZh ? item.summaryZh || item.summary : item.summary;
          const whyItMatters = isZh
            ? item.whyItMattersZh || item.whyItMatters
            : item.whyItMatters;

          return (
            <div
              key={item.id}
              className="flex items-start space-x-4 p-5 sm:p-6 rounded-2xl borderless-glass ring-1 ring-black/[0.05] dark:ring-white/[0.04] hover:ring-amber-500/30 backdrop-blur-xl transition-all"
            >
              <span className="text-lg font-mono font-bold text-[var(--text-dim)] select-none pt-0.5">
                0{idx + 1}
              </span>

              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1.5">
                  {item.isSignal && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-red-500/10 dark:bg-red-500/15 text-red-600 dark:text-red-400 ring-1 ring-red-500/30 font-semibold">
                      {t("signalBadge")}
                    </span>
                  )}
                  <span className="text-[11px] font-mono text-[var(--text-dim)]">
                    {item.source.name}
                  </span>
                </div>

                <h4 className="text-sm sm:text-base font-semibold text-[var(--text-main)] hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                  <a
                    href={item.source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1.5"
                  >
                    <span>{title}</span>
                    <ExternalLink size={12} className="opacity-60 flex-shrink-0" />
                  </a>
                </h4>

                <p className="mt-1.5 text-xs sm:text-sm text-[var(--text-muted)] line-clamp-2 font-light">
                  {summary}
                </p>

                <div className="mt-3 text-xs leading-relaxed rounded-xl bg-amber-500/[0.04] dark:bg-amber-500/[0.035] ring-1 ring-amber-500/20 p-3 backdrop-blur-md">
                  <span className="font-semibold text-amber-600 dark:text-amber-400 font-mono">
                    {isZh ? "SI 跃迁核心：" : "SI Pivot: "}
                  </span>
                  <span className="text-zinc-800 dark:text-zinc-200">{whyItMatters}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
