import React, { useState } from 'react';
import {
  Bell, AlertTriangle, AlertCircle, Info, CheckCircle2,
  Clock, MapPin, UserCheck, ShieldAlert, Filter, User, X
} from 'lucide-react';
import { RiskBadge, StatusBadge } from '../components/design-system';

export interface AlertItem {
  id: string;
  category: 'Critical' | 'Warning' | 'Information';
  time: string;
  location: string;
  issue: string;
  impact: string;
  aiRecommendation: string;
  status: 'Pending' | 'Acknowledged' | 'Assigned' | 'Resolved';
  assignedTo?: string;
}

const INITIAL_ALERTS: AlertItem[] = [
  {
    id: 'alt-1',
    category: 'Critical',
    time: '09:41 IST',
    location: 'Krishna District (Vijayawada)',
    issue: 'Imminent Stock-out: Amoxicillin 500mg (1.8 days remaining)',
    impact: 'High risk of antibiotic stock rupture across 54 primary health centres serving 4.5M population',
    aiRecommendation: 'Authorize immediate dispatch of 420 units from Guntur Central Warehouse buffer via FASTag corridor.',
    status: 'Pending',
  },
  {
    id: 'alt-2',
    category: 'Warning',
    time: '09:27 IST',
    location: 'NH-16 Corridor (Eluru Bypass)',
    issue: 'Severe Transport Delay (+6 hours) due to roadbed waterlogging',
    impact: '14 hospital supply convoys in transit delayed',
    aiRecommendation: 'Activate southern alternate feeder route via Tenali to avoid flooded highway section.',
    status: 'Acknowledged',
    assignedTo: 'Regional Logistics Division',
  },
  {
    id: 'alt-3',
    category: 'Warning',
    time: '09:12 IST',
    location: 'NTR District Cold Chain Sub-Depot Unit 3',
    issue: 'Cold-chain Temperature Excursion (+6.8°C recorded, threshold +8.0°C)',
    impact: '840 vials of Insulin Glargine at risk of biological degradation within 4 hours if power unassisted',
    aiRecommendation: 'Dispatch technician and switch to auxiliary solar microgrid compressor immediately.',
    status: 'Assigned',
    assignedTo: 'Cold Chain Engineering Unit',
  },
  {
    id: 'alt-4',
    category: 'Information',
    time: '08:50 IST',
    location: 'National Health Authority Gateway',
    issue: 'Automated 24h Resilience Model Retraining Complete',
    impact: 'Federated weights converged with 94.6% forecasting accuracy across 1,248 connected facility nodes',
    aiRecommendation: 'No action required. Model observatory telemetry updated and verified under DPDP Act.',
    status: 'Resolved',
    assignedTo: 'AI Core Operations',
  },
];

export const AlertCenterView: React.FC = () => {
  const [alerts, setAlerts] = useState<AlertItem[]>(INITIAL_ALERTS);
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Critical' | 'Warning' | 'Information'>('All');
  const [assigningAlertId, setAssigningAlertId] = useState<string | null>(null);
  const [assigneeName, setAssigneeName] = useState('');

  const handleStatusChange = (id: string, newStatus: AlertItem['status']) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );
  };

  const handleAssign = (id: string) => {
    if (!assigneeName.trim()) return;
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'Assigned', assignedTo: assigneeName } : a))
    );
    setAssigningAlertId(null);
    setAssigneeName('');
  };

  const filtered = alerts.filter(
    (a) => selectedFilter === 'All' || a.category === selectedFilter
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* ── 1. HEADER (Section 13 Spec) ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: 0 }}>
            ALERT CENTER
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2, margin: 0 }}>
            Intelligent triage for critical disruptions, supply chain stock-outs, and cold-chain temperature excursions
          </p>
        </div>

        {/* Filter categories: All | Critical | Warning | Information */}
        <div style={{ display: 'flex', gap: 6, background: '#FFFFFF', padding: 2, border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)' }}>
          {(['All', 'Critical', 'Warning', 'Information'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedFilter(cat)}
              style={{
                padding: '5px 12px',
                borderRadius: 4,
                background: selectedFilter === cat ? 'var(--color-green-light)' : 'transparent',
                border: 'none',
                color: selectedFilter === cat ? 'var(--color-green-deep)' : 'var(--text-secondary)',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── 2. ALERT STREAM CARDS (Section 13: Time, Location, Issue, Impact, AI recommendation, Status, Actions) ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.map((alert) => {
          const isCrit = alert.category === 'Critical';
          const isWarn = alert.category === 'Warning';
          const borderLeftColor = isCrit
            ? 'var(--color-critical)'
            : isWarn
            ? 'var(--color-warning)'
            : 'var(--color-blue)';

          return (
            <div
              key={alert.id}
              className="ag-card"
              style={{
                padding: '16px 20px',
                borderLeft: `5px solid ${borderLeftColor}`,
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}
            >
              {/* Alert Header Row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span
                    className={`ag-badge ${
                      isCrit ? 'ag-badge-critical' : isWarn ? 'ag-badge-warning' : 'ag-badge-blue'
                    }`}
                  >
                    {alert.category.toUpperCase()}
                  </span>

                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono' }}>
                    {alert.time}
                  </span>

                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>·</span>

                  <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <MapPin size={13} color="#64748B" /> {alert.location}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {alert.assignedTo && (
                    <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                      Assigned: <strong>{alert.assignedTo}</strong>
                    </span>
                  )}
                  <span
                    style={{
                      fontSize: 10.5,
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: 4,
                      background: alert.status === 'Resolved' ? 'var(--color-green-light)' : '#F1F5F9',
                      color: alert.status === 'Resolved' ? 'var(--color-green-deep)' : 'var(--text-secondary)',
                      fontFamily: 'JetBrains Mono',
                      textTransform: 'uppercase',
                    }}
                  >
                    {alert.status}
                  </span>
                </div>
              </div>

              {/* Issue & Impact */}
              <div>
                <h3 style={{ fontSize: 14.5, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  {alert.issue}
                </h3>
                <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', marginTop: 2, margin: 0 }}>
                  Impact: <strong>{alert.impact}</strong>
                </p>
              </div>

              {/* AI Recommendation Box */}
              <div
                style={{
                  padding: '8px 12px',
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 6,
                  fontSize: 12,
                  color: 'var(--text-primary)',
                }}
              >
                <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--color-green-deep)', textTransform: 'uppercase', fontFamily: 'JetBrains Mono', display: 'block', marginBottom: 2 }}>
                  AI RECOMMENDATION
                </span>
                {alert.aiRecommendation}
              </div>

              {/* Interactive Actions: Acknowledge | Assign | Resolve (Section 13 Spec) */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8, marginTop: 4 }}>
                {alert.status === 'Pending' && (
                  <button
                    onClick={() => handleStatusChange(alert.id, 'Acknowledged')}
                    className="ag-btn-secondary"
                    style={{ padding: '5px 12px', fontSize: 11.5 }}
                  >
                    Acknowledge
                  </button>
                )}

                {alert.status !== 'Resolved' && (
                  <button
                    onClick={() => setAssigningAlertId(alert.id)}
                    className="ag-btn-secondary"
                    style={{ padding: '5px 12px', fontSize: 11.5 }}
                  >
                    Assign
                  </button>
                )}

                {alert.status !== 'Resolved' ? (
                  <button
                    onClick={() => handleStatusChange(alert.id, 'Resolved')}
                    className="ag-btn-primary"
                    style={{ padding: '5px 12px', fontSize: 11.5 }}
                  >
                    Resolve
                  </button>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11.5, color: 'var(--color-green-deep)', fontWeight: 600 }}>
                    <CheckCircle2 size={14} color="var(--color-green)" /> Closed
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Assign Alert Modal ── */}
      {assigningAlertId && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(11, 18, 32, 0.4)',
            backdropFilter: 'blur(3px)',
          }}
          onClick={() => setAssigningAlertId(null)}
        >
          <div
            className="ag-card"
            style={{ width: '100%', maxWidth: 420, padding: 22, boxShadow: 'var(--shadow-dropdown)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h3 style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                Assign Response Team
              </h3>
              <button onClick={() => setAssigningAlertId(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                <X size={16} />
              </button>
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 10 }}>
              Select department or regional authority responsible for resolving this disruption.
            </p>
            <input
              type="text"
              placeholder="e.g. District CMO Office, Logistics Fleet B, Cold Chain Unit"
              value={assigneeName}
              onChange={(e) => setAssigneeName(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-default)',
                fontSize: 13,
                outline: 'none',
                marginBottom: 14,
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button onClick={() => setAssigningAlertId(null)} className="ag-btn-secondary">
                Cancel
              </button>
              <button onClick={() => handleAssign(assigningAlertId)} className="ag-btn-primary">
                Confirm Assignment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
