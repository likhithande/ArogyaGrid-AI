import React, { useState, useEffect } from 'react';
import { 
  BookOpen, ShieldAlert, Activity, CheckCircle2, AlertOctagon, 
  RefreshCw, RotateCcw, Clock, ArrowRight, Check, HeartPulse, Sparkles
} from 'lucide-react';
import { fetchPlaybooks, togglePlaybookPhase } from '../services/api';
import { EmergencyPlaybook } from '../types';

export const PlaybooksAndRecoveryView: React.FC = () => {
  const [playbooks, setPlaybooks] = useState<EmergencyPlaybook[]>([]);
  const [selectedPlaybook, setSelectedPlaybook] = useState<EmergencyPlaybook | null>(null);
  const [systemMode, setSystemMode] = useState<'RESPONSE' | 'RECOVERY'>('RESPONSE');
  const [feedback, setFeedback] = useState<string | null>(null);

  // Recovery Mode Trackers (Module 17)
  const recoveryMetrics = [
    { label: 'Inventory Buffer Recovery', progress: 74, status: 'REPLENISHING', target: '14 Days Minimum Buffer' },
    { label: 'Outpatient Triage Backlog Cleared', progress: 88, status: 'STABILIZING', target: '100% Elective & OPD Restored' },
    { label: 'Clinical Staff Rest & Rotation', progress: 92, status: 'NORMAL', target: 'Rosters Normalized' },
    { label: 'Logistics Corridor Structural Clearance', progress: 82, status: 'CLEARING', target: 'NH-216 Bridge Restored' },
  ];

  useEffect(() => {
    loadPlaybooks();
  }, []);

  const loadPlaybooks = async () => {
    const data = await fetchPlaybooks();
    setPlaybooks(data);
    if (data.length > 0) setSelectedPlaybook(data[0]);
  };

  const handleToggleMode = async (newPhase: 'RESPONSE' | 'RECOVERY') => {
    setSystemMode(newPhase);
    if (selectedPlaybook) {
      await togglePlaybookPhase(selectedPlaybook.id, newPhase);
    }
    setFeedback(`System mode transitioned to ${newPhase} MODE across all sub-divisional disaster nodes.`);
    setTimeout(() => setFeedback(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner with Response/Recovery Mode Toggle */}
      <div className={`p-6 rounded-2xl border shadow-2xl relative overflow-hidden transition-all duration-500 ${
        systemMode === 'RESPONSE' 
          ? 'bg-slate-900/90 border-rose-500/30' 
          : 'bg-slate-900/90 border-teal-500/30'
      }`}>
        <div className={`absolute -right-20 -top-20 w-64 h-64 rounded-full blur-3xl pointer-events-none ${
          systemMode === 'RESPONSE' ? 'bg-rose-500/10' : 'bg-teal-500/10'
        }`} />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg text-white animate-pulse ${
              systemMode === 'RESPONSE' 
                ? 'bg-gradient-to-br from-rose-500 to-amber-600 shadow-rose-500/30' 
                : 'bg-gradient-to-br from-teal-500 to-emerald-600 shadow-teal-500/30'
            }`}>
              {systemMode === 'RESPONSE' ? <AlertOctagon className="w-8 h-8" /> : <HeartPulse className="w-8 h-8" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-white tracking-tight">Emergency Playbooks & System Recovery</h1>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  systemMode === 'RESPONSE' 
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
                    : 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                }`}>
                  {systemMode} MODE ACTIVE
                </span>
              </div>
              <p className="text-slate-400 text-sm mt-1">
                Standardized disaster operational playbooks (Flood, Cyclone, Outbreak, Heatwave) with structured transition to post-event stabilization
              </p>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-950/80 border border-slate-800">
            <button
              onClick={() => handleToggleMode('RESPONSE')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                systemMode === 'RESPONSE'
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              RESPONSE MODE
            </button>
            <button
              onClick={() => handleToggleMode('RECOVERY')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                systemMode === 'RECOVERY'
                  ? 'bg-teal-600 text-white shadow-lg shadow-teal-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              RECOVERY MODE
            </button>
          </div>
        </div>
      </div>

      {feedback && (
        <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center gap-3 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-medium">{feedback}</span>
        </div>
      )}

      {/* Recovery Phase Dashboard (Module 17) */}
      {systemMode === 'RECOVERY' && (
        <div className="p-6 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-teal-500/30 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-teal-400" />
              Post-Crisis Health System Stabilization Indicators
            </h2>
            <span className="text-xs text-teal-300 font-mono">Target: 100% Normalcy Across Delta Sub-division</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {recoveryMetrics.map((rm, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300 font-semibold">{rm.label}</span>
                  <span className="text-teal-400 font-mono font-bold">{rm.progress}%</span>
                </div>
                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div 
                    className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full"
                    style={{ width: `${rm.progress}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1">
                  <span>{rm.status}</span>
                  <span>{rm.target}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Playbooks Grid & Detailed Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Playbook List */}
        <div className="lg:col-span-4 space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-rose-400" />
            Standard Operating Playbooks (SOP)
          </h2>

          {playbooks.map(pb => {
            const isSelected = selectedPlaybook?.id === pb.id;
            return (
              <div
                key={pb.id}
                onClick={() => setSelectedPlaybook(pb)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-800/90 border-rose-500 shadow-xl ring-1 ring-rose-500/40'
                    : 'bg-slate-900/60 hover:bg-slate-800/60 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-rose-300 border border-slate-700">
                    {pb.disaster_type}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    pb.active_phase === 'RESPONSE' ? 'bg-rose-500/20 text-rose-300' :
                    'bg-slate-800 text-slate-400'
                  }`}>
                    {pb.active_phase}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white mb-1">{pb.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-2">{pb.trigger_criteria}</p>
              </div>
            );
          })}
        </div>

        {/* Selected Playbook Execution Plan */}
        <div className="lg:col-span-8 bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl border border-slate-800 shadow-xl space-y-6">
          {selectedPlaybook ? (
            <>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-rose-400 border border-slate-700">
                    {selectedPlaybook.id} • {selectedPlaybook.disaster_type} PROTOCOL
                  </span>
                  <h2 className="text-lg font-bold text-white mt-1">{selectedPlaybook.title}</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Trigger Condition: <strong className="text-rose-400">{selectedPlaybook.trigger_criteria}</strong></p>
                </div>

                <button
                  onClick={() => {
                    setFeedback(`Immediate actions for ${selectedPlaybook.id} broadcast to district quick-response health teams!`);
                    setTimeout(() => setFeedback(null), 4000);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-all shadow-lg shadow-rose-500/20 active:scale-95 flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Execute Checklist
                </button>
              </div>

              {/* Immediate Actions Checklist */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  Immediate Statutory Actions (T+0 to T+4 Hours)
                </h3>
                <div className="space-y-2">
                  {selectedPlaybook.immediate_actions.map((act, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 text-xs text-slate-200 flex items-start gap-3">
                      <span className="w-5 h-5 rounded-md bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{act}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resource Requirements & Priority Facilities */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Pre-Positioned Resource Quota</h4>
                  <div className="space-y-1.5 text-xs">
                    {Object.entries(selectedPlaybook.resource_requirements).map(([res, qty], idx) => (
                      <div key={idx} className="flex justify-between py-1 border-b border-slate-700/40 font-mono">
                        <span className="text-slate-300">{res}</span>
                        <strong className="text-cyan-400">{qty}</strong>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Priority Facilities on Alert</h4>
                  <div className="space-y-2 text-xs">
                    {selectedPlaybook.priority_phcs.map((phc, idx) => (
                      <div key={idx} className="p-2 rounded-lg bg-slate-900/60 text-slate-300 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-rose-400" />
                        <span>{phc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recovery Milestones */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-teal-400" />
                  Post-Crisis Recovery Milestones
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {selectedPlaybook.recovery_milestones.map((ms, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-teal-500/10 border border-teal-500/20 text-xs text-teal-200 flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                      <span>{ms}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};
