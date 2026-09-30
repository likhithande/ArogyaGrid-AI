import React, { useState, useEffect } from 'react';
import { 
  Package, ShoppingCart, Calendar, Clock, DollarSign, 
  TrendingUp, ShieldCheck, CheckCircle2, AlertTriangle, RefreshCw,
  Sparkles, ArrowRight, Check, Bed, Users
} from 'lucide-react';
import { fetchSmartProcurement } from '../services/api';
import { SmartProcurementItem } from '../types';

export const ResourceDigitalTwinView: React.FC = () => {
  const [procurements, setProcurements] = useState<SmartProcurementItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<SmartProcurementItem | null>(null);
  const [activeTab, setActiveTab] = useState<'MEDICINES' | 'BEDS' | 'PERSONNEL'>('MEDICINES');
  const [orderPlacedFeedback, setOrderPlacedFeedback] = useState<string | null>(null);

  useEffect(() => {
    loadProcurement();
  }, []);

  const loadProcurement = async () => {
    const data = await fetchSmartProcurement();
    setProcurements(data);
    if (data.length > 0) setSelectedItem(data[0]);
  };

  const handlePlaceOrder = (item: SmartProcurementItem) => {
    setOrderPlacedFeedback(`Purchase order dispatched to ${item.preferred_supplier} for ${item.economic_order_qty.toLocaleString()} units of ${item.medicine_name}.`);
    setTimeout(() => setOrderPlacedFeedback(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl border border-teal-500/20 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-teal-500/30 text-white animate-pulse">
            <Package className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white tracking-tight">Resource Digital Twin & Smart Procurement</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                EOQ SOLVER v3.2
              </span>
            </div>
            <p className="text-slate-400 text-sm mt-1">
              Deterministic asset twins calculating Economic Order Quantity (EOQ), reorder triggers, lead-time variance, and buffer replenishment
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 bg-slate-800/80 border border-slate-700/60 rounded-xl">
          <button
            onClick={() => setActiveTab('MEDICINES')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'MEDICINES' ? 'bg-teal-500 text-slate-950 shadow-md font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            NLEM Medicines
          </button>
          <button
            onClick={() => setActiveTab('BEDS')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'BEDS' ? 'bg-teal-500 text-slate-950 shadow-md font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bed className="w-3.5 h-3.5" />
            Hospital Beds
          </button>
          <button
            onClick={() => setActiveTab('PERSONNEL')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'PERSONNEL' ? 'bg-teal-500 text-slate-950 shadow-md font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Medical Staff
          </button>
        </div>
      </div>

      {orderPlacedFeedback && (
        <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center gap-3 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-medium">{orderPlacedFeedback}</span>
        </div>
      )}

      {activeTab === 'MEDICINES' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Smart Procurement Recommendations List */}
          <div className="lg:col-span-7 space-y-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-teal-400" />
              AI Automated Purchase Order Requisitions
            </h2>

            {procurements.map(item => {
              const isSelected = selectedItem?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-slate-800/90 border-teal-500 shadow-xl shadow-teal-500/10 ring-1 ring-teal-500/40' 
                      : 'bg-slate-900/60 hover:bg-slate-800/60 border-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-teal-300 border border-slate-700">
                          {item.medicine_code}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          item.urgency === 'HIGH' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                          'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}>
                          {item.urgency} URGENCY
                        </span>
                        <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3 text-slate-500" />
                          Lead Time: {item.supplier_lead_time_days} Days
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-white mb-1">{item.medicine_name}</h3>
                      <p className="text-xs text-slate-400">Supplier: <strong className="text-slate-300">{item.preferred_supplier}</strong></p>

                      <div className="mt-3 grid grid-cols-3 gap-2 text-xs font-mono">
                        <div className="p-2 rounded-lg bg-slate-950/40 border border-slate-800">
                          <span className="text-slate-500 block text-[10px]">ON HAND</span>
                          <strong className="text-rose-400">{item.current_stock.toLocaleString()}</strong>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-950/40 border border-slate-800">
                          <span className="text-slate-500 block text-[10px]">REORDER POINT</span>
                          <strong className="text-amber-400">{item.reorder_point.toLocaleString()}</strong>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-950/40 border border-slate-800">
                          <span className="text-slate-500 block text-[10px]">REC. EOQ</span>
                          <strong className="text-teal-400">{item.economic_order_qty.toLocaleString()}</strong>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs font-semibold text-slate-400">Estimated Cost</div>
                      <div className="text-lg font-bold text-white font-mono">₹{item.estimated_cost_inr.toLocaleString()}</div>
                      <div className="text-[11px] text-teal-400 mt-1">Optimal Batch Size</div>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Safety Stock Buffer: <strong className="text-slate-200">{item.safety_stock.toLocaleString()} units</strong></span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlaceOrder(item);
                      }}
                      className="px-3 py-1 rounded-lg bg-teal-600 hover:bg-teal-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 shadow-md"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Approve PO
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detailed Resource Dossier */}
          <div className="lg:col-span-5">
            {selectedItem ? (
              <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-6 sticky top-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400 font-bold">
                      <Package className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">{selectedItem.medicine_name}</h3>
                      <p className="text-[11px] text-slate-400 font-mono">{selectedItem.medicine_code} • NLEM Essential</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-teal-500/10 border border-teal-500/20 space-y-2">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    AI PROCUREMENT RATIONALE
                  </div>
                  <p className="text-xs text-teal-200/90 leading-relaxed font-sans">
                    {selectedItem.ai_rationale}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 border border-slate-700/60 text-xs">
                    <span className="text-slate-400">Supplier Lead Time</span>
                    <strong className="text-slate-200 font-mono">{selectedItem.supplier_lead_time_days} Days</strong>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 border border-slate-700/60 text-xs">
                    <span className="text-slate-400">30-Day Projected Outpatient Demand</span>
                    <strong className="text-amber-400 font-mono">{selectedItem.projected_demand_30d.toLocaleString()} units</strong>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 border border-slate-700/60 text-xs">
                    <span className="text-slate-400">Calculated Safety Buffer</span>
                    <strong className="text-emerald-400 font-mono">{selectedItem.safety_stock.toLocaleString()} units</strong>
                  </div>
                </div>

                <button
                  onClick={() => handlePlaceOrder(selectedItem)}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2 active:scale-95"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Dispatch Smart Procurement Requisition (₹{selectedItem.estimated_cost_inr.toLocaleString()})
                </button>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {activeTab === 'BEDS' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Bed className="w-4 h-4 text-sky-400" />
              Oxygen Beds Digital Twin
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800"><span className="text-slate-400">Total Capacity</span><strong className="text-white font-mono">1,420 Beds</strong></div>
              <div className="flex justify-between py-1 border-b border-slate-800"><span className="text-slate-400">Occupied</span><strong className="text-amber-400 font-mono">980 (69.0%)</strong></div>
              <div className="flex justify-between py-1 border-b border-slate-800"><span className="text-slate-400">Available</span><strong className="text-emerald-400 font-mono">440 Beds</strong></div>
              <div className="flex justify-between py-1"><span className="text-slate-400">Projected 7d Saturation</span><strong className="text-sky-400 font-mono">78.4% (Stable)</strong></div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Bed className="w-4 h-4 text-rose-400" />
              ICU Ventilator Beds Twin
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800"><span className="text-slate-400">Total Capacity</span><strong className="text-white font-mono">410 Beds</strong></div>
              <div className="flex justify-between py-1 border-b border-slate-800"><span className="text-slate-400">Occupied</span><strong className="text-rose-400 font-mono">342 (83.4%)</strong></div>
              <div className="flex justify-between py-1 border-b border-slate-800"><span className="text-slate-400">Available</span><strong className="text-amber-400 font-mono">68 Beds</strong></div>
              <div className="flex justify-between py-1"><span className="text-slate-400">Projected 7d Saturation</span><strong className="text-rose-400 font-mono">91.2% (CRITICAL)</strong></div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Bed className="w-4 h-4 text-emerald-400" />
              General Inpatient Beds Twin
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800"><span className="text-slate-400">Total Capacity</span><strong className="text-white font-mono">6,600 Beds</strong></div>
              <div className="flex justify-between py-1 border-b border-slate-800"><span className="text-slate-400">Occupied</span><strong className="text-sky-400 font-mono">4,530 (68.6%)</strong></div>
              <div className="flex justify-between py-1 border-b border-slate-800"><span className="text-slate-400">Available</span><strong className="text-emerald-400 font-mono">2,070 Beds</strong></div>
              <div className="flex justify-between py-1"><span className="text-slate-400">Projected 7d Saturation</span><strong className="text-emerald-400 font-mono">71.0% (HEALTHY)</strong></div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'PERSONNEL' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-400" />
              Medical Officers / Doctors
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800"><span className="text-slate-400">Sanctioned</span><strong className="text-white font-mono">1,388 Posts</strong></div>
              <div className="flex justify-between py-1 border-b border-slate-800"><span className="text-slate-400">Present on Duty</span><strong className="text-emerald-400 font-mono">1,288 (92.8%)</strong></div>
              <div className="flex justify-between py-1 border-b border-slate-800"><span className="text-slate-400">On Leave / Deputed</span><strong className="text-amber-400 font-mono">100 Doctors</strong></div>
              <div className="flex justify-between py-1"><span className="text-slate-400">Average Workload</span><strong className="text-sky-400 font-mono">108 OPD/day</strong></div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-teal-400" />
              Staff Nurses & Midwives
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800"><span className="text-slate-400">Sanctioned</span><strong className="text-white font-mono">3,470 Posts</strong></div>
              <div className="flex justify-between py-1 border-b border-slate-800"><span className="text-slate-400">Present on Duty</span><strong className="text-emerald-400 font-mono">3,310 (95.4%)</strong></div>
              <div className="flex justify-between py-1 border-b border-slate-800"><span className="text-slate-400">On Leave / Shift Off</span><strong className="text-amber-400 font-mono">160 Nurses</strong></div>
              <div className="flex justify-between py-1"><span className="text-slate-400">Nurse-to-Bed Ratio</span><strong className="text-teal-400 font-mono">1 : 2.5 (OPTIMAL)</strong></div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-400" />
              Pharmacists & Lab Technicians
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800"><span className="text-slate-400">Sanctioned</span><strong className="text-white font-mono">1,040 Posts</strong></div>
              <div className="flex justify-between py-1 border-b border-slate-800"><span className="text-slate-400">Present on Duty</span><strong className="text-emerald-400 font-mono">988 (95.0%)</strong></div>
              <div className="flex justify-between py-1 border-b border-slate-800"><span className="text-slate-400">FEFO Audits Completed</span><strong className="text-purple-400 font-mono">98.4% On Schedule</strong></div>
              <div className="flex justify-between py-1"><span className="text-slate-400">Dispensing Accuracy</span><strong className="text-emerald-400 font-mono">99.7% Verified</strong></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
