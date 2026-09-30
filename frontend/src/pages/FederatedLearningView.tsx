import React, { useState, useEffect } from 'react';
import {
  Network, ShieldCheck, Lock, Activity, RefreshCw, Cpu,
  CheckCircle2, ArrowUpRight, TrendingUp, Sparkles, Layers,
  Server, HardDrive
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';
import { fetchFederatedStatus, triggerFederatedRound } from '../services/api';
import { FederatedRound } from '../types';

interface FederatedLearningViewProps {
  onOpenCopilot: () => void;
  onNavigateToView: (view: string) => void;
}

export const FederatedLearningView: React.FC<FederatedLearningViewProps> = ({
  onOpenCopilot,
  onNavigateToView
}) => {
  const [status, setStatus] = useState<any>(null);
  const [rounds, setRounds] = useState<FederatedRound[]>([]);
  const [training, setTraining] = useState(false);

  useEffect(() => {
    loadFederatedData();
  }, []);

  const loadFederatedData = async () => {
    const s = await fetchFederatedStatus();
    setStatus(s);
    if (s && s.history) {
      setRounds(s.history);
    }
  };

  const handleTriggerRound = async () => {
    setTraining(true);
    const newRound = await triggerFederatedRound();
    setRounds((prev) => [...prev, newRound]);
    if (status) {
      setStatus({
        ...status,
        current_round: newRound.round_number,
        latest_round: newRound,
        active_training_nodes: newRound.participating_nodes
      });
    }
    setTraining(false);
  };

  const accuracyData = rounds.map((r) => ({
    round: `R#${r.round_number}`,
    accuracy: r.accuracy_pct,
    loss: r.aggregation_loss,
    nodes: r.participating_nodes
  }));

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Federated Learning Core & Privacy-Preserving Architecture
            </h2>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/80 font-mono font-semibold">
              DIFFERENTIAL PRIVACY DP-SGD
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Distributed model parameter aggregation without centralizing sensitive patient clinical records. Raw clinical data NEVER leaves local PHC servers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleTriggerRound}
            disabled={training}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${training ? 'animate-spin' : ''}`} />
            <span>{training ? 'Aggregating Gradients...' : 'Trigger Next Federated Round'}</span>
          </button>
        </div>
      </div>

      {/* Architecture Visual Topology Box */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Network className="w-4 h-4 text-cyan-400" />
            <h3 className="font-bold text-sm text-white">Edge-to-Cloud Federated Aggregation Topology</h3>
          </div>
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>ZERO PATIENT PII TRANSMITTED</span>
          </div>
        </div>

        {/* Visual Graph Diagram */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center py-2">
          {/* Node 1: PHC Edge 1 */}
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-center space-y-1">
            <HardDrive className="w-6 h-6 text-cyan-400 mx-auto" />
            <div className="font-bold text-xs text-white">PHC Node A</div>
            <div className="text-[10px] text-slate-400">Local EHR Database</div>
            <div className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono font-semibold">
              Data Stays Local
            </div>
          </div>

          {/* Node 2: PHC Edge 2 */}
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-center space-y-1">
            <HardDrive className="w-6 h-6 text-cyan-400 mx-auto" />
            <div className="font-bold text-xs text-white">PHC Node B</div>
            <div className="text-[10px] text-slate-400">Local EHR Database</div>
            <div className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono font-semibold">
              Data Stays Local
            </div>
          </div>

          {/* Center: Secure Gradient Aggregator */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-950 to-blue-950 border border-cyan-500/50 text-center space-y-1.5 shadow-lg shadow-cyan-950/40">
            <Cpu className="w-7 h-7 text-cyan-300 mx-auto animate-pulse" />
            <div className="font-extrabold text-xs text-white uppercase tracking-wider">
              Central Aggregator
            </div>
            <div className="text-[11px] text-cyan-300 font-mono">FedAvg Algorithm</div>
            <div className="text-[10px] text-slate-400">Gradients Only (ΔW)</div>
          </div>

          {/* Node 3: PHC Edge 3 */}
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-center space-y-1">
            <HardDrive className="w-6 h-6 text-cyan-400 mx-auto" />
            <div className="font-bold text-xs text-white">PHC Node C</div>
            <div className="text-[10px] text-slate-400">Local EHR Database</div>
            <div className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono font-semibold">
              Data Stays Local
            </div>
          </div>

          {/* Node 4: Global Model Sync */}
          <div className="p-3 rounded-xl bg-slate-950/80 border border-emerald-900/50 text-center space-y-1">
            <Server className="w-6 h-6 text-emerald-400 mx-auto" />
            <div className="font-bold text-xs text-white">Global AI Model</div>
            <div className="text-[10px] text-slate-400">Version 2.18 Distributed</div>
            <div className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono font-semibold">
              Synchronized 100%
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Row: Differential Privacy, Accuracy, Rounds */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Participating Edge PHCs
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-cyan-400">
              {status ? status.active_training_nodes : 1248}
            </span>
            <span className="text-xs text-slate-400">/ 1,280 Enrolled</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Global Accuracy
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-emerald-400">
              {status?.latest_round ? `${status.latest_round.accuracy_pct}%` : '94.6%'}
            </span>
            <span className="text-xs text-emerald-400 font-semibold">+1.2%</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Privacy Budget (ε)
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white">
              ε = {status ? status.privacy_budget_epsilon : 1.20}
            </span>
            <span className="text-xs text-slate-400">(δ = 1e-5)</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Clinical Data Transmitted
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold font-mono text-emerald-400">
              0.00 KB
            </span>
            <span className="text-[10px] text-slate-400">(Gradients only)</span>
          </div>
        </div>
      </div>

      {/* Accuracy & Loss Progression Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="font-bold text-sm text-white">Federated Model Convergence Across Rounds</h3>
              <p className="text-xs text-slate-400">
                Tracking training loss decrement and multi-facility prediction accuracy
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="text-emerald-400">● Accuracy (%)</span>
              <span className="text-rose-400">● Loss (Scaled)</span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={accuracyData}>
                <XAxis dataKey="round" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} domain={[50, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Line type="monotone" dataKey="accuracy" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} name="Accuracy %" />
                <Line type="monotone" dataKey="loss" stroke="#ef4444" strokeWidth={2} strokeDasharray="3 3" dot={{ r: 3 }} name="Aggregation Loss" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Rounds History Table Card */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-300">
                Recent Epoch Rounds
              </h4>
              <span className="text-[10px] font-mono text-cyan-400">
                {rounds.length} Total Rounds
              </span>
            </div>

            <div className="space-y-2 mt-3 max-h-56 overflow-y-auto">
              {rounds.slice().reverse().map((r) => (
                <div
                  key={r.round_number}
                  className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-white font-mono">Round #{r.round_number}</div>
                    <div className="text-[10px] text-slate-400">{r.participating_nodes} nodes • {r.timestamp}</div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold font-mono text-emerald-400">{r.accuracy_pct}%</span>
                    <div className="text-[9px] text-slate-400 font-mono">Loss: {r.aggregation_loss}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <strong className="text-white block">Central Parameter Aggregation:</strong>
            Federated Averaging executes securely with additive Gaussian noise injection guaranteeing differential privacy for all clinical entities.
          </div>
        </div>
      </div>
    </div>
  );
};
