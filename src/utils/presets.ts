import { HistoricalBaseline, SalesRep } from '../types/simulator';

export const DEFAULT_REPS: SalesRep[] = [
  {
    id: 'rep-1',
    name: 'علی رستمی',
    role: 'Senior',
    quotaBillionTomans: 7.5,
    conversionRatePercent: 24,
    maxActiveDeals: 40,
    active: true,
  },
  {
    id: 'rep-2',
    name: 'سارا احمدی',
    role: 'Senior',
    quotaBillionTomans: 7.0,
    conversionRatePercent: 22,
    maxActiveDeals: 38,
    active: true,
  },
  {
    id: 'rep-3',
    name: 'محمد حسینی',
    role: 'Mid',
    quotaBillionTomans: 5.5,
    conversionRatePercent: 19,
    maxActiveDeals: 32,
    active: true,
  },
  {
    id: 'rep-4',
    name: 'مریم کاظمی',
    role: 'Mid',
    quotaBillionTomans: 5.0,
    conversionRatePercent: 18,
    maxActiveDeals: 30,
    active: true,
  },
  {
    id: 'rep-5',
    name: 'امیر رضایی',
    role: 'Junior',
    quotaBillionTomans: 3.5,
    conversionRatePercent: 14,
    maxActiveDeals: 25,
    active: true,
  },
];

export const INDUSTRY_PRESETS: HistoricalBaseline[] = [
  {
    id: 'preset-b2b-saas',
    name: 'نرم‌افزار سازمانی و فناوری (B2B SaaS)',
    description: 'مدل ویژه شرکت‌های نرم‌افزاری با معاملات سالانه/قراردادی و قیف چندمرحله‌ای دمو',
    periodLabel: 'فصل پاییز (سوابق گذشته)',
    pastRevenueBillionTomans: 20, // 20 میلیارد
    avgDealSizeMillionTomans: 80, // 80 میلیون تومان
    leadToOppRatePercent: 28, // 28%
    oppToProposalRatePercent: 55, // 55%
    proposalToWonRatePercent: 38, // 38%
    costPerPaidLeadThousandTomans: 350, // 350 هزار تومان
    organicLeadSharePercent: 35, // 35%
    avgSalesCycleDays: 32,
    avgRepQuotaBillionTomans: 5.8,
    avgRepCapacityDeals: 33,
  },
  {
    id: 'preset-b2b-commerce',
    name: 'بازرگانی و پخش عمده (B2B Trading)',
    description: 'تعداد معاملات بالاتر با ارزش متوسط متوسط و چرخه فروش سریع‌تر',
    periodLabel: 'فصل پاییز (سوابق گذشته)',
    pastRevenueBillionTomans: 22,
    avgDealSizeMillionTomans: 45,
    leadToOppRatePercent: 35,
    oppToProposalRatePercent: 60,
    proposalToWonRatePercent: 42,
    costPerPaidLeadThousandTomans: 180,
    organicLeadSharePercent: 45,
    avgSalesCycleDays: 18,
    avgRepQuotaBillionTomans: 6.0,
    avgRepCapacityDeals: 45,
  },
  {
    id: 'preset-industrial-equipment',
    name: 'تجهیزات صنعتی و مهندسی (High-Ticket)',
    description: 'معاملات سنگین سازمانی با مبالغ بالا، چرخه فروش طولانی و نرخ تبدیل دقیق',
    periodLabel: 'فصل پاییز (سوابق گذشته)',
    pastRevenueBillionTomans: 24,
    avgDealSizeMillionTomans: 250, // 250 میلیون
    leadToOppRatePercent: 22,
    oppToProposalRatePercent: 45,
    proposalToWonRatePercent: 32,
    costPerPaidLeadThousandTomans: 650,
    organicLeadSharePercent: 30,
    avgSalesCycleDays: 60,
    avgRepQuotaBillionTomans: 7.5,
    avgRepCapacityDeals: 20,
  },
  {
    id: 'preset-services-consulting',
    name: 'خدمات مشاوره‌ای، حقوقی و مالی',
    description: 'تمرکز بر اعتبار سازمانی، معرفی و مشتریان مکرر با هزینه لید پایین‌تر',
    periodLabel: 'فصل پاییز (سوابق گذشته)',
    pastRevenueBillionTomans: 16,
    avgDealSizeMillionTomans: 65,
    leadToOppRatePercent: 32,
    oppToProposalRatePercent: 50,
    proposalToWonRatePercent: 36,
    costPerPaidLeadThousandTomans: 280,
    organicLeadSharePercent: 50,
    avgSalesCycleDays: 25,
    avgRepQuotaBillionTomans: 4.8,
    avgRepCapacityDeals: 30,
  },
];
