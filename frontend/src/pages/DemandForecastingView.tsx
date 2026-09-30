import React, { useState } from 'react';
import {
  TrendingUp, Download, Sparkles, AlertTriangle, ArrowRight,
  ChevronDown, Info, Calendar, Activity, CheckCircle2
} from 'lucide-react';
import { PageHeader, Metric, RiskBadge, AIRecommendation } from '../components/design-system';

interface DemandForecastingViewProps {
  onNavigateToView?: (viewId: string) => void;
  onOpenCopilot?: () => void;
}

export const DemandForecastingView: React.FC<DemandForecastingViewProps> = ({
  onNavigateToView,
  onOpenCopilot,
}) => {
  const [selectedMedicine, setSelectedMedicine] = useState('Amoxicillin 500mg');
  const [selectedHorizon, setSelectedHorizon] = useState<'24H' | '7D' | '30D' | '90D'>('7D');
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  // 7-day data points for Amoxicillin trajectory
  const points = [
    { label: 'Day 1 (Actual)', day: '24 Sep', actual: 4200, forecast: 4250, ciLow: 3950, ciHigh: 4550, isActual: true },
    { label: 'Day 2 (Actual)', day: '25 Sep', actual: 4450, forecast: 4500, ciLow: 4150, ciHigh: 4850, isActual: true },
    { label: 'Day 3 (Actual)', day: '26 Sep', actual: 4800, forecast: 4900, ciLow: 4500, ciHigh: 5300, isActual: true },
    { label: 'Day 4 (Today)', day: '27 Sep', actual: 5320, forecast: 5400, ciLow: 4950, ciHigh: 5850, isActual: true },
    { label: 'Day 5 (Forecast)', day: '28 Sep', actual: null, forecast: 6150, ciLow: 5600, ciHigh: 6700, isActual: false },
    { label: 'Day 6 (Forecast)', day: '29 Sep', actual: null, forecast: 6900, ciLow: 6250, ciHigh: 7550, isActual: false },
    { label: 'Day 7 (Peak Shortage)', day: '30 Sep', actual: null, forecast: 7420, ciLow: 6680, ciHigh: 8160, isActual: false },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* ── 1. HEADER (Section 6) ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: 0 }}>
            DEMAND INTELLIGENCE
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2, margin: 0 }}>
            Predict medicine requirements before shortages occur.
          </p>
        </div>

        {/* Medicine Selector & Time Horizon Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <select
            value={selectedMedicine}
            onChange={(e) => setSelectedMedicine(e.target.value)}
            style={{
              padding: '7px 12px',
              borderRadius: 'var(--radius-sm)',
              background: '#FFFFFF',
              border: '1px solid var(--border-default)',
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--text-primary)',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            <option>Amoxicillin 500mg</option>
            <option>Paracetamol 650mg</option>
            <option>Insulin Glargine 100IU</option>
            <option>ORS Electrolyte Sachets</option>
            <option>Azithromycin 500mg</option>
          </select>

          {/* Time Selector: 24H | 7D | 30D | 90D */}
          <div
            style={{
              display: 'flex',
              background: '#FFFFFF',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-sm)',
              padding: 2,
            }}
          >
            {(['24H', '7D', '30D', '90D'] as const).map((h) => (
              <button
                key={h}
                onClick={() => setSelectedHorizon(h)}
                style={{
                  padding: '5px 12px',
                  borderRadius: 4,
                  background: selectedHorizon === h ? 'var(--color-green-light)' : 'transparent',
                  border: 'none',
                  color: selectedHorizon === h ? 'var(--color-green-deep)' : 'var(--text-secondary)',
                  fontSize: 12,
                  fontWeight: 700,
                  fontFamily: 'JetBrains Mono, monospace',
                  cursor: 'pointer',
                }}
              >
                {h}
              </button>
            ))}
          </div>

          <button className="ag-btn-secondary">
            <Download size={14} /> Export Forecast
          </button>
        </div>
      </div>

      {/* ── 2. MAIN CHART: ACTUAL DEMAND, FORECAST DEMAND, CONFIDENCE INTERVAL (Section 6) ── */}
      <div className="ag-card" style={{ padding: 22 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
          <div>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              {selectedMedicine.toUpperCase()} · DEMAND TRAJECTORY & 95% CONFIDENCE BAND
            </h2>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 1, margin: 0 }}>
              Actual historical consumption (solid blue) vs forecast trajectory (dashed green)
            </p>
          </div>

          {/* Chart Legend */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 11, fontWeight: 600 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 14, height: 3, background: 'var(--color-blue)', borderRadius: 2 }} />
              <span>Actual Demand</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 14, height: 3, background: 'var(--color-green)', borderTop: '2px dashed var(--color-green)' }} />
              <span>Forecast Demand</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 14, height: 8, background: 'rgba(11,143,106,0.12)', borderRadius: 2 }} />
              <span>Confidence Interval (95%)</span>
            </div>
          </div>
        </div>

        {/* Clean Analytical Chart */}
        <div style={{ height: 260, position: 'relative' }}>
          <svg width="100%" height="220" viewBox="0 0 700 220" style={{ overflow: 'visible' }}>
            {/* Grid Lines */}
            {[40, 85, 130, 175].map((y, idx) => (
              <g key={y}>
                <line x1="0" y1={y} x2="700" y2={y} stroke="#F1F5F9" strokeWidth="1" />
                <text x="696" y={y - 4} textAnchor="end" fontSize="9" fill="#94A3B8" fontFamily="JetBrains Mono">
                  {(8000 - idx * 1500).toLocaleString()} u
                </text>
              </g>
            ))}

            {/* Confidence Interval Polygon */}
            <polygon
              points="0,175 116,165 233,148 350,126 466,94 583,66 700,42 700,102 583,124 466,146 350,168 233,184 116,196 0,206"
              fill="rgba(11, 143, 106, 0.08)"
            />

            {/* Forecast Line (Dashed Green across all 7 days) */}
            <polyline
              points="0,190 116,180 233,165 350,147 466,120 583,95 700,72"
              fill="none"
              stroke="#0B8F6A"
              strokeWidth="2.5"
              strokeDasharray="6 4"
            />

            {/* Actual Demand Line (Solid Blue, Days 1-4) */}
            <polyline
              points="0,192 116,182 233,168 350,146"
              fill="none"
              stroke="#2563EB"
              strokeWidth="2.5"
            />

            {/* Threshold safety buffer line */}
            <line x1="0" y1="135" x2="700" y2="135" stroke="#DC2626" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.6" />
            <text x="8" y="130" fill="#DC2626" fontSize="9" fontWeight="700" fontFamily="JetBrains Mono">
              CRITICAL STOCK-OUT THRESHOLD (5,800 u/day)
            </text>

            {/* Actual Data Points (Days 1 to 4) */}
            {[
              { x: 0, y: 192, val: 4200 },
              { x: 116, y: 182, val: 4450 },
              { x: 233, y: 168, val: 4800 },
              { x: 350, y: 146, val: 5320 },
            ].map((pt, i) => (
              <g key={i} onMouseEnter={() => setHoveredPoint(i)} onMouseLeave={() => setHoveredPoint(null)} style={{ cursor: 'pointer' }}>
                <circle cx={pt.x} cy={pt.y} r="4.5" fill="#FFFFFF" stroke="#2563EB" strokeWidth="2.5" />
              </g>
            ))}

            {/* Forecast Data Points (Days 5 to 7) */}
            {[
              { x: 466, y: 120, val: 6150 },
              { x: 583, y: 95, val: 6900 },
              { x: 700, y: 72, val: 7420 },
            ].map((pt, i) => (
              <g key={i + 4} onMouseEnter={() => setHoveredPoint(i + 4)} onMouseLeave={() => setHoveredPoint(null)} style={{ cursor: 'pointer' }}>
                <circle cx={pt.x} cy={pt.y} r="4.5" fill="#FFFFFF" stroke="#0B8F6A" strokeWidth="2.5" />
              </g>
            ))}
          </svg>

          {/* X Axis Day Labels */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, fontSize: 11, color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono' }}>
            {points.map((p, idx) => (
              <div
                key={p.day}
                style={{
                  textAlign: idx === 0 ? 'left' : idx === points.length - 1 ? 'right' : 'center',
                  fontWeight: p.actual ? 700 : 500,
                  color: p.actual ? 'var(--text-primary)' : 'var(--color-green-deep)',
                }}
              >
                <div>{p.day}</div>
                <div style={{ fontSize: 9.5, color: 'var(--text-muted)' }}>
                  {p.actual ? `${p.actual} u` : `~${p.forecast} u`}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 3. BELOW CHART METRICS (Exact Section 6 Spec) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14 }}>
        {/* Predicted demand: 48,320 units */}
        <div className="ag-card" style={{ padding: '14px 18px' }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Predicted Demand
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 4 }}>
            <span style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'JetBrains Mono' }}>
              48,320
            </span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>units</span>
          </div>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2, margin: 0 }}>7-day projected need</p>
        </div>

        {/* Current stock: 31,840 */}
        <div className="ag-card" style={{ padding: '14px 18px' }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Current Stock
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 4 }}>
            <span style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'JetBrains Mono' }}>
              31,840
            </span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>units</span>
          </div>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2, margin: 0 }}>Across 54 facility bins</p>
        </div>

        {/* Coverage: 4.7 days */}
        <div className="ag-card" style={{ padding: '14px 18px' }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Coverage
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 4 }}>
            <span style={{ fontSize: 24, fontWeight: 900, color: 'var(--color-warning)', fontFamily: 'JetBrains Mono' }}>
              4.7
            </span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>days</span>
          </div>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2, margin: 0 }}>Target buffer: &gt;10 days</p>
        </div>

        {/* Expected shortage: 18 hours */}
        <div className="ag-card" style={{ padding: '14px 18px' }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Expected Shortage
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 4 }}>
            <span style={{ fontSize: 24, fontWeight: 900, color: 'var(--color-critical)', fontFamily: 'JetBrains Mono' }}>
              18
            </span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>hours</span>
          </div>
          <p style={{ fontSize: 11, color: 'var(--color-critical)', marginTop: 2, margin: 0, fontWeight: 600 }}>At Vijayawada rural cluster</p>
        </div>

        {/* Confidence: 91% */}
        <div className="ag-card" style={{ padding: '14px 18px' }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Confidence
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 4 }}>
            <span style={{ fontSize: 24, fontWeight: 900, color: 'var(--color-green)', fontFamily: 'JetBrains Mono' }}>
              91%
            </span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>grounded</span>
          </div>
          <p style={{ fontSize: 11, color: 'var(--color-green-deep)', marginTop: 2, margin: 0, fontWeight: 600 }}>High predictive accuracy</p>
        </div>
      </div>

      {/* ── 4. WHY IS DEMAND CHANGING? (Exact Section 6 Spec) ── */}
      <div className="ag-card" style={{ padding: 22 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              WHY IS DEMAND CHANGING?
            </h2>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 1, margin: 0 }}>
              AI causal Shapley factor attribution decomposing regional consumption surge
            </p>
          </div>
          <span className="ag-badge ag-badge-stable">
            Explainable AI · Deterministic Attribution
          </span>
        </div>

        {/* 4 Attribution Cards: +14%, +8%, +6%, -3% */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          {[
            {
              percentage: '+14%',
              title: 'Seasonal trend',
              description: 'Monsoon enteric and bacterial infection curve consistent with coastal post-rain pattern.',
              color: 'var(--color-critical)',
            },
            {
              percentage: '+8%',
              title: 'Regional outbreak signal',
              description: 'Syndromic clustering detected across 6 primary health centers in Vijayawada rural.',
              color: 'var(--color-warning)',
            },
            {
              percentage: '+6%',
              title: 'Hospital admissions',
              description: 'Inpatient pediatric admissions elevated at Krishna District General Hospital.',
              color: 'var(--color-blue)',
            },
            {
              percentage: '-3%',
              title: 'Historical adjustment',
              description: 'Statistical baseline normalization for buffer accumulation during prior distribution cycle.',
              color: 'var(--color-green)',
            },
          ].map((item) => (
            <div
              key={item.title}
              style={{
                padding: '16px',
                background: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
                  {item.title}
                </span>
                <span style={{ fontSize: 18, fontWeight: 900, color: item.color, fontFamily: 'JetBrains Mono' }}>
                  {item.percentage}
                </span>
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* Recommended Action Box */}
        <div style={{ marginTop: 16 }}>
          <AIRecommendation
            title="AUTOMATED REDISTRIBUTION RECOMMENDATION"
            recommendation="Transfer 420 units of Amoxicillin 500mg from Guntur Central Warehouse buffer to Vijayawada PHC-04 within 12 hours."
            impactExplanation="Eliminates the projected 18-hour stock rupture while keeping supplying warehouse inventory at a safe 14.8-day buffer."
            confidence={91}
            actionText="Initiate Transfer Order"
            onAction={() => onNavigateToView?.('inventory')}
          />
        </div>
      </div>
    </div>
  );
};
