"use client";

/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return */

import { useFormContext, type CompensationFieldName } from "./form-context";
import { currencyOptions } from "./constants";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

type MonetaryFieldInputProps = {
  amountName: CompensationFieldName;
  currencyName: CompensationFieldName;
  overrideName: CompensationFieldName;
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
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const form = useFormContext();

  return (
    <Card className="border-2 border-accent/30 bg-gradient-to-br from-background to-accent/5 shadow-sm">
      <CardHeader className="space-y-1.5 pb-4">
        <CardTitle className="text-lg font-semibold text-accent-foreground">{label}</CardTitle>
        {description ? <CardDescription className="text-sm">{description}</CardDescription> : null}
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-3">
        <form.Field name={amountName}>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {(field: any) => {
            const resolvedValue =
              typeof field.state.value === "number"
                ? field.state.value
                : typeof field.state.value === "string"
                  ? field.state.value
                  : "";

            return (
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Amount
                </label>
                <Input
                  name={field.name}
                  value={resolvedValue}
                  onBlur={field.handleBlur}
                  onChange={(event) => {
                    const rawValue = event.target.value;
                    if (rawValue === "") {
                      field.handleChange(undefined);
                      return;
                    }

                    const numeric = Number(rawValue);
                    field.handleChange(Number.isNaN(numeric) ? undefined : numeric);
                  }}
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                />
              </div>
            );
          }}
        </form.Field>
        <form.Field name={currencyName}>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {(field: any) => (
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Currency
              </label>
              <Select
                value={
                  typeof field.state.value === "string"
                    ? field.state.value
                    : preferredFallback(field.state.value)
                }
                onValueChange={(value) => {
                  field.handleChange(value);
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
        </form.Field>
        <form.Field name={overrideName}>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {(field: any) => {
            const resolvedValue =
              typeof field.state.value === "number" || typeof field.state.value === "string"
                ? field.state.value
                : "";

            return (
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Override Rate
                </label>
                <Input
                  name={field.name}
                  value={resolvedValue}
                  onBlur={field.handleBlur}
                  onChange={(event) => {
                    const rawValue = event.target.value;
                    if (rawValue === "") {
                      field.handleChange(undefined);
                      return;
                    }

                    const numeric = Number(rawValue);
                    field.handleChange(Number.isNaN(numeric) ? field.state.value : numeric);
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
        </form.Field>
      </CardContent>
    </Card>
  );
};

const preferredFallback = (value: unknown) =>
  typeof value === "string" ? value : "";
