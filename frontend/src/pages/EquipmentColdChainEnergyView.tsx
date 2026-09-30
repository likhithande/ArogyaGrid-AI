import React, { useState, useEffect } from 'react';
import { 
  Wrench, ThermometerSnowflake, Zap, Activity, AlertTriangle, 
  CheckCircle2, BatteryCharging, ShieldAlert, Check, RefreshCw
} from 'lucide-react';
import { fetchEquipmentTelemetry } from '../services/api';
import { MedicalEquipment, ColdChainSensor, EnergyResilienceMetric } from '../types';

export const EquipmentColdChainEnergyView: React.FC = () => {
  const [equipment, setEquipment] = useState<MedicalEquipment[]>([]);
  const [coldChain, setColdChain] = useState<ColdChainSensor[]>([]);
  const [energy, setEnergy] = useState<EnergyResilienceMetric[]>([]);
  const [activeTab, setActiveTab] = useState<'EQUIPMENT' | 'COLD_CHAIN' | 'ENERGY'>('EQUIPMENT');
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    loadTelemetry();
  }, []);

  const loadTelemetry = async () => {
    const data = await fetchEquipmentTelemetry();
    setEquipment(data.equipment);
    setColdChain(data.cold_chain);
    setEnergy(data.energy);
  };

  const handleDispatchMaintenance = (eqName: string) => {
    setFeedback(`Bio-medical engineer dispatched for priority maintenance on ${eqName}!`);
    setTimeout(() => setFeedback(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl border border-teal-500/20 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-sky-600 flex items-center justify-center shadow-lg shadow-teal-500/30 text-white animate-pulse">
            <Zap className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white tracking-tight">Infrastructure & Cold-Chain Telemetry</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                IOT SENSOR BUS
              </span>
            </div>
            <p className="text-slate-400 text-sm mt-1">
              Predictive maintenance of oxygen plants, real-time 2°C–8°C vaccine cold-chain monitoring, and emergency generator power resilience
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 bg-slate-800/80 border border-slate-700/60 rounded-xl">
          <button
            onClick={() => setActiveTab('EQUIPMENT')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'EQUIPMENT' ? 'bg-teal-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            Bio-Medical Equipment
          </button>
          <button
            onClick={() => setActiveTab('COLD_CHAIN')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'COLD_CHAIN' ? 'bg-teal-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ThermometerSnowflake className="w-3.5 h-3.5" />
            Cold-Chain (2°C–8°C)
          </button>
          <button
            onClick={() => setActiveTab('ENERGY')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'ENERGY' ? 'bg-teal-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BatteryCharging className="w-3.5 h-3.5" />
            Energy Grid & DG
          </button>
        </div>
      </div>

      {feedback && (
        <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center gap-3 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-medium">{feedback}</span>
        </div>
      )}

      {/* Tab Content */}
      {activeTab === 'EQUIPMENT' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {equipment.map(eq => (
            <div key={eq.id} className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-teal-300 border border-slate-700">
                      {eq.id} • {eq.category}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      eq.status === 'OPERATIONAL' ? 'bg-emerald-500/20 text-emerald-300' :
                      'bg-amber-500/20 text-amber-300'
                    }`}>
                      {eq.status}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white">{eq.name}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{eq.phc_name} ({eq.district_name})</p>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-500 block">HEALTH SCORE</span>
                  <strong className="text-lg font-mono text-teal-400">{eq.maintenance_health_score}/100</strong>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">DAILY USAGE</span>
                  <strong className="text-slate-200">{eq.usage_hours_daily} hrs/day</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">FAILURE PROB.</span>
                  <strong className={eq.failure_probability_pct > 10 ? "text-rose-400" : "text-emerald-400"}>
                    {eq.failure_probability_pct}%
                  </strong>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">NEXT SERVICE</span>
                  <strong className="text-amber-400">{eq.next_service_due}</strong>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs text-slate-400">Equipment Age: <strong className="text-slate-300">{eq.age_years} Years</strong></span>
                <button
                  onClick={() => handleDispatchMaintenance(eq.name)}
                  className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 shadow-md"
                >
                  <Wrench className="w-3.5 h-3.5" />
                  Dispatch Service Tech
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'COLD_CHAIN' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {coldChain.map(cc => (
            <div key={cc.id} className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-sky-300 border border-slate-700">
                      {cc.id} • {cc.storage_type}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      cc.status === 'NORMAL' ? 'bg-emerald-500/20 text-emerald-300' :
                      'bg-amber-500/20 text-amber-300'
                    }`}>
                      {cc.status}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white">{cc.facility_name}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">District: {cc.district_name}</p>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-500 block">CURRENT TEMP</span>
                  <strong className={`text-2xl font-mono ${
                    cc.current_temp_c > 7.0 ? 'text-amber-400' : 'text-emerald-400'
                  }`}>
                    {cc.current_temp_c} °C
                  </strong>
                  <div className="text-[10px] text-slate-400">Safe: {cc.min_safe_temp_c}°C – {cc.max_safe_temp_c}°C</div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">VACCINES SECURED</span>
                  <strong className="text-white font-mono text-sm">{cc.vaccine_doses_secured.toLocaleString()} Doses</strong>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block text-[10px]">BACKUP INVERTER</span>
                  <strong className={cc.backup_power_ready ? "text-emerald-400" : "text-rose-400"}>
                    {cc.backup_power_ready ? "Ready (Online)" : "Offline (Risk)"}
                  </strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'ENERGY' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {energy.map(eng => (
            <div key={eng.id} className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-teal-300 border border-slate-700">
                      {eng.id}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      eng.risk_level === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300' :
                      'bg-amber-500/20 text-amber-300'
                    }`}>
                      {eng.risk_level} ENERGY RISK
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white">{eng.facility_name}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">District: {eng.district_name}</p>
                </div>

                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  eng.grid_power_status === 'OUTAGE' ? 'bg-rose-500 text-white' :
                  'bg-amber-500/20 text-amber-300'
                }`}>
                  GRID: {eng.grid_power_status}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">DG DIESEL FUEL</span>
                  <strong className="text-amber-400">{eng.diesel_generator_hours_left} hrs</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">SOLAR STORAGE</span>
                  <strong className="text-emerald-400">{eng.solar_battery_storage_kwh} kWh</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">CRITICAL LOAD</span>
                  <strong className="text-cyan-400">{eng.critical_load_supported_hours} hrs</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
