import { CurrencyCode } from "~/features/compensation/lib/constants";
import {
  CompensationFormValues,
  MonetaryFieldValues,
  RsuGrantValues,
} from "~/features/compensation/types/schema";

type ExchangeRates = Record<CurrencyCode, number>;

type RsuBreakdownItem = {
  name: string;
  annualValue: number;
  totalValue: number;
};

type DistributionItem = {
  label: string;
  value: number;
};

type TimelinePoint = {
  year: number;
  base: number;
  allowances: number;
  bonus: number;
  benefits: number;
  rsu: number;
  espp: number;
  total: number;
};

type EsppSummary = {
  enabled: boolean;
  contributions: number;
  returns: number;
};

type TotalsSummary = {
  annual: number;
  monthly: number;
  base: number;
  allowances: number;
  bonus: number;
  benefits: number;
  rsuAnnual: number;
  espp: EsppSummary;
};

type CompensationSummary = {
  preferredCurrency: CurrencyCode;
  totals: TotalsSummary;
  distribution: DistributionItem[];
  timeline: TimelinePoint[];
  rsuBreakdown: RsuBreakdownItem[];
};

const getRate = (
  currency: CurrencyCode,
  override: number | undefined,
  rates: ExchangeRates,
) => {
  if (override && override > 0) {
    return override;
  }
  return rates[currency] ?? 1;
};

const convertAmount = (
  amount: number,
  fromCurrency: CurrencyCode,
  toCurrency: CurrencyCode,
  overrideRate: number | undefined,
  rates: ExchangeRates,
) => {
  if (Number.isNaN(amount)) {
    return 0;
  }

  if (fromCurrency === toCurrency && !overrideRate) {
    return amount;
  }

  const fromRate = getRate(fromCurrency, overrideRate, rates);
  const toRate = rates[toCurrency] ?? 1;

  if (fromRate === 0 || toRate === 0) {
    return amount;
  }

  const usdValue = amount / fromRate;
  return usdValue * toRate;
};

const convertField = (
  field: MonetaryFieldValues,
  target: CurrencyCode,
  rates: ExchangeRates,
) => convertAmount(field.amount, field.currency, target, field.overrideRate, rates);

const convertFieldAnnual = (
  field: MonetaryFieldValues,
  target: CurrencyCode,
  rates: ExchangeRates,
) => convertField({ ...field, amount: field.amount * 12 }, target, rates);

const getRsuSchedule = (
  grants: RsuGrantValues[],
  preferredCurrency: CurrencyCode,
  rates: ExchangeRates,
) => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const schedule: Record<number, number> = {};
  const breakdown: RsuBreakdownItem[] = [];

  grants.forEach((grant) => {
    const startDate = new Date(grant.startDate);
    const startYear = Number.isNaN(startDate.getTime())
      ? currentYear
      : startDate.getFullYear();
    const startOffset = Math.max(0, startYear - currentYear);
    const totalConverted = convertField(
      grant.totalValue,
      preferredCurrency,
      rates,
    );
    const annualValue = totalConverted / Math.max(grant.vestingYears, 1);

    for (let year = 0; year < grant.vestingYears; year += 1) {
      const key = startOffset + year;
      schedule[key] = (schedule[key] ?? 0) + annualValue;
    }

    breakdown.push({
      name: grant.name,
      annualValue,
      totalValue: totalConverted,
    });
  });

  return { schedule, breakdown };
};

const buildRaisesMap = (values: CompensationFormValues) => {
  const map = new Map<number, number>();

  if (values.raises && values.raises.length > 0) {
    values.raises.forEach((item) => {
      map.set(item.yearOffset, item.percentage / 100);
    });
  }

  return map;
};

const getProjectionYears = (
  schedule: Record<number, number>,
  raisesMap: Map<number, number>,
) => {
  const maxRaise = raisesMap.size
    ? Math.max(...raisesMap.keys())
    : 0;
  const rsuYears = Object.keys(schedule).length
    ? Math.max(...Object.keys(schedule).map((key) => Number(key)))
    : 0;

  return Math.max(5, maxRaise + 1, rsuYears + 1);
};

const safe = (value: number) => (Number.isFinite(value) ? value : 0);

export const buildCompensationSummary = (
  values: CompensationFormValues,
  preferredCurrency: CurrencyCode,
  rates: ExchangeRates,
): CompensationSummary => {
  const baseAnnual = convertFieldAnnual(
    values.recurring.base,
    preferredCurrency,
    rates,
  );
  const allowancesAnnual = convertFieldAnnual(
    values.recurring.food,
    preferredCurrency,
    rates,
  );
  const bonusRate = values.recurring.bonusPercentage / 100;
  const bonusAnnual = safe(baseAnnual * bonusRate);

  const benefitsBaseAnnual = convertAmount(
    values.recurring.base.amount * 12,
    values.recurring.base.currency,
    values.benefits.calculationCurrency,
    values.recurring.base.overrideRate,
    rates,
  );
  const benefitsAllowanceAnnual = convertAmount(
    values.recurring.food.amount * 12,
    values.recurring.food.currency,
    values.benefits.calculationCurrency,
    values.recurring.food.overrideRate,
    rates,
  );
  const benefitsRate = values.benefits.percentage / 100;
  const benefitsValueInCalcCurrency = safe(
    (benefitsBaseAnnual + benefitsAllowanceAnnual) * benefitsRate,
  );
  const benefitsAnnual = convertAmount(
    benefitsValueInCalcCurrency,
    values.benefits.calculationCurrency,
    preferredCurrency,
    undefined,
    rates,
  );

  const { schedule: rsuSchedule, breakdown } = getRsuSchedule(
    values.rsuGrants,
    preferredCurrency,
    rates,
  );
  const rsuAnnual = rsuSchedule[0] ?? 0;

  // Calculate ESPP totals from all plans
  let esppTotalContributions = 0;
  let esppTotalReturns = 0;

  if (values.esppPlans && values.esppPlans.length > 0) {
    for (const plan of values.esppPlans) {
      const baseAnnualForEspp = convertAmount(
        values.recurring.base.amount * 12,
        values.recurring.base.currency,
        plan.purchaseCurrency,
        values.recurring.base.overrideRate,
        rates,
      );

      // Calculate for the plan duration (typically 6 months)
      const durationYears = (plan.durationMonths || 6) / 12;
      const contributionRate = plan.contributionPercentage / 100;
      const growthRate = plan.growthPercentage / 100;
      
      const contributionsInPurchase = safe(baseAnnualForEspp * contributionRate * durationYears);
      const contributionsInTarget = convertAmount(
        contributionsInPurchase,
        plan.purchaseCurrency,
        preferredCurrency,
        plan.overrideRate,
        rates,
      );
      const returnsInTarget = safe(contributionsInTarget * growthRate);

      esppTotalContributions += contributionsInTarget;
      esppTotalReturns += returnsInTarget;
    }
  }

  const espp: EsppSummary = {
    enabled: esppTotalContributions > 0,
    contributions: esppTotalContributions,
    returns: esppTotalReturns,
  };

  const recurringTotal = safe(baseAnnual + allowancesAnnual);
  const annualTotal = safe(
    recurringTotal +
      bonusAnnual +
      benefitsAnnual +
      rsuAnnual +
      espp.contributions +
      espp.returns,
  );
  const monthlyTotal = annualTotal / 12;

  const distribution: DistributionItem[] = [
    { label: "Base + Allowances", value: recurringTotal },
    { label: "Bonus", value: bonusAnnual },
    { label: "Benefits", value: benefitsAnnual },
    { label: "RSUs", value: rsuAnnual },
    { label: "ESPP", value: espp.contributions + espp.returns },
  ];

  const raisesMap = buildRaisesMap(values);
  const projectionYears = getProjectionYears(rsuSchedule, raisesMap);

  const timeline: TimelinePoint[] = [];
  let cumulativeMultiplier = 1;
  const baseAnnualSafe = baseAnnual || 1;

  for (let year = 0; year < projectionYears; year += 1) {
    if (year > 0 && raisesMap.has(year)) {
      cumulativeMultiplier *= 1 + (raisesMap.get(year) ?? 0);
    }

    const baseYear = safe(baseAnnual * cumulativeMultiplier);
    const allowancesYear = safe(allowancesAnnual * cumulativeMultiplier);
    const bonusYear = safe(baseYear * bonusRate);
    const benefitsYear = safe(
      (baseYear + allowancesYear) * benefitsRate,
    );
    const rsuYear = rsuSchedule[year] ?? 0;

    let esppYear = 0;
    if (espp.enabled) {
      const proportion = baseAnnualSafe ? baseYear / baseAnnualSafe : 1;
      const contributionsYear = espp.contributions * proportion;
      const returnsYear = espp.returns * proportion;
      esppYear = contributionsYear + returnsYear;
    }

    const totalYear = safe(
      baseYear +
        allowancesYear +
        bonusYear +
        benefitsYear +
        rsuYear +
        esppYear,
    );

    timeline.push({
      year,
      base: baseYear,
      allowances: allowancesYear,
      bonus: bonusYear,
      benefits: benefitsYear,
      rsu: rsuYear,
      espp: esppYear,
      total: totalYear,
    });
  }

  return {
    preferredCurrency,
    totals: {
      annual: annualTotal,
      monthly: monthlyTotal,
      base: baseAnnual,
      allowances: allowancesAnnual,
      bonus: bonusAnnual,
      benefits: benefitsAnnual,
      rsuAnnual,
      espp,
    },
    distribution,
    timeline,
    rsuBreakdown: breakdown,
  };
};

export type { CompensationSummary, DistributionItem, TimelinePoint };
