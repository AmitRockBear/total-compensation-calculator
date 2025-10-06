'use client';

import { Controller, useFormContext } from "react-hook-form";

import { MonetaryFieldInput } from "./monetary-field-input";
import type { CompensationFormValues } from "./schema";

export const RecurringCompensationSection = () => {
  const { control } = useFormContext<CompensationFormValues>();

  return (
    <section className="rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-xl backdrop-blur transition dark:border-white/10 dark:bg-white/10">
      <header className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Recurring Compensation</h2>
          <p className="text-sm text-slate-600 dark:text-white/70">
            Capture base salary and allowances. Values automatically convert to your preferred currency.
          </p>
        </div>
      </header>
      <div className="mt-6 flex flex-col gap-5">
        <MonetaryFieldInput
          amountName="recurring.base.amount"
          currencyName="recurring.base.currency"
          overrideName="recurring.base.overrideRate"
          label="Monthly Base Salary"
          description="Monthly base salary before bonuses and allowances."
        />
        <MonetaryFieldInput
          amountName="recurring.food.amount"
          currencyName="recurring.food.currency"
          overrideName="recurring.food.overrideRate"
          label="Monthly Food Allowance"
          description="Monthly allowance for meals or groceries, if applicable."
        />
        <div className="rounded-2xl border border-slate-200/70 bg-white/90 p-4 shadow-inner transition dark:border-white/10 dark:bg-white/5">
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-white/60">
            Annual Bonus Rate
          </label>
          <Controller
            control={control}
            name="recurring.bonusPercentage"
            render={({ field }) => (
              <input
                {...field}
                type="number"
                min="0"
                max="100"
                step="0.1"
                className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition hover:border-slate-400 focus:border-slate-500 dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:border-white/40 dark:focus:border-white/60"
              />
            )}
          />
          <p
            className="mt-2 text-xs text-slate-500 dark:text-white/60"
            title="Annual bonus percentage applied to the converted base salary."
            aria-label="Annual bonus percentage applied to the converted base salary."
          >
            Percentage applied to the converted base salary when calculating yearly bonuses.
          </p>
        </div>
      </div>
    </section>
  );
};
