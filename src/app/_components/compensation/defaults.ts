import type { CompensationFormValues } from "./schema";

export const getDefaultFormValues = (): CompensationFormValues => ({
  recurring: {
    base: {
      amount: 20000,
      currency: "ILS",
    },
    food: {
      amount: 1500,
      currency: "ILS",
    },
    bonusPercentage: 15,
  },
  benefits: {
    percentage: 10,
    calculationCurrency: "USD",
  },
  rsuGrants: [
    {
      name: "Initial Grant",
      startDate: new Date().toISOString().slice(0, 10),
      vestingYears: 4,
      totalValue: {
        amount: 50000,
        currency: "USD",
      },
    },
  ],
  espp: {
    enabled: false,
    contributionPercentage: undefined,
    growthPercentage: undefined,
    purchaseCurrency: undefined,
    overrideRate: undefined,
  },
  raises: {
    enabled: false,
    items: [],
  },
});
