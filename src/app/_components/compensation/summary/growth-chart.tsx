'use client';

import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";

import type { CurrencyCode } from "../constants";
import type { TimelinePoint } from "../utils";

type GrowthOverTimeChartProps = {
  readonly data: TimelinePoint[];
  readonly currency?: CurrencyCode;
};

const GrowthTooltip = ({
  payload,
  currency,
}: {
  payload?: Array<{ value: number; name: string }>;
  currency?: CurrencyCode;
}) => {
  if (!payload?.length) {
    return null;
  }

  return (
    <div className="rounded-md border border-border bg-card/95 px-3 py-2 text-xs text-foreground shadow-lg">
      <div className="flex items-center justify-between gap-6">
        <span>Total</span>
        <span>
          {payload[0]?.value.toLocaleString(undefined, {
            maximumFractionDigits: 0,
          })}
          {currency ? ` ${currency}` : ""}
        </span>
      </div>
    </div>
  );
};

export const GrowthOverTimeChart = ({ data, currency }: GrowthOverTimeChartProps) => (
  <div className="h-72">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
        <XAxis
          dataKey="year"
          tick={{ fill: "rgba(148,163,184,0.9)", fontSize: 12 }}
          tickFormatter={(value) => `Year ${value + 1}`}
          stroke="rgba(148,163,184,0.4)"
        />
        <YAxis
          tick={{ fill: "rgba(148,163,184,0.9)", fontSize: 12 }}
          tickFormatter={(value: number) => value.toLocaleString()}
          stroke="rgba(148,163,184,0.4)"
        />
        <Tooltip content={<GrowthTooltip currency={currency} />} />
        <Line
          type="monotone"
          dataKey="total"
          stroke="#0ea5e9"
          strokeWidth={3}
          dot={false}
          name="Total"
        />
      </LineChart>
    </ResponsiveContainer>
    <p className="mt-2 text-center text-xs text-muted-foreground">
      Values shown in {currency ?? "your selected currency"} (converted).
    </p>
  </div>
);
