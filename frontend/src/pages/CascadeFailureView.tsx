import React, { useState, useEffect } from 'react';
import { 
  Network, AlertTriangle, ArrowDown, ShieldAlert, Cpu, RefreshCw, 
  Layers, CheckCircle, Flame, Activity, CornerDownRight, Check
} from 'lucide-react';
import { runCascadeSimulation } from '../services/api';
import { CascadeSimulationResult, CascadeNode } from '../types';

export const CascadeFailureView: React.FC = () => {
  const [scenario, setScenario] = useState<string>('Warehouse failure');
  const [result, setResult] = useState<CascadeSimulationResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedNode, setSelectedNode] = useState<CascadeNode | null>(null);
  const [containmentApplied, setContainmentApplied] = useState<boolean>(false);

  useEffect(() => {
    executeSimulation(scenario);
  }, []);

  const executeSimulation = async (scen: string) => {
    setLoading(true);
    setContainmentApplied(false);
    const data = await runCascadeSimulation(scen);
    setResult(data);
    if (data.primary_impacts.length > 0) {
      setSelectedNode(data.primary_impacts[0]);
    }
    setLoading(false);
  };

  const handleApplyContainment = () => {
    setContainmentApplied(true);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl border border-rose-500/20 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-500 to-amber-600 flex items-center justify-center shadow-lg shadow-rose-500/30 text-white animate-pulse">
            <Flame className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white tracking-tight">Cascade Failure Simulator</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                SYSTEMIC RISK ENGINE
              </span>
            </div>
            <p className="text-slate-400 text-sm mt-1">
              Multi-tiered failure propagation modeling: Primary facility failure &rarr; Secondary buffer starvation &rarr; Tertiary clinical saturation
            </p>
          </div>
        </div>

        {/* Trigger Scenario Selector */}
        <div className="flex items-center gap-3">
          <select
            value={scenario}
            onChange={(e) => {
              setScenario(e.target.value);
              executeSimulation(e.target.value);
            }}
            className="bg-slate-800 border border-slate-700 text-slate-200 text-xs font-medium rounded-xl px-4 py-2.5 focus:outline-none focus:border-rose-500 shadow-md"
          >
            <option value="Warehouse failure">Warehouse Power/Racking Failure</option>
            <option value="Highway NH-216 Bridge Inundation">Arterial Highway Inundation (NH-216)</option>
            <option value="Cold-Chain Generator Breakdown">Cold-Chain Generator Breakdown</option>
            <option value="Primary Supplier QA Batch Hold">Supplier Consignment QA Hold</option>
          </select>
          <button
            onClick={() => executeSimulation(scenario)}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-rose-500/20"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Simulate Propagation
          </button>
        </div>
      </div>

      {result && (
        <>
          {/* System Impact Metrics Strip */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
              <div className="text-xs font-semibold text-slate-400 uppercase">Trigger Event</div>
              <div className="text-base font-bold text-rose-400 mt-1 truncate">{result.trigger_event}</div>
              <div className="text-[11px] text-slate-500 mt-0.5 font-mono">{result.root_cause_facility}</div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
              <div className="text-xs font-semibold text-slate-400 uppercase">Vulnerable Facilities</div>
              <div className="text-2xl font-bold text-amber-400 mt-1 font-mono">{result.total_facilities_vulnerable} PHCs</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Across 3 downstream sub-divisions</div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
              <div className="text-xs font-semibold text-slate-400 uppercase">Population at Risk</div>
              <div className="text-2xl font-bold text-sky-400 mt-1 font-mono">{result.estimated_population_impacted.toLocaleString()}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Citizens in affected catchment</div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md flex flex-col justify-between">
              <div>
                <div className="text-xs font-semibold text-slate-400 uppercase">Containment Status</div>
                <div className={`text-base font-bold mt-1 ${containmentApplied ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {containmentApplied ? 'Active (Contained)' : 'Uncontained (Spreading)'}
                </div>
              </div>
              <button
                onClick={handleApplyContainment}
                disabled={containmentApplied}
                className="mt-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                Apply AI Containment
              </button>
            </div>
          </div>

          {/* 3-Tier Cascade Ripple Propagation Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Primary Impact Column */}
            <div className="p-5 rounded-2xl bg-slate-900/70 border border-rose-500/30 backdrop-blur-md space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-rose-500/20">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
                  <h3 className="text-sm font-bold text-rose-400 uppercase tracking-wide">Primary Impact</h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300">
                  T+0 to T+6 Hours
                </span>
              </div>
              <p className="text-xs text-slate-400">Direct operational paralysis at origin facility.</p>

              <div className="space-y-3">
                {result.primary_impacts.map(node => (
                  <div
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      selectedNode?.id === node.id 
                        ? 'bg-rose-950/40 border-rose-500 ring-1 ring-rose-500' 
                        : 'bg-slate-800/40 hover:bg-slate-800 border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-xs font-bold text-white">{node.name}</h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300">
                        {node.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 line-clamp-2">{node.impact_description}</p>
                    <div className="mt-3 pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">{node.affected_metric}:</span>
                      <strong className="text-rose-400 font-mono">{node.delay_or_deficit}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Secondary Impact Column */}
            <div className="p-5 rounded-2xl bg-slate-900/70 border border-amber-500/30 backdrop-blur-md space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-amber-500/20">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wide">Secondary Impact</h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                  T+6 to T+24 Hours
                </span>
              </div>
              <p className="text-xs text-slate-400">Stock starvation & buffer depletion across district network.</p>

              <div className="space-y-3">
                {result.secondary_impacts.map(node => (
                  <div
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      selectedNode?.id === node.id 
                        ? 'bg-amber-950/40 border-amber-500 ring-1 ring-amber-500' 
                        : 'bg-slate-800/40 hover:bg-slate-800 border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-xs font-bold text-white">{node.name}</h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                        {node.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 line-clamp-2">{node.impact_description}</p>
                    <div className="mt-3 pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">{node.affected_metric}:</span>
                      <strong className="text-amber-400 font-mono">{node.delay_or_deficit}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tertiary Impact Column */}
            <div className="p-5 rounded-2xl bg-slate-900/70 border border-purple-500/30 backdrop-blur-md space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-purple-500/20">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500" />
                  <h3 className="text-sm font-bold text-purple-400 uppercase tracking-wide">Tertiary Impact</h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                  T+24 to T+72 Hours
                </span>
              </div>
              <p className="text-xs text-slate-400">Frontline patient wait surges & bed saturation.</p>

              <div className="space-y-3">
                {result.tertiary_impacts.map(node => (
                  <div
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      selectedNode?.id === node.id 
                        ? 'bg-purple-950/40 border-purple-500 ring-1 ring-purple-500' 
                        : 'bg-slate-800/40 hover:bg-slate-800 border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-xs font-bold text-white">{node.name}</h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                        {node.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 line-clamp-2">{node.impact_description}</p>
                    <div className="mt-3 pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">{node.affected_metric}:</span>
                      <strong className="text-purple-400 font-mono">{node.delay_or_deficit}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Recommended Containment Protocol */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              AI Automated Containment Protocol
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {result.containment_actions.map((act, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 text-xs text-slate-200 flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    0{idx + 1}
                  </span>
                  <span>{act}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
