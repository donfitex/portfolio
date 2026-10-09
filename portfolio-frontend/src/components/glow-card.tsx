"use client";

import { useRef, type HTMLAttributes, type MouseEvent } from "react";
import { cn } from "@/lib/utils";

type GlowCardProps = Omit<HTMLAttributes<HTMLDivElement>, "onMouseMove">;

export function GlowCard({ className, children, ...props }: GlowCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  return (
    <div ref={ref} onMouseMove={handleMove} className={cn("glow-card", className)} {...props}>
      {children}
    </div>
  );
}