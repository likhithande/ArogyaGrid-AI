import React, { useEffect, useRef } from 'react';
import {
  ArrowRight, ShieldCheck, Activity, Cpu, Network,
  AlertTriangle, TrendingUp, Lock, Award, HeartHandshake,
  Eye, Truck, Brain, Compass, Radio, Zap, Shield, ChevronRight,
  BarChart3, Layers, GitFork, Globe2, Sparkles
} from 'lucide-react';
import { BrandLogo } from '../components/BrandLogo';

interface LandingPortalViewProps {
  onEnterCommandCenter: () => void;
  onExploreAi: () => void;
  onStartJudgeTour: () => void;
}

const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span
    className="inline-flex items-center gap-1.5 text-[10.5px] font-bold tracking-[0.1em] uppercase mb-3"
    style={{ color: '#06B6D4', fontFamily: "'JetBrains Mono', monospace" }}
  >
    <span style={{ width: '20px', height: '1px', background: '#06B6D4', display: 'inline-block' }} />
    {children}
  </span>
);

const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  tag?: string;
}> = ({ icon, title, description, tag }) => (
  <div
    className="p-5 rounded-xl transition-all duration-200 hover:translate-y-[-2px] group"
    style={{
      background: '#0C1424',
      border: '1px solid #1A2438',
    }}
  >
    <div className="flex items-start justify-between mb-4">
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center"
        style={{ background: 'rgba(6,182,212,0.10)', border: '1px solid rgba(6,182,212,0.2)' }}
      >
        {icon}
      </div>
      {tag && (
        <span
          className="text-[9.5px] font-bold px-2 py-0.5 rounded uppercase tracking-wide"
          style={{ background: 'rgba(37,99,235,0.15)', color: '#60A5FA', border: '1px solid rgba(37,99,235,0.25)', fontFamily: "'JetBrains Mono', monospace" }}
        >
          {tag}
        </span>
      )}
    </div>
    <h3 className="text-[14px] font-bold mb-1.5" style={{ color: '#F1F5F9' }}>{title}</h3>
    <p className="text-[12.5px] leading-relaxed" style={{ color: '#64748B' }}>{description}</p>
  </div>
);

const StatItem: React.FC<{ value: string; label: string; sub?: string }> = ({ value, label, sub }) => (
  <div className="text-center">
    <div className="text-[36px] font-black tracking-tight mb-1" style={{ color: '#F1F5F9', fontFamily: 'Inter, sans-serif' }}>{value}</div>
    <div className="text-[13px] font-semibold mb-0.5" style={{ color: '#CBD5E1' }}>{label}</div>
    {sub && <div className="text-[11px]" style={{ color: '#475569' }}>{sub}</div>}
  </div>
);

export const LandingPortalView: React.FC<LandingPortalViewProps> = ({
  onEnterCommandCenter,
  onExploreAi,
  onStartJudgeTour
}) => {
  const canvasRef = useRef<SVGSVGElement>(null);

  const problemPoints = [
    { icon: AlertTriangle, text: 'Medicine stock-outs go undetected for weeks in remote PHCs' },
    { icon: Eye, text: 'No real-time visibility into district-level demand or inventory' },
    { icon: Truck, text: 'Supply chains react to crises instead of predicting them' },
    { icon: Shield, text: 'Emergency response is ad-hoc, manual, and delayed' },
  ];

  const capabilities = [
    { icon: <TrendingUp className="w-5 h-5" style={{ color: '#06B6D4' }} />, title: 'Demand Intelligence', description: 'AI-powered 7-day healthcare demand forecasting with XAI confidence intervals and anomaly detection across 1,248 PHCs.', tag: 'AI · XAI' },
    { icon: <AlertTriangle className="w-5 h-5" style={{ color: '#EF4444' }} />, title: 'Medicine Risk Center', description: 'Predictive stock-out detection with root cause analysis. Know 48 hours before a medicine runs out.', tag: 'Causal AI' },
    { icon: <GitFork className="w-5 h-5" style={{ color: '#2563EB' }} />, title: 'Supply Chain Command', description: 'End-to-end supply network visualization from national warehouses to PHC level with animated resource flows.', tag: 'Network AI' },
    { icon: <Cpu className="w-5 h-5" style={{ color: '#8B5CF6' }} />, title: 'Healthcare Digital Twin', description: 'Simulate any scenario — floods, disease surges, supply disruptions — before they happen. What-if analysis at scale.', tag: 'Simulation' },
    { icon: <Network className="w-5 h-5" style={{ color: '#22C55E' }} />, title: 'Federated Learning', description: 'Privacy-preserving AI training across all PHC nodes. Raw data never leaves the source. GDPR and HIPAA compliant.', tag: 'Privacy AI' },
    { icon: <Brain className="w-5 h-5" style={{ color: '#F59E0B' }} />, title: 'AI Agent Operations', description: 'Autonomous AI agents continuously monitor, predict, and recommend. Every action requires human approval before execution.', tag: '10 Agents' },
  ];

  const steps = [
    { n: '01', title: 'Observe', desc: 'Real-time telemetry from all PHCs, warehouses and districts.' },
    { n: '02', title: 'Predict', desc: 'AI forecasts demand and detects risk 48–72 hours ahead.' },
    { n: '03', title: 'Simulate', desc: 'Digital twin models the impact before any decision is made.' },
    { n: '04', title: 'Optimize', desc: 'Pareto-optimal resource allocation across the network.' },
    { n: '05', title: 'Approve', desc: 'Human review gate — AI recommends, humans decide and act.' },
    { n: '06', title: 'Audit', desc: 'Every action is immutably logged for complete accountability.' },
  ];

  return (
    <div
      className="min-h-screen"
      style={{ background: '#070B14', color: '#F1F5F9' }}
    >

      {/* ── HERO ──────────────────────────────────── */}
      <section className="relative overflow-hidden pt-16 pb-20 px-4 sm:px-8 max-w-6xl mx-auto">
        {/* Radial glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
          style={{
            width: '800px', height: '600px',
            background: 'radial-gradient(ellipse at center, rgba(37,99,235,0.10) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />

        <div className="relative text-center space-y-6">
          {/* Live badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-semibold"
            style={{
              background: 'rgba(6,182,212,0.08)',
              border: '1px solid rgba(6,182,212,0.2)',
              color: '#22D3EE',
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            AI HEALTHCARE RESILIENCE OPERATING SYSTEM · v2.5
          </div>

          {/* Logo */}
          <div className="flex justify-center pt-2">
            <BrandLogo size="hero" showTagline={false} />
          </div>

          {/* Headline */}
          <h1
            className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.08] max-w-4xl mx-auto"
            style={{ color: '#F8FAFC' }}
          >
            Predicting Healthcare Needs
            <br />
            <span style={{ color: '#06B6D4' }}>Before They Become Crises.</span>
          </h1>

          <p className="text-[15px] max-w-2xl mx-auto leading-relaxed" style={{ color: '#64748B' }}>
            An AI-powered healthcare resilience platform for predictive resource intelligence,
            supply-chain optimization, emergency simulation, and federated learning
            across national public health networks.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={onEnterCommandCenter}
              className="ag-btn ag-btn-primary flex items-center gap-2 px-7 py-3.5 text-[13px] font-bold rounded-xl"
            >
              Enter Command Center
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onStartJudgeTour}
              className="ag-btn ag-btn-ghost flex items-center gap-2 px-6 py-3.5 text-[13px] rounded-xl"
              style={{
                border: '1px solid rgba(245,158,11,0.3)',
                color: '#F59E0B',
                background: 'rgba(245,158,11,0.06)',
              }}
            >
              <Award className="w-4 h-4" />
              Judge Demo (3 min)
            </button>
            <button
              onClick={onExploreAi}
              className="ag-btn ag-btn-ghost flex items-center gap-2 px-6 py-3.5 text-[13px] rounded-xl"
            >
              <Cpu className="w-4 h-4" style={{ color: '#06B6D4' }} />
              Explore AI
            </button>
          </div>

          {/* Hero Visual: Animated Network Map */}
          <div
            className="mt-14 relative rounded-2xl overflow-hidden"
            style={{
              background: '#070B14',
              border: '1px solid #1A2438',
              height: '400px',
            }}
          >
            {/* Grid background */}
            <svg className="absolute inset-0 w-full h-full opacity-[0.07]">
              <defs>
                <pattern id="heroGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#38BDF8" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#heroGrid)" />
            </svg>

            {/* Animated network SVG */}
            <svg ref={canvasRef} className="absolute inset-0 w-full h-full" viewBox="0 0 900 400">
              <defs>
                <radialGradient id="glow-blue" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#2563EB" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="glow-cyan" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#06B6D4" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="glow-red" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#EF4444" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
                </radialGradient>
                <marker id="arrow-c" markerWidth="5" markerHeight="3" refX="2.5" refY="1.5" orient="auto">
                  <polygon points="0 0, 5 1.5, 0 3" fill="rgba(6,182,212,0.4)" />
                </marker>
                <marker id="arrow-b" markerWidth="5" markerHeight="3" refX="2.5" refY="1.5" orient="auto">
                  <polygon points="0 0, 5 1.5, 0 3" fill="rgba(37,99,235,0.4)" />
                </marker>
              </defs>

              {/* Supply route lines */}
              <line x1="450" y1="200" x2="240" y2="130" stroke="#1E40AF" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.5" markerEnd="url(#arrow-b)" />
              <line x1="450" y1="200" x2="650" y2="120" stroke="#1E40AF" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.5" markerEnd="url(#arrow-b)" />
              <line x1="240" y1="130" x2="130" y2="260" stroke="#06B6D4" strokeWidth="1.5" opacity="0.4" markerEnd="url(#arrow-c)" />
              <line x1="240" y1="130" x2="330" y2="300" stroke="#06B6D4" strokeWidth="1.5" opacity="0.4" markerEnd="url(#arrow-c)" />
              <line x1="650" y1="120" x2="760" y2="260" stroke="#06B6D4" strokeWidth="1.5" opacity="0.4" markerEnd="url(#arrow-c)" />
              <line x1="650" y1="120" x2="570" y2="290" stroke="#06B6D4" strokeWidth="1.5" opacity="0.4" markerEnd="url(#arrow-c)" />
              <line x1="450" y1="200" x2="450" y2="310" stroke="#22C55E" strokeWidth="1" opacity="0.3" />

              {/* Animated flow particles */}
              {[
                { path: "M 450 200 L 240 130", color: "#06B6D4", dur: "2.5s" },
                { path: "M 450 200 L 650 120", color: "#06B6D4", dur: "2.8s" },
                { path: "M 240 130 L 130 260", color: "#22C55E", dur: "3.2s" },
                { path: "M 650 120 L 760 260", color: "#22C55E", dur: "3.5s" },
              ].map((p, i) => (
                <circle key={i} r="3" fill={p.color} opacity="0.9">
                  <animateMotion dur={p.dur} repeatCount="indefinite" path={p.path} />
                </circle>
              ))}

              {/* National warehouse (center) */}
              <circle cx="450" cy="200" r="22" fill="#0C1424" stroke="#2563EB" strokeWidth="2" />
              <circle cx="450" cy="200" r="28" fill="none" stroke="#2563EB" strokeOpacity="0.2" strokeWidth="1">
                <animate attributeName="r" values="28;36;28" dur="3s" repeatCount="indefinite" />
                <animate attributeName="stroke-opacity" values="0.2;0;0.2" dur="3s" repeatCount="indefinite" />
              </circle>
              <text x="450" y="196" textAnchor="middle" fill="#60A5FA" fontSize="9" fontWeight="700" fontFamily="JetBrains Mono">NAT</text>
              <text x="450" y="207" textAnchor="middle" fill="#60A5FA" fontSize="9" fontWeight="700" fontFamily="JetBrains Mono">WH</text>

              {/* State warehouses */}
              {[{ x: 240, y: 130, label: "STW\nAP" }, { x: 650, y: 120, label: "STW\nTS" }].map((n, i) => (
                <g key={i}>
                  <circle cx={n.x} cy={n.y} r="16" fill="#0C1424" stroke="#06B6D4" strokeWidth="1.5" />
                  <circle cx={n.x} cy={n.y} r="21" fill="none" stroke="#06B6D4" strokeOpacity="0.15" strokeWidth="1">
                    <animate attributeName="r" values="21;28;21" dur={`${3.5 + i * 0.5}s`} repeatCount="indefinite" />
                    <animate attributeName="stroke-opacity" values="0.15;0;0.15" dur={`${3.5 + i * 0.5}s`} repeatCount="indefinite" />
                  </circle>
                  <text x={n.x} y={n.y - 2} textAnchor="middle" fill="#22D3EE" fontSize="8" fontWeight="700" fontFamily="JetBrains Mono">{n.label.split('\n')[0]}</text>
                  <text x={n.x} y={n.y + 9} textAnchor="middle" fill="#22D3EE" fontSize="8" fontWeight="700" fontFamily="JetBrains Mono">{n.label.split('\n')[1]}</text>
                </g>
              ))}

              {/* PHC nodes */}
              {[
                { x: 130, y: 260, label: "PHC", risk: '#22C55E' },
                { x: 330, y: 300, label: "PHC", risk: '#EF4444' },
                { x: 760, y: 260, label: "PHC", risk: '#22C55E' },
                { x: 570, y: 290, label: "PHC", risk: '#F59E0B' },
                { x: 450, y: 310, label: "PHC", risk: '#22C55E' },
              ].map((n, i) => (
                <g key={i}>
                  {n.risk === '#EF4444' && (
                    <circle cx={n.x} cy={n.y} r="15" fill="none" stroke="#EF4444" strokeOpacity="0.35">
                      <animate attributeName="r" values="12;22;12" dur="2s" repeatCount="indefinite" />
                      <animate attributeName="stroke-opacity" values="0.35;0;0.35" dur="2s" repeatCount="indefinite" />
                    </circle>
                  )}
                  <circle cx={n.x} cy={n.y} r="11" fill="#0C1424" stroke={n.risk} strokeWidth="1.5" />
                  <text x={n.x} y={n.y + 4} textAnchor="middle" fill={n.risk} fontSize="8" fontWeight="700" fontFamily="JetBrains Mono">{n.label}</text>
                </g>
              ))}

              {/* AI Insight markers */}
              {[{ x: 330, y: 270, text: "⚠ Stock-out 48h" }, { x: 570, y: 260, text: "↑ Demand +27%" }].map((m, i) => (
                <g key={i}>
                  <rect x={m.x - 48} y={m.y - 12} width="96" height="18" rx="4"
                    fill="rgba(12,20,36,0.95)" stroke="rgba(245,158,11,0.4)" strokeWidth="1" />
                  <text x={m.x} y={m.y} textAnchor="middle" fill="#F59E0B" fontSize="9" fontWeight="700" fontFamily="JetBrains Mono">{m.text}</text>
                </g>
              ))}

              {/* Legend labels */}
              <text x="450" y="235" textAnchor="middle" fill="#475569" fontSize="10" fontFamily="JetBrains Mono">National Warehouse</text>
              <text x="240" y="160" textAnchor="middle" fill="#475569" fontSize="9" fontFamily="JetBrains Mono">State WH (AP)</text>
              <text x="650" y="148" textAnchor="middle" fill="#475569" fontSize="9" fontFamily="JetBrains Mono">State WH (TS)</text>
            </svg>

            {/* Corner labels */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <div
                className="flex items-center gap-4 text-[10px]"
                style={{ fontFamily: "'JetBrains Mono', monospace", color: '#3A4A63' }}
              >
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400" /> PHC Operational</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400" /> Demand Surge</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500" /> Stock-out Risk</span>
              </div>
              <span className="text-[10px]" style={{ color: '#3A4A63', fontFamily: "'JetBrains Mono', monospace" }}>
                LIVE SIMULATION · 1,248 PHCs
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ─────────────────────────────── */}
      <section style={{ borderTop: '1px solid #1A2438', borderBottom: '1px solid #1A2438', background: '#0C1424' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10 grid grid-cols-2 sm:grid-cols-4 gap-8">
          <StatItem value="1,248" label="PHCs Monitored" sub="8 States · 51 Districts" />
          <StatItem value="94.2%" label="Medicine Availability" sub="104 NLEM drugs tracked" />
          <StatItem value="48h" label="Advance Warning" sub="Before stock-outs occur" />
          <StatItem value="84.8" label="Resilience Index" sub="National average score" />
        </div>
      </section>

      {/* ── PROBLEM ───────────────────────────────── */}
      <section className="py-20 px-4 sm:px-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <SectionLabel>The Problem</SectionLabel>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-4" style={{ color: '#F8FAFC' }}>
              Healthcare crises are predictable.
              <br />
              <span style={{ color: '#EF4444' }}>We just weren't looking.</span>
            </h2>
            <p className="text-[14px] leading-relaxed mb-6" style={{ color: '#64748B' }}>
              India's public health infrastructure serves 1.4 billion people through a complex network of
              PHCs, districts, and state warehouses. Yet critical breakdowns — medicine stock-outs, demand
              surges during disasters, supply chain failures — still catch the system off-guard.
            </p>
            <div className="space-y-3">
              {problemPoints.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-start gap-3">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}
                  >
                    <Icon className="w-3.5 h-3.5" style={{ color: '#EF4444' }} />
                  </div>
                  <span className="text-[13px] leading-snug" style={{ color: '#94A3B8' }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
          <div
            className="rounded-2xl p-6"
            style={{ background: '#0C1424', border: '1px solid #1A2438' }}
          >
            <p className="text-[11px] font-bold uppercase tracking-wider mb-4" style={{ color: '#3A4A63', fontFamily: "'JetBrains Mono', monospace" }}>
              Without ArogyaGrid AI
            </p>
            {[
              { label: 'Time to detect stock-out', value: '2–4 weeks', color: '#EF4444' },
              { label: 'Emergency response time', value: '72+ hours', color: '#F59E0B' },
              { label: 'Supply chain visibility', value: '28%', color: '#EF4444' },
              { label: 'Data-driven decisions', value: '12%', color: '#EF4444' },
            ].map(({ label, value, color }) => (
              <div key={label} className="flex items-center justify-between py-3 border-b" style={{ borderColor: '#1A2438' }}>
                <span className="text-[13px]" style={{ color: '#64748B' }}>{label}</span>
                <span className="text-[14px] font-bold" style={{ color }}>{value}</span>
              </div>
            ))}
            <div className="mt-5 p-3 rounded-lg" style={{ background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.2)' }}>
              <p className="text-[12px]" style={{ color: '#60A5FA' }}>
                ArogyaGrid AI detects and predicts these failures <strong>48–72 hours in advance</strong>,
                giving health administrators time to respond — not just react.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────── */}
      <section style={{ background: '#0C1424', borderTop: '1px solid #1A2438', borderBottom: '1px solid #1A2438' }}>
        <div className="py-20 px-4 sm:px-8 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <SectionLabel>How It Works</SectionLabel>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight" style={{ color: '#F8FAFC' }}>
              Intelligence. Context. Decision. Action.
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {steps.map(({ n, title, desc }, i) => (
              <div key={n} className="relative">
                {i < steps.length - 1 && (
                  <div
                    className="absolute top-7 left-full w-full h-px hidden lg:block"
                    style={{ background: 'linear-gradient(90deg, #1A2438, transparent)', zIndex: 0 }}
                  />
                )}
                <div className="relative text-center">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-3 text-[13px] font-black"
                    style={{
                      background: '#070B14',
                      border: '1px solid #1A2438',
                      color: '#2563EB',
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    {n}
                  </div>
                  <h4 className="text-[13px] font-bold mb-1" style={{ color: '#F1F5F9' }}>{title}</h4>
                  <p className="text-[11.5px] leading-relaxed" style={{ color: '#475569' }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CAPABILITIES ──────────────────────────── */}
      <section className="py-20 px-4 sm:px-8 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <SectionLabel>AI Capabilities</SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-3" style={{ color: '#F8FAFC' }}>
            Every module works together.
          </h2>
          <p className="text-[14px] max-w-xl mx-auto" style={{ color: '#64748B' }}>
            Not a collection of dashboards. A unified intelligence system where every insight connects to action.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {capabilities.map((cap) => (
            <FeatureCard key={cap.title} {...cap} />
          ))}
        </div>
      </section>

      {/* ── RESPONSIBLE AI ────────────────────────── */}
      <section style={{ background: '#0C1424', borderTop: '1px solid #1A2438', borderBottom: '1px solid #1A2438' }}>
        <div className="py-20 px-4 sm:px-8 max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <SectionLabel>Responsible AI</SectionLabel>
            <h2 className="text-3xl font-black tracking-tight" style={{ color: '#F8FAFC' }}>
              Built on trust. Governed by humans.
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { icon: <Lock className="w-5 h-5" style={{ color: '#22C55E' }} />, title: 'Privacy First', desc: 'Federated — raw data never leaves PHCs' },
              { icon: <HeartHandshake className="w-5 h-5" style={{ color: '#22C55E' }} />, title: 'Human Oversight', desc: 'Every AI action needs human approval' },
              { icon: <Eye className="w-5 h-5" style={{ color: '#06B6D4' }} />, title: 'Explainable', desc: 'XAI confidence scores on every forecast' },
              { icon: <Shield className="w-5 h-5" style={{ color: '#2563EB' }} />, title: 'Auditability', desc: 'Immutable blockchain-anchored audit log' },
              { icon: <Activity className="w-5 h-5" style={{ color: '#F59E0B' }} />, title: 'Model Drift', desc: 'Continuous monitoring and retraining' },
              { icon: <Compass className="w-5 h-5" style={{ color: '#8B5CF6' }} />, title: 'Synthetic Data', desc: 'Privacy-safe training data where needed' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="text-center p-4 rounded-xl" style={{ background: '#070B14', border: '1px solid #1A2438' }}>
                <div className="flex justify-center mb-3">{icon}</div>
                <h4 className="text-[12.5px] font-bold mb-1.5" style={{ color: '#CBD5E1' }}>{title}</h4>
                <p className="text-[11px] leading-snug" style={{ color: '#475569' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────── */}
      <section className="py-24 px-4 sm:px-8 max-w-4xl mx-auto text-center">
        <SectionLabel>Ready to Explore</SectionLabel>
        <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-5" style={{ color: '#F8FAFC' }}>
          A national-scale
          <br />
          <span style={{ color: '#2563EB' }}>AI platform</span> for healthcare resilience.
        </h2>
        <p className="text-[15px] mb-10 max-w-xl mx-auto" style={{ color: '#64748B' }}>
          Built to serve 1.4 billion. Designed for district health officers,
          national administrators, and emergency response coordinators.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onEnterCommandCenter}
            className="ag-btn ag-btn-primary px-10 py-4 text-[14px] font-bold rounded-xl"
          >
            Enter Command Center
            <ArrowRight className="w-5 h-5" />
          </button>
          <button
            onClick={onStartJudgeTour}
            className="ag-btn ag-btn-ghost px-8 py-4 text-[14px] rounded-xl"
            style={{ border: '1px solid rgba(245,158,11,0.3)', color: '#F59E0B', background: 'rgba(245,158,11,0.06)' }}
          >
            <Award className="w-4 h-4" />
            Start 3-Minute Demo
          </button>
        </div>

        <p className="mt-10 text-[11px]" style={{ color: '#3A4A63', fontFamily: "'JetBrains Mono', monospace" }}>
          PREDICT · SIMULATE · OPTIMIZE · PROTECT
        </p>
      </section>

    </div>
  );
};
