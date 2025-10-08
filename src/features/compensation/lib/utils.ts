import type { CurrencyCode } from "~/features/compensation/lib/constants";
import type {
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
) =>
  convertAmount(
    field.amount,
    field.currency,
    target,
    field.overrideRate,
    rates,
  );

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
  const maxRaise = raisesMap.size ? Math.max(...raisesMap.keys()) : 0;
  const rsuYears = Object.keys(schedule).length
    ? Math.max(...Object.keys(schedule).map((key) => Number(key)))
    : 0;

  return Math.max(5, maxRaise + 1, rsuYears + 1);
};

const safe = (value: number) => (Number.isFinite(value) ? value : 0);

const getEsppMonthsInYear = (
  startDate: string,
  durationMonths: number,
  targetYear: number,
): number => {
  const start = new Date(startDate);
  if (Number.isNaN(start.getTime())) {
    return 0;
  }

  const startYear = start.getFullYear();
  const startMonth = start.getMonth(); // 0-11
  
  // Calculate end date
  const end = new Date(start);
  end.setMonth(end.getMonth() + durationMonths);
  const endYear = end.getFullYear();
  const endMonth = end.getMonth();

  // If target year is before start or after end, no months
  if (targetYear < startYear || targetYear > endYear) {
    return 0;
  }

  // If plan starts and ends in target year
  if (startYear === targetYear && endYear === targetYear) {
    return durationMonths;
  }

  // If plan starts in target year but ends in a later year
  if (startYear === targetYear && endYear > targetYear) {
    return 12 - startMonth;
  }

  // If plan started before target year and ends in target year
  if (startYear < targetYear && endYear === targetYear) {
    return endMonth;
  }

  // If plan spans across target year (started before, ends after)
  if (startYear < targetYear && endYear > targetYear) {
    return 12;
  }

  return 0;
};

export const buildCompensationSummary = (
  values: CompensationFormValues,
  preferredCurrency: CurrencyCode,
  rates: ExchangeRates,
): CompensationSummary => {
  // ============================================================================
  // STEP 1: Convert base compensation to preferred currency (without raises)
  // ============================================================================
  const baseAnnualRaw = convertFieldAnnual(
    values.recurring.base,
    preferredCurrency,
    rates,
  );
  const foodAllowanceAnnual = convertFieldAnnual(
    values.recurring.food,
    preferredCurrency,
    rates,
  );

  // ============================================================================
  // STEP 2: Get RSU schedule and raises map
  // ============================================================================
  const { schedule: rsuSchedule, breakdown } = getRsuSchedule(
    values.rsuGrants,
    preferredCurrency,
    rates,
  );
  const raisesMap = buildRaisesMap(values);

  // ============================================================================
  // STEP 3: Calculate year 0 multiplier (apply raises at year 0 if any)
  // ============================================================================
  const year0Multiplier = raisesMap.has(0) ? 1 + (raisesMap.get(0) ?? 0) : 1;

  // ============================================================================
  // STEP 4: Calculate year 0 values (with raises applied)
  // ============================================================================
  const baseAnnual = safe(baseAnnualRaw * year0Multiplier);

  // Bonus: percentage of raised base salary (not food allowance)
  const bonusRate = values.recurring.bonusPercentage / 100;
  const bonusAnnual = safe(baseAnnual * bonusRate);

  // Benefits: just food allowance (and future: signing bonus, relocation, stipend)
  // Note: benefits percentage is NOT applied here since bonus already covers salary percentage
  const benefitsAnnual = foodAllowanceAnnual;

  // RSU: year 0 value from schedule
  const rsuAnnual = rsuSchedule[0] ?? 0;

  // ESPP: calculate contributions and returns for year 0
  const currentYear = new Date().getFullYear();
  let esppAnnualContributions = 0;
  let esppAnnualReturns = 0;

  if (values.esppPlans && values.esppPlans.length > 0) {
    for (const plan of values.esppPlans) {
      // Calculate how many months this plan is active in year 0
      const monthsInYear0 = getEsppMonthsInYear(
        plan.startDate,
        plan.durationMonths,
        currentYear,
      );

      if (monthsInYear0 === 0) {
        continue;
      }

      // Convert raised base salary to purchase currency
      const baseInPurchaseCurrency = convertAmount(
        baseAnnual,
        preferredCurrency,
        plan.purchaseCurrency,
        plan.overrideRate,
        rates,
      );

      // Monthly contribution rate
      const contributionRate = plan.contributionPercentage / 100;
      const growthRate = plan.growthPercentage / 100;

      // Contribution for the months active in year 0
      const monthlyBaseInPurchase = baseInPurchaseCurrency / 12;
      const contributionInPurchase = safe(
        monthlyBaseInPurchase * contributionRate * monthsInYear0,
      );

      // Convert to preferred currency
      const contributionInPreferred = convertAmount(
        contributionInPurchase,
        plan.purchaseCurrency,
        preferredCurrency,
        plan.overrideRate,
        rates,
      );

      // Calculate returns (gain from discount/growth)
      const returnsInPreferred = safe(contributionInPreferred * growthRate);

      esppAnnualContributions += contributionInPreferred;
      esppAnnualReturns += returnsInPreferred;
    }
  }

  const espp: EsppSummary = {
    enabled: esppAnnualContributions > 0,
    contributions: esppAnnualContributions,
    returns: esppAnnualReturns,
  };

  // ============================================================================
  // STEP 5: Calculate totals for year 0
  // ============================================================================
  // ESPP contributions come out of base salary, so we deduct them
  const baseAfterEspp = safe(baseAnnual - espp.contributions);
  const esppTotal = safe(espp.contributions + espp.returns);
  
  const annualTotal = safe(
    baseAfterEspp +
      bonusAnnual +
      benefitsAnnual +
      rsuAnnual +
      esppTotal, // Total ESPP value (contributions + gains)
  );
  const monthlyTotal = annualTotal / 12;

  // ============================================================================
  // STEP 6: Build distribution (year 0 values)
  // ============================================================================
  const distribution: DistributionItem[] = [
    { label: "Base Salary", value: baseAfterEspp },
    { label: "Bonus", value: bonusAnnual },
    { label: "Benefits", value: benefitsAnnual },
    { label: "RSUs", value: rsuAnnual },
    { label: "ESPP", value: esppTotal },
  ];

  // ============================================================================
  // STEP 7: Build timeline for all projection years
  // ============================================================================
  const projectionYears = getProjectionYears(rsuSchedule, raisesMap);
  const timeline: TimelinePoint[] = [];
  let cumulativeMultiplier = 1;

  for (let year = 0; year < projectionYears; year += 1) {
    // Apply raises: at year 0, apply year 0 raise; at year N, apply year N raise
    if (raisesMap.has(year)) {
      cumulativeMultiplier *= 1 + (raisesMap.get(year) ?? 0);
    }

    // Base salary with cumulative raises (food allowance does NOT get raises)
    const baseYear = safe(baseAnnualRaw * cumulativeMultiplier);
    const bonusYear = safe(baseYear * bonusRate);

    // Benefits: just food allowance (constant, no raises)
    const benefitsYear = foodAllowanceAnnual;

    // RSU: from schedule
    const rsuYear = rsuSchedule[year] ?? 0;

    // ESPP: calculate for this specific year based on plan dates
    let esppContributionsYear = 0;
    let esppReturnsYear = 0;
    const targetYear = currentYear + year;

    if (values.esppPlans && values.esppPlans.length > 0) {
      for (const plan of values.esppPlans) {
        const monthsInTargetYear = getEsppMonthsInYear(
          plan.startDate,
          plan.durationMonths,
          targetYear,
        );

        if (monthsInTargetYear === 0) {
          continue;
        }

        // Convert raised base salary to purchase currency
        const baseYearInPurchaseCurrency = convertAmount(
          baseYear,
          preferredCurrency,
          plan.purchaseCurrency,
          plan.overrideRate,
          rates,
        );

        const contributionRate = plan.contributionPercentage / 100;
        const growthRate = plan.growthPercentage / 100;

        // Contribution for the months active in this year
        const monthlyBaseInPurchase = baseYearInPurchaseCurrency / 12;
        const contributionInPurchase = safe(
          monthlyBaseInPurchase * contributionRate * monthsInTargetYear,
        );

        const contributionInPreferred = convertAmount(
          contributionInPurchase,
          plan.purchaseCurrency,
          preferredCurrency,
          plan.overrideRate,
          rates,
        );

        const returnsInPreferred = safe(contributionInPreferred * growthRate);

        esppContributionsYear += contributionInPreferred;
        esppReturnsYear += returnsInPreferred;
      }
    }

    // Deduct ESPP contributions from base salary
    const baseYearAfterEspp = safe(baseYear - esppContributionsYear);
    const esppTotalYear = safe(esppContributionsYear + esppReturnsYear);

    const totalYear = safe(
      baseYearAfterEspp +
        bonusYear +
        benefitsYear +
        rsuYear +
        esppTotalYear, // Total ESPP (contributions + gains)
    );

    timeline.push({
      year,
      base: baseYearAfterEspp,
      allowances: foodAllowanceAnnual,
      bonus: bonusYear,
      benefits: benefitsYear,
      rsu: rsuYear,
      espp: esppTotalYear,
      total: totalYear,
    });
  }

  return {
    preferredCurrency,
    totals: {
      annual: annualTotal,
      monthly: monthlyTotal,
      base: baseAfterEspp,
      allowances: foodAllowanceAnnual,
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
