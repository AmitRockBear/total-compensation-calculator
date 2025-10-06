'use client';

import { createContext, useContext, useMemo, useState } from "react";
import { useTheme } from "next-themes";

import { CurrencyCode, defaultExchangeRates } from "./constants";

type ExchangeRates = Record<CurrencyCode, number>;

type CompensationSettingsContextValue = {
  preferredCurrency: CurrencyCode;
  setPreferredCurrency: (currency: CurrencyCode) => void;
  defaultRates: ExchangeRates;
  updateRate: (currency: CurrencyCode, value: number) => void;
  theme: "light" | "dark";
  toggleTheme: () => void;
  setThemeMode: (mode: "light" | "dark") => void;
};

const CompensationSettingsContext =
  createContext<CompensationSettingsContextValue | null>(null);

export const CompensationSettingsProvider = ({
  children,
}: {
  readonly children: React.ReactNode;
}) => {
  const [preferredCurrency, setPreferredCurrency] = useState<CurrencyCode>(
    "USD",
  );
  const [defaultRates, setDefaultRates] = useState<ExchangeRates>(
    defaultExchangeRates,
  );
  const { resolvedTheme, setTheme } = useTheme();
  const theme = resolvedTheme === "dark" ? "dark" : "light";

  const value = useMemo<CompensationSettingsContextValue>(() => ({
    preferredCurrency,
    setPreferredCurrency,
    defaultRates,
    updateRate: (currency, value) => {
      setDefaultRates((previous) => ({
        ...previous,
        [currency]: value > 0 ? value : previous[currency],
      }));
    },
    theme,
    toggleTheme: () => {
      setTheme(theme === "light" ? "dark" : "light");
    },
    setThemeMode: (mode) => {
      setTheme(mode);
    },
  }), [defaultRates, preferredCurrency, setTheme, theme]);

  return (
    <CompensationSettingsContext.Provider value={value}>
      {children}
    </CompensationSettingsContext.Provider>
  );
};

export const useCompensationSettings = () => {
  const context = useContext(CompensationSettingsContext);

  if (!context) {
    throw new Error(
      "useCompensationSettings must be used within CompensationSettingsProvider",
    );
  }

  return context;
};
