"use client";

import React from "react";
import { Eye, ShieldAlert, Cpu, Sparkles, Terminal } from "lucide-react";

export const AboutView: React.FC = () => {
  return (
    <div className="space-y-10 max-w-3xl mx-auto py-4 text-zinc-300 font-sans leading-relaxed animate-fadeIn">
      {/* Hero Quote */}
      <div className="border-l-2 border-amber-500 pl-4 py-1">
        <blockquote className="text-lg sm:text-xl font-medium text-zinc-100 tracking-tight">
          &ldquo;Not everything that happens in AI matters. Fovea tracks what might.&rdquo;
        </blockquote>
        <p className="text-xs font-mono text-zinc-500 mt-2 uppercase tracking-wider">
          — The Fovea Editorial Stance
        </p>
      </div>

      {/* The Metaphor: The Fovea */}
      <section className="space-y-3">
        <div className="flex items-center space-x-2 text-amber-500 font-mono text-xs uppercase tracking-wider">
          <Eye size={15} />
          <span>The Biological Metaphor</span>
        </div>
        <h2 className="text-xl font-bold text-zinc-100 tracking-tight">
          Why &ldquo;Fovea&rdquo;?
        </h2>
        <p className="text-sm sm:text-base text-zinc-300">
          In the human eye, the <strong className="text-zinc-100">fovea centralis</strong> is a tiny 1.5mm depression in the retina. It accounts for less than 1% of the visual field, yet it is responsible for sharp central vision and contains the highest concentration of cone photoreceptors. The surrounding 99% of our field of view is peripheral blur and low-resolution noise.
        </p>
        <p className="text-sm sm:text-base text-zinc-400">
          The tech industry today is inundated with thousands of press releases, wrapper apps, and breathless funding tweets labeled &ldquo;AI&rdquo;. <strong className="text-zinc-200">FOVEA.SI</strong> exists to act as the cognitive fovea: ignoring 99% of the peripheral blur and bringing acute, high-resolution focus to the tiny fraction of events that actually alter the trajectory of intelligence.
        </p>
      </section>

      {/* Why SI, Not AI */}
      <section className="space-y-3 p-6 rounded-xl border border-zinc-850 bg-zinc-900/30">
        <div className="flex items-center space-x-2 text-red-400 font-mono text-xs uppercase tracking-wider">
          <Cpu size={15} />
          <span>The Paradigm Shift</span>
        </div>
        <h2 className="text-xl font-bold text-zinc-100 tracking-tight">
          Why &ldquo;SI&rdquo;, Not &ldquo;AI&rdquo;?
        </h2>
        <p className="text-sm sm:text-base text-zinc-300">
          The inspiration stems from an increasingly prevalent realization—recently highlighted across geopolitical and technical arenas—that the term &ldquo;Artificial Intelligence&rdquo; has been outgrown.
        </p>
        <p className="text-sm sm:text-base text-zinc-300">
          &ldquo;AI&rdquo; described software utilities: autocomplete, image generators, recommender algorithms, and office productivity helpers. <strong className="text-amber-400">SI (Super Intelligence)</strong> describes the epochal convergence of:
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-mono text-zinc-300">
          <li className="p-3 rounded bg-zinc-950/80 border border-zinc-800">
            <span className="text-amber-400 font-bold block mb-1">01 / AUTONOMOUS COGNITION</span>
            Models reasoning, self-verifying, and producing novel mathematics beyond human training bounds.
          </li>
          <li className="p-3 rounded bg-zinc-950/80 border border-zinc-800">
            <span className="text-amber-400 font-bold block mb-1">02 / GIGAWATT THERMODYNAMICS</span>
            Power generation, dedicated nuclear restarts, and physical grid capacity as primary binding limits.
          </li>
          <li className="p-3 rounded bg-zinc-950/80 border border-zinc-800">
            <span className="text-amber-400 font-bold block mb-1">03 / EXAFLOP CLUSTERS</span>
            Wafer-scale architectures where millions of chips fuse into a unified synthetic neural substrate.
          </li>
          <li className="p-3 rounded bg-zinc-950/80 border border-zinc-800">
            <span className="text-amber-400 font-bold block mb-1">04 / SOVEREIGN JURISDICTIONS</span>
            State-level geopolitical competition where compute supremacy is treated on par with nuclear arsenals.
          </li>
        </ul>
      </section>

      {/* Editorial Principles */}
      <section className="space-y-4">
        <div className="flex items-center space-x-2 text-zinc-400 font-mono text-xs uppercase tracking-wider">
          <Terminal size={15} />
          <span>Editorial Standard</span>
        </div>
        <h2 className="text-xl font-bold text-zinc-100 tracking-tight">
          How Fovea Operates
        </h2>

        <div className="space-y-3 text-sm text-zinc-300">
          <div className="p-4 rounded-lg border border-zinc-800/80 bg-zinc-950">
            <h3 className="font-semibold text-zinc-100 mb-1">
              1. We scan broadly and publish selectively.
            </h3>
            <p className="text-xs text-zinc-400">
              We monitor lab disclosures, arXiv preprints, government regulatory filings, grid interconnection requests, and hardware architecture drops. But we only publish what genuinely matters.
            </p>
          </div>

          <div className="p-4 rounded-lg border border-zinc-800/80 bg-zinc-950">
            <h3 className="font-semibold text-zinc-100 mb-1">
              2. The mandatory &ldquo;Why it matters&rdquo; filter.
            </h3>
            <p className="text-xs text-zinc-400">
              Every item on Fovea includes a clear structural synthesis: how does this advance or redirect the trajectory towards Superintelligence? If there is no clear answer, it does not get published.
            </p>
          </div>

          <div className="p-4 rounded-lg border border-zinc-800/80 bg-zinc-950">
            <h3 className="font-semibold text-zinc-100 mb-1">
              3. Human curation over automated noise.
            </h3>
            <p className="text-xs text-zinc-400">
              While AI helps index and summarize signals across the web, every single item published on fovea.si is personally reviewed and confirmed. No unchecked firehoses.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
