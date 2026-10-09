"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ExternalLink, Github } from "lucide-react";
import { GlowCard } from "@/components/glow-card";
import { ArchitectureDiagram } from "@/components/architecture-diagram";
import { cn } from "@/lib/utils";
import type { Project } from "@/lib/types";

interface CaseStudyCardProps {
  project: Project;
  open: boolean;
  onToggle: () => void;
}

const labelize = (key: string) => key.replace(/[_-]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

export function CaseStudyCard({ project, open, onToggle }: CaseStudyCardProps) {
  const stack = Array.isArray(project.tech_stack) ? project.tech_stack.map(String) : [];
  const metrics = Object.entries(project.metrics ?? {});
  const signals = [...stack, project.title, project.description, project.category_label].join(" ");
  const panelId = `${project.slug}-panel`;

  return (
    <GlowCard id={project.slug} className="scroll-mt-24">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full items-start gap-4 p-6 text-left"
      >
        <div className="min-w-0 flex-1">
          <span className="rounded-full border border-neon-indigo/30 bg-neon-indigo/10 px-2.5 py-0.5 font-mono text-[11px] text-neon-indigo">
            {project.category_label}
          </span>
          <h3 className="mt-3 text-xl font-semibold">{project.title}</h3>
          <p className={cn("mt-2 text-sm text-muted-foreground", !open && "line-clamp-2")}>{project.description}</p>
          {stack.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {stack.map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-border bg-muted/40 px-2.5 py-0.5 font-mono text-xs text-muted-foreground"
                >
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>
        <ChevronDown
          className={cn(
            "mt-1 h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300",
            open && "rotate-180 text-neon-teal"
          )}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="space-y-6 border-t border-border px-6 pb-6 pt-6">
              {/* Problem vs Solution */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-border bg-muted/20 p-4">
                  <p className="font-mono text-xs uppercase tracking-wider text-neon-indigo">AI Problem Statement</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {project.problem_statement || (
                      <span className="italic">Add a problem statement for this project in the admin.</span>
                    )}
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-muted/20 p-4">
                  <p className="font-mono text-xs uppercase tracking-wider text-neon-teal">Django + UX Solution</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {project.solution || <span className="italic">Add a solution for this project in the admin.</span>}
                  </p>
                </div>
              </div>

              {/* Architecture */}
              <div>
                <p className="mb-3 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  System Architecture
                </p>
                <div className="rounded-xl border border-border bg-background/60 p-4">
                  <ArchitectureDiagram signals={signals} />
                </div>
              </div>

              {/* Metrics */}
              <div>
                <p className="mb-3 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  Performance Metrics
                </p>
                {metrics.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {metrics.map(([key, value]) => (
                      <div key={key} className="rounded-xl border border-border bg-muted/20 p-4">
                        <p className="text-2xl font-semibold text-gradient">{String(value)}</p>
                        <p className="mt-1 font-mono text-xs text-muted-foreground">{labelize(key)}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm italic text-muted-foreground">Add metrics (JSON) for this project in the admin.</p>
                )}
              </div>

              {/* Links */}
              {(project.github_url || project.live_url) && (
                <div className="flex flex-wrap gap-3">
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm transition-colors hover:border-neon-indigo/50"
                    >
                      <Github className="h-4 w-4" /> Source
                    </a>
                  )}
                  {project.live_url && (
                    <a
                      href={project.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl bg-neon-indigo px-4 py-2 text-sm text-white shadow-glow-indigo"
                    >
                      <ExternalLink className="h-4 w-4" /> Live demo
                    </a>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </GlowCard>
  );
}