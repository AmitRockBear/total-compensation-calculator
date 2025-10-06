'use client';

import { Controller, useFormContext, useWatch } from "react-hook-form";

import { currencyOptions } from "./constants";
import type { CompensationFormValues } from "./schema";

export const EsppSection = () => {
  const { control } = useFormContext<CompensationFormValues>();
  const enabled = useWatch({ control, name: "espp.enabled" });

  return (
    <section className="rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-xl backdrop-blur transition dark:border-white/10 dark:bg-white/10">
      <header className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Employee Stock Purchase Plan</h2>
          <p className="text-sm text-slate-600 dark:text-white/70">
            Model contributions and expected stock growth. Toggle ESPP participation to reveal additional details.
          </p>
        </div>
      </header>
      <div className="mt-6 flex flex-col gap-4">
        <Controller
          control={control}
          name="espp.enabled"
          render={({ field }) => (
            <label className="flex items-center gap-3 rounded-2xl border border-slate-200/70 bg-white/90 p-4 shadow-inner transition dark:border-white/10 dark:bg-white/5">
              <input
                type="checkbox"
                checked={field.value}
                onChange={(event) => field.onChange(event.target.checked)}
                className="h-5 w-5 rounded border border-slate-300 bg-white text-blue-500 focus:ring-2 focus:ring-blue-400 dark:border-white/20 dark:bg-white/10 dark:text-blue-300"
                aria-label="Enable ESPP"
              />
              <span className="text-sm font-medium text-slate-900 dark:text-white">Enable ESPP</span>
            </label>
          )}
        />
        {enabled ? (
          <div className="grid gap-4 md:grid-cols-2">
            <Controller
              control={control}
              name="espp.contributionPercentage"
              render={({ field: contributionField }) => (
                <label className="flex flex-col gap-2 rounded-2xl border border-slate-200/70 bg-white/90 p-4 shadow-inner transition dark:border-white/10 dark:bg-white/5">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-white/60">
                    Contribution Percentage
                  </span>
                  <input
                    {...contributionField}
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition hover:border-slate-400 focus:border-slate-500 dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:border-white/40 dark:focus:border-white/60"
                    aria-label="ESPP contribution percentage"
                  />
                  <span className="text-xs text-slate-500 dark:text-white/60" title="Percentage of salary contributed to ESPP.">
                    Portion of annual salary allocated to ESPP.
                  </span>
                </label>
              )}
            />
            <Controller
              control={control}
              name="espp.growthPercentage"
              render={({ field: growthField }) => (
                <label className="flex flex-col gap-2 rounded-2xl border border-slate-200/70 bg-white/90 p-4 shadow-inner transition dark:border-white/10 dark:bg-white/5">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-white/60">
                    Expected Stock Growth (% per year)
                  </span>
                  <input
                    {...growthField}
                    type="number"
                    min="0"
                    max="200"
                    step="0.1"
                    className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition hover:border-slate-400 focus:border-slate-500 dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:border-white/40 dark:focus:border-white/60"
                    aria-label="Expected stock growth percentage"
                  />
                  <span className="text-xs text-slate-500 dark:text-white/60" title="Anticipated annual stock growth applied to contributions.">
                    Forecasted annual growth applied to ESPP contributions.
                  </span>
                </label>
              )}
            />
            <Controller
              control={control}
              name="espp.purchaseCurrency"
              render={({ field: currencyField }) => (
                <label className="flex flex-col gap-2 rounded-2xl border border-slate-200/70 bg-white/90 p-4 shadow-inner transition dark:border-white/10 dark:bg-white/5">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-white/60">
                    ESPP Purchase Currency
                  </span>
                  <select
                    name={currencyField.name}
                    ref={currencyField.ref}
                    onBlur={currencyField.onBlur}
                    value={currencyField.value ?? ""}
                    onChange={(event) => currencyField.onChange(event.target.value)}
                    className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition hover:border-slate-400 focus:border-slate-500 dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:border-white/40 dark:focus:border-white/60"
                    aria-label="ESPP purchase currency"
                  >
                    <option value="" disabled>
                      Select currency
                    </option>
                    {currencyOptions.map((currency) => (
                      <option key={currency} value={currency}>
                        {currency}
                      </option>
                    ))}
                  </select>
                  <span className="text-xs text-slate-500 dark:text-white/60" title="Currency used when purchasing ESPP shares.">
                    Currency used when purchasing ESPP shares.
                  </span>
                </label>
              )}
            />
            <Controller
              control={control}
              name="espp.overrideRate"
              render={({ field: overrideField }) => (
                <label className="flex flex-col gap-2 rounded-2xl border border-slate-200/70 bg-white/90 p-4 shadow-inner transition dark:border-white/10 dark:bg-white/5">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-white/60">
                    Exchange Rate Override
                  </span>
                  <input
                    {...overrideField}
                    value={overrideField.value ?? ""}
                    onChange={(event) => {
                      const rawValue = event.target.value;
                      if (rawValue === "") {
                        overrideField.onChange(undefined);
                        return;
                      }

                      const numeric = Number(rawValue);
                      overrideField.onChange(
                        Number.isNaN(numeric) ? overrideField.value : numeric,
                      );
                    }}
                    type="number"
                    step="0.0001"
                    min="0"
                    className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition hover:border-slate-400 focus:border-slate-500 dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:border-white/40 dark:focus:border-white/60"
                    aria-label="ESPP exchange rate override"
                  />
                  <span className="text-xs text-slate-500 dark:text-white/60" title="Override for converting ESPP contributions.">
                    Optional override for conversions from purchase currency to your desired output.
                  </span>
                </label>
              )}
            />
          </div>
        ) : null}
      </div>
    </section>
  );
};
