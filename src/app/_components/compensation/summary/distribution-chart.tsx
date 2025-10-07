"use client";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
} from "recharts";

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
    <div className="border-primary/30 bg-card/95 rounded-xl border-2 px-4 py-3 text-sm shadow-xl backdrop-blur-md">
      <div className="text-primary font-bold">{entry.payload.name}</div>
      <div className="text-muted-foreground">{entry.payload.value.toLocaleString()}</div>
    </div>
  );
};

export const CompensationDistributionChart = ({ data }: CompensationDistributionChartProps) => (
  <div className="h-64">
    <ResponsiveContainer width="100%" height="100%">
      <PieChart margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
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
  </div>
);
