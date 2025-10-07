"use client";

import { createContext, useContext } from "react";
import type { ReactFormExtendedApi } from "@tanstack/react-form";

import type { CompensationFormValues } from "./schema";

export type CompensationFormApi = ReactFormExtendedApi<
  CompensationFormValues,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined
>;

export const FormContext = createContext<CompensationFormApi | null>(null);

export const useFormContext = (): CompensationFormApi => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useFormContext must be used within a FormContext.Provider");
  }
  return context;
};

export type CompensationFieldName = Parameters<CompensationFormApi["Field"]>[0]["name"];
