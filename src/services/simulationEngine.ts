import {
  SimulationInputs,
  SimulationResults,
  ExecutiveInsight,
  ScenarioComparison,
} from '../types/simulator';

export function runSalesSimulation(inputs: SimulationInputs): SimulationResults {
  const {
    targetBillionTomans,
    baseline,
    reps,
    customAvgDealSizeMillionTomans,
    customOppConversionRatePercent,
    customLeadToOppRatePercent,
    customOrganicSharePercent,
    customCplThousandTomans,
    autoReassignLostQuota,
    simulateReplacementHire,
    replacementRampUpMonths,
  } = inputs;

  const targetTomans = targetBillionTomans * 1_000_000_000;
  const pastRevenueTomans = baseline.pastRevenueBillionTomans * 1_000_000_000;
  const growthFromPastPercent =
    pastRevenueTomans > 0
      ? ((targetTomans - pastRevenueTomans) / pastRevenueTomans) * 100
      : 0;

  // 1. Effective Parameters
  const effectiveAvgDealSizeTomans =
    (customAvgDealSizeMillionTomans ?? baseline.avgDealSizeMillionTomans) *
    1_000_000;

  // Conversion rates
  const leadToOppRate =
    (customLeadToOppRatePercent ?? baseline.leadToOppRatePercent) / 100;

  // Opp to Won Rate = (Opp to Proposal) * (Proposal to Won) unless custom override given
  const baselineOppToWonRate =
    (baseline.oppToProposalRatePercent / 100) *
    (baseline.proposalToWonRatePercent / 100);

  const effectiveOppToWonRate =
    customOppConversionRatePercent !== undefined
      ? customOppConversionRatePercent / 100
      : baselineOppToWonRate;

  const effectiveLeadToWonRate = leadToOppRate * effectiveOppToWonRate;

  // 2. Core Requirements Calculations
  // چند مشتری جدید باید جذب شوند
  const requiredWonDeals = Math.max(
    1,
    Math.ceil(targetTomans / (effectiveAvgDealSizeTomans || 1))
  );

  // چند فرصت فروش جدید لازم است
  const requiredOpportunities = Math.max(
    1,
    Math.ceil(requiredWonDeals / (effectiveOppToWonRate || 0.01))
  );

  // کل سرنخ‌های ورودی لازم
  const requiredTotalLeads = Math.max(
    1,
    Math.ceil(requiredOpportunities / (leadToOppRate || 0.01))
  );

  // Funnel numbers
  const proposalsEstimate = Math.ceil(
    requiredOpportunities * (baseline.oppToProposalRatePercent / 100)
  );

  // 3. Marketing & Ad Budget Calculations (چقدر بودجه تبلیغاتی لازم است)
  const organicShare =
    (customOrganicSharePercent ?? baseline.organicLeadSharePercent) / 100;
  const paidShare = Math.max(0, 1 - organicShare);

  const requiredPaidLeads = Math.ceil(requiredTotalLeads * paidShare);
  const requiredOrganicLeads = requiredTotalLeads - requiredPaidLeads;

  const cplTomans =
    (customCplThousandTomans ?? baseline.costPerPaidLeadThousandTomans) * 1_000;
  const totalAdBudgetTomans = requiredPaidLeads * cplTomans;

  const cacTomans =
    requiredWonDeals > 0 ? totalAdBudgetTomans / requiredWonDeals : 0;
  const budgetToRevenueRatioPercent =
    targetTomans > 0 ? (totalAdBudgetTomans / targetTomans) * 100 : 0;
  const roas = totalAdBudgetTomans > 0 ? targetTomans / totalAdBudgetTomans : 0;

  // 4. Sales Reps & Turnover Analysis (چند فروشنده لازم داریم + اثر خروج)
  const totalRepCount = reps.length;
  const activeReps = reps.filter((r) => r.active);
  const departedReps = reps.filter((r) => !r.active);
  const activeRepCount = activeReps.length;

  // Team capacity calculations
  const teamTotalQuotaBillionTomans = activeReps.reduce(
    (sum, r) => sum + r.quotaBillionTomans,
    0
  );
  const teamTotalCapacityDeals = activeReps.reduce(
    (sum, r) => sum + r.maxActiveDeals,
    0
  );

  // Benchmarking rep requirement
  const avgRepQuota =
    baseline.avgRepQuotaBillionTomans > 0
      ? baseline.avgRepQuotaBillionTomans
      : 5.0;
  const avgRepCapacity =
    baseline.avgRepCapacityDeals > 0 ? baseline.avgRepCapacityDeals : 30;

  const requiredRepsByQuota = Math.ceil(targetBillionTomans / avgRepQuota);
  const requiredRepsByWorkload = Math.ceil(
    requiredOpportunities / avgRepCapacity
  );

  // Rep deficit/surplus vs current active team
  const repShortfallOrSurplus =
    activeRepCount - Math.max(requiredRepsByQuota, requiredRepsByWorkload);

  // Team Workload & Quota Coverage
  const teamWorkloadUtilizationPercent =
    teamTotalCapacityDeals > 0
      ? (requiredOpportunities / teamTotalCapacityDeals) * 100
      : 999;

  const teamQuotaCoveragePercent =
    teamTotalQuotaBillionTomans > 0
      ? (teamTotalQuotaBillionTomans / targetBillionTomans) * 100
      : 0;

  const isTeamOverloaded =
    teamWorkloadUtilizationPercent > 115 || teamQuotaCoveragePercent < 85;

  // 5. Impact of Rep Turnover (خروج فروشندگان)
  const turnoverRevenueLossBillionTomans = departedReps.reduce(
    (sum, r) => sum + r.quotaBillionTomans,
    0
  );
  const turnoverOpportunityCapacityLoss = departedReps.reduce(
    (sum, r) => sum + r.maxActiveDeals,
    0
  );

  let remainingRepsExtraQuotaNeededPerRep = 0;
  let remainingRepsWorkloadIncreasePercent = 0;

  if (activeRepCount > 0 && departedReps.length > 0) {
    remainingRepsExtraQuotaNeededPerRep =
      turnoverRevenueLossBillionTomans / activeRepCount;

    const previousCapacity =
      teamTotalCapacityDeals + turnoverOpportunityCapacityLoss;
    if (previousCapacity > 0) {
      remainingRepsWorkloadIncreasePercent =
        (turnoverOpportunityCapacityLoss / previousCapacity) * 100;
    }
  }

  // 6. Goal Seek & Sensitivity Calculations
  // A. اگر فرصت‌های ورودی روی سقف ظرفیت فعلی تیم یا گذشته محدود باشد، نرخ تبدیل چقدر باید باشد؟
  const baselineAvailableOpp =
    teamTotalCapacityDeals > 0 ? teamTotalCapacityDeals : requiredOpportunities;
  const neededConversionRateIfOppFixed =
    baselineAvailableOpp > 0
      ? Math.min(100, (requiredWonDeals / baselineAvailableOpp) * 100)
      : 0;

  // B. اگر تعداد مشتریان برنده روی توان بستن تیم ثابت بماند، متوسط مبلغ هر معامله باید چقدر باشد؟
  const estimatedPossibleWonDeals = Math.round(
    teamTotalCapacityDeals * effectiveOppToWonRate
  );
  const neededAvgDealSizeIfDealsFixed =
    estimatedPossibleWonDeals > 0
      ? targetTomans / estimatedPossibleWonDeals
      : targetTomans;

  // 7. Feasibility Score & Bottleneck Evaluation (Internal Expert Engine)
  let score = 100;

  // Deduct for high growth rate
  if (growthFromPastPercent > 80) score -= 25;
  else if (growthFromPastPercent > 40) score -= 15;
  else if (growthFromPastPercent > 20) score -= 8;

  // Deduct for team overload
  if (teamWorkloadUtilizationPercent > 150) score -= 30;
  else if (teamWorkloadUtilizationPercent > 120) score -= 20;
  else if (teamWorkloadUtilizationPercent > 105) score -= 10;

  // Deduct for quota coverage gap
  if (teamQuotaCoveragePercent < 70) score -= 25;
  else if (teamQuotaCoveragePercent < 85) score -= 15;
  else if (teamQuotaCoveragePercent < 95) score -= 5;

  // Deduct for departed reps without replacement
  if (departedReps.length > 0) {
    score -= departedReps.length * 8;
  }

  const feasibilityScore = Math.max(10, Math.min(100, Math.round(score)));

  let feasibilityLevel: SimulationResults['feasibilityLevel'] = 'High';
  if (feasibilityScore < 45) feasibilityLevel = 'Critical';
  else if (feasibilityScore < 65) feasibilityLevel = 'Challenging';
  else if (feasibilityScore < 85) feasibilityLevel = 'Moderate';

  // Primary Bottleneck Identification
  let primaryBottleneck: SimulationResults['primaryBottleneck'] = 'None';
  if (teamWorkloadUtilizationPercent > 120 || repShortfallOrSurplus < -1) {
    primaryBottleneck = 'Reps';
  } else if (budgetToRevenueRatioPercent > 18) {
    primaryBottleneck = 'Leads';
  } else if (growthFromPastPercent > 50 && effectiveOppToWonRate < 0.15) {
    primaryBottleneck = 'Conversion';
  } else if (requiredWonDeals > 1000) {
    primaryBottleneck = 'DealSize';
  }

  // 8. Generate Rule-Based Executive Insights (No external AI needed)
  const insights: ExecutiveInsight[] = generateExecutiveInsights({
    targetBillionTomans,
    growthFromPastPercent,
    requiredWonDeals,
    requiredOpportunities,
    requiredTotalLeads,
    totalAdBudgetTomans,
    budgetToRevenueRatioPercent,
    activeRepCount,
    departedReps,
    teamQuotaCoveragePercent,
    teamWorkloadUtilizationPercent,
    effectiveAvgDealSizeTomans,
    effectiveOppToWonRate,
    turnoverRevenueLossBillionTomans,
    remainingRepsExtraQuotaNeededPerRep,
    repShortfallOrSurplus,
    primaryBottleneck,
    cplTomans,
  });

  return {
    targetTomans,
    growthFromPastPercent,
    requiredWonDeals,
    requiredOpportunities,
    requiredTotalLeads,
    requiredPaidLeads,
    requiredOrganicLeads,
    effectiveAvgDealSizeTomans,
    effectiveOppToWonRate,
    effectiveLeadToWonRate,
    activeRepCount,
    totalRepCount,
    departedReps,
    teamTotalQuotaBillionTomans,
    teamTotalCapacityDeals,
    requiredRepsByQuota,
    requiredRepsByWorkload,
    repShortfallOrSurplus,
    teamWorkloadUtilizationPercent,
    teamQuotaCoveragePercent,
    isTeamOverloaded,
    turnoverRevenueLossBillionTomans,
    turnoverOpportunityCapacityLoss,
    remainingRepsExtraQuotaNeededPerRep,
    remainingRepsWorkloadIncreasePercent,
    totalAdBudgetTomans,
    cacTomans,
    budgetToRevenueRatioPercent,
    roas,
    neededConversionRateIfOppFixed,
    neededAvgDealSizeIfDealsFixed,
    funnel: {
      leads: requiredTotalLeads,
      opportunities: requiredOpportunities,
      proposals: proposalsEstimate,
      won: requiredWonDeals,
    },
    feasibilityScore,
    feasibilityLevel,
    primaryBottleneck,
    insights,
  };
}

interface InsightsEngineParams {
  targetBillionTomans: number;
  growthFromPastPercent: number;
  requiredWonDeals: number;
  requiredOpportunities: number;
  requiredTotalLeads: number;
  totalAdBudgetTomans: number;
  budgetToRevenueRatioPercent: number;
  activeRepCount: number;
  departedReps: SimulationInputs['reps'];
  teamQuotaCoveragePercent: number;
  teamWorkloadUtilizationPercent: number;
  effectiveAvgDealSizeTomans: number;
  effectiveOppToWonRate: number;
  turnoverRevenueLossBillionTomans: number;
  remainingRepsExtraQuotaNeededPerRep: number;
  repShortfallOrSurplus: number;
  primaryBottleneck: SimulationResults['primaryBottleneck'];
  cplTomans: number;
}

function generateExecutiveInsights(params: InsightsEngineParams): ExecutiveInsight[] {
  const insights: ExecutiveInsight[] = [];

  // Insight 1: Turnover & Rep Departure Impact
  if (params.departedReps.length > 0) {
    const departedNames = params.departedReps.map((r) => r.name).join(' و ');
    insights.push({
      id: 'insight-turnover-impact',
      type: 'critical',
      title: `هشدار بحرانی: خروج ${params.departedReps.length} نفر از فروشندگان (${departedNames})`,
      description: `خروج این نیروها باعث ایجاد کسری مستقیم ${params.turnoverRevenueLossBillionTomans.toFixed(1)} میلیارد تومانی از سقف تارگت شده است. در صورت عدم جایگزینی، به ازای هر یک از فروشندگان باقی‌مانده مبلغ ${params.remainingRepsExtraQuotaNeededPerRep.toFixed(2)} میلیارد تومان تارگت مازاد تحمیل خواهد شد.`,
      actionRecommendation: `۱. سریعاً فرآیند جذب حداقل ۱ نیروی فروش مید-لول آغاز شود. ۲. لیدهای پرپتانسیل و داغ رها شده‌ی نیروهای مستعفی بین فروشندگان برتر بازتوزیع گردد.`,
      metricImpact: `کسری سهمیه: ${params.turnoverRevenueLossBillionTomans.toFixed(1)} میلیارد تومان`,
    });
  }

  // Insight 2: Team Workload & Capacity Stress
  if (params.teamWorkloadUtilizationPercent > 120) {
    insights.push({
      id: 'insight-team-overload',
      type: 'warning',
      title: `فشار کاری تیم فروش در ناحیه قرمز (${Math.round(params.teamWorkloadUtilizationPercent)}٪ ظرفیت)`,
      description: `تیم فعلی ظرفیت پیگیری همزمان این حجم از فرصت‌های فروش جدید (${params.requiredOpportunities.toLocaleString('fa-IR')} معامله فعال) را ندارد. فشار بیش از حد معمولاً باعث افت نرخ پاسخ‌دهی و سوخت شدن لیدها می‌شود.`,
      actionRecommendation: `برای جلوگیری از افت کیفیت جلسات و افت نرخ تبدیل، یا باید حداقل ${Math.abs(params.repShortfallOrSurplus)} فروشنده جدید اضافه شود یا با غربالگری سخت‌گیرانه‌تر لیدها (Lead Qualification)، فقط معاملات سایز بزرگ در اولویت پیگیری قرار گیرند.`,
      metricImpact: `اضافه بار کاری: +${Math.round(params.teamWorkloadUtilizationPercent - 100)}٪`,
    });
  } else if (params.teamQuotaCoveragePercent < 90) {
    insights.push({
      id: 'insight-quota-gap',
      type: 'warning',
      title: `شکاف پوشش تارگت تیمی (${Math.round(params.teamQuotaCoveragePercent)}٪)`,
      description: `مجموع سهمیه‌های انفرادی فروشندگان فعال (${(params.targetBillionTomans * (params.teamQuotaCoveragePercent / 100)).toFixed(1)} میلیارد) کمتر از تارگت کل فصل (${params.targetBillionTomans} میلیارد) است.`,
      actionRecommendation: `تارگت‌های انفرادی باید متناسب بازنگری شوند یا پاداش مضاعف (Over-achievement Commission) برای بستن معاملات بالاتر از سقف تعیین شود.`,
    });
  }

  // Insight 3: Marketing Budget & Ad Spend
  const budgetBillion = params.totalAdBudgetTomans / 1_000_000_000;
  if (params.budgetToRevenueRatioPercent > 12) {
    insights.push({
      id: 'insight-marketing-budget-heavy',
      type: 'warning',
      title: `بودجه تبلیغاتی سنگین نسبت به درآمد (${params.budgetToRevenueRatioPercent.toFixed(1)}٪ از تارگت)`,
      description: `برای جذب ${params.requiredTotalLeads.toLocaleString('fa-IR')} سرنخ ورودی، نیاز به حدود ${budgetBillion >= 1 ? budgetBillion.toFixed(2) + ' میلیارد' : Math.round(params.totalAdBudgetTomans / 1_000_000).toLocaleString('fa-IR') + ' میلیون'} تومان بودجه مارکتینگ است.`,
      actionRecommendation: `سهم سرنخ‌های ارگانیک (سئو، بازاریابی محتوایی، رفرال مشتریان فعلی و فروش مجدد) را افزایش دهید تا اتکای خالص به تبلیغات کلیکی و پولی کاهش یابد.`,
      metricImpact: `بودجه تخمینی: ${budgetBillion.toFixed(2)} میلیارد تومان`,
    });
  } else {
    insights.push({
      id: 'insight-marketing-budget-efficient',
      type: 'success',
      title: `نسبت بهینه بودجه بازاریابی (${params.budgetToRevenueRatioPercent.toFixed(1)}٪ از تارگت)`,
      description: `بودجه مورد نیاز تبلیغات برای پوشش قیف منطقی و سودآور ارزیابی می‌شود (بازگشت سرمایه تبلیغات ROAS مناسب).`,
      actionRecommendation: `بودجه تبلیغات در ۳ پارت مساوی ابتدای هر ماه تزریق شود تا جریان لید یکنواخت بماند.`,
    });
  }

  // Insight 4: Deal Size & Conversion Leverage
  if (params.growthFromPastPercent > 35) {
    insights.push({
      id: 'insight-growth-strategy',
      type: 'info',
      title: `اهرم‌های تحقق رشد ${Math.round(params.growthFromPastPercent)} درصدی نسبت به دوره قبل`,
      description: `رسیدن به تارگت ۳۰ میلیاردی صرفاً با آوردن لید بیشتر، گلوگاه عملیاتی ایجاد می‌کند. دو اهرم کم‌هزینه‌تر وجود دارد: ۱. افزایش ۱۰ درصدی اندازه فاکتورها (Upselling). ۲. بهبود ۳ درصدی نرخ تبدیل پیش‌فاکتور به واریزی.`,
      actionRecommendation: `بسته‌های ترکیبی سالانه و تخفیف نقدی برای افزایش میانگین فاکتور به کار گرفته شود.`,
      metricImpact: `رشد مدنظر: ${Math.round(params.growthFromPastPercent)}٪`,
    });
  }

  return insights;
}

// Generates 3 Scenarios: Conservative (-15%), Realistic (base), Optimistic (+15%)
export function generateScenarioComparisons(
  baseInputs: SimulationInputs
): ScenarioComparison[] {
  // 1. Conservative (Bad Market / Churn / Lower conversion)
  const consInputs: SimulationInputs = {
    ...baseInputs,
    customOppConversionRatePercent:
      (baseInputs.customOppConversionRatePercent ??
        (baseInputs.baseline.oppToProposalRatePercent *
          baseInputs.baseline.proposalToWonRatePercent) /
          100) * 0.85,
    customAvgDealSizeMillionTomans:
      (baseInputs.customAvgDealSizeMillionTomans ??
        baseInputs.baseline.avgDealSizeMillionTomans) * 0.9,
    customCplThousandTomans:
      (baseInputs.customCplThousandTomans ??
        baseInputs.baseline.costPerPaidLeadThousandTomans) * 1.2,
  };
  const consResults = runSalesSimulation(consInputs);

  // 2. Realistic
  const realResults = runSalesSimulation(baseInputs);

  // 3. Optimistic (Top performing season / Good product market fit)
  const optInputs: SimulationInputs = {
    ...baseInputs,
    customOppConversionRatePercent:
      (baseInputs.customOppConversionRatePercent ??
        (baseInputs.baseline.oppToProposalRatePercent *
          baseInputs.baseline.proposalToWonRatePercent) /
          100) * 1.15,
    customAvgDealSizeMillionTomans:
      (baseInputs.customAvgDealSizeMillionTomans ??
        baseInputs.baseline.avgDealSizeMillionTomans) * 1.15,
    customCplThousandTomans:
      (baseInputs.customCplThousandTomans ??
        baseInputs.baseline.costPerPaidLeadThousandTomans) * 0.85,
  };
  const optResults = runSalesSimulation(optInputs);

  return [
    {
      name: 'محافظه‌کارانه (بدبینانه)',
      description: 'افت ۱۵٪ نرخ تبدیل، کاهش ۱۰٪ اندازه فاکتور و افزایش هزینه جذب لید',
      targetBillionTomans: baseInputs.targetBillionTomans,
      wonDeals: consResults.requiredWonDeals,
      opportunities: consResults.requiredOpportunities,
      leads: consResults.requiredTotalLeads,
      repsNeeded: Math.max(
        consResults.requiredRepsByQuota,
        consResults.requiredRepsByWorkload
      ),
      budgetMillionTomans: Math.round(
        consResults.totalAdBudgetTomans / 1_000_000
      ),
      feasibilityScore: consResults.feasibilityScore,
    },
    {
      name: 'واقع‌بینانه (مبنای فعلی)',
      description: 'تطابق کامل با سوابق تاریخی و وضعیت جاری تیم فروش',
      targetBillionTomans: baseInputs.targetBillionTomans,
      wonDeals: realResults.requiredWonDeals,
      opportunities: realResults.requiredOpportunities,
      leads: realResults.requiredTotalLeads,
      repsNeeded: Math.max(
        realResults.requiredRepsByQuota,
        realResults.requiredRepsByWorkload
      ),
      budgetMillionTomans: Math.round(
        realResults.totalAdBudgetTomans / 1_000_000
      ),
      feasibilityScore: realResults.feasibilityScore,
    },
    {
      name: 'خوش‌بینانه (رشد بهره‌وری)',
      description: 'بهبود ۱۵٪ نرخ تبدیل و بیش‌فروشی با میانگین معامله بالاتر',
      targetBillionTomans: baseInputs.targetBillionTomans,
      wonDeals: optResults.requiredWonDeals,
      opportunities: optResults.requiredOpportunities,
      leads: optResults.requiredTotalLeads,
      repsNeeded: Math.max(
        optResults.requiredRepsByQuota,
        optResults.requiredRepsByWorkload
      ),
      budgetMillionTomans: Math.round(
        optResults.totalAdBudgetTomans / 1_000_000
      ),
      feasibilityScore: optResults.feasibilityScore,
    },
  ];
}
