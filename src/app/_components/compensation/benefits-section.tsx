'use client';

import { Controller, useFormContext } from "react-hook-form";

import { currencyOptions } from "./constants";
import type { CompensationFormValues } from "./schema";

export const BenefitsSection = () => {
  const { control } = useFormContext<CompensationFormValues>();

  return (
    <section className="rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-xl backdrop-blur transition dark:border-white/10 dark:bg-white/10">
      <header className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Annual Benefits</h2>
          <p className="text-sm text-slate-600 dark:text-white/70">
            Apply benefit percentages with localized currency assumptions for accurate conversions.
          </p>
        </div>
      </header>
      <div className="mt-6 grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <Controller
          control={control}
          name="benefits.percentage"
          render={({ field }) => (
            <label className="flex flex-col gap-2 rounded-2xl border border-slate-200/70 bg-white/90 p-4 shadow-inner transition dark:border-white/10 dark:bg-white/5">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-white/60">
                Benefits Percentage
              </span>
              <input
                {...field}
                type="number"
                min="0"
                max="100"
                step="0.1"
                className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition hover:border-slate-400 focus:border-slate-500 dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:border-white/40 dark:focus:border-white/60"
                aria-label="Benefits percentage"
              />
              <span className="text-xs text-slate-500 dark:text-white/60" title="Percentage of annual compensation allocated to benefits.">
                Share of annual compensation allocated to benefits.
              </span>
            </label>
          )}
        />
        <Controller
          control={control}
          name="benefits.calculationCurrency"
          render={({ field }) => (
            <label className="flex flex-col gap-2 rounded-2xl border border-slate-200/70 bg-white/90 p-4 shadow-inner transition dark:border-white/10 dark:bg-white/5">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-white/60">
                Calculation Currency
              </span>
              <select
                name={field.name}
                ref={field.ref}
                onBlur={field.onBlur}
                value={field.value}
                onChange={(event) => field.onChange(event.target.value)}
                className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition hover:border-slate-400 focus:border-slate-500 dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:border-white/40 dark:focus:border-white/60"
                aria-label="Benefits calculation currency"
              >
                {currencyOptions.map((currency) => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>
              <span className="text-xs text-slate-500 dark:text-white/60" title="Currency context used for benefits before converting to the output currency.">
                Currency context for benefits before conversion to your desired output.
              </span>
            </label>
          )}
        />
      </div>
    </section>
  );
};
