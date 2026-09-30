import React, { useState, useEffect } from 'react';
import { 
  ArrowLeftRight, Gavel, CheckCircle2, AlertCircle, Sparkles, 
  TrendingUp, Users, ShieldAlert, Check, RefreshCw, Filter
} from 'lucide-react';
import { fetchSwapMarket, approveSwapOffer } from '../services/api';
import { SwapMarketOffer } from '../types';

export const SwapMarketAndAuctionView: React.FC = () => {
  const [offers, setOffers] = useState<SwapMarketOffer[]>([]);
  const [activeTab, setActiveTab] = useState<'SWAP_MARKET' | 'AUCTION_SIMULATOR'>('SWAP_MARKET');
  const [approvedOfferId, setApprovedOfferId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Auction simulation state
  const [competingDistricts, setCompetingDistricts] = useState([
    { name: 'District Krishna', score: 94.5, urgency: 'CRITICAL', pop: '4.5M', demandPace: '+42%', travelHrs: 2.5, allocationPct: 65, units: 6500 },
    { name: 'District Guntur', score: 78.2, urgency: 'HIGH', pop: '4.9M', demandPace: '+18%', travelHrs: 4.0, allocationPct: 25, units: 2500 },
    { name: 'District Prakasam', score: 62.0, urgency: 'MEDIUM', pop: '3.4M', demandPace: '+8%', travelHrs: 6.5, allocationPct: 10, units: 1000 }
  ]);
  const [isSimulatingAuction, setIsSimulatingAuction] = useState<boolean>(false);

  useEffect(() => {
    loadOffers();
  }, []);

  const loadOffers = async () => {
    const data = await fetchSwapMarket();
    setOffers(data);
  };

  const handleApprove = async (id: string) => {
    await approveSwapOffer(id);
    setApprovedOfferId(id);
    setFeedback(`Resource exchange offer ${id} successfully authorized! Transfer convoy logged into audit ledger.`);
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleRunAuction = () => {
    setIsSimulatingAuction(true);
    setTimeout(() => {
      setIsSimulatingAuction(false);
      setFeedback("Auction simulation complete: Emergency quota allocated according to multi-parameter criticality index.");
      setTimeout(() => setFeedback(null), 3000);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl border border-amber-500/20 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30 text-white animate-pulse">
            <ArrowLeftRight className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white tracking-tight">Resource Swap Market & Emergency Allocation Engine</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                BILATERAL EXCHANGE & FAIR-SHARE AUCTION
              </span>
            </div>
            <p className="text-slate-400 text-sm mt-1">
              Cross-district peer-to-peer inventory exchange network and multi-parameter emergency triage allocation solver
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 bg-slate-800/80 border border-slate-700/60 rounded-xl">
          <button
            onClick={() => setActiveTab('SWAP_MARKET')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'SWAP_MARKET' ? 'bg-amber-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            Resource Swap Market
          </button>
          <button
            onClick={() => setActiveTab('AUCTION_SIMULATOR')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'AUCTION_SIMULATOR' ? 'bg-amber-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Gavel className="w-3.5 h-3.5" />
            Auction Simulator
          </button>
        </div>
      </div>

      {feedback && (
        <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center gap-3 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-medium">{feedback}</span>
        </div>
      )}

      {activeTab === 'SWAP_MARKET' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <ArrowLeftRight className="w-4 h-4 text-amber-400" />
              Active Bilateral District Swaps
            </h2>
            <span className="text-xs text-slate-500">Autonomous compatibility scoring based on FEFO expiry, travel distance, and mutual buffer health</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {offers.map(off => {
              const isApproved = approvedOfferId === off.id;
              return (
                <div
                  key={off.id}
                  className={`p-6 rounded-2xl border transition-all ${
                    isApproved 
                      ? 'bg-emerald-950/20 border-emerald-500/40' 
                      : 'bg-slate-900/70 border-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-amber-400 border border-slate-700">
                          {off.id}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          off.type === 'SURPLUS' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                          'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        }`}>
                          {off.type} OFFER
                        </span>
                        <span className="text-xs text-cyan-400 font-semibold flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          {off.compatibility_score}% Compatibility Match
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-white">{off.medicine_name}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">District: <strong className="text-slate-200">{off.district_name}</strong> ({off.phc_name})</p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-slate-500 block">QUANTITY</span>
                      <strong className="text-lg font-mono text-white">{off.quantity.toLocaleString()}</strong>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">{off.days_buffer} Days Buffer</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 flex items-center justify-between text-xs mb-4">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-semibold block">Matched Counterparty</span>
                      <strong className="text-amber-400">{off.matched_district} District Healthcare Depot</strong>
                    </div>
                    <span className="text-slate-400">Zero Commercial Cost (Peer Swap)</span>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                    <span className="text-xs text-slate-400">
                      Approval Workflow: <strong className={isApproved ? "text-emerald-400" : "text-amber-400"}>
                        {isApproved ? "Admin Approved" : "Pending Sign-off"}
                      </strong>
                    </span>
                    <button
                      onClick={() => handleApprove(off.id)}
                      disabled={isApproved}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95 disabled:opacity-50"
                    >
                      <Check className="w-3.5 h-3.5" />
                      {isApproved ? "Convoy Dispatched" : "Authorize Peer Transfer"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'AUCTION_SIMULATOR' && (
        <div className="bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl border border-slate-800 shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Gavel className="w-5 h-5 text-amber-400" />
                <h2 className="text-base font-bold text-white">Emergency Resource Auction Simulation Sandbox</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 uppercase">
                  SIMULATION ONLY • NOT REAL-WORLD
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Hypothetical multi-district competition for limited state emergency reserve (10,000 units IV Fluids / ORS)
              </p>
            </div>

            <button
              onClick={handleRunAuction}
              disabled={isSimulatingAuction}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all active:scale-95 shadow-md shadow-amber-500/20"
            >
              <RefreshCw className={`w-4 h-4 ${isSimulatingAuction ? 'animate-spin' : ''}`} />
              Run Auction Solver
            </button>
          </div>

          <div className="space-y-4">
            {competingDistricts.map((cd, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white">{cd.name}</h3>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        cd.urgency === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300' :
                        cd.urgency === 'HIGH' ? 'bg-amber-500/20 text-amber-300' :
                        'bg-sky-500/20 text-sky-300'
                      }`}>
                        {cd.urgency}
                      </span>
                      <span className="text-xs text-slate-400">Pop: {cd.pop}</span>
                      <span className="text-xs text-rose-400 font-mono">Surge: {cd.demandPace}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono">
                    <span className="text-slate-400">Criticality Score: <strong className="text-amber-400 text-sm">{cd.score}/100</strong></span>
                    <span className="text-slate-400">Allocated Quota: <strong className="text-emerald-400 text-sm">{cd.units.toLocaleString()} units ({cd.allocationPct}%)</strong></span>
                  </div>
                </div>

                {/* Allocation Progress Bar */}
                <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full transition-all duration-700"
                    style={{ width: `${cd.allocationPct}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Travel Time from Central Hub: <strong className="text-slate-200">{cd.travelHrs} hours</strong></span>
                  <span className="text-slate-500 italic">Optimized by Fair-Share Proportional Need Equation</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
            <span className="italic">
              * Note: Prototype simulation based on synthetic data. Real-world distribution requires District Collectorate statutory sign-off.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
