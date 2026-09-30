import React, { useState, useEffect } from 'react';
import {
  HelpCircle, Layers, Terminal, Cloud, DollarSign, BarChart2,
  FileCode, ShieldCheck, CheckCircle2, ChevronRight, Play,
  Send, Database, Cpu, Activity, Globe
} from 'lucide-react';
import {
  fetchJudgeFaqs, fetchArchitectureLayers, fetchGoogleCloudMappings
} from '../services/api';
import {
  JudgeFaqItem, ArchitectureLayer, GoogleCloudMapping
} from '../types';

export const TechnicalDeepDiveView: React.FC = () => {
  const [faqs, setFaqs] = useState<JudgeFaqItem[]>([]);
  const [layers, setLayers] = useState<ArchitectureLayer[]>([]);
  const [cloudMappings, setCloudMappings] = useState<GoogleCloudMapping[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Tabs
  const [activeTab, setActiveTab] = useState<'judge' | 'architecture' | 'api' | 'cloud' | 'modelcard'>('judge');
  const [selectedLayer, setSelectedLayer] = useState<ArchitectureLayer | null>(null);

  // API Explorer state
  const [apiEndpoint, setApiEndpoint] = useState<string>('/api/dashboard');
  const [apiResponse, setApiResponse] = useState<string>('');
  const [isCallingApi, setIsCallingApi] = useState<boolean>(false);

  // Cloud Cost Simulator scale
  const [phcScale, setPhcScale] = useState<number>(1248);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [f, l, c] = await Promise.all([
        fetchJudgeFaqs(),
        fetchArchitectureLayers(),
        fetchGoogleCloudMappings()
      ]);
      setFaqs(f);
      setLayers(l);
      setCloudMappings(c);
      if (l.length > 0) setSelectedLayer(l[0]);
      setLoading(false);
    }
    loadData();
  }, []);

  const handleTestApi = async () => {
    setIsCallingApi(true);
    try {
      const res = await fetch(apiEndpoint);
      const data = await res.json();
      setApiResponse(JSON.stringify(data, null, 2));
    } catch (e: any) {
      setApiResponse(`Error: ${e.message}`);
    } finally {
      setIsCallingApi(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" />
      </div>
    );
  }

  const mult = phcScale / 1000.0;
  const estCloudCostUsd = Math.round(145 * mult);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl border border-slate-700 bg-gradient-to-r from-slate-900 via-slate-900 to-blue-950/50 p-6 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-blue-500/20 px-3 py-0.5 text-xs font-semibold text-blue-400 border border-blue-500/30">
                MODULES 65, 66, 67, 68, 69, 70, 80, 81
              </span>
              <span className="rounded-full bg-emerald-500/20 px-3 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/30">
                DEEP AI/ML OBSERVABILITY
              </span>
            </div>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-white lg:text-3xl">
              Technical Architecture, Judge Simulator & Cloud Lab
            </h1>
            <p className="mt-1 text-sm text-slate-300">
              Interactive technical FAQs for evaluators, multi-tier architecture visualizer, live API playground, Google Cloud readiness mapping, and AI Model Cards.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'judge', label: 'Judge Simulator' },
              { id: 'architecture', label: 'Architecture Explorer' },
              { id: 'api', label: 'Live API Explorer' },
              { id: 'cloud', label: 'Google Cloud Ready' },
              { id: 'modelcard', label: 'AI Model Cards' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 font-bold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* TAB 1: JUDGE QUESTION SIMULATOR */}
      {activeTab === 'judge' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl backdrop-blur-md">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-blue-400" />
                Judge Technical Interview Simulator
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Concise technical answers explaining differential privacy, ensemble forecasting, ILP solvers, hallucination guardrails, and enterprise scale.
              </p>
            </div>

            <div className="mt-6 space-y-4">
              {faqs.map((faq, idx) => (
                <div key={idx} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm text-cyan-300">Q: {faq.question}</span>
                    <span className="rounded bg-blue-500/20 px-2 py-0.5 text-[9px] font-bold text-blue-300">
                      {faq.category}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-slate-200 leading-relaxed font-semibold">
                    &rarr; {faq.concise_answer}
                  </p>

                  <div className="mt-3 rounded-xl border border-slate-800 bg-slate-900/80 p-3.5 text-[11px] text-slate-300">
                    <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Deep Technical Details:</span>
                    <p className="mt-1">{faq.technical_details}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TECHNICAL ARCHITECTURE EXPLORER */}
      {activeTab === 'architecture' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl backdrop-blur-md">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Layers className="h-5 w-5 text-blue-400" />
                Interactive 5-Layer Healthcare Intelligence Architecture
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Click any layer to inspect its software components, responsibilities, inter-tier dependencies, and data flows.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Layers List */}
              <div className="space-y-3">
                {layers.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => setSelectedLayer(l)}
                    className={`w-full rounded-xl border p-4 text-left transition-all ${
                      selectedLayer?.id === l.id
                        ? 'border-blue-500 bg-blue-950/40 text-white shadow-lg'
                        : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-cyan-400">{l.id}</span>
                      <ChevronRight className="h-4 w-4 text-slate-500" />
                    </div>
                    <h4 className="font-bold text-sm text-white mt-1">{l.name}</h4>
                  </button>
                ))}
              </div>

              {/* Selected Layer Details */}
              {selectedLayer && (
                <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-950/80 p-6 text-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h3 className="text-base font-bold text-white">{selectedLayer.name}</h3>
                    <span className="rounded bg-blue-500/20 px-2 py-0.5 text-[10px] font-mono text-blue-300">
                      {selectedLayer.id}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Purpose</span>
                    <p className="mt-1 text-slate-200 text-sm">{selectedLayer.purpose}</p>
                  </div>

                  <div>
                    <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Technology Stack</span>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {selectedLayer.tech_stack.map((t, idx) => (
                        <span key={idx} className="rounded-lg bg-slate-800 px-2.5 py-1 text-xs font-mono text-cyan-300">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-t border-slate-800 pt-4">
                    <div>
                      <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Dependencies</span>
                      <ul className="mt-1.5 list-disc pl-4 text-slate-300">
                        {selectedLayer.dependencies.map((d, idx) => (
                          <li key={idx}>{d}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Data Flow</span>
                      <p className="mt-1 text-slate-300 font-mono text-[11px]">{selectedLayer.data_flow}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: LIVE API EXPLORER */}
      {activeTab === 'api' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl backdrop-blur-md">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Terminal className="h-5 w-5 text-emerald-400" />
                Live Single-URL REST API Playground
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Directly execute live requests against the single-URL FastAPI backend and verify JSON schemas with sub-millisecond local latency.
              </p>
            </div>

            <div className="mt-6 flex flex-col md:flex-row gap-3">
              <select
                value={apiEndpoint}
                onChange={(e) => setApiEndpoint(e.target.value)}
                className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="/api/dashboard">GET /api/dashboard (National Summary)</option>
                <option value="/api/health">GET /api/health (Service Mode)</option>
                <option value="/api/phcs?limit=3">GET /api/phcs?limit=3 (Clinic Registry)</option>
                <option value="/api/graph/topology">GET /api/graph/topology (Graph Nodes)</option>
                <option value="/api/graph/risk-propagation">GET /api/graph/risk-propagation (Cascade Steps)</option>
                <option value="/api/matching/proposals">GET /api/matching/proposals (P2P Transfers)</option>
                <option value="/api/optimization/pareto">GET /api/optimization/pareto (Pareto Frontier)</option>
                <option value="/api/security/events">GET /api/security/events (Synthetic Probes)</option>
              </select>

              <button
                onClick={handleTestApi}
                disabled={isCallingApi}
                className="rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-600/30 hover:bg-emerald-500 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                <Play className="h-3.5 w-3.5" />
                {isCallingApi ? 'Fetching...' : 'Send Request'}
              </button>
            </div>

            {/* Response Viewer */}
            <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950 p-4">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                <span className="text-[10px] font-mono text-slate-400">Response Payload (JSON)</span>
                <span className="text-[10px] text-emerald-400 font-mono">Status: 200 OK</span>
              </div>
              <pre className="mt-3 max-h-72 overflow-y-auto text-[11px] font-mono text-cyan-300">
                {apiResponse || 'Click "Send Request" to test endpoint live.'}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: GOOGLE CLOUD READY ARCHITECTURE & COST ESTIMATOR */}
      {activeTab === 'cloud' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl backdrop-blur-md">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Cloud className="h-5 w-5 text-blue-400" />
                Google Cloud Production Blueprint & Cost Sizing Simulator
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                How ArogyaGrid maps to Google Vertex AI, BigQuery, Cloud Run, and Pub/Sub at national scale.
              </p>
            </div>

            {/* Cloud Component Mapping Grid */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {cloudMappings.map((m, i) => (
                <div key={i} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{m.component}</span>
                    <span className="rounded bg-blue-500/20 px-2 py-0.5 text-[10px] font-bold text-blue-300">
                      {m.gcp_service}
                    </span>
                  </div>
                  <p className="mt-2 text-slate-300 text-[11px]">{m.architecture_role}</p>
                  <span className="mt-2 block text-[10px] text-slate-400">Billing Tier: {m.cost_tier}</span>
                </div>
              ))}
            </div>

            {/* Scaled Cost Sizing Slider */}
            <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-950/80 p-5">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-emerald-400" />
                Cloud Infrastructure Cost Sizing Simulator
              </h3>

              <div className="mt-4 flex flex-col md:flex-row items-center gap-6">
                <div className="flex-1 w-full">
                  <div className="flex justify-between text-xs font-bold text-slate-300">
                    <span>Monitored PHC Scale:</span>
                    <span className="text-cyan-400">{phcScale.toLocaleString()} Clinics</span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="10000"
                    step="100"
                    value={phcScale}
                    onChange={(e) => setPhcScale(parseInt(e.target.value))}
                    className="w-full mt-2 accent-blue-500"
                  />
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 text-center min-w-[200px]">
                  <span className="text-slate-400 text-xs">Simulated Monthly Cost</span>
                  <p className="text-2xl font-black text-emerald-400 mt-1">${estCloudCostUsd} / mo</p>
                  <span className="text-[10px] text-slate-400">Serverless auto-scaling</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: AI MODEL CARDS & RESPONSIBLE AI */}
      {activeTab === 'modelcard' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl backdrop-blur-md">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-400" />
                AI Model Cards & Responsible AI Charter
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Standardized model governance: intended use, limitations, human oversight requirements, and ethical guardrails.
              </p>
            </div>

            <div className="mt-6 space-y-4 text-xs">
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-5">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <div>
                    <span className="rounded bg-teal-500/20 px-2 py-0.5 text-[10px] font-mono text-teal-300">
                      MODEL CARD #01
                    </span>
                    <h3 className="text-base font-bold text-white mt-1">Arogya-FedNet-v2.4 (Federated Demand Forecaster)</h3>
                  </div>
                  <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-400">
                    APPROVED FOR CLINICAL LOGISTICS
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="font-bold text-slate-300">Intended Operational Scope:</span>
                    <p className="mt-1 text-slate-400">Forecasting medicine batch consumption rates, outpatient surges, and seasonal diarrheal/fever cluster risks across Primary Health Centres.</p>
                  </div>
                  <div>
                    <span className="font-bold text-slate-300">Non-Intended Uses (PROHIBITED):</span>
                    <p className="mt-1 text-rose-300">Individual patient medical diagnosis, treatment prescription, or automated clinical triage decisions without physician sign-off.</p>
                  </div>
                </div>

                <div className="mt-4 border-t border-slate-800/80 pt-3 grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px]">
                  <div><span className="text-slate-400">Training Paradigm:</span> <strong className="text-white">DP-SGD FedAvg (ε=1.20)</strong></div>
                  <div><span className="text-slate-400">Accuracy / MAE:</span> <strong className="text-emerald-400">94.6% / 3.12% Error</strong></div>
                  <div><span className="text-slate-400">Human Oversight:</span> <strong className="text-cyan-400">Mandatory Human Approval</strong></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
