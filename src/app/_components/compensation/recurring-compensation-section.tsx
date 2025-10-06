'use client';

import { Controller, useFormContext } from "react-hook-form";

import { MonetaryFieldInput } from "./monetary-field-input";
import type { CompensationFormValues } from "./schema";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";

export const RecurringCompensationSection = () => {
  const { control } = useFormContext<CompensationFormValues>();

  return (
    <Card className="border-dashed">
      <CardHeader>
        <CardTitle>Recurring Compensation</CardTitle>
        <CardDescription>
          Capture base salary and allowances. Values automatically convert to your preferred currency.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <MonetaryFieldInput
          amountName="recurring.base.amount"
          currencyName="recurring.base.currency"
          overrideName="recurring.base.overrideRate"
          label="Monthly Base Salary"
          description="Monthly base salary before bonuses and allowances."
        />
        <MonetaryFieldInput
          amountName="recurring.food.amount"
          currencyName="recurring.food.currency"
          overrideName="recurring.food.overrideRate"
          label="Monthly Food Allowance"
          description="Monthly allowance for meals or groceries, if applicable."
        />
        <Card className="border border-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm uppercase tracking-wide text-muted-foreground">
              Annual Bonus Rate
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Controller
              control={control}
              name="recurring.bonusPercentage"
              render={({ field }) => (
                <Input
                  {...field}
                  type="number"
                  inputMode="decimal"
                  min="0"
                  max="100"
                  step="0.1"
                />
              )}
            />
            <p className="text-xs text-muted-foreground" title="Annual bonus percentage applied to the converted base salary.">
              Percentage applied to the converted base salary when calculating yearly bonuses.
            </p>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};
