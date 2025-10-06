'use client';

import { useMemo } from "react";

import { distributionColors } from "./constants";
import type { SubmissionStatus } from "./types";
import type { CompensationSummary } from "./utils";
import { formatCurrency } from "./formatters";
import { CompensationDistributionChart, GrowthOverTimeChart } from "./summary";

const SummaryRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 px-4 py-3 text-sm text-white/80">
    <span>{label}</span>
    <span className="font-semibold text-white">{value}</span>
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
    <aside className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 via-white/10 to-transparent p-6 shadow-2xl backdrop-blur">
      <header className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold text-white">Compensation Snapshot</h2>
        <p className="text-sm text-white/70">
          Results convert every input to your desired currency. Charts refresh instantly for deeper insight.
        </p>
      </header>
      <section className="flex flex-col gap-3">
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
      </section>
      <section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-inner">
        <header className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white/70">
              Distribution
            </h3>
            <p className="text-xs text-white/60">Relative contribution of each compensation component.</p>
          </div>
        </header>
        <CompensationDistributionChart data={distributionData} currency={summary?.preferredCurrency} />
      </section>
      <section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-inner">
        <header className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white/70">
              Projected Growth
            </h3>
            <p className="text-xs text-white/60">
              Incorporates raises, vesting schedules, and ESPP contributions.
            </p>
          </div>
        </header>
        <GrowthOverTimeChart data={timelineData} currency={summary?.preferredCurrency} />
      </section>
      <section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-inner">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-white/70">Highlights</h3>
        <ul className="mt-3 space-y-2 text-sm text-white/70">
          <li>
            <span className="font-semibold text-white">Base + Allowances:</span>{" "}
            {totals ? formatCurrency(totals.base + totals.allowances, summary.preferredCurrency) : "--"}
          </li>
          <li>
            <span className="font-semibold text-white">Bonus:</span>{" "}
            {totals ? formatCurrency(totals.bonus, summary.preferredCurrency) : "--"}
          </li>
          <li>
            <span className="font-semibold text-white">Benefits:</span>{" "}
            {totals ? formatCurrency(totals.benefits, summary.preferredCurrency) : "--"}
          </li>
          <li>
            <span className="font-semibold text-white">Raises Enabled:</span>{" "}
            {summary?.timeline.some((point) => point.year > 0 && point.total !== summary.timeline[0]?.total)
              ? "Yes"
              : "No"}
          </li>
        </ul>
      </section>
      {status === "error" && errorCount > 0 ? (
        <div className="rounded-3xl border border-red-400/40 bg-red-500/10 p-4 text-sm text-red-200">
          Some fields need attention. Resolve validation errors, then recalculate to refresh the summary.
        </div>
      ) : null}
      {status === "success" ? (
        <div className="rounded-3xl border border-emerald-400/40 bg-emerald-500/10 p-4 text-sm text-emerald-100">
          Snapshot saved. Share your insights confidently knowing all numbers reflect the latest inputs.
        </div>
      ) : null}
    </aside>
  );
};
