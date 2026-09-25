export type TagType =
  | "REASONING"
  | "COMPUTE"
  | "ENERGY"
  | "MODELS"
  | "GOVERNANCE"
  | "INFRASTRUCTURE";

export interface SignalItem {
  id: string;
  title: string;
  summary: string;
  whyItMatters: string;
  source: {
    name: string;
    url: string;
    domain: string;
  };
  timestamp: string; // ISO date
  dateLabel: string; // e.g. "TODAY", "YESTERDAY", "SEP 23"
  isSignal: boolean; // Flagged as a major paradigm shift
  tags: TagType[];
  weeklyPick?: boolean; // Highlighted in the weekly recap
}
