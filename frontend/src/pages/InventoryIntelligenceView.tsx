import React, { useState } from 'react';
import {
  Package, Search, Filter, AlertTriangle, ArrowUpDown,
  Download, Clock, CheckCircle2, ChevronRight, Truck,
  ArrowRight, ShieldCheck, RefreshCw, X, Eye
} from 'lucide-react';
import { RiskBadge, StatusBadge, AIRecommendation } from '../components/design-system';
import { LiveClock } from '../components/LiveClock';
import { LiveStatusIndicator } from '../components/LiveStatusIndicator';
import { LiveInventoryFeed } from '../components/LiveInventoryFeed';

interface InventoryItem {
  id: string;
  medicine: string;
  facility: string;
  state: string;
  district: string;
  available: number;
  daysOfStock: string;
  forecast: string;
  expiryRisk: 'Low' | 'Medium' | 'Critical';
  expiryDate: string;
  temperature: string;
  risk: 'HIGH' | 'MEDIUM' | 'LOW';
  fefoRecommendedUnits?: number;
}

const INVENTORY_DATA: InventoryItem[] = [
  {
    id: 'inv-1',
    medicine: 'Amoxicillin 500mg',
    facility: 'Vijayawada PHC-04',
    state: 'Andhra Pradesh',
    district: 'Krishna',
    available: 4280,
    daysOfStock: '1.8d',
    forecast: '-31%',
    expiryRisk: 'Low',
    expiryDate: '14 Oct 2026',
    temperature: 'Stable (22.4°C)',
    risk: 'HIGH',
    fefoRecommendedUnits: 420,
  },
  {
    id: 'inv-2',
    medicine: 'Insulin Glargine 100IU',
    facility: 'NTR District Cold Hub',
    state: 'Andhra Pradesh',
    district: 'NTR',
    available: 840,
    daysOfStock: '2.4d',
    forecast: '+12%',
    expiryRisk: 'Medium',
    expiryDate: '28 Nov 2026',
    temperature: 'Warning (+6.8°C)',
    risk: 'MEDIUM',
  },
  {
    id: 'inv-3',
    medicine: 'Medical Oxygen LMO',
    facility: 'Guntur District Hospital',
    state: 'Andhra Pradesh',
    district: 'Guntur',
    available: 1650,
    daysOfStock: '4.1d',
    forecast: '+21%',
    expiryRisk: 'Low',
    expiryDate: 'Continuous',
    temperature: 'Normal (-183°C)',
    risk: 'MEDIUM',
  },
  {
    id: 'inv-4',
    medicine: 'ORS Powder Packets',
    facility: 'Machilipatnam Coastal PHC',
    state: 'Andhra Pradesh',
    district: 'Krishna',
    available: 120,
    daysOfStock: '0.8d',
    forecast: '+64%',
    expiryRisk: 'Low',
    expiryDate: '15 Jan 2027',
    temperature: 'Normal (24.1°C)',
    risk: 'HIGH',
    fefoRecommendedUnits: 800,
  },
  {
    id: 'inv-5',
    medicine: 'Paracetamol 650mg',
    facility: 'Mangalagiri CHC',
    state: 'Andhra Pradesh',
    district: 'Guntur',
    available: 18400,
    daysOfStock: '18.2d',
    forecast: '+5%',
    expiryRisk: 'Low',
    expiryDate: '04 Mar 2027',
    temperature: 'Normal (21.8°C)',
    risk: 'LOW',
  },
  {
    id: 'inv-6',
    medicine: 'Ceftriaxone 1g Inj',
    facility: 'Tenali Area Hospital',
    state: 'Andhra Pradesh',
    district: 'Guntur',
    available: 620,
    daysOfStock: '3.1d',
    forecast: '+18%',
    expiryRisk: 'Low',
    expiryDate: '20 Dec 2026',
    temperature: 'Normal (22.0°C)',
    risk: 'MEDIUM',
  },
  {
    id: 'inv-7',
    medicine: 'Rabies Vaccine HDCV',
    facility: 'Khammam District WH',
    state: 'Telangana',
    district: 'Khammam',
    available: 210,
    daysOfStock: '5.2d',
    forecast: '-2%',
    expiryRisk: 'Medium',
    expiryDate: '12 Nov 2026',
    temperature: 'Stable (+4.2°C)',
    risk: 'LOW',
  },
  {
    id: 'inv-8',
    medicine: 'Azithromycin 500mg',
    facility: 'Visakhapatnam King George Hospital',
    state: 'Andhra Pradesh',
    district: 'Visakhapatnam',
    available: 9400,
    daysOfStock: '14.5d',
    forecast: '+4%',
    expiryRisk: 'Low',
    expiryDate: '18 Jan 2027',
    temperature: 'Stable (21.5°C)',
    risk: 'LOW',
  },
];

export const InventoryIntelligenceView: React.FC<{ onNavigateToView?: (v: string) => void }> = ({ onNavigateToView }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [stateFilter, setStateFilter] = useState('All');
  const [districtFilter, setDistrictFilter] = useState('All');
  const [facilityFilter, setFacilityFilter] = useState('All');
  const [medicineFilter, setMedicineFilter] = useState('All');
  const [riskFilter, setRiskFilter] = useState('All');
  const [expiryFilter, setExpiryFilter] = useState('All');

  const [hoveredRowId, setHoveredRowId] = useState<string | null>(null);
  const [selectedTransferItem, setSelectedTransferItem] = useState<InventoryItem | null>(null);
  const [transferExecuted, setTransferExecuted] = useState(false);

  const filtered = INVENTORY_DATA.filter((item) => {
    const matchSearch =
      item.medicine.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.facility.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.district.toLowerCase().includes(searchTerm.toLowerCase());
    const matchState = stateFilter === 'All' || item.state === stateFilter;
    const matchDistrict = districtFilter === 'All' || item.district === districtFilter;
    const matchFacility = facilityFilter === 'All' || item.facility.includes(facilityFilter);
    const matchMedicine = medicineFilter === 'All' || item.medicine.includes(medicineFilter);
    const matchRisk = riskFilter === 'All' || item.risk === riskFilter;
    const matchExpiry = expiryFilter === 'All' || item.expiryRisk === expiryFilter;
    return matchSearch && matchState && matchDistrict && matchFacility && matchMedicine && matchRisk && matchExpiry;
  });

  const handleExecuteTransfer = (item: InventoryItem) => {
    setSelectedTransferItem(item);
    setTransferExecuted(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* ── 1. HEADER (Section 2, 7, 12) ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: 0 }}>
            INVENTORY INTELLIGENCE
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2, margin: 0 }}>
            Real-time healthcare inventory surveillance, FEFO redistribution sequencing, and stock-out velocity monitoring
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <LiveStatusIndicator showSyncTime={true} showDemoNotice={true} />
          <LiveClock mode="time-only" className="text-xs font-mono font-bold text-slate-700 bg-white px-2.5 py-1.5 rounded border border-slate-200" />
          <button className="ag-btn-secondary">
            <Download size={14} /> Export CSV
          </button>
          <button
            onClick={() => onNavigateToView?.('supply-network')}
            className="ag-btn-primary"
          >
            <Truck size={14} /> View Corridors
          </button>
        </div>
      </div>

      {/* ── 2. FEFO RECOMMENDATION BANNER (Section 7 Spec) ── */}
      <div
        style={{
          padding: '14px 18px',
          background: '#FFFBEB',
          border: '1px solid #FDE68A',
          borderRadius: 'var(--radius-sm)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: '50%',
              background: '#FEF3C7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#B45309',
              flexShrink: 0,
            }}
          >
            <Clock size={16} />
          </div>
          <div>
            <span style={{ fontSize: 10.5, fontWeight: 700, color: '#B45309', textTransform: 'uppercase', fontFamily: 'JetBrains Mono' }}>
              FEFO RECOMMENDATION
            </span>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#92400E', marginTop: 1, margin: 0 }}>
              "420 units should be redistributed before 14 Oct."
            </p>
            <p style={{ fontSize: 12, color: '#A16207', marginTop: 2, margin: 0 }}>
              Source: Vijayawada PHC-04 · Destination: Guntur Central Depots · Prevents ₹1.42L stock expiration
            </p>
          </div>
        </div>

        <button
          onClick={() => handleExecuteTransfer(INVENTORY_DATA[0])}
          style={{
            padding: '6px 14px',
            background: '#FFFFFF',
            border: '1px solid #FCD34D',
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 700,
            color: '#B45309',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          Execute Redistribution
        </button>
      </div>

      {/* ── 3. FILTERS (Section 7: State, District, Facility, Medicine, Risk, Expiry) ── */}
      <div
        className="ag-card"
        style={{
          padding: '12px 18px',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
          {/* Search box */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 12px',
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-sm)',
              width: '100%',
              maxWidth: 280,
            }}
          >
            <Search size={14} color="#64748B" />
            <input
              type="text"
              placeholder="Search inventory, drug code, PHC..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                outline: 'none',
                fontSize: 12.5,
                color: 'var(--text-primary)',
                width: '100%',
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            {/* 1. State Filter */}
            <select
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid var(--border-default)', background: '#FFFFFF', fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}
            >
              <option value="All">All States</option>
              <option value="Andhra Pradesh">Andhra Pradesh</option>
              <option value="Telangana">Telangana</option>
            </select>

            {/* 2. District Filter */}
            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid var(--border-default)', background: '#FFFFFF', fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}
            >
              <option value="All">All Districts</option>
              <option value="Krishna">Krishna</option>
              <option value="Guntur">Guntur</option>
              <option value="NTR">NTR</option>
              <option value="Visakhapatnam">Visakhapatnam</option>
              <option value="Khammam">Khammam</option>
            </select>

            {/* 3. Facility Filter */}
            <select
              value={facilityFilter}
              onChange={(e) => setFacilityFilter(e.target.value)}
              style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid var(--border-default)', background: '#FFFFFF', fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}
            >
              <option value="All">All Facilities</option>
              <option value="PHC">PHCs only</option>
              <option value="Hospital">District Hospitals</option>
              <option value="Hub">Cold Hubs / Depots</option>
            </select>

            {/* 4. Medicine Filter */}
            <select
              value={medicineFilter}
              onChange={(e) => setMedicineFilter(e.target.value)}
              style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid var(--border-default)', background: '#FFFFFF', fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}
            >
              <option value="All">All Medicines</option>
              <option value="Amoxicillin">Amoxicillin</option>
              <option value="Insulin">Insulin</option>
              <option value="Oxygen">Medical Oxygen</option>
              <option value="ORS">ORS Powder</option>
              <option value="Paracetamol">Paracetamol</option>
            </select>

            {/* 5. Risk Filter */}
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid var(--border-default)', background: '#FFFFFF', fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}
            >
              <option value="All">All Risk</option>
              <option value="HIGH">High Risk</option>
              <option value="MEDIUM">Medium Risk</option>
              <option value="LOW">Low Risk</option>
            </select>

            {/* 6. Expiry Filter */}
            <select
              value={expiryFilter}
              onChange={(e) => setExpiryFilter(e.target.value)}
              style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid var(--border-default)', background: '#FFFFFF', fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}
            >
              <option value="All">All Expiry</option>
              <option value="Critical">&lt; 30 Days (Critical)</option>
              <option value="Medium">30 - 90 Days</option>
              <option value="Low">&gt; 90 Days (Low)</option>
            </select>

            {(stateFilter !== 'All' || districtFilter !== 'All' || facilityFilter !== 'All' || medicineFilter !== 'All' || riskFilter !== 'All' || expiryFilter !== 'All' || searchTerm) && (
              <button
                onClick={() => {
                  setStateFilter('All');
                  setDistrictFilter('All');
                  setFacilityFilter('All');
                  setMedicineFilter('All');
                  setRiskFilter('All');
                  setExpiryFilter('All');
                  setSearchTerm('');
                }}
                style={{
                  padding: '6px 10px',
                  background: 'transparent',
                  border: '1px solid var(--border-default)',
                  borderRadius: 6,
                  fontSize: 11,
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                }}
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── 4. LIVE INVENTORY TABLE & REAL-TIME ACTIVITY FEED (Section 10-13) ── */}
      <LiveInventoryFeed onSelectMedicine={(m) => handleExecuteTransfer(m as any)} />

      {/* ── 5. QUICK ACTION MODAL / CONFIRMATION DRAWER (Section 7) ── */}
      {selectedTransferItem && (
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
          onClick={() => setSelectedTransferItem(null)}
        >
          <div
            className="ag-card"
            style={{
              width: '100%',
              maxWidth: 480,
              padding: 24,
              boxShadow: 'var(--shadow-dropdown)',
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--color-green)', textTransform: 'uppercase', fontFamily: 'JetBrains Mono' }}>
                  FACILITY REDISTRIBUTION ORDER
                </span>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', marginTop: 2, margin: 0 }}>
                  {selectedTransferItem.medicine}
                </h3>
              </div>
              <button
                onClick={() => setSelectedTransferItem(null)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '12px 14px', background: 'var(--bg-surface-elevated)', borderRadius: 6, display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12.5 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Source Facility:</span>
                <strong style={{ color: 'var(--text-primary)' }}>{selectedTransferItem.facility}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Current Stock:</span>
                <strong style={{ fontFamily: 'JetBrains Mono' }}>{selectedTransferItem.available.toLocaleString()} units</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Batch Expiry Date:</span>
                <strong style={{ color: 'var(--color-warning)' }}>{selectedTransferItem.expiryDate}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Destination:</span>
                <strong style={{ color: 'var(--color-green-deep)' }}>Guntur Central Warehouse</strong>
              </div>
            </div>

            {transferExecuted ? (
              <div style={{ padding: '12px', background: 'var(--color-green-light)', border: '1px solid var(--color-green-border)', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 10 }}>
                <CheckCircle2 size={18} color="var(--color-green)" />
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-green-deep)' }}>
                  Redistribution order dispatched successfully via corridor NH-65.
                </span>
              </div>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button
                  onClick={() => setSelectedTransferItem(null)}
                  className="ag-btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setTransferExecuted(true)}
                  className="ag-btn-primary"
                >
                  Authorize 420-Unit Transfer
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
