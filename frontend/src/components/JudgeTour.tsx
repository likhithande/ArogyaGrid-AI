import React from 'react';
import {
  Award, ArrowRight, ArrowLeft, CheckCircle2, Play, Sparkles,
  X, ExternalLink
} from 'lucide-react';

interface JudgeTourProps {
  currentStep: number;
  onNextStep: () => void;
  onPrevStep: () => void;
  onCloseTour: () => void;
  onJumpToStep: (step: number) => void;
  onTriggerStepAction: () => void;
}

export const JudgeTour: React.FC<JudgeTourProps> = ({
  currentStep,
  onNextStep,
  onPrevStep,
  onCloseTour,
  onJumpToStep,
  onTriggerStepAction
}) => {
  const steps = [
    {
      step: 1,
      title: "1. National Command Center",
      targetView: "overview",
      description: "Real-time visibility across 694 PHCs in 51 districts and 8 states. Monitor live bed occupancy (69.4%), doctor attendance (92.8%), and composite Resilience Index (82.4/100).",
      actionLabel: "Inspect Command KPIs",
      tip: "Notice the animated LIVE heartbeat pulse in the top navigation and synthetic telemetry."
    },
    {
      step: 2,
      title: "2. Detect Emerging Shortage",
      targetView: "stockout",
      description: "Mathematical prediction of stock depletion: Oral Rehydration Salts (ORS) will exhaust in 3.2 days in District Krishna due to inundation diarrheal spike.",
      actionLabel: "Filter Critical Shortages",
      tip: "The table dynamically computes: Current Stock / Daily Consumption adjusted for 5-day supplier lead time."
    },
    {
      step: 3,
      title: "3. AI Explains Why (Root Cause Analysis)",
      targetView: "root-cause",
      description: "Explainable AI factor breakdown: +34.5% acute monsoon diarrheal OPD influx, +2.4d delivery delay due to NH-216 culvert submergence, and sub-district inventory skew.",
      actionLabel: "Inspect Causal Chain",
      tip: "Explore the 'Why is this happening?' graph and counterfactual what-if simulations."
    },
    {
      step: 4,
      title: "4. Open Affected PHC (Geospatial Drill-Down)",
      targetView: "map",
      description: "Seamless spatial drill-down from India -> Andhra Pradesh -> District Krishna -> Machilipatnam Coastal PHC. Shows flood-impacted clusters and hospital bed deficits.",
      actionLabel: "Inspect Coastal PHC",
      tip: "Click on any district marker or pill to open the deep infrastructure diagnostic drawer."
    },
    {
      step: 5,
      title: "5. Show Demand Forecast (7-Day Horizon)",
      targetView: "forecast",
      description: "Multi-horizon vector forecasting with 95% confidence intervals and feature attributions for 104 NLEM essential medicines.",
      actionLabel: "Switch Horizon to 7 Days",
      tip: "Notice the upper and lower confidence bands demonstrating quantified prediction uncertainty."
    },
    {
      step: 6,
      title: "6. Show Supply-Chain Graph & Route Intelligence",
      targetView: "supply-chain",
      description: "Network topology showing Central Warehouses, State Depots, and PHCs. Identifies vulnerable highway choke point along NH-216 and SH-42 detour bypass.",
      actionLabel: "Inspect Logistics Corridors",
      tip: "Edges display transit duration and flood vulnerability in real time."
    },
    {
      step: 7,
      title: "7. Generate Redistribution Recommendation",
      targetView: "redistribution",
      description: "AI detects District Krishna has a 2.8-day deficit, while neighboring Guntur holds 18.4 days of excess stock. Recommends lateral transfer of 800 ORS units via SH-42.",
      actionLabel: "Approve 800-Unit Transfer",
      tip: "Click 'Approve Transfer' to test the real-time workflow, state change, and audit trail generation!"
    },
    {
      step: 8,
      title: "8. Run 40% Demand Surge Simulation",
      targetView: "simulation",
      description: "Run 'What-If' shocks: What happens if patient footfall increases +40% while supply drops 20%? See before vs after metrics instantly.",
      actionLabel: "Simulate +40% Surge",
      tip: "Adjust sliders to see immediate impact on stockouts, ICU beds, and doctor workload index."
    },
    {
      step: 9,
      title: "9. Activate Emergency Mode & Tactical AI War Room",
      targetView: "war-room",
      description: "Futuristic tactical Command Room with 5 AI Interventions: lateral medicine transfers, auxiliary beds, route detours, and roster deployments with Human-in-the-Loop approval.",
      actionLabel: "Authorize War Room Action",
      tip: "Emergency mode triggers high-alert visual beacons and prioritizes rapid logistical waybills."
    },
    {
      step: 10,
      title: "10. Show Federated Learning Architecture",
      targetView: "federated",
      description: "1,248 PHC edge nodes train local models on local records. Zero patient PII leaves the clinic—only differential privacy gradient tensors are aggregated centrally.",
      actionLabel: "Trigger Aggregation Round",
      tip: "Watch the accuracy progression reach 95.1% with epsilon = 1.25 privacy guarantee."
    },
    {
      step: 11,
      title: "11. Ask Arogya Copilot a Question",
      targetView: "copilot",
      description: "Ask natural-language queries in English, Hindi, or Telugu (e.g. 'What if demand surges 50% in District Krishna?' or 'Which facilities need beds?').",
      actionLabel: "Ask Copilot Query",
      tip: "Supports voice input and returns structured metric cards, charts, and actionable buttons."
    },
    {
      step: 12,
      title: "12. Generate AI Situation Report (SITREP)",
      targetView: "reports",
      description: "One-click generation of a comprehensive, publishable National Health Resilience Situation Report. Ready to export to PDF, CSV, or JSON.",
      actionLabel: "Generate Official SITREP",
      tip: "Certified by ArogyaGrid AI for national, state, and district health leadership."
    }
  ];

  const current = steps[currentStep - 1] || steps[0];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-2xl rounded-2xl bg-slate-900/95 border border-amber-500/50 p-4 shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/40">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-amber-400">
                JUDGE DEMO TOUR
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                Step {currentStep} of {steps.length}
              </span>
            </div>
            <h4 className="text-sm font-bold text-white tracking-tight">{current.title}</h4>
          </div>
        </div>

        <button
          onClick={onCloseTour}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          title="Exit Tour"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Description & Action */}
      <div className="py-2.5">
        <p className="text-xs text-slate-300 leading-relaxed">{current.description}</p>
        <div className="mt-2 text-[11px] text-cyan-300/90 font-mono bg-cyan-950/40 px-2.5 py-1.5 rounded-lg border border-cyan-800/40 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
          <span>{current.tip}</span>
        </div>
      </div>

      {/* Step Indicators & Navigation Buttons */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-800 gap-2">
        <div className="flex items-center gap-1 overflow-x-auto max-w-[200px] sm:max-w-xs py-1">
          {steps.map((s) => (
            <button
              key={s.step}
              onClick={() => onJumpToStep(s.step)}
              className={`w-5 h-5 rounded-full text-[10px] font-mono flex items-center justify-center transition-all ${
                s.step === currentStep
                  ? 'bg-amber-400 text-slate-950 font-bold scale-110 shadow-sm shadow-amber-400/50'
                  : s.step < currentStep
                  ? 'bg-emerald-900/60 text-emerald-400 border border-emerald-700/60'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {s.step < currentStep ? '✓' : s.step}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {/* Action button for current step */}
          <button
            onClick={onTriggerStepAction}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md shadow-cyan-600/30 transition-all cursor-pointer"
          >
            <Play className="w-3 h-3 fill-current" />
            <span className="hidden sm:inline">{current.actionLabel}</span>
            <span className="sm:hidden">Execute</span>
          </button>

          {/* Previous Step */}
          <button
            disabled={currentStep === 1}
            onClick={onPrevStep}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>

          {/* Next Step */}
          <button
            disabled={currentStep === steps.length}
            onClick={onNextStep}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <span>{currentStep === steps.length ? 'Finish' : 'Next Step'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
