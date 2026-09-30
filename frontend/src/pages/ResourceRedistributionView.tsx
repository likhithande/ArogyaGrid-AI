import React, { useState, useEffect } from 'react';
import {
  RefreshCw, Truck, CheckCircle2, Clock, MapPin, ArrowRight,
  ShieldCheck, AlertTriangle, Sparkles, Send, FileCheck, Layers
} from 'lucide-react';
import { fetchRedistributions, approveRedistribution } from '../services/api';
import { RedistributionRecommendation } from '../types';
import confetti from 'canvas-confetti';

interface ResourceRedistributionViewProps {
  onOpenCopilot: () => void;
  onNavigateToView: (view: string) => void;
}

export const ResourceRedistributionView: React.FC<ResourceRedistributionViewProps> = ({
  onOpenCopilot,
  onNavigateToView
}) => {
  const [recommendations, setRecommendations] = useState<RedistributionRecommendation[]>([]);
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'IN_TRANSIT'>('ALL');
  const [approvingId, setApprovingId] = useState<string | null>(null);

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    const data = await fetchRedistributions();
    setRecommendations(data);
  };

  const handleApprove = async (id: string) => {
    setApprovingId(id);
    await approveRedistribution(id);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    setRecommendations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'APPROVED' } : r))
    );
    setApprovingId(null);
  };

  const filteredRecs = recommendations.filter((r) => {
    if (filterStatus === 'ALL') return true;
    return r.status === filterStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Intelligent Cross-District Resource Redistribution Engine
            </h2>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/80 font-mono font-semibold">
              LINEAR PROGRAMMING SOLVER
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Automated lateral reallocation pairing surplus medical depots with imminent deficit clinics within optimal transit radii.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800 self-start md:self-auto">
          {(['ALL', 'PENDING', 'APPROVED', 'IN_TRANSIT'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                filterStatus === s
                  ? 'bg-cyan-600 text-white shadow-sm shadow-cyan-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {s.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Optimization Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Pending Recommendations
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-cyan-400">
              {recommendations.filter((r) => r.status === 'PENDING').length}
            </span>
            <span className="text-xs text-slate-400">routes awaiting sign-off</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Approved & In-Transit
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-emerald-400">
              {recommendations.filter((r) => r.status === 'APPROVED' || r.status === 'IN_TRANSIT').length}
            </span>
            <span className="text-xs text-emerald-400">dispatches active</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Average Transit Duration
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white">2.8 hrs</span>
            <span className="text-xs text-slate-400">via arterial corridors</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Stock-Outs Averted
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-emerald-400">11</span>
            <span className="text-xs text-slate-400">vulnerable facilities</span>
          </div>
        </div>
      </div>

      {/* Recommendations Cards Grid */}
      <div className="space-y-4">
        {filteredRecs.map((rec) => {
          const isUrgent = rec.urgency === 'URGENT';
          const isApproved = rec.status === 'APPROVED';
          const isInTransit = rec.status === 'IN_TRANSIT';

          return (
            <div
              key={rec.id}
              className={`p-5 rounded-2xl bg-slate-900/90 border transition-all shadow-xl ${
                isUrgent ? 'border-rose-900/60' : 'border-slate-800'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-4 border-b border-slate-800 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-mono font-bold uppercase ${
                      isUrgent
                        ? 'bg-rose-950 text-rose-300 border border-rose-800'
                        : 'bg-amber-950 text-amber-300 border border-amber-800'
                    }`}>
                      {rec.urgency} PRIORITY
                    </span>
                    <span className="text-xs font-mono text-slate-400">{rec.id}</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-xs text-slate-400">{rec.timestamp}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-extrabold text-white">
                    TRANSFER {rec.quantity.toLocaleString()} UNITS OF {rec.medicine_name}
                  </h3>
                </div>

                {/* Status Badge & Approve Button */}
                <div className="flex items-center gap-2">
                  {isApproved ? (
                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-950 text-emerald-300 border border-emerald-700 text-xs font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>APPROVED & DISPATCH LOGGED</span>
                    </div>
                  ) : isInTransit ? (
                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-950 text-blue-300 border border-blue-700 text-xs font-bold animate-pulse">
                      <Truck className="w-4 h-4 text-blue-400" />
                      <span>IN TRANSIT (CARRIER EN ROUTE)</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleApprove(rec.id)}
                      disabled={approvingId === rec.id}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/30 transition-all cursor-pointer whitespace-nowrap"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{approvingId === rec.id ? 'Approving...' : 'Approve Redistribution'}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Source vs Destination Comparison Box */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                {/* Source Node */}
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-emerald-900/40 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                      Source Facility (Surplus Depot)
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300">
                      +{rec.source_excess_days} Days Excess
                    </span>
                  </div>
                  <div className="font-bold text-white text-sm">{rec.source_phc}</div>
                  <div className="text-xs text-slate-400">District {rec.source_district}</div>
                </div>

                {/* Destination Node */}
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-rose-900/40 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">
                      Destination Facility (Shortage Zone)
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300">
                      {rec.dest_deficit_days} Days Remaining
                    </span>
                  </div>
                  <div className="font-bold text-white text-sm">{rec.dest_phc}</div>
                  <div className="text-xs text-slate-400">District {rec.dest_district}</div>
                </div>
              </div>

              {/* Transit Details & AI Rationale */}
              <div className="pt-3 border-t border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <Truck className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <span>
                    Distance: <strong>{rec.distance_km} km</strong> (~{rec.estimated_transit_hours} hrs transit)
                  </span>
                </div>

                <div className="md:col-span-2 flex items-start gap-2 text-slate-300">
                  <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-amber-300">Expected Impact: </strong>
                    <span>{rec.expected_impact}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
