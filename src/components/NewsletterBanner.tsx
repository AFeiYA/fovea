"use client";

import React, { useState } from "react";
import { Mail, Check, ArrowRight } from "lucide-react";
import { useApp } from "@/context/AppContext";

export const NewsletterBanner: React.FC = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { t } = useApp();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes("@")) {
      setSubmitted(true);
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
    <section className="my-10 rounded-3xl borderless-glass ring-1 ring-white/[0.06] p-6 sm:p-8 backdrop-blur-2xl shadow-[0_16px_40px_-12px_rgba(0,0,0,0.5)]">
      <div className="max-w-xl">
        <div className="flex items-center space-x-2 text-amber-400 font-mono text-xs uppercase tracking-wider mb-2">
          <Mail size={14} />
          <span>{t("newsletterTag")}</span>
        </div>

        <h3 className="text-lg sm:text-xl font-bold text-[var(--text-main)] tracking-tight">
          {t("newsletterTitle")}
        </h3>

        <p className="mt-1.5 text-xs sm:text-sm text-[var(--text-muted)] font-light">
          {t("newsletterDesc")}
        </p>

        {submitted ? (
          <div className="mt-4 flex items-center space-x-2 text-xs font-mono text-emerald-400 bg-emerald-500/15 ring-1 ring-emerald-500/30 rounded-2xl p-3.5">
            <Check size={14} />
            <span>{t("newsletterSuccess")}</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 flex flex-col sm:flex-row gap-2.5">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("newsletterPlaceholder")}
              required
              className="flex-1 px-4 py-2.5 rounded-full borderless-pill ring-1 ring-white/[0.06] focus:ring-amber-500/40 text-[var(--text-main)] placeholder-[var(--text-dim)] text-xs sm:text-sm font-mono transition-all outline-none"
            />
            <button
              type="submit"
              className="flex items-center justify-center space-x-1.5 px-5 py-2.5 rounded-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold text-xs sm:text-sm font-mono transition-all shadow-[0_0_20px_rgba(245,158,11,0.25)] active:scale-95 cursor-pointer"
            >
              <span>{t("newsletterSubscribe")}</span>
              <ArrowRight size={13} />
            </button>
          </form>
        )}
      </div>
    </section>
  );
};
