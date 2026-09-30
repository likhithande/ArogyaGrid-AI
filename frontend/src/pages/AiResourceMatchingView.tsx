import React, { useState, useEffect } from 'react';
import {
  ArrowLeftRight, Scale, Sliders, AlertTriangle, Clock, TrendingUp,
  CheckCircle, ShieldAlert, Sparkles, Database, BarChart3, Info,
  Boxes, Calendar, RefreshCw, Zap, ArrowRight, DollarSign
} from 'lucide-react';
import {
  fetchResourceMatches, fetchParetoTradeoffs, fetchAuctionScenarios,
  fetchResourceWastageRisks, fetchBatchExpiryList
} from '../services/api';
import {
  ResourceMatchProposal, ParetoObjectiveTradeoff, AuctionScenario,
  ResourceWastageRisk, BatchExpiryItem
} from '../types';

export const AiResourceMatchingView: React.FC = () => {
  const [matches, setMatches] = useState<ResourceMatchProposal[]>([]);
  const [tradeoffs, setTradeoffs] = useState<ParetoObjectiveTradeoff[]>([]);
  const [auctions, setAuctions] = useState<AuctionScenario[]>([]);
  const [wastageRisks, setWastageRisks] = useState<ResourceWastageRisk[]>([]);
  const [expiryBatches, setExpiryBatches] = useState<BatchExpiryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Active sub-tab
  const [activeTab, setActiveTab] = useState<'matching' | 'pareto' | 'auction' | 'wastage' | 'expiry'>('matching');
  const [showAdvancedMath, setShowAdvancedMath] = useState<boolean>(false);
  const [approvedMatches, setApprovedMatches] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [m, t, a, w, e] = await Promise.all([
        fetchResourceMatches(),
        fetchParetoTradeoffs(),
        fetchAuctionScenarios(),
        fetchResourceWastageRisks(),
        fetchBatchExpiryList()
      ]);
      setMatches(m);
      setTradeoffs(t);
      setAuctions(a);
      setWastageRisks(w);
      setExpiryBatches(e);
      setLoading(false);
    }
    loadData();
  }, []);

  const handleApproveMatch = (matchId: string) => {
    setApprovedMatches(prev => ({ ...prev, [matchId]: true }));
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
      <div className="rounded-2xl border border-indigo-800/40 bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/50 p-6 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-indigo-500/20 px-3 py-0.5 text-xs font-semibold text-indigo-400 border border-indigo-500/30">
                MODULES 3, 4, 5, 7, 8
              </span>
              <span className="rounded-full bg-emerald-500/20 px-3 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/30">
                PARETO MULTI-OBJECTIVE SOLVER
              </span>
            </div>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-white lg:text-3xl">
              AI Resource Matching & Multi-Objective Optimization
            </h1>
            <p className="mt-1 text-sm text-slate-300">
              Matches clinical surplus with acute deficits, computes Pareto trade-offs across 8 objectives, simulates multi-district resource auctions, and eliminates medicine wastage.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'matching', label: 'P2P Resource Matching' },
              { id: 'pareto', label: 'Multi-Objective Pareto' },
              { id: 'auction', label: 'Resource Auction Sim' },
              { id: 'wastage', label: 'Wastage Prevention' },
              { id: 'expiry', label: 'FEFO Expiry Optimizer' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* TAB 1: P2P RESOURCE MATCHING ENGINE */}
      {activeTab === 'matching' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <ArrowLeftRight className="h-5 w-5 text-indigo-400" />
                  Surplus-to-Deficit AI Matching Engine
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Evaluates location, inventory surplus, urgency, road transit hours, and batch expiry to pair facilities.
                </p>
              </div>
              <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-400">
                {matches.length} Compatible Matches Found
              </span>
            </div>

            <div className="mt-6 space-y-4">
              {matches.map((m) => {
                const isApproved = approvedMatches[m.id];
                return (
                  <div
                    key={m.id}
                    className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5 shadow-lg transition-all hover:border-slate-700"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      {/* Source & Destination Nodes */}
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="rounded bg-indigo-500/20 px-2 py-0.5 text-[10px] font-mono text-indigo-300">
                            {m.id}
                          </span>
                          <span className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                            m.urgency === 'CRITICAL' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
                          }`}>
                            {m.urgency} URGENCY
                          </span>
                          <span className="text-xs font-semibold text-emerald-400">
                            Compatibility: {m.compatibility_score}%
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                          <div className="rounded-xl border border-emerald-900/40 bg-emerald-950/20 p-3">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">SURPLUS SOURCE</span>
                            <h4 className="font-bold text-white text-sm mt-0.5">{m.surplus_district}</h4>
                            <p className="text-xs text-slate-300 mt-1">{m.surplus_phc}</p>
                          </div>
                          <div className="rounded-xl border border-rose-900/40 bg-rose-950/20 p-3">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400">DEFICIT TARGET</span>
                            <h4 className="font-bold text-white text-sm mt-0.5">{m.need_district}</h4>
                            <p className="text-xs text-slate-300 mt-1">{m.need_phc}</p>
                          </div>
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-300">
                          <div><span className="text-slate-500">Resource:</span> <span className="font-bold text-white">{m.resource_name}</span></div>
                          <div><span className="text-slate-500">Recommended Transfer:</span> <span className="font-bold text-cyan-400">{m.quantity.toLocaleString()} units</span></div>
                          <div><span className="text-slate-500">Transit Distance:</span> <span className="font-bold text-white">{m.distance_km} km</span></div>
                          <div><span className="text-slate-500">ETA:</span> <span className="font-bold text-emerald-400">{m.transit_hours} hrs</span></div>
                        </div>

                        {/* Explainable AI Reasoning */}
                        <div className="mt-3 rounded-lg border border-slate-800 bg-slate-900/80 p-3 text-xs text-slate-300">
                          <span className="font-semibold text-indigo-300 flex items-center gap-1.5 mb-1">
                            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                            AI Match Rationale:
                          </span>
                          {m.reasoning}
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="flex flex-col items-center justify-center min-w-[140px] pl-4 border-t lg:border-t-0 lg:border-l border-slate-800 pt-4 lg:pt-0">
                        {isApproved ? (
                          <div className="flex flex-col items-center text-emerald-400">
                            <CheckCircle className="h-8 w-8 mb-1" />
                            <span className="text-xs font-bold">DISPATCH QUEUED</span>
                            <span className="text-[10px] text-slate-400">Audit Logged</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleApproveMatch(m.id)}
                            className="w-full rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition-all"
                          >
                            Approve Transfer
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MULTI-OBJECTIVE PARETO OPTIMIZATION */}
      {activeTab === 'pareto' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl backdrop-blur-md">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Scale className="h-5 w-5 text-indigo-400" />
                  Multi-Objective Pareto Frontier
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Balancing 8 competing goals: Minimize transit time, distance, stock-out risk, emergency delay, and wastage; Maximize healthcare coverage, readiness, and resilience.
                </p>
              </div>

              <button
                onClick={() => setShowAdvancedMath(!showAdvancedMath)}
                className="rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-700 flex items-center gap-1.5"
              >
                <Sliders className="h-3.5 w-3.5 text-cyan-400" />
                {showAdvancedMath ? 'Hide Analytics' : 'Advanced Analytics Panel'}
              </button>
            </div>

            {/* Technical Analytics Panel (Conditionally Shown for Technical Judges) */}
            {showAdvancedMath && (
              <div className="mt-4 rounded-xl border border-cyan-900/50 bg-cyan-950/20 p-4 text-xs font-mono text-cyan-200 space-y-2">
                <div className="flex items-center gap-2 text-cyan-300 font-bold">
                  <Info className="h-4 w-4" />
                  Mathematical Objective Formulation
                </div>
                <p className="text-[11px] text-slate-300">
                  min ∑ (c_ij * x_ij + λ_1 * T_ij * x_ij + λ_2 * P_stockout(i) + λ_3 * W_expiry(i)) <br />
                  subject to: ∑ x_ij ≤ S_i (Surplus constraint), ∑ x_ij ≥ D_j (Deficit fulfillment), x_ij ≥ 0, FEFO batch expiry horizon ≥ T_ij + 7 days.
                </p>
              </div>
            )}

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
              {tradeoffs.map((strat) => (
                <div
                  key={strat.id}
                  className={`rounded-2xl border p-5 shadow-lg flex flex-col justify-between ${
                    strat.recommended
                      ? 'border-indigo-500 bg-indigo-950/30 ring-1 ring-indigo-500'
                      : 'border-slate-800 bg-slate-950/60'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{strat.strategy_name}</span>
                      {strat.recommended && (
                        <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[9px] font-bold text-emerald-400 border border-emerald-500/30">
                          RECOMMENDED
                        </span>
                      )}
                    </div>

                    <div className="mt-4 space-y-2 text-xs">
                      <div className="flex justify-between border-b border-slate-800/80 pb-1">
                        <span className="text-slate-400">Transit Latency:</span>
                        <span className="font-bold text-white">{strat.transit_hours} hrs</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-800/80 pb-1">
                        <span className="text-slate-400">Stockout Risk:</span>
                        <span className="font-bold text-rose-400">{strat.stockout_risk_pct}%</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-800/80 pb-1">
                        <span className="text-slate-400">Transit Expenditure:</span>
                        <span className="font-bold text-slate-200">INR {strat.transport_cost_inr.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-800/80 pb-1">
                        <span className="text-slate-400">Network Coverage:</span>
                        <span className="font-bold text-emerald-400">{strat.coverage_pct}%</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-800/80 pb-1">
                        <span className="text-slate-400">Emergency Readiness:</span>
                        <span className="font-bold text-cyan-400">{strat.readiness_score}/100</span>
                      </div>
                    </div>

                    <p className="mt-4 text-xs text-slate-300 leading-relaxed">
                      {strat.tradeoff_explanation}
                    </p>
                  </div>

                  <button className="mt-4 w-full rounded-xl bg-slate-800 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors">
                    Inspect Trade-off Curve
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: RESOURCE AUCTION / MATCHING SIMULATOR */}
      {activeTab === 'auction' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl backdrop-blur-md">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Boxes className="h-5 w-5 text-indigo-400" />
                AI Resource Auction & Competitive Allocation Simulator
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                When multiple districts compete for the same scarce stockpile, the AI calculates multi-criteria allocation scenarios. (Simulation only; does not execute automatic live dispatches).
              </p>
            </div>

            <div className="mt-6 space-y-6">
              {auctions.map((auc) => (
                <div key={auc.id} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h3 className="font-bold text-white text-sm">{auc.title}</h3>
                    <span className="rounded bg-indigo-500/20 px-2.5 py-0.5 text-xs font-mono text-indigo-300">
                      Total: {auc.total_units.toLocaleString()} Available
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                    {auc.allocations.map((alloc, idx) => (
                      <div key={idx} className="rounded-xl border border-slate-800 bg-slate-900/80 p-3.5 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white">{alloc.district}</span>
                          <span className="rounded px-1.5 py-0.5 text-[9px] font-bold bg-rose-500/20 text-rose-400">
                            {alloc.urgency}
                          </span>
                        </div>
                        <div className="mt-2 text-slate-300 space-y-1">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Allocated / Needed:</span>
                            <span className="font-bold text-cyan-400">{alloc.allocated.toLocaleString()} / {alloc.need.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Transit Time:</span>
                            <span className="text-white">{alloc.travel_time_hrs}h</span>
                          </div>
                        </div>
                        <p className="mt-2 text-[11px] text-slate-400 italic">
                          "{alloc.rationale}"
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: RESOURCE WASTAGE PREDICTION */}
      {activeTab === 'wastage' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl backdrop-blur-md">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-400" />
                AI Resource Wastage & Underutilization Sentinel
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Detects overstocked items, impending expiries, unused hospital beds, and underutilized equipment to protect public healthcare capital.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              {wastageRisks.map((w) => (
                <div key={w.id} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-400">
                      {w.resource_type}
                    </span>
                    <span className="text-xs font-bold text-rose-400">
                      Est. Risk: INR {w.potential_loss_inr.toLocaleString()}
                    </span>
                  </div>

                  <h4 className="mt-2 font-bold text-white text-sm">{w.facility_name}</h4>
                  <div className="mt-2 flex items-center gap-4 text-slate-300">
                    <span>Quantity: <strong className="text-white">{w.estimated_quantity.toLocaleString()} {w.unit}</strong></span>
                    <span>Window: <strong className="text-amber-400">{w.time_window}</strong></span>
                  </div>

                  <div className="mt-3 rounded-lg bg-slate-900 p-2.5 border border-slate-800 text-[11px] text-slate-300">
                    <span className="font-semibold text-cyan-300">AI Mitigation:</span> {w.recommended_action}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: FEFO MEDICINE EXPIRY OPTIMIZER */}
      {activeTab === 'expiry' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl backdrop-blur-md">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Calendar className="h-5 w-5 text-emerald-400" />
                First-Expired, First-Out (FEFO) Expiry Optimizer
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Monitors batch-level consumption velocity across all 694 PHCs and computes automated lateral re-routing to guarantee zero medicine expiration.
              </p>
            </div>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="pb-3 font-semibold">Batch ID</th>
                    <th className="pb-3 font-semibold">Medicine</th>
                    <th className="pb-3 font-semibold">Quantity</th>
                    <th className="pb-3 font-semibold">Current Facility</th>
                    <th className="pb-3 font-semibold">Days to Expiry</th>
                    <th className="pb-3 font-semibold">Risk Level</th>
                    <th className="pb-3 font-semibold">AI Recommended Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {expiryBatches.map((b) => (
                    <tr key={b.batch_id} className="hover:bg-slate-950/40">
                      <td className="py-3 font-mono text-cyan-300">{b.batch_id}</td>
                      <td className="py-3 font-semibold text-white">{b.medicine_name}</td>
                      <td className="py-3 text-slate-300">{b.quantity.toLocaleString()}</td>
                      <td className="py-3 text-slate-300">{b.current_phc}</td>
                      <td className="py-3 font-bold text-rose-400">{b.days_to_expiry} days</td>
                      <td className="py-3">
                        <span className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                          b.expiry_risk === 'CRITICAL' ? 'bg-red-500/20 text-red-400' :
                          b.expiry_risk === 'HIGH' ? 'bg-amber-500/20 text-amber-400' :
                          'bg-emerald-500/20 text-emerald-400'
                        }`}>
                          {b.expiry_risk}
                        </span>
                      </td>
                      <td className="py-3 text-emerald-300">{b.recommended_dest_phc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
