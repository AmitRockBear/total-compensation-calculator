'use client';

import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from "recharts";

import type { CurrencyCode } from "../constants";

type DistributionDatum = {
  name: string;
  value: number;
  fill: string;
};

type CompensationDistributionChartProps = {
  readonly data: DistributionDatum[];
  readonly currency?: CurrencyCode;
};

const DistributionTooltip = ({ payload }: { payload?: Array<{ value: number; payload: DistributionDatum }> }) => {
  if (!payload?.[0]) {
    return null;
  }
  const entry = payload[0];
  return (
    <div className="rounded-xl border border-white/10 bg-slate-900/90 px-3 py-2 text-xs text-white shadow-lg">
      <div className="font-semibold">{entry.payload.name}</div>
      <div className="text-white/70">{entry.payload.value.toLocaleString()}</div>
    </div>
  );
};

export const CompensationDistributionChart = ({ data, currency }: CompensationDistributionChartProps) => (
  <div className="h-64">
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius="50%" outerRadius="80%" paddingAngle={3}>
          {data.map((entry) => (
            <Cell key={entry.name} fill={entry.fill} />
          ))}
        </Pie>
        <Legend
          verticalAlign="middle"
          align="right"
          layout="vertical"
          iconType="circle"
          formatter={(value) => value as string}
        />
        <Tooltip content={<DistributionTooltip />} />
      </PieChart>
    </ResponsiveContainer>
    <p className="mt-2 text-center text-xs text-white/60">
      Values shown in {currency ?? "your selected currency"} (converted).
    </p>
  </div>
);
