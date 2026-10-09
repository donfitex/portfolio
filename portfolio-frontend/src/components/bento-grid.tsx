"use client";

import { motion } from "framer-motion";
import { Atom, BrainCircuit, Cloud, Database, Search, type LucideIcon } from "lucide-react";
import { GlowCard } from "@/components/glow-card";

interface Cell {
  title: string;
  blurb: string;
  icon: LucideIcon;
  span: string;
  iconClass: string;
  stack: string[];
}

const CELLS: Cell[] = [
  {
    title: "Django + PostgreSQL Infrastructure",
    blurb:
      "Modular DRF APIs on PostgreSQL, tuned with indexes, query optimization, and caching for predictable latency at scale.",
    icon: Database,
    span: "md:col-span-4",
    iconClass: "text-neon-teal",
    stack: ["Django 5", "DRF", "PostgreSQL", "Query tuning", "Redis caching", "Celery"],
  },
  {
    title: "LLM Orchestration",
    blurb: "RAG pipelines, prompt design, and model integrations behind clean service boundaries.",
    icon: BrainCircuit,
    span: "md:col-span-2",
    iconClass: "text-neon-indigo",
    stack: ["RAG", "Prompting", "Embeddings", "Hugging Face"],
  },
  {
    title: "React Craftsmanship",
    blurb: "Typed, accessible interfaces with motion that makes AI features feel responsive.",
    icon: Atom,
    span: "md:col-span-2",
    iconClass: "text-neon-indigo",
    stack: ["Next.js 14", "TypeScript", "Tailwind", "Framer Motion"],
  },
  {
    title: "Semantic Search",
    blurb: "Vector similarity inside the database with pgvector, so search stays next to the data.",
    icon: Search,
    span: "md:col-span-2",
    iconClass: "text-neon-teal",
    stack: ["pgvector", "Cosine distance", "Ranking"],
  },
  {
    title: "Ship It Free",
    blurb: "Production deploys on generous free tiers, with environment-driven config.",
    icon: Cloud,
    span: "md:col-span-2",
    iconClass: "text-neon-teal",
    stack: ["Neon", "Render", "Netlify", "Git"],
  },
];

export function BentoGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-6">
      {CELLS.map((cell, i) => (
        <motion.div
          key={cell.title}
          className={cell.span}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4, delay: i * 0.06 }}
        >
          <GlowCard className="h-full p-6">
            <cell.icon className={`h-6 w-6 ${cell.iconClass}`} />
            <h3 className="mt-4 text-lg font-semibold">{cell.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{cell.blurb}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {cell.stack.map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-border bg-muted/40 px-2.5 py-0.5 font-mono text-xs text-muted-foreground"
                >
                  {s}
                </span>
              ))}
            </div>
          </GlowCard>
        </motion.div>
      ))}
    </div>
  );
}