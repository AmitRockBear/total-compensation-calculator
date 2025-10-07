"use client";

import { useMemo } from "react";
import { useStore } from "@tanstack/react-form";

import { useCompensationSettings } from "./context";
import { buildCompensationSummary } from "./utils";
import { useFormContext } from "./form-context";
import type { CompensationFormValues } from "./schema";

export const useCompensationSummary = () => {
  const form = useFormContext();
  const values = useStore(form.store, (state) => state.values) as CompensationFormValues | null | undefined;
  const { preferredCurrency, defaultRates } = useCompensationSettings();

  const summary = useMemo(() => {
    const formValues = values;
    if (!formValues) {
      return null;
    }

    return buildCompensationSummary(
      formValues,
      preferredCurrency,
      defaultRates,
    );
  }, [defaultRates, preferredCurrency, values]);

  return summary;
};
