
import { useFormContext } from "~/features/compensation/components/forms/form-context";
import { currencyOptions, type CurrencyCode } from "~/features/compensation/lib/constants";
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

type MonetaryFieldInputProps = {
  readonly amountName: string;
  readonly currencyName: string;
  readonly overrideName: string;
  readonly label: string;
  readonly description?: string;
};

export const MonetaryFieldInput = ({
  amountName,
  currencyName,
  overrideName,
  label,
  description,
}: MonetaryFieldInputProps) => {
  const form = useFormContext();

  return (
    <Card className="border-2 border-accent/30 bg-gradient-to-br from-background to-accent/5 shadow-sm">
      <CardHeader className="space-y-1.5 pb-4">
        <CardTitle className="text-lg font-semibold text-accent-foreground">{label}</CardTitle>
        {description ? <CardDescription className="text-sm">{description}</CardDescription> : null}
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-3">
        <form.Field name={amountName}>
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
        <form.Field name={currencyName}>
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
        <form.Field name={overrideName}>
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
      </CardContent>
    </Card>
  );
};
