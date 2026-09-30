import React, { useState, useEffect } from 'react';
import {
  Crown, Sparkles, BookOpen, Presentation, Sliders, CheckCircle2,
  AlertTriangle, ArrowUpRight, ArrowDownRight, TrendingUp,
  Download, Eye, Printer, ChevronRight, Play, Pause, ShieldAlert,
  Activity, Users, ShoppingCart, RefreshCw
} from 'lucide-react';
import { fetchDashboardSummary, fetchAiStorySlides } from '../services/api';
import { AiStorySlide } from '../types';

interface ExecutiveLayer1ViewProps {
  onNavigateToView: (view: string) => void;
  onOpenCopilot: () => void;
}

export const ExecutiveLayer1View: React.FC<ExecutiveLayer1ViewProps> = ({
  onNavigateToView,
  onOpenCopilot
}) => {
  const [summary, setSummary] = useState<any>(null);
  const [storySlides, setStorySlides] = useState<AiStorySlide[]>([]);
  const [activeStoryStep, setActiveStoryStep] = useState<number>(1);
  const [isStoryPlaying, setIsStoryPlaying] = useState<boolean>(false);
  const [isPresentationOpen, setIsPresentationOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Widget visibility toggles
  const [showSummaryWidget, setShowSummaryWidget] = useState<boolean>(true);
  const [showInsightsWidget, setShowInsightsWidget] = useState<boolean>(true);
  const [showStoryWidget, setShowStoryWidget] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [sum, slides] = await Promise.all([
        fetchDashboardSummary(),
        fetchAiStorySlides()
      ]);
      setSummary(sum);
      setStorySlides(slides);
      setLoading(false);
    }
    loadData();
  }, []);

  // Story progression
  useEffect(() => {
    let timer: any;
    if (isStoryPlaying) {
      if (activeStoryStep < storySlides.length) {
        timer = setTimeout(() => {
          setActiveStoryStep(prev => prev + 1);
        }, 3200);
      } else {
        setIsStoryPlaying(false);
      }
    }
    return () => clearTimeout(timer);
  }, [isStoryPlaying, activeStoryStep, storySlides.length]);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner - Layer 1 Executive View */}
      <div className="rounded-2xl border border-amber-700/40 bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 p-6 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 rounded-full bg-amber-500/20 px-3 py-0.5 text-xs font-bold text-amber-300 border border-amber-500/30">
                <Crown className="h-3.5 w-3.5 text-amber-400" />
                LAYER 1: EXECUTIVE BRIEFING MODE
              </span>
              <span className="rounded-full bg-emerald-500/20 px-3 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/30">
                HEALTHCARE RESILIENCE: 82.4/100
              </span>
            </div>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-white lg:text-3xl">
              Morning Strategic Executive Intelligence
            </h1>
            <p className="mt-1 text-sm text-slate-300">
              High-level decision synthesis designed for State Ministers and Health Commissioners. Focuses on critical risks, emerging anomalies, and actionable approvals.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsPresentationOpen(true)}
              className="rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 shadow-lg shadow-amber-500/30 hover:bg-amber-400 transition-all flex items-center gap-1.5"
            >
              <Presentation className="h-4 w-4" /> Generate Slide Deck
            </button>
            <button
              onClick={onOpenCopilot}
              className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700 transition-all flex items-center gap-1.5"
            >
              <Sparkles className="h-4 w-4 text-cyan-400" /> Ask Executive Copilot
            </button>
          </div>
        </div>
      </div>

      {/* MODULE 61: "WHAT'S CHANGED?" AUTO-SUMMARY */}
      {showSummaryWidget && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-400" />
              <h2 className="text-sm font-bold text-white">"What's Changed?" &mdash; Overnight Intelligence Summary</h2>
            </div>
            <span className="rounded bg-slate-800 px-2.5 py-0.5 text-[10px] font-mono text-slate-400">
              3 Significant Shifts Flagged
            </span>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="rounded-xl border border-rose-900/40 bg-rose-950/20 p-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-rose-300">1 Critical Stockout Vulnerability</span>
                <span className="rounded bg-rose-500/20 px-1.5 py-0.5 text-[9px] font-bold text-rose-400">+1 New</span>
              </div>
              <p className="mt-2 text-slate-300 text-[11px]">
                Oral Rehydration Salts (ORS) at Machilipatnam Coastal PHC projected to reach zero in <strong>3.2 days</strong> due to acute fever draw.
              </p>
              <button
                onClick={() => onNavigateToView('graph-intelligence')}
                className="mt-3 text-[11px] font-bold text-cyan-400 hover:underline flex items-center gap-1"
              >
                Inspect Topological Graph &rarr;
              </button>
            </div>

            <div className="rounded-xl border border-amber-900/40 bg-amber-950/20 p-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-300">Logistics Corridor Choke</span>
                <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[9px] font-bold text-amber-400">Alert</span>
              </div>
              <p className="mt-2 text-slate-300 text-[11px]">
                National Highway 216 waterlogged at Mile 44. Detour active via State Highway 42 (+2.2h transit).
              </p>
              <button
                onClick={() => onNavigateToView('ai-matching')}
                className="mt-3 text-[11px] font-bold text-cyan-400 hover:underline flex items-center gap-1"
              >
                View P2P Match Proposals &rarr;
              </button>
            </div>

            <div className="rounded-xl border border-emerald-900/40 bg-emerald-950/20 p-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-300">High-Fidelity Surplus Match</span>
                <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[9px] font-bold text-emerald-400">Ready</span>
              </div>
              <p className="mt-2 text-slate-300 text-[11px]">
                Tenali CHC (Guntur) identified with 8,400 units surplus (&gt;32 days). 1-click lateral redistribution pending.
              </p>
              <button
                onClick={() => onNavigateToView('redistribution')}
                className="mt-3 text-[11px] font-bold text-emerald-400 hover:underline flex items-center gap-1"
              >
                Approve Dispatch (1-Click) &rarr;
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 62: AI ACTIONABLE INSIGHT CARDS */}
      {showInsightsWidget && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { title: "Pan-India Monitored PHCs", val: summary?.total_phcs || 694, sub: "690 Fully Operational", change: "+0.4%", positive: true, icon: Activity },
            { title: "Essential Medicine Availability", val: `${summary?.medicine_availability_pct || 89.9}%`, sub: "NLEM Stock Index", change: "+1.2%", positive: true, icon: ShoppingCart },
            { title: "Hospital Bed Occupancy", val: `${summary?.bed_occupancy_pct || 69.4}%`, sub: "2,578 Beds Available", change: "+4.1%", positive: false, icon: Users },
            { title: "Medical Staff Attendance", val: `${summary?.doctor_attendance_pct || 92.8}%`, sub: "Duty Roster Compliance", change: "+0.8%", positive: true, icon: ShieldAlert }
          ].map((card, i) => (
            <div key={i} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">{card.title}</span>
                <card.icon className="h-4 w-4 text-amber-400" />
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <span className="text-2xl font-black text-white">{card.val}</span>
                <span className={`flex items-center text-xs font-bold ${card.positive ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {card.positive ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                  {card.change}
                </span>
              </div>
              <span className="mt-1 block text-[11px] text-slate-500">{card.sub}</span>
            </div>
          ))}
        </div>
      )}

      {/* MODULE 63: AI VISUAL STORY MODE */}
      {showStoryWidget && storySlides.length > 0 && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl backdrop-blur-md">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-amber-400" />
                AI Visual Story Mode: "The Krishna Delta Stabilization"
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Visual narrative explaining how the AI detected a flash-flood shock, located neighboring surplus, and secured the clinical supply chain.
              </p>
            </div>

            <div className="flex items-center gap-2 mt-3 md:mt-0">
              <button
                onClick={() => setIsStoryPlaying(!isStoryPlaying)}
                className="rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 transition-colors flex items-center gap-1.5"
              >
                {isStoryPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                {isStoryPlaying ? 'Pause Story' : 'Auto-Play Story'}
              </button>
            </div>
          </div>

          {/* Story Slides Progress Navigation */}
          <div className="mt-4 flex items-center gap-2 border-b border-slate-800/80 pb-3 overflow-x-auto">
            {storySlides.map((slide) => (
              <button
                key={slide.step_num}
                onClick={() => {
                  setActiveStoryStep(slide.step_num);
                  setIsStoryPlaying(false);
                }}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all whitespace-nowrap ${
                  activeStoryStep === slide.step_num
                    ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Step {slide.step_num}
              </button>
            ))}
          </div>

          {/* Active Story Slide Card */}
          {(() => {
            const currentSlide = storySlides[activeStoryStep - 1] || storySlides[0];
            return (
              <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/80 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-3 flex-1">
                  <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                    {currentSlide.subtitle}
                  </span>
                  <h3 className="text-xl font-bold text-white">{currentSlide.title}</h3>
                  <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
                    {currentSlide.narrative}
                  </p>
                </div>

                <div className="rounded-2xl border border-amber-900/40 bg-amber-950/20 p-6 text-center min-w-[220px]">
                  <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">Key Telemetry Shock</span>
                  <p className="mt-2 text-xl font-black text-white">{currentSlide.metric_highlight}</p>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* MODULE 64: AI PRESENTATION GENERATOR MODAL */}
      {isPresentationOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-700 bg-slate-950 p-8 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                  AI PRESENTATION GENERATOR
                </span>
                <h2 className="text-xl font-bold text-white mt-1">
                  ArogyaGrid Executive Situation Deck (7 Slides)
                </h2>
              </div>
              <button
                onClick={() => setIsPresentationOpen(false)}
                className="rounded-full bg-slate-800 p-2 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 space-y-6 text-xs">
              {[
                { slide: 1, title: "Executive Overview: Pan-India Health Resilience", bullets: ["National composite index at 82.4/100", "694 Monitored Primary Health Centres with 89.9% medicine availability", "Zero patient PII shared across federated gradient nodes"] },
                { slide: 2, title: "Emerging Risk Horizon: Tier-3 Coastal Monsoon Influx", bullets: ["Torrential 140mm rainfall in Krishna delta", "Oral Rehydration Salts (ORS) depletion projected in 3.2 days", "Hospital bed occupancy elevated to 91% in coastal blocks"] },
                { slide: 3, title: "Supply Chain Choke Points: NH-216 Overtopping", bullets: ["NH-216 coastal highway blocked at Mile 44 (+4.8h delivery latency)", "State Highway 42 detour selected by ILP solver (+2.2h, zero waterlogging risk)", "Suppliers Cipla and Dr. Reddy's operational on secondary corridors"] },
                { slide: 4, title: "Optimal Lateral Redistribution: Guntur to Krishna", bullets: ["Tenali Urban CHC paired with Machilipatnam Coastal PHC", "Transfer of 5,000 ORS units eliminates frontline stockout risk", "Transit underway: Vehicle AP-07-TJ-4428 ETA 11:45 IST"] },
                { slide: 5, title: "Cryptographic Human Governance", bullets: ["Director of Public Health digital approval logged (SHA-256)", "No automated clinical prescriptions executed without physician sign-off", "Immutable audit trail preserved for state legislative committee"] }
              ].map((s) => (
                <div key={s.slide} className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white">Slide {s.slide}: {s.title}</h4>
                    <span className="text-[10px] text-amber-400 font-mono">Executive Brief</span>
                  </div>
                  <ul className="mt-3 space-y-1.5 list-disc pl-5 text-slate-300">
                    {s.bullets.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end gap-3 border-t border-slate-800 pt-4">
              <button
                onClick={() => alert("Deck exported to PDF & CSV formatted SITREP!")}
                className="rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 flex items-center gap-1.5"
              >
                <Download className="h-4 w-4" /> Download Presentation PDF
              </button>
              <button
                onClick={() => setIsPresentationOpen(false)}
                className="rounded-xl bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700"
              >
                Close Deck
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
