"use client";

import { useCallback, useEffect, useState } from "react";
import { useForm } from "@tanstack/react-form";

import { BenefitsSection } from "./benefits-section";
import { EsppSection } from "./espp-section";
import { RaisesSection } from "./raises-section";
import { RecurringCompensationSection } from "./recurring-compensation-section";
import { RsuSection } from "./rsu-section";
import { SummaryPanel } from "./summary-panel";
import { getDefaultFormValues } from "./defaults";
import { compensationFormSchema } from "./schema";
import { useCompensationSummary } from "./use-compensation-summary";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { FormContext, useFormContext } from "./form-context";

type SubmissionStatus = "idle" | "success" | "error";

type CalculatorContentProps = {
  readonly status: SubmissionStatus;
  readonly errorCount: number;
};

const CalculatorContent = ({
  status,
  errorCount,
}: CalculatorContentProps) => {
  const summary = useCompensationSummary();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const form = useFormContext();
  const canShowSummary = status === "success" && errorCount === 0 && summary !== null;

  return (
    <div className="flex flex-col gap-8">
      {canShowSummary && summary ? (
        <SummaryPanel summary={summary} status={status} errorCount={errorCount} />
      ) : null}
      <form
        className="flex flex-col gap-6"
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation();
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
          void form.handleSubmit();
        }}
      >
        <div className="grid gap-6 xl:grid-cols-2">
          <div className="space-y-6">
            <RecurringCompensationSection />
            <BenefitsSection />
          </div>
          <div className="space-y-6">
            <RsuSection />
            <EsppSection />
            <RaisesSection />
          </div>
        </div>
        <Card className="border-primary/30 bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/10 shadow-lg shadow-primary/10">
          <CardContent className="flex flex-wrap items-center justify-between gap-4 p-6">
            <div className="space-y-1.5">
              <p className="text-base font-semibold text-foreground">
                {status === "success" && errorCount === 0
                  ? "✓ Calculation Complete"
                  : status === "error"
                    ? "⚠ Please Review Fields"
                    : "Ready to Calculate"}
              </p>
              <p className="text-sm text-muted-foreground">
                {status === "success" && errorCount === 0
                  ? "Your compensation summary has been updated"
                  : status === "error"
                    ? "Some fields need your attention"
                    : "Press calculate to see your total compensation"}
              </p>
            </div>
            <Button type="submit" disabled={false} size="lg">
              Calculate Total
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export const CompensationCalculator = () => {
  const [status, setStatus] = useState<SubmissionStatus>("idle");

  const form = useForm({
    defaultValues: getDefaultFormValues(),
    onSubmit: async ({ value }) => {
      try {
        // Validate the form
        const result = compensationFormSchema.safeParse(value);
        if (result.success) {
          setStatus("success");
        } else {
          setStatus("error");
        }
      } catch {
        setStatus("error");
      }
    },
  });

  const handleResetStatus = useCallback(() => {
    setStatus("idle");
  }, []);

  useEffect(() => {
    if (status !== "idle" && form.state.isDirty) {
      handleResetStatus();
    }
  }, [form.state.isDirty, handleResetStatus, status]);

  const errorCount = form.state.errors.length;

  return (
    <FormContext.Provider value={form}>
      <CalculatorContent
        status={status}
        errorCount={errorCount}
      />
    </FormContext.Provider>
  );
};
