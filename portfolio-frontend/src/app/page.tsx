import { Hero } from "@/components/hero";
import { CommandBar } from "@/components/command-bar";
import { BentoGrid } from "@/components/bento-grid";

export default function Home() {
  return (
    <>
      <Hero />

      <section className="container pb-20">
        <CommandBar />
      </section>

      <section className="container pb-24">
        <p className="font-mono text-sm text-neon-teal">// core stack</p>
        <h2 className="mb-8 mt-3 text-2xl font-bold tracking-tight sm:text-3xl">Built for production AI</h2>
        <BentoGrid />
      </section>
    </>
  );
}