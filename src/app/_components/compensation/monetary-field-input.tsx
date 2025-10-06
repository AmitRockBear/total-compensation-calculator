'use client';

import type { FieldPath } from "react-hook-form";
import { Controller, useFormContext } from "react-hook-form";

import { currencyOptions } from "./constants";
import type { CompensationFormValues } from "./schema";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

type MonetaryFieldInputProps = {
  amountName: FieldPath<CompensationFormValues>;
  currencyName: FieldPath<CompensationFormValues>;
  overrideName: FieldPath<CompensationFormValues>;
  label: string;
  description?: string;
};

export const MonetaryFieldInput = ({
  amountName,
  currencyName,
  overrideName,
  label,
  description,
}: MonetaryFieldInputProps) => {
  const { control } = useFormContext<CompensationFormValues>();

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-base">{label}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-3">
        <Controller
          control={control}
          name={amountName}
          render={({ field }) => {
            const resolvedValue =
              typeof field.value === "number"
                ? field.value
                : typeof field.value === "string"
                  ? field.value
                  : "";

            return (
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Amount</p>
                <Input
                  {...field}
                  value={resolvedValue}
                  onChange={(event) => {
                    const rawValue = event.target.value;
                    if (rawValue === "") {
                      field.onChange(undefined);
                      return;
                    }

                    const numeric = Number(rawValue);
                    field.onChange(Number.isNaN(numeric) ? undefined : numeric);
                  }}
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  min="0"
                />
              </div>
            );
          }}
        />
        <Controller
          control={control}
          name={currencyName}
          render={({ field }) => (
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Currency</p>
              <Select
                value={typeof field.value === "string" ? field.value : preferredFallback(field.value)}
                onValueChange={(value) => {
                  field.onChange(value);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Currency" />
                </SelectTrigger>
                <SelectContent>
                  {currencyOptions.map((currency) => (
                    <SelectItem key={currency} value={currency}>
                      {currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        />
        <Controller
          control={control}
          name={overrideName}
          render={({ field }) => {
            const resolvedValue =
              typeof field.value === "number" || typeof field.value === "string"
                ? field.value
                : "";

            return (
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Override rate
                </p>
                <Input
                  {...field}
                  value={resolvedValue}
                  onChange={(event) => {
                    const rawValue = event.target.value;
                    if (rawValue === "") {
                      field.onChange(undefined);
                      return;
                    }

                    const numeric = Number(rawValue);
                    field.onChange(Number.isNaN(numeric) ? undefined : numeric);
                  }}
                  type="number"
                  inputMode="decimal"
                  step="0.0001"
                  min="0"
                  placeholder="Use default"
                />
              </div>
            );
          }}
        />
      </CardContent>
    </Card>
  );
};

const preferredFallback = (value: unknown) => (typeof value === "string" ? value : "");
