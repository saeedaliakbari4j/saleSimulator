import React from 'react';
import {
  Briefcase,
  UserCheck,
  Users,
  Target,
  CreditCard,
  Megaphone,
  ArrowUpRight,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';
import { SimulationResults } from '../types/simulator';
import { formatNumberFa, formatTomans } from '../utils/formatters';

interface KpiSummaryCardsProps {
  results: SimulationResults;
}

export const KpiSummaryCards: React.FC<KpiSummaryCardsProps> = ({ results }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Target className="w-5 h-5 text-indigo-400" />
          <span>پاسخ دقیق سیستم به ۶ سوال کلیدی مدیر فروش</span>
        </h2>
        <span className="text-xs text-slate-400">
          محاسبه‌شده بر اساس سوابق واقعی و تارگت انتخابی
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* CARD 1: چند مشتری جدید باید جذب شوند؟ */}
        <div className="bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 transition-all shadow-lg flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-emerald-400" />
                ۱. مشتریان جدید لازم (قرارداد موفق)
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                Won Deals
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                {formatNumberFa(results.requiredWonDeals)}
              </span>
              <span className="text-sm font-semibold text-slate-300">مشتری قطعی</span>
            </div>

            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              برای محقق کردن درآمد هدف، باید حداقل {formatNumberFa(results.requiredWonDeals)}{' '}
              قرارداد به ارزش میانگین {formatTomans(results.effectiveAvgDealSizeTomans)} بسته و
              تسویه شوند.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>میانگین فاکتور:</span>
            <span className="font-semibold text-slate-200">
              {formatTomans(results.effectiveAvgDealSizeTomans)}
            </span>
          </div>
        </div>

        {/* CARD 2: چند فرصت فروش جدید لازم است؟ */}
        <div className="bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 transition-all shadow-lg flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-sky-400" />
                ۲. فرصت‌های فروش لازم در پایپ‌لاین
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 font-medium">
                Pipeline Opps
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                {formatNumberFa(results.requiredOpportunities)}
              </span>
              <span className="text-sm font-semibold text-slate-300">فرصت معتبر (SQL)</span>
            </div>

            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              با احتساب نرخ تبدیل پایپ‌لاین به برنده ({formatNumberFa(Math.round(results.effectiveOppToWonRate * 100))}٪)،
              تیم باید همواره این تعداد معامله فعال در جریان داشته باشد.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>کل سرنخ‌های خام (Leads):</span>
            <span className="font-semibold text-sky-300">
              {formatNumberFa(results.requiredTotalLeads)} لید ورودی
            </span>
          </div>
        </div>

        {/* CARD 3: چند فروشنده لازم داریم؟ */}
        <div
          className={`bg-slate-900/90 border rounded-2xl p-5 transition-all shadow-lg flex flex-col justify-between group ${
            results.isTeamOverloaded
              ? 'border-amber-500/40 bg-gradient-to-b from-amber-500/5 to-transparent'
              : 'border-slate-800 hover:border-slate-700/80'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-indigo-400" />
                ۳. تعداد فروشنده لازم و وضعیت ظرفیت
              </span>
              <span
                className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                  results.isTeamOverloaded
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                }`}
              >
                تیم فعال: {formatNumberFa(results.activeRepCount)} نفر
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                {formatNumberFa(
                  Math.max(results.requiredRepsByQuota, results.requiredRepsByWorkload)
                )}
              </span>
              <span className="text-sm font-semibold text-slate-300">فروشنده تمام‌وقت</span>
            </div>

            <div className="mt-2 text-xs text-slate-400 leading-relaxed">
              {results.repShortfallOrSurplus < 0 ? (
                <div className="flex items-center gap-1.5 text-amber-400 font-medium">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    کسری {formatNumberFa(Math.abs(results.repShortfallOrSurplus))} فروشنده نسبت به
                    فشار کاری قیف!
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>تعداد فروشندگان برای پوشش سهمیه کافی است.</span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>درصد لود کاری تیم:</span>
            <span
              className={`font-semibold ${
                results.teamWorkloadUtilizationPercent > 115
                  ? 'text-rose-400'
                  : 'text-emerald-400'
              }`}
            >
              {formatNumberFa(Math.round(results.teamWorkloadUtilizationPercent))}٪ ظرفیت
            </span>
          </div>
        </div>

        {/* CARD 4: نرخ تبدیل باید چقدر باشد؟ */}
        <div className="bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 transition-all shadow-lg flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                <Target className="w-4 h-4 text-purple-400" />
                ۴. نرخ تبدیل هدف (Conversion Rate)
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 font-medium">
                Win Rate
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                {formatNumberFa(Math.round(results.effectiveOppToWonRate * 100))}%
              </span>
              <span className="text-sm font-semibold text-slate-300">نرخ مبنای تاریخی</span>
            </div>

            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              اگر سقف لیدها محدود به ظرفیت فعلی پایپ‌لاین باشد، نرخ تبدیل برای رسیدن به تارگت باید
              به <strong className="text-purple-300">{formatNumberFa(Math.round(results.neededConversionRateIfOppFixed))}%</strong> ارتقا
              یابد.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>نرخ تبدیل کل سرنخ به برنده:</span>
            <span className="font-semibold text-purple-300">
              {formatNumberFa(+(results.effectiveLeadToWonRate * 100).toFixed(1))}%
            </span>
          </div>
        </div>

        {/* CARD 5: متوسط مبلغ هر معامله باید چقدر باشد؟ */}
        <div className="bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 transition-all shadow-lg flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-amber-400" />
                ۵. متوسط مبلغ هر معامله (Deal Size)
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium">
                ACV / ADS
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                {formatNumberFa(results.effectiveAvgDealSizeTomans / 1_000_000)}
              </span>
              <span className="text-sm font-semibold text-slate-300">میلیون تومان</span>
            </div>

            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              اگر تعداد مشتریان جذب‌شده در حد ظرفیت فعلی ({formatNumberFa(Math.round(results.teamTotalCapacityDeals * results.effectiveOppToWonRate))} نفر)
              بماند، متوسط هر معامله باید به{' '}
              <strong className="text-amber-300">{formatTomans(results.neededAvgDealSizeIfDealsFixed)}</strong> برسد.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>استراتژی بیش‌فروشی (Upsell):</span>
            <span className="font-semibold text-amber-300">
              +۱۰٪ معادل {formatNumberFa((results.effectiveAvgDealSizeTomans * 1.1) / 1_000_000)} م.ت
            </span>
          </div>
        </div>

        {/* CARD 6: برای رسیدن به تارگت چقدر بودجه تبلیغاتی لازم است؟ */}
        <div className="bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 transition-all shadow-lg flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                <Megaphone className="w-4 h-4 text-rose-400" />
                ۶. بودجه تبلیغاتی و مارکتینگ لازم
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 font-medium">
                Ad Spend
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                {results.totalAdBudgetTomans >= 1_000_000_000
                  ? (results.totalAdBudgetTomans / 1_000_000_000).toLocaleString('fa-IR', {
                      maximumFractionDigits: 2,
                    })
                  : formatNumberFa(Math.round(results.totalAdBudgetTomans / 1_000_000))}
              </span>
              <span className="text-sm font-semibold text-slate-300">
                {results.totalAdBudgetTomans >= 1_000_000_000 ? 'میلیارد تومان' : 'میلیون تومان'}
              </span>
            </div>

            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              برای جذب {formatNumberFa(results.requiredPaidLeads)} سرنخ تبلیغاتی (با احتساب سهم ارگانیک)،
              این بودجه با بازگشت سرمایه {formatNumberFa(Math.round(results.roas))} برابری (ROAS)
              لازم است.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>هزینه جذب هر مشتری (CAC):</span>
            <span className="font-semibold text-rose-300">
              {formatTomans(results.cacTomans)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
