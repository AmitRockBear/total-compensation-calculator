'use client';

import { useFormContext } from "./form-context";
import { currencyOptions } from "./constants";
import type { CurrencyCode } from "./constants";
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
  const form = useFormContext();
  const enabled = form.state.values.espp?.enabled;
  const preferredCurrency = form.state.values.recurring?.base?.currency;

  const handleToggle = (checked: boolean, handleChange: (value: boolean) => void) => {
    handleChange(checked);

    if (checked) {
      if (form.state.values.espp?.contributionPercentage === undefined) {
        form.setFieldValue("espp.contributionPercentage", 5);
      }
      if (form.state.values.espp?.growthPercentage === undefined) {
        form.setFieldValue("espp.growthPercentage", 10);
      }
      if (!form.state.values.espp?.purchaseCurrency) {
        form.setFieldValue(
          "espp.purchaseCurrency",
          preferredCurrency ?? form.state.values.benefits?.calculationCurrency ?? "USD",
        );
      }
    } else {
      form.setFieldValue("espp.contributionPercentage", undefined);
      form.setFieldValue("espp.growthPercentage", undefined);
      form.setFieldValue("espp.purchaseCurrency", undefined);
      form.setFieldValue("espp.overrideRate", undefined);
    }
  };

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-card to-secondary/5 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-primary">Employee Stock Purchase Plan</CardTitle>
        <CardDescription>
          Model contributions and expected stock growth
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form.Field name="espp.enabled">
          {(field) => (
            <div className="flex items-center justify-between rounded-xl border-2 border-accent/30 bg-gradient-to-r from-accent/10 to-accent/5 p-5 shadow-sm">
              <div>
                <p className="text-base font-semibold text-foreground">Enable ESPP</p>
                <p className="text-sm text-muted-foreground">
                  Toggle to capture contributions and returns
                </p>
              </div>
              <Switch
                checked={field.state.value}
                onCheckedChange={(checked) => handleToggle(checked, field.handleChange)}
                aria-label="Enable ESPP"
              />
            </div>
          )}
        </form.Field>
        {enabled ? (
          <div className="grid gap-4 md:grid-cols-2">
            <form.Field name="espp.contributionPercentage">
              {(contributionField) => (
                <Card className="border-secondary/30 bg-gradient-to-br from-background to-secondary/5 shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold text-secondary-foreground">
                      Contribution Percentage (%)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Input
                      name={contributionField.name}
                      value={contributionField.state.value ?? ""}
                      onBlur={contributionField.handleBlur}
                      onChange={(event) => {
                        const rawValue = event.target.value;
                        if (rawValue === "") {
                          contributionField.handleChange(undefined);
                          return;
                        }

                        const numeric = Number(rawValue);
                        contributionField.handleChange(Number.isNaN(numeric) ? contributionField.state.value : numeric);
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
                  </CardContent>
                </Card>
              )}
            </form.Field>
            <form.Field name="espp.growthPercentage">
              {(growthField) => (
                <Card className="border-secondary/30 bg-gradient-to-br from-background to-secondary/5 shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold text-secondary-foreground">
                      Expected Annual Growth (%)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Input
                      name={growthField.name}
                      value={growthField.state.value ?? ""}
                      onBlur={growthField.handleBlur}
                      onChange={(event) => {
                        const rawValue = event.target.value;
                        if (rawValue === "") {
                          growthField.handleChange(undefined);
                          return;
                        }

                        const numeric = Number(rawValue);
                        growthField.handleChange(Number.isNaN(numeric) ? growthField.state.value : numeric);
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
                  </CardContent>
                </Card>
              )}
            </form.Field>
            <form.Field name="espp.purchaseCurrency">
              {(currencyField) => (
                <Card className="border-secondary/30 bg-gradient-to-br from-background to-secondary/5 shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold text-secondary-foreground">
                      Purchase Currency
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Select
                      value={currencyField.state.value ?? ""}
                      onValueChange={(value) => {
                        const selected = value as CurrencyCode;
                        currencyField.handleChange(() => selected);
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
                  </CardContent>
                </Card>
              )}
            </form.Field>
            <form.Field name="espp.overrideRate">
              {(overrideField) => (
                <Card className="border-secondary/30 bg-gradient-to-br from-background to-secondary/5 shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold text-secondary-foreground">
                      Exchange Rate Override
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Input
                      name={overrideField.name}
                      value={overrideField.state.value ?? ""}
                      onBlur={overrideField.handleBlur}
                      onChange={(event) => {
                        const rawValue = event.target.value;
                        if (rawValue === "") {
                          overrideField.handleChange(undefined);
                          return;
                        }

                        const numeric = Number(rawValue);
                        overrideField.handleChange(Number.isNaN(numeric) ? overrideField.state.value : numeric);
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
                  </CardContent>
                </Card>
              )}
            </form.Field>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};
