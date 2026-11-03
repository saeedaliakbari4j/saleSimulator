import React, { useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  Calendar,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Percent,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { TimePeriod, HistoricalBaseline } from '../types/simulator';
import { formatNumberFa } from '../utils/formatters';

interface TargetConfigPanelProps {
  targetBillion: number;
  period: TimePeriod;
  periodLabel: string;
  baseline: HistoricalBaseline;
  customAvgDealSize?: number;
  customConversionRate?: number;
  customOrganicShare?: number;
  customCpl?: number;
  onTargetChange: (val: number) => void;
  onPeriodChange: (period: TimePeriod, label: string) => void;
  onCustomAvgDealSizeChange: (val?: number) => void;
  onCustomConversionRateChange: (val?: number) => void;
  onCustomOrganicShareChange: (val?: number) => void;
  onCustomCplChange: (val?: number) => void;
  onResetFineTuning: () => void;
}

export const TargetConfigPanel: React.FC<TargetConfigPanelProps> = ({
  targetBillion,
  period,
  baseline,
  customAvgDealSize,
  customConversionRate,
  customOrganicShare,
  customCpl,
  onTargetChange,
  onPeriodChange,
  onCustomAvgDealSizeChange,
  onCustomConversionRateChange,
  onCustomOrganicShareChange,
  onCustomCplChange,
  onResetFineTuning,
}) => {
  const [showAdvancedSliders, setShowAdvancedSliders] = useState(false);

  const QUICK_TARGET_BUTTONS = [15, 20, 25, 30, 40, 50, 75];

  const pastRevenue = baseline.pastRevenueBillionTomans;
  const growthPercent =
    pastRevenue > 0 ? ((targetBillion - pastRevenue) / pastRevenue) * 100 : 0;

  const currentDealSize = customAvgDealSize ?? baseline.avgDealSizeMillionTomans;
  const baseConversionRate =
    (baseline.oppToProposalRatePercent * baseline.proposalToWonRatePercent) / 100;
  const currentConversionRate = customConversionRate ?? baseConversionRate;
  const currentOrganicShare = customOrganicShare ?? baseline.organicLeadSharePercent;
  const currentCpl = customCpl ?? baseline.costPerPaidLeadThousandTomans;

  const hasOverrides =
    customAvgDealSize !== undefined ||
    customConversionRate !== undefined ||
    customOrganicShare !== undefined ||
    customCpl !== undefined;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 lg:p-6 shadow-xl relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute -left-20 -top-20 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-sky-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col gap-6">
        {/* Top bar: Period & Prompt highlight */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs text-slate-400 block">دوره شبیه‌سازی</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onPeriodChange('Q1', 'فصل بعد (۳ ماهه)')}
                  className={`text-xs px-2.5 py-1 rounded-md font-medium transition-all ${
                    period === 'Q1'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
                  }`}
                >
                  فصل بعد (پیش‌فرض)
                </button>
                <button
                  onClick={() => onPeriodChange('MONTH', 'ماه بعد (۱ ماهه)')}
                  className={`text-xs px-2.5 py-1 rounded-md font-medium transition-all ${
                    period === 'MONTH'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
                  }`}
                >
                  ماه بعد
                </button>
                <button
                  onClick={() => onPeriodChange('CUSTOM', 'شش‌ماهه')}
                  className={`text-xs px-2.5 py-1 rounded-md font-medium transition-all ${
                    period === 'CUSTOM'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
                  }`}
                >
                  شش‌ماهه
                </button>
              </div>
            </div>
          </div>

          {/* Historical comparison chip */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300">
            <span className="text-slate-400">سوابق دوره قبل:</span>
            <span className="font-semibold text-white">
              {formatNumberFa(pastRevenue)} میلیارد تومان
            </span>
            <div
              className={`flex items-center gap-1 font-bold mr-1.5 px-2 py-0.5 rounded-full ${
                growthPercent >= 0
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              }`}
            >
              <TrendingUp className="w-3 h-3" />
              <span>
                {growthPercent >= 0 ? '+' : ''}
                {formatNumberFa(Math.round(growthPercent))}٪ رشد
              </span>
            </div>
          </div>
        </div>

        {/* Center: Main Target Input & Slider */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Target Display and Direct Input */}
          <div className="lg:col-span-5 bg-slate-950/70 border border-slate-800/90 rounded-2xl p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-indigo-400" />
                تارگت فروش اعلامی مدیر:
              </span>
              <span className="text-[11px] text-indigo-300 bg-indigo-950/60 border border-indigo-800/60 px-2 py-0.5 rounded">
                بر حسب میلیارد تومان
              </span>
            </div>

            <div className="flex items-baseline gap-2 mt-1">
              <input
                type="number"
                min="1"
                max="250"
                step="0.5"
                value={targetBillion}
                onChange={(e) => onTargetChange(Math.max(1, parseFloat(e.target.value) || 0))}
                className="text-4xl lg:text-5xl font-extrabold text-white bg-transparent border-b-2 border-indigo-500/40 focus:border-indigo-400 focus:outline-none w-36 tracking-tight"
              />
              <span className="text-xl font-bold text-slate-200">میلیارد تومان</span>
            </div>

            {/* Quick buttons */}
            <div className="mt-4 flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] text-slate-400 ml-1">انتخاب سریع:</span>
              {QUICK_TARGET_BUTTONS.map((val) => (
                <button
                  key={val}
                  onClick={() => onTargetChange(val)}
                  className={`text-xs px-2.5 py-1 rounded-md font-semibold transition-all ${
                    targetBillion === val
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                      : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700/80 hover:text-white'
                  }`}
                >
                  {formatNumberFa(val)} م.ت
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Target Slider & Visual Track */}
          <div className="lg:col-span-7 flex flex-col justify-center px-2">
            <div className="flex justify-between items-center text-xs text-slate-400 mb-2">
              <span>تنظیم پیوسته تارگت فروش (آزمایش سناریوهای مختلف)</span>
              <span className="font-semibold text-slate-300">
                {formatNumberFa(targetBillion)} میلیارد تومان
              </span>
            </div>

            {/* Range Slider */}
            <div className="relative py-2">
              <input
                type="range"
                min="5"
                max="100"
                step="1"
                value={targetBillion}
                onChange={(e) => onTargetChange(parseFloat(e.target.value))}
                className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 focus:outline-none"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-2 px-1">
                <span>۵ میلیارد</span>
                <span>۲۵ میلیارد</span>
                <span className="text-indigo-400 font-bold">۳۰ میلیارد (مثال)</span>
                <span>۵۰ میلیارد</span>
                <span>۱۰۰ میلیارد</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 mt-3 leading-relaxed">
              💡 با جابجایی تارگت، سیستم بلافاصله محاسبات معکوس قیف، تعداد معاملات، فروشندگان و
              بودجه تبلیغاتی لازم را بازتولید می‌کند.
            </p>
          </div>
        </div>

        {/* Expandable Fine-Tuning Sliders (What-If Parameters) */}
        <div className="border-t border-slate-800/80 pt-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowAdvancedSliders(!showAdvancedSliders)}
              className="flex items-center gap-2 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {showAdvancedSliders ? 'بستن اهرم‌های پیشرفته و فرضیات' : 'آزمایش اهرم‌های فرضی (نرخ تبدیل، مبلغ فاکتور، بودجه)'}
              </span>
              {showAdvancedSliders ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
              {hasOverrides && (
                <span className="mr-2 px-1.5 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 font-normal">
                  سفارشی‌سازی فعال
                </span>
              )}
            </button>

            {hasOverrides && (
              <button
                onClick={onResetFineTuning}
                className="text-[11px] text-slate-400 hover:text-rose-400 transition-colors"
              >
                بازگشت به مقادیر واقعی سوابق
              </button>
            )}
          </div>

          {showAdvancedSliders && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
              {/* 1. Average Deal Size Slider */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300 flex items-center gap-1">
                    <Layers className="w-3 h-3 text-sky-400" />
                    میانگین مبلغ هر معامله:
                  </span>
                  <span className="font-bold text-sky-400">
                    {formatNumberFa(currentDealSize)} میلیون
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="300"
                  step="5"
                  value={currentDealSize}
                  onChange={(e) => onCustomAvgDealSizeChange(parseFloat(e.target.value))}
                  className="h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-sky-400"
                />
                <span className="text-[10px] text-slate-400">
                  سوابق پایه: {baseline.avgDealSizeMillionTomans} میلیون تومان
                </span>
              </div>

              {/* 2. Conversion Rate Slider */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300 flex items-center gap-1">
                    <Percent className="w-3 h-3 text-emerald-400" />
                    نرخ تبدیل فرصت به برنده:
                  </span>
                  <span className="font-bold text-emerald-400">
                    {formatNumberFa(Math.round(currentConversionRate * 100))}%
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="50"
                  step="1"
                  value={Math.round(currentConversionRate * 100)}
                  onChange={(e) =>
                    onCustomConversionRateChange(parseFloat(e.target.value))
                  }
                  className="h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-emerald-400"
                />
                <span className="text-[10px] text-slate-400">
                  سوابق پایه: {Math.round(baseConversionRate * 100)}%
                </span>
              </div>

              {/* 3. Organic Share Slider */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300 flex items-center gap-1">
                    <HelpCircle className="w-3 h-3 text-indigo-400" />
                    سهم لیدهای ارگانیک/معرف:
                  </span>
                  <span className="font-bold text-indigo-400">
                    {formatNumberFa(currentOrganicShare)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="80"
                  step="5"
                  value={currentOrganicShare}
                  onChange={(e) => onCustomOrganicShareChange(parseFloat(e.target.value))}
                  className="h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-indigo-400"
                />
                <span className="text-[10px] text-slate-400">
                  سوابق پایه: {baseline.organicLeadSharePercent}% ارگانیک
                </span>
              </div>

              {/* 4. Cost Per Lead (CPL) Slider */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300 flex items-center gap-1">
                    <DollarSign className="w-3 h-3 text-amber-400" />
                    هزینه سرنخ تبلیغاتی (CPL):
                  </span>
                  <span className="font-bold text-amber-400">
                    {formatNumberFa(currentCpl)} هزار ت
                  </span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="1200"
                  step="25"
                  value={currentCpl}
                  onChange={(e) => onCustomCplChange(parseFloat(e.target.value))}
                  className="h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-amber-400"
                />
                <span className="text-[10px] text-slate-400">
                  سوابق پایه: {baseline.costPerPaidLeadThousandTomans} هزار تومان
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
