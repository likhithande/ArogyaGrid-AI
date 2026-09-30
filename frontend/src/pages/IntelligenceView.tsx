import React, { useState } from 'react';
import {
  Brain, AlertTriangle, ArrowRight, ShieldCheck, Activity,
  CheckCircle2, Clock, Filter, Search, Zap, ExternalLink
} from 'lucide-react';
import { RiskBadge, StatusBadge, AIRecommendation } from '../components/design-system';

interface IntelligenceEvent {
  id: string;
  time: string;
  category: 'SHORTAGE RISK' | 'SUPPLY DISRUPTION' | 'DEMAND ANOMALY' | 'COLD CHAIN BREACH';
  title: string;
  location: string;
  prediction: string;
  confidence: number;
  recommendation: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  actionView?: string;
}

const EVENTS: IntelligenceEvent[] = [
  {
    id: 'int-1',
    time: '09:41 IST',
    category: 'SHORTAGE RISK',
    title: 'Amoxicillin 500mg Stock Depletion Hazard',
    location: 'Krishna District · 54 Primary Health Centres',
    prediction: 'Predicted stock-out: 18 hours. Daily velocity accelerated +31%.',
    confidence: 91,
    recommendation: 'Transfer 420 units from Guntur Central Warehouse buffer within 12 hours.',
    severity: 'HIGH',
    actionView: 'inventory',
  },
  {
    id: 'int-2',
    time: '09:27 IST',
    category: 'SUPPLY DISRUPTION',
    title: 'NH-16 Coastal Corridor Severance at Eluru Bypass',
    location: 'National Highway 16 · km 42 Section',
    prediction: 'Estimated transit delay: 6 hours due to waterlogging from coastal depression.',
    confidence: 94,
    recommendation: 'Activate southern alternate feeder via Tenali. Reroute 14 active convoys.',
    severity: 'MEDIUM',
    actionView: 'supply-network',
  },
  {
    id: 'int-3',
    time: '09:10 IST',
    category: 'DEMAND ANOMALY',
    title: 'Paracetamol Demand Surge (+28%) in Vijayawada Cluster',
    location: 'Vijayawada Urban Cluster · 8 Primary Health Centres',
    prediction: 'Causal attribution: seasonal post-monsoon respiratory syndromic surge.',
    confidence: 88,
    recommendation: 'Pre-allocate 12,000 reserve blister packs from Guntur buffer depot.',
    severity: 'MEDIUM',
    actionView: 'forecasting',
  },
  {
    id: 'int-4',
    time: '08:42 IST',
    category: 'COLD CHAIN BREACH',
    title: 'Insulin Glargine Thermal Excursion (+6.8°C)',
    location: 'NTR District Cold Depot · Sub-Depot Unit 3',
    prediction: 'Ambient warming trend projecting +8.2°C breach within 4.5 hours if unassisted.',
    confidence: 96,
    recommendation: 'Engage auxiliary solar compressor unit and alert on-call technician.',
    severity: 'HIGH',
    actionView: 'cold-chain',
  },
];

export const IntelligenceView: React.FC<{
  onNavigateToView?: (viewId: string) => void;
  onOpenCopilot?: () => void;
}> = ({ onNavigateToView, onOpenCopilot }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filtered = selectedCategory === 'All'
    ? EVENTS
    : EVENTS.filter(e => e.category === selectedCategory);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: 0 }}>
            INTELLIGENCE STREAM & RISK RADAR
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2, margin: 0 }}>
            Real-time autonomous surveillance, causal anomaly explanation, and predictive intervention stream
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="ag-badge ag-badge-stable">● Real-time Stream Active</span>
          <button onClick={onOpenCopilot} className="ag-btn-primary" style={{ padding: '6px 14px', fontSize: 12 }}>
            <Zap size={13} /> Query Copilot
          </button>
        </div>
      </div>

      {/* Filter Chips */}
      <div style={{ display: 'flex', gap: 8, background: '#FFFFFF', padding: '6px 12px', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)' }}>
        {['All', 'SHORTAGE RISK', 'SUPPLY DISRUPTION', 'DEMAND ANOMALY', 'COLD CHAIN BREACH'].map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: '5px 12px',
              borderRadius: 4,
              background: selectedCategory === cat ? 'var(--color-green-light)' : 'transparent',
              border: `1px solid ${selectedCategory === cat ? 'var(--color-green-border)' : 'transparent'}`,
              color: selectedCategory === cat ? 'var(--color-green-deep)' : 'var(--text-secondary)',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Intelligence Timeline Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {filtered.map(event => {
          const isCrit = event.severity === 'HIGH';
          const borderColor = isCrit ? 'var(--color-critical)' : 'var(--color-warning)';

          return (
            <div
              key={event.id}
              className="ag-card"
              style={{
                padding: '18px 22px',
                borderLeft: `5px solid ${borderColor}`,
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 800, color: borderColor, fontFamily: 'JetBrains Mono' }}>
                    {event.time}
                  </span>
                  <span
                    className={`ag-badge ${
                      event.category === 'SHORTAGE RISK'
                        ? 'ag-badge-critical'
                        : event.category === 'SUPPLY DISRUPTION'
                        ? 'ag-badge-warning'
                        : 'ag-badge-blue'
                    }`}
                  >
                    {event.category}
                  </span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>·</span>
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-secondary)' }}>
                    {event.location}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 11.5, color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono' }}>
                    Confidence: <strong>{event.confidence}%</strong>
                  </span>
                  <RiskBadge level={event.severity} />
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  {event.title}
                </h3>
                <p style={{ fontSize: 13, color: isCrit ? 'var(--color-critical)' : 'var(--text-primary)', marginTop: 3, margin: 0, fontWeight: 500 }}>
                  {event.prediction}
                </p>
              </div>

              <div style={{ padding: '10px 14px', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--color-green-deep)', textTransform: 'uppercase', fontFamily: 'JetBrains Mono', display: 'block' }}>
                    RECOMMENDED COUNTERMEASURE
                  </span>
                  <p style={{ fontSize: 12.5, color: 'var(--text-primary)', marginTop: 2, margin: 0 }}>
                    {event.recommendation}
                  </p>
                </div>

                {event.actionView && (
                  <button
                    onClick={() => onNavigateToView?.(event.actionView!)}
                    className="ag-btn-primary"
                    style={{ padding: '6px 12px', fontSize: 12 }}
                  >
                    Review & Execute <ArrowRight size={13} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
