import React, { useState } from 'react';
import { 
  ShieldAlert, Activity, AlertOctagon, CheckCircle2, TrendingUp, 
  Truck, Users, Bed, Package, Clock, ArrowRight, Check, X, Sparkles, MapPin
} from 'lucide-react';

export const AiWarRoomView: React.FC = () => {
  const [approvedActions, setApprovedActions] = useState<string[]>([]);
  const [activeActionId, setActiveActionId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const warRoomActions = [
    { id: 'ACT-01', step: '01', title: 'Transfer 750 units ORS from Guntur Depot', impact: 'Solves Machilipatnam deficit in 6.5h via SH-42 detour', urgency: 'CRITICAL', status: 'PENDING' },
    { id: 'ACT-02', step: '02', title: 'Activate 15 Auxiliary Reserve Beds at CHC', impact: 'Prevents acute observation bed saturation in coastal clinics', urgency: 'HIGH', status: 'PENDING' },
    { id: 'ACT-03', step: '03', title: 'Redirect Inbound Carrier Convoys via SH-42', impact: 'Bypasses waterlogged NH-216 culvert breach with +2.2h detour', urgency: 'CRITICAL', status: 'PENDING' },
    { id: 'ACT-04', step: '04', title: 'Deploy 4 Auxiliary Community Health Officers', impact: 'Restores 100% 24/7 duty coverage in river delta wards', urgency: 'HIGH', status: 'PENDING' },
    { id: 'ACT-05', step: '05', title: 'Continuous Z-Score Outpatient Anomaly Stream', impact: 'Maintains sub-second monitoring of waterborne clusters', urgency: 'MEDIUM', status: 'PENDING' },
  ];

  const handleApprove = (id: string, title: string) => {
    setApprovedActions(prev => [...prev, id]);
    setFeedback(`Action [${id}] "${title}" APPROVED by Incident Commander. Dispatched to field units.`);
    setTimeout(() => setFeedback(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Emergency Event Mode Indicator */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-red-950/80 via-slate-900 to-red-950/80 border border-red-500/40 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center shadow-lg shadow-red-500/40 text-white animate-pulse">
              <AlertOctagon className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-white tracking-tight">AI WAR ROOM COMMAND CENTER</h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-500 text-white animate-pulse">
                  LEVEL 4 EMERGENCY ACTIVE
                </span>
              </div>
              <p className="text-red-200/80 text-sm mt-0.5 font-medium">
                Monsoon Flash Flooding & Epidemic Gastroenteritis Surge — Krishna River Delta Operational Sector
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-slate-400 bg-slate-950/60 px-3 py-1.5 rounded-xl border border-slate-800">
              Live Neural Stream Active
            </span>
          </div>
        </div>
      </div>

      {feedback && (
        <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center gap-3 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-medium">{feedback}</span>
        </div>
      )}

      {/* TOP: Critical KPIs Required by User Spec */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-red-500/30">
          <span className="text-[10px] text-red-400 font-bold uppercase tracking-wider block">EMERGENCY</span>
          <strong className="text-sm font-bold text-white mt-1 block">Flood Scenario</strong>
          <span className="text-[10px] text-slate-400">Category-3 Alert</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">AFFECTED REGION</span>
          <strong className="text-lg font-bold text-amber-400 font-mono mt-0.5 block">3 Districts</strong>
          <span className="text-[10px] text-slate-400">Krishna, Guntur, Prakasam</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">PATIENT SURGE</span>
          <strong className="text-xl font-bold text-rose-400 font-mono mt-0.5 block">+42.0%</strong>
          <span className="text-[10px] text-rose-300">Monsoon Influx</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">ACUTE BED GAP</span>
          <strong className="text-xl font-bold text-amber-400 font-mono mt-0.5 block">620 Beds</strong>
          <span className="text-[10px] text-slate-400">ICU & Observation</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">MEDICINE GAP</span>
          <strong className="text-xl font-bold text-rose-400 font-mono mt-0.5 block">18,400 Units</strong>
          <span className="text-[10px] text-slate-400">ORS, IV Fluids, Antibiotics</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">CRITICAL PHCS</span>
          <strong className="text-xl font-bold text-red-400 font-mono mt-0.5 block">17 Clinics</strong>
          <span className="text-[10px] text-slate-400">&lt;2.4 Days Reserve</span>
        </div>
      </div>

      {/* CENTER LAYOUT: LEFT Event Details, CENTER Live Map, RIGHT AI Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT: Incident Dossier */}
        <div className="lg:col-span-3 bg-slate-900/80 backdrop-blur-md p-5 rounded-2xl border border-slate-800 shadow-xl space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4" />
            Incident Assessment
          </h2>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Primary Hazard</span>
              <strong className="text-white text-sm">River Flash Inundation</strong>
              <p className="text-slate-400 mt-1">Water level +1.8m above danger mark in delta floodway.</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Epidemiological Vector</span>
              <strong className="text-rose-400 text-sm">Waterborne Enteric Cluster</strong>
              <p className="text-slate-400 mt-1">4,820 outpatient cases projected over next 7 days.</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Logistics Constraint</span>
              <strong className="text-amber-400 text-sm">NH-216 Bridge Submerged</strong>
              <p className="text-slate-400 mt-1">Arterial logistics diverted to State Highway 42 (+2.2h).</p>
            </div>
          </div>
        </div>

        {/* CENTER: Live Radar Map Representation */}
        <div className="lg:col-span-5 bg-slate-950/90 rounded-2xl border border-slate-800 p-5 relative overflow-hidden shadow-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between z-10">
            <span className="text-xs font-mono text-cyan-300 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              TACTICAL FIELD RADAR
            </span>
            <span className="text-xs font-mono text-slate-400">Krishna Delta Sector</span>
          </div>

          <div className="my-8 h-64 relative flex items-center justify-center">
            {/* Visual Radar Rings */}
            <div className="absolute w-48 h-48 rounded-full border border-red-500/20 animate-ping" />
            <div className="absolute w-36 h-36 rounded-full border border-red-500/40" />
            <div className="absolute w-20 h-20 rounded-full border border-red-500/60" />

            {/* Tactical Markers */}
            <div className="absolute top-[35%] left-[25%] text-center">
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-white text-[10px] font-bold mx-auto">
                <Truck className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <span className="text-[10px] font-mono text-emerald-300 block mt-1">Guntur (+18d)</span>
            </div>

            <div className="absolute top-[45%] left-[65%] text-center">
              <div className="w-8 h-8 rounded-full bg-red-600/40 border-2 border-red-500 flex items-center justify-center text-white text-[10px] font-bold mx-auto animate-pulse">
                <MapPin className="w-4 h-4 text-red-400" />
              </div>
              <span className="text-[10px] font-mono font-bold text-red-300 block mt-1">Machilipatnam (2.4d)</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-300 flex items-center justify-between z-10">
            <span>Transfer Convoy In-Transit: <strong className="text-cyan-400">REDIST-001 (SH-42)</strong></span>
            <span className="text-emerald-400 font-mono font-bold">ETA: 4h 12m</span>
          </div>
        </div>

        {/* RIGHT: Recommended AI Actions (5 Mandatory Actions from User Spec) */}
        <div className="lg:col-span-4 bg-slate-900/80 backdrop-blur-md p-5 rounded-2xl border border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h2 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              AI Tactical Interventions
            </h2>
            <span className="text-[10px] text-slate-400 font-mono">Requires Commander Sign-off</span>
          </div>

          <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
            {warRoomActions.map((act) => {
              const isApproved = approvedActions.includes(act.id);
              return (
                <div
                  key={act.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    isApproved 
                      ? 'bg-emerald-950/20 border-emerald-500/40' 
                      : 'bg-slate-800/40 hover:bg-slate-800/80 border-slate-700/60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span className="text-cyan-400 font-mono">{act.step} &rarr;</span>
                      {act.title}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isApproved ? 'bg-emerald-500/20 text-emerald-300' :
                      act.urgency === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300' :
                      'bg-amber-500/20 text-amber-300'
                    }`}>
                      {isApproved ? 'AUTHORIZED' : act.urgency}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-300 mt-1 leading-snug">{act.impact}</p>

                  <div className="mt-3 pt-2 border-t border-slate-700/60 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">
                      Protocol: {isApproved ? <strong className="text-emerald-400">Dispatched</strong> : "Awaiting Authorization"}
                    </span>
                    <button
                      onClick={() => handleApprove(act.id, act.title)}
                      disabled={isApproved}
                      className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 transition-all active:scale-95 disabled:opacity-50"
                    >
                      <Check className="w-3.5 h-3.5" />
                      {isApproved ? "Approved" : "Authorize"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* BOTTOM: Resource Movement Timeline Bar */}
      <div className="p-5 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-800 shadow-xl space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Clock className="w-4 h-4 text-cyan-400" />
          Tactical Resource Movement & Emergency Response Timeline
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60">
            <span className="text-emerald-400 block text-[10px] font-bold">T+00:00 (IMPACT)</span>
            <span className="text-slate-200">River gauge breaches 12.4m</span>
            <div className="text-[10px] text-slate-400 mt-1">Autonomous alert issued to CMO</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60">
            <span className="text-cyan-400 block text-[10px] font-bold">T+02:15 (DISPATCH)</span>
            <span className="text-slate-200">Guntur lateral convoy rolling</span>
            <div className="text-[10px] text-slate-400 mt-1">850 units ORS, 1,200 Paracetamol</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60">
            <span className="text-amber-400 block text-[10px] font-bold">T+06:30 (ETA CORRIDOR)</span>
            <span className="text-slate-200">SH-42 arrival at Machilipatnam</span>
            <div className="text-[10px] text-slate-400 mt-1">Stock replenished to 14 days</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60">
            <span className="text-purple-400 block text-[10px] font-bold">T+24:00 (STABILIZATION)</span>
            <span className="text-slate-200">Transition to Recovery Mode</span>
            <div className="text-[10px] text-slate-400 mt-1">Auxiliary triage tents demobilized</div>
          </div>
        </div>
      </div>
    </div>
  );
};
