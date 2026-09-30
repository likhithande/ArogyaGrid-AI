import React, { useState, useEffect } from 'react';
import {
  Sliders, Play, GitCompare, Leaf, Zap, BarChart3, ShieldCheck,
  TrendingDown, AlertTriangle, Layers, RefreshCw, CheckCircle2
} from 'lucide-react';
import { fetchPresetScenarios, fetchSustainabilityMetrics } from '../services/api';
import { PresetScenario, SustainabilityMetric } from '../types';

export const ScenarioLabAndPolicyView: React.FC = () => {
  const [scenarios, setScenarios] = useState<PresetScenario[]>([]);
  const [sustainability, setSustainability] = useState<SustainabilityMetric | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Tabs
  const [activeTab, setActiveTab] = useState<'catalog' | 'builder' | 'comparison' | 'policy' | 'carbon'>('catalog');

  // Scenario Builder state
  const [builderRegion, setBuilderRegion] = useState<string>('District Krishna');
  const [builderDemandSurge, setBuilderDemandSurge] = useState<number>(45);
  const [builderSupplyCut, setBuilderSupplyCut] = useState<number>(30);
  const [builderTransportDelay, setBuilderTransportDelay] = useState<number>(3);
  const [builderStaffShortage, setBuilderStaffShortage] = useState<number>(15);
  const [builderDuration, setBuilderDuration] = useState<number>(7);
  const [customSimResult, setCustomSimResult] = useState<any | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  // Policy Simulation state
  const [policySafetyStock, setPolicySafetyStock] = useState<number>(20); // 10% to 20%
  const [policyLeadTimeDelta, setPolicyLeadTimeDelta] = useState<number>(2);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [sc, su] = await Promise.all([
        fetchPresetScenarios(),
        fetchSustainabilityMetrics()
      ]);
      setScenarios(sc);
      setSustainability(su);
      setLoading(false);
    }
    loadData();
  }, []);

  const handleRunCustomScenario = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      setCustomSimResult({
        affected_phcs: Math.round(18 + (builderDemandSurge * 0.4) + (builderSupplyCut * 0.2)),
        medicine_deficit_units: Math.round(4200 * (1 + builderDemandSurge / 50.0)),
        bed_deficit: Math.round(35 * (1 + builderDemandSurge / 40.0)),
        est_stockout_days: (3.2 * (1 - builderSupplyCut / 100.0)).toFixed(1),
        recommended_action: "Execute lateral redistribution from Guntur depot and activate 40 backup triage beds."
      });
    }, 1000);
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl border border-purple-800/40 bg-gradient-to-r from-slate-900 via-slate-900 to-purple-950/50 p-6 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-purple-500/20 px-3 py-0.5 text-xs font-semibold text-purple-400 border border-purple-500/30">
                MODULES 35, 45, 46, 47, 48, 49
              </span>
              <span className="rounded-full bg-emerald-500/20 px-3 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/30">
                SCENARIO LAB ENGINE READY
              </span>
            </div>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-white lg:text-3xl">
              Crisis Scenario Library, Custom Builder & Policy Lab
            </h1>
            <p className="mt-1 text-sm text-slate-300">
              Execute 11 disaster scenarios, construct custom parameter shocks, perform side-by-side policy comparisons, and estimate healthcare resource energy/carbon footprints.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'catalog', label: '11-Scenario Library' },
              { id: 'builder', label: 'Custom Scenario Builder' },
              { id: 'comparison', label: 'Scenario Comparison Matrix' },
              { id: 'policy', label: 'Policy Impact Explorer' },
              { id: 'carbon', label: 'Carbon & Energy Footprint' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30 font-bold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* TAB 1: 11 SCENARIO LIBRARY */}
      {activeTab === 'catalog' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl backdrop-blur-md">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Layers className="h-5 w-5 text-purple-400" />
                Pre-Configured Executable Crisis Scenario Catalog
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Standardized disaster playbooks covering hydro-meteorological, epidemiological, supply chain, infrastructure, and human resource failures.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {scenarios.map((sc) => (
                <div key={sc.id} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5 text-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-cyan-300">
                        {sc.id}
                      </span>
                      <span className="rounded bg-purple-500/20 px-2 py-0.5 text-[10px] font-bold text-purple-300">
                        {sc.category}
                      </span>
                    </div>

                    <h4 className="mt-2 font-bold text-white text-sm">{sc.title}</h4>
                    <p className="mt-1 text-slate-300 text-[11px] leading-relaxed">{sc.description}</p>

                    <div className="mt-4 grid grid-cols-2 gap-2 border-t border-slate-800/80 pt-3 text-[11px]">
                      <div>
                        <span className="text-slate-400">Demand Surge:</span>
                        <p className="font-bold text-rose-400">+{sc.demand_surge_pct}%</p>
                      </div>
                      <div>
                        <span className="text-slate-400">Supply Reduction:</span>
                        <p className="font-bold text-amber-400">-{sc.supply_cut_pct}%</p>
                      </div>
                      <div>
                        <span className="text-slate-400">Transport Delay:</span>
                        <p className="font-bold text-white">+{sc.transport_delay_days} days</p>
                      </div>
                      <div>
                        <span className="text-slate-400">Staff Shortage:</span>
                        <p className="font-bold text-white">-{sc.staff_shortage_pct}%</p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setBuilderDemandSurge(sc.demand_surge_pct);
                      setBuilderSupplyCut(sc.supply_cut_pct);
                      setBuilderTransportDelay(sc.transport_delay_days);
                      setBuilderStaffShortage(sc.staff_shortage_pct);
                      setActiveTab('builder');
                    }}
                    className="mt-4 w-full rounded-xl bg-purple-600/30 border border-purple-500/40 py-2 text-xs font-bold text-purple-200 hover:bg-purple-600 hover:text-white transition-all flex items-center justify-center gap-1.5"
                  >
                    <Play className="h-3.5 w-3.5" /> Load into Simulation Lab
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CUSTOM SCENARIO BUILDER */}
      {activeTab === 'builder' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl backdrop-blur-md">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Sliders className="h-5 w-5 text-purple-400" />
                Custom Healthcare Crisis Scenario Builder
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Calibrate custom stress shocks and evaluate projected frontline impact before real-world disruptions manifest.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Controls */}
              <div className="space-y-5">
                <div>
                  <label className="text-xs font-bold text-slate-300">Target Healthcare District / Cluster</label>
                  <select
                    value={builderRegion}
                    onChange={(e) => setBuilderRegion(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
                  >
                    <option value="District Krishna">District Krishna (Coastal Delta, 15 PHCs)</option>
                    <option value="District Guntur">District Guntur (Inland Reserve Hub, 18 PHCs)</option>
                    <option value="District Prakasam">District Prakasam (Semi-Arid Corridor, 14 PHCs)</option>
                    <option value="Statewide Multi-District">Statewide Multi-District Inter-Zone (51 Districts)</option>
                  </select>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-300">
                    <span>Patient Footfall / Disease Surge (%):</span>
                    <span className="text-rose-400">+{builderDemandSurge}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={builderDemandSurge}
                    onChange={(e) => setBuilderDemandSurge(parseInt(e.target.value))}
                    className="w-full mt-2 accent-purple-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-300">
                    <span>Supply Chain Inflow Disruption (%):</span>
                    <span className="text-amber-400">-{builderSupplyCut}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="90"
                    value={builderSupplyCut}
                    onChange={(e) => setBuilderSupplyCut(parseInt(e.target.value))}
                    className="w-full mt-2 accent-purple-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-300">
                    <span>Road Transport Delay (Days):</span>
                    <span className="text-cyan-400">+{builderTransportDelay} Days</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="14"
                    value={builderTransportDelay}
                    onChange={(e) => setBuilderTransportDelay(parseInt(e.target.value))}
                    className="w-full mt-2 accent-purple-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-300">
                    <span>Frontline Staff Shortage (%):</span>
                    <span className="text-indigo-400">-{builderStaffShortage}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="60"
                    value={builderStaffShortage}
                    onChange={(e) => setBuilderStaffShortage(parseInt(e.target.value))}
                    className="w-full mt-2 accent-purple-500"
                  />
                </div>

                <button
                  onClick={handleRunCustomScenario}
                  disabled={isSimulating}
                  className="w-full rounded-xl bg-purple-600 py-3 text-xs font-bold text-white shadow-lg shadow-purple-600/30 hover:bg-purple-500 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Play className="h-4 w-4" />
                  {isSimulating ? 'Computing Systemic Shock...' : 'Execute Custom Simulation'}
                </button>
              </div>

              {/* Right Output */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
                    SIMULATION IMPACT PROJECTION
                  </span>
                  <h3 className="mt-1 text-base font-bold text-white">Projected Frontline Consequences</h3>

                  {customSimResult ? (
                    <div className="mt-6 space-y-4 text-xs">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-xl border border-slate-800 bg-slate-900 p-3.5">
                          <span className="text-slate-400">Vulnerable PHCs</span>
                          <p className="mt-1 text-2xl font-black text-rose-400">{customSimResult.affected_phcs}</p>
                          <span className="text-[10px] text-slate-400">At critical stockout risk</span>
                        </div>
                        <div className="rounded-xl border border-slate-800 bg-slate-900 p-3.5">
                          <span className="text-slate-400">Medicine Deficit</span>
                          <p className="mt-1 text-2xl font-black text-amber-400">{customSimResult.medicine_deficit_units.toLocaleString()}</p>
                          <span className="text-[10px] text-slate-400">Emergency units needed</span>
                        </div>
                        <div className="rounded-xl border border-slate-800 bg-slate-900 p-3.5">
                          <span className="text-slate-400">Bed Shortage</span>
                          <p className="mt-1 text-2xl font-black text-white">{customSimResult.bed_deficit} Beds</p>
                          <span className="text-[10px] text-slate-400">Overflow triage required</span>
                        </div>
                        <div className="rounded-xl border border-slate-800 bg-slate-900 p-3.5">
                          <span className="text-slate-400">Stockout Window</span>
                          <p className="mt-1 text-2xl font-black text-cyan-400">{customSimResult.est_stockout_days} Days</p>
                          <span className="text-[10px] text-slate-400">Until total depletion</span>
                        </div>
                      </div>

                      <div className="mt-4 rounded-xl border border-purple-900/40 bg-purple-950/20 p-3.5">
                        <span className="font-bold text-purple-300">AI Mitigation Recommendation:</span>
                        <p className="mt-1 text-slate-200 text-xs">{customSimResult.recommended_action}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-12 text-center text-slate-500 text-xs">
                      Adjust sliders on the left and click "Execute Custom Simulation" to inspect projected operational fallout.
                    </div>
                  )}
                </div>

                <span className="mt-4 text-[10px] text-slate-500 text-center block">
                  Synthetic simulation only. Bounded by Differential Privacy & ethical governance constraints.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SCENARIO COMPARISON MATRIX */}
      {activeTab === 'comparison' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl backdrop-blur-md">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <GitCompare className="h-5 w-5 text-purple-400" />
                Multi-Scenario Comparative Stress Matrix
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Compares multiple scenarios side-by-side without assigning a simplistic "best" label, allowing planners to weigh human and operational tradeoffs.
              </p>
            </div>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="pb-3 font-semibold">Crisis Scenario</th>
                    <th className="pb-3 font-semibold">Affected PHCs</th>
                    <th className="pb-3 font-semibold">Medicine Gap</th>
                    <th className="pb-3 font-semibold">Bed Deficit</th>
                    <th className="pb-3 font-semibold">Response Lead Time</th>
                    <th className="pb-3 font-semibold">Recovery Horizon</th>
                    <th className="pb-3 font-semibold">Estimated Financial Need</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {[
                    { name: "Scenario A: Tier-3 Monsoon Flood", phcs: "28 PHCs", med_gap: "5,200 Units", beds: "42 Beds", lead: "2.1 Hours", recovery: "4.7 Days", cost: "INR 1.85 Lakhs" },
                    { name: "Scenario B: Coastal Cyclone Landfall", phcs: "44 PHCs", med_gap: "8,900 Units", beds: "78 Beds", lead: "4.5 Hours", recovery: "8.2 Days", cost: "INR 4.20 Lakhs" },
                    { name: "Scenario C: Waterborne Acute Outbreak", phcs: "35 PHCs", med_gap: "11,400 Units", beds: "24 Beds", lead: "1.4 Hours", recovery: "3.5 Days", cost: "INR 2.60 Lakhs" }
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-slate-950/40">
                      <td className="py-3.5 font-bold text-white">{row.name}</td>
                      <td className="py-3.5 font-semibold text-rose-400">{row.phcs}</td>
                      <td className="py-3.5 text-slate-300">{row.med_gap}</td>
                      <td className="py-3.5 text-slate-300">{row.beds}</td>
                      <td className="py-3.5 text-cyan-300">{row.lead}</td>
                      <td className="py-3.5 text-emerald-400">{row.recovery}</td>
                      <td className="py-3.5 text-slate-300">{row.cost}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: POLICY IMPACT EXPLORER */}
      {activeTab === 'policy' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl backdrop-blur-md">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-400" />
                AI Policy Impact & Regulatory Sandbox
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Test hypothetical regulatory changes: "What happens if state mandated safety stock increases from 10% to 20%?" or "What happens if supplier SLA degrades by 2 days?"
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5 space-y-4 text-xs">
                <h3 className="font-bold text-white text-sm">Policy Parameter: Mandatory Safety Stock Buffer</h3>
                <div>
                  <div className="flex justify-between font-bold">
                    <span className="text-slate-400">Current Setting:</span>
                    <span className="text-emerald-400">{policySafetyStock}% of Monthly Consumption</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="30"
                    value={policySafetyStock}
                    onChange={(e) => setPolicySafetyStock(parseInt(e.target.value))}
                    className="w-full mt-2 accent-emerald-500"
                  />
                </div>

                <div className="mt-4 rounded-xl border border-slate-800 bg-slate-900 p-3.5 space-y-2 text-[11px]">
                  <span className="font-bold text-slate-300">Projected Systemic Impact:</span>
                  <div className="flex justify-between text-slate-300">
                    <span>Stock-Out Probability:</span>
                    <span className="font-bold text-emerald-400">{policySafetyStock >= 20 ? 'Reduced by 64%' : 'Baseline Risk'}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Inventory Holding Expenditure:</span>
                    <span className="font-bold text-amber-400">+INR {(policySafetyStock * 1.4).toFixed(1)} Lakhs Statewide</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>FEFO Expiry Risk:</span>
                    <span className="font-bold text-slate-300">{policySafetyStock > 25 ? '+4.2% (Requires faster turnover)' : 'Negligible'}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5 space-y-4 text-xs">
                <h3 className="font-bold text-white text-sm">Policy Parameter: Supplier Lead Time SLA Tolerance</h3>
                <div>
                  <div className="flex justify-between font-bold">
                    <span className="text-slate-400">Allowed Lead Time Delay:</span>
                    <span className="text-cyan-400">+{policyLeadTimeDelta} Days</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="7"
                    value={policyLeadTimeDelta}
                    onChange={(e) => setPolicyLeadTimeDelta(parseInt(e.target.value))}
                    className="w-full mt-2 accent-cyan-500"
                  />
                </div>

                <div className="mt-4 rounded-xl border border-slate-800 bg-slate-900 p-3.5 space-y-2 text-[11px]">
                  <span className="font-bold text-slate-300">Projected Operational Tradeoff:</span>
                  <div className="flex justify-between text-slate-300">
                    <span>Vulnerable Frontline Facilities:</span>
                    <span className="font-bold text-rose-400">{8 + policyLeadTimeDelta * 4} PHCs</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Required Emergency Requisitions:</span>
                    <span className="font-bold text-amber-400">{policyLeadTimeDelta * 3} Bilateral Dispatches</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: SUSTAINABILITY & ENERGY */}
      {activeTab === 'carbon' && sustainability && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl backdrop-blur-md">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Leaf className="h-5 w-5 text-emerald-400" />
                Healthcare Resource Carbon & Energy Estimation Layer
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Estimates road transport fuel expenditure, cold-chain refrigeration energy load, and warehouse electrical consumption with eco-optimized routing tradeoffs.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-xs">
                <span className="text-slate-400">Total Transit Distance</span>
                <p className="mt-1 text-2xl font-black text-white">{sustainability.transport_total_km.toLocaleString()} km</p>
                <span className="text-[10px] text-slate-400">Weekly logistics movement</span>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-xs">
                <span className="text-slate-400">Cold-Chain Energy</span>
                <p className="mt-1 text-2xl font-black text-cyan-400">{sustainability.cold_chain_kwh.toLocaleString()} kWh</p>
                <span className="text-[10px] text-slate-400">ILR & transport chillers</span>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-xs">
                <span className="text-slate-400">Estimated CO₂ Footprint</span>
                <p className="mt-1 text-2xl font-black text-amber-400">{sustainability.estimated_co2_kg.toLocaleString()} kg</p>
                <span className="text-[10px] text-slate-400">Fleet carbon generation</span>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-xs">
                <span className="text-slate-400">Eco-Routing Savings</span>
                <p className="mt-1 text-2xl font-black text-emerald-400">{sustainability.eco_routing_savings_pct}%</p>
                <span className="text-[10px] text-slate-400">Saved via ILP optimization</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
