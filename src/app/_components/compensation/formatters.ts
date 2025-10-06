import { CurrencyCode } from "./constants";

const currencyFormatterCache = new Map<CurrencyCode, Intl.NumberFormat>();

export const formatCurrency = (value: number, currency: CurrencyCode) => {
  if (!currencyFormatterCache.has(currency)) {
    currencyFormatterCache.set(
      currency,
      new Intl.NumberFormat(undefined, {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
      }),
    );
  }

  const formatter = currencyFormatterCache.get(currency);
  return formatter?.format(Number.isFinite(value) ? value : 0) ?? value.toFixed(0);
};

export const formatPercent = (value: number, options?: { maximumFractionDigits?: number }) => {
  const formatter = new Intl.NumberFormat(undefined, {
    style: "percent",
    maximumFractionDigits: options?.maximumFractionDigits ?? 1,
  });

  return formatter.format(value);
};
