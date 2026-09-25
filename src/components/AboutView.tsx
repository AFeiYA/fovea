"use client";

import React from "react";
import { Eye, Cpu, Terminal, Sparkles, Layers, CheckCircle2 } from "lucide-react";
import { useApp } from "@/context/AppContext";

export const AboutView: React.FC = () => {
  const { language } = useApp();
  const isZh = language === "zh";

  return (
    <div className="space-y-10 max-w-3xl mx-auto py-4 text-[var(--text-muted)] font-sans leading-relaxed animate-fadeIn">
      {/* Hero Quote */}
      <div className="border-l-3 border-amber-500 pl-4 py-1">
        <blockquote className="text-lg sm:text-xl font-medium text-[var(--text-main)] tracking-tight">
          {isZh
            ? "“智能观测智能之演进——亦包括其自身。”"
            : "“Fovea watches intelligence evolve — including its own.”"}
        </blockquote>
        <p className="text-xs font-mono text-[var(--text-dim)] mt-2 uppercase tracking-wider">
          {isZh ? "— FOVEA 自主演进宣言" : "— The Fovea Autonomous Evolution Manifesto"}
        </p>
      </div>

      {/* The 4-Level Autonomy Roadmap */}
      <section className="space-y-4 p-6 sm:p-7 rounded-xl border border-[var(--border-card)] bg-[var(--bg-card)] shadow-xs">
        <div className="flex items-center space-x-2 text-amber-500 font-mono text-xs uppercase tracking-wider">
          <Layers size={15} />
          <span>{isZh ? "自主演进架构" : "The 4 Levels of Autonomy"}</span>
        </div>
        <h2 className="text-xl font-bold text-[var(--text-main)] tracking-tight">
          {isZh ? "Fovea 的 4 阶自主演化阶梯" : "The Fovea Self-Improvement Roadmap"}
        </h2>
        <p className="text-sm text-[var(--text-muted)]">
          {isZh
            ? "单纯依靠 AI 抓取与摘要并不是超智能。真正的 SI 味道，在于系统能基于结果持续改进自身。Fovea 正在按四级阶梯逐步交出人类干预权："
            : "AI auto-generation alone is not Superintelligence. Genuine SI begins when a system continuously modifies its own operating parameters and code based on observed outcomes. Fovea is progressing across four distinct autonomy phases:"}
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
                ? "由 GitHub Actions 驱动的多源自动雷达：全天候扫描 arXiv、OpenAI、HackerNews，自动过滤注入、提炼双语信号并通过 GitOps 自动提交部署。零手动维护。"
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

      {/* The Metaphor: The Fovea */}
      <section className="space-y-3">
        <div className="flex items-center space-x-2 text-amber-500 font-mono text-xs uppercase tracking-wider">
          <Eye size={15} />
          <span>{isZh ? "生物学隐喻" : "The Biological Metaphor"}</span>
        </div>
        <h2 className="text-xl font-bold text-[var(--text-main)] tracking-tight">
          {isZh ? "为什么取名「FOVEA」？" : "Why “Fovea”?"}
        </h2>
        <p className="text-sm sm:text-base text-[var(--text-muted)]">
          {isZh ? (
            <>
              在人眼中，<strong className="text-[var(--text-main)]">中央凹（Fovea Centralis）</strong>是视网膜正中央直径仅 1.5 毫米的微小凹陷。它仅占视野面积的不到 1%，却聚集了全眼最密集的感光细胞，贡献了 99% 的视觉敏锐度。除了中央凹凝视之处，人类周围 99% 的视野全是模糊的低清余光。
            </>
          ) : (
            <>
              In the human eye, the <strong className="text-[var(--text-main)]">fovea centralis</strong> is a tiny 1.5mm depression in the retina. It accounts for less than 1% of the visual field, yet it is responsible for sharp central vision and contains the highest concentration of cone photoreceptors. The surrounding 99% of our field of view is peripheral blur and low-resolution noise.
            </>
          )}
        </p>
        <p className="text-sm sm:text-base text-[var(--text-muted)]">
          {isZh ? (
            <>
              当下的科技舆论场充斥着数万篇贴着“AI”标签的平庸包装、融资公关与套壳应用。<strong className="text-[var(--text-main)]">FOVEA.SI</strong> 的存在，就是扮演科技视界的中央凹：主动过滤掉 99% 边缘噪点，将全部高清晰度目光聚焦在极少数真正改变人类智能演进形态的核心跃迁上。
            </>
          ) : (
            <>
              The tech industry today is inundated with thousands of press releases, wrapper apps, and breathless funding tweets labeled “AI”. <strong className="text-[var(--text-main)]">FOVEA.SI</strong> exists to act as the cognitive fovea: ignoring 99% of the peripheral blur and bringing acute, high-resolution focus to the tiny fraction of events that actually alter the trajectory of intelligence.
            </>
          )}
        </p>
      </section>

      {/* Why SI, Not AI */}
      <section className="space-y-4 p-6 sm:p-7 rounded-xl border border-[var(--border-card)] bg-[var(--bg-card)] shadow-xs">
        <div className="flex items-center space-x-2 text-red-500 font-mono text-xs uppercase tracking-wider">
          <Cpu size={15} />
          <span>{isZh ? "底层范式演变" : "The Paradigm Shift"}</span>
        </div>
        <h2 className="text-xl font-bold text-[var(--text-main)] tracking-tight">
          {isZh ? "为什么是「SI」，而非「AI」？" : "Why “SI”, Not “AI”?"}
        </h2>
        <p className="text-sm sm:text-base text-[var(--text-muted)]">
          {isZh ? (
            <>
              “AI”描述的是软件工具：写邮件助手、生成图片、日常辅助；而 <strong className="text-amber-500">SI（Super Intelligence / 超智能）</strong> 则代表着文明级力量的四维汇流：
            </>
          ) : (
            <>
              “AI” described software utilities: autocomplete, image generators, recommender algorithms, and office productivity helpers. <strong className="text-amber-500">SI (Super Intelligence)</strong> describes the epochal convergence of:
            </>
          )}
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-mono">
          <li className="p-3.5 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-subtle)]">
            <span className="text-amber-500 font-bold block mb-1">
              {isZh ? "01 / 自主认知探索" : "01 / AUTONOMOUS COGNITION"}
            </span>
            <span className="text-[var(--text-muted)]">
              {isZh
                ? "模型超越语料反刍，在推理阶段进行自主搜索、形式验证并证明前沿科学猜想。"
                : "Models reasoning, self-verifying, and producing novel mathematics beyond human training bounds."}
            </span>
          </li>
          <li className="p-3.5 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-subtle)]">
            <span className="text-amber-500 font-bold block mb-1">
              {isZh ? "02 / 吉瓦级热力学约束" : "02 / GIGAWATT THERMODYNAMICS"}
            </span>
            <span className="text-[var(--text-muted)]">
              {isZh
                ? "重启退役核电机组、专属零碳基荷发电成为算力扩张的物理铁律瓶颈。"
                : "Power generation, dedicated nuclear restarts, and physical grid capacity as primary binding limits."}
            </span>
          </li>
          <li className="p-3.5 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-subtle)]">
            <span className="text-amber-500 font-bold block mb-1">
              {isZh ? "03 / 晶圆级巨脑织网" : "03 / EXAFLOP CLUSTERS"}
            </span>
            <span className="text-[var(--text-muted)]">
              {isZh
                ? "机柜级高带宽互联消解了内存与网络的边界，集群如同单颗巨型合成大脑。"
                : "Wafer-scale architectures where millions of chips fuse into a unified synthetic neural substrate."}
            </span>
          </li>
          <li className="p-3.5 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-subtle)]">
            <span className="text-amber-500 font-bold block mb-1">
              {isZh ? "04 / 国家级主权博弈" : "04 / SOVEREIGN JURISDICTIONS"}
            </span>
            <span className="text-[var(--text-muted)]">
              {isZh
                ? "算力与能源基建被各国政府直接提升至关乎文明生存的曼哈顿工程高度。"
                : "State-level geopolitical competition where compute supremacy is treated on par with nuclear arsenals."}
            </span>
          </li>
        </ul>
      </section>

      {/* Editorial Principles */}
      <section className="space-y-4">
        <div className="flex items-center space-x-2 text-[var(--text-dim)] font-mono text-xs uppercase tracking-wider">
          <Terminal size={15} />
          <span>{isZh ? "编辑运作标准" : "Editorial Standard"}</span>
        </div>
        <h2 className="text-xl font-bold text-[var(--text-main)] tracking-tight">
          {isZh ? "FOVEA 是如何运转的" : "How Fovea Operates"}
        </h2>

        <div className="space-y-3 text-sm">
          <div className="p-4 rounded-xl border border-[var(--border-card)] bg-[var(--bg-card)]">
            <h3 className="font-semibold text-[var(--text-main)] mb-1">
              {isZh
                ? "1. 广泛扫描，极克制发布 (We scan broadly and publish selectively)"
                : "1. We scan broadly and publish selectively."}
            </h3>
            <p className="text-xs text-[var(--text-muted)]">
              {isZh
                ? "多源智能体每日扫描 arXiv 顶刊、前沿实验室公告与底层芯片硬件发布，严格筛选 1% 真正改变智能形态的质变。"
                : "Multi-source agents scan arXiv papers, lab disclosures, and hardware architectures daily, filtering for the 1% paradigm shifts."}
            </p>
          </div>

          <div className="p-4 rounded-xl border border-[var(--border-card)] bg-[var(--bg-card)]">
            <h3 className="font-semibold text-[var(--text-main)] mb-1">
              {isZh
                ? "2. 强制性的「Why it matters」核心筛选"
                : "2. The mandatory “Why it matters” filter."}
            </h3>
            <p className="text-xs text-[var(--text-muted)]">
              {isZh
                ? "每一条入选内容，都必须给出清晰有力的论断：它到底如何改变或加速了超智能的演进？如果给不出，坚决不发。"
                : "Every item on Fovea includes a clear structural synthesis: how does this advance or redirect the trajectory towards Superintelligence?"}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
