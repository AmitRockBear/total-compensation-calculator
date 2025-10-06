'use client';

import { Controller, useFieldArray, useFormContext, useWatch } from "react-hook-form";

import type { CompensationFormValues } from "./schema";

export const RaisesSection = () => {
  const { control } = useFormContext<CompensationFormValues>();
  const { fields, append, remove } = useFieldArray({ control, name: "raises.items" });
  const enabled = useWatch({ control, name: "raises.enabled" });

  return (
    <section className="rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-xl backdrop-blur transition dark:border-white/10 dark:bg-white/10">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Expected Salary Raises</h2>
          <p className="text-sm text-slate-600 dark:text-white/70">
            Model projected raises. Apply currency conversions within each field to capture mixed-currency adjustments.
          </p>
        </div>
      </header>
      <div className="mt-6 flex flex-col gap-4">
        <Controller
          control={control}
          name="raises.enabled"
          render={({ field }) => (
            <label className="flex items-center gap-3 rounded-2xl border border-slate-200/70 bg-white/90 p-4 shadow-inner transition dark:border-white/10 dark:bg-white/5">
              <input
                type="checkbox"
                checked={field.value}
                onChange={(event) => field.onChange(event.target.checked)}
                className="h-5 w-5 rounded border border-slate-300 bg-white text-blue-500 focus:ring-2 focus:ring-blue-400 dark:border-white/20 dark:bg-white/10 dark:text-blue-300"
                aria-label="Enable raises"
              />
              <span className="text-sm font-medium text-slate-900 dark:text-white">Enable Raises</span>
            </label>
          )}
        />
        {enabled ? (
          <div className="flex flex-col gap-4">
            {fields.map((item, index) => (
              <div
                key={item.id}
                className="rounded-3xl border border-slate-200/70 bg-white/90 p-5 shadow-inner backdrop-blur transition dark:border-white/10 dark:bg-white/5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white">Raise Year {index + 1}</h3>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="rounded-full border border-slate-300/80 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600 transition hover:border-slate-400 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400 dark:border-white/20 dark:bg-white/10 dark:text-white/70 dark:hover:border-white/40 dark:hover:bg-white/20 dark:focus-visible:outline-white"
                    aria-label={`Remove raise ${index + 1}`}
                  >
                    Remove
                  </button>
                </div>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <Controller
                    control={control}
                    name={`raises.items.${index}.yearOffset`}
                    render={({ field: yearField }) => (
                      <label className="flex flex-col gap-2 rounded-2xl border border-slate-200/70 bg-white/90 p-4 shadow-inner transition dark:border-white/10 dark:bg-white/5">
                        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-white/60">
                          Years From Now
                        </span>
                        <input
                          {...yearField}
                          type="number"
                          min="1"
                          step="1"
                          className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition hover:border-slate-400 focus:border-slate-500 dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:border-white/40 dark:focus:border-white/60"
                          aria-label="Years from now for raise"
                        />
                        <span className="text-xs text-slate-500 dark:text-white/60" title="Number of years from the current period when this raise takes effect.">
                          Years from today when this raise applies.
                        </span>
                      </label>
                    )}
                  />
                  <Controller
                    control={control}
                    name={`raises.items.${index}.percentage`}
                    render={({ field: percentageField }) => (
                      <label className="flex flex-col gap-2 rounded-2xl border border-slate-200/70 bg-white/90 p-4 shadow-inner transition dark:border-white/10 dark:bg-white/5">
                        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-white/60">
                          Raise Percentage
                        </span>
                        <input
                          {...percentageField}
                          type="number"
                          min="-100"
                          max="200"
                          step="0.1"
                          className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition hover:border-slate-400 focus:border-slate-500 dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:border-white/40 dark:focus:border-white/60"
                          aria-label="Raise percentage"
                        />
                        <span className="text-xs text-slate-500 dark:text-white/60" title="Percentage increase (or decrease) applied to salary in the specified year.">
                          Percentage applied to salary and recurring allowances in that year.
                        </span>
                      </label>
                    )}
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                append({
                  yearOffset: fields.length + 1,
                  percentage: 5,
                })
              }
              className="self-start rounded-full border border-slate-300/80 bg-white px-4 py-2 text-sm font-medium text-slate-900 shadow-sm transition hover:border-slate-400 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400 dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:border-white/40 dark:hover:bg-white/20 dark:focus-visible:outline-white"
              aria-label="Add salary raise"
            >
              Add Annual Raise
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
};
