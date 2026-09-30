import React, { useState } from 'react';
import { Building2, Search, Filter, Bed, Users, ShieldCheck, Download } from 'lucide-react';

interface HospitalFacility {
  id: string;
  name: string;
  type: 'District Hospital' | 'Area Hospital' | 'CHC' | 'PHC';
  district: string;
  totalBeds: number;
  occupiedBeds: number;
  icuBeds: number;
  doctorsPresent: number;
  doctorsSanctioned: number;
  dailyFootfall: number;
  status: 'STABLE' | 'WARNING' | 'CRITICAL';
}

const HOSPITALS: HospitalFacility[] = [
  { id: 'h-1', name: 'Krishna District General Hospital', type: 'District Hospital', district: 'Krishna', totalBeds: 450, occupiedBeds: 388, icuBeds: 45, doctorsPresent: 42, doctorsSanctioned: 48, dailyFootfall: 1420, status: 'WARNING' },
  { id: 'h-2', name: 'Guntur Government Comprehensive Hospital', type: 'District Hospital', district: 'Guntur', totalBeds: 520, occupiedBeds: 412, icuBeds: 50, doctorsPresent: 51, doctorsSanctioned: 55, dailyFootfall: 1680, status: 'STABLE' },
  { id: 'h-3', name: 'Machilipatnam Coastal Area Hospital', type: 'Area Hospital', district: 'Krishna', totalBeds: 180, occupiedBeds: 168, icuBeds: 18, doctorsPresent: 14, doctorsSanctioned: 20, dailyFootfall: 680, status: 'CRITICAL' },
  { id: 'h-4', name: 'Vijayawada Rural Primary Health Centre 04', type: 'PHC', district: 'Krishna', totalBeds: 12, occupiedBeds: 9, icuBeds: 2, doctorsPresent: 2, doctorsSanctioned: 2, dailyFootfall: 140, status: 'WARNING' },
  { id: 'h-5', name: 'Tenali Sub-District Hospital', type: 'Area Hospital', district: 'Guntur', totalBeds: 160, occupiedBeds: 118, icuBeds: 16, doctorsPresent: 18, doctorsSanctioned: 20, dailyFootfall: 590, status: 'STABLE' },
  { id: 'h-6', name: 'Mangalagiri Community Health Centre', type: 'CHC', district: 'Guntur', totalBeds: 40, occupiedBeds: 28, icuBeds: 4, doctorsPresent: 5, doctorsSanctioned: 6, dailyFootfall: 260, status: 'STABLE' },
];

export const HospitalsView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = HOSPITALS.filter(h =>
    h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.district.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            HOSPITAL NETWORK CAPACITY
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>
            Real-time bed census, ICU saturation, clinical workforce presence, and patient footfall
          </p>
        </div>
        <button className="ag-btn-secondary">
          <Download size={14} /> Export Roster
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {[
          { label: 'Total Beds Monitored', value: '8,430', sub: 'Across 694 facilities' },
          { label: 'Bed Occupancy Rate', value: '69.4%', sub: '2,578 available beds' },
          { label: 'ICU Saturation', value: '74.2%', sub: 'Critical care headroom: 210' },
          { label: 'Clinical Attendance', value: '92.8%', sub: 'Sanctioned staffing ratio' },
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
              <th>Facility Name</th>
              <th>Type</th>
              <th>District</th>
              <th>Bed Occupancy</th>
              <th>ICU Beds</th>
              <th>Doctors</th>
              <th>Daily Footfall</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(fac => {
              const occPct = Math.round((fac.occupiedBeds / fac.totalBeds) * 100);
              return (
                <tr key={fac.id}>
                  <td>
                    <strong style={{ color: 'var(--text-primary)' }}>{fac.name}</strong>
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>{fac.type}</td>
                  <td>{fac.district}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 700 }}>
                        {fac.occupiedBeds}/{fac.totalBeds} ({occPct}%)
                      </span>
                    </div>
                  </td>
                  <td style={{ fontFamily: 'JetBrains Mono', fontWeight: 600 }}>{fac.icuBeds}</td>
                  <td style={{ fontFamily: 'JetBrains Mono' }}>
                    {fac.doctorsPresent}/{fac.doctorsSanctioned}
                  </td>
                  <td style={{ fontFamily: 'JetBrains Mono' }}>{fac.dailyFootfall.toLocaleString()}</td>
                  <td>
                    <span
                      className={`ag-badge ${
                        fac.status === 'CRITICAL'
                          ? 'ag-badge-critical'
                          : fac.status === 'WARNING'
                          ? 'ag-badge-warning'
                          : 'ag-badge-stable'
                      }`}
                    >
                      {fac.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
