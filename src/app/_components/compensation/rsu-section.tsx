'use client';

import { Controller, useFieldArray, useFormContext } from "react-hook-form";

import { useCompensationSettings } from "./context";
import { MonetaryFieldInput } from "./monetary-field-input";
import type { CompensationFormValues } from "./schema";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";

export const RsuSection = () => {
  const { preferredCurrency } = useCompensationSettings();
  const { control } = useFormContext<CompensationFormValues>();
  const { fields, append, remove } = useFieldArray({ control, name: "rsuGrants" });

  return (
    <Card className="border-dashed">
      <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <CardTitle>RSU Grants</CardTitle>
          <CardDescription>
            Track grant values, vesting schedules, and currency conversions. Values are evenly distributed across vesting
            years.
          </CardDescription>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            append({
              name: "New Grant",
              startDate: new Date().toISOString().slice(0, 10),
              vestingYears: 4,
              totalValue: {
                amount: 0,
                currency: preferredCurrency,
              },
            });
          }}
          aria-label="Add RSU Grant"
        >
          Add RSU Grant
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {fields.map((field, index) => (
          <Card key={field.id} className="border border-border/60">
            <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <CardTitle className="text-base">
                  {field.name || `Grant ${index + 1}`}
                </CardTitle>
                <CardDescription>Configure vesting and valuation for this grant.</CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (fields.length > 1) {
                    remove(index);
                  }
                }}
                aria-label={`Remove grant ${index + 1}`}
              >
                Remove
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Controller
                  control={control}
                  name={`rsuGrants.${index}.name`}
                  render={({ field: fieldController }) => (
                    <div className="space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Grant name</p>
                      <Input {...fieldController} type="text" aria-label="Grant name" />
                      <p className="text-xs text-muted-foreground" title="Label for identifying this grant.">
                        Add a descriptive name to identify this grant.
                      </p>
                    </div>
                  )}
                />
                <Controller
                  control={control}
                  name={`rsuGrants.${index}.vestingYears`}
                  render={({ field: fieldController }) => (
                    <div className="space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Vesting duration (years)
                      </p>
                      <Input
                        {...fieldController}
                        type="number"
                        inputMode="numeric"
                        min="1"
                        step="1"
                        aria-label="Vesting duration in years"
                      />
                      <p className="text-xs text-muted-foreground" title="Number of years over which the grant vests.">
                        Number of years over which the total value is distributed.
                      </p>
                    </div>
                  )}
                />
                <Controller
                  control={control}
                  name={`rsuGrants.${index}.startDate`}
                  render={({ field: fieldController }) => (
                    <div className="space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Start date</p>
                      <Input {...fieldController} type="date" aria-label="Grant start date" />
                      <p className="text-xs text-muted-foreground" title="Date when vesting starts.">
                        Vesting begins on this date.
                      </p>
                    </div>
                  )}
                />
              </div>
              <MonetaryFieldInput
                amountName={`rsuGrants.${index}.totalValue.amount`}
                currencyName={`rsuGrants.${index}.totalValue.currency`}
                overrideName={`rsuGrants.${index}.totalValue.overrideRate`}
                label="Total grant value"
                description="Total value of the grant in the selected currency. Optional override applies when converting from grant currency."
              />
            </CardContent>
          </Card>
        ))}
        <p className="text-xs text-muted-foreground" title="Exchange rate note">
          Enter override rates to handle grants issued in different currencies relative to the output currency.
        </p>
      </CardContent>
    </Card>
  );
};
