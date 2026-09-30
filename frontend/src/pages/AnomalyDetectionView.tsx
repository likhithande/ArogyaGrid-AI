import React, { useState, useEffect } from 'react';
import {
  Activity, AlertTriangle, ShieldAlert, CheckCircle2, Search,
  ArrowRight, Sparkles, Filter, Clock, Eye
} from 'lucide-react';
import { fetchAlerts } from '../services/api';
import { AnomalyItem } from '../types';

interface AnomalyDetectionViewProps {
  onOpenCopilot: () => void;
  onNavigateToView: (view: string) => void;
}

export const AnomalyDetectionView: React.FC<AnomalyDetectionViewProps> = ({
  onOpenCopilot,
  onNavigateToView
}) => {
  const [anomalies, setAnomalies] = useState<AnomalyItem[]>([]);
  const [selectedAnomaly, setSelectedAnomaly] = useState<AnomalyItem | null>(null);

  useEffect(() => {
    loadAnomalies();
  }, []);

  const loadAnomalies = async () => {
    const list = await fetchAlerts();
    setAnomalies(list);
    if (list.length > 0) setSelectedAnomaly(list[0]);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              AI Anomaly Detection & Statistical Outlier Surveillance
            </h2>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-800/80 font-mono font-semibold">
              Z-SCORE OUTLIER SCAN
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Automated telemetry detection of sudden consumption spikes, medical personnel absenteeism, and logistical choke points.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Active Anomaly Flags:</span>
          <span className="text-xs font-bold font-mono px-2 py-0.5 rounded-full bg-rose-950 text-rose-400 border border-rose-800">
            {anomalies.length} Flagged
          </span>
        </div>
      </div>

      {/* Main Grid: Anomaly List & Deep Diagnostic Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Anomaly Cards List */}
        <div className="space-y-3">
          {anomalies.map((anom) => {
            const isSelected = selectedAnomaly?.id === anom.id;
            const isCrit = anom.severity === 'CRITICAL';

            return (
              <div
                key={anom.id}
                onClick={() => setSelectedAnomaly(anom)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-lg ${
                  isSelected
                    ? 'bg-slate-850 border-cyan-500/80 shadow-cyan-950/30'
                    : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold uppercase ${
                    isCrit ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-amber-950 text-amber-300 border border-amber-800'
                  }`}>
                    {anom.deviation_multiplier}x DEVIATION
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{anom.detected_at}</span>
                </div>

                <h4 className="font-bold text-white text-sm mt-2">{anom.metric}</h4>
                <div className="text-xs text-cyan-400 mt-0.5">{anom.phc_name}</div>
                <div className="text-[11px] text-slate-400">District {anom.district_name}</div>

                <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">Baseline: {anom.normal_baseline}</span>
                  <span className="text-rose-400 font-bold">Observed: {anom.current_value}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right 2 Columns: Detailed Root-Cause Diagnostic Screen */}
        {selectedAnomaly && (
          <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-cyan-400 font-bold">
                      {selectedAnomaly.id}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 font-mono font-bold">
                      {selectedAnomaly.severity} ALERT
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mt-1">
                    {selectedAnomaly.metric}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Facility: <strong className="text-slate-200">{selectedAnomaly.phc_name}</strong> (District {selectedAnomaly.district_name})
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-3xl font-extrabold text-rose-400 font-mono">
                    {selectedAnomaly.deviation_multiplier}x
                  </div>
                  <span className="text-[10px] text-slate-400">Deviation from Baseline</span>
                </div>
              </div>

              {/* Baseline vs Current Deviation Box */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase">Normal Baseline</span>
                  <span className="text-xl font-bold font-mono text-slate-200">
                    {selectedAnomaly.normal_baseline}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">30-day moving average</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-rose-900/40">
                  <span className="text-[10px] text-rose-400 block uppercase font-bold">Current Observed Value</span>
                  <span className="text-xl font-bold font-mono text-rose-400">
                    {selectedAnomaly.current_value}
                  </span>
                  <span className="text-[10px] text-rose-300/80 block mt-0.5">Statistically anomalous</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-slate-400 block uppercase">Outlier Severity</span>
                  <span className="text-xl font-bold font-mono text-amber-400">
                    Z-Score: +4.2σ
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">p &lt; 0.0001 significance</span>
                </div>
              </div>

              {/* Hypothesized Causes */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  AI Multi-Factor Root-Cause Hypotheses:
                </span>
                <div className="space-y-2">
                  {selectedAnomaly.possible_causes.map((cause, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5"
                    >
                      <span className="w-5 h-5 rounded-full bg-slate-800 text-cyan-400 font-mono text-[11px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{cause}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Field Investigation */}
              <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-800/60 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-300">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>Mandated Investigative Protocol:</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedAnomaly.recommended_investigation}
                </p>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-slate-400">
                Logged into immutable administrative audit trail.
              </span>
              <button
                onClick={() => onNavigateToView('redistribution')}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5"
              >
                <span>Trigger Emergency Replenishment Transfer</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
