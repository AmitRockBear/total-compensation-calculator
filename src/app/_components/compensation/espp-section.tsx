'use client';

import { Controller, useFormContext, useWatch } from "react-hook-form";

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
import { Switch } from "~/components/ui/switch";

export const EsppSection = () => {
  const { control } = useFormContext<CompensationFormValues>();
  const enabled = useWatch({ control, name: "espp.enabled" });

  return (
    <Card className="border-dashed">
      <CardHeader>
        <CardTitle>Employee Stock Purchase Plan</CardTitle>
        <CardDescription>
          Model contributions and expected stock growth. Toggle ESPP participation to reveal additional details.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Controller
          control={control}
          name="espp.enabled"
          render={({ field }) => (
            <div className="flex items-center justify-between rounded-xl border border-border/60 bg-card/80 p-4">
              <div>
                <p className="text-sm font-semibold">Enable ESPP</p>
                <p className="text-xs text-muted-foreground">
                  Toggle participation to capture contributions and expected returns.
                </p>
              </div>
              <Switch
                checked={field.value}
                onCheckedChange={(checked) => field.onChange(checked)}
                aria-label="Enable ESPP"
              />
            </div>
          )}
        />
        {enabled ? (
          <div className="grid gap-4 md:grid-cols-2">
            <Controller
              control={control}
              name="espp.contributionPercentage"
              render={({ field: contributionField }) => (
                <Card className="border border-border/60">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm uppercase tracking-wide text-muted-foreground">
                      Contribution Percentage
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Input
                      {...contributionField}
                      type="number"
                      inputMode="decimal"
                      min="0"
                      max="100"
                      step="0.1"
                      aria-label="ESPP contribution percentage"
                    />
                    <p className="text-xs text-muted-foreground" title="Percentage of salary contributed to ESPP.">
                      Portion of annual salary allocated to ESPP.
                    </p>
                  </CardContent>
                </Card>
              )}
            />
            <Controller
              control={control}
              name="espp.growthPercentage"
              render={({ field: growthField }) => (
                <Card className="border border-border/60">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm uppercase tracking-wide text-muted-foreground">
                      Expected Stock Growth (% per year)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Input
                      {...growthField}
                      type="number"
                      inputMode="decimal"
                      min="0"
                      max="200"
                      step="0.1"
                      aria-label="Expected stock growth percentage"
                    />
                    <p
                      className="text-xs text-muted-foreground"
                      title="Anticipated annual stock growth applied to contributions."
                    >
                      Forecasted annual growth applied to ESPP contributions.
                    </p>
                  </CardContent>
                </Card>
              )}
            />
            <Controller
              control={control}
              name="espp.purchaseCurrency"
              render={({ field: currencyField }) => (
                <Card className="border border-border/60">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm uppercase tracking-wide text-muted-foreground">
                      ESPP Purchase Currency
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Select
                      value={currencyField.value ?? ""}
                      onValueChange={(value) => currencyField.onChange(value)}
                    >
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
                    <p className="text-xs text-muted-foreground" title="Currency used when purchasing ESPP shares.">
                      Currency used when purchasing ESPP shares.
                    </p>
                  </CardContent>
                </Card>
              )}
            />
            <Controller
              control={control}
              name="espp.overrideRate"
              render={({ field: overrideField }) => (
                <Card className="border border-border/60">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm uppercase tracking-wide text-muted-foreground">
                      Exchange Rate Override
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Input
                      {...overrideField}
                      value={overrideField.value ?? ""}
                      onChange={(event) => {
                        const rawValue = event.target.value;
                        if (rawValue === "") {
                          overrideField.onChange(undefined);
                          return;
                        }

                        const numeric = Number(rawValue);
                        overrideField.onChange(Number.isNaN(numeric) ? overrideField.value : numeric);
                      }}
                      type="number"
                      inputMode="decimal"
                      step="0.0001"
                      min="0"
                      aria-label="ESPP exchange rate override"
                    />
                    <p className="text-xs text-muted-foreground" title="Override for converting ESPP contributions.">
                      Optional override for conversions from purchase currency to your desired output.
                    </p>
                  </CardContent>
                </Card>
              )}
            />
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};
