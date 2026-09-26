"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { Eye, Sparkles } from "lucide-react";

export const ObserverBriefing: React.FC = () => {
  const { t } = useApp();

  return (
    <div className="relative rounded-xl border border-[var(--border-card)] bg-gradient-to-r from-[var(--bg-card)] via-[var(--bg-card-hover)] to-[var(--bg-card)] p-4 sm:p-5 shadow-xs overflow-hidden">
      <div className="flex items-start space-x-3.5">
        {/* Fovea Reticle Icon with glowing center */}
        <div className="relative w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-lg border border-amber-500/40 bg-zinc-900 shadow-inner mt-0.5">
          <div className="w-5 h-5 border border-zinc-600 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.9)] animate-pulse"></div>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 text-[11px] font-mono tracking-wider text-amber-500 uppercase font-semibold mb-1">
            <Eye size={13} />
            <span>{t("observerBriefingTag")}</span>
            <span className="text-[var(--text-dim)]">·</span>
            <span className="text-[var(--text-dim)] font-normal text-[10px]">
              {new Date().toISOString().split("T")[0]}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-[var(--text-main)] font-sans leading-relaxed">
            {t("observerBriefingText")}
          </p>
        </div>
      </div>
    </div>
  );
};
