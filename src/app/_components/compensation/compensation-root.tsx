'use client';

import { CompensationCalculator } from "./compensation-calculator";

export const CompensationRoot = () => (
  <div className="relative min-h-screen bg-background text-foreground">
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute left-[10%] top-[-10%] h-80 w-80 rounded-full bg-cyan-400/30 blur-3xl dark:bg-cyan-500/20" />
      <div className="absolute right-[-10%] top-1/4 h-96 w-96 rounded-full bg-indigo-400/20 blur-3xl dark:bg-indigo-500/10" />
      <div className="absolute bottom-[-20%] left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-sky-300/25 blur-3xl dark:bg-sky-500/20" />
    </div>
    <main className="relative z-10 mx-auto flex max-w-7xl flex-col gap-10 px-6 py-12 lg:px-10 lg:py-16">
      <header className="space-y-4 text-center lg:text-left">
        <span className="inline-flex items-center gap-2 self-start rounded-full border border-border/60 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground backdrop-blur dark:bg-slate-900/40">
          Total Compensation Planner
        </span>
        <h1 className="text-3xl font-semibold leading-tight md:text-4xl lg:text-5xl">
          Model every piece of an employee&apos;s compensation with clarity and confidence.
        </h1>
        <p className="text-base text-muted-foreground md:text-lg">
          Consolidate salaries, bonuses, benefits, equity grants, ESPP participation, and raises into a single dynamic
          projection. Set your preferred currency, override exchange rates, and see real-time visuals update as you refine each
          assumption.
        </p>
      </header>
      <section className="rounded-[2.25rem] border border-border/70 bg-card/90 p-6 shadow-[0_25px_60px_-20px_rgba(15,23,42,0.3)] backdrop-blur lg:p-8 dark:bg-slate-900/80">
        <CompensationCalculator />
      </section>
    </main>
  </div>
);
