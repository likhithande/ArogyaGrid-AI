import React, { useState, useEffect } from 'react';
import { 
  Bot, Users, CheckCircle2, AlertTriangle, ShieldCheck, Zap,
  MessageSquare, ArrowRight, Play, RefreshCw, Sparkles, Filter,
  TrendingUp, Activity, Send, Check
} from 'lucide-react';
import { fetchAutonomousAgents, fetchAgentCollaboration } from '../services/api';
import { AutonomousAgent, AgentCollaborationMessage } from '../types';

export const AgentControlCenterView: React.FC = () => {
  const [agents, setAgents] = useState<AutonomousAgent[]>([]);
  const [collaborationFeed, setCollaborationFeed] = useState<AgentCollaborationMessage[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<AutonomousAgent | null>(null);
  const [isRunningCollaboration, setIsRunningCollaboration] = useState<boolean>(false);
  const [consensusAchieved, setConsensusAchieved] = useState<boolean>(true);
  const [customQuery, setCustomQuery] = useState<string>('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const agList = await fetchAutonomousAgents();
    const feed = await fetchAgentCollaboration();
    setAgents(agList);
    setCollaborationFeed(feed);
    if (agList.length > 0) setSelectedAgent(agList[0]);
  };

  const handleTriggerConsensusCycle = () => {
    setIsRunningCollaboration(true);
    setConsensusAchieved(false);
    setTimeout(() => {
      setIsRunningCollaboration(false);
      setConsensusAchieved(true);
      const newMsg: AgentCollaborationMessage = {
        id: `MSG-${Date.now().toString().slice(-4)}`,
        sender_agent: "AI Agent Coordinator",
        timestamp: "Just now",
        content: customQuery 
          ? `Consensus synthesized for "${customQuery}": All 10 agents reached unanimous mitigation protocol.` 
          : "Consensus verified: 750 units ORS allocated from Guntur Depot to Machilipatnam Coastal PHC. ETA: 6.5 hours via SH-42 detour.",
        sentiment: "CONSENSUS",
        affected_resource: "Cross-District Logistics Corridor",
        priority: "CRITICAL"
      };
      setCollaborationFeed(prev => [...prev, newMsg]);
      setCustomQuery('');
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl border border-indigo-500/20 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 text-white animate-pulse">
            <Bot className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white tracking-tight">AI Agent Control Center</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                10 Autonomous Agents Active
              </span>
            </div>
            <p className="text-slate-400 text-sm mt-1">
              Multi-agent decentralized intelligence collaborating across epidemiological forecasting, supply routes, and emergency triage
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleTriggerConsensusCycle}
            disabled={isRunningCollaboration}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs transition-all shadow-lg shadow-indigo-500/30 active:scale-95 disabled:opacity-50"
          >
            <Play className={`w-4 h-4 ${isRunningCollaboration ? 'animate-spin' : ''}`} />
            Run Agent Consensus Cycle
          </button>
        </div>
      </div>

      {/* 10 Autonomous Agents Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-400" />
            Specialized Autonomous Healthcare Agents
          </h2>
          <span className="text-xs text-slate-500">Click any agent to inspect activity audit & parameters</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          {agents.map(ag => {
            const isSelected = selectedAgent?.id === ag.id;
            return (
              <div
                key={ag.id}
                onClick={() => setSelectedAgent(ag)}
                className={`p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? 'bg-slate-800/90 border-indigo-500 shadow-xl shadow-indigo-500/10 ring-1 ring-indigo-500/40'
                    : 'bg-slate-900/60 hover:bg-slate-800/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-indigo-300 border border-slate-700">
                      {ag.id}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                      ag.status === 'ALERT' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                      ag.status === 'IDLE' ? 'bg-slate-700 text-slate-400' :
                      'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${ag.status === 'ALERT' ? 'bg-rose-400 animate-ping' : 'bg-emerald-400'}`} />
                      {ag.status}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white leading-tight mb-1">{ag.name}</h3>
                  <p className="text-[11px] text-slate-400 leading-snug line-clamp-2 mb-2">{ag.role}</p>

                  <div className="p-2 rounded-lg bg-slate-950/40 border border-slate-800 text-[11px] text-slate-300 mb-2">
                    <span className="text-indigo-400 font-semibold block text-[10px] uppercase">Task:</span>
                    <span className="line-clamp-2">{ag.current_task}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 font-mono">Conf: <strong className="text-slate-200">{ag.confidence}%</strong></span>
                  <span className="text-amber-400 font-medium">{ag.detected_issues} issues</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Multi-Agent Collaboration Dialog & Agent Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Collaboration Consensus Stream */}
        <div className="lg:col-span-8 bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Multi-Agent Collaborative Consensus Bus</h3>
                  <p className="text-xs text-slate-400">Live inter-agent communication synthesizing cross-functional healthcare solutions</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Consensus Active
                </span>
              </div>
            </div>

            {/* Conversation Flow */}
            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-2 custom-scrollbar">
              {collaborationFeed.map((msg, idx) => (
                <div 
                  key={idx}
                  className={`p-4 rounded-xl border transition-all ${
                    msg.sentiment === 'CONSENSUS' ? 'bg-gradient-to-r from-emerald-950/40 to-slate-900 border-emerald-500/40 shadow-lg' :
                    msg.sentiment === 'ALERT' ? 'bg-rose-950/20 border-rose-500/30' :
                    msg.sentiment === 'PROPOSAL' ? 'bg-indigo-950/20 border-indigo-500/30' :
                    'bg-slate-800/40 border-slate-700/50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Bot className="w-3.5 h-3.5 text-indigo-400" />
                        {msg.sender_agent}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full ${
                        msg.sentiment === 'CONSENSUS' ? 'bg-emerald-500/20 text-emerald-300' :
                        msg.sentiment === 'ALERT' ? 'bg-rose-500/20 text-rose-300' :
                        'bg-sky-500/20 text-sky-300'
                      }`}>
                        {msg.sentiment}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">{msg.timestamp}</span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed font-sans">{msg.content}</p>

                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/60">
                    <span>Resource: <strong className="text-slate-300">{msg.affected_resource}</strong></span>
                    <span className={`font-semibold ${msg.priority === 'CRITICAL' ? 'text-rose-400' : 'text-amber-400'}`}>
                      {msg.priority} Priority
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Agent Query Input */}
          <div className="mt-4 pt-4 border-t border-slate-800 flex items-center gap-2">
            <input 
              type="text"
              value={customQuery}
              onChange={(e) => setCustomQuery(e.target.value)}
              placeholder="Ask the 10 agents to collaborate (e.g., 'What if flood isolates Machilipatnam?')..."
              className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              onKeyDown={(e) => e.key === 'Enter' && handleTriggerConsensusCycle()}
            />
            <button
              onClick={handleTriggerConsensusCycle}
              disabled={isRunningCollaboration}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              Dispatch
            </button>
          </div>
        </div>

        {/* Selected Agent Telemetry & Log */}
        <div className="lg:col-span-4 bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
          {selectedAgent ? (
            <>
              <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{selectedAgent.name}</h3>
                  <p className="text-xs text-slate-400">{selectedAgent.id} • {selectedAgent.role}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Confidence</div>
                  <div className="text-lg font-bold text-cyan-400 font-mono">{selectedAgent.confidence}%</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Last Execution</div>
                  <div className="text-sm font-bold text-slate-200">{selectedAgent.last_execution}</div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/40">
                <div className="text-[10px] text-slate-400 uppercase font-semibold mb-1">Active Mandate</div>
                <p className="text-xs text-slate-200 leading-relaxed">{selectedAgent.current_task}</p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-indigo-400" />
                  Recent Execution Audit
                </h4>
                <div className="space-y-2">
                  {selectedAgent.activity_log.map((log, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                      <span>{log}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center text-slate-500 py-12 text-sm">
              Select an agent to inspect metrics.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
