import { SignalItem } from "@/types/signal";

export const INITIAL_SIGNALS: SignalItem[] = [
  {
    id: "sig-001",
    title: "OpenAI Unveils Test-Time Compute Scaling Laws: Models Deliberate to Solve Unseen PhD-Level Conjectures",
    summary:
      "Empirical results prove that extending inference-time deliberation yields logarithmic performance gains on benchmark frontiers, outpacing brute-force pretraining.",
    whyItMatters:
      "This marks the formal architectural pivot from static next-token prediction to autonomous cognitive exploration. Models are no longer simply regurgitating training distributions; they are navigating problem spaces through self-correction and internal verification—the defining hallmark of proto-Superintelligence.",
    source: {
      name: "OpenAI Research",
      url: "https://openai.com/research",
      domain: "openai.com",
    },
    timestamp: "2026-09-25T14:30:00Z",
    dateLabel: "TODAY",
    isSignal: true,
    tags: ["REASONING", "MODELS"],
    weeklyPick: true,
  },
  {
    id: "sig-002",
    title: "Constellation Energy Inks 20-Year PPA with Microsoft to Reopen Three Mile Island Nuclear Unit 1 for AI Compute",
    summary:
      "An 835-megawatt nuclear plant will be recommissioned exclusively to supply 24/7 carbon-free baseload electricity directly to hyperscale AI clusters.",
    whyItMatters:
      "Superintelligence is colliding with fundamental physics and thermodynamics. Frontier compute is no longer constrained by algorithmic ingenuity or chip manufacturing alone, but by gigawatt-scale power generation. Dedicated nuclear infrastructure establishes compute as critical sovereign physical assets.",
    source: {
      name: "Reuters",
      url: "https://www.reuters.com",
      domain: "reuters.com",
    },
    timestamp: "2026-09-25T11:15:00Z",
    dateLabel: "TODAY",
    isSignal: true,
    tags: ["ENERGY", "COMPUTE"],
    weeklyPick: true,
  },
  {
    id: "sig-003",
    title: "Trump Frames National AI Policy Around 'Super Intelligence (SI)' Supremacy and Accelerated Energy Deregulation",
    summary:
      "In a major policy address, former president explicitly moves beyond 'AI' nomenclature, declaring the era of 'SI' and promising fast-tracked permits for gigawatt power pipelines.",
    whyItMatters:
      "The political lexicon has officially caught up with technological reality: AI is no longer categorized as an enterprise software productivity tool, but as state-level civilizational power. Framing the competition as 'SI' signals that governments view this as a Manhattan Project-scale geopolitical imperative.",
    source: {
      name: "Bloomberg",
      url: "https://www.bloomberg.com",
      domain: "bloomberg.com",
    },
    timestamp: "2026-09-25T08:45:00Z",
    dateLabel: "TODAY",
    isSignal: true,
    tags: ["GOVERNANCE", "ENERGY"],
    weeklyPick: true,
  },
  {
    id: "sig-004",
    title: "First GB200 NVL72 Rack-Scale Systems Begin Hyperscale Deployments, Delivering 1.4 Exaflops of FP4 Compute",
    summary:
      "Liquid-cooled 72-GPU racks operating over a single 130 TB/s NVLink domain transition the cluster from loosely coupled nodes into a unified monolithic computing fabric.",
    whyItMatters:
      "Communication latency between individual chips was the primary bottleneck to training multi-trillion parameter systems. NVLink 5 turns entire data hall racks into a single synthetic brain, dissolving the boundary between internal memory and network interconnect.",
    source: {
      name: "NVIDIA Technical Blog",
      url: "https://developer.nvidia.com/blog",
      domain: "nvidia.com",
    },
    timestamp: "2026-09-24T18:20:00Z",
    dateLabel: "YESTERDAY",
    isSignal: false,
    tags: ["COMPUTE", "INFRASTRUCTURE"],
    weeklyPick: true,
  },
  {
    id: "sig-005",
    title: "Frontier Mathematical Agent Proves Long-Standing Open Combinatorics Lemma in Lean 4 Without Human Hints",
    summary:
      "Using monte-carlo tree search over formalized proof tactics, an autonomous agent generated a verified proof for a 20-year-old conjecture in extremal graph theory.",
    whyItMatters:
      "Superintelligence begins when AI produces novel synthetic science that human mathematicians cannot easily refute or conceive. Verified formal reasoning bridges the trust gap, paving the way for autonomous automated scientific discovery.",
    source: {
      name: "arXiv Formal Math",
      url: "https://arxiv.org",
      domain: "arxiv.org",
    },
    timestamp: "2026-09-24T14:05:00Z",
    dateLabel: "YESTERDAY",
    isSignal: true,
    tags: ["REASONING"],
    weeklyPick: true,
  },
  {
    id: "sig-006",
    title: "DeepSeek Architectures Challenge Closed Frontiers with Multi-Head Latent Attention and High-Throughput FP8 Training",
    summary:
      "Open research paper details architectural modifications that compress KV-cache memory overhead by 80% while retaining full contextual reasoning fidelity.",
    whyItMatters:
      "Demonstrates that the path to SI is not purely an expenditure war of capital expenditure (CapEx). Algorithmic compression and novel attention topologies can unlock radical efficiency, preventing frontier intelligence from becoming an impenetrable closed-monopoly.",
    source: {
      name: "DeepSeek AI",
      url: "https://github.com/deepseek-ai",
      domain: "github.com",
    },
    timestamp: "2026-09-23T16:40:00Z",
    dateLabel: "SEP 23",
    isSignal: false,
    tags: ["MODELS", "COMPUTE"],
    weeklyPick: false,
  },
  {
    id: "sig-007",
    title: "PJM Interconnection Reports Over 40 Gigawatts of Dedicated AI Data Center Grid Queues Across Rust Belt",
    summary:
      "Regional transmission grid operators scramble to accommodate unprecedented industrial load forecasts driven by clustered AI mega-campuses.",
    whyItMatters:
      "The physical geography of intelligence is shifting toward proximity to high-voltage transmission lines, cooling rivers, and nuclear/gas reserves. SI development is reshaping regional infrastructure planning faster than the EV transition.",
    source: {
      name: "Financial Times",
      url: "https://www.ft.com",
      domain: "ft.com",
    },
    timestamp: "2026-09-22T09:10:00Z",
    dateLabel: "SEP 22",
    isSignal: false,
    tags: ["ENERGY", "INFRASTRUCTURE"],
    weeklyPick: false,
  },
];
