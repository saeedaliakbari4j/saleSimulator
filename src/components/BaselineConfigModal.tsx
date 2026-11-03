import React, { useState } from 'react';
import { X, Sliders, Check, RotateCcw, HelpCircle } from 'lucide-react';
import { HistoricalBaseline } from '../types/simulator';

interface BaselineConfigModalProps {
  isOpen: boolean;
  baseline: HistoricalBaseline;
  onClose: () => void;
  onSave: (updated: HistoricalBaseline) => void;
}

export const BaselineConfigModal: React.FC<BaselineConfigModalProps> = ({
  isOpen,
  baseline,
  onClose,
  onSave,
}) => {
  if (!isOpen) return null;

  const [form, setForm] = useState<HistoricalBaseline>({ ...baseline });

  const handleChange = (key: keyof HistoricalBaseline, val: any) => {
    setForm((prev) => ({ ...prev, [key]: val }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-5">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                تنظیم و ثبت سوابق واقعی فروش (CRM & Historical Baseline)
              </h3>
              <p className="text-xs text-slate-400">
                این ضرایب به عنوان مبنای واقعی شبیه‌سازی تمام تارگت‌ها به کار می‌روند.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Section 1: Financial & Deal size */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <h4 className="text-xs font-bold text-indigo-400 mb-3">
              ۱. سوابق مالی و مبالغ معامله
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-300 block mb-1">
                  فروش محقق‌شده دوره گذشته (میلیارد تومان):
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={form.pastRevenueBillionTomans}
                  onChange={(e) =>
                    handleChange('pastRevenueBillionTomans', parseFloat(e.target.value) || 0)
                  }
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">
                  میانگین اندازه فاکتور/معامله (میلیون تومان):
                </label>
                <input
                  type="number"
                  step="1"
                  value={form.avgDealSizeMillionTomans}
                  onChange={(e) =>
                    handleChange('avgDealSizeMillionTomans', parseFloat(e.target.value) || 0)
                  }
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Conversion Rates */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <h4 className="text-xs font-bold text-emerald-400 mb-3">
              ۲. نرخ‌های تبدیل مراحل قیف فروش (درصد)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] text-slate-300 block mb-1">
                  سرنخ به فرصت واجد شرایط (Lead &rarr; Opp):
                </label>
                <input
                  type="number"
                  step="1"
                  value={form.leadToOppRatePercent}
                  onChange={(e) =>
                    handleChange('leadToOppRatePercent', parseFloat(e.target.value) || 0)
                  }
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-300 block mb-1">
                  فرصت به دمو/پیش‌فاکتور (Opp &rarr; Proposal):
                </label>
                <input
                  type="number"
                  step="1"
                  value={form.oppToProposalRatePercent}
                  onChange={(e) =>
                    handleChange('oppToProposalRatePercent', parseFloat(e.target.value) || 0)
                  }
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-300 block mb-1">
                  پیش‌فاکتور به معامله قطعی (Proposal &rarr; Won):
                </label>
                <input
                  type="number"
                  step="1"
                  value={form.proposalToWonRatePercent}
                  onChange={(e) =>
                    handleChange('proposalToWonRatePercent', parseFloat(e.target.value) || 0)
                  }
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Marketing & Sales Ops */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <h4 className="text-xs font-bold text-sky-400 mb-3">
              ۳. هزینه‌های جذب و عملیات بازاریابی
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] text-slate-300 block mb-1">
                  هزینه هر سرنخ تبلیغاتی CPL (هزار تومان):
                </label>
                <input
                  type="number"
                  step="10"
                  value={form.costPerPaidLeadThousandTomans}
                  onChange={(e) =>
                    handleChange(
                      'costPerPaidLeadThousandTomans',
                      parseFloat(e.target.value) || 0
                    )
                  }
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-300 block mb-1">
                  سهم لیدهای ارگانیک و رفرال (درصد):
                </label>
                <input
                  type="number"
                  step="5"
                  value={form.organicLeadSharePercent}
                  onChange={(e) =>
                    handleChange('organicLeadSharePercent', parseFloat(e.target.value) || 0)
                  }
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-300 block mb-1">
                  طول متوسط چرخه فروش (روز):
                </label>
                <input
                  type="number"
                  step="1"
                  value={form.avgSalesCycleDays}
                  onChange={(e) =>
                    handleChange('avgSalesCycleDays', parseInt(e.target.value) || 0)
                  }
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs text-slate-400 hover:text-white"
            >
              انصراف
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>ذخیره و اعمال بر شبیه‌ساز</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
