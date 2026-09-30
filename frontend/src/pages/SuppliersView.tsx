import React from 'react';
import { Truck, CheckCircle2, AlertTriangle, ShieldCheck, Download, ExternalLink } from 'lucide-react';

interface SupplierInfo {
  id: string;
  name: string;
  category: string;
  location: string;
  leadTimeAvg: string;
  reliabilityPct: number;
  activeContracts: number;
  status: 'PREFERRED' | 'ACTIVE' | 'AUDIT_FLAG';
}

const SUPPLIERS: SupplierInfo[] = [
  { id: 's-1', name: 'PharmaCorp India Ltd', category: 'Essential Antibiotics & Analgesics', location: 'Hyderabad, Telangana', leadTimeAvg: '2.4 days', reliabilityPct: 98.2, activeContracts: 14, status: 'PREFERRED' },
  { id: 's-2', name: 'Bharat Biologics & Vaccines', category: 'Biologics & Cold-Chain Vaccines', location: 'Pune, Maharashtra', leadTimeAvg: '3.1 days', reliabilityPct: 96.5, activeContracts: 8, status: 'PREFERRED' },
  { id: 's-3', name: 'MedSupply Bioscience', category: 'Trauma & Surgical Disposables', location: 'Kolkata, West Bengal', leadTimeAvg: '4.8 days', reliabilityPct: 82.4, activeContracts: 6, status: 'AUDIT_FLAG' },
  { id: 's-4', name: 'Southern Liquid Medical Oxygen', category: 'Medical Oxygen LMO & Cylinders', location: 'Visakhapatnam, Andhra Pradesh', leadTimeAvg: '1.2 days', reliabilityPct: 99.1, activeContracts: 12, status: 'PREFERRED' },
  { id: 's-5', name: 'Deccan Parenterals', category: 'IV Fluids & Electrolytes', location: 'Vijayawada, Andhra Pradesh', leadTimeAvg: '1.5 days', reliabilityPct: 94.0, activeContracts: 9, status: 'ACTIVE' },
];

export const SuppliersView: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            SUPPLIER NETWORK & PROCUREMENT AUDIT
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>
            Vendor compliance, average delivery lead times, order fill rates, and SLA scorecards
          </p>
        </div>
        <button className="ag-btn-secondary">
          <Download size={14} /> Export Scorecard
        </button>
      </div>

      <div className="ag-table-container">
        <table className="ag-table">
          <thead>
            <tr>
              <th>Supplier Organization</th>
              <th>Category</th>
              <th>Manufacturing Hub</th>
              <th>Avg Lead Time</th>
              <th>Fulfillment SLA</th>
              <th>Contracts</th>
              <th>Vendor Status</th>
            </tr>
          </thead>
          <tbody>
            {SUPPLIERS.map(s => (
              <tr key={s.id}>
                <td><strong style={{ color: 'var(--text-primary)' }}>{s.name}</strong></td>
                <td style={{ color: 'var(--text-secondary)' }}>{s.category}</td>
                <td>{s.location}</td>
                <td style={{ fontFamily: 'JetBrains Mono' }}>{s.leadTimeAvg}</td>
                <td style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, color: s.reliabilityPct < 90 ? 'var(--color-warning)' : 'var(--color-green-deep)' }}>
                  {s.reliabilityPct}%
                </td>
                <td style={{ fontFamily: 'JetBrains Mono' }}>{s.activeContracts}</td>
                <td>
                  <span
                    className={`ag-badge ${
                      s.status === 'PREFERRED'
                        ? 'ag-badge-stable'
                        : s.status === 'AUDIT_FLAG'
                        ? 'ag-badge-warning'
                        : 'ag-badge-blue'
                    }`}
                  >
                    {s.status}
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
