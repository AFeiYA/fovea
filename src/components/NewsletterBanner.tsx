"use client";

import React, { useState } from "react";
import { Mail, Check, ArrowRight } from "lucide-react";

export const NewsletterBanner: React.FC = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes("@")) {
      setSubmitted(true);
      // In MVP, we store in localStorage or log, ready to plug into Beehiiv/Resend/ConvertKit
      try {
        const subs = JSON.parse(localStorage.getItem("fovea_subscribers") || "[]");
        subs.push({ email, date: new Date().toISOString() });
        localStorage.setItem("fovea_subscribers", JSON.stringify(subs));
      } catch (err) {
        // ignore
      }
    }
  };

  return (
    <section className="my-10 rounded-xl border border-zinc-800 bg-gradient-to-r from-zinc-900/90 via-zinc-900/50 to-zinc-950 p-6 sm:p-8">
      <div className="max-w-xl">
        <div className="flex items-center space-x-2 text-amber-500 font-mono text-xs uppercase tracking-wider mb-2">
          <Mail size={14} />
          <span>The Weekly Signal</span>
        </div>

        <h3 className="text-lg sm:text-xl font-bold text-zinc-100 tracking-tight">
          Delivered every Sunday. Zero fluff.
        </h3>

        <p className="mt-1.5 text-xs sm:text-sm text-zinc-400">
          The 5 critical inflection points shaping the transition to Superintelligence, delivered straight to your inbox.
        </p>

        {submitted ? (
          <div className="mt-4 flex items-center space-x-2 text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 rounded-lg p-3">
            <Check size={14} />
            <span>You&apos;re on the list. The next signal deploys Sunday 08:00 UTC.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email..."
              required
              className="flex-1 px-3.5 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 placeholder-zinc-500 text-xs sm:text-sm focus:outline-none focus:border-amber-500/80 transition-colors font-mono"
            />
            <button
              type="submit"
              className="flex items-center justify-center space-x-1.5 px-4 py-2 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 font-medium text-xs sm:text-sm transition-all shadow hover:shadow-amber-500/10"
            >
              <span>Subscribe</span>
              <ArrowRight size={13} />
            </button>
          </form>
        )}
      </div>
    </section>
  );
};
