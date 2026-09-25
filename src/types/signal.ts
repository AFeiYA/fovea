export type TagType =
  | "REASONING"
  | "COMPUTE"
  | "ENERGY"
  | "MODELS"
  | "GOVERNANCE"
  | "INFRASTRUCTURE";

export type Language = "en" | "zh";

export interface SignalItem {
  id: string;
  title: string;
  titleZh: string;
  summary: string;
  summaryZh: string;
  whyItMatters: string;
  whyItMattersZh: string;
  source: {
    name: string;
    url: string;
    domain: string;
  };
  timestamp: string; // ISO date
  dateLabel: string; // "TODAY", "YESTERDAY", "SEP 23"
  dateLabelZh: string; // "今日", "昨日", "9月23日"
  isSignal: boolean; // Flagged as a major paradigm shift
  tags: TagType[];
  weeklyPick?: boolean; // Highlighted in the weekly recap
}
