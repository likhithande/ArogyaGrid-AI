import React, { useState } from 'react';
import {
  Cpu, GitFork, Play, Download, CheckCircle2,
  AlertTriangle, ArrowRight, Sliders, RefreshCw, X, FileText
} from 'lucide-react';
import { AIRecommendation } from '../components/design-system';

export const DigitalTwinView: React.FC = () => {
  const [event, setEvent] = useState('Cyclone');
  const [severity, setSeverity] = useState('High');
  const [duration, setDuration] = useState('72 hours');
  const [region, setRegion] = useState('Andhra Pradesh');
  const [demandMultiplier, setDemandMultiplier] = useState(1.35);
  const [transportDisruption, setTransportDisruption] = useState(40);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isPlanApplied, setIsPlanApplied] = useState(false);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
    }, 400);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* ── 1. HEADER (Section 10 Spec) ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: 0 }}>
            HEALTHCARE DIGITAL TWIN
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2, margin: 0 }}>
            Simulate the healthcare network before acting in the real world.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="ag-badge ag-badge-blue">
            Model: Monte Carlo (10,000 Iterations)
          </span>
        </div>
      </div>

      {/* ── 2. SCENARIO BUILDER (LEFT) + LIVE SIMULATION (RIGHT) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 20 }}>
        {/* Left: Scenario Builder (Section 10 Spec) */}
        <div className="ag-card" style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-default)', paddingBottom: 10 }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'JetBrains Mono' }}>
              SCENARIO BUILDER
            </span>
            <Sliders size={15} color="#64748B" />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Event: Cyclone */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>Event</label>
              <select
                value={event}
                onChange={(e) => setEvent(e.target.value)}
                style={{ width: '100%', marginTop: 4, padding: '7px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-default)', background: '#FFFFFF', fontSize: 12.5, fontWeight: 600, color: 'var(--text-primary)' }}
              >
                <option>Cyclone</option>
                <option>Epidemic Outbreak</option>
                <option>NH-16 Highway Severance</option>
                <option>Active Pharmaceutical Factory Closure</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {/* Severity: High */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>Severity</label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value)}
                  style={{ width: '100%', marginTop: 4, padding: '7px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-default)', background: '#FFFFFF', fontSize: 12.5, fontWeight: 600, color: 'var(--text-primary)' }}
                >
                  <option>Critical</option>
                  <option>High</option>
                  <option>Moderate</option>
                  <option>Low</option>
                </select>
              </div>

              {/* Duration: 72 hours */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>Duration</label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  style={{ width: '100%', marginTop: 4, padding: '7px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-default)', background: '#FFFFFF', fontSize: 12.5, fontWeight: 600, color: 'var(--text-primary)' }}
                >
                  <option>24 hours</option>
                  <option>48 hours</option>
                  <option>72 hours</option>
                  <option>7 days</option>
                </select>
              </div>
            </div>

            {/* Affected region: Andhra Pradesh */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>Affected region</label>
              <input
                type="text"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                style={{ width: '100%', marginTop: 4, padding: '7px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-default)', background: '#FFFFFF', fontSize: 12.5, fontWeight: 600, color: 'var(--text-primary)' }}
              />
            </div>

            {/* Demand multiplier: 1.35x */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Demand multiplier</span>
                <strong style={{ fontFamily: 'JetBrains Mono', color: 'var(--color-critical)' }}>{demandMultiplier}×</strong>
              </div>
              <input
                type="range"
                min="1.0"
                max="2.5"
                step="0.05"
                value={demandMultiplier}
                onChange={(e) => setDemandMultiplier(parseFloat(e.target.value))}
                style={{ width: '100%', marginTop: 6, accentColor: 'var(--color-green)' }}
              />
            </div>

            {/* Transport disruption: 40% */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Transport disruption</span>
                <strong style={{ fontFamily: 'JetBrains Mono', color: 'var(--color-warning)' }}>{transportDisruption}%</strong>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={transportDisruption}
                onChange={(e) => setTransportDisruption(parseInt(e.target.value))}
                style={{ width: '100%', marginTop: 6, accentColor: 'var(--color-warning)' }}
              />
            </div>

            <button
              onClick={handleRunSimulation}
              className="ag-btn-primary"
              style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}
            >
              {isSimulating ? <RefreshCw className="animate-spin" size={14} /> : <Play size={14} />}
              <span>{isSimulating ? 'Executing Monte Carlo…' : 'Run Simulation'}</span>
            </button>
          </div>
        </div>

        {/* Right: Live Simulation Visualization (Section 10 Spec) */}
        <div className="ag-card" style={{ padding: 22, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                LIVE SIMULATION
              </h2>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 1, margin: 0 }}>
                Real-time topological stress distribution and corridor capacity throttling
              </p>
            </div>
            <span className="ag-badge ag-badge-stable">Model Equilibrium Active</span>
          </div>

          <div
            style={{
              flex: 1,
              background: '#F8FAFC',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-sm)',
              minHeight: 290,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <svg width="100%" height="290" viewBox="0 0 460 290">
              <defs>
                <pattern id="twin-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#E2E8F0" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="460" height="290" fill="url(#twin-grid)" />

              {/* Central Supply Hub */}
              <circle cx="230" cy="145" r="28" fill="#FFFFFF" stroke="#0B8F6A" strokeWidth="3" />
              <text x="230" y="142" textAnchor="middle" fontSize="10.5" fontWeight="800" fill="#075E4F">CENTRAL</text>
              <text x="230" y="154" textAnchor="middle" fontSize="8.5" fontWeight="600" fill="#64748B">RESERVE</text>

              {/* Surrounding stressed district nodes */}
              {[
                { x: 90, y: 70, label: 'Krishna', stress: `+${Math.round(demandMultiplier * 24)}% Surge`, color: '#DC2626', sub: 'Shortage 18h' },
                { x: 370, y: 70, label: 'Guntur', stress: `+${Math.round(demandMultiplier * 16)}% Surge`, color: '#D97706', sub: 'Oxygen 4.1d' },
                { x: 80, y: 220, label: 'NTR Hub', stress: 'Cold Warning', color: '#D97706', sub: 'Insulin +6.8°C' },
                { x: 380, y: 220, label: 'Vizag', stress: 'Normal', color: '#0B8F6A', sub: '>15d Buffer' },
              ].map((n) => (
                <g key={n.label}>
                  <line
                    x1="230"
                    y1="145"
                    x2={n.x}
                    y2={n.y}
                    stroke={n.color}
                    strokeWidth="2"
                    strokeDasharray={transportDisruption > 30 ? '5 3' : 'none'}
                  />
                  <circle cx={n.x} cy={n.y} r="18" fill="#FFFFFF" stroke={n.color} strokeWidth="2.5" />
                  <text x={n.x} y={n.y + 28} textAnchor="middle" fontSize="11" fontWeight="700" fill="#0B1220">{n.label}</text>
                  <text x={n.x} y={n.y + 40} textAnchor="middle" fontSize="9.5" fontWeight="600" fill={n.color}>{n.stress}</text>
                </g>
              ))}
            </svg>
          </div>
        </div>
      </div>

      {/* ── 3. SIMULATION RESULTS (Section 10 Spec) ── */}
      {/* Medicine shortage: -31% | Hospital overload: +18% | Transport delay: +42% | Unserved patients: -64% */}
      <div className="ag-card" style={{ padding: 22 }}>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 14, margin: '0 0 14px 0' }}>
          SIMULATION RESULTS
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 18 }}>
          <div style={{ padding: '14px 16px', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)' }}>
            <span style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600 }}>Medicine shortage</span>
            <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--color-critical)', fontFamily: 'JetBrains Mono', marginTop: 4 }}>
              -31%
            </div>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2, margin: 0 }}>Unmitigated across 54 PHCs</p>
          </div>

          <div style={{ padding: '14px 16px', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)' }}>
            <span style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600 }}>Hospital overload</span>
            <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--color-warning)', fontFamily: 'JetBrains Mono', marginTop: 4 }}>
              +18%
            </div>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2, margin: 0 }}>Bed occupancy exceeding limit</p>
          </div>

          <div style={{ padding: '14px 16px', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)' }}>
            <span style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600 }}>Transport delay</span>
            <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--color-warning)', fontFamily: 'JetBrains Mono', marginTop: 4 }}>
              +42%
            </div>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2, margin: 0 }}>Due to {transportDisruption}% corridor throttling</p>
          </div>

          <div style={{ padding: '14px 16px', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)' }}>
            <span style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600 }}>Unserved patients</span>
            <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--color-green-deep)', fontFamily: 'JetBrains Mono', marginTop: 4 }}>
              -64%
            </div>
            <p style={{ fontSize: 11, color: 'var(--color-green-deep)', marginTop: 2, margin: 0, fontWeight: 600 }}>With AI redistribution plan</p>
          </div>
        </div>

        {/* AI RECOMMENDATION (Section 10 Spec) */}
        {/* "Redistributing 18,400 units across 7 districts reduces projected shortage by 64%." */}
        <div
          style={{
            padding: '16px 20px',
            background: 'var(--color-green-light)',
            border: '1px solid var(--color-green-border)',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          <div>
            <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--color-green-deep)', textTransform: 'uppercase', fontFamily: 'JetBrains Mono' }}>
              AI RECOMMENDATION
            </span>
            <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-green-deep)', marginTop: 2, margin: 0 }}>
              "Redistributing 18,400 units across 7 districts reduces projected shortage by 64%."
            </p>
            <p style={{ fontSize: 12, color: '#047857', marginTop: 2, margin: 0 }}>
              Zero supplying warehouse buffer violation. Complies with MoHFW national safety stock reserve standards.
            </p>
          </div>

          {/* Buttons: APPLY PLAN | COMPARE | EXPORT (Exact Section 10 Spec) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              onClick={() => setIsPlanApplied(true)}
              className="ag-btn-primary"
            >
              <CheckCircle2 size={14} />
              <span>{isPlanApplied ? 'PLAN COMMITTED' : 'APPLY PLAN'}</span>
            </button>

            <button
              onClick={() => setShowCompareModal(true)}
              className="ag-btn-secondary"
            >
              COMPARE
            </button>

            <button
              onClick={() => setShowExportModal(true)}
              className="ag-btn-secondary"
            >
              EXPORT
            </button>
          </div>
        </div>
      </div>

      {/* ── Compare Scenarios Modal ── */}
      {showCompareModal && (
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
          onClick={() => setShowCompareModal(false)}
        >
          <div
            className="ag-card"
            style={{ width: '100%', maxWidth: 580, padding: 24, boxShadow: 'var(--shadow-dropdown)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                Scenario Policy Comparison
              </h3>
              <button onClick={() => setShowCompareModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ padding: 14, background: 'var(--bg-surface-elevated)', borderRadius: 6 }}>
                <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-critical)' }}>Baseline (No Intervention)</h4>
                <div style={{ fontSize: 12, marginTop: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div>Shortage Duration: <strong>4.8 days</strong></div>
                  <div>Affected PHCs: <strong>54 facilities</strong></div>
                  <div>Unserved Patients: <strong>14,200</strong></div>
                </div>
              </div>

              <div style={{ padding: 14, background: 'var(--color-green-light)', border: '1px solid var(--color-green-border)', borderRadius: 6 }}>
                <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-green-deep)' }}>AI Countermeasure Plan</h4>
                <div style={{ fontSize: 12, marginTop: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div>Shortage Duration: <strong>0 hours (prevented)</strong></div>
                  <div>Affected PHCs: <strong>0 facilities</strong></div>
                  <div>Unserved Patients: <strong>&lt; 400 (triage resolved)</strong></div>
                </div>
              </div>
            </div>

            <button onClick={() => setShowCompareModal(false)} className="ag-btn-secondary" style={{ width: '100%', justifyContent: 'center', marginTop: 16 }}>
              Close Comparison
            </button>
          </div>
        </div>
      )}

      {/* ── Export Plan Modal ── */}
      {showExportModal && (
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
          onClick={() => setShowExportModal(false)}
        >
          <div
            className="ag-card"
            style={{ width: '100%', maxWidth: 460, padding: 24, boxShadow: 'var(--shadow-dropdown)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                Export Simulation Dossier
              </h3>
              <button onClick={() => setShowExportModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              Export full Monte Carlo simulation telemetry, dispatch routes, and district allocation plan.
            </p>
            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <button onClick={() => setShowExportModal(false)} className="ag-btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                <Download size={14} /> Download PDF Dossier
              </button>
              <button onClick={() => setShowExportModal(false)} className="ag-btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>
                Download CSV Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
