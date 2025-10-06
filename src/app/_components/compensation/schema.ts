import { z } from "zod";

import { currencyOptions } from "./constants";

const currencyEnum = z.enum(currencyOptions);

const monetaryFieldSchema = z.object({
  amount: z
    .number({ invalid_type_error: "Amount is required" })
    .min(0, "Amount cannot be negative"),
  currency: currencyEnum,
  overrideRate: z
    .number({ invalid_type_error: "Invalid override" })
    .positive("Override must be positive")
    .optional(),
});

const rsuGrantSchema = z.object({
  name: z.string().min(1, "Grant name is required"),
  startDate: z.string().min(1, "Start date is required"),
  vestingYears: z
    .number({ invalid_type_error: "Vesting duration is required" })
    .int("Use full years")
    .min(1, "At least one year"),
  totalValue: monetaryFieldSchema,
});

const esppSchema = z.object({
  enabled: z.boolean(),
  contributionPercentage: z
    .number({ invalid_type_error: "Contribution is required" })
    .min(0)
    .max(100)
    .optional(),
  growthPercentage: z
    .number({ invalid_type_error: "Growth rate is required" })
    .min(0)
    .optional(),
  purchaseCurrency: currencyEnum.optional(),
  overrideRate: z
    .number({ invalid_type_error: "Invalid override" })
    .positive("Override must be positive")
    .optional(),
});

const raiseSchema = z.object({
  yearOffset: z
    .number({ invalid_type_error: "Year offset is required" })
    .int("Year must be a whole number")
    .min(1, "Year must be at least 1"),
  percentage: z
    .number({ invalid_type_error: "Raise is required" })
    .min(-100)
    .max(100),
});

export const compensationFormSchema = z
  .object({
    recurring: z.object({
      base: monetaryFieldSchema,
      food: monetaryFieldSchema,
      bonusPercentage: z
        .number({ invalid_type_error: "Bonus is required" })
        .min(0)
        .max(100),
    }),
    benefits: z.object({
      percentage: z
        .number({ invalid_type_error: "Benefits percentage is required" })
        .min(0)
        .max(100),
      calculationCurrency: currencyEnum,
    }),
    rsuGrants: z.array(rsuGrantSchema).min(1, "Add at least one grant"),
    espp: esppSchema,
    raises: z.object({
      enabled: z.boolean(),
      items: z.array(raiseSchema),
    }),
  })
  .superRefine((value, ctx) => {
    if (value.espp.enabled) {
      if (value.espp.contributionPercentage === undefined) {
        ctx.addIssue({
          path: ["espp", "contributionPercentage"],
          code: z.ZodIssueCode.custom,
          message: "Contribution percentage is required",
        });
      }
      if (value.espp.growthPercentage === undefined) {
        ctx.addIssue({
          path: ["espp", "growthPercentage"],
          code: z.ZodIssueCode.custom,
          message: "Growth rate is required",
        });
      }
      if (!value.espp.purchaseCurrency) {
        ctx.addIssue({
          path: ["espp", "purchaseCurrency"],
          code: z.ZodIssueCode.custom,
          message: "Select a currency",
        });
      }
    }

    if (value.raises.enabled && value.raises.items.length === 0) {
      ctx.addIssue({
        path: ["raises", "items"],
        code: z.ZodIssueCode.custom,
        message: "Add at least one raise",
      });
    }
  });

export type CompensationFormValues = z.infer<typeof compensationFormSchema>;
export type MonetaryFieldValues = z.infer<typeof monetaryFieldSchema>;
export type RsuGrantValues = z.infer<typeof rsuGrantSchema>;
export type RaiseValues = z.infer<typeof raiseSchema>;
