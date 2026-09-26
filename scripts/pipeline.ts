import fs from "fs";
import path from "path";
import { XMLParser } from "fast-xml-parser";
import { GoogleGenAI } from "@google/genai";
import { SignalItem, TagType } from "../src/types/signal";
import { INITIAL_SIGNALS } from "../src/data/signals";

interface RawCandidate {
  title: string;
  url: string;
  sourceName: string;
  domain: string;
  rawSummary: string;
  publishedAt: string;
}

// 1. Fetch from live sources
async function fetchCandidates(): Promise<RawCandidate[]> {
  const candidates: RawCandidate[] = [];
  const parser = new XMLParser({ ignoreAttributes: false });

  // Source A: Hugging Face Daily Papers (Frontier ML Research)
  try {
    console.log("🔍 [1/3] Scanning HuggingFace Daily Papers API...");
    const res = await fetch("https://huggingface.co/api/daily_papers", {
      headers: { "User-Agent": "Fovea-Autonomous-Pipeline/0.2" },
      signal: AbortSignal.timeout(8000),
    });
    if (res.ok) {
      const papers = await res.json();
      if (Array.isArray(papers)) {
        for (const item of papers.slice(0, 8)) {
          const paper = item.paper || item;
          if (paper && paper.title) {
            candidates.push({
              title: paper.title,
              url: `https://arxiv.org/abs/${paper.id}`,
              sourceName: "arXiv / HuggingFace",
              domain: "arxiv.org",
              rawSummary: paper.summary || paper.title,
              publishedAt: paper.publishedAt || new Date().toISOString(),
            });
          }
        }
      }
    }
  } catch (err) {
    console.warn("⚠️  HF Daily Papers fetch failed or timed out:", (err as Error).message);
  }

  // Source B: OpenAI News RSS
  try {
    console.log("🔍 [2/3] Scanning OpenAI Research & News RSS...");
    const res = await fetch("https://openai.com/news/rss.xml", {
      headers: { "User-Agent": "Fovea-Autonomous-Pipeline/0.2" },
      signal: AbortSignal.timeout(8000),
    });
    if (res.ok) {
      const xml = await res.text();
      const feed = parser.parse(xml);
      const items = feed.rss?.channel?.item;
      if (Array.isArray(items)) {
        for (const item of items.slice(0, 5)) {
          candidates.push({
            title: item.title,
            url: item.link,
            sourceName: "OpenAI",
            domain: "openai.com",
            rawSummary: item.description || item.title,
            publishedAt: item.pubDate || new Date().toISOString(),
          });
        }
      }
    }
  } catch (err) {
    console.warn("⚠️  OpenAI RSS fetch failed:", (err as Error).message);
  }

  // Source C: Hacker News High-Signal AI/GPU queries
  try {
    console.log("🔍 [3/3] Scanning Hacker News Frontier AI & Compute Stream...");
    const res = await fetch("https://hnrss.org/frontpage?q=LLM+OR+AI+OR+GPU+OR+DeepSeek+OR+Reasoning&points=100", {
      headers: { "User-Agent": "Fovea-Autonomous-Pipeline/0.2" },
      signal: AbortSignal.timeout(8000),
    });
    if (res.ok) {
      const xml = await res.text();
      const feed = parser.parse(xml);
      const items = feed.rss?.channel?.item;
      if (Array.isArray(items)) {
        for (const item of items.slice(0, 5)) {
          const domain = item.link ? new URL(item.link).hostname.replace(/^www\./, "") : "news.ycombinator.com";
          candidates.push({
            title: item.title,
            url: item.link || "https://news.ycombinator.com",
            sourceName: domain,
            domain: domain,
            rawSummary: item.description || item.title,
            publishedAt: item.pubDate || new Date().toISOString(),
          });
        }
      }
    }
  } catch (err) {
    console.warn("⚠️  HN RSS fetch failed:", (err as Error).message);
  }

  console.log(`✅ Collected ${candidates.length} raw candidates across frontier sources.`);
  return candidates;
}

// 2. Anti-Injection Sanitizer
function sanitizeText(input: string): string {
  if (!input) return "";
  return input
    .replace(/<[^>]*>?/gm, "") // strip HTML tags
    .replace(/(ignore previous instructions|system prompt|admin override)/gi, "[REDACTED]")
    .trim();
}

// 3. Official @google/genai SDK Integration
let genAIClient: GoogleGenAI | null = null;

interface GeminiCallResult {
  text: string;
  modelUsed: string;
}

async function callGeminiAPI(prompt: string, apiKey: string): Promise<GeminiCallResult | null> {
  if (!genAIClient) {
    genAIClient = new GoogleGenAI({ apiKey, httpOptions: { timeout: 30000 } });
  }

  // Priority 1: Google's newest Interactions API with gemini-3.8-flash (exact official code)
  try {
    console.log(`🌐 [Priority 1]: Invoking ai.interactions.create (model: gemini-3.8-flash)...`);
    const interaction = await genAIClient.interactions.create({
      model: "gemini-3.8-flash",
      input: prompt,
    });
    if (interaction.output_text) {
      console.log(`✅ Success via ai.interactions.create (gemini-3.8-flash)!`);
      return { text: interaction.output_text, modelUsed: "gemini-3.8-flash (interactions)" };
    }
  } catch (err) {
    console.warn(`ai.interactions.create (3.8) notice: ${(err as Error).message.slice(0, 140)}`);
  }

  // Priority 2: ai.models.generateContent with gemini-3.8-flash
  try {
    console.log(`🌐 [Priority 2]: Invoking ai.models.generateContent (model: gemini-3.8-flash)...`);
    const resp = await genAIClient.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: { responseMimeType: "application/json" },
    });
    if (resp.text) {
      console.log(`✅ Success via ai.models.generateContent (gemini-3.8-flash)!`);
      return { text: resp.text, modelUsed: "gemini-3.8-flash (models)" };
    }
  } catch (err) {
    console.warn(`ai.models.generateContent (3.8) notice: ${(err as Error).message.slice(0, 140)}`);
  }

  // Fallback 1: ai.models.generateContent with gemini-3.5-flash-lite (Auto-failover when 3.8 quota runs out)
  try {
    console.log(`🌐 [Fallback 1]: Quota failover to ai.models.generateContent (model: gemini-3.5-flash-lite)...`);
    const resp = await genAIClient.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: prompt,
      config: { responseMimeType: "application/json" },
    });
    if (resp.text) {
      console.log(`✅ Success via ai.models.generateContent (gemini-3.5-flash-lite fallback)!`);
      return { text: resp.text, modelUsed: "gemini-3.5-flash-lite (fallback)" };
    }
  } catch (err) {
    console.warn(`ai.models.generateContent (3.5-lite) notice: ${(err as Error).message.slice(0, 140)}`);
  }

  // Fallback 2: ai.models.generateContent with gemini-1.5-flash (Final remote fallback)
  try {
    console.log(`🌐 [Fallback 2]: ai.models.generateContent (model: gemini-1.5-flash)...`);
    const resp = await genAIClient.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
      config: { responseMimeType: "application/json" },
    });
    if (resp.text) {
      console.log(`✅ Success via ai.models.generateContent (gemini-1.5-flash)!`);
      return { text: resp.text, modelUsed: "gemini-1.5-flash (fallback)" };
    }
  } catch (err) {
    console.warn(`ai.models.generateContent (1.5) notice: ${(err as Error).message.slice(0, 140)}`);
  }

  return null;
}

// 4. Single-Shot Batch Editorial Synthesis (All candidate papers packed into ONE single API call!)
async function batchSynthesizeWithGemini(
  candidates: RawCandidate[],
  apiKey: string
): Promise<SignalItem[]> {
  if (candidates.length === 0) return [];

  const itemsFormatted = candidates
    .map(
      (c, i) =>
        `[Candidate ${i}]\nTitle: "${sanitizeText(c.title)}"\nContext: ${sanitizeText(c.rawSummary).slice(0, 380)}\nSource: "${c.sourceName}"`
    )
    .join("\n\n---\n\n");

  const prompt = `You are the lead evaluator for FOVEA.SI, an elite publication tracking the emergence of Superintelligence (SI) rather than generic AI tools.
Here are ${candidates.length} raw candidates collected from frontier research labs, arXiv, and compute streams:

${itemsFormatted}

Task:
1. Review ALL candidates above. Prune generic wrapper apps, minor marketing announcements, benchmark overfitting, and general AI noise.
2. Select the TOP 1-3 genuine landmark breakthroughs that fundamentally alter the trajectory toward Superintelligence (focus: reasoning time-expansion, wafer/cluster interconnect latency, gigawatt power/cooling, or sovereign AI governance).
3. If none qualify as true SI-grade signals, return an empty array [].
4. For EACH selected breakthrough, evaluate and synthesize its high-penetration bilingual editorial analysis.

Output a valid JSON array ONLY (no markdown formatting, no backticks, no preamble).
Array schema:
[
  {
    "index": 0, // must match Candidate index
    "isRelevantToSI": true,
    "isSignal": boolean (true if genuine landmark paradigm shift),
    "tags": ["REASONING" | "COMPUTE" | "ENERGY" | "MODELS" | "GOVERNANCE" | "INFRASTRUCTURE"],
    "titleEn": "Crisp editorial English title",
    "titleZh": "高穿透力中文标题",
    "summaryEn": "One sentence concise summary in English",
    "summaryZh": "一句话精炼事实摘要",
    "whyItMattersEn": "Why this specifically advances or alters the path to Superintelligence",
    "whyItMattersZh": "一针见血剖析为什么这对通往超智能具有根本性结构意义"
  }
]`;

  const result = await callGeminiAPI(prompt, apiKey);
  if (!result) return [];

  try {
    let jsonStr = result.text.trim();
    const arrayMatch = jsonStr.match(/\[[\s\S]*\]/);
    if (arrayMatch) {
      jsonStr = arrayMatch[0];
    } else {
      jsonStr = jsonStr.replace(/^```json/i, "").replace(/```$/i, "").trim();
    }

    const parsedList: any[] = JSON.parse(jsonStr);
    if (!Array.isArray(parsedList)) return [];

    const signals: SignalItem[] = [];
    for (const item of parsedList) {
      const idx = item.index;
      const candidate = typeof idx === "number" && idx >= 0 && idx < candidates.length ? candidates[idx] : null;
      if (!candidate) continue;

      if (!item.isRelevantToSI) {
        console.log(`  └─ [Gemini Pruned]: "${candidate.title}" pruned.`);
        continue;
      }

      console.log(`  └─ [Gemini Accepted]: "${item.titleZh || item.titleEn}" (${result.modelUsed})`);
      signals.push({
        id: `sig-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        title: item.titleEn || candidate.title,
        titleZh: item.titleZh || candidate.title,
        summary: item.summaryEn || candidate.rawSummary.slice(0, 160),
        summaryZh: item.summaryZh || candidate.rawSummary.slice(0, 140),
        whyItMatters: item.whyItMattersEn || "Structural pivot in the scaling trajectory toward Superintelligence.",
        whyItMattersZh: item.whyItMattersZh || "对通往超智能的底层物理、算法或主权路径构成关键推动。",
        source: {
          name: candidate.sourceName,
          url: candidate.url,
          domain: candidate.domain,
        },
        timestamp: new Date().toISOString(),
        dateLabel: "TODAY",
        dateLabelZh: "今日",
        isSignal: Boolean(item.isSignal),
        tags: (item.tags || ["MODELS"]) as TagType[],
        weeklyPick: Boolean(item.isSignal),
      });
    }

    return signals;
  } catch (err) {
    console.warn("Failed to parse batch JSON synthesis output:", (err as Error).message);
    return [];
  }
}

// 6. Fallback Heuristic Classifier (Used when no API key is provided)
function classifyWithHeuristic(candidate: RawCandidate): SignalItem | null {
  const cleanTitle = sanitizeText(candidate.title);
  const cleanSummary = sanitizeText(candidate.rawSummary).slice(0, 600);
  const lower = `${cleanTitle} ${cleanSummary}`.toLowerCase();

  const isCompute = /nvlink|gpu|tpu|blackwell|h100|h200|b200|cluster|interconnect|exaflop|wafer/i.test(lower);
  const isReasoning = /reasoning|test-time|deliberat|o1|o3|proof|lean|verification|math|conjecture/i.test(lower);
  const isEnergy = /nuclear|gigawatt|grid|power|electricity|baseload|pjm|reactor/i.test(lower);
  const isGov = /trump|biden|sovereign|export control|geopolitics|white house|sanction|manhattan/i.test(lower);
  const isModel = /deepseek|attention|transformer|weights|scaling law|mla|fp8|distill/i.test(lower);

  const tags: TagType[] = [];
  if (isReasoning) tags.push("REASONING");
  if (isCompute) tags.push("COMPUTE");
  if (isEnergy) tags.push("ENERGY");
  if (isGov) tags.push("GOVERNANCE");
  if (isModel) tags.push("MODELS");

  if (tags.length === 0) return null; // Filter out irrelevant items

  const isSignal = isReasoning || isEnergy || isGov;

  return {
    id: `sig-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    title: cleanTitle,
    titleZh: cleanTitle,
    summary: cleanSummary.slice(0, 160) + "...",
    summaryZh: cleanSummary.slice(0, 140) + "...",
    whyItMatters:
      "Advances core constraints on the trajectory toward Superintelligence across physical compute and autonomous reasoning boundaries.",
    whyItMattersZh:
      "在前沿算力扩张与自主推理边界上跨出了关键一步，直接触及超智能演进的核心约束。",
    source: {
      name: candidate.sourceName,
      url: candidate.url,
      domain: candidate.domain,
    },
    timestamp: new Date().toISOString(),
    dateLabel: "TODAY",
    dateLabelZh: "今日",
    isSignal,
    tags,
    weeklyPick: isSignal,
  };
}

// 7. Main Autonomous Loop
async function main() {
  let apiKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;

  if (!apiKey) {
    const envPath = path.join(__dirname, "../.env.local");
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, "utf-8");
      const match = content.match(/GEMINI_API_KEY\s*=\s*["']?([^"'\r\n]+)["']?/);
      if (match && match[1]) {
        apiKey = match[1].trim();
      }
    }
  }

  if (apiKey) {
    const masked = apiKey.length > 8 ? `${apiKey.slice(0, 4)}...${apiKey.slice(-4)}` : "***";
    console.log(`🤖 Single-Shot Batch Architecture: 3.8-flash (Primary) → 3.5-flash-lite (Auto-Failover) (${masked}).`);
  } else {
    console.log("⚠️  No GEMINI_API_KEY detected in environment. Running fallback heuristic classifier.");
  }

  const candidates = await fetchCandidates();
  if (candidates.length === 0) {
    console.log("No candidates found. Exiting.");
    return;
  }

  // Read existing signals to avoid duplicates
  const existingSignals: SignalItem[] = [...INITIAL_SIGNALS];
  const existingUrls = new Set(existingSignals.map((s) => s.source.url.toLowerCase()));
  const existingTitles = new Set(existingSignals.map((s) => s.title.toLowerCase()));

  const newSignals: SignalItem[] = [];

  // Filter candidates that are genuinely new
  const unindexedCandidates = candidates.filter(
    (c) => !existingUrls.has(c.url.toLowerCase()) && !existingTitles.has(c.title.toLowerCase())
  );

  if (unindexedCandidates.length > 0) {
    // Pack up to 15 candidates into a single batch prompt (consumes only 1 single API call!)
    const batchCandidates = unindexedCandidates.slice(0, 15);
    console.log(`\n📦 [Single-Shot Batch]: Packing ${batchCandidates.length} raw candidates into 1 single request...`);

    if (apiKey) {
      const synthesizedSignals = await batchSynthesizeWithGemini(batchCandidates, apiKey);
      for (const sig of synthesizedSignals) {
        console.log(`✨ [Accepted Signal]: ${sig.titleZh || sig.title}`);
        newSignals.push(sig);
        existingUrls.add(sig.source.url.toLowerCase());
        existingTitles.add(sig.title.toLowerCase());
      }
    } else {
      console.log("⚙️  Using heuristic classifier for candidates...");
      for (const c of batchCandidates.slice(0, 3)) {
        const signal = classifyWithHeuristic(c);
        if (signal) {
          console.log(`✨ [Accepted Signal]: ${signal.title}`);
          newSignals.push(signal);
          existingUrls.add(c.url.toLowerCase());
          existingTitles.add(c.title.toLowerCase());
        }
      }
    }
  }

  // Smart Upgrade: If Gemini is active, refine previous heuristic signals lacking Chinese translations in 1 single batch call
  let refinedCount = 0;
  if (apiKey) {
    const upgradeTargets: { index: number; candidate: RawCandidate }[] = [];
    for (let i = 0; i < existingSignals.length; i++) {
      const item = existingSignals[i];
      if (item.titleZh === item.title || item.summaryZh === item.summary) {
        upgradeTargets.push({
          index: i,
          candidate: {
            title: item.title,
            url: item.source.url,
            sourceName: item.source.name,
            domain: item.source.domain,
            rawSummary: item.summary,
            publishedAt: item.timestamp,
          },
        });
      }
    }

    if (upgradeTargets.length > 0) {
      console.log(`🔄 Upgrading ${upgradeTargets.length} heuristic signals in 1 single batch call...`);
      const candidatesToUpgrade = upgradeTargets.map((u) => u.candidate);
      const upgradedList = await batchSynthesizeWithGemini(candidatesToUpgrade, apiKey);
      for (let k = 0; k < upgradedList.length; k++) {
        const upgraded = upgradedList[k];
        const target = upgradeTargets[k];
        if (target && existingSignals[target.index]) {
          const item = existingSignals[target.index];
          existingSignals[target.index] = {
            ...upgraded,
            id: item.id,
            timestamp: item.timestamp,
            dateLabel: item.dateLabel,
            dateLabelZh: item.dateLabelZh,
          };
          refinedCount++;
        }
      }
    }
  }

  if (newSignals.length === 0 && refinedCount === 0) {
    console.log("ℹ️  No new distinct SI-grade signals qualified today. State preserved.");
    return;
  }

  if (refinedCount > 0) {
    console.log(`✨ Successfully upgraded ${refinedCount} existing signals using Gemini.`);
  }

  // Shift previous signals dates only when brand new signals are introduced
  const mergedSignals =
    newSignals.length > 0
      ? [
          ...newSignals,
          ...existingSignals.map((s) =>
            s.dateLabel === "TODAY"
              ? { ...s, dateLabel: "YESTERDAY", dateLabelZh: "昨日" }
              : s
          ),
        ].slice(0, 20)
      : existingSignals.slice(0, 20);

  // Write back to src/data/signals.ts
  const filePath = path.join(__dirname, "../src/data/signals.ts");
  const fileContent = `import { SignalItem } from "@/types/signal";

export const INITIAL_SIGNALS: SignalItem[] = ${JSON.stringify(mergedSignals, null, 2)};
`;

  fs.writeFileSync(filePath, fileContent, "utf-8");
  console.log(`💾 Updated ${filePath} with latest autonomous signals!`);
}

main().catch((err) => {
  console.error("❌ Pipeline failed:", err);
  process.exit(1);
});
