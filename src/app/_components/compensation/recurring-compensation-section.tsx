'use client';

/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return */

import { MonetaryFieldInput } from "./monetary-field-input";
import { useFormContext } from "./form-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";

export const RecurringCompensationSection = () => {
  const form = useFormContext();

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-card to-secondary/5 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-primary">Recurring Compensation</CardTitle>
        <CardDescription>
          Base salary and allowances that convert to your preferred currency
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
        <Card className="border-accent/30 bg-gradient-to-br from-background to-accent/5 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-accent-foreground">
              Annual Bonus Rate
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <form.Field name="recurring.bonusPercentage">
              {(field) => (
                <Input
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(Number(e.target.value))}
                  type="number"
                  inputMode="decimal"
                  min="0"
                  max="100"
                  step="0.1"
                  placeholder="e.g., 15"
                />
              )}
            </form.Field>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Percentage applied to the converted base salary when calculating yearly bonuses.
            </p>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};
