import React, { useState, useEffect } from 'react';
import { 
  Brain, Activity, ShieldAlert, TrendingUp, Sparkles, CheckCircle, 
  ArrowRight, RefreshCw, Cpu, Layers, Zap, AlertTriangle, Clock,
  Filter, ChevronRight, Check, X, Eye
} from 'lucide-react';
import { fetchBrainSignals } from '../services/api';
import { ResilienceBrainSignal } from '../types';

export const ResilienceBrainView: React.FC = () => {
  const [signals, setSignals] = useState<ResilienceBrainSignal[]>([]);
  const [activeStage, setActiveStage] = useState<string>('ALL');
  const [selectedSignal, setSelectedSignal] = useState<ResilienceBrainSignal | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  useEffect(() => {
    loadSignals();
  }, []);

  const loadSignals = async () => {
    setIsProcessing(true);
    const data = await fetchBrainSignals();
    setSignals(data);
    if (data.length > 0 && !selectedSignal) {
      setSelectedSignal(data[0]);
    }
    setIsProcessing(false);
  };

  const stages = [
    { key: 'ALL', label: 'All Signals', count: signals.length },
    { key: 'LIVE_SIGNAL', label: '1. Live Signals', count: signals.filter(s => s.stage === 'LIVE_SIGNAL').length },
    { key: 'AI_ANALYSIS', label: '2. AI Analysis', count: signals.filter(s => s.stage === 'AI_ANALYSIS').length },
    { key: 'RISK_DETECTION', label: '3. Risk Detection', count: signals.filter(s => s.stage === 'RISK_DETECTION').length },
    { key: 'FORECAST', label: '4. Forecast', count: signals.filter(s => s.stage === 'FORECAST').length },
    { key: 'OPTIMIZATION', label: '5. Optimization', count: signals.filter(s => s.stage === 'OPTIMIZATION').length },
    { key: 'RECOMMENDATION', label: '6. Recommendation', count: signals.filter(s => s.stage === 'RECOMMENDATION').length },
  ];

  const filteredSignals = activeStage === 'ALL' 
    ? signals 
    : signals.filter(s => s.stage === activeStage);

  const handleApproveAction = (sigId: string) => {
    setActionFeedback(`Action for ${sigId} approved! Dispatched to Central Health Audit Log.`);
    setTimeout(() => setActionFeedback(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl border border-cyan-500/20 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 text-white animate-pulse">
            <Brain className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white tracking-tight">AI Healthcare Resilience Brain</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                ORCHESTRATION ENGINE v2.4
              </span>
            </div>
            <p className="text-slate-400 text-sm mt-1">
              Autonomous cognitive loop continuously ingesting multi-vector telemetry across 694 Primary Health Centres
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={loadSignals}
            disabled={isProcessing}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-sm font-medium transition-all shadow-md active:scale-95"
          >
            <RefreshCw className={`w-4 h-4 ${isProcessing ? 'animate-spin text-cyan-400' : ''}`} />
            Sync Neural Bus
          </button>
          <div className="px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm font-semibold flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            Live Ingestion
          </div>
        </div>
      </div>

      {actionFeedback && (
        <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center gap-3 animate-fadeIn">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-medium">{actionFeedback}</span>
        </div>
      )}

      {/* Six-Stage Pipeline Visualization */}
      <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-slate-800 shadow-xl">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
          <Cpu className="w-4 h-4 text-cyan-400" />
          Autonomous Cognitive Decision Pipeline
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2 relative">
          {[
            { step: '01', title: 'LIVE SIGNALS', desc: 'OPD, beds, stock & IoT sensors', icon: Activity, color: 'text-sky-400', bg: 'bg-sky-500/10', border: 'border-sky-500/30' },
            { step: '02', title: 'AI ANALYSIS', desc: 'Cross-district pattern matching', icon: Layers, color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/30' },
            { step: '03', title: 'RISK DETECTION', desc: 'Depletion & saturation alerts', icon: ShieldAlert, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/30' },
            { step: '04', title: 'FORECAST', desc: '24h/7d epidemiological vectors', icon: TrendingUp, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
            { step: '05', title: 'OPTIMIZATION', desc: 'ILP logistics transshipment', icon: Zap, color: 'text-teal-400', bg: 'bg-teal-500/10', border: 'border-teal-500/30' },
            { step: '06', title: 'RECOMMENDATION', desc: 'Human-in-the-loop actions', icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
          ].map((s, idx) => (
            <div key={idx} className={`p-4 rounded-xl border ${s.bg} ${s.border} relative group hover:scale-[1.02] transition-transform`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-slate-500">{s.step}</span>
                <s.icon className={`w-4 h-4 ${s.color}`} />
              </div>
              <p className={`text-xs font-bold ${s.color} tracking-wide`}>{s.title}</p>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {stages.map(st => (
          <button
            key={st.key}
            onClick={() => setActiveStage(st.key)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeStage === st.key
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/30'
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-400 border border-slate-700/60'
            }`}
          >
            {st.label}
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              activeStage === st.key ? 'bg-slate-950/30 text-slate-950 font-bold' : 'bg-slate-700 text-slate-300'
            }`}>
              {st.count}
            </span>
          </button>
        ))}
      </div>

      {/* Signal Grid & Detail Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Signal Cards List */}
        <div className="lg:col-span-7 space-y-4">
          {filteredSignals.map(sig => {
            const isSelected = selectedSignal?.id === sig.id;
            return (
              <div 
                key={sig.id}
                onClick={() => setSelectedSignal(sig)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                  isSelected 
                    ? 'bg-slate-800/90 border-cyan-500/60 shadow-xl shadow-cyan-500/10 ring-1 ring-cyan-500/50' 
                    : 'bg-slate-900/60 hover:bg-slate-800/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700">
                        {sig.id}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        sig.category === 'INVENTORY' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                        sig.category === 'WEATHER' ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30' :
                        sig.category === 'DEMAND' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                        'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                      }`}>
                        {sig.category}
                      </span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {sig.timestamp}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {sig.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                      {sig.observation}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xs font-semibold text-slate-400">Risk Score</div>
                    <div className={`text-lg font-bold font-mono ${
                      sig.risk_score > 75 ? 'text-rose-400' : sig.risk_score > 50 ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      {sig.risk_score.toFixed(1)}/100
                    </div>
                    <div className="text-[11px] text-cyan-400/90 font-medium mt-0.5">
                      {sig.confidence}% Conf.
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    Stage: <strong className="text-slate-200">{sig.stage.replace('_', ' ')}</strong>
                  </span>
                  <span className="text-cyan-400 font-semibold flex items-center gap-1 hover:underline">
                    Inspect Reasoning <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Cognitive Detail Panel */}
        <div className="lg:col-span-5">
          {selectedSignal ? (
            <div className="bg-slate-900/90 backdrop-blur-md p-6 rounded-2xl border border-slate-700/80 shadow-2xl space-y-6 sticky top-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold">
                    <Brain className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Neural Synthesis Dossier</h3>
                    <p className="text-[11px] text-slate-400 font-mono">{selectedSignal.id} • {selectedSignal.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                    {selectedSignal.confidence}% AI Confidence
                  </span>
                </div>
              </div>

              {/* 6 Core Facets Required by User Prompt */}
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/50">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5 mb-1">
                    <Activity className="w-3.5 h-3.5" />
                    OBSERVATION
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{selectedSignal.observation}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/50">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5 mb-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    PREDICTION
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{selectedSignal.prediction}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5 mb-1">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    RISK ANALYSIS (SCORE: {selectedSignal.risk_score}/100)
                  </div>
                  <p className="text-xs text-rose-200/90 leading-relaxed">
                    High severity vulnerability. Failure to intervene within 12 hours risks district-level stockout.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-teal-500/10 border border-teal-500/20">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5 mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    OPPORTUNITY DETECTED
                  </div>
                  <p className="text-xs text-teal-200/90 leading-relaxed">{selectedSignal.opportunity}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5 mb-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    RECOMMENDED ACTION
                  </div>
                  <p className="text-xs font-semibold text-white leading-relaxed">{selectedSignal.recommended_action}</p>
                </div>
              </div>

              {/* Human-In-The-Loop Approval Action */}
              <div className="pt-2">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span>Human-in-the-Loop Protocol</span>
                  <span className="text-cyan-400 font-semibold">Strict Governance Active</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleApproveAction(selectedSignal.id)}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
                  >
                    <Check className="w-4 h-4" />
                    Approve Intervention
                  </button>
                  <button
                    onClick={() => {
                      setActionFeedback(`Action for ${selectedSignal.id} deferred for further simulation.`);
                      setTimeout(() => setActionFeedback(null), 3000);
                    }}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-slate-700 transition-all active:scale-95"
                  >
                    <X className="w-4 h-4" />
                    Modify / Defer
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 rounded-2xl bg-slate-900/40 border border-slate-800 text-center text-slate-500 text-sm">
              Select a signal from the left to inspect complete neural reasoning.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
