import React, { useState } from 'react';
import { executeAgentTask, executeSwarmMission } from '../services/api';
import {
  Bot, Play, CheckCircle2, AlertCircle, ArrowRight, Activity,
  Cpu, Sparkles, Terminal, FileText, ShieldCheck, Zap
} from 'lucide-react';

export interface AgentModel {
  id: string;
  name: string;
  role: string;
  status: 'ACTIVE' | 'MONITORING' | 'EXECUTING' | 'WAITING' | 'COMPLETED' | 'ERROR';
  current_task: string;
  confidence: number;
  tools?: string[];
  avatar_color?: string;
  progress?: number;
}

interface AgentExecutionPanelProps {
  agent: AgentModel;
  onClose?: () => void;
  className?: string;
}

export const AgentExecutionPanel: React.FC<AgentExecutionPanelProps> = ({
  agent,
  onClose,
  className = ''
}) => {
  const [prompt, setPrompt] = useState(
    agent.id === 'generative'
      ? 'Why is medicine risk increasing in eastern India?'
      : agent.id === 'inventory'
      ? 'Find medicines that may reach zero stock within 48 hours.'
      : agent.id === 'emergency'
      ? 'Assess multi-hazard cascade risks for coastal Bay of Bengal healthcare nodes.'
      : `Analyze operational healthcare resilience for ${agent.name}.`
  );

  const [isExecuting, setIsExecuting] = useState(false);
  const [executionPhase, setExecutionPhase] = useState<string>('IDLE');
  const [response, setResponse] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const defaultTools = agent.tools || [
    'FEFO Expiry Ledger Auditor',
    'Stock Depletion Velocity Analyzer',
    'Regional Surplus Buffer Scanner',
    'Highway Corridor Telematics'
  ];

  const handleRunAgent = async () => {
    setIsExecuting(true);
    setError(null);
    setResponse(null);

    // Dynamic execution phases (Section 17 requirement)
    const phases = [
      'Initializing',
      'Collecting data',
      'Analyzing',
      'Calling tools',
      'Generating recommendation',
      'Completed'
    ];

    let pIdx = 0;
    const phaseTimer = setInterval(() => {
      pIdx++;
      if (pIdx < phases.length) {
        setExecutionPhase(phases[pIdx]);
      } else {
        clearInterval(phaseTimer);
      }
    }, 280);

    try {
      const res = await executeAgentTask({
        agent_id: agent.id,
        prompt: prompt,
        autonomy_level: 'SEMI_AUTONOMOUS',
        reasoning_depth: 'STANDARD'
      });
      clearInterval(phaseTimer);
      setExecutionPhase('Completed');
      setResponse(res);
    } catch (err: any) {
      clearInterval(phaseTimer);
      setError(err?.message || 'Agent execution failed');
      setExecutionPhase('ERROR');
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div
      className={`agent-execution-workspace bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col gap-6 ${className}`}
      style={{ maxWidth: 860 }}
    >
      {/* ── Top Header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              background: '#F0F9FF',
              border: '1px solid #BAE6FD',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#0284C7'
            }}
          >
            <Bot size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0F172A', margin: 0 }}>
                {agent.name}
              </h2>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: 4,
                  background: agent.status === 'EXECUTING' ? '#FEF3C7' : '#DCFCE7',
                  color: agent.status === 'EXECUTING' ? '#92400E' : '#166534'
                }}
              >
                ● {agent.status}
              </span>
            </div>
            <p style={{ fontSize: 12, color: '#64748B', marginTop: 2, margin: 0 }}>
              {agent.role}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 16, textAlign: 'right' }}>
          <div>
            <div style={{ fontSize: 10, color: '#64748B' }}>Confidence</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#059669' }}>
              {agent.confidence}%
            </div>
          </div>
          <div>
            <div style={{ fontSize: 10, color: '#64748B' }}>Progress</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#0284C7' }}>
              {agent.progress || 78}%
            </div>
          </div>
        </div>
      </div>

      {/* ── Status & Current Task (Section 16) ── */}
      <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8, padding: 12, fontSize: 12 }}>
        <div style={{ color: '#64748B', fontWeight: 600, fontSize: 11, marginBottom: 4 }}>
          CURRENT AUTONOMOUS TASK
        </div>
        <div style={{ color: '#0F172A', fontWeight: 600 }}>
          {agent.current_task}
        </div>
      </div>

      {/* ── Agent Tools Available ── */}
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#64748B', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 8 }}>
          AVAILABLE TOOLS & SENSORS
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {defaultTools.map((t, idx) => (
            <span
              key={idx}
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: '#334155',
                background: '#F1F5F9',
                padding: '4px 10px',
                borderRadius: 6,
                border: '1px solid #E2E8F0',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5
              }}
            >
              <Cpu size={12} color="#0284C7" />
              <span>{t}</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── Query Prompt Input (Section 16: ASK THIS AGENT) ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <label style={{ fontSize: 11, fontWeight: 700, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          ASK THIS AGENT
        </label>
        <div style={{ display: 'flex', gap: 10 }}>
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Instruct this autonomous agent..."
            style={{
              flex: 1,
              padding: '10px 14px',
              fontSize: 13,
              borderRadius: 6,
              border: '1px solid #CBD5E1',
              outline: 'none',
              color: '#0F172A'
            }}
          />
          <button
            onClick={handleRunAgent}
            disabled={isExecuting}
            style={{
              padding: '10px 18px',
              backgroundColor: '#0284C7',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 700,
              cursor: isExecuting ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              whiteSpace: 'nowrap'
            }}
          >
            {isExecuting ? (
              <span>Executing...</span>
            ) : (
              <>
                <Play size={13} fill="#FFFFFF" />
                <span>RUN AGENT</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── Execution Progress Stepper (Section 17) ── */}
      {isExecuting && (
        <div style={{ background: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: 8, padding: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 700, color: '#0369A1' }}>
            <Activity size={16} className="animate-spin" />
            <span>Agent Execution Pipeline: {executionPhase}...</span>
          </div>

          <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
            {['Initializing', 'Collecting data', 'Analyzing', 'Calling tools', 'Generating recommendation', 'Completed'].map((p, idx) => {
              const phases = ['Initializing', 'Collecting data', 'Analyzing', 'Calling tools', 'Generating recommendation', 'Completed'];
              const isPast = phases.indexOf(executionPhase) >= idx;
              return (
                <div
                  key={p}
                  style={{
                    flex: 1,
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: isPast ? '#0284C7' : '#E2E8F0',
                    transition: 'all 0.3s'
                  }}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* ── Execution Output (Section 15: Clean structured format) ── */}
      {response && (
        <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8, padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, borderBottom: '1px solid #E2E8F0', paddingBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: 13, color: '#059669' }}>
              <CheckCircle2 size={16} />
              <span>AGENT EXECUTION SYNTHESIS COMPLETED</span>
            </div>
            <span style={{ fontSize: 11, color: '#64748B' }}>
              Execution time: {response.execution_duration_sec}s · Confidence: {response.confidence}%
            </span>
          </div>

          <pre
            style={{
              whiteSpace: 'pre-wrap',
              fontSize: 12,
              lineHeight: 1.6,
              color: '#1E293B',
              fontFamily: 'inherit',
              margin: 0
            }}
          >
            {response.generative_summary}
          </pre>
        </div>
      )}

      {error && (
        <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, padding: 12, color: '#991B1B', fontSize: 12 }}>
          <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
            <AlertCircle size={15} /> Error executing agent
          </div>
          <p style={{ marginTop: 4, margin: 0 }}>{error}</p>
        </div>
      )}
    </div>
  );
};

export default AgentExecutionPanel;
