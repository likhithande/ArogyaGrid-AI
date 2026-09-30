import React, { useState, useEffect } from 'react';
import { 
  Globe2, Play, Pause, FastForward, RotateCcw, ShieldAlert, 
  MapPin, Activity, Truck, AlertTriangle, Layers, Maximize2
} from 'lucide-react';
import { fetchDistricts, fetchPHCs } from '../services/api';
import { District, PHC } from '../types';

export const NationalResilienceMapView: React.FC = () => {
  const [timeHorizon, setTimeHorizon] = useState<'NOW' | '+24H' | '+72H' | '+7D'>('NOW');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [districts, setDistricts] = useState<District[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);

  useEffect(() => {
    loadMapData();
  }, []);

  const loadMapData = async () => {
    const distData = await fetchDistricts();
    setDistricts(distData);
    if (distData.length > 0) setSelectedDistrict(distData[0]);
  };

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setTimeHorizon(prev => {
          if (prev === 'NOW') return '+24H';
          if (prev === '+24H') return '+72H';
          if (prev === '+72H') return '+7D';
          return 'NOW';
        });
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Adjust risk dynamically based on time horizon
  const getHorizonMetrics = (baseRisk: string) => {
    if (timeHorizon === 'NOW') {
      return { status: baseRisk, label: 'Current Telemetry Baseline', riskScore: 82.4 };
    } else if (timeHorizon === '+24H') {
      return { status: baseRisk === 'LOW' ? 'MEDIUM' : 'CRITICAL', label: '+24h Influx Projection', riskScore: 78.0 };
    } else if (timeHorizon === '+72H') {
      return { status: 'HIGH', label: '+72h Monsoon Depletion Convergence', riskScore: 71.5 };
    } else {
      return { status: 'CRITICAL', label: '+7d Outbreak Peak Envelope', riskScore: 64.0 };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 backdrop-blur-md p-6 rounded-2xl border border-cyan-500/20 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 text-white animate-pulse">
            <Globe2 className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white tracking-tight">National Resilience Visual Centerpiece Map</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                TEMPORAL 4D RADAR
              </span>
            </div>
            <p className="text-slate-400 text-sm mt-1">
              Dynamic multi-horizon simulation of healthcare infrastructure, stock depletion fronts, and emergency supply corridors
            </p>
          </div>
        </div>

        {/* Time Progression Timeline Slider */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`p-2.5 rounded-xl font-semibold text-xs flex items-center gap-2 transition-all shadow-md active:scale-95 ${
              isPlaying 
                ? 'bg-amber-500 text-slate-950' 
                : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950'
            }`}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isPlaying ? 'Pause Auto-Play' : 'Auto-Play Timeline'}
          </button>

          <div className="flex items-center p-1 bg-slate-800 border border-slate-700 rounded-xl">
            {(['NOW', '+24H', '+72H', '+7D'] as const).map(th => (
              <button
                key={th}
                onClick={() => {
                  setTimeHorizon(th);
                  setIsPlaying(false);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  timeHorizon === th
                    ? 'bg-cyan-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {th}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Map Canvas Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive India Geospatial Visualization Canvas */}
        <div className="lg:col-span-8 bg-slate-950/90 rounded-2xl border border-slate-800 p-6 relative overflow-hidden shadow-2xl min-h-[500px] flex flex-col justify-between">
          <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]" />

          {/* Map Overlay Header */}
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 text-xs font-mono text-cyan-300">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              TIMELINE: <strong className="text-white">{timeHorizon}</strong> ({getHorizonMetrics('LOW').label})
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-700">
              <span>National Resilience Index:</span>
              <strong className="text-emerald-400">{getHorizonMetrics('LOW').riskScore.toFixed(1)}/100</strong>
            </div>
          </div>

          {/* Synthetic Map Node Hubs */}
          <div className="relative my-8 h-96 flex items-center justify-center">
            {/* Visual Corridor Paths */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-cyan-500/30 stroke-dashed">
              <line x1="28%" y1="42%" x2="52%" y2="58%" strokeWidth="2" strokeDasharray="4" className="animate-pulse" />
              <line x1="52%" y1="58%" x2="72%" y2="72%" strokeWidth="2" strokeDasharray="4" className="animate-pulse" />
              <line x1="52%" y1="58%" x2="35%" y2="78%" strokeWidth="2" strokeDasharray="4" className="animate-pulse" />
            </svg>

            {/* Simulated Geographic District Hubs */}
            <div className="relative w-full h-full">
              {/* North Node: Delhi Central Depot */}
              <div 
                onClick={() => setSelectedDistrict(districts.find(d => d.state === 'Delhi') || null)}
                className="absolute top-[18%] left-[34%] cursor-pointer group"
              >
                <div className="w-6 h-6 rounded-full bg-cyan-500/20 border-2 border-cyan-400 flex items-center justify-center text-white text-[10px] font-bold group-hover:scale-125 transition-transform shadow-lg shadow-cyan-500/40">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] font-mono text-cyan-300 whitespace-nowrap bg-slate-950/80 px-1.5 py-0.5 rounded border border-slate-800">
                  Delhi Hub
                </span>
              </div>

              {/* Central Node: Hyderabad State Repository */}
              <div 
                onClick={() => setSelectedDistrict(districts.find(d => d.name === 'Hyderabad') || null)}
                className="absolute top-[52%] left-[48%] cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 border-2 border-indigo-400 flex items-center justify-center text-white text-[10px] font-bold group-hover:scale-125 transition-transform shadow-lg shadow-indigo-500/40">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] font-mono text-indigo-300 whitespace-nowrap bg-slate-950/80 px-1.5 py-0.5 rounded border border-slate-800">
                  Hyderabad Hub
                </span>
              </div>

              {/* Coastal Risk Epicenter: Krishna Delta (Machilipatnam) */}
              <div 
                onClick={() => setSelectedDistrict(districts.find(d => d.name === 'Krishna') || null)}
                className="absolute top-[65%] left-[62%] cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-full bg-rose-500/20 border-2 border-rose-500 flex items-center justify-center text-white text-[10px] font-bold group-hover:scale-125 transition-transform shadow-lg shadow-rose-500/50 animate-ping" />
                <div className="absolute top-0 left-0 w-10 h-10 rounded-full bg-rose-600/40 flex items-center justify-center text-white text-[10px] font-bold">
                  <ShieldAlert className="w-5 h-5 text-rose-400" />
                </div>
                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[11px] font-bold text-rose-300 whitespace-nowrap bg-slate-950/90 px-2 py-0.5 rounded border border-rose-500/40">
                  District Krishna (EPICENTER)
                </span>
              </div>

              {/* Inland Surplus Depot: Guntur */}
              <div 
                onClick={() => setSelectedDistrict(districts.find(d => d.name === 'Guntur') || null)}
                className="absolute top-[68%] left-[54%] cursor-pointer group"
              >
                <div className="w-7 h-7 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-white text-[10px] font-bold group-hover:scale-125 transition-transform shadow-lg shadow-emerald-500/40">
                  <Truck className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] font-mono text-emerald-300 whitespace-nowrap bg-slate-950/80 px-1.5 py-0.5 rounded border border-slate-800">
                  Guntur Depot (+18d Surplus)
                </span>
              </div>
            </div>
          </div>

          {/* Map Legend */}
          <div className="relative z-10 flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 pt-3 border-t border-slate-800/80">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500" /> Stable Buffer (&gt;14d)</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-amber-500" /> Depletion Warning (7-14d)</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-rose-500" /> Acute Vulnerability (&lt;3.5d)</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-cyan-400" /> Active Rerouting Convoy</span>
          </div>
        </div>

        {/* Selected Hub Telemetry Inspector */}
        <div className="lg:col-span-4 bg-slate-900/90 backdrop-blur-md p-6 rounded-2xl border border-slate-800 shadow-xl space-y-5">
          {selectedDistrict ? (
            <>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                    {selectedDistrict.id} • {selectedDistrict.state}
                  </span>
                  <h3 className="text-xl font-bold text-white mt-1">{selectedDistrict.name} District</h3>
                  <p className="text-xs text-slate-400">CMO: {selectedDistrict.chief_medical_officer}</p>
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  selectedDistrict.name === 'Krishna' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                  'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}>
                  {selectedDistrict.name === 'Krishna' ? 'CRITICAL RISK' : 'HEALTHY'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60">
                  <span className="text-[10px] text-slate-500 uppercase block">POPULATION</span>
                  <strong className="text-slate-200 text-sm">{selectedDistrict.population.toLocaleString()}</strong>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60">
                  <span className="text-[10px] text-slate-500 uppercase block">ACTIVE PHCS</span>
                  <strong className="text-cyan-400 text-sm">{selectedDistrict.total_phcs} Centres</strong>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60">
                  <span className="text-[10px] text-slate-500 uppercase block">BED OCCUPANCY</span>
                  <strong className="text-amber-400 text-sm">
                    {Math.round((selectedDistrict.beds_occupied / selectedDistrict.total_beds) * 100)}%
                  </strong>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60">
                  <span className="text-[10px] text-slate-500 uppercase block">RESILIENCE SCORE</span>
                  <strong className="text-emerald-400 text-sm">{selectedDistrict.resilience_score}/100</strong>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 space-y-1.5">
                <div className="text-[10px] font-bold uppercase text-cyan-400 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" />
                  {timeHorizon} Simulation Forecast
                </div>
                <p className="text-xs text-cyan-200/90 leading-relaxed font-sans">
                  {selectedDistrict.name === 'Krishna'
                    ? "Acute surge in diarrheal outpatient demand will deplete frontline ORS reserves in 2.4 days. Recommend executing transfer REDIST-001 from Guntur Depot immediately."
                    : "Stable inventory buffers observed across all sub-divisional dispensaries. Sufficient capacity to serve as lateral supplier depot."}
                </p>
              </div>
            </>
          ) : (
            <div className="text-center text-slate-500 py-12 text-sm">
              Click any node on the radar map to inspect regional resilience telemetry.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
