import React from 'react';
import { Users, UserCheck, AlertTriangle, ShieldCheck, Download } from 'lucide-react';

interface StaffGroup {
  category: string;
  sanctioned: number;
  present: number;
  onCall: number;
  readinessPct: number;
}

const ROSTER: StaffGroup[] = [
  { category: 'General Duty Medical Officers (GDMO)', sanctioned: 480, present: 442, onCall: 38, readinessPct: 92.1 },
  { category: 'Emergency & Trauma Specialists', sanctioned: 120, present: 114, onCall: 24, readinessPct: 95.0 },
  { category: 'Pediatricians & Neonatologists', sanctioned: 160, present: 148, onCall: 18, readinessPct: 92.5 },
  { category: 'Staff Nurses (Critical Care & ICU)', sanctioned: 1450, present: 1360, onCall: 180, readinessPct: 93.8 },
  { category: 'Pharmacists & Supply Coordinators', sanctioned: 380, present: 362, onCall: 45, readinessPct: 95.3 },
  { category: 'Emergency Paramedics (Ambulance)', sanctioned: 620, present: 590, onCall: 95, readinessPct: 95.2 },
];

export const PersonnelView: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            CLINICAL WORKFORCE & EMERGENCY ROSTER
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>
            Real-time biometric attendance, duty shifts, and emergency surge staff mobilization
          </p>
        </div>
        <button className="ag-btn-secondary">
          <Download size={14} /> Export Workforce Census
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {[
          { label: 'Total Medical Staff Active', value: '3,016', sub: 'Across district referral centers' },
          { label: 'Overall Attendance Ratio', value: '93.9%', sub: 'Target: >90% compliance' },
          { label: 'Emergency Reserve on Call', value: '400', sub: 'Standby for cyclone landfall' },
          { label: 'Paramedic Ambulance Crews', value: '295 Units', sub: '108 emergency fleet operational' },
        ].map(m => (
          <div key={m.label} className="ag-card" style={{ padding: '14px 18px' }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)' }}>{m.label}</span>
            <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'JetBrains Mono', marginTop: 4 }}>
              {m.value}
            </div>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{m.sub}</p>
          </div>
        ))}
      </div>

      <div className="ag-table-container">
        <table className="ag-table">
          <thead>
            <tr>
              <th>Clinical Specialization</th>
              <th>Sanctioned Posts</th>
              <th>Present on Duty</th>
              <th>Emergency On-Call</th>
              <th>Readiness Score</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {ROSTER.map(r => (
              <tr key={r.category}>
                <td><strong style={{ color: 'var(--text-primary)' }}>{r.category}</strong></td>
                <td style={{ fontFamily: 'JetBrains Mono' }}>{r.sanctioned}</td>
                <td style={{ fontFamily: 'JetBrains Mono', fontWeight: 700 }}>{r.present}</td>
                <td style={{ fontFamily: 'JetBrains Mono', color: 'var(--color-blue)' }}>{r.onCall}</td>
                <td style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, color: 'var(--color-green-deep)' }}>{r.readinessPct}%</td>
                <td>
                  <span className="ag-badge ag-badge-stable">
                    DEPLOYED
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
