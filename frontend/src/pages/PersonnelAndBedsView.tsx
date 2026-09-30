import React, { useState } from 'react';
import {
  Users, Bed, UserCheck, AlertTriangle, ShieldCheck, Activity,
  TrendingUp, Clock, CheckCircle2, ArrowRight
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from 'recharts';

interface PersonnelAndBedsViewProps {
  onOpenCopilot: () => void;
  onNavigateToView: (view: string) => void;
}

export const PersonnelAndBedsView: React.FC<PersonnelAndBedsViewProps> = ({
  onOpenCopilot,
  onNavigateToView
}) => {
  const [activeTab, setActiveTab] = useState<'personnel' | 'beds'>('beds');

  const bedData = [
    { type: 'General Ward', total: 6200, occupied: 4100, free: 2100 },
    { type: 'Oxygen-Supported', total: 1420, occupied: 1140, free: 280 },
    { type: 'ICU / Critical Care', total: 540, occupied: 420, free: 120 },
    { type: 'Emergency / Triage', total: 270, occupied: 192, free: 78 }
  ];

  const staffRoster = [
    { role: 'Medical Officers (Doctors)', sanctioned: 1480, present: 1374, attendance: 92.8, status: 'OPTIMAL' },
    { role: 'Staff Nurses', sanctioned: 3200, present: 2980, attendance: 93.1, status: 'OPTIMAL' },
    { role: 'Pharmacists', sanctioned: 710, present: 645, attendance: 90.8, status: 'NORMAL' },
    { role: 'Lab Technicians', sanctioned: 820, present: 730, attendance: 89.0, status: 'NORMAL' },
    { role: 'Auxiliary Support Staff', sanctioned: 2400, present: 2150, attendance: 89.5, status: 'NORMAL' }
  ];

  const understaffedPHCs = [
    { id: "PHC-0089", name: "Bhadradri Tribal PHC", district: "Khammam", docPresent: 1, docSanctioned: 2, nursePresent: 2, nurseSanctioned: 4, deficit: "Staff Attendance 38% due to hill road blockage" },
    { id: "PHC-0042", name: "Machilipatnam Coastal PHC", district: "Krishna", docPresent: 2, docSanctioned: 2, nursePresent: 4, nurseSanctioned: 5, deficit: "Workload Index 26.4 pts/hr (High Burnout Risk)" },
    { id: "PHC-0112", name: "Kakinada Port Rural PHC", district: "East Godavari", docPresent: 1, docSanctioned: 2, nursePresent: 3, nurseSanctioned: 4, deficit: "Single Medical Officer managing 195 daily patients" }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header & Tabs */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Hospital Beds & Medical Personnel Capacity Surveillance
            </h2>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/80 font-mono font-semibold">
              INFRASTRUCTURE TELEMETRY
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Monitor ICU beds, oxygen manifolds, shift attendance rosters, and clinical burnout indices across all facilities.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('beds')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'beds'
                ? 'bg-cyan-600 text-white shadow-sm shadow-cyan-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bed className="w-3.5 h-3.5" />
            <span>Bed Capacities</span>
          </button>
          <button
            onClick={() => setActiveTab('personnel')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'personnel'
                ? 'bg-cyan-600 text-white shadow-sm shadow-cyan-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Medical Personnel</span>
          </button>
        </div>
      </div>

      {activeTab === 'beds' ? (
        <div className="space-y-6">
          {/* Bed Top Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Total Inpatient Beds
              </span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-white">8,430</span>
                <span className="text-xs text-slate-400">across 694 PHCs</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Occupied Beds
              </span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-cyan-300">5,852</span>
                <span className="text-xs text-cyan-400">(69.4% Occ)</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Oxygen Beds Available
              </span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-emerald-400">280 Free</span>
                <span className="text-xs text-slate-400">/ 1,420 total</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Predicted 7-Day Surge
              </span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-rose-400">86.1%</span>
                <span className="text-xs text-rose-400">(+620 needed)</span>
              </div>
            </div>
          </div>

          {/* Bed Breakdown Table and Chart */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            <h3 className="font-bold text-sm text-white">Bed Inventory By Criticality Tier</h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {bedData.map((b) => (
                <div key={b.type} className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">{b.type}</span>
                    <span className="font-mono text-cyan-300 font-bold">{Math.round((b.occupied / b.total) * 100)}% Occ</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-cyan-500"
                      style={{ width: `${(b.occupied / b.total) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                    <span>Occupied: {b.occupied.toLocaleString()}</span>
                    <span className="text-emerald-400">Available: {b.free.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Personnel Roster Overview */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            <h3 className="font-bold text-sm text-white">Clinical Staff Duty Roster & Attendance</h3>

            <div className="divide-y divide-slate-800/80">
              {staffRoster.map((st) => (
                <div key={st.role} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="space-y-0.5">
                    <div className="font-bold text-white text-sm">{st.role}</div>
                    <div className="text-slate-400 font-mono">
                      Present: {st.present.toLocaleString()} / Sanctioned: {st.sanctioned.toLocaleString()}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="font-bold font-mono text-emerald-400 text-sm">{st.attendance}%</span>
                      <div className="text-[10px] text-slate-400 font-mono">Attendance Rate</div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                      {st.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Understaffed / High Workload Facilities */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <h3 className="font-bold text-sm text-white">
                Understaffed Facilities & Burnout Risk Hotspots
              </h3>
            </div>

            <div className="space-y-2">
              {understaffedPHCs.map((phc) => (
                <div key={phc.id} className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div>
                    <div className="font-bold text-white">{phc.name} ({phc.id})</div>
                    <div className="text-[11px] text-cyan-400">District {phc.district}</div>
                    <div className="text-[11px] text-amber-300 mt-1 font-mono">
                      ⚠ {phc.deficit}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right font-mono text-[11px]">
                      <div>Doctors: {phc.docPresent}/{phc.docSanctioned}</div>
                      <div>Nurses: {phc.nursePresent}/{phc.nurseSanctioned}</div>
                    </div>
                    <button
                      onClick={() => onNavigateToView('emergency')}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-cyan-300 border border-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Deploy Mobile Unit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
