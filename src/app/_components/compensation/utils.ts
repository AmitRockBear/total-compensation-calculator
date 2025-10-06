import { CurrencyCode } from "./constants";
import {
  CompensationFormValues,
  MonetaryFieldValues,
  RsuGrantValues,
} from "./schema";

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
  if (!values.raises.enabled) {
    return new Map<number, number>();
  }

  const map = new Map<number, number>();

  values.raises.items.forEach((item) => {
    map.set(item.yearOffset, item.percentage / 100);
  });

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

  let espp: EsppSummary = {
    enabled: false,
    contributions: 0,
    returns: 0,
  };

  if (
    values.espp.enabled &&
    values.espp.contributionPercentage !== undefined &&
    values.espp.growthPercentage !== undefined &&
    values.espp.purchaseCurrency
  ) {
    const baseAnnualForEsp = convertAmount(
      values.recurring.base.amount * 12,
      values.recurring.base.currency,
      values.espp.purchaseCurrency,
      values.recurring.base.overrideRate,
      rates,
    );

    const contributionRate = values.espp.contributionPercentage / 100;
    const growthRate = values.espp.growthPercentage / 100;
    const contributionsInPurchase = safe(baseAnnualForEsp * contributionRate);
    const contributionsInTarget = convertAmount(
      contributionsInPurchase,
      values.espp.purchaseCurrency,
      preferredCurrency,
      values.espp.overrideRate,
      rates,
    );
    const returnsInTarget = safe(contributionsInTarget * growthRate);

    espp = {
      enabled: true,
      contributions: contributionsInTarget,
      returns: returnsInTarget,
    };
  }

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
