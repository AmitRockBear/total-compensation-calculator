'use client';

import { useMemo } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { useCompensationSettings } from "./context";
import { buildCompensationSummary } from "./utils";
import type { CompensationFormValues } from "./schema";

export const useCompensationSummary = () => {
  const { control } = useFormContext<CompensationFormValues>();
  const formValues = useWatch({ control });
  const { preferredCurrency, defaultRates } = useCompensationSettings();

  const summary = useMemo(() => {
    if (!formValues) {
      return null;
    }

    return buildCompensationSummary(
      formValues,
      preferredCurrency,
      defaultRates,
    );
  }, [defaultRates, formValues, preferredCurrency]);

  return summary;
};
