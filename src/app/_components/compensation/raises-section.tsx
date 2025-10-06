'use client';

import { Controller, useFieldArray, useFormContext, useWatch } from "react-hook-form";

import type { CompensationFormValues } from "./schema";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Switch } from "~/components/ui/switch";

export const RaisesSection = () => {
  const { control } = useFormContext<CompensationFormValues>();
  const { fields, append, remove } = useFieldArray({ control, name: "raises.items" });
  const enabled = useWatch({ control, name: "raises.enabled" });

  return (
    <Card className="border-dashed">
      <CardHeader>
        <CardTitle>Expected Salary Raises</CardTitle>
        <CardDescription>
          Model projected raises. Apply currency conversions within each field to capture mixed-currency adjustments.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Controller
          control={control}
          name="raises.enabled"
          render={({ field }) => (
            <div className="flex items-center justify-between rounded-xl border border-border/60 bg-card/80 p-4">
              <div>
                <p className="text-sm font-semibold">Enable Raises</p>
                <p className="text-xs text-muted-foreground">
                  Include planned annual adjustments in your compensation model.
                </p>
              </div>
              <Switch
                checked={field.value}
                onCheckedChange={(checked) => field.onChange(checked)}
                aria-label="Enable raises"
              />
            </div>
          )}
        />
        {enabled ? (
          <div className="flex flex-col gap-4">
            {fields.map((item, index) => (
              <Card key={item.id} className="border border-border/60">
                <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-base">Raise Year {index + 1}</CardTitle>
                    <CardDescription>Specify when and how much this raise impacts compensation.</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => remove(index)} aria-label={`Remove raise ${index + 1}`}>
                    Remove
                  </Button>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                  <Controller
                    control={control}
                    name={`raises.items.${index}.yearOffset`}
                    render={({ field: yearField }) => (
                      <div className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Years from now
                        </p>
                        <Input
                          {...yearField}
                          type="number"
                          inputMode="numeric"
                          min="1"
                          step="1"
                          aria-label="Years from now for raise"
                        />
                        <p
                          className="text-xs text-muted-foreground"
                          title="Number of years from the current period when this raise takes effect."
                        >
                          Years from today when this raise applies.
                        </p>
                      </div>
                    )}
                  />
                  <Controller
                    control={control}
                    name={`raises.items.${index}.percentage`}
                    render={({ field: percentageField }) => (
                      <div className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Raise percentage
                        </p>
                        <Input
                          {...percentageField}
                          type="number"
                          inputMode="decimal"
                          min="-100"
                          max="200"
                          step="0.1"
                          aria-label="Raise percentage"
                        />
                        <p
                          className="text-xs text-muted-foreground"
                          title="Percentage increase (or decrease) applied to salary in the specified year."
                        >
                          Percentage applied to salary and recurring allowances in that year.
                        </p>
                      </div>
                    )}
                  />
                </CardContent>
              </Card>
            ))}
            <Button
              type="button"
              variant="outline"
              className="self-start"
              onClick={() =>
                append({
                  yearOffset: fields.length + 1,
                  percentage: 5,
                })
              }
              aria-label="Add salary raise"
            >
              Add Annual Raise
            </Button>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};
