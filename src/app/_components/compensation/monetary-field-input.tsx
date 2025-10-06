'use client';

import type { FieldPath } from "react-hook-form";
import { Controller, useFormContext } from "react-hook-form";

import { currencyOptions } from "./constants";
import type { CompensationFormValues } from "./schema";

type MonetaryFieldInputProps = {
  amountName: FieldPath<CompensationFormValues>;
  currencyName: FieldPath<CompensationFormValues>;
  overrideName: FieldPath<CompensationFormValues>;
  label: string;
  description?: string;
};

export const MonetaryFieldInput = ({
  amountName,
  currencyName,
  overrideName,
  label,
  description,
}: MonetaryFieldInputProps) => {
  const { control } = useFormContext<CompensationFormValues>();

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-slate-200/70 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-slate-900 dark:text-white">{label}</label>
        {description ? (
          <span
            className="text-xs text-slate-500 dark:text-white/60"
            title={description}
            aria-label={description}
          >
            ⓘ
          </span>
        ) : null}
      </div>
      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)]">
        <Controller
          control={control}
          name={amountName}
          render={({ field }) => {
            const { value, onChange, ...rest } = field;
            const resolvedValue =
              typeof value === "number"
                ? value
                : typeof value === "string"
                  ? value
                  : "";

            return (
              <div className="flex flex-col gap-1">
                <span className="text-xs uppercase tracking-wide text-slate-500 dark:text-white/70">
                  Amount
                </span>
                <input
                  {...rest}
                  value={resolvedValue}
                  onChange={(event) => {
                    const rawValue = event.target.value;
                    if (rawValue === "") {
                      onChange(undefined);
                      return;
                    }

                    const numeric = Number(rawValue);
                    onChange(Number.isNaN(numeric) ? undefined : numeric);
                  }}
                  type="number"
                  step="0.01"
                  min="0"
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-slate-500 dark:border-white/20 dark:bg-white/10 dark:text-white dark:focus:border-white/60"
                />
              </div>
            );
          }}
        />
        <Controller
          control={control}
          name={currencyName}
          render={({ field }) => (
            <div className="flex flex-col gap-1">
              <span className="text-xs uppercase tracking-wide text-slate-500 dark:text-white/70">
                Currency
              </span>
              <select
                name={field.name}
                ref={field.ref}
                onBlur={field.onBlur}
                value={typeof field.value === "string" ? field.value : ""}
                onChange={(event) => {
                  field.onChange(event.target.value);
                }}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-slate-500 dark:border-white/20 dark:bg-white/10 dark:text-white dark:focus:border-white/60"
              >
                {currencyOptions.map((currency) => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>
            </div>
          )}
        />
        <Controller
          control={control}
          name={overrideName}
          render={({ field }) => {
            const { value, onChange, ...rest } = field;
            const resolvedValue =
              typeof value === "number" || typeof value === "string"
                ? value
                : "";

            return (
              <div className="flex flex-col gap-1">
                <span className="text-xs uppercase tracking-wide text-slate-500 dark:text-white/70">
                  Override Rate
                </span>
                <input
                  {...rest}
                  value={resolvedValue}
                  onChange={(event) => {
                    const rawValue = event.target.value;
                    if (rawValue === "") {
                      onChange(undefined);
                      return;
                    }

                    const numeric = Number(rawValue);
                    onChange(Number.isNaN(numeric) ? undefined : numeric);
                  }}
                  type="number"
                  step="0.0001"
                  min="0"
                  placeholder="Use default"
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-slate-500 dark:border-white/20 dark:bg-white/10 dark:text-white dark:placeholder:text-white/40 dark:focus:border-white/60"
                />
              </div>
            );
          }}
        />
      </div>
    </div>
  );
};
