import React, { useState, useEffect } from 'react';
import {
  AlertOctagon, Search, Filter, ArrowRight, CheckCircle2,
  Package, Clock, Truck, ShieldAlert, Sparkles, RefreshCw
} from 'lucide-react';
import { fetchStockoutPredictions, fetchMedicines } from '../services/api';
import { StockoutPrediction, Medicine } from '../types';

interface StockoutPredictionViewProps {
  onNavigateToView: (view: string) => void;
  onOpenCopilot: () => void;
}

export const StockoutPredictionView: React.FC<StockoutPredictionViewProps> = ({
  onNavigateToView,
  onOpenCopilot
}) => {
  const [predictions, setPredictions] = useState<StockoutPrediction[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const p = await fetchStockoutPredictions();
    setPredictions(p);
    const m = await fetchMedicines();
    setMedicines(m);
  };

  // Build full table rows combining predictions and medicine metrics
  const tableRows = predictions.map((pred) => {
    const med = medicines.find((m) => m.id === pred.medicine_id);
    return {
      ...pred,
      unit: med?.unit || 'units',
      cost: med?.unit_cost || 10.0
    };
  });

  const filteredRows = tableRows.filter((row) => {
    const matchesSearch = row.medicine_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          row.district_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          row.phc_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRisk = riskFilter === 'ALL' || row.risk_level === riskFilter;
    const matchesCat = categoryFilter === 'ALL' || row.category === categoryFilter;
    return matchesSearch && matchesRisk && matchesCat;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase">
              MEDICINE RISK CENTER
            </h1>
            <span className="text-[10px] px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800/80 font-mono font-bold">
              CRITICAL STOCK-OUT SENTINEL
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time depletion horizons computed from consumption elasticity, supplier lead times, and safety stock thresholds.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateToView('redistribution')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/30 transition-all cursor-pointer"
          >
            <span>Lateral Redistribution Plan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* HERO RISK SPOTLIGHT CARD: CRITICAL STOCK-OUT (ORS) */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-rose-950/40 via-[#0F172A] to-slate-900 border border-rose-800/60 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-rose-900/40 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-rose-600 text-white shadow-lg shadow-rose-600/40">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
                  STOCK-OUT RISK: CRITICAL
                </span>
                <span className="text-xs text-slate-400 font-mono">PHC-042 • Machilipatnam Coastal</span>
              </div>
              <h2 className="text-2xl font-black text-white mt-1">
                Oral Rehydration Salts (ORS 20.5g Sachets)
              </h2>
            </div>
          </div>

          <div className="text-left md:text-right">
            <span className="text-[11px] text-slate-400 uppercase font-mono block">Estimated Stock-Out</span>
            <span className="text-3xl font-black text-rose-400 font-mono">2.8 DAYS</span>
            <span className="text-[10px] text-rose-300 block">Depletion expected Friday 14:30 IST</span>
          </div>
        </div>

        {/* 5 Operational Factors */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Current Stock</span>
            <span className="text-base font-bold text-white font-mono mt-0.5 block">1,240 pkts</span>
            <span className="text-[10px] text-rose-400">Below Reorder Point</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Daily Consumption</span>
            <span className="text-base font-bold text-white font-mono mt-0.5 block">440 / day</span>
            <span className="text-[10px] text-slate-400">Hist Baseline: 180</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Predicted Demand</span>
            <span className="text-base font-bold text-cyan-400 font-mono mt-0.5 block">+38% Surge</span>
            <span className="text-[10px] text-cyan-300">Monsoon Acute Cluster</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Supplier Lead Time</span>
            <span className="text-base font-bold text-amber-400 font-mono mt-0.5 block">4.0 Days</span>
            <span className="text-[10px] text-amber-300">+1.5d Transport Delay</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Safety Stock</span>
            <span className="text-base font-bold text-white font-mono mt-0.5 block">1,800 pkts</span>
            <span className="text-[10px] text-rose-400">Deficit: -560 pkts</span>
          </div>
        </div>

        {/* WHY IS THIS AT RISK? SECTION */}
        <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-900/40 text-xs">
          <div className="flex items-center gap-2 text-rose-300 font-bold mb-2">
            <Sparkles className="w-4 h-4 text-rose-400" />
            <span>WHY IS THIS AT RISK? (Explainable XAI Factor Attribution)</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-slate-300">
            <div className="p-2 rounded bg-slate-900/70 border border-slate-800">
              <span className="font-semibold text-rose-400 block">44% Outpatient Surge</span>
              <span>Monsoon flood cluster detected in Wards 4 & 5 (gastrointestinal cases).</span>
            </div>
            <div className="p-2 rounded bg-slate-900/70 border border-slate-800">
              <span className="font-semibold text-amber-400 block">32% Supply Route Failure</span>
              <span>NH-216 waterlogged; supplier truck rerouted via SH-42 (+2.2h transit).</span>
            </div>
            <div className="p-2 rounded bg-slate-900/70 border border-slate-800">
              <span className="font-semibold text-blue-400 block">24% Baseline Depletion</span>
              <span>Normal buffer consumed faster than 14-day replenishment cycle.</span>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between pt-2 border-t border-rose-900/40">
            <span className="text-[11px] text-rose-300">
              AI Recommendation: Dispatch <strong>800 units ORS</strong> from Guntur Central Depot immediately.
            </span>
            <button
              onClick={() => onNavigateToView('redistribution')}
              className="px-3 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors cursor-pointer"
            >
              Approve Lateral Transfer →
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search medicine, district, or PHC..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <select
          value={riskFilter}
          onChange={(e) => setRiskFilter(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-cyan-500 cursor-pointer"
        >
          <option value="ALL">All Risk Levels</option>
          <option value="CRITICAL">Critical Risk (&lt; 3.5 Days)</option>
          <option value="HIGH">High Risk (3.5 - 7 Days)</option>
          <option value="MEDIUM">Medium Risk (7 - 14 Days)</option>
        </select>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-cyan-500 cursor-pointer"
        >
          <option value="ALL">All Therapeutic Categories</option>
          <option value="IV Fluid">IV Fluids & Rehydration</option>
          <option value="Analgesic">Analgesic & Antipyretic</option>
          <option value="Emergency">Emergency & Critical Care</option>
          <option value="Antibiotic">Antibiotics</option>
        </select>
      </div>

      {/* Interactive Stock-out Table */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-[10px] uppercase font-mono text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Medicine / Supply</th>
                <th className="py-3 px-3">Location (PHC & District)</th>
                <th className="py-3 px-3">Current Stock</th>
                <th className="py-3 px-3">Daily Draw (Hist/Pred)</th>
                <th className="py-3 px-3">Supplier Lead Time</th>
                <th className="py-3 px-3">Reorder Point</th>
                <th className="py-3 px-3">Stock-Out Days</th>
                <th className="py-3 px-3">Risk Level</th>
                <th className="py-3 px-4">AI Recommendation & Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredRows.map((row) => {
                const isCrit = row.risk_level === 'CRITICAL';
                const isHigh = row.risk_level === 'HIGH';

                return (
                  <tr
                    key={row.id}
                    className={`hover:bg-slate-850/60 transition-colors ${
                      isCrit ? 'bg-rose-950/15' : ''
                    }`}
                  >
                    {/* Medicine Name */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white text-xs sm:text-sm">
                        {row.medicine_name}
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {row.category} • NLEM Essential
                      </span>
                    </td>

                    {/* Location */}
                    <td className="py-3.5 px-3">
                      <div className="font-medium text-slate-200">{row.phc_name}</div>
                      <span className="text-[11px] text-cyan-400">District {row.district_name}</span>
                    </td>

                    {/* Current Stock */}
                    <td className="py-3.5 px-3 font-mono font-bold text-white">
                      {row.current_stock.toLocaleString()} {row.unit}
                    </td>

                    {/* Daily Draw */}
                    <td className="py-3.5 px-3 font-mono">
                      <div>{row.avg_daily_demand} / day</div>
                      <span className="text-[10px] text-rose-400">
                        → {row.predicted_daily_demand} (Surge)
                      </span>
                    </td>

                    {/* Supplier Lead Time */}
                    <td className="py-3.5 px-3 font-mono text-slate-400">
                      {row.lead_time_days} days
                    </td>

                    {/* Reorder Point */}
                    <td className="py-3.5 px-3 font-mono text-slate-300">
                      {row.reorder_point.toLocaleString()}
                    </td>

                    {/* Stock-Out Days */}
                    <td className="py-3.5 px-3">
                      <div className={`font-mono font-extrabold text-sm ${
                        isCrit ? 'text-rose-400 animate-pulse' : isHigh ? 'text-amber-400' : 'text-emerald-400'
                      }`}>
                        {row.predicted_stockout_days} Days
                      </div>
                      <span className="text-[9px] text-slate-400 font-mono">until zero stock</span>
                    </td>

                    {/* Risk Level */}
                    <td className="py-3.5 px-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold uppercase ${
                        isCrit
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : isHigh
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      }`}>
                        {row.risk_level}
                      </span>
                    </td>

                    {/* AI Recommendation & Action */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-1.5 max-w-xs">
                        <p className="text-[11px] text-slate-300 leading-snug">
                          {row.ai_recommendation}
                        </p>
                        <button
                          onClick={() => onNavigateToView('redistribution')}
                          className="flex items-center gap-1 text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
                        >
                          <span>Execute lateral transfer</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
