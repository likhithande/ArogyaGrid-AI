import React, { useState, useEffect } from 'react';
import { 
  GitBranch, HelpCircle, AlertTriangle, ArrowRight, CheckCircle2, 
  Sparkles, Sliders, ChevronRight, Check, DollarSign, Clock, Truck, ShieldCheck
} from 'lucide-react';
import { fetchRootCauseDiagnostics, fetchDecisionOptions } from '../services/api';
import { RootCauseDiagnostic, DecisionOption } from '../types';

export const CausalImpactAndRootCauseView: React.FC = () => {
  const [diagnostic, setDiagnostic] = useState<RootCauseDiagnostic | null>(null);
  const [decisionOptions, setDecisionOptions] = useState<DecisionOption[]>([]);
  const [selectedFactorIndex, setSelectedFactorIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<DecisionOption | null>(null);
  const [activeWhatIf, setActiveWhatIf] = useState<string>('safety_stock_plus_20');
  const [approvedOptionFeedback, setApprovedOptionFeedback] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const diag = await fetchRootCauseDiagnostics();
    const opts = await fetchDecisionOptions();
    setDiagnostic(diag);
    setDecisionOptions(opts);
    if (opts.length > 0) setSelectedOption(opts[0]);
  };

  const whatIfScenarios: Record<string, { label: string; outcome: string; confidence: string; change: string }> = {
    safety_stock_plus_20: {
      label: "What if safety stock buffer is raised by +20%?",
      outcome: "Eliminates stockout vulnerability; extends resilience window from 2.4 days to 7.8 days.",
      confidence: "91.4% (Range: 7.2 - 8.4 days)",
      change: "+5.4 Days Buffer"
    },
    supplier_delay_reduced: {
      label: "What if supplier delivery transit improves by 2 days?",
      outcome: "Replenishment arrives 48 hours earlier; prevents acute ORS stock depletion in coastal ward.",
      confidence: "88.0% (Range: 42 - 54 hours)",
      change: "-48h Inflow Latency"
    },
    demand_surge_50: {
      label: "What if outpatient demand increases by an additional +50%?",
      outcome: "Stockout will accelerate to 18 hours unless lateral transfer from Guntur is approved immediately.",
      confidence: "94.2% (Range: 16 - 22 hours)",
      change: "-1.6 Days Remaining"
    }
  };

  const handleApproveOption = (opt: DecisionOption) => {
    setApprovedOptionFeedback(`Decision Option [${opt.id}] authorized! Operational order issued to district dispatch.`);
    setTimeout(() => setApprovedOptionFeedback(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl border border-indigo-500/20 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 text-white animate-pulse">
            <GitBranch className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white tracking-tight">AI Root Cause & Decision Comparison Engine</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                EXPLAINABLE AI & COUNTERFACTUAL WHAT-IF
              </span>
            </div>
            <p className="text-slate-400 text-sm mt-1">
              Decompose measurable contributing factors, inspect causal chain propagation, and compare multi-scenario decision tradeoffs
            </p>
          </div>
        </div>
      </div>

      {approvedOptionFeedback && (
        <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center gap-3 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-medium">{approvedOptionFeedback}</span>
        </div>
      )}

      {diagnostic && (
        <>
          {/* Causal Chain Visualization ("Why is this happening?") - Module 20 */}
          <div className="p-6 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-indigo-400" />
                <h2 className="text-base font-bold text-white">Causal Impact Graph — "Why Is This Happening?"</h2>
              </div>
              <span className="text-xs text-slate-400 font-mono">{diagnostic.incident_id} • {diagnostic.phc_name}</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3 overflow-x-auto">
              {diagnostic.causal_chain.map((step, idx) => (
                <React.Fragment key={idx}>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-700/80 text-center min-w-[180px] shadow-md">
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block mb-1">Step 0{idx + 1}</span>
                    <p className="text-xs font-semibold text-slate-200">{step}</p>
                  </div>
                  {idx < diagnostic.causal_chain.length - 1 && (
                    <ArrowRight className="w-5 h-5 text-slate-600 shrink-0 hidden md:block" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Root Cause Factor Decomposition (Module 19) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-400" />
                Measurable Contributing Factors Decomposition
              </h3>

              <div className="space-y-3">
                {diagnostic.factors.map((fac, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedFactorIndex(idx)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      selectedFactorIndex === idx
                        ? 'bg-slate-800/90 border-indigo-500 shadow-lg'
                        : 'bg-slate-900/60 hover:bg-slate-800/60 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{fac.name}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-indigo-300 font-mono">
                          {fac.category}
                        </span>
                      </div>
                      <strong className="text-indigo-400 font-mono text-sm">{fac.contribution_pct}% Weight</strong>
                    </div>

                    <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden my-2 border border-slate-800">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                        style={{ width: `${fac.contribution_pct * 2.5}%` }}
                      />
                    </div>

                    <div className="flex justify-between items-center text-[11px] text-slate-400 pt-1">
                      <span>Observed: <strong className="text-rose-400">{fac.observed_metric}</strong></span>
                      <span>Baseline: <strong className="text-slate-300">{fac.baseline_metric}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Counterfactual Engine ("What If?") - Module 21 */}
            <div className="lg:col-span-5 bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                AI Counterfactual Engine ("What-If?")
              </h3>

              <div className="space-y-2">
                {Object.entries(whatIfScenarios).map(([key, item]) => (
                  <button
                    key={key}
                    onClick={() => setActiveWhatIf(key)}
                    className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all ${
                      activeWhatIf === key
                        ? 'bg-purple-950/40 border-purple-500 ring-1 ring-purple-500 text-white font-semibold'
                        : 'bg-slate-800/40 hover:bg-slate-800 border-slate-700 text-slate-300'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {activeWhatIf && (
                <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 space-y-2">
                  <div className="text-[10px] text-purple-400 font-bold uppercase">Simulated Projected Outcome</div>
                  <p className="text-xs text-purple-200 leading-relaxed font-sans">
                    {whatIfScenarios[activeWhatIf].outcome}
                  </p>
                  <div className="pt-2 border-t border-purple-500/20 flex justify-between items-center text-xs font-mono">
                    <span className="text-slate-400">Net Delta: <strong className="text-emerald-400">{whatIfScenarios[activeWhatIf].change}</strong></span>
                    <span className="text-cyan-400">{whatIfScenarios[activeWhatIf].confidence}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Decision Comparison Engine (Options A, B, C, D) - Module 22 */}
          <div className="bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  Decision Comparison Engine — Tradeoff Scenarios
                </h2>
                <p className="text-xs text-slate-400">Multi-criteria comparative analysis. Administrator decides final action.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {decisionOptions.map(opt => {
                const isSelected = selectedOption?.id === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => setSelectedOption(opt)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected 
                        ? 'bg-slate-800/90 border-emerald-500 shadow-xl ring-1 ring-emerald-500/40' 
                        : 'bg-slate-900/60 hover:bg-slate-800/60 border-slate-800'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-emerald-300 font-bold border border-slate-700">
                          {opt.id}
                        </span>
                        <span className="text-xs font-bold text-emerald-400 font-mono">
                          {opt.feasibility_score}% Feasible
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-white mb-2 leading-snug">{opt.label}</h4>

                      <div className="space-y-1.5 text-xs font-mono mb-3">
                        <div className="flex justify-between text-slate-400">
                          <span>Time to Impact:</span>
                          <strong className="text-slate-200">{opt.time_to_impact_hours} hrs</strong>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>Deficit Cut:</span>
                          <strong className="text-emerald-400">+{opt.shortage_reduction_pct}%</strong>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>Fiscal Cost:</span>
                          <strong className="text-white">₹{opt.financial_cost_inr.toLocaleString()}</strong>
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-400 mb-2">
                        <span className="text-slate-500 block text-[10px] uppercase font-bold">Key Pro:</span>
                        <span className="line-clamp-2 text-slate-300">{opt.pros[0]}</span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApproveOption(opt);
                      }}
                      className="mt-2 w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all active:scale-95 flex items-center justify-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Select & Authorize
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
