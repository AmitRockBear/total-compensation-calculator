'use client';

/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return */

import { useFormContext } from "./form-context";
import { currencyOptions } from "./constants";
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
  const form = useFormContext();

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-card to-accent/5 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-primary">Annual Benefits</CardTitle>
        <CardDescription>
          One-time or annual benefits converted to your preferred currency
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border-secondary/30 bg-gradient-to-br from-background to-secondary/5 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-secondary-foreground">
                Signing Bonus
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <form.Field name="benefits.signingBonus">
                {(field) => (
                  <Input
                    name={field.name}
                    value={field.state.value ?? ""}
                    onBlur={field.handleBlur}
                    onChange={(event) => {
                      const rawValue = event.target.value;
                      if (rawValue === "") {
                        field.handleChange(undefined);
                        return;
                      }

                      const numeric = Number(rawValue);
                      field.handleChange(Number.isNaN(numeric) ? field.state.value : numeric);
                    }}
                    type="number"
                    inputMode="decimal"
                    step="0.01"
                    min="0"
                    aria-label="Signing bonus amount"
                    placeholder="0.00"
                  />
                )}
              </form.Field>
              <p className="text-xs text-muted-foreground leading-relaxed">
                One-time signing bonus
              </p>
            </CardContent>
          </Card>
          <Card className="border-secondary/30 bg-gradient-to-br from-background to-secondary/5 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-secondary-foreground">
                Relocation Assistance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <form.Field name="benefits.relocation">
                {(field) => (
                  <Input
                    name={field.name}
                    value={field.state.value ?? ""}
                    onBlur={field.handleBlur}
                    onChange={(event) => {
                      const rawValue = event.target.value;
                      if (rawValue === "") {
                        field.handleChange(undefined);
                        return;
                      }

                      const numeric = Number(rawValue);
                      field.handleChange(Number.isNaN(numeric) ? field.state.value : numeric);
                    }}
                    type="number"
                    inputMode="decimal"
                    step="0.01"
                    min="0"
                    aria-label="Relocation assistance amount"
                    placeholder="0.00"
                  />
                )}
              </form.Field>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Moving assistance
              </p>
            </CardContent>
          </Card>
          <Card className="border-secondary/30 bg-gradient-to-br from-background to-secondary/5 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-secondary-foreground">
                Annual Stipend
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <form.Field name="benefits.annualStipend">
                {(field) => (
                  <Input
                    name={field.name}
                    value={field.state.value ?? ""}
                    onBlur={field.handleBlur}
                    onChange={(event) => {
                      const rawValue = event.target.value;
                      if (rawValue === "") {
                        field.handleChange(undefined);
                        return;
                      }

                      const numeric = Number(rawValue);
                      field.handleChange(Number.isNaN(numeric) ? field.state.value : numeric);
                    }}
                    type="number"
                    inputMode="decimal"
                    step="0.01"
                    min="0"
                    aria-label="Annual stipend amount"
                    placeholder="0.00"
                  />
                )}
              </form.Field>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Equipment, wellness, etc.
              </p>
            </CardContent>
          </Card>
          <Card className="border-secondary/30 bg-gradient-to-br from-background to-secondary/5 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-secondary-foreground">
                Currency
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <form.Field name="benefits.currency">
                {(field) => (
                  <Select
                    value={field.state.value ?? ""}
                    onValueChange={(value) => field.handleChange(value)}
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
                )}
              </form.Field>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Benefits currency
              </p>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};
