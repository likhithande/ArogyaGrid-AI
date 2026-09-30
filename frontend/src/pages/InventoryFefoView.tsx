import React, { useState, useEffect } from 'react';
import {
  Boxes, Calendar, AlertTriangle, CheckCircle2, ArrowRight,
  Sparkles, RefreshCw, Package, Clock, Filter
} from 'lucide-react';
import { fetchMedicines } from '../services/api';
import { Medicine } from '../types';

interface InventoryFefoViewProps {
  onOpenCopilot: () => void;
  onNavigateToView: (view: string) => void;
}

export const InventoryFefoView: React.FC<InventoryFefoViewProps> = ({
  onOpenCopilot,
  onNavigateToView
}) => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [fefoFilter, setFefoFilter] = useState<'ALL' | 'URGENT_DISPATCH' | 'MONITOR' | 'NORMAL'>('ALL');

  useEffect(() => {
    loadMeds();
  }, []);

  const loadMeds = async () => {
    const data = await fetchMedicines();
    setMedicines(data);
  };

  const filtered = medicines.filter((m) => {
    if (fefoFilter === 'ALL') return true;
    return m.fefo_priority === fefoFilter;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Inventory Batch Intelligence & FEFO Optimization
            </h2>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/80 font-mono font-semibold">
              FIRST-EXPIRED FIRST-OUT
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Automated shelf-life surveillance ensuring expiring batches are lateral-shifted to high-consumption centers before expiry.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800 self-start sm:self-auto">
          {(['ALL', 'URGENT_DISPATCH', 'MONITOR', 'NORMAL'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFefoFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                fefoFilter === f
                  ? 'bg-cyan-600 text-white shadow-sm shadow-cyan-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {f.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* FEFO Intelligence Alert Box */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-cyan-950/70 via-slate-900 to-slate-900 border border-cyan-500/40 shadow-xl space-y-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-cyan-400" />
          <h3 className="font-bold text-sm text-white">AI FEFO Proactive Reallocation Directive:</h3>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
          Batch <strong>IN-BT-005-72</strong> of Oral Rehydration Salts (ORS) expires in 65 days. 
          Its current facility has low consumption velocity (12 units/day). 
          <strong> AI Recommendation:</strong> Transfer 800 units to Machilipatnam Coastal PHC (Velocity: 340 units/day) where it will be completely consumed within 6 days, preventing inventory wastage.
        </p>
        <button
          onClick={() => onNavigateToView('redistribution')}
          className="mt-2 text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 cursor-pointer"
        >
          <span>Open FEFO Redistribution Dispatch Order</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Batches Table */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-[10px] uppercase font-mono text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Medicine Name</th>
                <th className="py-3 px-3">Batch Number</th>
                <th className="py-3 px-3">Expiry Date</th>
                <th className="py-3 px-3">Stock On Hand</th>
                <th className="py-3 px-3">Daily Velocity</th>
                <th className="py-3 px-3">Lead Time</th>
                <th className="py-3 px-3">FEFO Directive</th>
                <th className="py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filtered.slice(0, 15).map((med) => {
                const isUrgent = med.fefo_priority === 'URGENT_DISPATCH';
                const isMonitor = med.fefo_priority === 'MONITOR';

                return (
                  <tr key={med.id} className="hover:bg-slate-850/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white">{med.name}</div>
                      <span className="text-[10px] text-slate-400 font-mono">{med.code} • {med.dosage_form}</span>
                    </td>
                    <td className="py-3.5 px-3 font-mono text-cyan-300 font-semibold">
                      {med.batch_number}
                    </td>
                    <td className="py-3.5 px-3 font-mono text-slate-300">
                      {med.expiry_date}
                    </td>
                    <td className="py-3.5 px-3 font-mono font-bold text-white">
                      {med.current_stock.toLocaleString()} {med.unit}
                    </td>
                    <td className="py-3.5 px-3 font-mono">
                      {med.daily_consumption_avg} / day
                    </td>
                    <td className="py-3.5 px-3 font-mono text-slate-400">
                      {med.supplier_lead_time_days} days
                    </td>
                    <td className="py-3.5 px-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold uppercase ${
                        isUrgent
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : isMonitor
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      }`}>
                        {med.fefo_priority.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => onNavigateToView('redistribution')}
                        className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <span>Dispatch</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
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
