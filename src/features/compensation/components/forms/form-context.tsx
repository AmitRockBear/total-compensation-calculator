import { createContext, useContext } from "react";

export type CompensationFormApi = any;

export type FormFieldCallback = {
  name: string;
  state: { value: unknown };
  handleChange: (value: unknown) => void;
  handleBlur: () => void;
};

export const FormContext = createContext<CompensationFormApi | null>(null);

export const useFormContext = (): CompensationFormApi => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error(
      "useFormContext must be used within a FormContext.Provider",
    );
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
