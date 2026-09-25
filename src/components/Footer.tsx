"use client";

import React from "react";
import { Rss, Send } from "lucide-react";
import { useApp } from "@/context/AppContext";

export const Footer: React.FC = () => {
  const { t } = useApp();

  return (
    <footer className="mt-auto border-t border-[var(--border-card)] bg-[var(--bg-page)] py-10 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-[var(--border-card)]">
          <div>
            <div className="flex items-center space-x-2 font-mono font-bold text-[var(--text-main)]">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <span>FOVEA.SI</span>
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              {t("footerVision")}
            </p>
          </div>

          <div className="flex items-center space-x-4 text-xs font-mono text-[var(--text-muted)]">
            <a
              href="mailto:signals@fovea.si"
              className="flex items-center space-x-1.5 hover:text-amber-500 transition-colors"
            >
              <Send size={12} />
              <span>{t("footerSubmit")}</span>
            </a>
            <span className="text-[var(--border-strong)]">/</span>
            <a
              href="#rss"
              onClick={(e) => {
                e.preventDefault();
                alert("RSS feed generated at /feed.xml");
              }}
              className="flex items-center space-x-1.5 hover:text-amber-500 transition-colors"
            >
              <Rss size={12} />
              <span>{t("footerRss")}</span>
            </a>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] font-mono text-[var(--text-dim)]">
          <p>© {new Date().getFullYear()} FOVEA.SI. All rights reserved.</p>
          <p>{t("footerScanBroadly")}</p>
        </div>
      </div>
    </footer>
  );
};
