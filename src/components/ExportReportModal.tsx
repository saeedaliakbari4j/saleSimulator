import React from 'react';
import { X, Printer, Target, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';
import { SimulationResults, HistoricalBaseline, SalesRep } from '../types/simulator';
import { formatNumberFa, formatTomans } from '../utils/formatters';

interface ExportReportModalProps {
  isOpen: boolean;
  results: SimulationResults;
  baseline: HistoricalBaseline;
  reps: SalesRep[];
  targetBillion: number;
  periodLabel: string;
  onClose: () => void;
}

export const ExportReportModal: React.FC<ExportReportModalProps> = ({
  isOpen,
  results,
  baseline,
  reps,
  targetBillion,
  periodLabel,
  onClose,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const departed = reps.filter((r) => !r.active);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full p-6 shadow-2xl overflow-y-auto max-h-[92vh]">
        {/* Modal Controls (Hidden in Print) */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-5 print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white">
              پیش‌نمایش گزارش اجرایی برای ارائه به مدیرعامل و هیئت‌مدیره
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>چاپ گزارش / ذخیره PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Executive Memo Content */}
        <div id="printable-report" className="space-y-6 text-slate-200">
          {/* Header Memo */}
          <div className="border-b border-slate-800 pb-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider block mb-1">
                  گزارش رسمی برنامه‌ریزی و شبیه‌سازی فروش
                </span>
                <h1 className="text-2xl font-black text-white">
                  طرح توجیهی و امکان‌سنجی تحقق تارگت {formatNumberFa(targetBillion)} میلیارد تومان
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  دوره: {periodLabel} | مدل مبنا: {baseline.name}
                </p>
              </div>
              <div className="text-left text-xs text-slate-400">
                <span className="block font-bold text-slate-300">تاریخ تهیه گزارش:</span>
                <span>امروز (پیش از شروع فصل)</span>
              </div>
            </div>
          </div>

          {/* Key Executive Summary Box */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
            <div>
              <span className="text-[11px] text-slate-400 block">تارگت ناخالص:</span>
              <span className="text-lg font-black text-white">
                {formatNumberFa(targetBillion)} میلیارد تومان
              </span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block">مشتریان جدید لازم:</span>
              <span className="text-lg font-black text-emerald-400">
                {formatNumberFa(results.requiredWonDeals)} قرارداد
              </span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block">بودجه تبلیغاتی مصوب:</span>
              <span className="text-lg font-black text-rose-400">
                {results.totalAdBudgetTomans >= 1_000_000_000
                  ? `${(results.totalAdBudgetTomans / 1_000_000_000).toLocaleString('fa-IR', {
                      maximumFractionDigits: 1,
                    })} میلیارد ت`
                  : `${formatNumberFa(Math.round(results.totalAdBudgetTomans / 1_000_000))} م.ت`}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block">شاخص امکان‌پذیری:</span>
              <span className="text-lg font-black text-indigo-400">
                {formatNumberFa(results.feasibilityScore)} / ۱۰۰
              </span>
            </div>
          </div>

          {/* Detailed Requirements Table */}
          <div>
            <h4 className="text-sm font-bold text-white mb-2">
              جدول نیازمندی‌های زنجیره فروش برای تحقق تارگت:
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-right border border-slate-800">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-2.5">شاخص زنجیره فروش</th>
                    <th className="p-2.5">مقدار لازم</th>
                    <th className="p-2.5">سوابق تاریخی دوره قبل</th>
                    <th className="p-2.5">ارزیابی ریسک و تحلیل</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  <tr>
                    <td className="p-2.5 font-semibold">مشتریان قطعی جدید</td>
                    <td className="p-2.5 text-white font-bold">
                      {formatNumberFa(results.requiredWonDeals)} معامله
                    </td>
                    <td className="p-2.5 text-slate-400">
                      {formatNumberFa(
                        Math.round(
                          (baseline.pastRevenueBillionTomans * 1000) /
                            baseline.avgDealSizeMillionTomans
                        )
                      )}{' '}
                      معامله
                    </td>
                    <td className="p-2.5 text-slate-300">
                      رشد {formatNumberFa(Math.round(results.growthFromPastPercent))}٪ نسبت به دوره قبل
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-semibold">فرصت‌های فعال پایپ‌لاین (Opps)</td>
                    <td className="p-2.5 text-sky-400 font-bold">
                      {formatNumberFa(results.requiredOpportunities)} فرصت
                    </td>
                    <td className="p-2.5 text-slate-400">
                      ظرفیت جاری: {formatNumberFa(results.teamTotalCapacityDeals)}
                    </td>
                    <td className="p-2.5 text-slate-300">
                      لود کاری تیم: {formatNumberFa(Math.round(results.teamWorkloadUtilizationPercent))}٪
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-semibold">سرنخ‌های ورودی خام (Leads)</td>
                    <td className="p-2.5 text-purple-400 font-bold">
                      {formatNumberFa(results.requiredTotalLeads)} سرنخ
                    </td>
                    <td className="p-2.5 text-slate-400">
                      {formatNumberFa(baseline.leadToOppRatePercent)}% تبدیل
                    </td>
                    <td className="p-2.5 text-slate-300">
                      {formatNumberFa(results.requiredPaidLeads)} تبلیغاتی + {formatNumberFa(results.requiredOrganicLeads)} ارگانیک
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-semibold">نیروی فروش مورد نیاز</td>
                    <td className="p-2.5 text-amber-400 font-bold">
                      {formatNumberFa(
                        Math.max(results.requiredRepsByQuota, results.requiredRepsByWorkload)
                      )}{' '}
                      نفر
                    </td>
                    <td className="p-2.5 text-slate-400">
                      تیم فعال فعلی: {formatNumberFa(results.activeRepCount)} نفر
                    </td>
                    <td className="p-2.5 text-slate-300">
                      {results.repShortfallOrSurplus < 0
                        ? `کسری ${formatNumberFa(Math.abs(results.repShortfallOrSurplus))} فروشنده`
                        : 'نیروی فروش کافی'}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-semibold">بودجه تبلیغات و جذب</td>
                    <td className="p-2.5 text-rose-400 font-bold">
                      {formatTomans(results.totalAdBudgetTomans)}
                    </td>
                    <td className="p-2.5 text-slate-400">
                      CPL: {formatNumberFa(baseline.costPerPaidLeadThousandTomans)} هزار ت
                    </td>
                    <td className="p-2.5 text-slate-300">
                      ROAS: {formatNumberFa(Math.round(results.roas))}x | CAC: {formatTomans(results.cacTomans)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Turnover Impact Note if applicable */}
          {departed.length > 0 && (
            <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/60 text-xs">
              <h5 className="font-bold text-rose-300 mb-1">
                ⚠️ گزارش اثر خروج فروشندگان ({departed.map((r) => r.name).join('، ')}):
              </h5>
              <p className="text-rose-200/90 leading-relaxed">
                خروج این نیروها باعث ایجاد کسری{' '}
                <strong>{formatNumberFa(results.turnoverRevenueLossBillionTomans, 1)} میلیارد تومانی</strong>{' '}
                در سقف توان فروش تیم شده است. برای پوشش بدون افت کیفیت، یا باید سهمیه هر فروشنده باقی‌مانده{' '}
                <strong>{formatNumberFa(results.remainingRepsExtraQuotaNeededPerRep, 2)} میلیارد تومان</strong>{' '}
                افزایش یابد یا نیروی جایگزین استخدام گردد.
              </p>
            </div>
          )}

          {/* Actionable Recommendations */}
          <div>
            <h4 className="text-sm font-bold text-white mb-2">توصیه‌های تاکتیکی مدیر فروش:</h4>
            <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside">
              {results.insights.map((ins) => (
                <li key={ins.id} className="leading-relaxed">
                  <strong className="text-white">{ins.title}:</strong> {ins.actionRecommendation}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
