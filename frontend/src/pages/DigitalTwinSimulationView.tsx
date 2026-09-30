import React, { useState, useEffect } from 'react';
import {
  Cpu, Sliders, RefreshCw, AlertTriangle, ArrowRight, CheckCircle2,
  TrendingUp, Bed, Package, Users, ShieldCheck, Sparkles, Save
} from 'lucide-react';
import { runSimulation } from '../services/api';
import { SimulationParams, SimulationResult } from '../types';

interface DigitalTwinSimulationViewProps {
  onOpenCopilot: () => void;
  onNavigateToView: (view: string) => void;
}

export const DigitalTwinSimulationView: React.FC<DigitalTwinSimulationViewProps> = ({
  onOpenCopilot,
  onNavigateToView
}) => {
  const [params, setParams] = useState<SimulationParams>({
    patient_demand_delta_pct: 40,
    supply_disruption_pct: 20,
    transport_delay_days: 2,
    staff_shortage_pct: 15
  });

  const [result, setResult] = useState<SimulationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [savedScenarios, setSavedScenarios] = useState<string[]>([]);

  useEffect(() => {
    executeSimulation();
  }, [params]);

  const executeSimulation = async () => {
    setLoading(true);
    const res = await runSimulation(params);
    setResult(res);
    setLoading(false);
  };

  const handleSaveScenario = () => {
    const name = `Surge +${params.patient_demand_delta_pct}%, Supply -${params.supply_disruption_pct}%, Delay +${params.transport_delay_days}d`;
    setSavedScenarios((prev) => [name, ...prev]);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Healthcare Digital Twin & Resilience Simulation Lab
            </h2>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/80 font-mono font-semibold">
              DYNAMIC QUEUE SIMULATOR
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Model systemic shocks across the 694 PHC network. Evaluate patient surges, supply freezes, and transport choke points before they occur.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSaveScenario}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-xs font-semibold text-slate-300 border border-slate-700 transition-colors cursor-pointer"
          >
            <Save className="w-3.5 h-3.5 text-cyan-400" />
            <span>Save Scenario</span>
          </button>
        </div>
      </div>

      {/* Interactive Simulation Sliders Console */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <h3 className="font-bold text-sm text-white">System Shock Parameters (What-If Controls)</h3>
          </div>
          <span className="text-xs font-mono text-cyan-400">
            {loading ? 'Re-calculating state graph...' : 'Simulated in Real-Time'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-1">
          {/* Slider 1: Patient Demand */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">Patient Demand Surge</span>
              <span className="font-mono font-bold text-cyan-400">
                +{params.patient_demand_delta_pct}%
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="60"
              step="5"
              value={params.patient_demand_delta_pct}
              onChange={(e) => setParams({ ...params, patient_demand_delta_pct: Number(e.target.value) })}
              className="w-full accent-cyan-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>+10%</span>
              <span>+25%</span>
              <span>+40%</span>
              <span>+60%</span>
            </div>
          </div>

          {/* Slider 2: Supply Disruption */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">Supply Disruption</span>
              <span className="font-mono font-bold text-amber-400">
                -{params.supply_disruption_pct}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="80"
              step="10"
              value={params.supply_disruption_pct}
              onChange={(e) => setParams({ ...params, supply_disruption_pct: Number(e.target.value) })}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>0%</span>
              <span>20%</span>
              <span>50%</span>
              <span>80%</span>
            </div>
          </div>

          {/* Slider 3: Transport Delay */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">Logistics Transport Delay</span>
              <span className="font-mono font-bold text-rose-400">
                +{params.transport_delay_days} Days
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="7"
              step="1"
              value={params.transport_delay_days}
              onChange={(e) => setParams({ ...params, transport_delay_days: Number(e.target.value) })}
              className="w-full accent-rose-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>0d</span>
              <span>1d</span>
              <span>3d</span>
              <span>7d</span>
            </div>
          </div>

          {/* Slider 4: Medical Staff Shortage */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">Medical Staff Shortage</span>
              <span className="font-mono font-bold text-purple-400">
                -{params.staff_shortage_pct}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="5"
              value={params.staff_shortage_pct}
              onChange={(e) => setParams({ ...params, staff_shortage_pct: Number(e.target.value) })}
              className="w-full accent-purple-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>0%</span>
              <span>15%</span>
              <span>30%</span>
              <span>50%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Before vs After Impact Comparison Grid */}
      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Baseline State (Before) */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                BASELINE NETWORK STATE (BEFORE)
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                Steady State
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Daily Outpatients</span>
                <span className="text-lg font-bold font-mono text-white">
                  {result.baseline.daily_footfall.toLocaleString()}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Bed Occupancy</span>
                <span className="text-lg font-bold font-mono text-cyan-300">
                  {result.baseline.bed_occupancy_pct}%
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Critical Stock-Outs</span>
                <span className="text-lg font-bold font-mono text-emerald-400">
                  {result.baseline.critical_stockout_items} Items
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Resilience Index</span>
                <span className="text-lg font-bold font-mono text-cyan-400">
                  {result.baseline.resilience_score} / 100
                </span>
              </div>
            </div>
          </div>

          {/* Projected State (After Shock) */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-rose-950/30 via-slate-900 to-slate-900 border border-rose-900/60 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-rose-900/40">
              <span className="text-xs font-bold text-rose-300 uppercase tracking-wider">
                PROJECTED NETWORK STATE (AFTER SHOCK)
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-950 text-rose-400 font-mono font-bold">
                SIMULATION RESULT
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Projected Footfall</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-bold font-mono text-rose-400">
                    {result.projected.daily_footfall.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-rose-400">+{result.net_changes.footfall_delta_pct}%</span>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Projected Bed Occupancy</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-bold font-mono text-rose-400">
                    {result.projected.bed_occupancy_pct}%
                  </span>
                  <span className="text-[10px] text-rose-400">+{result.additional_beds_needed} Needed</span>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Stock-Out Items</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-bold font-mono text-rose-400">
                    {result.projected.critical_stockout_items} Items
                  </span>
                  <span className="text-[10px] text-rose-400">+{result.net_changes.stockouts_increase} Deficit</span>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Projected Resilience</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-bold font-mono text-amber-400">
                    {result.projected.resilience_score} / 100
                  </span>
                  <span className="text-[10px] text-rose-400">Stressed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recommended Emergency Interventions for Simulated State */}
      {result && (
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h3 className="font-bold text-sm text-white">
              AI Pre-Emptive Counter-Measures & Redistribution Directives
            </h3>
          </div>

          <div className="space-y-2">
            {result.recommended_interventions.map((intervention, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2.5"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{intervention}</span>
              </div>
            ))}
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => onNavigateToView('redistribution')}
              className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md shadow-cyan-600/30 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>Commit Simulation into Active Redistribution Plan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
