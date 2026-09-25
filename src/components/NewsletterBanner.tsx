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
    <section className="my-10 rounded-xl border border-[var(--border-card)] bg-[var(--bg-card)] p-6 sm:p-8 shadow-xs">
      <div className="max-w-xl">
        <div className="flex items-center space-x-2 text-amber-500 font-mono text-xs uppercase tracking-wider mb-2">
          <Mail size={14} />
          <span>{t("newsletterTag")}</span>
        </div>

        <h3 className="text-lg sm:text-xl font-bold text-[var(--text-main)] tracking-tight">
          {t("newsletterTitle")}
        </h3>

        <p className="mt-1.5 text-xs sm:text-sm text-[var(--text-muted)]">
          {t("newsletterDesc")}
        </p>

        {submitted ? (
          <div className="mt-4 flex items-center space-x-2 text-xs font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3">
            <Check size={14} />
            <span>{t("newsletterSuccess")}</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("newsletterPlaceholder")}
              required
              className="flex-1 px-3.5 py-2 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-card)] text-[var(--text-main)] placeholder-[var(--text-dim)] text-xs sm:text-sm focus:outline-none focus:border-amber-500 font-mono transition-colors"
            />
            <button
              type="submit"
              className="flex items-center justify-center space-x-1.5 px-4 py-2 rounded-lg bg-[var(--text-main)] hover:opacity-90 text-[var(--bg-page)] font-medium text-xs sm:text-sm transition-all shadow-xs"
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
