import React, { useState, useEffect } from 'react';
import {
  ShieldAlert, AlertTriangle, Activity, Bed, Package, Users,
  CheckCircle2, ArrowRight, Sparkles, MapPin, PhoneCall, FileText,
  Volume2, Siren
} from 'lucide-react';
import { fetchEmergencies, toggleEmergencyMode } from '../services/api';
import { EmergencyScenario } from '../types';

interface EmergencyCommandViewProps {
  onOpenCopilot: () => void;
  onNavigateToView: (view: string) => void;
  isEmergencyActive: boolean;
  onToggleEmergency: () => void;
}

export const EmergencyCommandView: React.FC<EmergencyCommandViewProps> = ({
  onOpenCopilot,
  onNavigateToView,
  isEmergencyActive,
  onToggleEmergency
}) => {
  const [emergencies, setEmergencies] = useState<EmergencyScenario[]>([]);
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('EMERG-FLOOD-01');

  useEffect(() => {
    loadEmergencies();
  }, []);

  const loadEmergencies = async () => {
    const list = await fetchEmergencies();
    setEmergencies(list);
  };

  const currentScenario = emergencies.find((e) => e.id === selectedScenarioId) || emergencies[0];

  const handleToggleScenario = async (id: string) => {
    await toggleEmergencyMode(id);
    setEmergencies((prev) =>
      prev.map((e) => (e.id === id ? { ...e, activated: !e.activated } : e))
    );
    if (id === currentScenario?.id) {
      onToggleEmergency();
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* High Alert Hero Header */}
      <div className={`p-6 rounded-2xl border transition-all shadow-2xl ${
        isEmergencyActive
          ? 'bg-gradient-to-r from-rose-950 via-slate-900 to-slate-900 border-rose-500 shadow-rose-950/50 animate-emergency-pulse'
          : 'bg-slate-900/90 border-slate-800'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className={`flex items-center justify-center w-12 h-12 rounded-2xl text-white shadow-xl flex-shrink-0 ${
              isEmergencyActive ? 'bg-rose-600 animate-spin' : 'bg-slate-800 text-rose-400'
            }`}>
              <ShieldAlert className="w-7 h-7" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-mono font-bold tracking-wider uppercase ${
                  isEmergencyActive ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-400'
                }`}>
                  {isEmergencyActive ? 'EMERGENCY PROTOCOL ACTIVE' : 'STANDBY MODE'}
                </span>
                <span className="text-xs text-rose-400 font-mono font-semibold">
                  TIER-3 NATIONAL COMMAND
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
                {currentScenario?.title || "Monsoon River Inundation & Flash Flood Surge"}
              </h2>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                {currentScenario?.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleToggleScenario(currentScenario?.id || 'EMERG-FLOOD-01')}
              className={`px-5 py-3 rounded-xl font-bold text-xs sm:text-sm tracking-wide transition-all shadow-xl cursor-pointer ${
                isEmergencyActive
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                  : 'bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white shadow-rose-600/40 animate-pulse'
              }`}
            >
              {isEmergencyActive ? 'DEACTIVATE EMERGENCY MODE' : 'ACTIVATE DISASTER RESPONSE PROTOCOL'}
            </button>
          </div>
        </div>
      </div>

      {/* Emergency Scenario Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {emergencies.map((sc) => (
          <button
            key={sc.id}
            onClick={() => setSelectedScenarioId(sc.id)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              selectedScenarioId === sc.id
                ? 'bg-rose-950 text-rose-300 border border-rose-700 shadow-md'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span>{sc.title}</span>
            {sc.activated && (
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-rose-900 text-rose-200 font-mono font-bold">
                ACTIVE
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Simulated Surge & Gap Metrics Grid */}
      {currentScenario && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Patient Footfall Surge
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold font-mono text-rose-400">
                +{currentScenario.patient_surge_pct}%
              </span>
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">Projected outpatient influx</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Medicine Surge
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold font-mono text-amber-400">
                +{currentScenario.medicine_requirement_surge_pct}%
              </span>
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">Antibiotics & ORS demand</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Inpatient Bed Deficit
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold font-mono text-rose-400">
                +{currentScenario.bed_requirement_delta}
              </span>
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">Field triage beds required</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Critical PHCs
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold font-mono text-white">
                {currentScenario.critical_phcs_count}
              </span>
              <span className="text-xs text-rose-400">facilities</span>
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">Inundation waterlogged</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Recommended Transfers
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold font-mono text-cyan-400">
                {currentScenario.recommended_transfers_count}
              </span>
              <span className="text-xs text-slate-400">routes</span>
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">Lateral buffer dispatches</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Response Gap
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold font-mono text-emerald-400">
                {currentScenario.estimated_response_gap_pct}%
              </span>
            </div>
            <span className="text-[10px] text-emerald-400 mt-1 block">Within safety threshold</span>
          </div>
        </div>
      )}

      {/* Action Plan & Priority Checklist */}
      {currentScenario && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-sm sm:text-base text-white">
                  Automated Emergency Response Directives & Action Checklist
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Auto-Generated by AI</span>
            </div>

            <div className="space-y-3">
              {currentScenario.priority_actions.map((act, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-cyan-500/40 transition-colors flex items-start gap-3"
                >
                  <div className="w-6 h-6 rounded-lg bg-cyan-950 text-cyan-400 font-mono font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5 border border-cyan-800/80">
                    {idx + 1}
                  </div>
                  <div className="flex-1 text-xs text-slate-200 leading-relaxed font-medium">
                    {act}
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/60 font-mono font-semibold whitespace-nowrap">
                    DIRECTIVE READY
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <span className="text-slate-400">
                Affected Districts: <strong>{currentScenario.affected_districts.join(', ')}</strong>
              </span>
              <button
                onClick={() => onNavigateToView('redistribution')}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold transition-colors cursor-pointer whitespace-nowrap"
              >
                Execute Emergency Resource Transfers →
              </button>
            </div>
          </div>

          {/* Quick SOS & Dispatch Box */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                <Siren className="w-4 h-4 text-rose-400" />
                <h4 className="font-bold text-xs uppercase tracking-wider text-rose-300">
                  Rapid Response Operations
                </h4>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-1">
                <div className="font-bold text-white">Emergency Logistics Coordinator</div>
                <div className="text-slate-400">State Disaster Management Authority (SDMA)</div>
                <div className="font-mono text-cyan-400 mt-1 font-semibold">+91 0866 2488 991</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-1">
                <div className="font-bold text-white">Armed Reserve Medical Freight</div>
                <div className="text-slate-400">Air Force Station Hakimpet (Helicopter Airlift)</div>
                <div className="font-mono text-cyan-400 mt-1 font-semibold">Radio: 121.5 MHz / SDMA Link</div>
              </div>
            </div>

            <button
              onClick={onOpenCopilot}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-xs font-semibold text-cyan-300 border border-slate-700 transition-colors flex items-center justify-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Query Copilot for Disaster Scenarios</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
