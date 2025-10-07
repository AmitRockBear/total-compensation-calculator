'use client';

/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return */

import { useFormContext } from "./form-context";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Switch } from "~/components/ui/switch";

export const RaisesSection = () => {
  const form = useFormContext();
  const enabled = form.state.values.raises?.enabled;
  const items = form.state.values.raises?.items || [];

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-card to-accent/5 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-primary">Expected Salary Raises</CardTitle>
        <CardDescription>
          Model projected salary increases over time
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form.Field name="raises.enabled">
          {(field) => (
            <div className="flex items-center justify-between rounded-xl border-2 border-accent/30 bg-gradient-to-r from-accent/10 to-accent/5 p-5 shadow-sm">
              <div>
                <p className="text-base font-semibold text-foreground">Enable Raises</p>
                <p className="text-sm text-muted-foreground">
                  Include planned annual adjustments
                </p>
              </div>
              <Switch
                checked={field.state.value}
                onCheckedChange={(checked) => field.handleChange(checked)}
                aria-label="Enable raises"
              />
            </div>
          )}
        </form.Field>
        {enabled ? (
          <div className="flex flex-col gap-4">
            {items.map((_: any, index: number) => (
              <Card key={index} className="border-accent/30 bg-gradient-to-br from-background to-accent/5 shadow-sm">
                <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-3">
                  <CardTitle className="text-lg font-semibold text-accent-foreground">Raise Year {index + 1}</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      form.setFieldValue(
                        "raises.items",
                        items.filter((_: any, i: number) => i !== index)
                      );
                    }}
                    aria-label={`Remove raise ${index + 1}`}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    Remove
                  </Button>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                  <form.Field name={`raises.items[${index}].yearOffset`}>
                    {(yearField) => (
                      <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Years from Now
                        </label>
                        <Input
                          name={yearField.name}
                          value={yearField.state.value}
                          onBlur={yearField.handleBlur}
                          onChange={(e) => yearField.handleChange(Number(e.target.value))}
                          type="number"
                          inputMode="numeric"
                          min="1"
                          step="1"
                          aria-label="Years from now for raise"
                          placeholder="1"
                        />
                      </div>
                    )}
                  </form.Field>
                  <form.Field name={`raises.items[${index}].percentage`}>
                    {(percentageField) => (
                      <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Raise Percentage
                        </label>
                        <Input
                          name={percentageField.name}
                          value={percentageField.state.value}
                          onBlur={percentageField.handleBlur}
                          onChange={(e) => percentageField.handleChange(Number(e.target.value))}
                          type="number"
                          inputMode="decimal"
                          min="-100"
                          max="200"
                          step="0.1"
                          aria-label="Raise percentage"
                          placeholder="5.0"
                        />
                      </div>
                    )}
                  </form.Field>
                </CardContent>
              </Card>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="self-start"
              onClick={() => {
                form.setFieldValue("raises.items", [
                  ...items,
                  {
                    yearOffset: items.length + 1,
                    percentage: 5,
                  },
                ]);
              }}
              aria-label="Add salary raise"
            >
              + Add Raise
            </Button>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};
