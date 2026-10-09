"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { getSiteSettings } from "@/lib/api";
import { siteConfig } from "@/lib/site";

export function Hero() {
  const [name, setName] = useState(siteConfig.name);
  const [tagline, setTagline] = useState(siteConfig.description);
  const [subtext, setSubtext] = useState(
    "I design and ship full-stack AI products: Django APIs, PostgreSQL + pgvector search, and interfaces that make LLM features feel instant."
  );

  useEffect(() => {
    const controller = new AbortController();
    getSiteSettings(controller.signal)
      .then((s) => {
        if (s.name) setName(s.name);
        if (s.hero_tagline) setTagline(s.hero_tagline);
        if (s.hero_subtext) setSubtext(s.hero_subtext);
      })
      .catch(() => {
        /* keep fallbacks when the API is unavailable */
      });
    return () => controller.abort();
  }, []);

  return (
    <section className="container pb-12 pt-20 sm:pt-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="font-mono text-sm text-neon-teal">// {name} · AI Engineer</p>
        <h1 className="mt-5 max-w-4xl text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
          <span className="text-gradient">{tagline}</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">{subtext}</p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 rounded-xl bg-neon-indigo px-5 py-2.5 text-sm font-medium text-white shadow-glow-indigo transition-transform hover:-translate-y-0.5"
          >
            View case studies <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/experience"
            className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-2.5 text-sm transition-colors hover:border-neon-teal/50 hover:text-neon-teal"
          >
            Experience timeline
          </Link>
        </div>
      </motion.div>
    </section>
  );
}