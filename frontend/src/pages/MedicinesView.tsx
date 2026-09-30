import React, { useState } from 'react';
import { Pill, Search, Filter, ShieldCheck, Download, AlertTriangle } from 'lucide-react';

interface MedicineCatalogItem {
  id: string;
  code: string;
  name: string;
  category: string;
  nlem: boolean;
  unitCost: string;
  currentStock: number;
  safetyStock: number;
  leadTime: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}

const MEDICINES: MedicineCatalogItem[] = [
  { id: 'm-1', code: 'MED-001', name: 'Amoxicillin 500mg Capsule', category: 'Antibiotic', nlem: true, unitCost: '₹3.40', currentStock: 31840, safetyStock: 45000, leadTime: '3 days', riskLevel: 'HIGH' },
  { id: 'm-2', code: 'MED-002', name: 'Paracetamol 650mg Tablet', category: 'Antipyretic / Analgesic', nlem: true, unitCost: '₹0.85', currentStock: 94200, safetyStock: 60000, leadTime: '2 days', riskLevel: 'LOW' },
  { id: 'm-3', code: 'MED-003', name: 'Insulin Glargine 100IU/ml', category: 'Endocrine / Diabetes', nlem: true, unitCost: '₹340.00', currentStock: 840, safetyStock: 1200, leadTime: '5 days', riskLevel: 'MEDIUM' },
  { id: 'm-4', code: 'MED-004', name: 'ORS Powder Packets 20.5g', category: 'Electrolyte Solution', nlem: true, unitCost: '₹4.20', currentStock: 14200, safetyStock: 30000, leadTime: '2 days', riskLevel: 'HIGH' },
  { id: 'm-5', code: 'MED-005', name: 'Azithromycin 500mg Tablet', category: 'Antibiotic', nlem: true, unitCost: '₹12.50', currentStock: 22100, safetyStock: 20000, leadTime: '4 days', riskLevel: 'LOW' },
  { id: 'm-6', code: 'MED-006', name: 'Metformin 500mg Tablet', category: 'Endocrine / Diabetes', nlem: true, unitCost: '₹1.10', currentStock: 78000, safetyStock: 50000, leadTime: '3 days', riskLevel: 'LOW' },
  { id: 'm-7', code: 'MED-007', name: 'Ceftriaxone 1g Injection', category: 'Cephalosporin Antibiotic', nlem: true, unitCost: '₹45.00', currentStock: 4800, safetyStock: 6500, leadTime: '4 days', riskLevel: 'MEDIUM' },
];

export const MedicinesView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = MEDICINES.filter(m =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            NATIONAL ESSENTIAL MEDICINES CATALOG
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>
            National List of Essential Medicines (NLEM 2026) inventory monitoring and procurement thresholds
          </p>
        </div>
        <button className="ag-btn-secondary">
          <Download size={14} /> Download NLEM Catalog
        </button>
      </div>

      <div className="ag-table-container">
        <table className="ag-table">
          <thead>
            <tr>
              <th>Drug Code</th>
              <th>Medicine Name</th>
              <th>Category</th>
              <th>NLEM</th>
              <th>Unit Cost</th>
              <th>Current Stock</th>
              <th>Safety Buffer</th>
              <th>Lead Time</th>
              <th>Risk</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(med => (
              <tr key={med.id}>
                <td style={{ fontFamily: 'JetBrains Mono', fontWeight: 600, color: 'var(--text-muted)' }}>{med.code}</td>
                <td><strong style={{ color: 'var(--text-primary)' }}>{med.name}</strong></td>
                <td style={{ color: 'var(--text-secondary)' }}>{med.category}</td>
                <td><span className="ag-badge ag-badge-stable">NLEM</span></td>
                <td style={{ fontFamily: 'JetBrains Mono' }}>{med.unitCost}</td>
                <td style={{ fontFamily: 'JetBrains Mono', fontWeight: 700 }}>{med.currentStock.toLocaleString()}</td>
                <td style={{ fontFamily: 'JetBrains Mono', color: 'var(--text-secondary)' }}>{med.safetyStock.toLocaleString()}</td>
                <td style={{ fontFamily: 'JetBrains Mono' }}>{med.leadTime}</td>
                <td>
                  <span
                    className={`ag-badge ${
                      med.riskLevel === 'HIGH'
                        ? 'ag-badge-critical'
                        : med.riskLevel === 'MEDIUM'
                        ? 'ag-badge-warning'
                        : 'ag-badge-stable'
                    }`}
                  >
                    {med.riskLevel}
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
