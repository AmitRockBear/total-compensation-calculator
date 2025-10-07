'use client';

/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return */

import { useCompensationSettings } from "./context";
import { useFormContext } from "./form-context";
import { MonetaryFieldInput } from "./monetary-field-input";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";

export const RsuSection = () => {
  const { preferredCurrency } = useCompensationSettings();
  const form = useFormContext();
  const grants = form.state.values.rsuGrants || [];

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/5 shadow-lg">
      <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <CardTitle className="text-xl font-bold text-primary">RSU Grants</CardTitle>
          <CardDescription>
            Track grant values and vesting schedules with automatic currency conversion
          </CardDescription>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            form.setFieldValue("rsuGrants", [
              ...grants,
              {
                name: "New Grant",
                startDate: new Date().toISOString().slice(0, 10),
                vestingYears: 4,
                totalValue: {
                  amount: 0,
                  currency: preferredCurrency,
                },
              },
            ]);
          }}
          aria-label="Add RSU Grant"
        >
          + Add Grant
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <form.Field name="rsuGrants" mode="array">
          {(_field) => {
            return grants.map((_: any, index: number) => (
              <Card key={index} className="border-accent/30 bg-gradient-to-br from-background to-accent/5 shadow-sm">
                <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-3">
                  <CardTitle className="text-lg font-semibold text-accent-foreground">
                    {grants[index]?.name ?? `Grant ${index + 1}`}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (grants.length > 1) {
                        form.setFieldValue(
                          "rsuGrants",
                          grants.filter((_: any, i: number) => i !== index)
                        );
                      }
                    }}
                    aria-label={`Remove grant ${index + 1}`}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    Remove
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <form.Field name={`rsuGrants[${index}].name`}>
                      {(subField) => (
                        <div className="space-y-2">
                          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Grant Name</label>
                          <Input
                            name={subField.name}
                            value={subField.state.value}
                            onBlur={subField.handleBlur}
                            onChange={(e) => subField.handleChange(e.target.value)}
                            type="text"
                            aria-label="Grant name"
                            placeholder="e.g., Initial Grant"
                          />
                        </div>
                      )}
                    </form.Field>
                    <form.Field name={`rsuGrants[${index}].vestingYears`}>
                      {(subField) => (
                        <div className="space-y-2">
                          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Vesting Years
                          </label>
                          <Input
                            name={subField.name}
                            value={subField.state.value}
                            onBlur={subField.handleBlur}
                            onChange={(e) => subField.handleChange(Number(e.target.value))}
                            type="number"
                            inputMode="numeric"
                            min="1"
                            step="1"
                            aria-label="Vesting duration in years"
                            placeholder="4"
                          />
                        </div>
                      )}
                    </form.Field>
                    <form.Field name={`rsuGrants[${index}].startDate`}>
                      {(subField) => (
                        <div className="space-y-2">
                          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Start Date</label>
                          <Input
                            name={subField.name}
                            value={subField.state.value}
                            onBlur={subField.handleBlur}
                            onChange={(e) => subField.handleChange(e.target.value)}
                            type="date"
                            aria-label="Grant start date"
                          />
                        </div>
                      )}
                    </form.Field>
                  </div>
                  <MonetaryFieldInput
                    amountName={`rsuGrants[${index}].totalValue.amount`}
                    currencyName={`rsuGrants[${index}].totalValue.currency`}
                    overrideName={`rsuGrants[${index}].totalValue.overrideRate`}
                    label="Total Grant Value"
                    description="Total value distributed across vesting years"
                  />
                </CardContent>
              </Card>
            ));
          }}
        </form.Field>
      </CardContent>
    </Card>
  );
};
