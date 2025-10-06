'use client';

import { currencyOptions } from "./constants";
import { useCompensationSettings } from "./context";

export const GlobalSettings = () => {
  const { preferredCurrency, setPreferredCurrency, defaultRates, updateRate, theme, toggleTheme } =
    useCompensationSettings();

  return (
    <section className="rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-2xl backdrop-blur transition dark:border-white/10 dark:bg-white/10">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Global Settings</h2>
          <p className="text-sm text-slate-600 dark:text-white/70">
            Configure your output currency, manage baseline exchange rates, and toggle theme preferences.
          </p>
        </div>
        <button
          type="button"
          onClick={toggleTheme}
          className="rounded-full border border-slate-300/80 bg-white px-4 py-2 text-sm font-medium text-slate-900 shadow-sm transition hover:border-slate-400 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400 dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:border-white/40 dark:hover:bg-white/20 dark:focus-visible:outline-white"
          aria-label="Toggle theme"
        >
          {theme === "light" ? "Switch to Dark" : "Switch to Light"}
        </button>
      </header>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200/70 bg-white/90 p-4 shadow-inner transition dark:border-white/10 dark:bg-white/5">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-white/60">
            Desired Output Currency
          </h3>
          <select
            value={preferredCurrency}
            onChange={(event) => {
              setPreferredCurrency(event.target.value as typeof preferredCurrency);
            }}
            className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition hover:border-slate-400 focus:border-slate-500 dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:border-white/40 dark:focus:border-white/60"
          >
            {currencyOptions.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </div>
        <div className="rounded-2xl border border-slate-200/70 bg-white/90 p-4 shadow-inner transition dark:border-white/10 dark:bg-white/5">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-white/60">Live Insights</h3>
          <p className="mt-3 text-sm text-slate-600 dark:text-white/70">
            Calculations and visualizations update instantly as you edit values. Use the Calculate button to validate inputs
            and capture a shareable snapshot.
          </p>
          <p
            className="mt-2 text-xs text-slate-500 dark:text-white/60"
            aria-label="Exchange rate note"
            title="Exchange rates are relative to USD by default."
          >
            Exchange rates default to USD parity. Override any field to reflect negotiated or real-time rates.
          </p>
        </div>
      </div>
      <div className="mt-8">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-white/60">
          Default Exchange Rates
        </h3>
        <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {currencyOptions.map((currency) => (
            <label
              key={currency}
              className="flex flex-col gap-1 rounded-xl border border-slate-200/70 bg-white/90 px-4 py-3 text-sm text-slate-700 shadow-inner transition dark:border-white/10 dark:bg-white/5 dark:text-white/70"
            >
              <span className="flex items-center justify-between text-xs uppercase tracking-wide text-slate-500 dark:text-white/60">
                <span>{currency}</span>
                <span title="Default exchange rate relative to USD" aria-label="Default exchange rate relative to USD">
                  ↔ USD
                </span>
              </span>
              <input
                value={defaultRates[currency] ?? ""}
                onChange={(event) => {
                  const value = Number(event.target.value);
                  updateRate(currency, Number.isNaN(value) ? defaultRates[currency] : value);
                }}
                type="number"
                step="0.0001"
                min="0"
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition hover:border-slate-400 focus:border-slate-500 dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:border-white/40 dark:focus:border-white/60"
              />
            </label>
          ))}
        </div>
      </div>
    </section>
  );
};
