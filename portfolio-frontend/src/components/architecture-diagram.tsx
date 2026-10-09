"use client";

import { motion } from "framer-motion";

interface NodeDef {
  id: string;
  label: string;
  sub: string;
  x: number;
  y: number;
  color: "indigo" | "teal";
  always?: boolean;
  match?: RegExp;
}

const W = 130;
const H = 48;

const NODES: NodeDef[] = [
  { id: "client", label: "Next.js UI", sub: "React · TypeScript", x: 10, y: 86, color: "indigo", always: true },
  { id: "api", label: "Django REST", sub: "DRF · ViewSets", x: 190, y: 86, color: "indigo", always: true },
  { id: "cache", label: "Redis Cache", sub: "low-latency reads", x: 370, y: 10, color: "teal", match: /redis|cache|memcache/ },
  { id: "db", label: "PostgreSQL", sub: "source of truth", x: 370, y: 86, color: "teal", always: true },
  { id: "vector", label: "pgvector", sub: "semantic search", x: 370, y: 162, color: "teal", match: /pgvector|vector|embedding|semantic/ },
  {
    id: "llm", label: "LLM Layer", sub: "models · embeddings", x: 550, y: 162, color: "indigo",
    match: /llm|openai|gpt|claude|hugging|transformer|langchain|ollama|nlp|whisper|nllb/,
  },
];

const EDGES: [string, string][] = [
  ["client", "api"],
  ["api", "cache"],
  ["api", "db"],
  ["api", "vector"],
  ["vector", "llm"],
];

const STROKE = { indigo: "stroke-neon-indigo", teal: "stroke-neon-teal" } as const;
const EDGE_STROKE = { indigo: "stroke-neon-indigo/70", teal: "stroke-neon-teal/70" } as const;
const FILL = { indigo: "fill-neon-indigo", teal: "fill-neon-teal" } as const;

export function ArchitectureDiagram({ signals }: { signals: string }) {
  const hay = signals.toLowerCase();
  const active = new Set(NODES.filter((n) => n.always || (n.match && n.match.test(hay))).map((n) => n.id));
  const byId = Object.fromEntries(NODES.map((n) => [n.id, n]));

  return (
    <div className="overflow-x-auto">
      <svg
        viewBox="0 0 700 220"
        role="img"
        aria-label="System architecture diagram"
        className="h-auto w-full min-w-[560px]"
      >
        {/* Edges */}
        {EDGES.map(([from, to], i) => {
          const a = byId[from];
          const b = byId[to];
          const x1 = a.x + W;
          const y1 = a.y + H / 2;
          const x2 = b.x;
          const y2 = b.y + H / 2;
          const mid = (x1 + x2) / 2;
          const d = `M ${x1} ${y1} C ${mid} ${y1}, ${mid} ${y2}, ${x2} ${y2}`;
          const on = active.has(from) && active.has(to);

          return on ? (
            <g key={`${from}-${to}`}>
              <motion.path
                d={d}
                fill="none"
                strokeWidth={2}
                className={EDGE_STROKE[b.color]}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, delay: 0.15 * i }}
              />
              <circle cx={x2} cy={y2} r={3.5} className={FILL[b.color]} />
            </g>
          ) : (
            <path
              key={`${from}-${to}`}
              d={d}
              fill="none"
              strokeWidth={1.5}
              strokeDasharray="4 5"
              className="stroke-border"
              opacity={0.6}
            />
          );
        })}

        {/* Nodes */}
        {NODES.map((n) => {
          const on = active.has(n.id);
          return (
            <g key={n.id} opacity={on ? 1 : 0.3}>
              <rect
                x={n.x}
                y={n.y}
                width={W}
                height={H}
                rx={12}
                strokeWidth={1.5}
                strokeDasharray={on ? undefined : "4 4"}
                className={`fill-card ${on ? STROKE[n.color] : "stroke-border"}`}
              />
              <text x={n.x + W / 2} y={n.y + 21} textAnchor="middle" className="fill-foreground font-mono text-[12px] font-semibold">
                {n.label}
              </text>
              <text x={n.x + W / 2} y={n.y + 37} textAnchor="middle" className="fill-muted-foreground font-mono text-[9.5px]">
                {n.sub}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}