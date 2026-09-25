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
      {/* Weekly Executive Summary */}
      <div className="rounded-xl border border-[var(--border-card)] bg-[var(--bg-card)] p-6 sm:p-7 shadow-xs">
        <div className="flex items-center space-x-2 text-amber-500 font-mono text-xs uppercase tracking-wider mb-2">
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

        <p className="mt-3 text-sm text-[var(--text-muted)] leading-relaxed">
          {isZh
            ? "过去七天的重大突破证明，「AI」这一传统软件词汇已彻底不足以定义当前的演进烈度。当测试期算力扩展定律在前沿实验室中解锁了自主自我纠错的深层逻辑推理，算力的核心制约已不可逆转地撞向物理与地缘世界的实体边界：核电机组重启专属直供算力集群，全球顶层政要亦将超算建设直接定调为关乎文明主权的生存基石。"
            : "The past seven days proved that the term 'AI' has officially been outgrown. While frontier labs demonstrated that test-time compute unlocks genuine self-correcting mathematical reasoning, the primary bottleneck has shifted irrevocably to the physical world: nuclear power plants recommissioned for clusters, and national leadership framing computation as sovereign state survival."}
        </p>

        <div className="mt-5 pt-4 border-t border-[var(--border-card)] flex items-center justify-between text-xs text-[var(--text-dim)] font-mono">
          <span>
            {weeklyPicks.length}{" "}
            {isZh ? "个本周关键转折点已收录" : "critical inflection points this week"}
          </span>
          <span>{isZh ? "FOVEA 编辑部精选" : "Curated by Fovea Editorial"}</span>
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
              className="flex items-start space-x-4 p-5 rounded-xl border border-[var(--border-card)] bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] transition-all shadow-xs"
            >
              <span className="text-lg font-mono font-bold text-[var(--text-dim)] select-none pt-0.5">
                0{idx + 1}
              </span>

              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1.5">
                  {item.isSignal && (
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/30">
                      {t("signalBadge")}
                    </span>
                  )}
                  <span className="text-[11px] font-mono text-[var(--text-dim)]">
                    {item.source.name}
                  </span>
                </div>

                <h4 className="text-sm sm:text-base font-semibold text-[var(--text-main)] hover:text-amber-500 transition-colors">
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

                <p className="mt-1.5 text-xs sm:text-sm text-[var(--text-muted)] line-clamp-2">
                  {summary}
                </p>

                <div className="mt-3 text-xs leading-relaxed fovea-why-box p-2.5 rounded-lg border-l-2 border">
                  <span className="font-semibold text-amber-600 dark:text-amber-400 font-mono">
                    {isZh ? "SI 跃迁核心：" : "SI Pivot: "}
                  </span>
                  <span className="text-[var(--text-main)]">{whyItMatters}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
