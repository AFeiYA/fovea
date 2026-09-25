# FOVEA.SI

> **Superintelligence, observed by intelligence.**  
> *Fovea watches intelligence evolve — including its own.*

[![Autonomous Pipeline](https://img.shields.io/badge/Autonomy-Level%202%20(AI--Operated)-amber?style=flat-square)](https://fovea.si)
[![Next.js](https://img.shields.io/badge/Next.js-16%20(Turbopack)-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-zinc?style=flat-square)](LICENSE)

---

## 👁️ What is FOVEA.SI?

**FOVEA.SI** is an autonomous, AI-native publication tracking the emergence of **Super Intelligence (SI)**.

In the human eye, the **Fovea Centralis** is a tiny 1.5mm depression in the retina. It accounts for less than 1% of the visual field, yet delivers 99% of visual acuity. The surrounding 99% is peripheral blur. 

In an era saturated by generic "AI" noise, wrapper apps, and marketing hype, **FOVEA filters out 99% of the peripheral blur to bring razor-sharp central focus to the 1% structural inflection points shaping the path to Superintelligence.**

Crucially, **Fovea is not just reporting on Superintelligence — it is an open public experiment in building an autonomous publication that gradually learns to operate and improve itself.**

---

## 🧬 The 4-Level Autonomy Roadmap

```text
Level 1 [Completed]   ──► Level 2 [ACTIVE NOW]   ──► Level 3 [In Design]   ──► Level 4 [Vision]
  AI-Assisted               AI-Operated                Self-Optimizing           Recursive Self-Improvement
  (Human gatekeeper)        (GitOps + LLM Radar)       (Feedback Loops)          (Agent rewrites its code)
```

| Level | Milestone | Status | Description |
| :--- | :--- | :---: | :--- |
| **Level 1** | **AI-Assisted** | ✅ Completed | AI scrapes, summarizes, and classifies; human editor conducts final approval. |
| **Level 2** | **AI-Operated** | 🟢 **ACTIVE** | Multi-source radar autonomously scans arXiv/HuggingFace, lab announcements, and compute disclosures; sanitizes against prompt injections; synthesizes bilingual signals; and commits to Git via GitHub Actions. **Zero manual overhead.** |
| **Level 3** | **Self-Optimizing** | 🟡 In Design | Closed-loop feedback: agent evaluates reader retention and backtests 3-to-6-month predictive accuracy, dynamically updating source weights, taxonomy, and prompt strategies. |
| **Level 4** | **Recursive Self-Improvement** | 🟣 Target | The Agent diagnoses algorithmic bottlenecks in its own repo, generates branch patches, executes benchmark regressions, and autonomously merges validated PRs. |

---

## ⚡ Autonomous Ingestion Architecture (Level 2)

```text
Frontier Sources (HuggingFace Papers, OpenAI RSS, arXiv, Hacker News Compute Stream)
                                      ↓
                     Prompt-Injection Sanitizer
                                      ↓
                 SI Evaluator Agent (Gemini 2.0 Flash / Heuristic)
    [Filters generic AI tools; Extracts Reasoning, Compute, Energy, Governance signals]
                                      ↓
                   Bilingual Synthesis (EN / 中文)
            [Title + 1-Sentence Summary + Why It Matters for SI]
                                      ↓
                GitOps Commit (GitHub Actions @ 06:00 UTC)
                                      ↓
                 Instant Global Edge Deployment (Vercel CDN)
```

---

## 💎 Key Features

* **High-Acuity Signal Feed**: Grouped chronologically by day with concise facts and the mandatory **`Why it matters for SI`** deep-synthesis block.
* **🔴 SIGNAL Paradigm Shift Badges**: Pulsing indicator for landmark architectural or physical inflections.
* **Full Bilingual Support (EN / 中文)**: Instant zero-latency switching between English and Chinese across all UI elements, articles, and analyses.
* **Dynamic Theme Switcher**: Immersive dark graphite mode default with smooth high-contrast light mode toggle.
* **Weekly Curated Synthesis**: Executive weekly briefing highlighting the top 5–10 critical pivot points.
* **Weekly Signal Newsletter**: Clean, non-intrusive subscription box for weekly Sunday digests.

---

## 🛠️ Local Development

### 1. Clone & Install
```bash
git clone https://github.com/AFeiYA/fovea.git
cd fovea
npm install
```

### 2. Run the Autonomous Pipeline Manually
You can test the ingestion and curation pipeline at any time:
```bash
# Optional: provide GEMINI_API_KEY or OPENAI_API_KEY for deep LLM synthesis
export GEMINI_API_KEY="your_api_key_here"

npm run pipeline
```

### 3. Run Dev Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

### 4. Build for Production
```bash
npm run build
```

---

## 🌐 Cloud Deployment

The repository is built for seamless deployment on **Vercel** or **Cloudflare Pages**:
* **Root Domain**: `fovea.si`
* **Subdomain**: `www.fovea.si`
* **Framework**: Next.js App Router
* **Build Command**: `npm run build`
* **Output**: `.next`

---

## 📜 Editorial Manifesto

> *“Not everything that happens in AI matters. Fovea tracks what might.”*  
> *“We scan broadly and publish selectively.”*

---

## 📄 License

MIT © [FOVEA.SI](https://fovea.si)
