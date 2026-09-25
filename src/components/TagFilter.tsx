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
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded text-[11px] font-mono tracking-wider transition-all whitespace-nowrap border shadow-xs ${
              isSelected
                ? "bg-[var(--text-main)] text-[var(--bg-page)] font-bold border-[var(--text-main)]"
                : "bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--text-main)] border-[var(--border-card)] hover:border-[var(--border-strong)]"
            }`}
          >
            <span>{t(`tag_${tag}`)}</span>
            <span
              className={`text-[10px] px-1 py-0.2 rounded-full ${
                isSelected
                  ? "bg-[var(--bg-page)] text-[var(--text-main)] font-semibold"
                  : "bg-[var(--bg-subtle)] text-[var(--text-dim)]"
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
