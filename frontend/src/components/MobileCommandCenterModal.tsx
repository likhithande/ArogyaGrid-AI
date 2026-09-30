import React, { useState } from 'react';
import {
  Smartphone, ShieldAlert, Activity, Sparkles, AlertOctagon,
  LayoutDashboard, Bell, Bot, X, CheckCircle2, ChevronRight
} from 'lucide-react';

interface MobileCommandCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToView: (view: string) => void;
  onOpenCopilot: () => void;
  isEmergencyActive: boolean;
  onToggleEmergency: () => void;
}

export const MobileCommandCenterModal: React.FC<MobileCommandCenterModalProps> = ({
  isOpen,
  onClose,
  onNavigateToView,
  onOpenCopilot,
  isEmergencyActive,
  onToggleEmergency
}) => {
  const [mobileTab, setMobileTab] = useState<'home' | 'alerts' | 'copilot'>('home');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
      {/* Mobile Device Frame */}
      <div className="relative w-full max-w-sm h-[720px] rounded-[44px] border-[8px] border-slate-800 bg-slate-950 p-4 shadow-2xl flex flex-col justify-between overflow-hidden">
        {/* Top Speaker / Dynamic Island Notch */}
        <div className="flex justify-center -mt-1 mb-2">
          <div className="h-5 w-28 rounded-full bg-slate-800 flex items-center justify-center">
            <div className="h-2 w-2 rounded-full bg-slate-900 mr-2" />
            <div className="h-1.5 w-8 rounded-full bg-slate-900" />
          </div>
        </div>

        {/* Close Modal Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-full bg-slate-800 p-1 text-slate-400 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Mobile Screen Body */}
        <div className="flex-1 overflow-y-auto space-y-4 pt-2 pb-16 text-xs pr-1">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">
                AROGYAGRID MOBILE
              </span>
              <h3 className="font-bold text-white text-base">Field Command</h3>
            </div>
            <button
              onClick={onToggleEmergency}
              className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                isEmergencyActive ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-800 text-slate-300'
              }`}
            >
              {isEmergencyActive ? 'DISASTER MODE' : 'NORMAL'}
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-3">
              <span className="text-slate-400 text-[10px]">Active PHCs</span>
              <p className="text-lg font-black text-white mt-0.5">694 / 694</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-3">
              <span className="text-slate-400 text-[10px]">Medicine Avail</span>
              <p className="text-lg font-black text-emerald-400 mt-0.5">89.9%</p>
            </div>
          </div>

          {/* Critical Alert Card */}
          <div className="rounded-xl border border-red-900/50 bg-red-950/20 p-3.5 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-rose-400 text-xs">Stock-Out Warning</span>
              <span className="rounded bg-rose-500/20 px-1.5 py-0.5 text-[9px] font-bold text-rose-400">3.2 Days</span>
            </div>
            <p className="text-slate-300 text-[11px]">
              ORS critical depletion at Machilipatnam Coastal PHC.
            </p>
            <button
              onClick={() => {
                onNavigateToView('redistribution');
                onClose();
              }}
              className="mt-2 w-full rounded-lg bg-rose-600 py-1.5 text-center font-bold text-white text-[11px]"
            >
              Approve Lateral Transfer
            </button>
          </div>

          {/* Rapid Action Buttons */}
          <div className="space-y-2">
            <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">Field Shortcuts</span>
            {[
              { label: "Topological Healthcare Graph", view: "graph-intelligence" },
              { label: "P2P Resource Matching", view: "ai-matching" },
              { label: "Incident Room FLOOD-2026", view: "incident-room" },
              { label: "Cold-Chain IoT Sensors", view: "iot-stream" }
            ].map((btn, idx) => (
              <button
                key={idx}
                onClick={() => {
                  onNavigateToView(btn.view);
                  onClose();
                }}
                className="w-full flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-left hover:bg-slate-800 transition-colors"
              >
                <span className="font-bold text-slate-200">{btn.label}</span>
                <ChevronRight className="h-4 w-4 text-slate-500" />
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Bottom Navigation Bar */}
        <div className="absolute bottom-2 left-4 right-4 h-14 rounded-2xl border border-slate-800 bg-slate-900/95 backdrop-blur-md flex items-center justify-around px-2">
          <button
            onClick={() => setMobileTab('home')}
            className={`flex flex-col items-center text-[10px] font-bold ${
              mobileTab === 'home' ? 'text-cyan-400' : 'text-slate-400'
            }`}
          >
            <LayoutDashboard className="h-4 w-4 mb-0.5" />
            Home
          </button>
          <button
            onClick={() => {
              onNavigateToView('early-warnings');
              onClose();
            }}
            className="flex flex-col items-center text-[10px] font-bold text-slate-400 hover:text-white"
          >
            <Bell className="h-4 w-4 mb-0.5" />
            Alerts
          </button>
          <button
            onClick={() => {
              onOpenCopilot();
              onClose();
            }}
            className="flex flex-col items-center text-[10px] font-bold text-indigo-400"
          >
            <Bot className="h-4 w-4 mb-0.5" />
            Copilot
          </button>
          <button
            onClick={onToggleEmergency}
            className={`flex flex-col items-center text-[10px] font-bold ${
              isEmergencyActive ? 'text-red-400' : 'text-slate-400'
            }`}
          >
            <ShieldAlert className="h-4 w-4 mb-0.5" />
            Crisis
          </button>
        </div>
      </div>
    </div>
  );
};
