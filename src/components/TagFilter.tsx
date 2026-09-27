"use client";

import React from "react";
import { TagType } from "@/types/signal";
import { useApp } from "@/context/AppContext";

interface TagFilterProps {
  selectedTag: TagType | "ALL";
  onSelectTag: (tag: TagType | "ALL") => void;
  tagCounts: Record<string, number>;
}

const TAG_ORDER: (TagType | "ALL")[] = [
  "ALL",
  "REASONING",
  "COMPUTE",
  "ENERGY",
  "MODELS",
  "GOVERNANCE",
  "INFRASTRUCTURE",
];

export const TagFilter: React.FC<TagFilterProps> = ({
  selectedTag,
  onSelectTag,
  tagCounts,
}) => {
  const { t } = useApp();

  return (
    <div className="flex items-center space-x-1.5 overflow-x-auto py-2 scrollbar-none no-scrollbar">
      {TAG_ORDER.map((tag) => {
        const count = tag === "ALL" ? tagCounts["ALL"] || 0 : tagCounts[tag] || 0;
        const isSelected = selectedTag === tag;

        return (
          <button
            key={tag}
            onClick={() => onSelectTag(tag)}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-[11px] font-mono tracking-wider transition-all whitespace-nowrap cursor-pointer ${
              isSelected
                ? "bg-amber-500/20 text-amber-300 ring-1 ring-amber-500/40 font-semibold shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                : "borderless-pill ring-1 ring-white/[0.05] hover:ring-white/[0.12] text-[var(--text-muted)] hover:text-white"
            }`}
          >
            <span>{t(`tag_${tag}`)}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                isSelected
                  ? "bg-amber-500/30 text-amber-200 font-semibold"
                  : "bg-white/[0.04] text-[var(--text-dim)]"
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
};
