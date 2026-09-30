import React, { useState } from 'react';
import {
  AlertTriangle, ShieldAlert, CheckCircle2, Clock,
  Users, Bed, Pill, Truck, Home, ArrowRight, Activity,
  Download, Send, Shield, RefreshCw
} from 'lucide-react';
import { StatusBadge, RiskBadge, AIRecommendation } from '../components/design-system';

interface TimelineMilestone {
  id: string;
  label: string;
  sub: string;
  demandSurge: string;
  bedsNeeded: number;
  medsUnits: number;
  personnelCount: number;
  shelterCount: number;
  focus: string;
  status: 'Completed' | 'Active Stage' | 'Projected';
}

const TIMELINE_STAGES: TimelineMilestone[] = [
  {
    id: 'T-24h',
    label: 'T-24h',
    sub: 'Pre-positioning',
    demandSurge: '+15%',
    bedsNeeded: 240,
    medsUnits: 12000,
    personnelCount: 45,
    shelterCount: 18,
    focus: 'Stock transfer of ORS, trauma suture kits, and anti-venom to coastal hubs.',
    status: 'Completed',
  },
  {
    id: 'T-12h',
    label: 'T-12h',
    sub: 'Evacuation Surge',
    demandSurge: '+28%',
    bedsNeeded: 460,
    medsUnits: 24000,
    personnelCount: 82,
    shelterCount: 28,
    focus: 'Coastal population movement into shelter wards. Dialysis patient transfers.',
    status: 'Completed',
  },
  {
    id: 'T-6h',
    label: 'T-6h',
    sub: 'Landfall Warning',
    demandSurge: '+42%',
    bedsNeeded: 680,
    medsUnits: 36000,
    personnelCount: 104,
    shelterCount: 36,
    focus: 'High tide window. Emergency generator test at 18 coastal hospitals.',
    status: 'Completed',
  },
  {
    id: 'T-0',
    label: 'T-0',
    sub: 'Landfall Event',
    demandSurge: '+64%',
    bedsNeeded: 850,
    medsUnits: 48000,
    personnelCount: 124,
    shelterCount: 42,
    focus: 'Direct coastal impact. Severe wind & storm surge. Trauma triage active.',
    status: 'Active Stage',
  },
  {
    id: 'T+6h',
    label: 'T+6h',
    sub: 'Post-Flood Trauma',
    demandSurge: '+48%',
    bedsNeeded: 720,
    medsUnits: 38000,
    personnelCount: 110,
    shelterCount: 42,
    focus: 'Road clearing underway. Helicopter medical drops to isolated PHCs.',
    status: 'Projected',
  },
  {
    id: 'T+24h',
    label: 'T+24h',
    sub: 'Waterborne Epidemic Prevention',
    demandSurge: '+35%',
    bedsNeeded: 510,
    medsUnits: 28000,
    personnelCount: 95,
    shelterCount: 35,
    focus: 'Water chlorination tablets & cholera prophylaxis distribution.',
    status: 'Projected',
  },
];

export const EmergencyOperationsView: React.FC = () => {
  const [isIncidentActive, setIsIncidentActive] = useState<boolean>(true);
  const [selectedStageId, setSelectedStageId] = useState<string>('T-0');
  const [mobilized, setMobilized] = useState<boolean>(false);

  const activeStage = TIMELINE_STAGES.find((s) => s.id === selectedStageId) || TIMELINE_STAGES[3];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* ── 1. HEADER (Section 9 Spec) ── */}
      <div
        className="ag-card"
        style={{
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
          borderLeft: isIncidentActive ? '6px solid var(--color-critical)' : '6px solid var(--color-green)',
          background: isIncidentActive ? '#FFFFFF' : '#FFFFFF',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'JetBrains Mono' }}>
              INCIDENT COMMAND SYSTEM · NDMA PROTOCOL
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              {isIncidentActive ? 'CYCLONE RESPONSE' : 'EMERGENCY OPERATIONS'}
            </h1>
            <span
              className={`ag-badge ${isIncidentActive ? 'ag-badge-critical' : 'ag-badge-stable'}`}
            >
              {isIncidentActive ? 'INCIDENT ID: AGR-2026-0930' : 'NORMAL OPERATIONS'}
            </span>
          </div>

          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 3, margin: 0 }}>
            {isIncidentActive
              ? 'Severe Cyclonic Storm in Bay of Bengal · Landfall sector: Krishna-Godavari Basin · High emergency posture'
              : 'All regional health infrastructure functioning in standard non-emergency baseline.'}
          </p>
        </div>

        {/* Button: ACTIVATE INCIDENT MODE */}
        <button
          onClick={() => setIsIncidentActive(!isIncidentActive)}
          style={{
            padding: '9px 18px',
            borderRadius: 'var(--radius-sm)',
            background: isIncidentActive ? '#FFFFFF' : 'var(--color-critical)',
            color: isIncidentActive ? 'var(--color-critical)' : '#FFFFFF',
            border: isIncidentActive ? '1px solid var(--color-critical-border)' : 'none',
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            boxShadow: isIncidentActive ? 'none' : '0 2px 4px rgba(220, 38, 38, 0.2)',
            transition: 'all 0.15s ease',
          }}
        >
          <AlertTriangle size={15} />
          <span>{isIncidentActive ? 'DEACTIVATE INCIDENT MODE' : 'ACTIVATE INCIDENT MODE'}</span>
        </button>
      </div>

      {isIncidentActive ? (
        <>
          {/* ── 2. SEVEN ESSENTIAL RESOURCE PILLARS (Exact Section 9 Spec) ── */}
          {/* Affected districts | Hospitals at risk | Medicine requirements | Beds | Personnel | Transport | Shelter facilities */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 12 }}>
            {/* 1. Affected Districts */}
            <div className="ag-card" style={{ padding: '14px 16px' }}>
              <span style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>
                Affected Districts
              </span>
              <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--color-critical)', fontFamily: 'JetBrains Mono', marginTop: 4 }}>
                3
              </div>
              <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2, margin: 0 }}>Krishna, Guntur, NTR</p>
            </div>

            {/* 2. Hospitals at Risk */}
            <div className="ag-card" style={{ padding: '14px 16px' }}>
              <span style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>
                Hospitals at Risk
              </span>
              <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--color-warning)', fontFamily: 'JetBrains Mono', marginTop: 4 }}>
                18
              </div>
              <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2, margin: 0 }}>Coastal flood plains</p>
            </div>

            {/* 3. Medicine Requirements */}
            <div className="ag-card" style={{ padding: '14px 16px' }}>
              <span style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>
                Medicine Needs
              </span>
              <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--color-critical)', fontFamily: 'JetBrains Mono', marginTop: 4 }}>
                +42%
              </div>
              <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2, margin: 0 }}>{activeStage.medsUnits.toLocaleString()} units</p>
            </div>

            {/* 4. Beds */}
            <div className="ag-card" style={{ padding: '14px 16px' }}>
              <span style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>
                Beds
              </span>
              <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--color-critical)', fontFamily: 'JetBrains Mono', marginTop: 4 }}>
                {activeStage.bedsNeeded}
              </div>
              <p style={{ fontSize: 11, color: 'var(--color-critical)', marginTop: 2, margin: 0, fontWeight: 600 }}>Deficit: -230 beds</p>
            </div>

            {/* 5. Personnel */}
            <div className="ag-card" style={{ padding: '14px 16px' }}>
              <span style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>
                Personnel
              </span>
              <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--color-green-deep)', fontFamily: 'JetBrains Mono', marginTop: 4 }}>
                {activeStage.personnelCount}
              </div>
              <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2, margin: 0 }}>Surge staff ready</p>
            </div>

            {/* 6. Transport */}
            <div className="ag-card" style={{ padding: '14px 16px' }}>
              <span style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>
                Transport
              </span>
              <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--color-blue)', fontFamily: 'JetBrains Mono', marginTop: 4 }}>
                34
              </div>
              <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2, margin: 0 }}>4x4 ALS Ambulances</p>
            </div>

            {/* 7. Shelter Facilities */}
            <div className="ag-card" style={{ padding: '14px 16px' }}>
              <span style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>
                Shelter Facilities
              </span>
              <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--text-green-deep)', fontFamily: 'JetBrains Mono', marginTop: 4 }}>
                {activeStage.shelterCount}
              </div>
              <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2, margin: 0 }}>Equipped with triage</p>
            </div>
          </div>

          {/* ── 3. TIMELINE: T-24h to T+24h (Exact Section 9 Spec) ── */}
          <div className="ag-card" style={{ padding: 22 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  INCIDENT CHRONOLOGY & RESOURCE TRAJECTORY
                </h2>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 1, margin: 0 }}>
                  Predicted resource requirements at each incident milestone
                </p>
              </div>
              <span className="ag-badge ag-badge-critical">
                Current Milestone: T-0 Landfall
              </span>
            </div>

            {/* 6 Timeline Stages */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 10 }}>
              {TIMELINE_STAGES.map((stage) => {
                const isSelected = selectedStageId === stage.id;
                const isCurrent = stage.id === 'T-0';

                return (
                  <div
                    key={stage.id}
                    onClick={() => setSelectedStageId(stage.id)}
                    style={{
                      padding: 14,
                      background: isSelected ? 'var(--color-green-light)' : 'var(--bg-surface-elevated)',
                      border: `1.5px solid ${isSelected ? 'var(--color-green)' : isCurrent ? 'var(--color-critical-border)' : 'var(--border-default)'}`,
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      position: 'relative',
                    }}
                  >
                    {isCurrent && (
                      <span
                        style={{
                          position: 'absolute',
                          top: -7,
                          right: 8,
                          fontSize: 8.5,
                          fontWeight: 800,
                          background: 'var(--color-critical)',
                          color: '#FFFFFF',
                          padding: '1px 5px',
                          borderRadius: 3,
                          fontFamily: 'JetBrains Mono',
                        }}
                      >
                        ACTIVE
                      </span>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span style={{ fontSize: 13, fontWeight: 800, color: isSelected ? 'var(--color-green-deep)' : 'var(--text-primary)', fontFamily: 'JetBrains Mono' }}>
                        {stage.label}
                      </span>
                      <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                        {stage.status}
                      </span>
                    </div>

                    <p style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--text-secondary)', marginTop: 2, margin: 0 }}>
                      {stage.sub}
                    </p>

                    <div style={{ marginTop: 10, paddingTop: 8, borderTop: '1px solid var(--border-default)', fontSize: 11, display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Demand:</span>
                        <strong style={{ color: 'var(--color-critical)', fontFamily: 'JetBrains Mono' }}>{stage.demandSurge}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Beds:</span>
                        <strong style={{ fontFamily: 'JetBrains Mono' }}>{stage.bedsNeeded}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Med Units:</span>
                        <strong style={{ fontFamily: 'JetBrains Mono' }}>{stage.medsUnits.toLocaleString()}</strong>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Stage Focus Banner */}
            <div style={{ marginTop: 16, padding: '12px 16px', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <span style={{ fontSize: 10.5, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'JetBrains Mono' }}>
                  OPERATIONAL DIRECTIVE FOR {activeStage.label} ({activeStage.sub})
                </span>
                <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginTop: 2, margin: 0 }}>
                  {activeStage.focus}
                </p>
              </div>

              <button
                onClick={() => setMobilized(true)}
                className="ag-btn-primary"
                style={{ padding: '7px 14px', fontSize: 12 }}
              >
                {mobilized ? <CheckCircle2 size={14} /> : <Send size={14} />}
                <span>{mobilized ? 'RESERVES MOBILIZED' : 'MOBILIZE STAGE RESERVES'}</span>
              </button>
            </div>
          </div>
        </>
      ) : (
        /* Empty / Calm Normal Operations State (Section 18) */
        <div
          className="ag-card"
          style={{
            padding: '60px 24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            gap: 14,
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: '50%',
              background: 'var(--color-green-light)',
              border: '1px solid var(--color-green-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-green)',
            }}
          >
            <Shield size={28} />
          </div>
          <div>
            <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              NO ACTIVE INCIDENTS
            </h3>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', maxWidth: 480, marginTop: 4, margin: '4px auto 0' }}>
              The healthcare network is operating normally within standard resilience thresholds. 694 primary health facilities reporting stable buffers.
            </p>
          </div>
          <button
            onClick={() => setIsIncidentActive(true)}
            className="ag-btn-secondary"
            style={{ marginTop: 8 }}
          >
            Simulate Cyclone Disaster Scenario
          </button>
        </div>
      )}
    </div>
  );
};
