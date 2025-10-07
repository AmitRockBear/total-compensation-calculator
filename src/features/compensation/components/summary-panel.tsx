
import { useMemo } from "react";

import { distributionColors } from "~/features/compensation/lib/constants";
import type { CompensationSummary } from "~/features/compensation/lib/utils";
import { formatCurrency } from "~/features/compensation/lib/formatters";
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
  const totals = summary?.totals;

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
      <CardHeader>
        <CardTitle className="text-primary text-2xl font-bold">
          Live Compensation Summary
        </CardTitle>
        <CardDescription className="text-base">
          Updates automatically as you enter your details
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3">
          <SummaryRow
            label="Annual Total"
            value={formatCurrency(totals?.annual ?? 0, summary.preferredCurrency)}
          />
          <SummaryRow
            label="Monthly"
            value={formatCurrency(totals?.monthly ?? 0, summary.preferredCurrency)}
          />
        </div>
        
        <Card className="border-secondary/30 from-background to-secondary/5 border-2 bg-gradient-to-br shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-secondary-foreground text-sm font-bold tracking-wider uppercase">
              Annual Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <TotalCompensationChart
              baseAmount={(totals?.base ?? 0) + (totals?.allowances ?? 0)}
              bonusAmount={totals?.bonus ?? 0}
              benefitsAmount={totals?.benefits ?? 0}
              rsuAmount={totals?.rsuAnnual ?? 0}
              esppAmount={
                summary.totals.espp.enabled
                  ? summary.totals.espp.returns
                  : 0
              }
              currency={summary.preferredCurrency}
            />
          </CardContent>
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
