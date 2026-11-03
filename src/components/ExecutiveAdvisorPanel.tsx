import React from 'react';
import {
  BrainCircuit,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Info,
  Compass,
  ArrowRight,
  TrendingUp,
  Cpu,
} from 'lucide-react';
import { SimulationResults } from '../types/simulator';
import { formatNumberFa } from '../utils/formatters';

interface ExecutiveAdvisorPanelProps {
  results: SimulationResults;
}

export const ExecutiveAdvisorPanel: React.FC<ExecutiveAdvisorPanelProps> = ({
  results,
}) => {
  const { feasibilityScore, feasibilityLevel, primaryBottleneck, insights } = results;

  const getFeasibilityColor = () => {
    switch (feasibilityLevel) {
      case 'High':
        return {
          bar: 'bg-emerald-500',
          text: 'text-emerald-400',
          bg: 'bg-emerald-500/10 border-emerald-500/20',
          label: 'امکان‌پذیری بالا (طرح کاملاً عملیاتی و متوازن)',
        };
      case 'Moderate':
        return {
          bar: 'bg-sky-500',
          text: 'text-sky-400',
          bg: 'bg-sky-500/10 border-sky-500/20',
          label: 'امکان‌پذیری متوسط (نیازمند انضباط و اجرای دقیق)',
        };
      case 'Challenging':
        return {
          bar: 'bg-amber-500',
          text: 'text-amber-400',
          bg: 'bg-amber-500/10 border-amber-500/20',
          label: 'چالش‌برانگیز (ریسک کسری تارگت یا فرسودگی تیم)',
        };
      case 'Critical':
      default:
        return {
          bar: 'bg-rose-500',
          text: 'text-rose-400',
          bg: 'bg-rose-500/10 border-rose-500/20',
          label: 'بحرانی (فاصله زیاد بین منابع جاری و اهداف تعیین‌شده)',
        };
    }
  };

  const getBottleneckLabel = () => {
    switch (primaryBottleneck) {
      case 'Reps':
        return 'کمبود فروشنده یا اضافه بار کاری تیم';
      case 'Leads':
        return 'هزینه و حجم سنگین لیدهای مورد نیاز مارکتینگ';
      case 'Conversion':
        return 'پایین بودن نرخ تبدیل قیف نسبت به رشد تارگت';
      case 'DealSize':
        return 'خرد بودن اندازه معاملات و نیاز به بیش‌فروشی';
      case 'None':
      default:
        return 'منابع و فرآیندها متوازن هستند';
    }
  };

  const config = getFeasibilityColor();

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 lg:p-6 shadow-xl relative overflow-hidden">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">
                دستیار تحلیل استراتژیک درون‌سیستمی (Internal Sales Advisor)
              </h2>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                تحلیل آفلاین / بدون AI خارجی
              </span>
            </div>
            <p className="text-xs text-slate-400">
              ارزیابی ضریب امکان‌پذیری، شناسایی گلوگاه‌های عملیاتی و توصیه‌های تاکتیکی
            </p>
          </div>
        </div>

        {/* Bottleneck Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs">
          <span className="text-slate-400">گلوگاه اصلی:</span>
          <span className="font-bold text-amber-400">{getBottleneckLabel()}</span>
        </div>
      </div>

      {/* Feasibility Meter Banner */}
      <div className="mb-6 p-4 rounded-xl bg-slate-950/70 border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-300">
              شاخص امکان‌پذیری و تحقق هدف (Feasibility Score):
            </span>
            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${config.bg} ${config.text}`}>
              {config.label}
            </span>
          </div>
          <span className="text-xl font-extrabold text-white">
            {formatNumberFa(feasibilityScore)} / ۱۰۰
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5">
          <div
            className={`h-full rounded-full transition-all duration-500 ${config.bar}`}
            style={{ width: `${feasibilityScore}%` }}
          />
        </div>
      </div>

      {/* Actionable Executive Insights */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
          بینش‌های تاکتیکی و تحلیل ریسک‌های عملیاتی:
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {insights.map((insight) => {
            const isCritical = insight.type === 'critical';
            const isWarning = insight.type === 'warning';
            const isSuccess = insight.type === 'success';

            return (
              <div
                key={insight.id}
                className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                  isCritical
                    ? 'bg-rose-950/30 border-rose-800/60'
                    : isWarning
                    ? 'bg-amber-950/30 border-amber-800/60'
                    : isSuccess
                    ? 'bg-emerald-950/30 border-emerald-800/60'
                    : 'bg-slate-950/60 border-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-start gap-2.5 mb-2">
                    {isCritical && (
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    )}
                    {isWarning && (
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    )}
                    {isSuccess && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    )}
                    {!isCritical && !isWarning && !isSuccess && (
                      <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                    )}

                    <h4 className="text-xs font-bold text-white leading-snug">
                      {insight.title}
                    </h4>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed mb-3">
                    {insight.description}
                  </p>
                </div>

                <div className="pt-2.5 border-t border-slate-800/80">
                  <div className="text-[11px] text-slate-300 bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                    <strong className="text-indigo-400 block mb-1">💡 اقدام پیشنهادی مدیر فروش:</strong>
                    <span>{insight.actionRecommendation}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
