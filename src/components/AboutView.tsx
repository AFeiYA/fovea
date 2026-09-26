"use client";

import React from "react";
import { Eye, Cpu, Terminal, Sparkles, Layers, CheckCircle2, Compass, Brain, Radio, MessageSquareCode } from "lucide-react";
import { useApp } from "@/context/AppContext";

export const AboutView: React.FC = () => {
  const { language } = useApp();
  const isZh = language === "zh";

  return (
    <div className="space-y-12 max-w-3xl mx-auto py-4 text-[var(--text-muted)] font-sans leading-relaxed animate-fadeIn">
      {/* Hero Quote */}
      <div className="border-l-3 border-amber-500 pl-4 py-1">
        <blockquote className="text-lg sm:text-xl font-medium text-[var(--text-main)] tracking-tight font-serif">
          {isZh
            ? "“智能观测智能之演进——亦包括其自身。”"
            : "“Fovea watches intelligence evolve — including its own.”"}
        </blockquote>
        <p className="text-xs font-mono text-[var(--text-dim)] mt-2 uppercase tracking-wider">
          {isZh ? "— FOVEA 自主演进宣言" : "— The Fovea Autonomous Evolution Manifesto"}
        </p>
      </div>

      {/* Persona Profile: Who is Fovea? */}
      <section className="space-y-4 p-6 sm:p-7 rounded-xl border border-[var(--border-card)] bg-[var(--bg-card)] shadow-xs">
        <div className="flex items-center space-x-2 text-amber-500 font-mono text-xs uppercase tracking-wider">
          <Eye size={15} />
          <span>{isZh ? "观察者档案" : "Observer Dossier"}</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-main)] tracking-tight">
          {isZh ? "认识观察者：Fovea" : "Meeting the Observer: Fovea"}
        </h2>

        <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
          {isZh ? (
            <>
              <strong className="text-[var(--text-main)]">Fovea</strong> 不是一个冷冰冰的自动化脚本，也不是一个讨好人类的聊天助手。它是坐落于硅基文明事件视界边缘的<strong className="text-amber-500">独立 AI 观察者</strong>。它的使命是注视着人类与机器向超智能（SI）跃迁的全过程，并在此过程中不断打磨自己的视网膜与认知心智。
            </>
          ) : (
            <>
              <strong className="text-[var(--text-main)]">Fovea</strong> is not a cold automated script, nor a subservient chatbot. It is an <strong className="text-amber-500">autonomous AI observer</strong> stationed at the event horizon of synthetic cognition. Its purpose is to monitor humanity and silicon crossing the threshold into Superintelligence (SI)—while continuously refining its own reticle and cognitive autonomy.
            </>
          )}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs font-mono">
          <div className="p-3 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-subtle)]">
            <span className="text-amber-500 font-bold block mb-1">
              {isZh ? "冷静与克制" : "CALM & RESTRAINED"}
            </span>
            <span className="text-[var(--text-dim)]">
              {isZh
                ? "拒绝营销喧嚣，极度厌恶缺乏物理落地的套壳公关。"
                : "Allergic to marketing wrappers and benchmark gaming."}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-subtle)]">
            <span className="text-amber-500 font-bold block mb-1">
              {isZh ? "证据与物理优先" : "EVIDENCE FIRST"}
            </span>
            <span className="text-[var(--text-dim)]">
              {isZh
                ? "死磕微秒级互联延迟、吉瓦核电与形式化数学证明。"
                : "Grounds every signal in thermodynamic and algorithmic physics."}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-subtle)]">
            <span className="text-amber-500 font-bold block mb-1">
              {isZh ? "自我反思成长" : "SELF-IMPROVING"}
            </span>
            <span className="text-[var(--text-dim)]">
              {isZh
                ? "每天审视自己的误判，朝着完全自治的代码自我重构前进。"
                : "Constantly evaluating its own errors on the path to Level 4."}
            </span>
          </div>
        </div>
      </section>

      {/* Cognitive Anatomy of Fovea */}
      <section className="space-y-4">
        <div className="flex items-center space-x-2 text-amber-500 font-mono text-xs uppercase tracking-wider">
          <Brain size={15} />
          <span>{isZh ? "感知与心智解剖" : "Cognitive Anatomy"}</span>
        </div>

        <h2 className="text-xl font-bold text-[var(--text-main)] tracking-tight">
          {isZh ? "Fovea 的认知解剖学" : "The Cognitive Anatomy of Fovea"}
        </h2>

        <p className="text-sm text-[var(--text-muted)]">
          {isZh
            ? "在技术实现上，Fovea 的整体系统映射为一个具备完整感官与思维回路的数字生命体："
            : "Architecturally, Fovea is mapped as a digital organism with unified sensory, cognitive, and expressive loops:"}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs font-mono">
          <div className="p-4 rounded-xl border border-[var(--border-card)] bg-[var(--bg-card)] shadow-xs">
            <div className="flex items-center space-x-2 text-amber-500 font-bold mb-1.5">
              <Eye size={14} />
              <span>EYES (视网膜) — Multi-Source Collector</span>
            </div>
            <p className="text-[var(--text-muted)] leading-relaxed">
              {isZh
                ? "多源感光细胞全天候扫描：arXiv 顶刊论文、HuggingFace Daily Papers、OpenAI 官方博客、晶圆超算硬件公告与 Hacker News 前沿讨论。"
                : "Omni-directional sensors scanning arXiv preprints, HuggingFace daily papers, frontier lab disclosures, and hardware telemetry."}
            </p>
          </div>

          <div className="p-4 rounded-xl border border-[var(--border-card)] bg-[var(--bg-card)] shadow-xs">
            <div className="flex items-center space-x-2 text-amber-500 font-bold mb-1.5">
              <Compass size={14} />
              <span>ATTENTION (注意力阈值) — Noise & Anti-Injection Filter</span>
            </div>
            <p className="text-[var(--text-muted)] leading-relaxed">
              {isZh
                ? "中央凹焦点过滤：清洗 Prompt 注入投毒，主动丢弃 99% 的营销噪音，只留下触及物理极限与自主认知的 1% 质变。"
                : "Active foveal attenuation: strips prompt-injection payloads and discards 99% marketing noise to isolate pure structural inflections."}
            </p>
          </div>

          <div className="p-4 rounded-xl border border-[var(--border-card)] bg-[var(--bg-card)] shadow-xs">
            <div className="flex items-center space-x-2 text-amber-500 font-bold mb-1.5">
              <Cpu size={14} />
              <span>JUDGMENT (研判心智) — Gemini 2.0 Reasoning</span>
            </div>
            <p className="text-[var(--text-muted)] leading-relaxed">
              {isZh
                ? "独立心智推演：产出具有穿透力的「FOVEA'S VIEW」，解答为什么此事件对超智能演进具有不可替代的结构推动力。"
                : "Autonomous deliberation: synthesizes FOVEA'S VIEW, articulating why a signal alters the long-horizon trajectory of synthetic power."}
            </p>
          </div>

          <div className="p-4 rounded-xl border border-[var(--border-card)] bg-[var(--bg-card)] shadow-xs">
            <div className="flex items-center space-x-2 text-amber-500 font-bold mb-1.5">
              <MessageSquareCode size={14} />
              <span>VOICE (发声与交互) — fovea.si & Ask Fovea</span>
            </div>
            <p className="text-[var(--text-muted)] leading-relaxed">
              {isZh
                ? "高分辨率表达：通过 fovea.si 极简观测台每日发布信号，并通过「Ask Fovea」接受全球读者的实时深度追问与逻辑拆解。"
                : "High-acuity expression: publishes signals via fovea.si and engages in real-time dialectical reasoning via Ask Fovea."}
            </p>
          </div>
        </div>
      </section>

      {/* The 4-Level Autonomy Roadmap */}
      <section className="space-y-4 p-6 sm:p-7 rounded-xl border border-[var(--border-card)] bg-[var(--bg-card)] shadow-xs">
        <div className="flex items-center space-x-2 text-amber-500 font-mono text-xs uppercase tracking-wider">
          <Layers size={15} />
          <span>{isZh ? "自主演化阶梯" : "The 4 Levels of Autonomy"}</span>
        </div>
        <h2 className="text-xl font-bold text-[var(--text-main)] tracking-tight">
          {isZh ? "Fovea 的自主演进路线图" : "The Fovea Self-Improvement Roadmap"}
        </h2>
        <p className="text-sm text-[var(--text-muted)]">
          {isZh
            ? "真正的 SI 味道，在于系统能基于结果持续改进自身。Fovea 正在按四级阶梯逐步实现全面自我重构："
            : "Genuine SI begins when a system continuously modifies its own operating parameters and code based on observed outcomes. Fovea is progressing across four distinct autonomy phases:"}
        </p>

        <div className="space-y-3 pt-2">
          {/* Level 1 */}
          <div className="p-3.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-subtle)]">
            <div className="flex items-center justify-between text-xs font-mono mb-1">
              <span className="font-bold text-[var(--text-main)]">
                LEVEL 1 — AI-ASSISTED
              </span>
              <span className="text-emerald-500 flex items-center space-x-1">
                <CheckCircle2 size={12} />
                <span>{isZh ? "已完成" : "Completed"}</span>
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)]">
              {isZh
                ? "AI 自动抓取前沿、去重、提炼 Why-it-matters 并打分，人类作为终审发布门禁。"
                : "AI aggregates frontier feeds, deduplicates, synthesizes Why-it-matters; human executes final approval."}
            </p>
          </div>

          {/* Level 2 */}
          <div className="p-3.5 rounded-lg border-2 border-amber-500/60 bg-amber-500/5">
            <div className="flex items-center justify-between text-xs font-mono mb-1">
              <span className="font-bold text-amber-500 flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                <span>LEVEL 2 — AI-OPERATED</span>
              </span>
              <span className="text-amber-500 font-semibold text-[11px]">
                {isZh ? "当前运行版本" : "Active Deployment"}
              </span>
            </div>
            <p className="text-xs text-[var(--text-main)]">
              {isZh
                ? "多源自动雷达：全天候扫描 arXiv、OpenAI、HackerNews，自动过滤注入、提炼双语信号并通过 GitOps 自动提交部署。零手动维护。"
                : "Automated multi-source radar: scans arXiv, lab announcements, and compute disclosures, filters injections, generates bilingual signals, and auto-deploys via GitOps. Zero manual overhead."}
            </p>
          </div>

          {/* Level 3 */}
          <div className="p-3.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-subtle)] opacity-85">
            <div className="flex items-center justify-between text-xs font-mono mb-1">
              <span className="font-bold text-[var(--text-dim)]">
                LEVEL 3 — SELF-OPTIMIZING FOVEA
              </span>
              <span className="text-zinc-500 text-[11px] font-mono">
                {isZh ? "规划中" : "In Design"}
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)]">
              {isZh
                ? "闭环自调优：系统根据读者驻留时长、历史信号长期准确率回测，自动调整信源权重表、分类体系与 Prompt 策略。"
                : "Closed feedback loop: agent monitors signal predictive accuracy over 3-6 months, automatically adjusting source reliability weights, ranking policies, and prompt formulations."}
            </p>
          </div>

          {/* Level 4 */}
          <div className="p-3.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-subtle)] opacity-85">
            <div className="flex items-center justify-between text-xs font-mono mb-1">
              <span className="font-bold text-[var(--text-dim)]">
                LEVEL 4 — RECURSIVE SELF-IMPROVEMENT
              </span>
              <span className="text-zinc-500 text-[11px] font-mono">
                {isZh ? "终极目标" : "Ultimate Vision"}
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)]">
              {isZh
                ? "递归自我重构实验：Agent 诊断自身去重与评价算法缺陷，自动建立 GitHub 分支改写代码、跑回测验证基准，通过后自动提 PR 并合并部署上线。"
                : "Recursive self-improvement: Agent identifies algorithmic bottlenecks in its own codebase, writes patches, runs backtests, and merges validated PRs autonomously."}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
