import type { CompensationFormValues } from "~/features/compensation/types/schema";

export const getDefaultFormValues = (): CompensationFormValues => ({
  recurring: {
    base: {
      amount: 20000,
      currency: "ILS",
    },
    food: {
      amount: 1000,
      currency: "ILS",
    },
    bonusPercentage: 10,
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
  esppPlans: [],
  raises: [],
});
