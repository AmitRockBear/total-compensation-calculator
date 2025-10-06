export const currencyOptions = [
  "USD",
  "EUR",
  "ILS",
  "GBP",
  "CAD",
  "AUD",
  "JPY",
  "CHF",
] as const;

export type CurrencyCode = (typeof currencyOptions)[number];

export const defaultExchangeRates: Record<CurrencyCode, number> = {
  USD: 1,
  EUR: 0.92,
  ILS: 3.65,
  GBP: 0.79,
  CAD: 1.35,
  AUD: 1.51,
  JPY: 150.27,
  CHF: 0.86,
};

export const distributionColors = [
  "#2563eb",
  "#22d3ee",
  "#a855f7",
  "#f97316",
  "#10b981",
  "#ef4444",
];
