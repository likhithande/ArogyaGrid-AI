import React, { useState, useEffect } from 'react';
import { 
  Server, Shield, Scale, Cpu, Activity, CheckCircle2, 
  Layers, Lock, Database, Sparkles, TrendingUp, AlertTriangle
} from 'lucide-react';
import { fetchScalabilityMetrics } from '../services/api';
import { ScalabilityMetrics } from '../types';

export const ScalabilityAndEthicsView: React.FC = () => {
  const [scale, setScale] = useState<number>(1248);
  const [metrics, setMetrics] = useState<ScalabilityMetrics | null>(null);
  const [activeTab, setActiveTab] = useState<'SCALABILITY' | 'ETHICS' | 'SYSTEM_HEALTH' | 'FUTURE_VISION'>('SCALABILITY');

  useEffect(() => {
    loadScale(scale);
  }, [scale]);

  const loadScale = async (phcCount: number) => {
    const data = await fetchScalabilityMetrics(phcCount);
    setMetrics(data);
  };

  const systemServices = [
    { name: 'FastAPI Telemetry REST Gateway', status: 'OPERATIONAL', latency: '12ms', uptime: '99.98%' },
    { name: 'PostgreSQL & TimescaleDB Sensor Engine', status: 'OPERATIONAL', latency: '4ms', uptime: '99.99%' },
    { name: 'WebSocket Real-Time Broadcast Mesh', status: 'OPERATIONAL', latency: '2ms', uptime: '99.95%' },
    { name: 'Differential Privacy FedAvg Engine', status: 'OPERATIONAL', latency: '45ms', uptime: '99.91%' },
    { name: 'ILP Transshipment Solver Worker', status: 'OPERATIONAL', latency: '28ms', uptime: '99.90%' },
    { name: 'Multilingual Speech Copilot Model', status: 'OPERATIONAL', latency: '65ms', uptime: '99.88%' },
  ];

  const roadmapPhases = [
    { phase: 'PHASE 1', title: 'Real-Time Telemetry & Monitoring', desc: 'Universal IoT cold-chain and biometric stock tracking across all 694 clinics.', status: 'DEPLOYED' },
    { phase: 'PHASE 2', title: 'Predictive Multi-Horizon Forecasting', desc: 'Epidemiological demand and stock-out depletion classification.', status: 'DEPLOYED' },
    { phase: 'PHASE 3', title: 'Multi-Agent Digital Twin Simulation', desc: 'Arterial road disruptions, flood inundation, and cascade failure modeling.', status: 'DEPLOYED' },
    { phase: 'PHASE 4', title: 'Pareto-Optimal Resource Optimization', desc: 'Integer linear programming lateral redistribution & smart procurement EOQ.', status: 'ACTIVE TESTING' },
    { phase: 'PHASE 5', title: 'Decentralized Federated Intelligence', desc: 'Privacy-preserving edge learning keeping patient health data local.', status: 'ACTIVE TESTING' },
    { phase: 'PHASE 6', title: 'Autonomous Decision Support Operating System', desc: 'Self-healing national healthcare supply network with human oversight.', status: 'PLANNED ROADMAP' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl border border-indigo-500/20 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 text-white animate-pulse">
            <Scale className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white tracking-tight">Enterprise Scalability, Governance & System Health</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                NATIONAL PRODUCTION ARCHITECTURE
              </span>
            </div>
            <p className="text-slate-400 text-sm mt-1">
              National-scale throughput stress tests (up to 10,000+ PHCs), AI ethics principles, and 24/7 service uptime observatory
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 bg-slate-800/80 border border-slate-700/60 rounded-xl overflow-x-auto">
          <button
            onClick={() => setActiveTab('SCALABILITY')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'SCALABILITY' ? 'bg-indigo-500 text-white font-bold shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Scale Simulator
          </button>
          <button
            onClick={() => setActiveTab('ETHICS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'ETHICS' ? 'bg-indigo-500 text-white font-bold shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            AI Ethics & Governance
          </button>
          <button
            onClick={() => setActiveTab('SYSTEM_HEALTH')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'SYSTEM_HEALTH' ? 'bg-indigo-500 text-white font-bold shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            System Health (Ops)
          </button>
          <button
            onClick={() => setActiveTab('FUTURE_VISION')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'FUTURE_VISION' ? 'bg-indigo-500 text-white font-bold shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Vision & Impact
          </button>
        </div>
      </div>

      {/* Tab: Scalability Simulator (Module 61) */}
      {activeTab === 'SCALABILITY' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-800 shadow-xl space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Server className="w-5 h-5 text-indigo-400" />
                  National Healthcare Scale Simulator
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Simulate computing load, edge ingestion, and distributed AI jobs at varying national network sizes
                </p>
              </div>

              {/* PHC Scale Buttons */}
              <div className="flex items-center gap-2">
                {[100, 500, 1248, 5000, 10000].map(s => (
                  <button
                    key={s}
                    onClick={() => setScale(s)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                      scale === s 
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' 
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    {s >= 1000 ? `${s / 1000}k PHCs` : `${s} PHCs`}
                  </button>
                ))}
              </div>
            </div>

            {metrics && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 font-mono">
                  <span className="text-[10px] text-slate-400 uppercase block font-sans">Daily Telemetry Packets</span>
                  <strong className="text-2xl text-cyan-400 block mt-1">{metrics.daily_telemetry_events.toLocaleString()}</strong>
                  <span className="text-[10px] text-slate-500 font-sans">Continuous Edge Streaming</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 font-mono">
                  <span className="text-[10px] text-slate-400 uppercase block font-sans">Data Ingestion Rate</span>
                  <strong className="text-2xl text-indigo-400 block mt-1">{metrics.data_throughput_gb_day} GB/day</strong>
                  <span className="text-[10px] text-slate-500 font-sans">Real-time parquet telemetry</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 font-mono">
                  <span className="text-[10px] text-slate-400 uppercase block font-sans">AI Inference Invocations</span>
                  <strong className="text-2xl text-purple-400 block mt-1">{metrics.ai_inference_calls_daily.toLocaleString()}</strong>
                  <span className="text-[10px] text-slate-500 font-sans">Daily demand & stockout models</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 font-mono">
                  <span className="text-[10px] text-slate-400 uppercase block font-sans">Edge Model Latency</span>
                  <strong className="text-2xl text-emerald-400 block mt-1">{metrics.simulated_sub_seconds_latency_ms} ms</strong>
                  <span className="text-[10px] text-emerald-400/80 font-sans">Sub-second responsive</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab: AI Ethics & Governance (Module 62) */}
      {activeTab === 'ETHICS' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">No Autonomous Clinical Decisions</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              ArogyaGrid AI operates exclusively as a supply-chain, operational logistics, and resource resilience intelligence system. It does NOT diagnose patients, prescribe treatments, or override medical doctors.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Strict Human-In-The-Loop Sign-off</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              No physical trucks are dispatched, no purchase orders are billed, and no beds are re-allocated without affirmative cryptographic approval from District Health Officers or Emergency Incident Commanders.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Synthetic Benchmark Data</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              All hackathon demonstration datasets utilize realistic synthetic public healthcare schemas modeled from NLEM 2022 guidelines and NHM district templates. Zero real patient PII is stored or transmitted.
            </p>
          </div>
        </div>
      )}

      {/* Tab: System Health Center (Module 60) */}
      {activeTab === 'SYSTEM_HEALTH' && (
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-400" />
              Technical Core Health & Microservice SLA Telemetry
            </h2>
            <span className="text-xs font-mono text-emerald-400">All Microservices 100% Operational</span>
          </div>

          <div className="space-y-3">
            {systemServices.map((srv, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">{srv.name}</h4>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-0.5">
                    <span>Latency: <strong className="text-slate-200 font-mono">{srv.latency}</strong></span>
                    <span>Uptime SLA: <strong className="text-emerald-400 font-mono">{srv.uptime}</strong></span>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {srv.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Future Vision Roadmap & Simulated Impact (Module 56 & 57) */}
      {activeTab === 'FUTURE_VISION' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              National Health Intelligence Roadmap (Phases 1 to 6)
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {roadmapPhases.map((ph, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-indigo-400 font-mono">{ph.phase}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      ph.status === 'DEPLOYED' ? 'bg-emerald-500/20 text-emerald-300' :
                      ph.status === 'ACTIVE TESTING' ? 'bg-cyan-500/20 text-cyan-300' :
                      'bg-slate-700 text-slate-400'
                    }`}>
                      {ph.status}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white">{ph.title}</h4>
                  <p className="text-xs text-slate-400">{ph.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-500 italic">
            * Disclaimer: Prototype simulation based on synthetic data. Never present simulated metrics as real-world achieved healthcare outcomes.
          </div>
        </div>
      )}
    </div>
  );
};
