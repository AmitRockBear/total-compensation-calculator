'use client';

import { useCompensationSettings } from "~/features/compensation/components/context";
import { useFormContext } from "~/features/compensation/components/forms/form-context";
import type { EsppPlanValues } from "~/features/compensation/types/schema";
import { currencyOptions, type CurrencyCode } from "~/features/compensation/lib/constants";
import { Button } from "~/components/ui/button";
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

export const EsppSection = () => {
  const { preferredCurrency } = useCompensationSettings();
  const form = useFormContext();
  const plans = form.state.values.esppPlans || [];

  return (
    <Card className="border-primary/20 from-card to-primary/5 bg-gradient-to-br shadow-lg">
      <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <CardTitle className="text-primary text-xl font-bold">
            Employee Stock Purchase Plan
          </CardTitle>
          <CardDescription>
            Track ESPP purchase periods with automatic currency conversion
          </CardDescription>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            form.setFieldValue("esppPlans", [
              ...plans,
              {
                name: "ESPP Period",
                startDate: new Date().toISOString().slice(0, 10),
                durationMonths: 6,
                contributionPercentage: 5,
                growthPercentage: 10,
                purchaseCurrency: preferredCurrency,
              },
            ]);
          }}
          aria-label="Add ESPP Plan"
        >
          + Add Plan
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <form.Field name="esppPlans" mode="array">
          {(_field: { name: string; state: { value: unknown }; handleChange: (value: unknown) => void; handleBlur: () => void }) => {
            return plans.map((_plan: EsppPlanValues, index: number) => (
              <Card
                key={index}
                className="border-accent/30 from-background to-accent/5 bg-gradient-to-br shadow-sm"
              >
                <CardHeader className="flex flex-col gap-3 pb-3 sm:flex-row sm:items-center sm:justify-between">
                  <CardTitle className="text-accent-foreground text-lg font-semibold">
                    Plan {index + 1}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (plans.length > 0) {
                        form.setFieldValue(
                          "esppPlans",
                          plans.filter(
                            (_p: EsppPlanValues, i: number) => i !== index,
                          ),
                        );
                      }
                    }}
                    aria-label={`Remove plan ${index + 1}`}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    Remove
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <form.Field name={`esppPlans[${index}].name`}>
                      {(subField: { name: string; state: { value: unknown }; handleChange: (value: unknown) => void; handleBlur: () => void }) => {
                        const value = typeof subField.state.value === "string" ? subField.state.value : "";
                        return (
                          <div className="space-y-2">
                            <label className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                              Plan Name
                            </label>
                            <Input
                              name={subField.name}
                              value={value}
                              onBlur={subField.handleBlur}
                              onChange={(e) => subField.handleChange(e.target.value)}
                              type="text"
                              aria-label="Plan name"
                              placeholder="e.g., H1 2025"
                            />
                          </div>
                        );
                      }}
                    </form.Field>
                    <form.Field name={`esppPlans[${index}].startDate`}>
                      {(subField: { name: string; state: { value: unknown }; handleChange: (value: unknown) => void; handleBlur: () => void }) => {
                        const value = typeof subField.state.value === "string" ? subField.state.value : "";
                        return (
                          <div className="space-y-2">
                            <label className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                              Start Date
                            </label>
                            <Input
                              name={subField.name}
                              value={value}
                              onBlur={subField.handleBlur}
                              onChange={(e) => subField.handleChange(e.target.value)}
                              type="date"
                              aria-label="Plan start date"
                            />
                          </div>
                        );
                      }}
                    </form.Field>
                    <form.Field name={`esppPlans[${index}].durationMonths`}>
                      {(subField: { name: string; state: { value: unknown }; handleChange: (value: unknown) => void; handleBlur: () => void }) => {
                        const value = typeof subField.state.value === "number" || typeof subField.state.value === "string" ? subField.state.value : "";
                        return (
                          <div className="space-y-2">
                            <label className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                              Duration (Months)
                            </label>
                            <Input
                              name={subField.name}
                              value={value}
                              onBlur={subField.handleBlur}
                              onChange={(e) => subField.handleChange(Number(e.target.value))}
                              type="number"
                              inputMode="numeric"
                              min="1"
                              step="1"
                              aria-label="Duration in months"
                              placeholder="6"
                            />
                          </div>
                        );
                      }}
                    </form.Field>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <form.Field name={`esppPlans[${index}].contributionPercentage`}>
            {(contributionField: { name: string; state: { value: unknown }; handleChange: (value: unknown) => void; handleBlur: () => void }) => {
              const fieldValue = contributionField.state.value;
              const value = typeof fieldValue === "number" || typeof fieldValue === "string" ? fieldValue : "";
              
              return (
                <div className="space-y-2">
                  <label className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                    Contribution Percentage (%)
                  </label>
                  <Input
                    name={contributionField.name}
                    value={value}
                    onBlur={contributionField.handleBlur}
                    onChange={(event) => {
                      const rawValue = event.target.value;
                      if (rawValue === "") {
                        contributionField.handleChange(undefined);
                        return;
                      }

                      const numeric = Number(rawValue);
                      contributionField.handleChange(
                        Number.isNaN(numeric) ? contributionField.state.value : numeric
                      );
                    }}
                    type="number"
                    inputMode="decimal"
                    step="0.1"
                    min="0"
                    max="100"
                    aria-label="Contribution percentage"
                    placeholder="e.g., 5"
                  />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Percentage of annual base salary contributed to ESPP
                  </p>
                </div>
              );
            }}
          </form.Field>
                    <form.Field name={`esppPlans[${index}].growthPercentage`}>
            {(growthField: { name: string; state: { value: unknown }; handleChange: (value: unknown) => void; handleBlur: () => void }) => {
              const fieldValue = growthField.state.value;
              const value = typeof fieldValue === "number" || typeof fieldValue === "string" ? fieldValue : "";
              
              return (
                <div className="space-y-2">
                  <label className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                    Expected Annual Growth (%)
                  </label>
                  <Input
                    name={growthField.name}
                    value={value}
                    onBlur={growthField.handleBlur}
                    onChange={(event) => {
                      const rawValue = event.target.value;
                      if (rawValue === "") {
                        growthField.handleChange(undefined);
                        return;
                      }

                      const numeric = Number(rawValue);
                      growthField.handleChange(
                        Number.isNaN(numeric) ? growthField.state.value : numeric
                      );
                    }}
                    type="number"
                    inputMode="decimal"
                    step="0.1"
                    min="0"
                    max="100"
                    aria-label="Expected annual growth percentage"
                    placeholder="e.g., 10"
                  />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Forecasted annual growth rate
                  </p>
                </div>
              );
            }}
          </form.Field>
                    <form.Field name={`esppPlans[${index}].purchaseCurrency`}>
            {(currencyField: { name: string; state: { value: unknown }; handleChange: (value: unknown) => void; handleBlur: () => void }) => {
              const fieldValue = currencyField.state.value;
              const value = typeof fieldValue === "string" ? fieldValue : preferredCurrency || "USD";
              
              return (
                <div className="space-y-2">
                  <label className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                    Purchase Currency
                  </label>
                  <Select
                    value={value}
                    onValueChange={(value) => {
                      const selected = value as CurrencyCode;
                      currencyField.handleChange(selected);
                    }}
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
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Currency for ESPP purchases
                  </p>
                </div>
              );
            }}
          </form.Field>
                    <form.Field name={`esppPlans[${index}].overrideRate`}>
            {(overrideField: { name: string; state: { value: unknown }; handleChange: (value: unknown) => void; handleBlur: () => void }) => {
              const fieldValue = overrideField.state.value;
              const value = typeof fieldValue === "number" || typeof fieldValue === "string" ? fieldValue : "";
              
              return (
                <div className="space-y-2">
                  <label className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                    Exchange Rate Override
                  </label>
                  <Input
                    name={overrideField.name}
                    value={value}
                    onBlur={overrideField.handleBlur}
                    onChange={(event) => {
                      const rawValue = event.target.value;
                      if (rawValue === "") {
                        overrideField.handleChange(undefined);
                        return;
                      }

                      const numeric = Number(rawValue);
                      overrideField.handleChange(
                        Number.isNaN(numeric) ? overrideField.state.value : numeric
                      );
                    }}
                    type="number"
                    inputMode="decimal"
                    step="0.0001"
                    min="0"
                    aria-label="ESPP exchange rate override"
                    placeholder="Use default"
                  />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Optional conversion override
                  </p>
                </div>
              );
                      }}
                    </form.Field>
                  </div>
                </CardContent>
              </Card>
            ));
          }}
        </form.Field>
      </CardContent>
    </Card>
  );
};
