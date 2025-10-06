'use client';

import { Controller, useFieldArray, useFormContext } from "react-hook-form";

import { useCompensationSettings } from "./context";
import { MonetaryFieldInput } from "./monetary-field-input";
import type { CompensationFormValues } from "./schema";

export const RsuSection = () => {
  const { preferredCurrency } = useCompensationSettings();
  const { control } = useFormContext<CompensationFormValues>();
  const { fields, append, remove } = useFieldArray({ control, name: "rsuGrants" });

  return (
    <section className="rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-xl backdrop-blur transition dark:border-white/10 dark:bg-white/10">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">RSU Grants</h2>
          <p className="text-sm text-slate-600 dark:text-white/70">
            Track grant values, vesting schedules, and currency conversions. Values are evenly distributed across vesting years.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            append({
              name: "New Grant",
              startDate: new Date().toISOString().slice(0, 10),
              vestingYears: 4,
              totalValue: {
                amount: 0,
                currency: preferredCurrency,
              },
            });
          }}
          className="rounded-full border border-slate-300/80 bg-white px-4 py-2 text-sm font-medium text-slate-900 shadow-sm transition hover:border-slate-400 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400 dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:border-white/40 dark:hover:bg-white/20 dark:focus-visible:outline-white"
          aria-label="Add RSU Grant"
        >
          Add RSU Grant
        </button>
      </header>
      <div className="mt-6 flex flex-col gap-5">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="rounded-3xl border border-slate-200/70 bg-white/90 p-5 shadow-inner backdrop-blur transition dark:border-white/10 dark:bg-white/5"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">{field.name || `Grant ${index + 1}`}</h3>
              <button
                type="button"
                onClick={() => {
                  if (fields.length > 1) {
                    remove(index);
                  }
                }}
                className="rounded-full border border-slate-300/80 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600 transition hover:border-slate-400 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400 dark:border-white/20 dark:bg-white/10 dark:text-white/70 dark:hover:border-white/40 dark:hover:bg-white/20 dark:focus-visible:outline-white"
                aria-label={`Remove grant ${index + 1}`}
              >
                Remove
              </button>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <Controller
                control={control}
                name={`rsuGrants.${index}.name`}
                render={({ field: fieldController }) => (
                  <label className="flex flex-col gap-2 rounded-2xl border border-slate-200/70 bg-white/90 p-4 shadow-inner transition dark:border-white/10 dark:bg-white/5">
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-white/60">
                      Grant Name
                    </span>
                    <input
                      {...fieldController}
                      type="text"
                      className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition hover:border-slate-400 focus:border-slate-500 dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:border-white/40 dark:focus:border-white/60"
                      aria-label="Grant name"
                    />
                    <span className="text-xs text-slate-500 dark:text-white/60" title="Label for identifying this grant.">
                      Add a descriptive name to identify this grant.
                    </span>
                  </label>
                )}
              />
              <Controller
                control={control}
                name={`rsuGrants.${index}.vestingYears`}
                render={({ field: fieldController }) => (
                  <label className="flex flex-col gap-2 rounded-2xl border border-slate-200/70 bg-white/90 p-4 shadow-inner transition dark:border-white/10 dark:bg-white/5">
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-white/60">
                      Vesting Duration (Years)
                    </span>
                    <input
                      {...fieldController}
                      type="number"
                      min="1"
                      step="1"
                      className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition hover:border-slate-400 focus:border-slate-500 dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:border-white/40 dark:focus:border-white/60"
                      aria-label="Vesting duration in years"
                    />
                    <span className="text-xs text-slate-500 dark:text-white/60" title="Number of years over which the grant vests.">
                      Number of years over which the total value is distributed.
                    </span>
                  </label>
                )}
              />
              <Controller
                control={control}
                name={`rsuGrants.${index}.startDate`}
                render={({ field: fieldController }) => (
                  <label className="flex flex-col gap-2 rounded-2xl border border-slate-200/70 bg-white/90 p-4 shadow-inner transition dark:border-white/10 dark:bg-white/5">
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-white/60">
                      Start Date
                    </span>
                    <input
                      {...fieldController}
                      type="date"
                      className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition hover:border-slate-400 focus:border-slate-500 dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:border-white/40 dark:focus:border-white/60"
                      aria-label="Grant start date"
                    />
                    <span className="text-xs text-slate-500 dark:text-white/60" title="Date when vesting starts.">
                      Vesting begins on this date.
                    </span>
                  </label>
                )}
              />
            </div>
            <div className="mt-4">
              <MonetaryFieldInput
                amountName={`rsuGrants.${index}.totalValue.amount`}
                currencyName={`rsuGrants.${index}.totalValue.currency`}
                overrideName={`rsuGrants.${index}.totalValue.overrideRate`}
                label="Total Grant Value"
                description="Total value of the grant in the selected currency. Optional override applies when converting from grant currency."
              />
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs text-slate-500 dark:text-white/60" title="Exchange rate note">
        Enter override rates to handle grants issued in different currencies relative to the output currency.
      </p>
    </section>
  );
};
