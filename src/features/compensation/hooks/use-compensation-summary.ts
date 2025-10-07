
import { useMemo } from "react";
import { useStore } from "@tanstack/react-form";

import { useCompensationSettings } from "~/features/compensation/components/context";
import { buildCompensationSummary } from "~/features/compensation/lib/utils";
import { useFormContext } from "~/features/compensation/components/forms/form-context";
import type { CompensationFormValues } from "~/features/compensation/types/schema";

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
