import fs from "fs";
import path from "path";
import { XMLParser } from "fast-xml-parser";
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

let cachedGeminiModel: string | null = null;

async function resolveGeminiModel(apiKey: string): Promise<string> {
  if (cachedGeminiModel) return cachedGeminiModel;

  try {
    const listRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`,
      { signal: AbortSignal.timeout(6000) }
    );
    if (listRes.ok) {
      const data = await listRes.json();
      const models = data.models || [];
      // Look for active flash models supporting generateContent
      const flash = models.find(
        (m: { name?: string; supportedGenerationMethods?: string[] }) =>
          m.name &&
          m.name.includes("flash") &&
          Array.isArray(m.supportedGenerationMethods) &&
          m.supportedGenerationMethods.includes("generateContent")
      );
      if (flash && flash.name) {
        const modelId = flash.name.replace("models/", "");
        console.log(`🤖 Auto-discovered active Gemini model: "${modelId}"`);
        cachedGeminiModel = modelId;
        return modelId;
      }
    }
  } catch (err) {
    // ignore
  }

  // Default fallback to gemini-3.8-flash or gemini-1.5-flash
  cachedGeminiModel = "gemini-3.8-flash";
  return cachedGeminiModel;
}

// 3. Evaluation & Synthesis (LLM with Heuristic Fallback)
async function evaluateAndSynthesize(
  candidate: RawCandidate,
  apiKey?: string,
  provider: "gemini" | "openai" = "gemini"
): Promise<SignalItem | null> {
  const cleanTitle = sanitizeText(candidate.title);
  const cleanSummary = sanitizeText(candidate.rawSummary).slice(0, 600);

  // If Gemini API Key is present, call Gemini
  if (apiKey && provider === "gemini") {
    try {
      const targetModel = await resolveGeminiModel(apiKey);
      console.log(`🧠 Synthesizing via ${targetModel}: "${cleanTitle}"...`);
      const prompt = `You are the lead evaluator for FOVEA.SI, an elite publication tracking the emergence of Superintelligence (SI) rather than generic AI tools.
Filter out shallow tool announcements, wrappers, or minor marketing updates.
Focus strictly on:
- Autonomous reasoning, test-time compute, formal self-verification
- Gigawatt-scale power, nuclear restarts, grid interconnection
- Wafer-scale compute, interconnect latency, cluster topology
- State-level sovereign AI, geopolitics of compute
- Foundational architectural compression or efficiency

Analyze this item:
Title: "${cleanTitle}"
Context: "${cleanSummary}"
Source: "${candidate.sourceName}"

Output a JSON object ONLY (no markdown formatting, no backticks):
{
  "isRelevantToSI": boolean,
  "isSignal": boolean (true if genuine paradigm shift),
  "tags": ["REASONING" | "COMPUTE" | "ENERGY" | "MODELS" | "GOVERNANCE" | "INFRASTRUCTURE"],
  "titleEn": "Crisp editorial English title",
  "titleZh": "高穿透力中文标题",
  "summaryEn": "One sentence concise summary in English",
  "summaryZh": "一句话精炼事实摘要",
  "whyItMattersEn": "Why this specifically advances or alters the path to Superintelligence",
  "whyItMattersZh": "一针见血剖析为什么这对通往超智能具有根本性结构意义"
}`;

      let res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${targetModel}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json" },
          }),
        }
      );

      // If 404, fallback to gemini-1.5-flash
      if (res.status === 404 && targetModel !== "gemini-1.5-flash") {
        console.warn(`⚠️  ${targetModel} returned 404, trying fallback: gemini-1.5-flash...`);
        res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: { responseMimeType: "application/json" },
            }),
          }
        );
      }

      if (res.ok) {
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          const parsed = JSON.parse(text);
          if (!parsed.isRelevantToSI) {
            console.log(`  └─ [Gemini Filtered]: Non-SI topic pruned.`);
            return null;
          }

          console.log(`  └─ [Gemini Accepted]: SI-grade signal identified.`);
          return {
            id: `sig-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            title: parsed.titleEn || cleanTitle,
            titleZh: parsed.titleZh || cleanTitle,
            summary: parsed.summaryEn || cleanSummary,
            summaryZh: parsed.summaryZh || cleanSummary,
            whyItMatters: parsed.whyItMattersEn || "Structural pivot in the scaling trajectory toward Superintelligence.",
            whyItMattersZh: parsed.whyItMattersZh || "对通往超智能的底层物理、算法或主权路径构成关键推动。",
            source: {
              name: candidate.sourceName,
              url: candidate.url,
              domain: candidate.domain,
            },
            timestamp: new Date().toISOString(),
            dateLabel: "TODAY",
            dateLabelZh: "今日",
            isSignal: Boolean(parsed.isSignal),
            tags: (parsed.tags || ["MODELS"]) as TagType[],
            weeklyPick: Boolean(parsed.isSignal),
          };
        }
      } else {
        const errText = await res.text();
        console.warn(`⚠️  Gemini API returned status ${res.status}: ${errText.slice(0, 200)}`);
      }
    } catch (err) {
      console.warn("⚠️  LLM API evaluation failed, falling back to heuristic:", (err as Error).message);
    }
  }

  // Fallback Heuristic Classifier (Ensures pipeline ALWAYS works reliably)
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

// 4. Main Autonomous Loop
async function main() {
  console.log("⚡ Starting Fovea Autonomous Ingestion Pipeline (Level 2: AI-Operated)...");
  const apiKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;

  if (apiKey) {
    const masked = apiKey.length > 8 ? `${apiKey.slice(0, 4)}...${apiKey.slice(-4)}` : "***";
    console.log(`🤖 LLM Engine detected: GEMINI_API_KEY is configured (${masked}). Running deep SI synthesis.`);
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

  for (const c of candidates) {
    if (existingUrls.has(c.url.toLowerCase()) || existingTitles.has(c.title.toLowerCase())) {
      continue; // Skip duplicate
    }

    const signal = await evaluateAndSynthesize(c, apiKey);
    if (signal) {
      console.log(`✨ [Accepted Signal]: ${signal.title}`);
      newSignals.push(signal);
      existingUrls.add(c.url.toLowerCase());
      existingTitles.add(c.title.toLowerCase());
    }

    if (newSignals.length >= 3) break; // Keep daily batch focused and high-signal (3-5 items)
  }

  // Smart Upgrade: If no new items but Gemini is active, refine previous heuristic signals lacking Chinese translations
  let refinedCount = 0;
  if (apiKey) {
    for (let i = 0; i < existingSignals.length; i++) {
      const item = existingSignals[i];
      if (item.titleZh === item.title || item.summaryZh === item.summary) {
        console.log(`🔄 Upgrading heuristic signal with Gemini 2.0 Flash: "${item.title}"...`);
        const candidate: RawCandidate = {
          title: item.title,
          url: item.source.url,
          sourceName: item.source.name,
          domain: item.source.domain,
          rawSummary: item.summary,
          publishedAt: item.timestamp,
        };
        const upgraded = await evaluateAndSynthesize(candidate, apiKey);
        if (upgraded) {
          existingSignals[i] = {
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
    console.log(`✨ Successfully upgraded ${refinedCount} existing signals using Gemini 2.0 Flash.`);
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
