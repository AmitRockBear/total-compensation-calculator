"use client";

import { useMemo } from "react";

import { distributionColors } from "./constants";
import type { SubmissionStatus } from "./types";
import type { CompensationSummary } from "./utils";
import { formatCurrency } from "./formatters";
import {
  CompensationDistributionChart,
  GrowthOverTimeChart,
  TotalCompensationChart,
} from "./summary";
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
  readonly status: SubmissionStatus;
  readonly errorCount: number;
};

export const SummaryPanel = ({
  summary,
  status,
  errorCount,
}: SummaryPanelProps) => {
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

  return (
    <aside className="flex flex-col gap-6">
      <Card className="border-primary/30 from-card to-primary/5 bg-gradient-to-br shadow-xl">
        <CardHeader>
          <CardTitle className="text-primary text-2xl font-bold">
            Compensation Snapshot
          </CardTitle>
          <CardDescription className="text-base">
            Real-time visualization of your total compensation package.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <SummaryRow
              label="Annual Total"
              value={
                totals
                  ? formatCurrency(totals.annual, summary.preferredCurrency)
                  : "--"
              }
            />
            <SummaryRow
              label="Monthly"
              value={
                totals
                  ? formatCurrency(totals.monthly, summary.preferredCurrency)
                  : "--"
              }
            />
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="border-secondary/30 from-background to-secondary/5 border-2 bg-gradient-to-br shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-secondary-foreground text-base font-bold tracking-wider uppercase">
                  Breakdown
                </CardTitle>
                <CardDescription>
                  Annual compensation by component
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <TotalCompensationChart
                  baseAmount={(totals?.base ?? 0) + (totals?.allowances ?? 0)}
                  bonusAmount={totals?.bonus ?? 0}
                  benefitsAmount={totals?.benefits ?? 0}
                  rsuAmount={totals?.rsuAnnual ?? 0}
                  esppAmount={
                    summary?.totals.espp.enabled
                      ? summary.totals.espp.returns
                      : 0
                  }
                  currency={summary?.preferredCurrency}
                />
              </CardContent>
            </Card>
            <Card className="border-accent/30 from-background to-accent/5 border-2 bg-gradient-to-br shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-accent-foreground text-base font-bold tracking-wider uppercase">
                  4-Year Growth
                </CardTitle>
                <CardDescription>
                  Projected compensation over time
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <GrowthOverTimeChart
                  data={timelineData}
                  currency={summary?.preferredCurrency}
                />
              </CardContent>
            </Card>
          </div>
          <Card className="border-primary/30 from-background to-primary/5 border-2 bg-gradient-to-br shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-primary text-base font-bold tracking-wider uppercase">
                Distribution
              </CardTitle>
              <CardDescription>
                Relative contribution of each component
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <CompensationDistributionChart
                data={distributionData}
                currency={summary?.preferredCurrency}
              />
            </CardContent>
          </Card>
        </CardContent>
      </Card>
      {status === "error" && errorCount > 0 ? (
        <Card className="border-destructive/40 from-destructive/10 to-destructive/5 border-2 bg-gradient-to-br shadow-lg">
          <CardContent className="text-destructive p-5 text-sm font-medium">
            ⚠ Some fields need attention. Resolve validation errors, then
            recalculate to refresh the summary.
          </CardContent>
        </Card>
      ) : null}
      {status === "success" ? (
        <Card className="border-primary/40 from-primary/10 to-primary/5 border-2 bg-gradient-to-br shadow-lg">
          <CardContent className="text-primary p-5 text-sm font-medium">
            ✓ Snapshot saved. Share your insights confidently knowing all
            numbers reflect the latest inputs.
          </CardContent>
        </Card>
      ) : null}
    </aside>
  );
};
