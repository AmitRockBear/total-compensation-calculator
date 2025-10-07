
import { useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useTheme } from "next-themes";

import { defaultExchangeRates } from "~/features/compensation/lib/constants";
import type { CurrencyCode } from "~/features/compensation/lib/constants";

type ExchangeRates = Record<CurrencyCode, number>;

type CompensationSettingsState = {
  preferredCurrency: CurrencyCode;
  defaultRates: ExchangeRates;
};

export type CompensationSettingsContextValue = {
  preferredCurrency: CurrencyCode;
  setPreferredCurrency: (currency: CurrencyCode) => void;
  defaultRates: ExchangeRates;
  updateRate: (currency: CurrencyCode, value: number) => void;
  theme: "light" | "dark";
  toggleTheme: () => void;
  setThemeMode: (mode: "light" | "dark") => void;
};

const settingsQueryKey = ["compensation-settings"] as const;

const createInitialSettings = (): CompensationSettingsState => ({
  preferredCurrency: "USD",
  defaultRates: { ...defaultExchangeRates },
});

export const useCompensationSettings = (): CompensationSettingsContextValue => {
  const queryClient = useQueryClient();
  const { resolvedTheme, setTheme } = useTheme();

  const { data } = useQuery({
    queryKey: settingsQueryKey,
    queryFn: () => createInitialSettings(),
    staleTime: Infinity,
    gcTime: Infinity,
    initialData: createInitialSettings,
  });

  const settings = data ?? createInitialSettings();

  const setPreferredCurrency = useCallback(
    (currency: CurrencyCode) => {
      queryClient.setQueryData(
        settingsQueryKey,
        (previous?: CompensationSettingsState) => {
          const base = previous ?? createInitialSettings();

          if (base.preferredCurrency === currency) {
            return base;
          }

          return {
            ...base,
            preferredCurrency: currency,
          };
        },
      );
    },
    [queryClient],
  );

  const updateRate = useCallback(
    (currency: CurrencyCode, value: number) => {
      if (value <= 0) {
        return;
      }

      queryClient.setQueryData(
        settingsQueryKey,
        (previous?: CompensationSettingsState) => {
          const base = previous ?? createInitialSettings();

          return {
            ...base,
            defaultRates: {
              ...base.defaultRates,
              [currency]: value,
            },
          };
        },
      );
    },
    [queryClient],
  );

  const theme = resolvedTheme === "dark" ? "dark" : "light";

  const toggleTheme = useCallback(() => {
    setTheme(theme === "light" ? "dark" : "light");
  }, [setTheme, theme]);

  const setThemeMode = useCallback(
    (mode: "light" | "dark") => {
      setTheme(mode);
    },
    [setTheme],
  );

  return {
    preferredCurrency: settings.preferredCurrency,
    setPreferredCurrency,
    defaultRates: settings.defaultRates,
    updateRate,
    theme,
    toggleTheme,
    setThemeMode,
  };
};
