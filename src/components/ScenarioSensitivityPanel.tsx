import React from 'react';
import { Columns, Shield, CheckCircle, Flame, ArrowUpRight, TrendingUp } from 'lucide-react';
import { ScenarioComparison } from '../types/simulator';
import { formatNumberFa } from '../utils/formatters';

interface ScenarioSensitivityPanelProps {
  scenarios: ScenarioComparison[];
}

export const ScenarioSensitivityPanel: React.FC<ScenarioSensitivityPanelProps> = ({
  scenarios,
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 lg:p-6 shadow-xl relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-4 mb-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Columns className="w-4 h-4" />
          </div>
          <h2 className="text-base font-bold text-white">
            تحلیل حساسیت و مقایسه سناریوهای سه‌گانه (Scenario Matrix)
          </h2>
        </div>
        <span className="text-xs text-slate-400">
          مقایسه سناریوی بدبینانه، واقع‌بینانه و خوش‌بینانه برای تارگت یکسان
        </span>
      </div>

      {/* 3 Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {scenarios.map((sc, index) => {
          const isConservative = index === 0;
          const isRealistic = index === 1;
          const isOptimistic = index === 2;

          return (
            <div
              key={sc.name}
              className={`rounded-xl p-5 border transition-all flex flex-col justify-between ${
                isRealistic
                  ? 'bg-slate-950/90 border-indigo-500/40 shadow-lg shadow-indigo-500/5 ring-1 ring-indigo-500/20'
                  : 'bg-slate-950/60 border-slate-800'
              }`}
            >
              <div>
                {/* Header of column */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {isConservative && <Shield className="w-4 h-4 text-amber-400" />}
                    {isRealistic && <CheckCircle className="w-4 h-4 text-indigo-400" />}
                    {isOptimistic && <Flame className="w-4 h-4 text-emerald-400" />}
                    <h3 className="text-sm font-bold text-white">{sc.name}</h3>
                  </div>

                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      sc.feasibilityScore > 75
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : sc.feasibilityScore > 50
                        ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}
                  >
                    شاخص: {formatNumberFa(sc.feasibilityScore)}٪
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 mb-4 leading-relaxed">
                  {sc.description}
                </p>

                {/* Metrics Breakdown */}
                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                    <span className="text-slate-400">مشتریان برنده لازم:</span>
                    <span className="font-extrabold text-white">
                      {formatNumberFa(sc.wonDeals)} معامله
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                    <span className="text-slate-400">فرصت‌های فعال در پایپ‌لاین:</span>
                    <span className="font-extrabold text-sky-400">
                      {formatNumberFa(sc.opportunities)} فرصت
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                    <span className="text-slate-400">کل سرنخ‌های ورودی (Leads):</span>
                    <span className="font-extrabold text-indigo-300">
                      {formatNumberFa(sc.leads)} سرنخ
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                    <span className="text-slate-400">فروشنده تمام‌وقت لازم:</span>
                    <span className="font-extrabold text-amber-300">
                      {formatNumberFa(sc.repsNeeded)} نفر
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                    <span className="text-slate-400">بودجه تبلیغاتی تخمینی:</span>
                    <span className="font-extrabold text-rose-300">
                      {sc.budgetMillionTomans >= 1000
                        ? `${(sc.budgetMillionTomans / 1000).toLocaleString('fa-IR', {
                            maximumFractionDigits: 1,
                          })} میلیارد ت`
                        : `${formatNumberFa(sc.budgetMillionTomans)} میلیون ت`}
                    </span>
                  </div>
                </div>
              </div>

              {isRealistic && (
                <div className="mt-4 pt-3 border-t border-indigo-500/20 text-center">
                  <span className="text-[11px] font-semibold text-indigo-400">
                    ★ سناریوی مبنای اجرایی
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
