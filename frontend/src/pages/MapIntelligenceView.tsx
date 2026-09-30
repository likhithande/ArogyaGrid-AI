import React, { useState, useEffect } from 'react';
import {
  MapPin, Layers, Filter, Search, ChevronRight, X, AlertTriangle,
  Bed, Users, Package, ShieldCheck, Activity, ArrowRight, Sparkles
} from 'lucide-react';
import { fetchDistricts, fetchPHCs } from '../services/api';
import { District, PHC } from '../types';

interface MapIntelligenceViewProps {
  onOpenCopilot: () => void;
  onNavigateToView: (view: string) => void;
}

export const MapIntelligenceView: React.FC<MapIntelligenceViewProps> = ({
  onOpenCopilot,
  onNavigateToView
}) => {
  const [districts, setDistricts] = useState<District[]>([]);
  const [phcs, setPhcs] = useState<PHC[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);
  const [selectedPhc, setSelectedPhc] = useState<PHC | null>(null);
  const [activeLayer, setActiveLayer] = useState<'all' | 'shortages' | 'beds' | 'emergency' | 'resilience'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStateFilter, setSelectedStateFilter] = useState('ALL');

  useEffect(() => {
    loadMapData();
  }, []);

  const loadMapData = async () => {
    const d = await fetchDistricts();
    setDistricts(d);
    const p = await fetchPHCs(150);
    setPhcs(p);
    // Default selected district to Krishna for hackathon storytelling
    const krishna = d.find((item) => item.name === 'Krishna');
    if (krishna) setSelectedDistrict(krishna);
  };

  const filteredDistricts = districts.filter((d) => {
    const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) || d.state.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesState = selectedStateFilter === 'ALL' || d.state === selectedStateFilter;
    if (activeLayer === 'shortages') return matchesSearch && matchesState && d.critical_stockouts_count > 2;
    if (activeLayer === 'emergency') return matchesSearch && matchesState && (d.risk_level === 'CRITICAL' || d.risk_level === 'HIGH');
    return matchesSearch && matchesState;
  });

  const states = ['ALL', 'Andhra Pradesh', 'Telangana', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Uttar Pradesh', 'Odisha', 'Kerala'];

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Top Map Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              National Health Infrastructure Geospatial Intelligence
            </h2>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/80 font-mono font-semibold">
              694 PHCs • 51 Districts
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Hierarchical drilldown: India → State → District → PHC. Multi-layer epidemiological & supply telemetry.
          </p>
        </div>

        {/* Layer Toggles */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1 hidden sm:inline">
            Layers:
          </span>
          {[
            { id: 'all', label: 'All PHCs' },
            { id: 'shortages', label: 'Critical Shortages' },
            { id: 'beds', label: 'Bed Pressure' },
            { id: 'emergency', label: 'Emergency Zones' },
            { id: 'resilience', label: 'Resilience Index' }
          ].map((layer) => (
            <button
              key={layer.id}
              onClick={() => setActiveLayer(layer.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeLayer === layer.id
                  ? 'bg-cyan-600 text-white shadow-sm shadow-cyan-600/30'
                  : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-750 border border-slate-700'
              }`}
            >
              {layer.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Map Layout: Interactive Map Canvas + Details Side Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Canvas Card */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col min-h-[540px]">
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pb-4 border-b border-slate-800">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search district, state, or PHC name..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <select
              value={selectedStateFilter}
              onChange={(e) => setSelectedStateFilter(e.target.value)}
              className="w-full sm:w-48 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              {states.map((s) => (
                <option key={s} value={s}>{s === 'ALL' ? 'All States (National)' : s}</option>
              ))}
            </select>
          </div>

          {/* Interactive Geospatial SVG Network Canvas */}
          <div className="relative flex-1 mt-4 rounded-xl bg-slate-950/90 border border-slate-800/80 p-4 overflow-hidden flex items-center justify-center min-h-[420px]">
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b0f_1px,transparent_1px),linear-gradient(to_bottom,#1e293b0f_1px,transparent_1px)] bg-[size:28px_28px]" />

            {/* India Geography Abstract Boundary Overlay */}
            <svg
              className="w-full h-full max-h-[480px] select-none"
              viewBox="65 5 35 32"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Authentic Indian Subcontinent Outline Path */}
              <path
                d="M 77.5,31.9 C 76.5,30.5 75.2,28.0 74.0,25.0 C 73.0,22.0 72.8,19.5 72.0,18.5 C 70.0,19.2 68.5,18.0 69.0,16.8 C 70.0,15.5 71.5,16.2 72.5,16.0 C 70.5,14.5 70.0,12.5 71.0,10.0 C 72.0,8.5 74.0,6.0 75.0,4.5 C 76.2,4.0 77.5,4.2 78.5,5.5 C 79.5,7.0 79.0,8.5 80.5,9.5 C 83.5,11.0 86.5,12.0 88.5,12.5 C 89.5,13.0 90.0,13.8 91.5,13.5 C 93.5,12.5 96.0,13.0 96.5,15.0 C 95.5,17.5 93.0,18.0 91.8,17.5 C 90.5,17.2 89.5,15.5 88.5,16.5 C 87.8,17.8 88.5,18.8 88.2,20.0 C 86.5,20.8 84.5,21.5 83.5,22.8 C 82.0,24.5 80.2,27.5 79.5,30.0 Z"
                fill="rgba(15, 23, 42, 0.75)"
                stroke="rgba(56, 189, 248, 0.45)"
                strokeWidth="0.4"
              />

              {/* Connecting Supply Logistics Corridors */}
              <line x1="78.48" y1="17.38" x2="80.43" y2="16.30" stroke="rgba(6, 182, 212, 0.4)" strokeWidth="0.3" strokeDasharray="1 1" />
              <line x1="80.43" y1="16.30" x2="81.13" y2="16.19" stroke="rgba(239, 68, 68, 0.6)" strokeWidth="0.5" />
              <line x1="81.13" y1="16.19" x2="81.80" y2="17.00" stroke="rgba(239, 68, 68, 0.5)" strokeWidth="0.4" />
              <line x1="78.48" y1="17.38" x2="73.85" y2="18.52" stroke="rgba(6, 182, 212, 0.4)" strokeWidth="0.3" />
              <line x1="78.48" y1="17.38" x2="77.59" y2="12.97" stroke="rgba(6, 182, 212, 0.4)" strokeWidth="0.3" />

              {/* District Pin Nodes */}
              {filteredDistricts.map((d) => {
                const isSelected = selectedDistrict?.id === d.id;
                const isCritical = d.risk_level === 'CRITICAL';
                const isHigh = d.risk_level === 'HIGH';

                // Invert latitude for SVG coordinate space
                const svgY = 40 - d.lat;
                const svgX = d.lng;

                const pinColor = isCritical ? '#ef4444' : isHigh ? '#f59e0b' : '#10b981';

                return (
                  <g
                    key={d.id}
                    onClick={() => {
                      setSelectedDistrict(d);
                      setSelectedPhc(null);
                    }}
                    className="cursor-pointer transition-transform hover:scale-125"
                  >
                    {/* Pulsing ring for critical districts (Krishna, etc.) */}
                    {isCritical && (
                      <circle
                        cx={svgX}
                        cy={svgY}
                        r="2.2"
                        fill="none"
                        stroke="#ef4444"
                        strokeWidth="0.3"
                        className="animate-ping"
                      />
                    )}

                    {isSelected && (
                      <circle
                        cx={svgX}
                        cy={svgY}
                        r="1.8"
                        fill="none"
                        stroke="#38bdf8"
                        strokeWidth="0.4"
                      />
                    )}

                    <circle
                      cx={svgX}
                      cy={svgY}
                      r={isSelected ? "1.2" : "0.85"}
                      fill={pinColor}
                      stroke="#0f172a"
                      strokeWidth="0.25"
                    />

                    {/* District Name Label */}
                    <text
                      x={svgX + 1.2}
                      y={svgY + 0.3}
                      fill={isSelected ? '#38bdf8' : (isCritical ? '#f87171' : '#cbd5e1')}
                      fontSize="0.85"
                      fontFamily="monospace"
                      fontWeight={isSelected || isCritical ? 'bold' : 'normal'}
                    >
                      {d.name}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Map Legend Overlay */}
            <div className="absolute bottom-3 left-3 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 backdrop-blur-md text-[11px] space-y-1.5 font-mono">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Resilience Status
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span className="text-slate-300">Resilient (Score &gt; 80)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span className="text-slate-300">Moderate Risk (65 - 80)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                <span className="text-rose-300 font-bold">Critical Shortage (&lt; 65)</span>
              </div>
            </div>

            {/* Quick Drilldown Hint */}
            <div className="absolute top-3 right-3 p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-[10px] text-cyan-300 font-mono hidden sm:flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Click any district pin to inspect PHC cluster</span>
            </div>
          </div>
        </div>

        {/* Right Side: District & PHC Detailed Diagnostic Drawer */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4 flex flex-col">
          {selectedDistrict ? (
            <div className="space-y-4">
              {/* District Header */}
              <div className="flex items-start justify-between pb-3 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-cyan-400 font-bold">
                      {selectedDistrict.id}
                    </span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold uppercase ${
                      selectedDistrict.risk_level === 'CRITICAL'
                        ? 'bg-rose-950 text-rose-300 border border-rose-800'
                        : selectedDistrict.risk_level === 'HIGH'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    }`}>
                      {selectedDistrict.risk_level}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mt-1">
                    District {selectedDistrict.name}
                  </h3>
                  <p className="text-xs text-slate-400">{selectedDistrict.state}</p>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-extrabold text-white font-mono">
                    {selectedDistrict.resilience_score}
                  </div>
                  <span className="text-[10px] text-slate-400">Resilience Index</span>
                </div>
              </div>

              {/* District Infrastructure Specs */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Monitored PHCs</span>
                  <span className="font-bold text-white font-mono text-sm">
                    {selectedDistrict.active_phcs} / {selectedDistrict.total_phcs}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Bed Occupancy</span>
                  <span className="font-bold text-white font-mono text-sm">
                    {Math.round((selectedDistrict.beds_occupied / selectedDistrict.total_beds) * 100)}%
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Critical Stockouts</span>
                  <span className="font-bold text-rose-400 font-mono text-sm">
                    {selectedDistrict.critical_stockouts_count} Medicines
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Daily Outpatients</span>
                  <span className="font-bold text-cyan-300 font-mono text-sm">
                    {selectedDistrict.avg_daily_footfall.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Chief Medical Officer */}
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300 space-y-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Nodal Authority
                </div>
                <div className="font-semibold text-white">{selectedDistrict.chief_medical_officer}</div>
                <div className="text-[11px] text-slate-400">Chief Medical Officer (CMO)</div>
              </div>

              {/* PHCs in this District */}
              <div className="space-y-2 pt-1 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300">
                    PHCs in {selectedDistrict.name}
                  </span>
                  <span className="text-[10px] text-cyan-400 font-mono">
                    {phcs.filter((p) => p.district === selectedDistrict.name).length} Facilities
                  </span>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {phcs
                    .filter((p) => p.district === selectedDistrict.name)
                    .map((p) => (
                      <div
                        key={p.id}
                        onClick={() => setSelectedPhc(p)}
                        className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                          selectedPhc?.id === p.id
                            ? 'bg-cyan-950/80 border-cyan-500/80 text-white'
                            : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs truncate">{p.name}</span>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold ${
                            p.status === 'CRITICAL'
                              ? 'bg-rose-950 text-rose-300 border border-rose-800'
                              : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          }`}>
                            {p.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                          <span>{p.type}</span>
                          <span>•</span>
                          <span>Beds: {p.beds_occupied}/{p.beds_total}</span>
                          <span>•</span>
                          <span>Stock: {p.stock_health_score}%</span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <button
                  onClick={() => onNavigateToView('redistribution')}
                  className="w-full py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md shadow-cyan-600/30 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>Trigger Lateral Redistribution for {selectedDistrict.name}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <MapPin className="w-10 h-10 text-slate-600 mb-2" />
              <p className="text-xs">Select any district or PHC on the map to inspect live resources.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
