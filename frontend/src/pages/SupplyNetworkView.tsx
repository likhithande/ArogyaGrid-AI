import React, { useState } from 'react';
import {
  Network, Truck, AlertTriangle, CheckCircle2, Clock,
  ArrowRight, ShieldCheck, Activity, MapPin, ExternalLink,
  ChevronDown, ArrowDown, Sliders
} from 'lucide-react';
import { StatusBadge, RiskBadge } from '../components/design-system';

export type RouteStatus = 'Normal' | 'Disrupted' | 'Blocked';

export interface RouteItem {
  id: string;
  source: string;
  destination: string;
  distance: string;
  transitTime: string;
  capacity: string;
  reliability: string;
  status: RouteStatus;
  alternativeRoute?: string;
  notes?: string;
}

const INITIAL_ROUTES: RouteItem[] = [
  {
    id: 'r-1',
    source: 'Vijayawada Central WH',
    destination: 'Guntur District Hospital',
    distance: '126 km',
    transitTime: '2h 18m',
    capacity: '12,000 units',
    reliability: '94%',
    status: 'Normal',
    alternativeRoute: 'Vijayawada → Tenali → Guntur (142 km, 2h 45m)',
    notes: 'Green freight lane active with automated FASTag priority.',
  },
  {
    id: 'r-2',
    source: 'Vijayawada Central WH',
    destination: 'Eluru Area Hospital (NH-16)',
    distance: '68 km',
    transitTime: '3h 10m (+6h delay)',
    capacity: '8,500 units',
    reliability: '61%',
    status: 'Disrupted',
    alternativeRoute: 'Vijayawada → Nuzvid → Eluru bypass (84 km, 2h 20m)',
    notes: 'Roadbed waterlogging at NH-16 km 42 causing 6h congestion.',
  },
  {
    id: 'r-3',
    source: 'Hyderabad Strategic Reserve',
    destination: 'Vijayawada Central WH',
    distance: '275 km',
    transitTime: '4h 30m',
    capacity: '45,000 units',
    reliability: '98%',
    status: 'Normal',
    notes: 'National arterial expressway fully operational.',
  },
  {
    id: 'r-4',
    source: 'Guntur District Hospital',
    destination: 'Machilipatnam Coastal PHC',
    distance: '82 km',
    transitTime: '1h 50m',
    capacity: '4,000 units',
    reliability: '89%',
    status: 'Normal',
    alternativeRoute: 'Guntur → Pamarru coastal link',
    notes: 'Primary antibiotic & electrolyte feeder route.',
  },
  {
    id: 'r-5',
    source: 'Vijayawada Central WH',
    destination: 'Bhadrachalam Tribal CHC',
    distance: '194 km',
    transitTime: '5h 15m',
    capacity: '3,200 units',
    reliability: '48%',
    status: 'Blocked',
    alternativeRoute: 'Khammam interior bypass route',
    notes: 'Godavari flood alert triggered localized bridge closure.',
  },
];

export const SupplyNetworkView: React.FC = () => {
  const [routes, setRoutes] = useState<RouteItem[]>(INITIAL_ROUTES);
  const [selectedRouteId, setSelectedRouteId] = useState<string>('r-1');

  const selectedRoute = routes.find((r) => r.id === selectedRouteId) || routes[0];

  const updateRouteStatus = (id: string, newStatus: RouteStatus) => {
    setRoutes((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* ── 1. HEADER (Section 8) ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: 0 }}>
            SUPPLY NETWORK
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2, margin: 0 }}>
            Tiered transit corridors connecting Central Warehouses, Regional Warehouses, District Hospitals, and PHCs
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="ag-badge ag-badge-stable">● 32 Active Corridors</span>
          <span className="ag-badge ag-badge-warning">▲ 1 Disruption</span>
          <span className="ag-badge ag-badge-critical">✕ 1 Blocked</span>
        </div>
      </div>

      {/* ── 2. MAIN LAYOUT: NETWORK TOPOLOGY (LEFT) + ROUTE ANALYSIS PANEL (RIGHT) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: 20 }}>
        {/* Left: 4-Tier Supply Hierarchy with routes between nodes (Section 8) */}
        <div className="ag-card" style={{ padding: 22, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                TIERED SUPPLY HIERARCHY
              </h2>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 1, margin: 0 }}>
                Central Warehouses ↓ Regional Warehouses ↓ District Hospitals ↓ PHCs
              </p>
            </div>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Click corridor to analyze telemetry</span>
          </div>

          <div
            style={{
              flex: 1,
              background: '#F8FAFC',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-sm)',
              padding: '24px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: 20,
            }}
          >
            {/* TIER 1: Central Warehouses */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: 'JetBrains Mono' }}>
                  TIER 1 · CENTRAL WAREHOUSES
                </span>
                <span className="ag-badge ag-badge-blue">Strategic Buffer Reserve</span>
              </div>

              <div style={{ display: 'flex', gap: 14 }}>
                <div
                  style={{
                    padding: '12px 16px',
                    background: '#FFFFFF',
                    border: '2px solid #2563EB',
                    borderRadius: 'var(--radius-sm)',
                    boxShadow: 'var(--shadow-subtle)',
                    flex: 1,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <p style={{ fontSize: 13.5, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                      Hyderabad Strategic Reserve WH
                    </p>
                    <span style={{ fontSize: 11, color: 'var(--color-blue)', fontWeight: 700 }}>Tier-1 Hub</span>
                  </div>
                  <p style={{ fontSize: 11.5, color: 'var(--text-secondary)', marginTop: 2, margin: 0 }}>
                    Capacity: <strong>280,000 units</strong> · Buffer coverage: 45 days
                  </p>
                </div>
              </div>
            </div>

            {/* Downward Flow Arrow */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: 'var(--text-muted)' }}>
              <div style={{ height: 1, flex: 1, background: '#E2E8F0' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10.5, fontWeight: 700, fontFamily: 'JetBrains Mono' }}>
                <ArrowDown size={14} color="#0B8F6A" /> INTER-TIER DISPATCH CONVOYS
              </div>
              <div style={{ height: 1, flex: 1, background: '#E2E8F0' }} />
            </div>

            {/* TIER 2: Regional Warehouses */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: 'JetBrains Mono' }}>
                  TIER 2 · REGIONAL WAREHOUSES
                </span>
                <span className="ag-badge ag-badge-stable">Regional Redistribution</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div
                  onClick={() => setSelectedRouteId('r-1')}
                  style={{
                    padding: '12px 14px',
                    background: '#FFFFFF',
                    border: `2px solid ${selectedRouteId === 'r-1' ? 'var(--color-green)' : 'var(--border-default)'}`,
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    boxShadow: 'var(--shadow-subtle)',
                    transition: 'border-color 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <p style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                      Vijayawada Central WH
                    </p>
                    <span className="ag-badge ag-badge-stable">Normal</span>
                  </div>
                  <p style={{ fontSize: 11, color: 'var(--color-green-deep)', fontWeight: 600, marginTop: 2, margin: 0 }}>
                    Active stock: 84,200 units · Serving 54 PHCs
                  </p>
                </div>

                <div
                  onClick={() => setSelectedRouteId('r-2')}
                  style={{
                    padding: '12px 14px',
                    background: '#FFFFFF',
                    border: `2px solid ${selectedRouteId === 'r-2' ? 'var(--color-warning)' : 'var(--border-default)'}`,
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    boxShadow: 'var(--shadow-subtle)',
                    transition: 'border-color 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <p style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                      Eluru Transit Sub-Hub
                    </p>
                    <span className="ag-badge ag-badge-warning">Disrupted</span>
                  </div>
                  <p style={{ fontSize: 11, color: 'var(--color-warning)', fontWeight: 600, marginTop: 2, margin: 0 }}>
                    ▲ NH-16 flood delay: +6h
                  </p>
                </div>
              </div>
            </div>

            {/* Downward Flow Arrow */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: 'var(--text-muted)' }}>
              <div style={{ height: 1, flex: 1, background: '#E2E8F0' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10.5, fontWeight: 700, fontFamily: 'JetBrains Mono' }}>
                <ArrowDown size={14} color="#0B8F6A" /> LAST-MILE ARTERIAL DISPATCH
              </div>
              <div style={{ height: 1, flex: 1, background: '#E2E8F0' }} />
            </div>

            {/* TIER 3: District Hospitals */}
            <div>
              <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: 'JetBrains Mono' }}>
                TIER 3 · DISTRICT HOSPITALS
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginTop: 8 }}>
                {[
                  { name: 'Guntur District Hospital', beds: '520 Beds', oxygen: '4.1d Stock', routeId: 'r-1' },
                  { name: 'Krishna District Hospital', beds: '450 Beds', oxygen: 'Critical Amox', routeId: 'r-1' },
                  { name: 'Tenali Area Hospital', beds: '160 Beds', oxygen: 'Normal', routeId: 'r-1' },
                ].map((h) => (
                  <div
                    key={h.name}
                    onClick={() => setSelectedRouteId(h.routeId)}
                    style={{
                      padding: '10px 12px',
                      background: '#FFFFFF',
                      border: '1px solid var(--border-default)',
                      borderRadius: 6,
                      cursor: 'pointer',
                    }}
                  >
                    <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>{h.name}</p>
                    <p style={{ fontSize: 10.5, color: 'var(--text-secondary)', marginTop: 2, margin: 0 }}>{h.beds} · {h.oxygen}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Downward Flow Arrow */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: 'var(--text-muted)' }}>
              <div style={{ height: 1, flex: 1, background: '#E2E8F0' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10.5, fontWeight: 700, fontFamily: 'JetBrains Mono' }}>
                <ArrowDown size={14} color="#0B8F6A" /> PRIMARY CARE DELIVERY
              </div>
              <div style={{ height: 1, flex: 1, background: '#E2E8F0' }} />
            </div>

            {/* TIER 4: Primary Health Centres (PHCs) */}
            <div>
              <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: 'JetBrains Mono' }}>
                TIER 4 · PRIMARY HEALTH CENTRES (PHCS)
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginTop: 8 }}>
                {[
                  { name: 'Vijayawada PHC-04', status: 'Stockout 18h', color: '#DC2626' },
                  { name: 'Machilipatnam Coastal PHC', status: 'ORS Shortage', color: '#DC2626' },
                  { name: 'Mangalagiri CHC', status: 'Buffer OK', color: '#0B8F6A' },
                  { name: 'Gudivada PHC-02', status: 'Normal', color: '#0B8F6A' },
                ].map((phc) => (
                  <div
                    key={phc.name}
                    style={{
                      padding: '8px 10px',
                      background: '#FFFFFF',
                      border: '1px solid var(--border-default)',
                      borderRadius: 6,
                      fontSize: 11,
                    }}
                  >
                    <strong style={{ color: 'var(--text-primary)', display: 'block' }}>{phc.name}</strong>
                    <span style={{ color: phc.color, fontWeight: 700 }}>{phc.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Route Analysis Side Panel (Exact Section 8 Spec) */}
        <div className="ag-card" style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ borderBottom: '1px solid var(--border-default)', paddingBottom: 12 }}>
            <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'JetBrains Mono' }}>
              ROUTE ANALYSIS
            </span>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                {selectedRoute.source.replace(' WH', '')} → {selectedRoute.destination.replace(' Hospital', '').replace(' WH', '')}
              </h3>
              <span
                className={`ag-badge ${
                  selectedRoute.status === 'Normal'
                    ? 'ag-badge-stable'
                    : selectedRoute.status === 'Disrupted'
                    ? 'ag-badge-warning'
                    : 'ag-badge-critical'
                }`}
              >
                {selectedRoute.status.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Telemetry Metrics (Distance, Transit time, Capacity, Reliability, Current status) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 12px', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-sm)' }}>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Distance:</span>
              <strong style={{ fontSize: 13, color: 'var(--text-primary)', fontFamily: 'JetBrains Mono' }}>
                {selectedRoute.distance}
              </strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 12px', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-sm)' }}>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Transit Time:</span>
              <strong style={{ fontSize: 13, color: 'var(--text-primary)', fontFamily: 'JetBrains Mono' }}>
                {selectedRoute.transitTime}
              </strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 12px', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-sm)' }}>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Capacity:</span>
              <strong style={{ fontSize: 13, color: 'var(--text-primary)', fontFamily: 'JetBrains Mono' }}>
                {selectedRoute.capacity}
              </strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 12px', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-sm)' }}>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Reliability:</span>
              <strong style={{ fontSize: 13, color: 'var(--color-green-deep)', fontFamily: 'JetBrains Mono' }}>
                {selectedRoute.reliability}
              </strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 12px', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-sm)' }}>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Current Status:</span>
              <strong style={{ fontSize: 13, color: selectedRoute.status === 'Normal' ? 'var(--color-green-deep)' : 'var(--color-warning)' }}>
                {selectedRoute.status === 'Normal' ? 'Operational' : selectedRoute.status}
              </strong>
            </div>
          </div>

          {/* Route Status Switcher: Allow Normal | Disrupted | Blocked */}
          <div style={{ padding: '12px 14px', background: '#F8FAFC', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)' }}>
            <span style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'JetBrains Mono' }}>
              Override Route Status Simulation
            </span>
            <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
              {(['Normal', 'Disrupted', 'Blocked'] as RouteStatus[]).map((st) => (
                <button
                  key={st}
                  onClick={() => updateRouteStatus(selectedRoute.id, st)}
                  style={{
                    flex: 1,
                    padding: '5px 0',
                    borderRadius: 4,
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: 'pointer',
                    background: selectedRoute.status === st ? (st === 'Normal' ? 'var(--color-green-light)' : st === 'Disrupted' ? 'var(--color-warning-light)' : 'var(--color-critical-light)') : '#FFFFFF',
                    border: `1px solid ${selectedRoute.status === st ? (st === 'Normal' ? 'var(--color-green-border)' : st === 'Disrupted' ? 'var(--color-warning-border)' : 'var(--color-critical-border)') : 'var(--border-default)'}`,
                    color: selectedRoute.status === st ? (st === 'Normal' ? 'var(--color-green-deep)' : st === 'Disrupted' ? '#B45309' : 'var(--color-critical)') : 'var(--text-secondary)',
                  }}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Alternative Route Section (Exact Section 8 Spec) */}
          {selectedRoute.alternativeRoute && (
            <div
              style={{
                padding: '14px 16px',
                background: 'var(--color-blue-light)',
                border: '1px solid var(--color-blue-border)',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--color-blue)', textTransform: 'uppercase', fontFamily: 'JetBrains Mono' }}>
                AI Recommended Alternative Route
              </span>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#1E3A8A', marginTop: 3, margin: 0 }}>
                {selectedRoute.alternativeRoute}
              </p>
              <p style={{ fontSize: 11.5, color: '#2563EB', marginTop: 4, margin: 0 }}>
                Avoids primary corridor congestion while maintaining 100% cold-chain integrity.
              </p>

              <button
                style={{
                  marginTop: 10,
                  width: '100%',
                  padding: '7px 0',
                  background: 'var(--color-blue)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: 4,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Activate Alternative Route
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
