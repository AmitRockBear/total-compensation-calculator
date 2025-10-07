import { useFormContext } from "~/features/compensation/components/forms/form-context";
import type { RaiseValues } from "~/features/compensation/types/schema";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";

export const RaisesSection = () => {
  const form = useFormContext();
  const raises = form.state.values.raises || [];

  return (
    <Card className="border-primary/20 from-card to-primary/5 bg-gradient-to-br shadow-lg">
      <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <CardTitle className="text-primary text-xl font-bold">
            Expected Salary Raises
          </CardTitle>
          <CardDescription>
            Model projected salary increases over time
          </CardDescription>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            form.setFieldValue("raises", [
              ...raises,
              {
                yearOffset: raises.length + 1,
                percentage: 5,
              },
            ]);
          }}
          aria-label="Add salary raise"
        >
          + Add Raise
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <form.Field name="raises" mode="array">
          {(_field: { name: string; state: { value: unknown }; handleChange: (value: unknown) => void; handleBlur: () => void }) => {
            return raises.map((_raise: RaiseValues, index: number) => (
              <Card
                key={index}
                className="border-accent/30 from-background to-accent/5 bg-gradient-to-br shadow-sm"
              >
                <CardHeader className="flex flex-col gap-3 pb-3 sm:flex-row sm:items-center sm:justify-between">
                  <CardTitle className="text-accent-foreground text-lg font-semibold">
                    Raise {index + 1}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      form.setFieldValue(
                        "raises",
                        raises.filter((_r: RaiseValues, i: number) => i !== index),
                      );
                    }}
                    aria-label={`Remove raise ${index + 1}`}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    Remove
                  </Button>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                  <form.Field name={`raises[${index}].yearOffset`}>
                    {(yearField: { name: string; state: { value: unknown }; handleChange: (value: unknown) => void; handleBlur: () => void }) => {
                      const value = typeof yearField.state.value === "number" || typeof yearField.state.value === "string" ? yearField.state.value : "";
                      return (
                        <div className="space-y-2">
                          <label className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                            Years from Now
                          </label>
                          <Input
                            name={yearField.name}
                            value={value}
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
                      );
                    }}
                  </form.Field>
                  <form.Field name={`raises[${index}].percentage`}>
                    {(percentageField: { name: string; state: { value: unknown }; handleChange: (value: unknown) => void; handleBlur: () => void }) => {
                      const value = typeof percentageField.state.value === "number" || typeof percentageField.state.value === "string" ? percentageField.state.value : "";
                      return (
                        <div className="space-y-2">
                          <label className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                            Raise Percentage
                          </label>
                          <Input
                            name={percentageField.name}
                            value={value}
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
                      );
                    }}
                  </form.Field>
                </CardContent>
              </Card>
            ));
          }}
        </form.Field>
      </CardContent>
    </Card>
  );
};
