export type TimePeriod = 'Q1' | 'Q2' | 'Q3' | 'Q4' | 'MONTH' | 'CUSTOM';

export interface SalesRep {
  id: string;
  name: string;
  role: 'Senior' | 'Mid' | 'Junior';
  quotaBillionTomans: number; // e.g. 6 (6 billion tomans)
  conversionRatePercent: number; // e.g. 22%
  maxActiveDeals: number; // pipeline capacity, e.g. 35
  active: boolean; // true = active, false = departed/left
  rampUpPercent?: number; // 100 for existing, 50 for new hire
}

export interface HistoricalBaseline {
  id: string;
  name: string;
  description: string;
  periodLabel: string;
  pastRevenueBillionTomans: number; // e.g. 18 billion tomans
  avgDealSizeMillionTomans: number; // e.g. 60 million tomans
  
  // Funnel conversion rates
  leadToOppRatePercent: number; // MQL to SQL (e.g. 30%)
  oppToProposalRatePercent: number; // Opp to Demo/Proposal (e.g. 50%)
  proposalToWonRatePercent: number; // Proposal to Won (e.g. 40%)
  // overall opp-to-won is oppToProposal * proposalToWon = 20%
  // overall lead-to-won is leadToOpp * overallOppToWon = 6%

  // Marketing & acquisition
  costPerPaidLeadThousandTomans: number; // e.g. 250 thousand tomans (250,000)
  organicLeadSharePercent: number; // e.g. 35% organic/referral, 65% paid

  // Operational
  avgSalesCycleDays: number; // e.g. 30 days
  avgRepQuotaBillionTomans: number; // default quota per rep
  avgRepCapacityDeals: number; // default max active deals per rep
}

export interface SimulationInputs {
  targetBillionTomans: number; // e.g. 30 billion tomans
  period: TimePeriod;
  periodLabel: string;
  baseline: HistoricalBaseline;
  reps: SalesRep[];
  
  // Overrides / Fine-tuning sliders
  customAvgDealSizeMillionTomans?: number;
  customOppConversionRatePercent?: number;
  customLeadToOppRatePercent?: number;
  customOrganicSharePercent?: number;
  customCplThousandTomans?: number;
  
  // What-if flags
  autoReassignLostQuota: boolean; // reassign departed rep quota to remaining reps
  simulateReplacementHire: boolean; // simulate hiring replacement with ramp-up
  replacementRampUpMonths: number;
}

export interface SimulationResults {
  targetTomans: number;
  growthFromPastPercent: number;
  
  // Core deliverables requested by user
  requiredWonDeals: number; // چند مشتری جدید باید جذب شوند
  requiredOpportunities: number; // چند فرصت فروش جدید لازم است
  requiredTotalLeads: number; // کل سرنخ‌های ورودی لازم
  requiredPaidLeads: number;
  requiredOrganicLeads: number;
  
  // Financial & Deal size
  effectiveAvgDealSizeTomans: number;
  
  // Conversion rates
  effectiveOppToWonRate: number;
  effectiveLeadToWonRate: number;
  
  // Rep capacity analysis (چند فروشنده لازم داریم + اثر خروج)
  activeRepCount: number;
  totalRepCount: number;
  departedReps: SalesRep[];
  
  teamTotalQuotaBillionTomans: number;
  teamTotalCapacityDeals: number;
  
  requiredRepsByQuota: number;
  requiredRepsByWorkload: number;
  repShortfallOrSurplus: number; // positive = surplus, negative = deficit
  teamWorkloadUtilizationPercent: number; // workload %
  teamQuotaCoveragePercent: number; // quota coverage %
  isTeamOverloaded: boolean;
  
  // Turnover impact
  turnoverRevenueLossBillionTomans: number;
  turnoverOpportunityCapacityLoss: number;
  remainingRepsExtraQuotaNeededPerRep: number; // additional quota burden per active rep
  remainingRepsWorkloadIncreasePercent: number;
  
  // Marketing budget (چقدر بودجه تبلیغاتی لازم است)
  totalAdBudgetTomans: number;
  cacTomans: number; // Customer Acquisition Cost
  budgetToRevenueRatioPercent: number; // Marketing budget as % of target
  roas: number; // Return on Ad Spend (Target / Budget)
  
  // Goal seek / Sensitivity metrics
  neededConversionRateIfOppFixed: number; // نرخ تبدیل چقدر باید باشد اگر فرصت‌ها ثابت بمانند
  neededAvgDealSizeIfDealsFixed: number; // متوسط مبلغ هر معامله چقدر باید باشد اگر مشتریان ثابت باشند
  
  // Funnel stages breakdown
  funnel: {
    leads: number;
    opportunities: number;
    proposals: number;
    won: number;
  };
  
  // Feasibility & Health Score
  feasibilityScore: number; // 0 to 100
  feasibilityLevel: 'High' | 'Moderate' | 'Challenging' | 'Critical';
  primaryBottleneck: 'Leads' | 'Reps' | 'Conversion' | 'DealSize' | 'None';
  
  // Executive Insights generated without external AI
  insights: ExecutiveInsight[];
}

export interface ExecutiveInsight {
  id: string;
  type: 'critical' | 'warning' | 'success' | 'info';
  title: string;
  description: string;
  actionRecommendation: string;
  metricImpact?: string;
}

export interface ScenarioComparison {
  name: string;
  description: string;
  targetBillionTomans: number;
  wonDeals: number;
  opportunities: number;
  leads: number;
  repsNeeded: number;
  budgetMillionTomans: number;
  feasibilityScore: number;
}
