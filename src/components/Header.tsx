import React from 'react';
import { Target, Sliders, Printer, RotateCcw, Building2 } from 'lucide-react';
import { HistoricalBaseline } from '../types/simulator';
import { INDUSTRY_PRESETS } from '../utils/presets';

interface HeaderProps {
  currentBaseline: HistoricalBaseline;
  onSelectPreset: (preset: HistoricalBaseline) => void;
  onOpenBaselineModal: () => void;
  onOpenExportModal: () => void;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentBaseline,
  onSelectPreset,
  onOpenBaselineModal,
  onOpenExportModal,
  onReset,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40 px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand & Title */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 p-0.5 shadow-lg shadow-indigo-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Target className="w-6 h-6 text-indigo-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white tracking-tight">
                شبیه‌ساز استراتژیک برنامه و اهداف فروش
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                موتور تحلیلی مستقل
              </span>
            </div>
            <p className="text-xs text-slate-400">
              آزمایش پیش از فصل، بررسی قیف، ظرفیت تیم و ارزیابی اثر خروج فروشندگان
            </p>
          </div>
        </div>

        {/* Preset Selector & Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Industry Preset Selector */}
          <div className="flex items-center gap-1.5 bg-slate-800/80 border border-slate-700/60 rounded-lg px-2.5 py-1.5 text-xs text-slate-300">
            <Building2 className="w-4 h-4 text-slate-400" />
            <span className="hidden sm:inline text-slate-400">الگوی صنعت:</span>
            <select
              value={currentBaseline.id}
              onChange={(e) => {
                const found = INDUSTRY_PRESETS.find((p) => p.id === e.target.value);
                if (found) onSelectPreset(found);
              }}
              className="bg-transparent text-white font-medium focus:outline-none cursor-pointer pr-1"
            >
              {INDUSTRY_PRESETS.map((p) => (
                <option key={p.id} value={p.id} className="bg-slate-900 text-white">
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Edit Baseline Metrics */}
          <button
            onClick={onOpenBaselineModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700/60 text-xs font-medium transition-all"
            title="ویرایش سوابق و ضرایب پایه"
          >
            <Sliders className="w-3.5 h-3.5 text-indigo-400" />
            <span>تنظیم سوابق واقعی</span>
          </button>

          {/* Export Report */}
          <button
            onClick={onOpenExportModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>خروجی گزارش مدیرعامل</span>
          </button>

          {/* Reset */}
          <button
            onClick={onReset}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-all"
            title="بازنشانی شبیه‌سازی"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
