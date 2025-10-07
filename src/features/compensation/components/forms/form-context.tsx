
import { createContext, useContext } from "react";

// TanStack Form's ReactFormExtendedApi type requires 12 complex generic parameters
// that are difficult to specify correctly. Using `any` here is pragmatic because:
// 1. The form is created with proper types in compensation-calculator.tsx
// 2. TypeScript will still infer types at usage sites (form.Field, form.state, etc.)
// 3. This avoids type compatibility issues between TanStack Form versions
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type CompensationFormApi = any;

export const FormContext = createContext<CompensationFormApi | null>(null);

export const useFormContext = (): CompensationFormApi => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useFormContext must be used within a FormContext.Provider");
  }
  return context;
};

// Helper type for field names - extracts all valid paths from the form values
export type CompensationFieldName = 
  | "recurring"
  | "recurring.base"
  | "recurring.base.amount"
  | "recurring.base.currency"
  | "recurring.base.overrideRate"
  | "recurring.food"
  | "recurring.food.amount"
  | "recurring.food.currency"
  | "recurring.food.overrideRate"
  | "recurring.bonusPercentage"
  | "benefits"
  | "benefits.percentage"
  | "benefits.calculationCurrency"
  | "rsuGrants"
  | `rsuGrants[${number}]`
  | `rsuGrants[${number}].name`
  | `rsuGrants[${number}].startDate`
  | `rsuGrants[${number}].vestingYears`
  | `rsuGrants[${number}].totalValue`
  | `rsuGrants[${number}].totalValue.amount`
  | `rsuGrants[${number}].totalValue.currency`
  | `rsuGrants[${number}].totalValue.overrideRate`
  | "espp"
  | "espp.enabled"
  | "espp.contributionPercentage"
  | "espp.growthPercentage"
  | "espp.purchaseCurrency"
  | "espp.overrideRate"
  | "raises"
  | "raises.enabled"
  | "raises.items"
  | `raises.items[${number}]`
  | `raises.items[${number}].yearOffset`
  | `raises.items[${number}].percentage`;
