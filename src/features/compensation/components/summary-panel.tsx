import { useMemo, useState } from "react";

import { distributionColors } from "~/features/compensation/lib/constants";
import { currencyOptions } from "~/features/compensation/lib/constants";
import type { CompensationSummary } from "~/features/compensation/lib/utils";
import { formatCurrency } from "~/features/compensation/lib/formatters";
import { useCompensationSettings } from "~/features/compensation/components/context";
import {
  CompensationDistributionChart,
  GrowthOverTimeChart,
  TotalCompensationChart,
} from "./charts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs";

const SummaryRow = ({ label, value }: { label: string; value: string }) => (
  <div className="border-primary/20 from-primary/5 to-primary/10 flex items-center justify-between rounded-xl border-2 bg-gradient-to-r px-5 py-3.5 text-sm shadow-sm">
    <span className="text-muted-foreground font-medium">{label}</span>
    <span className="text-primary font-bold">{value}</span>
  </div>
);

type SummaryPanelProps = {
  readonly summary: CompensationSummary | null;
};

export const SummaryPanel = ({ summary }: SummaryPanelProps) => {
  const { preferredCurrency, setPreferredCurrency } = useCompensationSettings();
  const totals = summary?.totals;
  const [selectedYear, setSelectedYear] = useState("0");

  const distributionData = useMemo(() => {
    if (!summary?.distribution) {
      return [];
    }

    return summary.distribution
      .filter((item) => item.value > 0)
      .map((item, index) => {
        const fillColor =
          distributionColors[index % distributionColors.length] ?? "#2563eb";

        return {
          name: item.label,
          value: Math.round(item.value),
          fill: fillColor,
        };
      });
  }, [summary]);

  const timelineData = useMemo(() => summary?.timeline ?? [], [summary]);

  const selectedYearData = useMemo(() => {
    if (!summary?.timeline) {
      return null;
    }
    const yearIndex = Number.parseInt(selectedYear, 10);
    const yearData = summary.timeline[yearIndex];
    if (!yearData) {
      return null;
    }
    return {
      base: yearData.base,
      bonus: yearData.bonus,
      benefits: yearData.benefits,
      rsu: yearData.rsu,
      espp: yearData.espp,
    };
  }, [summary, selectedYear]);

  if (!summary) {
    return (
      <Card className="border-muted bg-muted/10">
        <CardContent className="flex items-center justify-center p-12 text-center">
          <p className="text-muted-foreground text-sm">
            Enter your compensation details to see live calculations
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/30 from-card to-primary/5 bg-gradient-to-br shadow-xl">
      <CardHeader className="relative">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-primary text-2xl font-bold">
              Live Compensation Summary
            </CardTitle>
            <CardDescription className="text-base">
              Updates automatically as you enter your details
            </CardDescription>
          </div>
          <Select
            value={preferredCurrency}
            onValueChange={setPreferredCurrency}
          >
            <SelectTrigger className="h-8 w-24">
              <SelectValue />
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
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3">
          <SummaryRow
            label="Annual Total"
            value={formatCurrency(
              totals?.annual ?? 0,
              summary.preferredCurrency,
            )}
          />
          <SummaryRow
            label="Monthly"
            value={formatCurrency(
              totals?.monthly ?? 0,
              summary.preferredCurrency,
            )}
          />
        </div>

        <Card className="border-secondary/30 from-background to-secondary/5 border-2 bg-gradient-to-br shadow-md">
          <Tabs value={selectedYear} onValueChange={setSelectedYear}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-secondary-foreground text-sm font-bold tracking-wider uppercase">
                  Annual Breakdown
                </CardTitle>
                <TabsList>
                  <TabsTrigger value="0">Now</TabsTrigger>
                  <TabsTrigger value="1">1Y</TabsTrigger>
                  <TabsTrigger value="2">2Y</TabsTrigger>
                  <TabsTrigger value="3">3Y</TabsTrigger>
                  <TabsTrigger value="4">4Y</TabsTrigger>
                </TabsList>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <TabsContent value={selectedYear}>
                {selectedYearData && (
                  <TotalCompensationChart
                    baseAmount={selectedYearData.base}
                    bonusAmount={selectedYearData.bonus}
                    benefitsAmount={selectedYearData.benefits}
                    rsuAmount={selectedYearData.rsu}
                    esppAmount={selectedYearData.espp}
                    currency={summary.preferredCurrency}
                  />
                )}
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>

        <Card className="border-accent/30 from-background to-accent/5 border-2 bg-gradient-to-br shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-accent-foreground text-sm font-bold tracking-wider uppercase">
              4-Year Growth
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <GrowthOverTimeChart
              data={timelineData}
              currency={summary.preferredCurrency}
            />
          </CardContent>
        </Card>

        <Card className="border-primary/30 from-background to-primary/5 border-2 bg-gradient-to-br shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-primary text-sm font-bold tracking-wider uppercase">
              Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <CompensationDistributionChart
              data={distributionData}
              currency={summary.preferredCurrency}
            />
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};
