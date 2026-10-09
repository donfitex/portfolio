"use client";

import { useEffect, useRef, useState } from "react";
import { getProjects, ADMIN_URL } from "@/lib/api";
import { CATEGORY_FILTERS, type Project } from "@/lib/types";
import { CaseStudyCard } from "@/components/case-study-card";
import { ErrorBlock, LoadingBlock } from "@/components/status-views";
import { cn } from "@/lib/utils";

type Status = "loading" | "ready" | "error";

export function ProjectsExplorer() {
  const [category, setCategory] = useState("all");
  const [projects, setProjects] = useState<Project[]>([]);
  const [status, setStatus] = useState<Status>("loading");
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const hashHandled = useRef(false);

  useEffect(() => {
    const controller = new AbortController();
    setStatus("loading");
    getProjects(category, controller.signal)
      .then((data) => {
        setProjects(data);
        setStatus("ready");
      })
      .catch((err) => {
        if (err.name !== "AbortError") setStatus("error");
      });
    return () => controller.abort();
  }, [category, reloadKey]);

  // Deep link: /projects#some-slug opens that card once
  useEffect(() => {
    if (status !== "ready" || hashHandled.current) return;
    hashHandled.current = true;
    const slug = decodeURIComponent(window.location.hash.slice(1));
    if (slug && projects.some((p) => p.slug === slug)) {
      setOpenSlug(slug);
      setTimeout(() => document.getElementById(slug)?.scrollIntoView({ behavior: "smooth", block: "center" }), 150);
    }
  }, [status, projects]);

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter projects by category">
        {CATEGORY_FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setCategory(f.value)}
            aria-pressed={category === f.value}
            className={cn(
              "rounded-full border px-4 py-1.5 font-mono text-xs transition-colors",
              category === f.value
                ? "border-neon-indigo/60 bg-neon-indigo/15 text-foreground shadow-glow-indigo"
                : "border-border text-muted-foreground hover:border-neon-teal/40 hover:text-foreground"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {status === "loading" && <LoadingBlock label="Fetching projects from Django…" />}
        {status === "error" && <ErrorBlock onRetry={() => setReloadKey((k) => k + 1)} />}

        {status === "ready" && projects.length === 0 && (
          <p className="py-12 text-sm text-muted-foreground">
            No projects here yet. Add one in the{" "}
            <a href={ADMIN_URL} target="_blank" rel="noopener noreferrer" className="text-neon-teal underline">
              Django admin
            </a>
            .
          </p>
        )}

        {status === "ready" && projects.length > 0 && (
          <div className="grid gap-4">
            {projects.map((p) => (
              <CaseStudyCard
                key={p.slug}
                project={p}
                open={openSlug === p.slug}
                onToggle={() => setOpenSlug((cur) => (cur === p.slug ? null : p.slug))}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}