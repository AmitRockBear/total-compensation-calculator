"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

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
    <div className="border-primary/30 bg-card/95 rounded-xl border-2 px-4 py-3 text-sm shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between gap-6">
        <span className="text-muted-foreground font-semibold">Total</span>
        <span className="text-primary font-bold">
          {payload[0]?.value.toLocaleString(undefined, {
            maximumFractionDigits: 0,
          })}
          {currency ? ` ${currency}` : ""}
        </span>
      </div>
    </div>
  );
};

export const GrowthOverTimeChart = ({
  data,
  currency,
}: GrowthOverTimeChartProps) => {
  // Filter to show only years 0-4
  const filteredData = data.slice(0, 5);

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={filteredData}
          margin={{ top: 16, right: 16, left: 0, bottom: 0 }}
        >
          {/* <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" /> */}
          <XAxis
            dataKey="year"
            tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
            tickFormatter={(value) =>
              value === 0 ? "0" : `${value} year${value > 1 ? "s" : ""}`
            }
            stroke="var(--muted-foreground)"
            ticks={[0, 1, 2, 3, 4]}
          />
          <YAxis
            tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
            tickFormatter={(value: number) => value.toLocaleString()}
            stroke="var(--muted-foreground)"
          />
          <Tooltip content={<GrowthTooltip currency={currency} />} />
          <Line
            type="monotone"
            dataKey="total"
            stroke="var(--chart-1)"
            strokeWidth={2}
            dot={false}
            activeDot={false}
            name="Total"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
