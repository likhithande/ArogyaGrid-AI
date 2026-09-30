import React from 'react';
import { Snowflake, AlertTriangle, CheckCircle2, Activity, Download, RefreshCw } from 'lucide-react';

interface ColdChainUnit {
  id: string;
  facility: string;
  district: string;
  itemStored: string;
  temperature: string;
  targetRange: string;
  status: 'STABLE' | 'WARNING' | 'CRITICAL';
  powerSource: string;
  backupBattery: string;
  lastPing: string;
}

const UNITS: ColdChainUnit[] = [
  { id: 'cc-1', facility: 'NTR District Cold Depot Unit 3', district: 'NTR', itemStored: 'Insulin Glargine & Hepatitis B', temperature: '+6.8°C', targetRange: '+2°C to +8°C', status: 'WARNING', powerSource: 'Grid + Solar Auxiliary', backupBattery: '92%', lastPing: '45s ago' },
  { id: 'cc-2', facility: 'Vijayawada Central Vaccine Bank', district: 'Krishna', itemStored: 'MMR & Polio OPV', temperature: '+3.4°C', targetRange: '+2°C to +8°C', status: 'STABLE', powerSource: 'Dedicated Solar Hybrid', backupBattery: '99%', lastPing: '12s ago' },
  { id: 'cc-3', facility: 'Machilipatnam Coastal Depot', district: 'Krishna', itemStored: 'Antisnake Venom & Rabies', temperature: '+4.1°C', targetRange: '+2°C to +8°C', status: 'STABLE', powerSource: 'Dual Grid', backupBattery: '88%', lastPing: '30s ago' },
  { id: 'cc-4', facility: 'Guntur District Hospital Blood Storage', district: 'Guntur', itemStored: 'Packed Red Blood Cells', temperature: '+3.8°C', targetRange: '+1°C to +6°C', status: 'STABLE', powerSource: 'Hospital UPS Generator', backupBattery: '100%', lastPing: '8s ago' },
  { id: 'cc-5', facility: 'Bhadrachalam Tribal CHC Freezer', district: 'Khammam', itemStored: 'Yellow Fever & Measles', temperature: '-18.5°C', targetRange: '-15°C to -25°C', status: 'STABLE', powerSource: 'Solar Microgrid', backupBattery: '94%', lastPing: '1m ago' },
];

export const ColdChainView: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            COLD CHAIN & TEMPERATURE SURVEILLANCE
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>
            IoT continuous thermal logging for vaccines, insulin, blood products, and antivenom buffers
          </p>
        </div>
        <button className="ag-btn-secondary">
          <Download size={14} /> Export Excursion Log
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {[
          { label: 'Total Monitored Depots', value: '412', sub: 'Active IoT Telemetry Units' },
          { label: 'Thermal Compliance', value: '99.2%', sub: 'Within GMP target tolerance' },
          { label: 'Active Excursions', value: '1', sub: 'NTR Unit 3 (+6.8°C warning)' },
          { label: 'Backup Battery Health', value: '96.8%', sub: 'Solar microgrid readiness' },
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
              <th>Depot / Facility</th>
              <th>District</th>
              <th>Biologics Stored</th>
              <th>Live Temperature</th>
              <th>Target Range</th>
              <th>Power Source</th>
              <th>Battery</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {UNITS.map(u => (
              <tr key={u.id}>
                <td><strong style={{ color: 'var(--text-primary)' }}>{u.facility}</strong></td>
                <td>{u.district}</td>
                <td style={{ color: 'var(--text-secondary)' }}>{u.itemStored}</td>
                <td>
                  <span
                    style={{
                      fontFamily: 'JetBrains Mono',
                      fontWeight: 800,
                      color: u.status === 'WARNING' ? 'var(--color-warning)' : 'var(--color-green-deep)',
                    }}
                  >
                    {u.temperature}
                  </span>
                </td>
                <td style={{ fontFamily: 'JetBrains Mono', fontSize: 12, color: 'var(--text-muted)' }}>{u.targetRange}</td>
                <td style={{ fontSize: 12 }}>{u.powerSource}</td>
                <td style={{ fontFamily: 'JetBrains Mono' }}>{u.backupBattery}</td>
                <td>
                  <span
                    className={`ag-badge ${
                      u.status === 'WARNING' ? 'ag-badge-warning' : 'ag-badge-stable'
                    }`}
                  >
                    {u.status}
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
