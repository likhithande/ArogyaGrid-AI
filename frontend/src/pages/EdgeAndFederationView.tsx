import React, { useState, useEffect } from 'react';
import {
  Cpu, Wifi, WifiOff, RefreshCw, GitBranch, Shield, Zap,
  TrendingDown, CheckCircle2, AlertCircle, Play, BarChart2,
  Server, HardDrive, ArrowDownRight, Layers, Sliders
} from 'lucide-react';
import {
  fetchEdgeNodes, fetchChampionChallengers, fetchContinuousLearningStages
} from '../services/api';
import {
  EdgeNodeInfo, ChampionChallengerModel, ContinuousLearningStage
} from '../types';

export const EdgeAndFederationView: React.FC = () => {
  const [edgeNodes, setEdgeNodes] = useState<EdgeNodeInfo[]>([]);
  const [championModels, setChampionModels] = useState<ChampionChallengerModel[]>([]);
  const [learningStages, setLearningStages] = useState<ContinuousLearningStage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'edge' | 'offline' | 'personalization' | 'champion' | 'pipeline'>('edge');

  // Offline simulation state for Avanigadda Riverine PHC
  const [offlineSimState, setOfflineSimState] = useState<'LOCAL_MODE' | 'SYNCING' | 'SYNC_COMPLETE'>('LOCAL_MODE');
  const [pendingLocalUpdates, setPendingLocalUpdates] = useState<number>(14);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [e, c, l] = await Promise.all([
        fetchEdgeNodes(),
        fetchChampionChallengers(),
        fetchContinuousLearningStages()
      ]);
      setEdgeNodes(e);
      setChampionModels(c);
      setLearningStages(l);
      setLoading(false);
    }
    loadData();
  }, []);

  const handleSimulateSync = () => {
    setOfflineSimState('SYNCING');
    setTimeout(() => {
      setOfflineSimState('SYNC_COMPLETE');
      setPendingLocalUpdates(0);
    }, 2000);
  };

  const handleResetOffline = () => {
    setOfflineSimState('LOCAL_MODE');
    setPendingLocalUpdates(14);
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl border border-teal-800/40 bg-gradient-to-r from-slate-900 via-slate-900 to-teal-950/50 p-6 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-teal-500/20 px-3 py-0.5 text-xs font-semibold text-teal-400 border border-teal-500/30">
                MODULES 10, 11, 12, 13, 14, 15
              </span>
              <span className="rounded-full bg-emerald-500/20 px-3 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/30">
                EDGE AI MESH OPERATIONAL
              </span>
            </div>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-white lg:text-3xl">
              Edge AI Mesh, Offline-First Sync & Model Personalization
            </h1>
            <p className="mt-1 text-sm text-slate-300">
              Decentralized edge intelligence across 1,248 PHC clinics, offline reconciliation with conflict handling, personalized model adaptation hierarchy, and Champion/Challenger model evaluation.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'edge', label: 'Edge AI Mesh' },
              { id: 'offline', label: 'Offline-First PHC' },
              { id: 'personalization', label: 'Hierarchical Personalization' },
              { id: 'champion', label: 'Champion / Challenger' },
              { id: 'pipeline', label: 'Continuous Learning' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-teal-500 text-slate-950 shadow-lg shadow-teal-500/25 font-bold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* TAB 1: EDGE AI MESH */}
      {activeTab === 'edge' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Cpu className="h-5 w-5 text-teal-400" />
                  Edge AI Node Observability Center
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Edge nodes perform local clinic-level inference on patient EHRs. Only differential-privacy gradient tensors are synced to the central aggregator.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  1,248 Nodes Monitored
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {edgeNodes.map((node) => (
                <div key={node.id} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-cyan-300 font-bold">{node.id}</span>
                    <span className={`flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-bold ${
                      node.is_online ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                    }`}>
                      {node.is_online ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
                      {node.is_online ? 'ONLINE' : 'OFFLINE'}
                    </span>
                  </div>

                  <h4 className="mt-2 text-sm font-bold text-white line-clamp-1">{node.phc_name}</h4>
                  <span className="text-[11px] text-slate-400">{node.district} District</span>

                  <div className="mt-3 space-y-1 text-slate-300 text-[11px] border-t border-slate-800/80 pt-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Local Inferences:</span>
                      <span className="font-bold text-white">{node.local_inference_count.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Model Version:</span>
                      <span className="font-mono text-teal-300">{node.model_version}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Last Sync:</span>
                      <span className="text-slate-300">{node.last_sync}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: OFFLINE-FIRST PHC SIMULATOR */}
      {activeTab === 'offline' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl backdrop-blur-md">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <WifiOff className="h-5 w-5 text-amber-400" />
                  Offline-First Clinic Simulator & Conflict Handling
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Simulates rural clinics with intermittent 2G/solar connectivity. Data is securely queued on local SQLite edge storage and synced with vector conflict resolution upon reconnect.
                </p>
              </div>

              <div className="flex items-center gap-2 mt-3 md:mt-0">
                <button
                  onClick={handleSimulateSync}
                  disabled={offlineSimState === 'SYNCING'}
                  className="rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-teal-600/30 hover:bg-teal-500 disabled:opacity-50"
                >
                  {offlineSimState === 'SYNCING' ? 'Reconnecting & Syncing...' : 'Restore Connectivity & Sync'}
                </button>
                <button
                  onClick={handleResetOffline}
                  className="rounded-xl bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700"
                >
                  Simulate Outage
                </button>
              </div>
            </div>

            {/* Offline Simulation Card */}
            <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/80 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="rounded bg-teal-500/20 px-2 py-0.5 text-[10px] font-mono text-teal-300">
                    TEST NODE: Avanigadda Riverine PHC (Delta Island)
                  </span>
                  <h3 className="mt-2 text-lg font-bold text-white">Local Edge Intelligence Status</h3>
                </div>

                <div className={`rounded-xl px-4 py-2 border font-bold text-xs ${
                  offlineSimState === 'LOCAL_MODE' ? 'border-amber-500/50 bg-amber-950/30 text-amber-400' :
                  offlineSimState === 'SYNCING' ? 'border-cyan-500/50 bg-cyan-950/30 text-cyan-400 animate-pulse' :
                  'border-emerald-500/50 bg-emerald-950/30 text-emerald-400'
                }`}>
                  STATUS: {offlineSimState}
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                  <span className="text-slate-400">Offline Queue</span>
                  <p className="mt-1 text-2xl font-black text-amber-400">{pendingLocalUpdates}</p>
                  <span className="text-[11px] text-slate-400">Transactions queued locally</span>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                  <span className="text-slate-400">Conflict Handling Strategy</span>
                  <p className="mt-1 text-sm font-bold text-white">CRDT Vector Clocks + Deterministic Audit</p>
                  <span className="text-[11px] text-slate-400">Last-write-wins with physical stock audit lock</span>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                  <span className="text-slate-400">Offline Clinical AI</span>
                  <p className="mt-1 text-sm font-bold text-emerald-400">Active (TensorFlow Lite)</p>
                  <span className="text-[11px] text-slate-400">Local stockout forecast running without cloud</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: HIERARCHICAL PERSONALIZATION */}
      {activeTab === 'personalization' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl backdrop-blur-md">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Layers className="h-5 w-5 text-teal-400" />
                Hierarchical Model Federation & Local Adaptation
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Allows local edge models to fine-tune to localized consumption dynamics (e.g., coastal flood diarrheal patterns) while retaining global robustness from the central federated foundation.
              </p>
            </div>

            <div className="mt-6 space-y-4">
              {[
                { level: "Level 1: Global Foundation Model", model: "Arogya-FedNet-Global-v2.4", scope: "Pan-India 1,248 Nodes", description: "Aggregates macro national seasonal trends, baseline consumption velocities, and differential-privacy gradient weights.", accuracy: "94.6%", badge: "Global Model" },
                { level: "Level 2: State-Level Adaptation", model: "Arogya-State-AP-Monsoon-v2", scope: "Andhra Pradesh State Health Grid", description: "Adapts to Andhra Pradesh coastal delta climate, specific state NLEM procurement formulas, and coastal flood cycles.", accuracy: "96.1%", badge: "State Adaptation" },
                { level: "Level 3: District Specialization", model: "Arogya-District-Krishna-Hydro-v1", scope: "District Krishna Health Society", description: "Specialized for flood-inundation vulnerability, waterborne disease vectors, and rural transport bottlenecks.", accuracy: "97.4%", badge: "District Specialization" },
                { level: "Level 4: Frontline Clinic Personalized Forecast", model: "Arogya-PHC-Machilipatnam-Local-v3", scope: "Machilipatnam Coastal PHC Edge", description: "Hyper-localized to clinic outpatient footfall, specific nearby fishing villages, and local medicine dispensary drawing speed.", accuracy: "98.2%", badge: "PHC Forecast" }
              ].map((item, idx) => (
                <div key={idx} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-teal-400 font-bold">{item.level}</span>
                    <span className="rounded bg-teal-500/20 px-2 py-0.5 text-[10px] font-bold text-teal-300">
                      {item.badge}
                    </span>
                  </div>
                  <h4 className="mt-1 text-sm font-bold text-white">{item.model}</h4>
                  <span className="text-[11px] text-slate-400">{item.scope}</span>
                  <p className="mt-2 text-slate-300">{item.description}</p>
                  <div className="mt-2 text-right font-bold text-emerald-400">
                    Accuracy: {item.accuracy}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CHAMPION / CHALLENGER ARENA */}
      {activeTab === 'champion' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl backdrop-blur-md">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <BarChart2 className="h-5 w-5 text-teal-400" />
                AI Model Champion / Challenger Evaluation Arena
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Multiple forecasting architectures compete in a controlled shadow environment. Technical evaluators inspect trade-offs between forecast error (MAE), inference latency, stability, and privacy budget.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              {championModels.map((m) => (
                <div key={m.model_id} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5 shadow-lg text-xs flex flex-col justify-between">
                  <div>
                    <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-cyan-300">
                      {m.model_id}
                    </span>
                    <h4 className="mt-2 font-bold text-white text-sm">{m.name}</h4>

                    <div className="mt-4 space-y-2 border-t border-slate-800/80 pt-3">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Forecast Error (MAE):</span>
                        <span className="font-bold text-emerald-400">{m.mae_error}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Inference Latency:</span>
                        <span className="font-bold text-cyan-400">{m.latency_ms} ms</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Stability Score:</span>
                        <span className="font-bold text-white">{m.stability_score}/100</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Data Requirements:</span>
                        <span className="font-semibold text-slate-300">{m.data_requirements}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <span className="inline-block rounded-full bg-teal-500/20 px-2.5 py-0.5 text-[10px] font-bold text-teal-300 border border-teal-500/30">
                      {m.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: CONTINUOUS LEARNING PIPELINE */}
      {activeTab === 'pipeline' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl backdrop-blur-md">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <RefreshCw className="h-5 w-5 text-teal-400" />
                Simulated Continuous Federated Learning Pipeline
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Automated continuous retraining loop: Data Ingestion &rarr; Concept Drift Sentinel &rarr; Differential-Privacy Aggregation &rarr; Safety Guardrails &rarr; Edge Rollout.
              </p>
            </div>

            <div className="mt-6 space-y-3">
              {learningStages.map((stage) => (
                <div key={stage.stage} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{stage.name}</span>
                    <span className={`rounded px-2.5 py-0.5 text-[10px] font-bold ${
                      stage.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-400' :
                      stage.status === 'RUNNING' ? 'bg-cyan-500/20 text-cyan-400 animate-pulse' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {stage.status}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-slate-300 text-[11px]">
                    <span>Metric: <strong className="text-teal-300">{stage.metric}</strong></span>
                    <span>Execution: <strong className="text-white">{stage.latency_ms} ms</strong></span>
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
