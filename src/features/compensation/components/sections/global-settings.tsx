'use client';

import { currencyOptions } from "~/features/compensation/lib/constants";
import { useCompensationSettings } from "~/features/compensation/components/context";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Switch } from "~/components/ui/switch";

export const GlobalSettings = () => {
  const {
    preferredCurrency,
    setPreferredCurrency,
    defaultRates,
    updateRate,
    theme,
    setThemeMode,
  } = useCompensationSettings();

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/5 shadow-lg">
      <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <CardTitle className="text-xl font-bold text-primary">Global Settings</CardTitle>
          <CardDescription>
            Configure your output currency, manage baseline exchange rates, and toggle theme preferences.
          </CardDescription>
        </div>
        <div className="flex items-center gap-3">
          <Label htmlFor="theme-toggle" className="text-sm font-medium">
            Dark mode
          </Label>
          <Switch
            id="theme-toggle"
            checked={theme === "dark"}
            onCheckedChange={(checked) => {
              setThemeMode(checked ? "dark" : "light");
            }}
            aria-label="Toggle theme"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setThemeMode(theme === "light" ? "dark" : "light");
            }}
          >
            {theme === "light" ? "🌙 Dark" : "☀️ Light"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-3 rounded-xl border-2 border-primary/20 bg-background/80 p-5 shadow-sm backdrop-blur-sm">
            <Label className="text-xs font-bold uppercase tracking-wider text-primary">
              Desired Output Currency
            </Label>
            <Select
              value={preferredCurrency}
              onValueChange={(value) => {
                setPreferredCurrency(value as typeof preferredCurrency);
              }}
            >
              <SelectTrigger className="mt-1">
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
          </div>
          <div className="space-y-3 rounded-xl border-2 border-secondary/20 bg-background/80 p-5 shadow-sm backdrop-blur-sm">
            <Label className="text-xs font-bold uppercase tracking-wider text-secondary-foreground">
              Live Insights
            </Label>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Calculations and visualizations update instantly as you edit values. Use the calculate button to validate inputs
              and capture a shareable snapshot.
            </p>
            <p
              className="text-xs text-muted-foreground/80"
              aria-label="Exchange rate note"
              title="Exchange rates are relative to USD by default."
            >
              Exchange rates default to USD parity. Override any field to reflect negotiated or real-time rates.
            </p>
          </div>
        </div>
        <div>
          <Label className="text-xs font-bold uppercase tracking-wider text-primary">
            Default Exchange Rates
          </Label>
          <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {currencyOptions.map((currency) => (
              <div
                key={currency}
                className="flex flex-col gap-2 rounded-xl border-2 border-accent/20 bg-background/80 px-4 py-3 shadow-sm backdrop-blur-sm transition-all hover:border-accent/40 hover:shadow-md"
              >
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                  <span>{currency}</span>
                  <span title="Default exchange rate relative to USD" aria-label="Default exchange rate relative to USD">
                    ↔ USD
                  </span>
                </div>
                <Input
                  value={defaultRates[currency] ?? ""}
                  onChange={(event) => {
                    const value = Number(event.target.value);
                    updateRate(currency, Number.isNaN(value) ? defaultRates[currency] : value);
                  }}
                  type="number"
                  step="0.0001"
                  min="0"
                />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
