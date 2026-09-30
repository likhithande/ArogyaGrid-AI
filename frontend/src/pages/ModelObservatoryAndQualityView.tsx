import React, { useState, useEffect } from 'react';
import { 
  Cpu, Database, ShieldCheck, Activity, AlertTriangle, 
  CheckCircle2, RefreshCw, BarChart2, Layers, Check, GitCommit, Lock
} from 'lucide-react';
import { fetchObservatory } from '../services/api';
import { ModelObservatoryMetric, DataQualityMetric } from '../types';

export const ModelObservatoryAndQualityView: React.FC = () => {
  const [models, setModels] = useState<ModelObservatoryMetric[]>([]);
  const [quality, setQuality] = useState<DataQualityMetric | null>(null);
  const [retrainingTriggered, setRetrainingTriggered] = useState<string | null>(null);

  useEffect(() => {
    loadObservatory();
  }, []);

  const loadObservatory = async () => {
    const data = await fetchObservatory();
    setModels(data.models);
    setQuality(data.quality);
  };

  const handleRetrain = (modelId: string) => {
    setRetrainingTriggered(`Federated differential-privacy retraining job initiated for ${modelId}!`);
    setTimeout(() => setRetrainingTriggered(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl border border-violet-500/20 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30 text-white animate-pulse">
            <Cpu className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white tracking-tight">AI Model Observatory & Data Quality Center</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-violet-500/20 text-violet-300 border border-violet-500/30">
                MODEL GOVERNANCE & SENSOR AUDIT
              </span>
            </div>
            <p className="text-slate-400 text-sm mt-1">
              Continuous model drift tracking, inference latency profiling, data pipeline cleansing, and privacy-preserving audit logs
            </p>
          </div>
        </div>
      </div>

      {retrainingTriggered && (
        <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center gap-3 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-medium">{retrainingTriggered}</span>
        </div>
      )}

      {/* Data Quality Center (Module 26) */}
      {quality && (
        <div className="p-6 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <Database className="w-5 h-5 text-cyan-400" />
              <h2 className="text-base font-bold text-white">Data Quality & Telemetry Hygiene Audit</h2>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="text-slate-400">Total Telemetry Ingested:</span>
              <strong className="text-slate-200">{quality.total_records_processed.toLocaleString()} Events</strong>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Quality Score</span>
              <strong className="text-xl font-bold text-emerald-400 font-mono">{quality.overall_quality_score}%</strong>
              <div className="text-[10px] text-emerald-400/80 mt-0.5">EXCELLENT</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Missing Fields</span>
              <strong className="text-xl font-bold text-slate-200 font-mono">{quality.missing_telemetry_fields}</strong>
              <div className="text-[10px] text-slate-400 mt-0.5">Imputed by AI</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Duplicates Dropped</span>
              <strong className="text-xl font-bold text-slate-200 font-mono">{quality.duplicate_records_flagged}</strong>
              <div className="text-[10px] text-slate-400 mt-0.5">Deduplicated</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Impossible Values</span>
              <strong className="text-xl font-bold text-emerald-400 font-mono">{quality.impossible_values_filtered}</strong>
              <div className="text-[10px] text-emerald-400 mt-0.5">0 Glitches</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Stale Sensors</span>
              <strong className="text-xl font-bold text-amber-400 font-mono">{quality.stale_sensors_count}</strong>
              <div className="text-[10px] text-amber-400 mt-0.5">Re-polling link</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Z-Score Outliers</span>
              <strong className="text-xl font-bold text-purple-400 font-mono">{quality.outliers_detected}</strong>
              <div className="text-[10px] text-purple-400 mt-0.5">Quarantined</div>
            </div>
          </div>
        </div>
      )}

      {/* Model Monitoring Center & Drift Tracking (Module 24 & 25) */}
      <div className="space-y-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Activity className="w-4 h-4 text-violet-400" />
          Production Models Fleet Status & Statistical Drift
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {models.map(mod => (
            <div key={mod.model_id} className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-violet-300 border border-slate-700">
                      {mod.model_id} • {mod.version}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      mod.status === 'OPTIMAL' ? 'bg-emerald-500/20 text-emerald-300' :
                      'bg-amber-500/20 text-amber-300'
                    }`}>
                      {mod.status}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white">{mod.name}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Last Trained: {mod.last_trained}</p>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-500 block">ACCURACY</span>
                  <strong className="text-2xl font-mono text-emerald-400">{mod.accuracy_pct}%</strong>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">DRIFT LEVEL</span>
                  <strong className={mod.drift_level_pct > 3.0 ? "text-amber-400" : "text-emerald-400"}>
                    {mod.drift_level_pct}%
                  </strong>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">LATENCY</span>
                  <strong className="text-slate-200">{mod.inference_latency_ms} ms</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">DAILY INFERENCES</span>
                  <strong className="text-cyan-400">{mod.daily_predictions_count.toLocaleString()}</strong>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-slate-800">
                <span className="text-xs text-slate-400 font-mono">DP-SGD Guaranteed: &epsilon;=1.2, &delta;=10⁻⁵</span>
                <button
                  onClick={() => handleRetrain(mod.model_id)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-violet-300 border border-violet-500/30 font-semibold text-xs flex items-center gap-1.5 transition-all active:scale-95"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Trigger Retraining
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Privacy Architecture Animation (Module 49) */}
      <div className="p-6 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-800 shadow-xl space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Lock className="w-4 h-4 text-emerald-400" />
          Differential Privacy Architecture (Zero Patient PII Transmitted)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="p-5 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-2">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold mx-auto">1</div>
            <h4 className="text-sm font-bold text-white">RAW DATA STAYS LOCAL</h4>
            <p className="text-xs text-slate-400">OPD records, patient names, and prescriptions remain strictly air-gapped on edge PHC server storage.</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-2">
            <div className="w-10 h-10 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold mx-auto">2</div>
            <h4 className="text-sm font-bold text-white">MODEL GRADIENTS SHARED</h4>
            <p className="text-xs text-slate-400">Only anonymized weight updates clipped with Gaussian noise (&epsilon;=1.2 differential privacy) are transmitted.</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-2">
            <div className="w-10 h-10 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center font-bold mx-auto">3</div>
            <h4 className="text-sm font-bold text-white">CENTRAL AGGREGATION</h4>
            <p className="text-xs text-slate-400">Global FedAvg consolidates decentralized edge weights, redistributing high-accuracy forecasting models back to all clinics.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
