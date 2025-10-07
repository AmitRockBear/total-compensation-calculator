'use client';

import { CompensationCalculator } from "./compensation-calculator";

export const CompensationRoot = () => (
  <div className="relative min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute left-[10%] top-[-10%] h-[600px] w-[600px] rounded-full bg-primary/15 blur-[120px]" />
      <div className="absolute right-[-5%] top-1/3 h-[700px] w-[700px] rounded-full bg-secondary/20 blur-[140px]" />
      <div className="absolute bottom-[-10%] left-1/2 h-[650px] w-[650px] -translate-x-1/2 rounded-full bg-accent/15 blur-[130px]" />
    </div>
    <main className="relative z-10 mx-auto flex max-w-7xl flex-col gap-10 px-6 py-12 lg:px-10 lg:py-16">
      <header className="space-y-5 text-center">
        <div className="inline-flex items-center gap-2.5 rounded-full border border-primary/30 bg-primary/10 px-5 py-2 text-xs font-bold uppercase tracking-widest text-primary shadow-lg shadow-primary/10 backdrop-blur-md">
          <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
            <circle cx="10" cy="10" r="3" />
          </svg>
          Total Compensation Calculator
        </div>
        <h1 className="bg-gradient-to-br from-primary via-primary to-primary/70 bg-clip-text text-5xl font-extrabold leading-tight tracking-tight text-transparent md:text-6xl lg:text-7xl">
          Plan Your Complete
          <br />
          Compensation Package
        </h1>
        <p className="mx-auto max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
          Model salaries, bonuses, benefits, equity grants, ESPP, and raises in one place.
          Visualize your total compensation in real-time with beautiful charts.
        </p>
      </header>
      <section className="rounded-3xl border border-primary/20 bg-card/90 p-6 shadow-2xl shadow-primary/10 backdrop-blur-md lg:p-8">
        <CompensationCalculator />
      </section>
    </main>
  </div>
);
