import React, { useState } from 'react';
import {
  Sparkles, Send, Bot, User, CheckCircle2,
  TrendingDown, Package, MapPin, Network, ArrowRight,
  Building, Activity, Clock, ShieldCheck
} from 'lucide-react';
import { StatusBadge, RiskBadge } from '../components/design-system';

interface ChatMessage {
  id: string;
  sender: 'user' | 'copilot';
  time: string;
  text: string;
  structuredData?: {
    potentialShortages: string[];
    highestRisk: string;
    expectedStockout: string;
    recommendedRedistribution: string;
  };
}

export const ArogyaCopilotView: React.FC<{ onNavigateToView?: (v: string) => void }> = ({ onNavigateToView }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'user',
      time: '09:38 IST',
      text: 'Which districts may face medicine shortages this week?',
    },
    {
      id: 'm-2',
      sender: 'copilot',
      time: '09:39 IST',
      text: 'Surveillance telemetry across 51 districts and 694 primary health facilities projects elevated vulnerability in 3 coastal districts during the upcoming 72-hour window.',
      structuredData: {
        potentialShortages: ['Krishna', 'NTR', 'Guntur'],
        highestRisk: 'Krishna District',
        expectedStockout: '18 hours',
        recommendedRedistribution: '420 units',
      },
    },
  ]);

  const [inputVal, setInputVal] = useState('');
  const [activeContextDistrict, setActiveContextDistrict] = useState('Krishna District');

  const quickPrompts = [
    'Why is stock falling?',
    'Show critical districts',
    'Simulate cyclone',
    'Optimize medicine allocation',
    'Generate executive report',
  ];

  const handleSend = (textToSend?: string) => {
    const q = textToSend || inputVal;
    if (!q.trim()) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      time: '09:42 IST',
      text: q,
    };

    let replyText = 'Telemetry and optimization algorithms have cross-referenced central buffer standards with real-time footfall.';
    let struct: ChatMessage['structuredData'] | undefined = undefined;

    if (q.includes('Why is stock falling?')) {
      replyText = 'Causal decomposition indicates a +34% demand surge driven by seasonal monsoon respiratory incidence (+14%), pediatric outpatient spikes (+8%), and cluster admissions at Krishna General Hospital (+6%).';
      struct = {
        potentialShortages: ['Krishna', 'NTR'],
        highestRisk: 'Krishna District',
        expectedStockout: '18 hours',
        recommendedRedistribution: '420 units from Guntur Central WH',
      };
      setActiveContextDistrict('Krishna District');
    } else if (q.includes('Show critical districts')) {
      replyText = 'Autonomous surveillance currently flags 1 Critical District (Krishna) and 2 Warning Districts (Guntur, NTR).';
      struct = {
        potentialShortages: ['Krishna', 'NTR', 'Guntur'],
        highestRisk: 'Krishna District (Vijayawada PHC-04 cluster)',
        expectedStockout: '18 hours',
        recommendedRedistribution: '420 units Amoxicillin',
      };
      setActiveContextDistrict('Krishna District');
    } else if (q.includes('Simulate cyclone')) {
      replyText = 'Digital twin initialized: Bay of Bengal Severe Cyclone projecting +42% coastal trauma & electrolyte surge across 18 flood plain hospitals.';
      if (onNavigateToView) {
        onNavigateToView('digital-twin');
        return;
      }
    } else if (q.includes('Optimize medicine allocation')) {
      replyText = 'Linear programming solver computed optimal multi-depot redistribution: Transfer 420 units Amoxicillin from Guntur Central Warehouse buffer to Vijayawada PHC-04 within 12 hours.';
      struct = {
        potentialShortages: ['Krishna (Mitigated)'],
        highestRisk: 'Resolved under proposed transfer',
        expectedStockout: 'Extends buffer to 12.4 days',
        recommendedRedistribution: '420 units',
      };
    } else if (q.includes('Generate executive report')) {
      replyText = 'Compiling Weekly Healthcare Resilience Brief for MoHFW. Ready for export in PDF and presentation formats.';
      if (onNavigateToView) {
        onNavigateToView('reports');
        return;
      }
    }

    const aiMsg: ChatMessage = {
      id: `ai-${Date.now()}`,
      sender: 'copilot',
      time: '09:42 IST',
      text: replyText,
      structuredData: struct,
    };

    setMessages((prev) => [...prev, userMsg, aiMsg]);
    setInputVal('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, height: 'calc(100vh - 100px)' }}>
      {/* ── 1. HEADER (Section 12 Spec) ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-default)', paddingBottom: 12 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            AROGYA COPILOT
          </h1>
          <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', marginTop: 2, margin: 0 }}>
            Executive healthcare intelligence assistant grounded in live national health data
          </p>
        </div>
        <span className="ag-badge ag-badge-stable">
          ● Live Database Synced
        </span>
      </div>

      {/* ── 2. SPLIT LAYOUT: LEFT CONVERSATION + RIGHT LIVE CONTEXT (Section 12 Spec) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.45fr 1fr', gap: 20, flex: 1, minHeight: 0 }}>
        {/* Left: Conversation Stream */}
        <div className="ag-card" style={{ display: 'flex', flexDirection: 'column', padding: 18, minHeight: 0 }}>
          {/* Messages list */}
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16, paddingRight: 6 }}>
            {messages.map((m) => (
              <div
                key={m.id}
                style={{
                  display: 'flex',
                  gap: 12,
                  alignItems: 'flex-start',
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 'var(--radius-sm)',
                    background: m.sender === 'user' ? '#E2E8F0' : 'var(--color-green-light)',
                    border: `1px solid ${m.sender === 'user' ? '#CBD5E1' : 'var(--color-green-border)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    color: m.sender === 'user' ? 'var(--text-primary)' : 'var(--color-green)',
                  }}
                >
                  {m.sender === 'user' ? <User size={15} /> : <Bot size={15} />}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text-primary)' }}>
                      {m.sender === 'user' ? 'Dr. Rajesh Sharma (Administrator)' : 'Arogya Intelligence Copilot'}
                    </span>
                    <span style={{ fontSize: 10.5, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}>
                      {m.time}
                    </span>
                  </div>

                  <div
                    style={{
                      padding: '12px 16px',
                      background: m.sender === 'user' ? 'var(--bg-surface-elevated)' : '#FFFFFF',
                      border: '1px solid var(--border-default)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: 13,
                      lineHeight: 1.55,
                      color: 'var(--text-primary)',
                    }}
                  >
                    <p style={{ margin: 0 }}>{m.text}</p>

                    {/* Exact structured response requested in Section 12 */}
                    {m.structuredData && (
                      <div
                        style={{
                          marginTop: 12,
                          padding: '12px 14px',
                          background: 'var(--bg-surface-elevated)',
                          borderLeft: '4px solid var(--color-critical)',
                          borderRadius: 4,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 6,
                          fontSize: 12.5,
                        }}
                      >
                        <div>
                          <span style={{ color: 'var(--text-secondary)' }}>Potential shortages detected in: </span>
                          <strong style={{ color: 'var(--text-primary)' }}>
                            {m.structuredData.potentialShortages.join(', ')}
                          </strong>
                        </div>

                        <div>
                          <span style={{ color: 'var(--text-secondary)' }}>Highest risk: </span>
                          <strong style={{ color: 'var(--color-critical)' }}>
                            {m.structuredData.highestRisk}
                          </strong>
                        </div>

                        <div>
                          <span style={{ color: 'var(--text-secondary)' }}>Expected stock-out: </span>
                          <strong style={{ color: 'var(--color-critical)', fontFamily: 'JetBrains Mono' }}>
                            {m.structuredData.expectedStockout}
                          </strong>
                        </div>

                        <div style={{ color: 'var(--color-green-deep)', fontWeight: 600 }}>
                          <span>Recommended redistribution: </span>
                          <strong style={{ fontFamily: 'JetBrains Mono' }}>
                            {m.structuredData.recommendedRedistribution}
                          </strong>
                        </div>

                        <button
                          onClick={() => onNavigateToView?.('inventory')}
                          className="ag-btn-primary"
                          style={{ marginTop: 6, width: 'fit-content', padding: '4px 10px', fontSize: 11.5 }}
                        >
                          Execute Redistribution Order
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Prompts Chips (Exact Section 12 Spec) */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 12, borderTop: '1px solid var(--border-subtle)', paddingTop: 10 }}>
            {quickPrompts.map((p) => (
              <button
                key={p}
                onClick={() => handleSend(p)}
                style={{
                  padding: '5px 11px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-default)',
                  fontSize: 11.5,
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  transition: 'all 0.12s ease',
                }}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Chat Input */}
          <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
            <input
              type="text"
              placeholder="Ask Arogya Copilot regarding medicine stocks, routes, or simulations..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              style={{
                flex: 1,
                padding: '9px 14px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-default)',
                background: '#FFFFFF',
                fontSize: 13,
                outline: 'none',
              }}
            />
            <button
              onClick={() => handleSend()}
              className="ag-btn-primary"
              style={{ padding: '0 16px' }}
            >
              <Send size={15} />
            </button>
          </div>
        </div>

        {/* Right: LIVE CONTEXT Panel (Section 12 Spec: LIVE DATA, Forecast, Inventory, Routes, Facilities) */}
        <div className="ag-card" style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 14, overflowY: 'auto' }}>
          <div style={{ borderBottom: '1px solid var(--border-default)', paddingBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div>
              <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'JetBrains Mono' }}>
                LIVE CONTEXT INSPECTOR
              </span>
              <h3 style={{ fontSize: 14.5, fontWeight: 800, color: 'var(--text-primary)', marginTop: 2, margin: 0 }}>
                {activeContextDistrict}
              </h3>
            </div>
            <RiskBadge level="HIGH" />
          </div>

          {/* 1. LIVE DATA / FORECAST */}
          <div style={{ padding: '10px 12px', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 10.5, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'JetBrains Mono' }}>
                1. FORECAST TELEMETRY
              </span>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-critical)', fontFamily: 'JetBrains Mono' }}>
                +31% Surge
              </span>
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-primary)', margin: 0 }}>
              Amoxicillin predicted requirement: <strong>48,320 units</strong>. Local deficit: 16,480 units.
            </p>
          </div>

          {/* 2. INVENTORY */}
          <div style={{ padding: '10px 12px', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 10.5, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'JetBrains Mono' }}>
                2. INVENTORY STATUS
              </span>
              <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Vijayawada WH</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginTop: 4 }}>
              <span>Available stock:</span>
              <strong style={{ fontFamily: 'JetBrains Mono' }}>4,280 units</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginTop: 2 }}>
              <span>Days of Stock:</span>
              <strong style={{ color: 'var(--color-critical)', fontFamily: 'JetBrains Mono' }}>1.8 days</strong>
            </div>
          </div>

          {/* 3. ROUTES */}
          <div style={{ padding: '10px 12px', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 10.5, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'JetBrains Mono' }}>
                3. SUPPLY ROUTES
              </span>
              <span className="ag-badge ag-badge-stable">FASTag Green Lane</span>
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-primary)', margin: 0 }}>
              Guntur → Vijayawada transit: <strong>1h 45m</strong> (Reliability: 94%). Clear corridor.
            </p>
          </div>

          {/* 4. FACILITIES */}
          <div style={{ padding: '10px 12px', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 10.5, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'JetBrains Mono' }}>
                4. CRITICAL FACILITIES
              </span>
              <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>54 Facilities</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 11.5, marginTop: 4 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Krishna District General Hospital:</span>
                <strong style={{ color: 'var(--color-warning)' }}>388/450 Beds</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Vijayawada PHC-04:</span>
                <strong style={{ color: 'var(--color-critical)' }}>18h Stockout Risk</strong>
              </div>
            </div>
          </div>

          {/* Direct navigation shortcuts */}
          <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
            <button
              onClick={() => onNavigateToView?.('inventory')}
              className="ag-btn-secondary"
              style={{ flex: 1, justifyContent: 'center', fontSize: 11.5 }}
            >
              Open Inventory Table
            </button>
            <button
              onClick={() => onNavigateToView?.('supply-network')}
              className="ag-btn-secondary"
              style={{ flex: 1, justifyContent: 'center', fontSize: 11.5 }}
            >
              Open Corridors
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
