import React, { useState, useEffect } from 'react';
import { 
  AlertOctagon, ShieldAlert, AlertTriangle, Info, Clock, 
  TrendingUp, TrendingDown, Minus, Filter, CheckCircle2, ChevronRight,
  Sparkles, Check, RefreshCw
} from 'lucide-react';
import { fetchEarlyWarnings } from '../services/api';
import { EarlyWarningItem } from '../types';

export const EarlyWarningSystemView: React.FC = () => {
  const [warnings, setWarnings] = useState<EarlyWarningItem[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<number | 'ALL'>('ALL');
  const [selectedWarning, setSelectedWarning] = useState<EarlyWarningItem | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [dismissedWarnings, setDismissedWarnings] = useState<string[]>([]);

  useEffect(() => {
    loadWarnings();
  }, []);

  const loadWarnings = async () => {
    setLoading(true);
    const data = await fetchEarlyWarnings();
    setWarnings(data);
    if (data.length > 0) setSelectedWarning(data[0]);
    setLoading(false);
  };

  const levels = [
    { level: 'ALL', label: 'All Levels', count: warnings.length, color: 'text-slate-300', bg: 'bg-slate-800' },
    { level: 5, label: 'L5: EMERGENCY', count: warnings.filter(w => w.level === 5).length, color: 'text-red-400', bg: 'bg-red-500/20' },
    { level: 4, label: 'L4: CRITICAL', count: warnings.filter(w => w.level === 4).length, color: 'text-rose-400', bg: 'bg-rose-500/20' },
    { level: 3, label: 'L3: HIGH RISK', count: warnings.filter(w => w.level === 3).length, color: 'text-amber-400', bg: 'bg-amber-500/20' },
    { level: 2, label: 'L2: WARNING', count: warnings.filter(w => w.level === 2).length, color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
    { level: 1, label: 'L1: WATCH', count: warnings.filter(w => w.level === 1).length, color: 'text-sky-400', bg: 'bg-sky-500/20' },
  ];

  const filteredWarnings = (selectedLevel === 'ALL' 
    ? warnings 
    : warnings.filter(w => w.level === selectedLevel)
  ).filter(w => !dismissedWarnings.includes(w.id));

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl border border-rose-500/20 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-600 to-amber-600 flex items-center justify-center shadow-lg shadow-rose-500/30 text-white animate-pulse">
            <AlertOctagon className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white tracking-tight">National Early Warning System</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                5-TIER ESCALATION MATRIX
              </span>
            </div>
            <p className="text-slate-400 text-sm mt-1">
              Predictive surveillance detecting stock-outs, bed saturation, and cold-chain temperature violations before operational failure
            </p>
          </div>
        </div>

        <button
          onClick={loadWarnings}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all active:scale-95 shadow-md"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-rose-400' : ''}`} />
          Refresh Threat Grid
        </button>
      </div>

      {/* 5-Level Escalation Bar */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        {levels.map(lvl => (
          <button
            key={lvl.label}
            onClick={() => setSelectedLevel(lvl.level as any)}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              selectedLevel === lvl.level
                ? 'bg-slate-800 border-rose-500 ring-1 ring-rose-500/50 shadow-lg'
                : 'bg-slate-900/60 hover:bg-slate-800/60 border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={`text-xs font-bold ${lvl.color}`}>{lvl.label}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${lvl.bg} ${lvl.color}`}>
                {lvl.count}
              </span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Surveillance items</div>
          </button>
        ))}
      </div>

      {/* Warnings Grid & Detailed Mitigation Action */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Warning Cards List */}
        <div className="lg:col-span-7 space-y-3">
          {filteredWarnings.map(w => {
            const isSelected = selectedWarning?.id === w.id;
            return (
              <div
                key={w.id}
                onClick={() => setSelectedWarning(w)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                  isSelected 
                    ? 'bg-slate-800/90 border-rose-500 shadow-xl shadow-rose-500/10 ring-1 ring-rose-500/40' 
                    : 'bg-slate-900/60 hover:bg-slate-800/60 border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        w.level === 5 ? 'bg-red-500 text-white' :
                        w.level === 4 ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                        w.level === 3 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                        w.level === 2 ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                        'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                      }`}>
                        LEVEL {w.level} • {w.level_name}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                        {w.category.replace('_', ' ')}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white mb-0.5">{w.facility_or_district}</h3>
                    <p className="text-xs text-slate-300 font-medium">{w.metric_name}</p>

                    <div className="mt-3 flex items-center gap-4 text-xs font-mono">
                      <div>
                        <span className="text-slate-500 block text-[10px]">CURRENT</span>
                        <strong className="text-rose-400">{w.current_value}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">THRESHOLD</span>
                        <strong className="text-slate-300">{w.threshold_value}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xs font-semibold text-slate-400 flex items-center justify-end gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      Horizon
                    </div>
                    <div className="text-lg font-bold text-amber-400 font-mono">+{w.horizon_hours}h</div>
                    <div className="text-[11px] text-cyan-400 mt-0.5">{w.confidence}% Conf.</div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <span>Trend:</span>
                    {w.evolution_trend === 'INCREASING' ? (
                      <span className="text-rose-400 flex items-center gap-1 font-semibold">
                        <TrendingUp className="w-3.5 h-3.5" /> Escalating
                      </span>
                    ) : w.evolution_trend === 'DECREASING' ? (
                      <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                        <TrendingDown className="w-3.5 h-3.5" /> De-escalating
                      </span>
                    ) : (
                      <span className="text-slate-400 flex items-center gap-1 font-semibold">
                        <Minus className="w-3.5 h-3.5" /> Stable
                      </span>
                    )}
                  </div>
                  <span className="text-rose-400 font-semibold flex items-center gap-1 hover:underline">
                    View Action Plan <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Incident Prediction & Suggested Mitigation */}
        <div className="lg:col-span-5">
          {selectedWarning ? (
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-6 sticky top-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Incident Mitigation Dossier</h3>
                    <p className="text-[11px] text-slate-400 font-mono">{selectedWarning.id} • Level {selectedWarning.level}</p>
                  </div>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  {selectedWarning.horizon_hours}h Pre-Incident Buffer
                </span>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold mb-1">Affected Facility</div>
                  <p className="text-sm font-bold text-white">{selectedWarning.facility_or_district}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{selectedWarning.metric_name}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-rose-400 mb-1">
                    VULNERABILITY CONVERGENCE
                  </div>
                  <p className="text-xs text-rose-200/90 leading-relaxed">
                    Metric current reading ({selectedWarning.current_value}) breaches the statutory minimum threshold ({selectedWarning.threshold_value}). Risk confidence calculated at {selectedWarning.confidence}%.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    AI SUGGESTED PRE-EMPTIVE MITIGATION
                  </div>
                  <p className="text-xs font-semibold text-white leading-relaxed">
                    {selectedWarning.mitigation_action}
                  </p>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={() => {
                    setDismissedWarnings(prev => [...prev, selectedWarning.id]);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 active:scale-95"
                >
                  <Check className="w-4 h-4" />
                  Dispatch Pre-Emptive Mitigation
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center text-slate-500 py-12 text-sm">
              Select an early warning to view mitigation roadmap.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
