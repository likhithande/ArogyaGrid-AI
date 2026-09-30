import React, { useState } from 'react';
import { 
  FileText, Sun, Clock, CheckCircle2, AlertTriangle, 
  RotateCcw, Sparkles, TrendingUp, ArrowRight, Play, Pause, Download
} from 'lucide-react';

export const ExecutiveBriefView: React.FC = () => {
  const [timelineDay, setTimelineDay] = useState<number>(3);
  const [isPlayingReplay, setIsPlayingReplay] = useState<boolean>(false);

  const timelineSteps = [
    { day: 1, title: 'Day 1: Initial Warning', desc: 'Heavy monsoon rainfall recorded (142mm); outpatient influx accelerates +12% in coastal clinics.' },
    { day: 2, title: 'Day 2: Arterial Road Inundation', desc: 'NH-216 culvert waterlogging reported; delivery truck delayed by 24h. Stock depletes to 5.2 days.' },
    { day: 3, title: 'Day 3: Emergency Level-4 Declaration', desc: 'ORS on-hand stock reaches critical threshold (2.4 days). Lateral transfer REDIST-001 approved.' },
    { day: 4, title: 'Day 4: Detour Convoy Arrival', desc: 'Transfer convoy arrives via State Highway 42 detour. Frontline buffer restored to 14 statutory days.' },
    { day: 5, title: 'Day 5: Transition to Recovery', desc: 'Water recedes below danger mark. Auxiliary triage tents demobilized; clinics return to baseline.' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl border border-amber-500/20 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30 text-white animate-pulse">
            <Sun className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white tracking-tight">Morning Health Intelligence Briefing</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                DAILY SITUATION SYNTHESIS
              </span>
            </div>
            <p className="text-slate-400 text-sm mt-1">
              Automated executive summary synthesized by Agent 08 (Report Synthesizer) at 06:00 IST
            </p>
          </div>
        </div>

        <button
          onClick={() => alert("Situation Brief exported as JSON/PDF!")}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all active:scale-95 shadow-md"
        >
          <Download className="w-4 h-4 text-amber-400" />
          Export Briefing Pack
        </button>
      </div>

      {/* Daily Briefing Summary Strip (Module 30) */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-950/20 via-slate-900 to-slate-900 border border-amber-500/30 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-lg font-bold text-white">GOOD MORNING, ADMINISTRATOR</h2>
            <p className="text-xs text-slate-400">National Healthcare Resilience Command Center Briefing • 24-Hour Network Changes</p>
          </div>
          <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-3 py-1 rounded-lg border border-amber-500/20">
            Telemetry Delta: vs Yesterday
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60">
            <strong className="text-2xl font-bold text-white font-mono block">3</strong>
            <span className="text-xs text-amber-400 font-semibold block mt-1">Major Network Changes</span>
            <span className="text-[10px] text-slate-400">NH-216 detour active</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60">
            <strong className="text-2xl font-bold text-rose-400 font-mono block">12</strong>
            <span className="text-xs text-rose-400 font-semibold block mt-1">New System Alerts</span>
            <span className="text-[10px] text-slate-400">4 Critical, 8 Moderate</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60">
            <strong className="text-2xl font-bold text-amber-400 font-mono block">4</strong>
            <span className="text-xs text-amber-400 font-semibold block mt-1">Emerging Risks</span>
            <span className="text-[10px] text-slate-400">Coastal flood buffer risks</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60">
            <strong className="text-2xl font-bold text-emerald-400 font-mono block">7</strong>
            <span className="text-xs text-emerald-400 font-semibold block mt-1">Recommended Interventions</span>
            <span className="text-[10px] text-slate-400">5 Pre-approved</span>
          </div>
        </div>
      </div>

      {/* AI Historical Event Timeline Replay (Module 36) */}
      <div className="p-6 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white">AI Timeline Replay — "Replay Krishna Supply Disruption"</h3>
          </div>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map(d => (
              <button
                key={d}
                onClick={() => setTimelineDay(d)}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                  timelineDay === d
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                Day {d}
              </button>
            ))}
          </div>
        </div>

        <div className="p-5 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold">
              DAY 0{timelineDay} REPLAY
            </span>
            <h4 className="text-base font-bold text-white">{timelineSteps[timelineDay - 1].title}</h4>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">{timelineSteps[timelineDay - 1].desc}</p>
        </div>
      </div>
    </div>
  );
};
