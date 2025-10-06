'use client';

import { useMemo } from "react";

import { distributionColors } from "./constants";
import type { SubmissionStatus } from "./types";
import type { CompensationSummary } from "./utils";
import { formatCurrency } from "./formatters";
import { CompensationDistributionChart, GrowthOverTimeChart } from "./summary";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";

const SummaryRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
    <span>{label}</span>
    <span className="font-semibold text-foreground">{value}</span>
  </div>
);

type SummaryPanelProps = {
  readonly summary: CompensationSummary | null;
  readonly status: SubmissionStatus;
  readonly errorCount: number;
};

export const SummaryPanel = ({ summary, status, errorCount }: SummaryPanelProps) => {
  const totals = summary?.totals;

  const distributionData = useMemo(() => {
    if (!summary?.distribution) {
      return [];
    }

    return summary.distribution
      .filter((item) => item.value > 0)
      .map((item, index) => {
        const fillColor = distributionColors[index % distributionColors.length] ?? "#2563eb";

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
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle>Compensation Snapshot</CardTitle>
          <CardDescription>
            Results convert every input to your desired currency. Charts refresh instantly for deeper insight.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3">
            <SummaryRow
              label="Total Annual Compensation"
              value={totals ? formatCurrency(totals.annual, summary.preferredCurrency) : "--"}
            />
            <SummaryRow
              label="Monthly Equivalent"
              value={totals ? formatCurrency(totals.monthly, summary.preferredCurrency) : "--"}
            />
            <SummaryRow
              label="RSU Value per Year"
              value={totals ? formatCurrency(totals.rsuAnnual, summary.preferredCurrency) : "--"}
            />
            <SummaryRow
              label="ESPP Contributions"
              value={summary?.totals.espp.enabled
                ? formatCurrency(summary.totals.espp.contributions, summary.preferredCurrency)
                : "--"}
            />
            <SummaryRow
              label="ESPP Expected Returns"
              value={summary?.totals.espp.enabled
                ? formatCurrency(summary.totals.espp.returns, summary.preferredCurrency)
                : "--"}
            />
          </div>
          <div className="grid gap-4">
            <Card className="border border-border/60 bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm uppercase tracking-wide text-muted-foreground">
                  Distribution
                </CardTitle>
                <CardDescription>Relative contribution of each compensation component.</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <CompensationDistributionChart data={distributionData} currency={summary?.preferredCurrency} />
              </CardContent>
            </Card>
            <Card className="border border-border/60 bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm uppercase tracking-wide text-muted-foreground">
                  Projected Growth
                </CardTitle>
                <CardDescription>Incorporates raises, vesting schedules, and ESPP contributions.</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <GrowthOverTimeChart data={timelineData} currency={summary?.preferredCurrency} />
              </CardContent>
            </Card>
            <Card className="border border-border/60 bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm uppercase tracking-wide text-muted-foreground">Highlights</CardTitle>
                <CardDescription>Key figures derived from the calculated totals.</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <span className="font-semibold text-foreground">Base + Allowances:</span>{" "}
                    {totals ? formatCurrency(totals.base + totals.allowances, summary.preferredCurrency) : "--"}
                  </li>
                  <li>
                    <span className="font-semibold text-foreground">Bonus:</span>{" "}
                    {totals ? formatCurrency(totals.bonus, summary.preferredCurrency) : "--"}
                  </li>
                  <li>
                    <span className="font-semibold text-foreground">Benefits:</span>{" "}
                    {totals ? formatCurrency(totals.benefits, summary.preferredCurrency) : "--"}
                  </li>
                  <li>
                    <span className="font-semibold text-foreground">Raises Enabled:</span>{" "}
                    {summary?.timeline.some((point) => point.year > 0 && point.total !== summary.timeline[0]?.total)
                      ? "Yes"
                      : "No"}
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
      {status === "error" && errorCount > 0 ? (
        <Card className="border border-red-500/40 bg-red-500/10">
          <CardContent className="p-4 text-sm text-red-600 dark:text-red-200">
            Some fields need attention. Resolve validation errors, then recalculate to refresh the summary.
          </CardContent>
        </Card>
      ) : null}
      {status === "success" ? (
        <Card className="border border-emerald-500/40 bg-emerald-500/10">
          <CardContent className="p-4 text-sm text-emerald-600 dark:text-emerald-100">
            Snapshot saved. Share your insights confidently knowing all numbers reflect the latest inputs.
          </CardContent>
        </Card>
      ) : null}
    </aside>
  );
};
