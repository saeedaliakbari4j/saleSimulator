import React, { useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  Header,
} from './components/Header';
import { TargetConfigPanel } from './components/TargetConfigPanel';
import { KpiSummaryCards } from './components/KpiSummaryCards';
import { RepTurnoverSimulator } from './components/RepTurnoverSimulator';
import { FunnelVisualizer } from './components/FunnelVisualizer';
import { ExecutiveAdvisorPanel } from './components/ExecutiveAdvisorPanel';
import { ScenarioSensitivityPanel } from './components/ScenarioSensitivityPanel';
import { BaselineConfigModal } from './components/BaselineConfigModal';
import { ExportReportModal } from './components/ExportReportModal';

import {
  TimePeriod,
  HistoricalBaseline,
  SalesRep,
  SimulationInputs,
} from './types/simulator';
import { DEFAULT_REPS, INDUSTRY_PRESETS } from './utils/presets';
import { runSalesSimulation, generateScenarioComparisons } from './services/simulationEngine';

export function App() {
  // 1. Core State
  // Default target is 30 billion Tomans as in user prompt: "تارگت فصل بعد ۳۰ میلیارد تومان است."
  const [targetBillion, setTargetBillion] = useState<number>(30);
  const [period, setPeriod] = useState<TimePeriod>('Q1');
  const [periodLabel, setPeriodLabel] = useState<string>('فصل بعد (پیش‌فرض)');

  const [baseline, setBaseline] = useState<HistoricalBaseline>(INDUSTRY_PRESETS[0]);
  const [reps, setReps] = useState<SalesRep[]>(DEFAULT_REPS);

  // Fine-tuning overrides
  const [customAvgDealSize, setCustomAvgDealSize] = useState<number | undefined>(undefined);
  const [customConversionRate, setCustomConversionRate] = useState<number | undefined>(undefined);
  const [customOrganicShare, setCustomOrganicShare] = useState<number | undefined>(undefined);
  const [customCpl, setCustomCpl] = useState<number | undefined>(undefined);

  // Modals
  const [isBaselineModalOpen, setIsBaselineModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Active view tab for deep dive
  const [activeTab, setActiveTab] = useState<'overview' | 'reps' | 'funnel' | 'scenarios'>('overview');

  // 2. Simulation Engine Execution
  const simulationInputs: SimulationInputs = useMemo(() => {
    return {
      targetBillionTomans: targetBillion,
      period,
      periodLabel,
      baseline,
      reps,
      customAvgDealSizeMillionTomans: customAvgDealSize,
      customOppConversionRatePercent: customConversionRate,
      customOrganicSharePercent: customOrganicShare,
      customCplThousandTomans: customCpl,
      autoReassignLostQuota: true,
      simulateReplacementHire: false,
      replacementRampUpMonths: 3,
    };
  }, [
    targetBillion,
    period,
    periodLabel,
    baseline,
    reps,
    customAvgDealSize,
    customConversionRate,
    customOrganicShare,
    customCpl,
  ]);

  const simulationResults = useMemo(() => {
    return runSalesSimulation(simulationInputs);
  }, [simulationInputs]);

  const scenarioComparisons = useMemo(() => {
    return generateScenarioComparisons(simulationInputs);
  }, [simulationInputs]);

  // Handlers
  const handleToggleRepActive = (id: string) => {
    setReps((prev) =>
      prev.map((r) => (r.id === id ? { ...r, active: !r.active } : r))
    );
  };

  const handleAddRep = (newRep: Omit<SalesRep, 'id'>) => {
    const id = `rep-${Date.now()}`;
    setReps((prev) => [...prev, { ...newRep, id }]);
  };

  const handleRemoveRep = (id: string) => {
    setReps((prev) => prev.filter((r) => r.id !== id));
  };

  const handleResetFineTuning = () => {
    setCustomAvgDealSize(undefined);
    setCustomConversionRate(undefined);
    setCustomOrganicShare(undefined);
    setCustomCpl(undefined);
  };

  const handleResetAll = () => {
    setTargetBillion(30);
    setPeriod('Q1');
    setPeriodLabel('فصل بعد (پیش‌فرض)');
    setBaseline(INDUSTRY_PRESETS[0]);
    setReps(DEFAULT_REPS);
    handleResetFineTuning();
  };

  const handleTriggerCelebration = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased">
      {/* Top Header */}
      <Header
        currentBaseline={baseline}
        onSelectPreset={(newPreset) => {
          setBaseline(newPreset);
          handleResetFineTuning();
        }}
        onOpenBaselineModal={() => setIsBaselineModalOpen(true)}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        onReset={handleResetAll}
      />

      {/* Main Content Dashboard */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 space-y-6">
        {/* Section 1: Target Definition and Sliders */}
        <TargetConfigPanel
          targetBillion={targetBillion}
          period={period}
          periodLabel={periodLabel}
          baseline={baseline}
          customAvgDealSize={customAvgDealSize}
          customConversionRate={customConversionRate}
          customOrganicShare={customOrganicShare}
          customCpl={customCpl}
          onTargetChange={setTargetBillion}
          onPeriodChange={(p, l) => {
            setPeriod(p);
            setPeriodLabel(l);
          }}
          onCustomAvgDealSizeChange={setCustomAvgDealSize}
          onCustomConversionRateChange={setCustomConversionRate}
          onCustomOrganicShareChange={setCustomOrganicShare}
          onCustomCplChange={setCustomCpl}
          onResetFineTuning={handleResetFineTuning}
        />

        {/* Section 2: Core KPI Answers (The 6 deliverables) */}
        <KpiSummaryCards results={simulationResults} />

        {/* Navigation Tabs for Deep Dive */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            داشبورد جامع و تحلیل هوشمند
          </button>
          <button
            onClick={() => setActiveTab('reps')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer relative ${
              activeTab === 'reps'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <span>شبیه‌ساز اثر تیم و خروج فروشندگان</span>
            {simulationResults.departedReps.length > 0 && (
              <span className="mr-2 px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px]">
                {simulationResults.departedReps.length} نفر خارج
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('funnel')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'funnel'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            قیف کامل تبدیل و ریزش پایپ‌لاین
          </button>
          <button
            onClick={() => setActiveTab('scenarios')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'scenarios'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            ماتریس حساسیت و مقایسه سناریوها
          </button>
        </div>

        {/* Dynamic Tab Views */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Advisor Insights Panel */}
            <ExecutiveAdvisorPanel results={simulationResults} />

            {/* Side-by-Side: Rep Turnover Mini & Funnel Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-6">
                <RepTurnoverSimulator
                  reps={reps}
                  results={simulationResults}
                  onToggleRepActive={handleToggleRepActive}
                  onAddRep={handleAddRep}
                  onRemoveRep={handleRemoveRep}
                />
              </div>
              <div className="lg:col-span-6">
                <FunnelVisualizer results={simulationResults} baseline={baseline} />
              </div>
            </div>

            {/* Scenarios Overview */}
            <ScenarioSensitivityPanel scenarios={scenarioComparisons} />
          </div>
        )}

        {activeTab === 'reps' && (
          <div className="space-y-6">
            <RepTurnoverSimulator
              reps={reps}
              results={simulationResults}
              onToggleRepActive={handleToggleRepActive}
              onAddRep={handleAddRep}
              onRemoveRep={handleRemoveRep}
            />
            <ExecutiveAdvisorPanel results={simulationResults} />
          </div>
        )}

        {activeTab === 'funnel' && (
          <div className="space-y-6">
            <FunnelVisualizer results={simulationResults} baseline={baseline} />
            <ExecutiveAdvisorPanel results={simulationResults} />
          </div>
        )}

        {activeTab === 'scenarios' && (
          <div className="space-y-6">
            <ScenarioSensitivityPanel scenarios={scenarioComparisons} />
            <ExecutiveAdvisorPanel results={simulationResults} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 px-4 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>
            سیستم شبیه‌ساز استراتژیک برنامه فروش | آماده استقرار روی کلادفلر (Cloudflare Pages)
          </span>
          <span className="text-slate-400">
            طراحی شده با منطق محاسباتی مستقل، بدون نیاز به API یا هوش مصنوعی ابری خارجی
          </span>
        </div>
      </footer>

      {/* Modals */}
      <BaselineConfigModal
        isOpen={isBaselineModalOpen}
        baseline={baseline}
        onClose={() => setIsBaselineModalOpen(false)}
        onSave={(updated) => setBaseline(updated)}
      />

      <ExportReportModal
        isOpen={isExportModalOpen}
        results={simulationResults}
        baseline={baseline}
        reps={reps}
        targetBillion={targetBillion}
        periodLabel={periodLabel}
        onClose={() => setIsExportModalOpen(false)}
      />
    </div>
  );
}

export default App;
