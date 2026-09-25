"use client";

import React from "react";
import { TagType } from "@/types/signal";

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
  return (
    <div className="flex items-center space-x-1.5 overflow-x-auto py-2 scrollbar-none no-scrollbar">
      {TAG_ORDER.map((tag) => {
        const count = tag === "ALL" ? tagCounts["ALL"] || 0 : tagCounts[tag] || 0;
        const isSelected = selectedTag === tag;

        return (
          <button
            key={tag}
            onClick={() => onSelectTag(tag)}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded text-[11px] font-mono tracking-wider transition-all whitespace-nowrap border ${
              isSelected
                ? "bg-zinc-100 text-zinc-950 font-semibold border-zinc-100 shadow"
                : "bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 border-zinc-800/80 hover:border-zinc-700"
            }`}
          >
            <span>{tag}</span>
            <span
              className={`text-[10px] px-1 py-0.2 rounded-full ${
                isSelected
                  ? "bg-zinc-300 text-zinc-900"
                  : "bg-zinc-800 text-zinc-500"
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
