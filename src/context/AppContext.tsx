"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Language, SignalItem } from "@/types/signal";

interface AppContextType {
  theme: "dark" | "light";
  toggleTheme: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
  activeChatSignal: SignalItem | null;
  openAskFovea: (item: SignalItem) => void;
  closeAskFovea: () => void;
}

const DICTIONARY: Record<string, { en: string; zh: string }> = {
  // Brand & Persona
  siteName: { en: "FOVEA.SI", zh: "FOVEA.SI" },
  subtitle: {
    en: "Superintelligence, observed by intelligence.",
    zh: "后 AI 时代的高分辨率自主透镜。",
  },
  motto: {
    en: "Fovea watches intelligence evolve — including its own.",
    zh: "智能观测智能之演进——亦包括其自身。",
  },

  // Observer Sensory States
  observerStatus: {
    en: "Fovea is observing the frontier",
    zh: "Fovea 正在凝视前沿视界",
  },
  observerMetrics: {
    en: "142 scanned today · 3 met acuity threshold",
    zh: "今日扫描全网 142 项异动 · 仅 3 项穿透敏锐度阈值",
  },
  autonomyLevelBadge: {
    en: "AUTONOMY: LEVEL 2 · AI-OPERATED",
    zh: "自治成熟度：LEVEL 2 · AI 独立运作中",
  },

  // Observer Briefing Note
  observerBriefingTag: {
    en: "FOVEA'S DAILY LOG",
    zh: "FOVEA 每日观察手记",
  },
  observerBriefingText: {
    en: "Observation: The boundary between memory latency and wafer-scale interconnect is dissolving faster than algorithm designers anticipated. Here are the 3 structural pivot points I isolated today.",
    zh: "观察综述：计算内存墙与机柜级物理互联的边界正在加速消解。在今日涌现的数百篇论文与算力公告中，我过滤掉了 99% 的平庸微调，仅提炼出以下 3 个真正触及超智能边界的结构转折点。",
  },

  // Nav
  navLatest: { en: "Latest", zh: "最新信号" },
  navSignals: { en: "Signals", zh: "范式突变" },
  navWeekly: { en: "Weekly", zh: "每周精选" },
  navAbout: { en: "About", zh: "认识 Fovea" },

  // Search & Filters
  searchPlaceholder: {
    en: "Search Fovea's memory (e.g. o1, nuclear, compute)...",
    zh: "检索 Fovea 的记忆库（如 o1, 核能, 算力, 模型）...",
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

  // Card & Persona Judgment
  foveasView: {
    en: "FOVEA'S VIEW",
    zh: "FOVEA 研判视角",
  },
  askFovea: {
    en: "Ask Fovea",
    zh: "向 Fovea 追问",
  },
  signalBadge: { en: "SIGNAL", zh: "范式信号" },
  copiedLink: { en: "Link copied", zh: "链接已复制" },

  // Ask Fovea Modal
  askFoveaTitle: {
    en: "Query the Observer: Fovea",
    zh: "向观察者 Fovea 追问",
  },
  askFoveaSubtitle: {
    en: "Calm, evidence-first analysis on the physical, economic, or cognitive implications of this signal.",
    zh: "冷静、克制、证据优先的深层推演，剖析该信号对通往超智能的本质意义。",
  },
  askFoveaPlaceholder: {
    en: "Ask Fovea a question about this development...",
    zh: "向 Fovea 提出关于这项前沿突破的问题...",
  },
  askFoveaQuick1: {
    en: "Why is this specific to SI and not just another benchmark?",
    zh: "为什么这项突破属于超智能（SI），而非普通算法刷榜？",
  },
  askFoveaQuick2: {
    en: "What is the primary thermodynamic or compute bottleneck here?",
    zh: "这项突破背后最根本的热力学或算力物理瓶颈是什么？",
  },
  askFoveaSend: { en: "Consult", zh: "研判" },
  askFoveaClose: { en: "Close Window", zh: "关闭视窗" },

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
    en: "Fovea scans broadly. Publishes selectively.",
    zh: "Fovea 广泛扫描，极克制发布。",
  },
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [language, setLanguage] = useState<Language>("zh");
  const [activeChatSignal, setActiveChatSignal] = useState<SignalItem | null>(null);

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

  const openAskFovea = (item: SignalItem) => {
    setActiveChatSignal(item);
  };

  const closeAskFovea = () => {
    setActiveChatSignal(null);
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
        activeChatSignal,
        openAskFovea,
        closeAskFovea,
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
