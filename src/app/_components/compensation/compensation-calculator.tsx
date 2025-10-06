'use client';

import { useCallback, useEffect, useMemo, useState } from "react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { BenefitsSection } from "./benefits-section";
import { EsppSection } from "./espp-section";
import { GlobalSettings } from "./global-settings";
import { RaisesSection } from "./raises-section";
import { RecurringCompensationSection } from "./recurring-compensation-section";
import { RsuSection } from "./rsu-section";
import { SummaryPanel } from "./summary-panel";
import { getDefaultFormValues } from "./defaults";
import { compensationFormSchema, type CompensationFormValues } from "./schema";
import { useCompensationSummary } from "./use-compensation-summary";

type SubmissionStatus = "idle" | "success" | "error";

type CalculatorContentProps = {
  readonly onCalculate: () => void;
  readonly status: SubmissionStatus;
  readonly onResetStatus: () => void;
};

const CalculatorContent = ({
  onCalculate,
  status,
  onResetStatus,
}: CalculatorContentProps) => {
  const summary = useCompensationSummary();
  const {
    formState: { isSubmitting, isDirty, errors },
  } = useFormContext<CompensationFormValues>();

  useEffect(() => {
    if (status !== "idle" && isDirty) {
      onResetStatus();
    }
  }, [isDirty, onResetStatus, status]);

  const errorCount = Object.keys(errors).length;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
      <form
        className="flex flex-col gap-6"
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          onCalculate();
        }}
      >
        <GlobalSettings />
        <RecurringCompensationSection />
        <BenefitsSection />
        <RsuSection />
        <EsppSection />
        <RaisesSection />
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-white/10 bg-white/5 p-5 shadow-lg backdrop-blur">
          <div className="text-sm text-white/70">
            {status === "success" && errorCount === 0
              ? "Snapshot updated. Charts reflect the latest calculation."
              : status === "error"
                ? "Review highlighted fields to complete calculation."
                : "Press calculate to validate inputs and capture a snapshot."}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-full border border-white/20 bg-blue-500/90 px-6 py-2 text-sm font-semibold text-white shadow transition hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Calculating..." : "Calculate Total Compensation"}
          </button>
        </div>
      </form>
      <SummaryPanel summary={summary} status={status} errorCount={errorCount} />
    </div>
  );
};

export const CompensationCalculator = () => {
  const [status, setStatus] = useState<SubmissionStatus>("idle");

  const methods = useForm<CompensationFormValues>({
    resolver: zodResolver(compensationFormSchema),
    defaultValues: useMemo(() => getDefaultFormValues(), []),
    mode: "onChange",
  });

  const { handleSubmit } = methods;

  const handleSuccess = useCallback(() => {
    setStatus("success");
  }, []);

  const handleError = useCallback(() => {
    setStatus("error");
  }, []);

  const handleResetStatus = useCallback(() => {
    setStatus("idle");
  }, []);

  const onCalculate = useCallback(() => {
    void handleSubmit(
      () => {
        handleSuccess();
      },
      () => {
        handleError();
      },
    )();
  }, [handleError, handleSubmit, handleSuccess]);

  return (
    <FormProvider {...methods}>
      <CalculatorContent
        onCalculate={onCalculate}
        status={status}
        onResetStatus={handleResetStatus}
      />
    </FormProvider>
  );
};
