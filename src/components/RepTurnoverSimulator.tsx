import React, { useState } from 'react';
import {
  Users,
  UserMinus,
  UserPlus,
  AlertOctagon,
  TrendingDown,
  ShieldAlert,
  Flame,
  Award,
  PlusCircle,
  Trash2,
  HelpCircle,
} from 'lucide-react';
import { SalesRep, SimulationResults } from '../types/simulator';
import { formatNumberFa, formatTomans } from '../utils/formatters';

interface RepTurnoverSimulatorProps {
  reps: SalesRep[];
  results: SimulationResults;
  onToggleRepActive: (id: string) => void;
  onAddRep: (rep: Omit<SalesRep, 'id'>) => void;
  onRemoveRep: (id: string) => void;
}

export const RepTurnoverSimulator: React.FC<RepTurnoverSimulatorProps> = ({
  reps,
  results,
  onToggleRepActive,
  onAddRep,
  onRemoveRep,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRepName, setNewRepName] = useState('');
  const [newRepRole, setNewRepRole] = useState<'Senior' | 'Mid' | 'Junior'>('Mid');
  const [newRepQuota, setNewRepQuota] = useState('5.0');
  const [newRepWinRate, setNewRepWinRate] = useState('20');
  const [newRepCapacity, setNewRepCapacity] = useState('30');

  const departedReps = reps.filter((r) => !r.active);
  const activeReps = reps.filter((r) => r.active);

  const handleAddNewRep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRepName.trim()) return;

    onAddRep({
      name: newRepName.trim(),
      role: newRepRole,
      quotaBillionTomans: parseFloat(newRepQuota) || 5.0,
      conversionRatePercent: parseFloat(newRepWinRate) || 20,
      maxActiveDeals: parseInt(newRepCapacity) || 30,
      active: true,
    });

    setNewRepName('');
    setShowAddModal(false);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 lg:p-6 shadow-xl relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <UserMinus className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-white">
              شبیه‌ساز اثر تیم و خروج فروشندگان (Turnover & What-If)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            با یک کلیک وضعیت حضور هر فروشنده را تغییر دهید تا اثر خروج بر کسری تارگت و فشار روی
            سایر همکاران به صورت بلادرنگ ارزیابی شود.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-semibold transition-all cursor-pointer"
        >
          <PlusCircle className="w-4 h-4 text-emerald-400" />
          <span>افزودن فروشنده جدید</span>
        </button>
      </div>

      {/* Live Turnover Impact Alert Banner (when someone leaves) */}
      {departedReps.length > 0 ? (
        <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-rose-950/70 via-rose-900/40 to-slate-900 border border-rose-600/40 text-rose-100 shadow-lg">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-rose-500/20 border border-rose-500/30 text-rose-400 shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <span>هشدار شبیه‌سازی: خروج {formatNumberFa(departedReps.length)} فروشنده از تیم</span>
                  <span className="text-xs font-normal text-rose-300">
                    ({departedReps.map((r) => r.name).join('، ')})
                  </span>
                </h3>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/30 text-rose-200 font-bold">
                  اثر فوری بر عملیات
                </span>
              </div>

              {/* 3 Metrics of Turnover Impact */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                <div className="p-2.5 rounded-lg bg-slate-950/60 border border-rose-900/50">
                  <span className="text-[11px] text-slate-400 block">کسری مستقیم تارگت:</span>
                  <span className="text-base font-extrabold text-rose-400">
                    - {formatNumberFa(results.turnoverRevenueLossBillionTomans, 1)} میلیارد تومان
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    سهمیه فروش از دست رفته
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950/60 border border-rose-900/50">
                  <span className="text-[11px] text-slate-400 block">اضافه بار روی هر فروشنده فعال:</span>
                  <span className="text-base font-extrabold text-amber-400">
                    + {formatNumberFa(results.remainingRepsExtraQuotaNeededPerRep, 2)} میلیارد تومان
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    تارگت تحمیلی به ازای هر نفر
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950/60 border border-rose-900/50">
                  <span className="text-[11px] text-slate-400 block">کاهش ظرفیت پیگیری فرصت‌ها:</span>
                  <span className="text-base font-extrabold text-sky-400">
                    - {formatNumberFa(results.turnoverOpportunityCapacityLoss)} فرصت معامله
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    افت ظرفیت پایپ‌لاین همزمان
                  </span>
                </div>
              </div>

              <div className="mt-3 text-xs text-rose-200/90 leading-relaxed bg-rose-950/40 p-2.5 rounded-lg border border-rose-800/40 flex items-center justify-between flex-wrap gap-2">
                <span>
                  ⚠️ با خروج این نیروها، لود کاری تیم به{' '}
                  <strong className="text-white underline">
                    {formatNumberFa(Math.round(results.teamWorkloadUtilizationPercent))}٪
                  </strong>{' '}
                  رسیده است. اگر جایگزین نشوند، خطر افت شدید نرخ تبدیل و فرسودگی شغلی بالا می‌رود.
                </span>
                <span className="text-[11px] text-rose-300 font-semibold bg-rose-900/60 px-2 py-0.5 rounded">
                  نیاز فوری به استخدام ۱ نفر
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-6 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>تمام {formatNumberFa(reps.length)} فروشنده در حال حاضر در تیم فعال هستند.</span>
          </div>
          <span className="text-slate-400">
            برای تست اثر استعفا، دکمه «خروج از تیم» هر فروشنده را بزنید.
          </span>
        </div>
      )}

      {/* Roster of Sales Reps */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {reps.map((rep) => {
          const isDeparted = !rep.active;

          return (
            <div
              key={rep.id}
              className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                isDeparted
                  ? 'bg-slate-950/40 border-dashed border-rose-900/60 opacity-75'
                  : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 shadow-md'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                        rep.role === 'Senior'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : rep.role === 'Mid'
                          ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                          : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                      }`}
                    >
                      {rep.role === 'Senior' ? 'ارشد' : rep.role === 'Mid' ? 'متوسط' : 'جونیور'}
                    </div>
                    <div>
                      <h4
                        className={`text-sm font-bold ${
                          isDeparted ? 'line-through text-slate-400' : 'text-white'
                        }`}
                      >
                        {rep.name}
                      </h4>
                      <span className="text-[10px] text-slate-400">
                        {rep.role === 'Senior'
                          ? 'فروشنده ارشد B2B'
                          : rep.role === 'Mid'
                          ? 'فروشنده میانی'
                          : 'نیروی تازه‌کار'}
                      </span>
                    </div>
                  </div>

                  {reps.length > 2 && (
                    <button
                      onClick={() => onRemoveRep(rep.id)}
                      className="text-slate-400 hover:text-rose-400 p-1 transition-colors"
                      title="حذف از لیست"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Rep Metrics */}
                <div className="grid grid-cols-3 gap-2 my-3 p-2 rounded-lg bg-slate-900/80 text-center text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">سهمیه فصلی</span>
                    <span
                      className={`font-bold ${
                        isDeparted ? 'text-slate-400' : 'text-indigo-300'
                      }`}
                    >
                      {formatNumberFa(rep.quotaBillionTomans, 1)} م.ت
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">نرخ تبدیل</span>
                    <span
                      className={`font-bold ${
                        isDeparted ? 'text-slate-400' : 'text-emerald-400'
                      }`}
                    >
                      {formatNumberFa(rep.conversionRatePercent)}%
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">ظرفیت معامله</span>
                    <span
                      className={`font-bold ${
                        isDeparted ? 'text-slate-400' : 'text-sky-400'
                      }`}
                    >
                      {formatNumberFa(rep.maxActiveDeals)} فرصت
                    </span>
                  </div>
                </div>
              </div>

              {/* Toggle Departure Action */}
              <button
                onClick={() => onToggleRepActive(rep.id)}
                className={`w-full py-2 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  isDeparted
                    ? 'bg-rose-950/60 hover:bg-rose-900/70 text-rose-300 border border-rose-700/60'
                    : 'bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700'
                }`}
              >
                {isDeparted ? (
                  <>
                    <UserPlus className="w-3.5 h-3.5 text-emerald-400" />
                    <span>خارج شده از تیم (برای بازگردانی کلیک کنید)</span>
                  </>
                ) : (
                  <>
                    <UserMinus className="w-3.5 h-3.5 text-rose-400" />
                    <span>شبیه‌سازی استعفا و خروج از تیم</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Add New Rep Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-indigo-400" />
              <span>تعریف فروشنده جدید در تیم</span>
            </h3>

            <form onSubmit={handleAddNewRep} className="space-y-4">
              <div>
                <label className="text-xs text-slate-300 block mb-1">نام و نام خانوادگی:</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: کیان پیرزاد"
                  value={newRepName}
                  onChange={(e) => setNewRepName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 block mb-1">سطح تجربه:</label>
                  <select
                    value={newRepRole}
                    onChange={(e) =>
                      setNewRepRole(e.target.value as 'Senior' | 'Mid' | 'Junior')
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="Senior">Senior (ارشد)</option>
                    <option value="Mid">Mid (میانی)</option>
                    <option value="Junior">Junior (تازه‌کار)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-300 block mb-1">
                    سهمیه فصلی (میلیارد تومان):
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={newRepQuota}
                    onChange={(e) => setNewRepQuota(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 block mb-1">
                    نرخ تبدیل انفرادی (٪):
                  </label>
                  <input
                    type="number"
                    step="1"
                    value={newRepWinRate}
                    onChange={(e) => setNewRepWinRate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 block mb-1">
                    ظرفیت همزمان معامله (عدد):
                  </label>
                  <input
                    type="number"
                    value={newRepCapacity}
                    onChange={(e) => setNewRepCapacity(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30"
                >
                  ثبت و افزودن به شبیه‌سازی
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
