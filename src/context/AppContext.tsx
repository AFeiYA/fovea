"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Language } from "@/types/signal";

interface AppContextType {
  theme: "dark" | "light";
  toggleTheme: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const DICTIONARY: Record<string, { en: string; zh: string }> = {
  // Brand
  siteName: { en: "FOVEA.SI", zh: "FOVEA.SI" },
  subtitle: {
    en: "Superintelligence, observed by intelligence.",
    zh: "后 AI 时代的高分辨率自主透镜。",
  },
  motto: {
    en: "Fovea watches intelligence evolve — including its own.",
    zh: "智能观测智能之演进——亦包括其自身。",
  },
  radarActive: {
    en: "Autonomous Pipeline: Level 2 (AI-Operated)",
    zh: "自主流水线：Level 2（AI 自治运行）",
  },
  signalsIndexed: {
    en: "signals indexed",
    zh: "条前沿信号已捕获",
  },

  // Nav
  navLatest: { en: "Latest", zh: "最新前沿" },
  navSignals: { en: "Signals", zh: "范式突变" },
  navWeekly: { en: "Weekly", zh: "每周精选" },
  navAbout: { en: "About", zh: "关于 / 自主路线" },

  // Search & Filters
  searchPlaceholder: {
    en: "Filter signals (e.g. o1, nuclear, compute)...",
    zh: "检索信号（如 o1, 核能, 算力, 模型）...",
  },
  clear: { en: "CLEAR", zh: "清除" },
  filteringSignalsOnly: {
    en: "Filtering: Major Paradigm Shifts Only",
    zh: "当前筛选：仅展示底层范式突变",
  },
  noSignals: {
    en: "No signals match the current filters.",
    zh: "暂无符合当前筛选条件的信号。",
  },
  resetFilters: {
    en: "Reset all filters",
    zh: "重置所有筛选",
  },

  // Tags
  tag_ALL: { en: "ALL", zh: "全部" },
  tag_REASONING: { en: "REASONING", zh: "自主推理" },
  tag_COMPUTE: { en: "COMPUTE", zh: "算力架构" },
  tag_ENERGY: { en: "ENERGY", zh: "能源物理" },
  tag_MODELS: { en: "MODELS", zh: "模型算法" },
  tag_GOVERNANCE: { en: "GOVERNANCE", zh: "主权地缘" },
  tag_INFRASTRUCTURE: { en: "INFRASTRUCTURE", zh: "基础设施" },

  // Card
  whyItMatters: {
    en: "Why it matters for SI",
    zh: "对超智能演进的关键意义",
  },
  signalBadge: { en: "SIGNAL", zh: "范式信号" },
  copiedLink: { en: "Link copied", zh: "链接已复制" },

  // Newsletter
  newsletterTag: { en: "The Weekly Signal", zh: "每周信号精粹" },
  newsletterTitle: {
    en: "Delivered every Sunday. Zero fluff.",
    zh: "每周日清晨交付。零废话，零营销。",
  },
  newsletterDesc: {
    en: "The 5 critical inflection points shaping the transition to Superintelligence, delivered straight to your inbox.",
    zh: "每周梳理 5 个真正推动超智能演进的硬核转折点，直达你的邮箱。",
  },
  newsletterPlaceholder: {
    en: "Enter your email...",
    zh: "输入你的邮箱地址...",
  },
  newsletterSubscribe: { en: "Subscribe", zh: "订阅精萃" },
  newsletterSuccess: {
    en: "You're on the list. The next signal deploys Sunday 08:00 UTC.",
    zh: "订阅成功！下一期超智能信号将在周日早晨准时发送。",
  },

  // Footer
  footerVision: {
    en: "An autonomous lens on Superintelligence.",
    zh: "智能观测智能之演进——亦包括其自身。",
  },
  footerSubmit: { en: "Submit Signal", zh: "提供线索" },
  footerRss: { en: "RSS Feed", zh: "RSS 订阅" },
  footerScanBroadly: {
    en: "Scanned broadly. Published selectively.",
    zh: "广泛扫描，极克制发布。",
  },
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [language, setLanguage] = useState<Language>("zh");

  useEffect(() => {
    const savedTheme = localStorage.getItem("fovea_theme") as "dark" | "light" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const initialTheme = prefersDark ? "dark" : "dark";
      setTheme(initialTheme);
      applyTheme(initialTheme);
    }

    const savedLang = localStorage.getItem("fovea_lang") as Language | null;
    if (savedLang === "en" || savedLang === "zh") {
      setLanguage(savedLang);
    } else {
      const isChinese = navigator.language.toLowerCase().startsWith("zh");
      setLanguage(isChinese ? "zh" : "en");
    }
  }, []);

  const applyTheme = (t: "dark" | "light") => {
    const root = document.documentElement;
    if (t === "dark") {
      root.classList.remove("light");
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
      root.classList.add("light");
    }
  };

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("fovea_theme", nextTheme);
    applyTheme(nextTheme);
  };

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("fovea_lang", lang);
  };

  const toggleLanguage = () => {
    const next = language === "en" ? "zh" : "en";
    handleSetLanguage(next);
  };

  const t = (key: string): string => {
    const entry = DICTIONARY[key];
    if (!entry) return key;
    return entry[language] || entry["en"] || key;
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        language,
        setLanguage: handleSetLanguage,
        toggleLanguage,
        t,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
