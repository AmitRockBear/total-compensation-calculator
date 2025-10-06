'use client';

import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

import type { CurrencyCode } from "../constants";
import type { TimelinePoint } from "../utils";

type GrowthOverTimeChartProps = {
  readonly data: TimelinePoint[];
  readonly currency?: CurrencyCode;
};

const GrowthTooltip = ({ payload }: { payload?: Array<{ value: number; name: string }> }) => {
  if (!payload?.length) {
    return null;
  }

  return (
    <div className="rounded-xl border border-white/10 bg-slate-900/90 px-3 py-2 text-xs text-white shadow-lg">
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center justify-between gap-6">
          <span>{entry.name}</span>
          <span>{entry.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
};

export const GrowthOverTimeChart = ({ data, currency }: GrowthOverTimeChartProps) => (
  <div className="h-72">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
        <XAxis
          dataKey="year"
          tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 12 }}
          tickFormatter={(value) => `Year ${value + 1}`}
          stroke="rgba(255,255,255,0.2)"
        />
        <YAxis
          tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 12 }}
          tickFormatter={(value: number) => value.toLocaleString()}
          stroke="rgba(255,255,255,0.2)"
        />
        <Legend
          verticalAlign="top"
          height={36}
          wrapperStyle={{ color: "rgba(255,255,255,0.9)", fontSize: 12 }}
        />
        <Tooltip content={<GrowthTooltip />} />
        <Line type="monotone" dataKey="total" stroke="#22d3ee" strokeWidth={3} dot={false} name="Total" />
        <Line type="monotone" dataKey="rsu" stroke="#a855f7" strokeWidth={2} dot={false} name="RSUs" />
        <Line type="monotone" dataKey="bonus" stroke="#f97316" strokeWidth={2} dot={false} name="Bonus" />
      </LineChart>
    </ResponsiveContainer>
    <p className="mt-2 text-center text-xs text-white/60">
      Values shown in {currency ?? "your selected currency"} (converted).
    </p>
  </div>
);
