import React, { useState } from 'react';
import {
  X, AlertTriangle, ShieldAlert, Activity, Users, Building2,
  TrendingUp, Truck, CheckCircle2, ArrowRight, Play, Bot, FileText
} from 'lucide-react';

export interface IncidentItem {
  id: string;
  title: string;
  type: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  state: string;
  district: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  affectedHospitals: number;
  affectedPopulation: number;
  status: string;
  medicineDemandSurge?: string;
  transportDisruptionPct?: number;
  aiAssessment?: string;
  description: string;
  recommendedAction: string;
  isNew?: boolean;
}

interface IncidentDrawerProps {
  incident: IncidentItem | null;
  onClose: () => void;
  onRunResponsePlan?: (incident: IncidentItem) => void;
  onSimulateResponse?: (incident: IncidentItem) => void;
  onAssignAgent?: (incident: IncidentItem) => void;
  onViewHospitals?: (incident: IncidentItem) => void;
}

export const IncidentDrawer: React.FC<IncidentDrawerProps> = ({
  incident,
  onClose,
  onRunResponsePlan,
  onSimulateResponse,
  onAssignAgent,
  onViewHospitals
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'agents' | 'actions'>('details');
  const [isExecutingPlan, setIsExecutingPlan] = useState(false);
  const [executionSuccess, setExecutionSuccess] = useState(false);

  if (!incident) return null;

  const severityColor =
    incident.severity === 'CRITICAL' ? '#EF4444' :
    incident.severity === 'HIGH' ? '#F97316' :
    incident.severity === 'MEDIUM' ? '#F59E0B' : '#3B82F6';

  const severityBg =
    incident.severity === 'CRITICAL' ? '#FEF2F2' :
    incident.severity === 'HIGH' ? '#FFF7ED' :
    incident.severity === 'MEDIUM' ? '#FFFBEB' : '#EFF6FF';

  const handleCreatePlan = async () => {
    setIsExecutingPlan(true);
    if (onRunResponsePlan) {
      onRunResponsePlan(incident);
    }
    setTimeout(() => {
      setIsExecutingPlan(false);
      setExecutionSuccess(true);
    }, 1200);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        width: 440,
        maxWidth: '100vw',
        background: '#FFFFFF',
        boxShadow: '-4px 0 24px rgba(0, 0, 0, 0.15)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        borderLeft: '1px solid #E2E8F0',
        animation: 'slideInRight 0.25s ease-out'
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '16px 20px',
          borderBottom: '1px solid #E2E8F0',
          background: '#F8FAFC',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 12
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.05em',
                padding: '2px 8px',
                borderRadius: 4,
                color: severityColor,
                backgroundColor: severityBg,
                border: `1px solid ${severityColor}33`
              }}
            >
              {incident.severity}
            </span>
            <span style={{ fontSize: 12, color: '#64748B', fontWeight: 500 }}>
              {incident.id} · {incident.type}
            </span>
          </div>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: '#0F172A', margin: 0, lineHeight: 1.3 }}>
            {incident.title}
          </h2>
          <div style={{ fontSize: 13, color: '#475569', marginTop: 4, fontWeight: 500 }}>
            {incident.district}, <span style={{ fontWeight: 600, color: '#1E293B' }}>{incident.state}</span>
          </div>
        </div>

        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: '#64748B',
            cursor: 'pointer',
            padding: 4,
            borderRadius: 6,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <X size={18} />
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid #E2E8F0', background: '#FFFFFF' }}>
        {(['details', 'agents', 'actions'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              flex: 1,
              padding: '10px 0',
              fontSize: 12,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.03em',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === tab ? '2px solid #0284C7' : '2px solid transparent',
              color: activeTab === tab ? '#0284C7' : '#64748B',
              cursor: 'pointer'
            }}
          >
            {tab === 'details' ? 'Incident Details' : tab === 'agents' ? 'AI Agents' : 'Response Plan'}
          </button>
        ))}
      </div>

      {/* Body Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
        {activeTab === 'details' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* KPI Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8, padding: 12 }}>
                <div style={{ fontSize: 11, color: '#64748B', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Building2 size={13} /> Affected Hospitals
                </div>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#0F172A', marginTop: 4 }}>
                  {incident.affectedHospitals}
                </div>
              </div>

              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8, padding: 12 }}>
                <div style={{ fontSize: 11, color: '#64748B', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Users size={13} /> Estimated Population
                </div>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#0F172A', marginTop: 4 }}>
                  {(incident.affectedPopulation / 1000000).toFixed(1)}M
                </div>
              </div>

              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8, padding: 12 }}>
                <div style={{ fontSize: 11, color: '#64748B', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <TrendingUp size={13} /> Medicine Demand
                </div>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#DC2626', marginTop: 4 }}>
                  {incident.medicineDemandSurge || '+35%'}
                </div>
              </div>

              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8, padding: 12 }}>
                <div style={{ fontSize: 11, color: '#64748B', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Truck size={13} /> Transit Disruption
                </div>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#EA580C', marginTop: 4 }}>
                  {incident.transportDisruptionPct || 24}%
                </div>
              </div>
            </div>

            {/* AI Assessment Box */}
            <div
              style={{
                background: '#FEF2F2',
                border: '1px solid #FECACA',
                borderRadius: 8,
                padding: 14
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: '#991B1B' }}>
                <ShieldAlert size={15} /> AI ASSESSMENT: HIGH CASCADE RISK
              </div>
              <p style={{ fontSize: 12, color: '#7F1D1D', marginTop: 6, margin: 0, lineHeight: 1.4 }}>
                {incident.aiAssessment || 'Telemetry signals indicate high cascade probability for neighboring health districts. Stockout acceleration forecast within 18-36 hours.'}
              </p>
            </div>

            {/* Description */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Incident Description
              </div>
              <p style={{ fontSize: 13, color: '#334155', marginTop: 4, lineHeight: 1.5 }}>
                {incident.description}
              </p>
            </div>

            {/* AI Recommendation Box */}
            <div
              style={{
                background: '#F0FDF4',
                border: '1px solid #BBF7D0',
                borderRadius: 8,
                padding: 14
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: '#166534' }}>
                <Bot size={15} /> AI RECOMMENDATION
              </div>
              <p style={{ fontSize: 13, color: '#14532D', marginTop: 6, margin: 0, lineHeight: 1.5, fontWeight: 500 }}>
                "{incident.recommendedAction}"
              </p>
            </div>

            {/* Detected Time & Coords */}
            <div style={{ fontSize: 11, color: '#94A3B8', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #F1F5F9', paddingTop: 8 }}>
              <span>Detected: {incident.timestamp}</span>
              <span>Coordinates: {incident.latitude.toFixed(3)}°N, {incident.longitude.toFixed(3)}°E</span>
            </div>
          </div>
        )}

        {activeTab === 'agents' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ fontSize: 12, color: '#64748B' }}>
              Autonomous agents currently triaging this incident:
            </div>

            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8, padding: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: 13, color: '#0F172A' }}>Emergency Agent</span>
                <span style={{ fontSize: 10, fontWeight: 700, background: '#DCFCE7', color: '#166534', padding: '2px 6px', borderRadius: 4 }}>
                  ACTIVE
                </span>
              </div>
              <p style={{ fontSize: 12, color: '#475569', marginTop: 4, margin: 0 }}>
                Mapping storm surge contour across {incident.affectedHospitals} hospitals.
              </p>
            </div>

            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8, padding: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: 13, color: '#0F172A' }}>Demand Agent</span>
                <span style={{ fontSize: 10, fontWeight: 700, background: '#E0F2FE', color: '#0369A1', padding: '2px 6px', borderRadius: 4 }}>
                  FORECASTING
                </span>
              </div>
              <p style={{ fontSize: 12, color: '#475569', marginTop: 4, margin: 0 }}>
                Projecting {incident.medicineDemandSurge || '+38%'} surge in rehydration solutions and antibiotics.
              </p>
            </div>

            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8, padding: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: 13, color: '#0F172A' }}>Inventory Agent</span>
                <span style={{ fontSize: 10, fontWeight: 700, background: '#FEF3C7', color: '#92400E', padding: '2px 6px', borderRadius: 4 }}>
                  SCANNING DEPOTS
                </span>
              </div>
              <p style={{ fontSize: 12, color: '#475569', marginTop: 4, margin: 0 }}>
                Scanning 3 adjacent state warehouses for FEFO-cleared surplus lots.
              </p>
            </div>

            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8, padding: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: 13, color: '#0F172A' }}>Generative AI Agent</span>
                <span style={{ fontSize: 10, fontWeight: 700, background: '#F3E8FF', color: '#6B21A8', padding: '2px 6px', borderRadius: 4 }}>
                  ANALYZING
                </span>
              </div>
              <p style={{ fontSize: 12, color: '#475569', marginTop: 4, margin: 0 }}>
                Ready to synthesize cross-agent response plan upon approval.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'actions' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {executionSuccess && (
              <div style={{ background: '#F0FDF4', border: '1px solid #86EFAC', borderRadius: 8, padding: 12, color: '#166534', fontSize: 12 }}>
                <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <CheckCircle2 size={16} /> Autonomous Response Plan Activated
                </div>
                <p style={{ marginTop: 4, margin: 0 }}>
                  Directives transmitted to Regional Depot Dispatchers and Emergency Medical Officers.
                </p>
              </div>
            )}

            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8, padding: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>
                Recommended Action Sequence
              </div>
              <ul style={{ fontSize: 12, color: '#475569', paddingLeft: 18, marginTop: 8, lineHeight: 1.6 }}>
                <li>Reroute 18,400 units emergency medicines from Central Depot</li>
                <li>Activate State Highway secondary bypass to avoid waterlogged roads</li>
                <li>Pre-position 12 Quick Response Medical Teams (QRMT)</li>
                <li>Issue priority green corridor clearance with State Police</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Action Footer Buttons (Section 9) */}
      <div
        style={{
          padding: '14px 20px',
          borderTop: '1px solid #E2E8F0',
          background: '#F8FAFC',
          display: 'flex',
          flexDirection: 'column',
          gap: 8
        }}
      >
        <button
          onClick={handleCreatePlan}
          disabled={isExecutingPlan}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            width: '100%',
            padding: '10px 16px',
            backgroundColor: '#0284C7',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: 6,
            fontSize: 13,
            fontWeight: 700,
            cursor: isExecutingPlan ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.15s'
          }}
        >
          {isExecutingPlan ? (
            <span>Mobilizing Swarm Agents...</span>
          ) : (
            <>
              <Play size={15} fill="#FFFFFF" />
              <span>CREATE RESPONSE PLAN</span>
            </>
          )}
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <button
            onClick={() => onSimulateResponse?.(incident)}
            style={{
              padding: '8px 12px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #CBD5E1',
              borderRadius: 6,
              fontSize: 11,
              fontWeight: 600,
              color: '#334155',
              cursor: 'pointer'
            }}
          >
            SIMULATE RESPONSE
          </button>

          <button
            onClick={() => onAssignAgent?.(incident)}
            style={{
              padding: '8px 12px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #CBD5E1',
              borderRadius: 6,
              fontSize: 11,
              fontWeight: 600,
              color: '#334155',
              cursor: 'pointer'
            }}
          >
            ASSIGN AGENT
          </button>
        </div>

        <button
          onClick={() => onViewHospitals?.(incident)}
          style={{
            padding: '6px 10px',
            background: 'none',
            border: 'none',
            fontSize: 11,
            fontWeight: 600,
            color: '#0284C7',
            cursor: 'pointer',
            textAlign: 'center'
          }}
        >
          VIEW AFFECTED HOSPITALS ({incident.affectedHospitals}) →
        </button>
      </div>
    </div>
  );
};

export default IncidentDrawer;
