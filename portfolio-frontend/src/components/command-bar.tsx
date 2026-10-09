"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Loader2, Search, Sparkles } from "lucide-react";
import { searchProjects } from "@/lib/api";
import type { SearchResult } from "@/lib/types";
import { GlowCard } from "@/components/glow-card";

const EXAMPLES = [
  "Show me something built with vector embeddings",
  "Caching and database optimization",
  "React interfaces with animations",
];

type Status = "idle" | "loading" | "done" | "error";

export function CommandBar() {
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const [query, setQuery] = useState("");
  const [asked, setAsked] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [results, setResults] = useState<SearchResult[]>([]);

  const run = useCallback(async (text: string) => {
    const q = text.trim();
    if (!q) return;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setQuery(q);
    setAsked(q);
    setStatus("loading");
    try {
      const data = await searchProjects(q, controller.signal);
      setResults(data.results);
      setStatus("done");
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      setStatus("error");
    }
  }, []);

  // Ctrl/Cmd + K focuses the bar
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      abortRef.current?.abort();
    };
  }, []);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    run(query);
  };

  return (
    <div className="mx-auto max-w-3xl">
      <form
        onSubmit={onSubmit}
        className="flex items-center gap-3 rounded-xl border border-border bg-card/80 px-4 py-3 backdrop-blur transition-all focus-within:border-neon-indigo/60 focus-within:shadow-glow-indigo"
      >
        <Sparkles className="h-5 w-5 shrink-0 text-neon-teal" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask my portfolio anything, e.g. “projects using vector embeddings”"
          aria-label="Search projects semantically"
          maxLength={200}
          className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground sm:text-base"
        />
        <kbd className="hidden rounded-md border border-border px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground md:block">
          Ctrl K
        </kbd>
        <button
          type="submit"
          disabled={status === "loading" || !query.trim()}
          aria-label="Search"
          className="rounded-xl bg-neon-indigo p-2 text-white transition-opacity disabled:opacity-40"
        >
          {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
        </button>
      </form>

      <div className="mt-3 flex flex-wrap gap-2">
        {EXAMPLES.map((ex) => (
          <button
            key={ex}
            type="button"
            onClick={() => run(ex)}
            className="rounded-full border border-border px-3 py-1 font-mono text-xs text-muted-foreground transition-colors hover:border-neon-teal/50 hover:text-neon-teal"
          >
            {ex}
          </button>
        ))}
      </div>

      <div aria-live="polite" className="mt-6">
        {status === "loading" && (
          <p className="font-mono text-sm text-muted-foreground">
            <span className="text-neon-teal">&gt;</span> embedding query → cosine search over pgvector…
          </p>
        )}

        {status === "error" && (
          <p className="rounded-xl border border-red-500/30 bg-red-500/5 p-3 text-sm text-red-300">
            Search is unavailable right now. Check that the Django server is running.
          </p>
        )}

        {status === "done" && (
          <>
            <p className="mb-3 font-mono text-sm text-muted-foreground">
              <span className="text-neon-teal">&gt;</span> {results.length}{" "}
              {results.length === 1 ? "match" : "matches"} for “{asked}”
            </p>
            {results.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No close matches. Try different keywords, or add projects in the admin.
              </p>
            ) : (
              <ul className="grid gap-3">
                <AnimatePresence>
                  {results.map((r, i) => (
                    <motion.li
                      key={r.slug}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.07, duration: 0.3 }}
                    >
                      <Link href={`/projects#${r.slug}`} className="block">
                        <GlowCard className="p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                              <h3 className="font-semibold">{r.title}</h3>
                              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{r.description}</p>
                            </div>
                            <div className="flex shrink-0 items-center gap-2">
                              <span className="rounded-full bg-neon-teal/10 px-2 py-0.5 font-mono text-xs text-neon-teal">
                                {Math.round(r.relevance * 100)}% match
                              </span>
                              <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                            </div>
                          </div>
                        </GlowCard>
                      </Link>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            )}
          </>
        )}
      </div>
    </div>
  );
}