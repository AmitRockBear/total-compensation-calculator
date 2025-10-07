import { useCompensationSettings } from "~/features/compensation/components/context";
import { useFormContext } from "~/features/compensation/components/forms/form-context";
import type { RsuGrantValues } from "~/features/compensation/types/schema";
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

export const RsuSection = () => {
  const { preferredCurrency } = useCompensationSettings();
  const form = useFormContext();
  const grants = form.state.values.rsuGrants || [];

  return (
    <Card className="border-primary/20 from-card to-primary/5 bg-gradient-to-br shadow-lg">
      <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <CardTitle className="text-primary text-xl font-bold">
            RSU Grants
          </CardTitle>
          <CardDescription>
            Track grant values and vesting schedules with automatic currency
            conversion
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
            return grants.map((_grant: RsuGrantValues, index: number) => (
              <Card
                key={index}
                className="border-accent/30 from-background to-accent/5 bg-gradient-to-br shadow-sm"
              >
                <CardHeader className="flex flex-col gap-3 pb-3 sm:flex-row sm:items-center sm:justify-between">
                  <CardTitle className="text-accent-foreground text-lg font-semibold">
                    Grant {index + 1}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (grants.length > 1) {
                        form.setFieldValue(
                          "rsuGrants",
                          grants.filter(
                            (_g: RsuGrantValues, i: number) => i !== index,
                          ),
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
                          <label className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                            Grant Name
                          </label>
                          <Input
                            name={subField.name}
                            value={subField.state.value}
                            onBlur={subField.handleBlur}
                            onChange={(e) =>
                              subField.handleChange(e.target.value)
                            }
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
                          <label className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                            Vesting Years
                          </label>
                          <Input
                            name={subField.name}
                            value={subField.state.value}
                            onBlur={subField.handleBlur}
                            onChange={(e) =>
                              subField.handleChange(Number(e.target.value))
                            }
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
                          <label className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                            Start Date
                          </label>
                          <Input
                            name={subField.name}
                            value={subField.state.value}
                            onBlur={subField.handleBlur}
                            onChange={(e) =>
                              subField.handleChange(e.target.value)
                            }
                            type="date"
                            aria-label="Grant start date"
                          />
                        </div>
                      )}
                    </form.Field>
                  </div>
                  <div className="grid gap-4 md:grid-cols-3">
                    <form.Field name={`rsuGrants[${index}].totalValue.amount`}>
                      {(field: { name: string; state: { value: unknown }; handleChange: (value: unknown) => void; handleBlur: () => void }) => {
                        const fieldValue = field.state.value;
                        const resolvedValue = typeof fieldValue === "number" ? String(fieldValue) : "";

                        return (
                          <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                              Amount
                            </label>
                            <Input
                              name={field.name}
                              value={resolvedValue}
                              onBlur={field.handleBlur}
                              onChange={(event) => {
                                const rawValue = event.target.value;
                                if (rawValue === "") {
                                  field.handleChange(undefined);
                                  return;
                                }

                                const numeric = Number(rawValue);
                                field.handleChange(Number.isNaN(numeric) ? undefined : numeric);
                              }}
                              type="number"
                              inputMode="decimal"
                              step="0.01"
                              min="0"
                              placeholder="0.00"
                            />
                          </div>
                        );
                      }}
                    </form.Field>
                    <form.Field name={`rsuGrants[${index}].totalValue.currency`}>
                      {(field: { name: string; state: { value: unknown }; handleChange: (value: unknown) => void; handleBlur: () => void }) => {
                        const fieldValue = field.state.value;
                        const currencyValue = typeof fieldValue === "string" ? fieldValue : "USD";
                        
                        return (
                          <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                              Currency
                            </label>
                            <Select
                              value={currencyValue}
                              onValueChange={(value) => {
                                field.handleChange(value as CurrencyCode);
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Currency" />
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
                        );
                      }}
                    </form.Field>
                    <form.Field name={`rsuGrants[${index}].totalValue.overrideRate`}>
                      {(field: { name: string; state: { value: unknown }; handleChange: (value: unknown) => void; handleBlur: () => void }) => {
                        const fieldValue = field.state.value;
                        const resolvedValue = typeof fieldValue === "number" ? String(fieldValue) : "";

                        return (
                          <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                              Override Rate
                            </label>
                            <Input
                              name={field.name}
                              value={resolvedValue}
                              onBlur={field.handleBlur}
                              onChange={(event) => {
                                const rawValue = event.target.value;
                                if (rawValue === "") {
                                  field.handleChange(undefined);
                                  return;
                                }

                                const numeric = Number(rawValue);
                                const currentValue = field.state.value;
                                field.handleChange(
                                  Number.isNaN(numeric) 
                                    ? (typeof currentValue === "number" ? currentValue : undefined)
                                    : numeric
                                );
                              }}
                              type="number"
                              inputMode="decimal"
                              step="0.0001"
                              min="0"
                              placeholder="Use default"
                            />
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
