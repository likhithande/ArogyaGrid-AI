import React, { useState, useEffect } from 'react';
import { 
  Play, Pause, ChevronLeft, ChevronRight, X, Sparkles, 
  Maximize2, CheckCircle2, Shield, Activity, Globe, Bot
} from 'lucide-react';

interface PresentationModeProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (viewId: string) => void;
}

export const PresentationMode: React.FC<PresentationModeProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isAutoPlay, setIsAutoPlay] = useState<boolean>(true);

  const slides = [
    {
      title: "1. National Health Intelligence Command Center",
      viewId: "dashboard",
      subtitle: "Universal Telemetry Across 694 Primary Health Centres",
      bullets: [
        "Continuous edge streaming of medicine stocks, daily outpatient footfall, and bed occupancy",
        "National Resilience Index aggregated at 82.4/100 with zero patient PII transmitted",
        "Autonomous early-detection flag triggered on District Krishna"
      ]
    },
    {
      title: "2. AI Healthcare Resilience Brain",
      viewId: "resilience-brain",
      subtitle: "Deterministic 6-Stage Cognitive Decision Loop",
      bullets: [
        "LIVE SIGNALS -> AI ANALYSIS -> RISK DETECTION -> FORECAST -> OPTIMIZATION -> RECOMMENDATION",
        "Continuous multi-vector pattern matching linking monsoons to diarrheal surges",
        "Strict Human-in-the-Loop review before operational execution"
      ]
    },
    {
      title: "3. 10 Specialized Autonomous Healthcare Agents",
      viewId: "agents",
      subtitle: "Decentralized Inter-Agent Consensus Synthesis",
      bullets: [
        "Demand Forecaster, Inventory Sentinel, Supply Chain Optimizer, and Emergency Coordinator collaborate live",
        "Pareto-optimal solution formulated in under 3.5 seconds",
        "Verifiable multi-agent chat bus audit trail"
      ]
    },
    {
      title: "4. Systemic Cascade Failure Simulator",
      viewId: "cascade-simulation",
      subtitle: "Multi-Tiered Ripple Impact Propagation",
      bullets: [
        "Warehouse disruption -> District buffer starvation -> PHC saturation",
        "Primary, Secondary, and Tertiary containment triggers modeled",
        "Protects 485,000 vulnerable citizens across downstream delta wards"
      ]
    },
    {
      title: "5. Alternative Route Logistics & Bypass Engine",
      viewId: "suppliers",
      subtitle: "Autonomous Detour Resolution during Highway Blockage",
      bullets: [
        "Monsoon culvert inundation on NH-216 resolved via SH-42 detour (+2.2 hours)",
        "Zero interruption to essential ORS and cold-chain vaccine consignments",
        "Real-time carrier GPS telematics and SLA risk indexing"
      ]
    },
    {
      title: "6. Tactical AI War Room & Emergency Response",
      viewId: "war-room",
      subtitle: "Crisis Command Interface with 5 Tactical Interventions",
      bullets: [
        "Live field radar mapping of surplus depots and vulnerable health clinics",
        "One-click pre-authorized dispatch of emergency buffer quotas",
        "Seamless transition from Emergency Response Mode into System Recovery Mode"
      ]
    },
    {
      title: "7. Differential Privacy Federated Learning",
      viewId: "federated-learning",
      subtitle: "DP-SGD FedAvg Core Architecture",
      bullets: [
        "Patient records stay 100% strictly local at edge PHC facilities",
        "Only noise-clipped gradient updates (&epsilon;=1.2) synchronized to Central Hub",
        "Model accuracy elevated to 94.6% across 1,248 simulated edge nodes"
      ]
    }
  ];

  useEffect(() => {
    let timer: any;
    if (isOpen && isAutoPlay) {
      timer = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % slides.length);
      }, 5000);
    }
    return () => clearInterval(timer);
  }, [isOpen, isAutoPlay, slides.length]);

  useEffect(() => {
    if (isOpen) {
      onNavigate(slides[currentSlide].viewId);
    }
  }, [currentSlide, isOpen]);

  if (!isOpen) return null;

  const slide = slides[currentSlide];

  return (
    <div className="fixed inset-x-0 bottom-6 z-50 flex justify-center px-4 animate-fadeIn pointer-events-none">
      <div className="w-full max-w-4xl bg-slate-950/95 backdrop-blur-xl border border-cyan-500/40 rounded-2xl shadow-2xl p-5 pointer-events-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Slide Info */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
              JUDGE TOUR SLIDE {currentSlide + 1} OF {slides.length}
            </span>
            <span className="text-xs text-slate-400 font-medium">{slide.subtitle}</span>
          </div>
          <h3 className="text-base font-bold text-white tracking-tight">{slide.title}</h3>
          <p className="text-xs text-slate-300 line-clamp-1">{slide.bullets[0]}</p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Previous Slide"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsAutoPlay(!isAutoPlay)}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              isAutoPlay ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30' : 'bg-slate-800 text-slate-300'
            }`}
          >
            {isAutoPlay ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isAutoPlay ? 'Auto-Advancing' : 'Paused'}
          </button>

          <button
            onClick={() => setCurrentSlide(prev => (prev + 1) % slides.length)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Next Slide"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 transition-colors ml-2"
            title="Exit Presentation Mode"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
