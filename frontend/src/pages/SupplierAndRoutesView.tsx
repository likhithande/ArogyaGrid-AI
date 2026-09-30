import React, { useState, useEffect } from 'react';
import { 
  Truck, Navigation, ShieldCheck, AlertTriangle, CheckCircle2, 
  MapPin, Clock, ArrowRight, Route, ShieldAlert, Check
} from 'lucide-react';
import { fetchSuppliers, fetchAlternativeRoutes } from '../services/api';
import { SupplierProfile, AlternativeRoute } from '../types';

export const SupplierAndRoutesView: React.FC = () => {
  const [suppliers, setSuppliers] = useState<SupplierProfile[]>([]);
  const [routes, setRoutes] = useState<AlternativeRoute[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierProfile | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<AlternativeRoute | null>(null);
  const [routeBypassActivated, setRouteBypassActivated] = useState<boolean>(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const supData = await fetchSuppliers();
    const rtData = await fetchAlternativeRoutes();
    setSuppliers(supData);
    setRoutes(rtData);
    if (supData.length > 0) setSelectedSupplier(supData[0]);
    if (rtData.length > 0) setSelectedRoute(rtData[0]);
  };

  const handleActivateBypass = () => {
    setRouteBypassActivated(true);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl border border-sky-500/20 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center shadow-lg shadow-sky-500/30 text-white animate-pulse">
            <Truck className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white tracking-tight">Supplier Intelligence & Alternative Route Engine</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                DYNAMIC LOGISTICS GRAPH
              </span>
            </div>
            <p className="text-slate-400 text-sm mt-1">
              Real-time carrier SLA audit, delivery delay tracking, and automated detour rerouting when arterial highways fail
            </p>
          </div>
        </div>
      </div>

      {/* Alternative Route Intelligence Section (Module 12) */}
      <div className="bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <Route className="w-5 h-5 text-sky-400" />
            <h2 className="text-base font-bold text-white">Alternative Route Detour & Bypass Intelligence</h2>
          </div>
          <span className="text-xs text-slate-400">Live Highway Corridor Telematics</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {routes.map(r => (
            <div
              key={r.id}
              onClick={() => setSelectedRoute(r)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                selectedRoute?.id === r.id 
                  ? 'bg-slate-800/90 border-sky-500 shadow-xl ring-1 ring-sky-500/40' 
                  : 'bg-slate-900/60 hover:bg-slate-800/60 border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-sky-300 border border-slate-700">
                    {r.id}
                  </span>
                  <h3 className="text-sm font-bold text-white mt-1.5 flex items-center gap-2">
                    <span>{r.origin}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                    <span>{r.destination}</span>
                  </h3>
                </div>

                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  r.primary_route_status === 'WATERLOGGED' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                  'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}>
                  PRIMARY: {r.primary_route_status}
                </span>
              </div>

              {/* Comparison Matrix: Primary vs Alternative */}
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-rose-400 font-bold uppercase block">PRIMARY ROUTE (UNAVAILABLE)</span>
                    <strong className="text-white">{r.primary_route_name}</strong>
                  </div>
                  <span className="text-rose-400 font-bold">BLOCKED / +2.2h DELAY</span>
                </div>

                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-emerald-400 font-bold uppercase block">AI ALTERNATIVE ROUTE (RECOMMENDED)</span>
                    <strong className="text-white">{r.alt_route_name}</strong>
                    <div className="text-[11px] text-slate-400 mt-0.5">{r.alt_distance_km} km • Capacity: {r.alt_capacity_status}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-emerald-400 font-bold block">+{r.alt_delivery_time_delta_hrs}h Transit</span>
                    <span className="text-[10px] text-slate-400">Risk Score: {r.risk_index}/100</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  Status: <strong className={routeBypassActivated ? "text-emerald-400" : "text-amber-400"}>
                    {routeBypassActivated ? "Bypass Authorized & Active" : "Pending Human Confirmation"}
                  </strong>
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleActivateBypass();
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-all active:scale-95 shadow-md shadow-sky-500/20"
                >
                  <Check className="w-3.5 h-3.5" />
                  Activate Detour Bypass
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Supplier Intelligence Section (Module 10) */}
      <div className="space-y-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          Pharmaceutical Supplier Performance & SLA Reliability
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {suppliers.map(sup => (
            <div
              key={sup.id}
              onClick={() => setSelectedSupplier(sup)}
              className={`p-6 rounded-2xl border transition-all cursor-pointer ${
                selectedSupplier?.id === sup.id 
                  ? 'bg-slate-800/90 border-emerald-500 shadow-xl ring-1 ring-emerald-500/40' 
                  : 'bg-slate-900/60 hover:bg-slate-800/60 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-emerald-300 border border-slate-700">
                  {sup.tier} TIER
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  sup.risk_level === 'LOW' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                  'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                }`}>
                  {sup.risk_level} RISK
                </span>
              </div>

              <h3 className="text-base font-bold text-white mb-2 leading-tight">{sup.name}</h3>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono mb-4">
                <div className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">DELIVERY SLA</span>
                  <strong className={sup.delivery_reliability_pct > 90 ? "text-emerald-400" : "text-rose-400"}>
                    {sup.delivery_reliability_pct}%
                  </strong>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">AVG DELAY</span>
                  <strong className={sup.average_delay_days > 1.5 ? "text-rose-400" : "text-slate-200"}>
                    +{sup.average_delay_days} Days
                  </strong>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">FULFILLMENT</span>
                  <strong className="text-sky-400">{sup.order_fulfillment_pct}%</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">LEAD TIME</span>
                  <strong className="text-slate-200">{sup.lead_time_days} Days</strong>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold block mb-1.5">Authorized Catalog</span>
                <div className="flex flex-wrap gap-1">
                  {sup.specialty_catalog.map((cat, idx) => (
                    <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700/60">
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
