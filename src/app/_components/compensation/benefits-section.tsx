'use client';

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

export const BenefitsSection = () => {
  const { control } = useFormContext<CompensationFormValues>();

  return (
    <Card className="border-dashed">
      <CardHeader>
        <CardTitle>Annual Benefits</CardTitle>
        <CardDescription>
          Apply benefit percentages with localized currency assumptions for accurate conversions.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <Controller
          control={control}
          name="benefits.percentage"
          render={({ field }) => (
            <Card className="border border-border/60">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm uppercase tracking-wide text-muted-foreground">
                  Benefits Percentage
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input
                  {...field}
                  type="number"
                  inputMode="decimal"
                  min="0"
                  max="100"
                  step="0.1"
                  aria-label="Benefits percentage"
                />
                <p
                  className="text-xs text-muted-foreground"
                  title="Percentage of annual compensation allocated to benefits."
                >
                  Share of annual compensation allocated to benefits.
                </p>
              </CardContent>
            </Card>
          )}
        />
        <Controller
          control={control}
          name="benefits.calculationCurrency"
          render={({ field }) => (
            <Card className="border border-border/60">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm uppercase tracking-wide text-muted-foreground">
                  Calculation Currency
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Select value={field.value} onValueChange={(value) => field.onChange(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencyOptions.map((currency) => (
                      <SelectItem key={currency} value={currency}>
                        {currency}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p
                  className="text-xs text-muted-foreground"
                  title="Currency context used for benefits before converting to the output currency."
                >
                  Currency context for benefits before conversion to your desired output.
                </p>
              </CardContent>
            </Card>
          )}
        />
      </CardContent>
    </Card>
  );
};
