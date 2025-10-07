"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import type { CurrencyCode } from "../constants";

type TotalCompensationChartProps = {
  readonly baseAmount: number;
  readonly bonusAmount: number;
  readonly benefitsAmount: number;
  readonly rsuAmount: number;
  readonly esppAmount: number;
  readonly currency?: CurrencyCode;
};

const TotalCompTooltip = ({
  payload,
  currency,
}: {
  payload?: Array<{ value: number; name: string; dataKey: string }>;
  currency?: CurrencyCode;
}) => {
  if (!payload?.length || !payload[0]) {
    return null;
  }

  const entry = payload[0];
  return (
    <div className="border-primary/30 bg-card/95 rounded-xl border-2 px-4 py-3 text-sm shadow-xl backdrop-blur-md">
      <div className="text-primary font-bold">{entry.name}</div>
      <div className="text-muted-foreground">
        {entry.value.toLocaleString(undefined, {
          maximumFractionDigits: 0,
        })}
        {currency ? ` ${currency}` : ""}
      </div>
    </div>
  );
};

export const TotalCompensationChart = ({
  baseAmount,
  bonusAmount,
  benefitsAmount,
  rsuAmount,
  esppAmount,
  currency,
}: TotalCompensationChartProps) => {
  const data = [
    { name: "Base", value: Math.round(baseAmount) },
    { name: "Bonus", value: Math.round(bonusAmount) },
    { name: "Benefits", value: Math.round(benefitsAmount) },
    { name: "RSU", value: Math.round(rsuAmount) },
    { name: "ESPP", value: Math.round(esppAmount) },
  ].filter((item) => item.value > 0);

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 16, right: 16, left: 0, bottom: 0 }}
        >
          <XAxis
            dataKey="name"
            tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
            stroke="var(--muted-foreground)"
          />
          <YAxis
            tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
            tickFormatter={(value: number) => value.toLocaleString()}
            stroke="var(--muted-foreground)"
          />
          <Tooltip content={<TotalCompTooltip currency={currency} />} />
          <Bar dataKey="value" fill="var(--chart-1)" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
