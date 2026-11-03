import React from 'react';
import { Filter, ArrowDown, Users, Flame, FileText, CheckCircle } from 'lucide-react';
import { SimulationResults, HistoricalBaseline } from '../types/simulator';
import { formatNumberFa } from '../utils/formatters';

interface FunnelVisualizerProps {
  results: SimulationResults;
  baseline: HistoricalBaseline;
}

export const FunnelVisualizer: React.FC<FunnelVisualizerProps> = ({
  results,
  baseline,
}) => {
  const { funnel, requiredPaidLeads, requiredOrganicLeads } = results;

  const stages = [
    {
      id: 'leads',
      name: 'کل سرنخ‌های ورودی (Leads)',
      subtitle: `${formatNumberFa(requiredPaidLeads)} تبلیغاتی + ${formatNumberFa(requiredOrganicLeads)} ارگانیک`,
      count: funnel.leads,
      conversionNext: `${formatNumberFa(baseline.leadToOppRatePercent)}% تبدیل به فرصت`,
      icon: Users,
      color: 'from-blue-600 to-indigo-600',
      textColor: 'text-sky-400',
      bgColor: 'bg-sky-500/10',
      borderColor: 'border-sky-500/20',
      widthPercent: 100,
    },
    {
      id: 'opps',
      name: 'فرصت‌های واجد شرایط (Sales Opportunities / SQL)',
      subtitle: 'مشتریان دارای پتانسیل خرید و بودجه تایید شده',
      count: funnel.opportunities,
      conversionNext: `${formatNumberFa(baseline.oppToProposalRatePercent)}% تبدیل به جلسه دمو/پیش‌فاکتور`,
      icon: Flame,
      color: 'from-indigo-600 to-violet-600',
      textColor: 'text-indigo-400',
      bgColor: 'bg-indigo-500/10',
      borderColor: 'border-indigo-500/20',
      widthPercent: 78,
    },
    {
      id: 'proposals',
      name: 'پیش‌فاکتورها و جلسات پرزنت نهایی (Proposals)',
      subtitle: 'ارائه پیشنهاد قیمت و مذاکره نهایی با مدیران تصمیم‌گیر',
      count: funnel.proposals,
      conversionNext: `${formatNumberFa(baseline.proposalToWonRatePercent)}% نرخ بستن معامله (Closing Rate)`,
      icon: FileText,
      color: 'from-violet-600 to-purple-600',
      textColor: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20',
      widthPercent: 55,
    },
    {
      id: 'won',
      name: 'مشتریان قطعی و قراردادهای برنده (Won Deals)',
      subtitle: 'واریز نهایی و آغاز همکاری یا تمدید سالانه',
      count: funnel.won,
      conversionNext: null,
      icon: CheckCircle,
      color: 'from-emerald-500 to-teal-500',
      textColor: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20',
      widthPercent: 35,
    },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 lg:p-6 shadow-xl relative overflow-hidden">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-4 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Filter className="w-4 h-4" />
          </div>
          <h2 className="text-base font-bold text-white">
            شبیه‌سازی قیف کامل تبدیل فروش (Sales Pipeline Funnel)
          </h2>
        </div>
        <span className="text-xs text-slate-400">
          جریان معکوس از تارگت فروش تا لید ورودی مارکتینگ
        </span>
      </div>

      {/* Funnel Stages List */}
      <div className="space-y-4">
        {stages.map((stage, idx) => {
          const Icon = stage.icon;

          return (
            <div key={stage.id} className="relative flex flex-col items-center">
              {/* Funnel Card */}
              <div
                style={{ width: `${stage.widthPercent}%` }}
                className={`min-w-[280px] p-4 rounded-xl border ${stage.borderColor} ${stage.bgColor} transition-all duration-300 shadow-md relative group`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-2 rounded-lg bg-slate-950/70 ${stage.textColor}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{stage.name}</h4>
                      <p className="text-[11px] text-slate-400">{stage.subtitle}</p>
                    </div>
                  </div>

                  <div className="text-left">
                    <span className="text-xl font-extrabold text-white">
                      {formatNumberFa(stage.count)}
                    </span>
                    <span className="text-[10px] text-slate-400 block">مورد لازم</span>
                  </div>
                </div>
              </div>

              {/* Conversion indicator arrow to next stage */}
              {stage.conversionNext && (
                <div className="my-1.5 flex items-center gap-2 text-[11px] font-semibold text-slate-400 bg-slate-950 px-3 py-1 rounded-full border border-slate-800">
                  <ArrowDown className="w-3 h-3 text-indigo-400 shrink-0" />
                  <span>{stage.conversionNext}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Conversion Funnel Summary Banner */}
      <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-4">
          <span>
            نرخ تبدیل سرنخ به مشتری (End-to-End):{' '}
            <strong className="text-emerald-400">
              {formatNumberFa(+(results.effectiveLeadToWonRate * 100).toFixed(2))}%
            </strong>
          </span>
          <span>
            ضریب فرصت به مشتری:{' '}
            <strong className="text-sky-400">
              ۱ به {formatNumberFa(Math.round(1 / results.effectiveOppToWonRate))}
            </strong>
          </span>
        </div>
        <span className="text-slate-400">
          سیکل متوسط فروش: {formatNumberFa(baseline.avgSalesCycleDays)} روز
        </span>
      </div>
    </div>
  );
};
