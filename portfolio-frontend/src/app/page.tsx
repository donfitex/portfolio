import { GlowCard } from "@/components/glow-card";

const swatches = [
  { name: "Obsidian", className: "bg-background border border-border" },
  { name: "Card", className: "bg-card border border-border" },
  { name: "Electric Indigo", className: "bg-neon-indigo" },
  { name: "Neon Teal", className: "bg-neon-teal" },
];

export default function Home() {
  return (
    <div className="container py-24">
      <p className="font-mono text-sm text-neon-teal">// design system check</p>
      <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
        Scalable <span className="text-gradient">Django + PostgreSQL</span> meets production AI UI/UX.
      </h1>
      <p className="mt-6 max-w-xl text-muted-foreground">
        Temporary page for verifying the theme layer. The real homepage arrives in Section 4.
      </p>

      <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {swatches.map((s) => (
          <GlowCard key={s.name} className="p-4">
            <div className={`h-16 rounded-xl ${s.className}`} />
            <p className="mt-3 font-mono text-xs text-muted-foreground">{s.name}</p>
          </GlowCard>
        ))}
      </div>

      {/* Tall block so you can scroll and watch the navbar blur */}
      <div className="mt-24 h-[120vh] rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">
        Scroll test area: the navbar should stay pinned with a frosted-glass blur.
      </div>
    </div>
  );
}