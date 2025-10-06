'use client';

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { CurrencyCode, defaultExchangeRates } from "./constants";

type ExchangeRates = Record<CurrencyCode, number>;

type CompensationSettingsContextValue = {
  preferredCurrency: CurrencyCode;
  setPreferredCurrency: (currency: CurrencyCode) => void;
  defaultRates: ExchangeRates;
  updateRate: (currency: CurrencyCode, value: number) => void;
  theme: "light" | "dark";
  toggleTheme: () => void;
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
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const root = document.documentElement;

    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

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
      setTheme((previous) => (previous === "light" ? "dark" : "light"));
    },
  }), [preferredCurrency, defaultRates, theme]);

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
