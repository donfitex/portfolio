"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, MapPin } from "lucide-react";
import { getExperiences } from "@/lib/api";
import type { Experience } from "@/lib/types";
import { GlowCard } from "@/components/glow-card";
import { ErrorBlock, LoadingBlock } from "@/components/status-views";
import { cn } from "@/lib/utils";

type Status = "loading" | "ready" | "error";

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" });

export function ExperienceTimeline() {
  const [items, setItems] = useState<Experience[]>([]);
  const [status, setStatus] = useState<Status>("loading");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setStatus("loading");
    getExperiences(controller.signal)
      .then((data) => {
        setItems(data);
        setStatus("ready");
      })
      .catch((err) => {
        if (err.name !== "AbortError") setStatus("error");
      });
    return () => controller.abort();
  }, [reloadKey]);

  if (status === "loading") return <LoadingBlock label="Fetching experience from Django…" />;
  if (status === "error") return <ErrorBlock onRetry={() => setReloadKey((k) => k + 1)} />;
  if (items.length === 0) {
    return <p className="py-12 text-sm text-muted-foreground">No experience added yet. Add entries in the Django admin.</p>;
  }

  return (
    <ol className="relative ml-3 border-l border-border md:ml-4">
      {items.map((e, i) => (
        <motion.li
          key={e.id}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.3) }}
          className="relative pb-10 pl-8 last:pb-0"
        >
          {/* Timeline node */}
          <span className="absolute -left-[8px] top-6 flex h-3.5 w-3.5">
            {e.current && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neon-teal/60" />}
            <span
              className={cn(
                "relative inline-flex h-3.5 w-3.5 rounded-full border-2 bg-background",
                e.current ? "border-neon-teal shadow-glow-teal" : "border-neon-indigo shadow-glow-indigo"
              )}
            />
          </span>

          <GlowCard className="p-5">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h3 className="text-lg font-semibold">{e.role}</h3>
                <p className="text-sm text-neon-teal">{e.company}</p>
              </div>
              <div className="text-right font-mono text-xs text-muted-foreground">
                <p>
                  {fmt(e.start_date)} – {e.current || !e.end_date ? "Present" : fmt(e.end_date)}
                </p>
                {e.location && (
                  <p className="mt-1 inline-flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {e.location}
                  </p>
                )}
              </div>
            </div>

            {Array.isArray(e.bullet_points) && e.bullet_points.length > 0 && (
              <ul className="mt-4 space-y-2">
                {e.bullet_points.map((b, idx) => (
                  <li key={idx} className="flex gap-2 text-sm text-muted-foreground">
                    <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-neon-indigo" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            )}
          </GlowCard>
        </motion.li>
      ))}
    </ol>
  );
}