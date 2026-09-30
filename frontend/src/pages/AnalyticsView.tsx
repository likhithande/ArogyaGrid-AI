import React from 'react';
import {
  BarChart3, TrendingUp, ShieldCheck, Activity,
  Clock, ArrowDownRight, ArrowUpRight, Download,
  CheckCircle2, DollarSign
} from 'lucide-react';
import { Metric } from '../components/design-system';

export const AnalyticsView: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* ── 1. HEADER (Section 14 Spec) ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: 0 }}>
            EXECUTIVE ANALYTICS
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2, margin: 0 }}>
            Healthcare resilience KPIs, stock-out prevention efficacy, and public pharmaceutical asset optimization
          </p>
        </div>

        <button className="ag-btn-secondary">
          <Download size={14} /> Export Dataset (CSV)
        </button>
      </div>

      {/* ── 2. SIX CORE EXECUTIVE KPIS (Exact Section 14 Spec) ── */}
      {/* Stock-out prevention | Resource utilization | Forecast accuracy | Response time | Inventory waste | Emergency readiness */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 14 }}>
        <div className="ag-card" style={{ padding: '16px 18px' }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Stock-out Prevention
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 6 }}>
            <span style={{ fontSize: 22, fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'JetBrains Mono' }}>
              96.4%
            </span>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-green)', display: 'flex', alignItems: 'center' }}>
              <ArrowUpRight size={13} /> +3.2%
            </span>
          </div>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4, margin: 0 }}>142 stockouts prevented</p>
        </div>

        <div className="ag-card" style={{ padding: '16px 18px' }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Resource Utilization
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 6 }}>
            <span style={{ fontSize: 22, fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'JetBrains Mono' }}>
              88.2%
            </span>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-green)', display: 'flex', alignItems: 'center' }}>
              <ArrowUpRight size={13} /> +4.1%
            </span>
          </div>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4, margin: 0 }}>Triage & bed balance</p>
        </div>

        <div className="ag-card" style={{ padding: '16px 18px' }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Forecast Accuracy
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 6 }}>
            <span style={{ fontSize: 22, fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'JetBrains Mono' }}>
              94.6%
            </span>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-green)', display: 'flex', alignItems: 'center' }}>
              <ArrowUpRight size={13} /> +1.5%
            </span>
          </div>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4, margin: 0 }}>MAPE &lt; 5.4% across NLEM</p>
        </div>

        <div className="ag-card" style={{ padding: '16px 18px' }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Response Time
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 6 }}>
            <span style={{ fontSize: 22, fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'JetBrains Mono' }}>
              1h 42m
            </span>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-green)', display: 'flex', alignItems: 'center' }}>
              <ArrowDownRight size={13} /> -28m
            </span>
          </div>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4, margin: 0 }}>Inter-facility dispatch</p>
        </div>

        <div className="ag-card" style={{ padding: '16px 18px' }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Inventory Waste
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 6 }}>
            <span style={{ fontSize: 22, fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'JetBrains Mono' }}>
              0.8%
            </span>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-green)', display: 'flex', alignItems: 'center' }}>
              <ArrowDownRight size={13} /> -3.4%
            </span>
          </div>
          <p style={{ fontSize: 11, color: 'var(--text-green-deep)', marginTop: 4, margin: 0, fontWeight: 600 }}>FEFO prevented expiry</p>
        </div>

        <div className="ag-card" style={{ padding: '16px 18px' }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Emergency Readiness
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 6 }}>
            <span style={{ fontSize: 22, fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'JetBrains Mono' }}>
              89.1%
            </span>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-green)', display: 'flex', alignItems: 'center' }}>
              <ArrowUpRight size={13} /> +2.0%
            </span>
          </div>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4, margin: 0 }}>Cyclone buffer index</p>
        </div>
      </div>

      {/* ── 3. SOPHISTICATED CHARTS THAT ANSWER EXECUTIVE QUESTIONS (Section 14 Spec) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Question 1: How many stockruptures did the platform prevent vs total potential disruptions? */}
        <div className="ag-card" style={{ padding: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                STOCKOUT MITIGATION EFFICACY
              </h2>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 1, margin: 0 }}>
                Question: Did automated redistribution successfully resolve predicted stockouts?
              </p>
            </div>
            <span className="ag-badge ag-badge-stable">96.4% Efficiency</span>
          </div>

          <div style={{ height: 210, display: 'flex', alignItems: 'flex-end', gap: 20, padding: '0 10px', borderBottom: '1px solid var(--border-default)' }}>
            {[
              { month: 'May 2026', total: 64, resolved: 58 },
              { month: 'Jun 2026', total: 82, resolved: 77 },
              { month: 'Jul 2026', total: 98, resolved: 93 },
              { month: 'Aug 2026', total: 116, resolved: 112 },
              { month: 'Sep 2026', total: 142, resolved: 137 },
            ].map((d) => (
              <div key={d.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{ width: '100%', display: 'flex', gap: 4, alignItems: 'flex-end', height: 160 }}>
                  <div
                    style={{
                      flex: 1,
                      height: `${(d.total / 150) * 100}%`,
                      background: '#CBD5E1',
                      borderRadius: '3px 3px 0 0',
                    }}
                    title={`Total Shortage Signals: ${d.total}`}
                  />
                  <div
                    style={{
                      flex: 1,
                      height: `${(d.resolved / 150) * 100}%`,
                      background: 'var(--color-green)',
                      borderRadius: '3px 3px 0 0',
                    }}
                    title={`Successfully Prevented: ${d.resolved}`}
                  />
                </div>
                <span style={{ fontSize: 11, color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono' }}>
                  {d.month.split(' ')[0]}
                </span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 12, fontSize: 11.5, fontWeight: 600 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 10, height: 10, background: '#CBD5E1', borderRadius: 2 }} />
              <span style={{ color: 'var(--text-secondary)' }}>Detected Stockout Signals (142)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 10, height: 10, background: 'var(--color-green)', borderRadius: 2 }} />
              <span style={{ color: 'var(--text-primary)' }}>Resolved via Inter-PHC Transfer (137)</span>
            </div>
          </div>
        </div>

        {/* Question 2: How much expired drug inventory was eliminated via FEFO redistribution? */}
        <div className="ag-card" style={{ padding: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                FEFO EXPIRATION WASTAGE REDUCTION
              </h2>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 1, margin: 0 }}>
                Question: What percentage of inventory expired before consumption?
              </p>
            </div>
            <span className="ag-badge ag-badge-stable">-76% Expiry Rate</span>
          </div>

          <div style={{ height: 210, display: 'flex', alignItems: 'flex-end', gap: 20, padding: '0 10px', borderBottom: '1px solid var(--border-default)' }}>
            {[
              { quarter: 'Q1 (Pre-AI)', rate: 4.2, saved: 'Baseline' },
              { quarter: 'Q2 (Pilot)', rate: 2.8, saved: '₹3.8 Cr' },
              { quarter: 'Q3 (Rollout)', rate: 1.4, saved: '₹8.4 Cr' },
              { quarter: 'Q4 (Current)', rate: 0.8, saved: '₹14.2 Cr' },
            ].map((q) => (
              <div key={q.quarter} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--color-green-deep)', fontFamily: 'JetBrains Mono' }}>
                  {q.rate}%
                </span>
                <div
                  style={{
                    width: '60%',
                    height: `${(q.rate / 5) * 140}px`,
                    background: q.rate <= 1.0 ? 'var(--color-green)' : 'var(--color-blue)',
                    borderRadius: '4px 4px 0 0',
                  }}
                />
                <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                  {q.quarter}
                </span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 12, padding: '10px 14px', background: 'var(--bg-surface-elevated)', borderRadius: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12 }}>
            <span style={{ color: 'var(--text-secondary)' }}>Cumulative public healthcare budget saved:</span>
            <strong style={{ fontSize: 14, color: 'var(--color-green-deep)', fontFamily: 'JetBrains Mono' }}>
              ₹14.2 Crores
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
};
