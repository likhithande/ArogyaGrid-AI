import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLiveSocket } from '../hooks/useLiveSocket';
import {
  Package, ArrowDown, ArrowUp, AlertTriangle, ShieldCheck,
  Activity, Clock, RefreshCw, Search, Filter, Thermometer
} from 'lucide-react';

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  unit: string;
  current_stock: number;
  safety_stock: number;
  max_stock: number;
  daily_consumption_avg: number;
  predicted_stockout_days: number;
  risk_level: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  batch_number: string;
  expiry_date: string;
  facility_id: string;
  facility_name: string;
  district: string;
  temperature_celsius?: number;
}

export interface InventoryChangeEvent {
  id: string;
  type: string;
  timestamp: string;
  facility_id: string;
  facility_name: string;
  district: string;
  medicine: string;
  medicine_id?: string;
  previous_quantity: number;
  quantity: number;
  change: number;
  days_of_stock?: number;
  risk_level?: string;
  reason: string;
}

interface LiveInventoryFeedProps {
  compact?: boolean;
  onSelectMedicine?: (item: InventoryItem) => void;
  className?: string;
}

export const LiveInventoryFeed: React.FC<LiveInventoryFeedProps> = ({
  compact = false,
  onSelectMedicine,
  className = ''
}) => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [activityFeed, setActivityFeed] = useState<InventoryChangeEvent[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRisk, setFilterRisk] = useState<string>('ALL');
  const [flashingCells, setFlashingCells] = useState<{ [medId: string]: 'up' | 'down' }>({});

  const [summaryMetrics, setSummaryMetrics] = useState({
    facilities_monitored: 8420,
    medicines_monitored: 12480,
    critical_count: 84,
    low_stock_count: 327,
    normal_count: 12069,
    updates_per_sec: 4
  });

  // Fetch initial data from backend API
  const loadInitialData = useCallback(async () => {
    try {
      const [invRes, sumRes, chgRes] = await Promise.all([
        fetch('/api/inventory'),
        fetch('/api/inventory/summary'),
        fetch('/api/inventory/changes')
      ]);

      if (invRes.ok) {
        const invData = await invRes.json();
        setItems(invData);
      }
      if (sumRes.ok) {
        const sumData = await sumRes.json();
        setSummaryMetrics((prev) => ({ ...prev, ...sumData }));
      }
      if (chgRes.ok) {
        const chgData = await chgRes.json();
        setActivityFeed(chgData);
      }
    } catch {
      // Fallback
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Handle incoming live websocket event
  const handleLiveEvent = useCallback((event: any) => {
    if (event.type === 'INVENTORY_UPDATE' && event.event) {
      const evt: InventoryChangeEvent = event.event;

      // Add to activity feed
      setActivityFeed((prev) => [evt, ...prev.slice(0, 49)]);

      // Update summary if provided
      if (event.summary) {
        setSummaryMetrics((prev) => ({ ...prev, ...event.summary }));
      }

      // Flash only the changed cell
      const changeType = evt.change > 0 ? 'up' : 'down';
      const medId = evt.medicine_id || evt.medicine;

      setFlashingCells((prev) => ({ ...prev, [medId]: changeType }));
      setTimeout(() => {
        setFlashingCells((prev) => {
          const next = { ...prev };
          delete next[medId];
          return next;
        });
      }, 1400);

      // Mutate item in-place without full re-render
      setItems((prevItems) => {
        return prevItems.map((item) => {
          if (item.name === evt.medicine || item.id === evt.medicine_id) {
            return {
              ...item,
              current_stock: evt.quantity,
              predicted_stockout_days: evt.days_of_stock ?? item.predicted_stockout_days,
              risk_level: (evt.risk_level as any) ?? item.risk_level
            };
          }
          return item;
        });
      });
    }
  }, []);

  const { isConnected, lastSyncTime } = useLiveSocket(handleLiveEvent);

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.facility_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRisk = filterRisk === 'ALL' || item.risk_level === filterRisk;
    return matchesSearch && matchesRisk;
  });

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'CRITICAL': return '#DC2626';
      case 'HIGH': return '#EA580C';
      case 'MEDIUM': return '#D97706';
      default: return '#16A34A';
    }
  };

  const getRiskBg = (risk: string) => {
    switch (risk) {
      case 'CRITICAL': return '#FEF2F2';
      case 'HIGH': return '#FFF7ED';
      case 'MEDIUM': return '#FFFBEB';
      default: return '#F0FDF4';
    }
  };

  return (
    <div className={`live-inventory-wrapper flex flex-col gap-4 ${className}`}>
      {/* ── Top Live Inventory Header (Section 12) ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
          padding: '12px 18px',
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: 10,
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#64748B', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              TELEMETRY BUS
            </div>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0F172A', margin: 0 }}>
              LIVE INVENTORY
            </h2>
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '4px 10px',
              borderRadius: 6,
              background: isConnected ? '#ECFDF5' : '#FEF2F2',
              border: `1px solid ${isConnected ? '#A7F3D0' : '#FECACA'}`,
              fontSize: 11,
              fontWeight: 700,
              color: isConnected ? '#065F46' : '#991B1B'
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                backgroundColor: isConnected ? '#10B981' : '#EF4444',
                animation: isConnected ? 'pulse 2s infinite' : 'none'
              }}
            />
            <span>{isConnected ? '● CONNECTED' : '○ DISCONNECTED'}</span>
          </div>
        </div>

        {/* Live Metrics Grid */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, fontSize: 12 }}>
          <div>
            <div style={{ fontSize: 10, color: '#64748B' }}>Last update</div>
            <div style={{ fontWeight: 700, color: '#0F172A', fontVariantNumeric: 'tabular-nums' }}>
              {lastSyncTime || '09:42:21 IST'}
            </div>
          </div>

          <div style={{ borderLeft: '1px solid #E2E8F0', paddingLeft: 18 }}>
            <div style={{ fontSize: 10, color: '#64748B' }}>Updates/sec</div>
            <div style={{ fontWeight: 700, color: '#0284C7', fontVariantNumeric: 'tabular-nums' }}>
              {summaryMetrics.updates_per_sec || 4}
            </div>
          </div>

          <div style={{ borderLeft: '1px solid #E2E8F0', paddingLeft: 18 }}>
            <div style={{ fontSize: 10, color: '#64748B' }}>Facilities monitored</div>
            <div style={{ fontWeight: 700, color: '#0F172A' }}>
              {summaryMetrics.facilities_monitored.toLocaleString()}
            </div>
          </div>

          <div style={{ borderLeft: '1px solid #E2E8F0', paddingLeft: 18 }}>
            <div style={{ fontSize: 10, color: '#64748B' }}>Medicines monitored</div>
            <div style={{ fontWeight: 700, color: '#0F172A' }}>
              {summaryMetrics.medicines_monitored.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Layout: Table on Left + Activity Feed on Right (Section 13) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: compact ? '1fr' : '2fr 1fr', gap: 16 }}>
        {/* Table Container */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: 10,
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* Filter Bar */}
          <div
            style={{
              padding: '10px 16px',
              borderBottom: '1px solid #E2E8F0',
              background: '#F8FAFC',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, maxWidth: 300 }}>
              <Search size={14} color="#64748B" />
              <input
                type="text"
                placeholder="Search medicine or facility..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  fontSize: 12,
                  outline: 'none',
                  color: '#0F172A'
                }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              {(['ALL', 'CRITICAL', 'HIGH', 'LOW'] as const).map((risk) => (
                <button
                  key={risk}
                  onClick={() => setFilterRisk(risk)}
                  style={{
                    padding: '3px 8px',
                    fontSize: 10,
                    fontWeight: 700,
                    borderRadius: 4,
                    border: 'none',
                    cursor: 'pointer',
                    background: filterRisk === risk ? '#0284C7' : 'transparent',
                    color: filterRisk === risk ? '#FFFFFF' : '#64748B'
                  }}
                >
                  {risk}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto', maxHeight: compact ? 360 : 540 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B', textAlign: 'left' }}>
                  <th style={{ padding: '8px 14px', fontWeight: 600 }}>Medicine</th>
                  <th style={{ padding: '8px 14px', fontWeight: 600 }}>Facility & District</th>
                  <th style={{ padding: '8px 14px', fontWeight: 600, textAlign: 'right' }}>Current Stock</th>
                  <th style={{ padding: '8px 14px', fontWeight: 600, textAlign: 'right' }}>Days Stock</th>
                  <th style={{ padding: '8px 14px', fontWeight: 600, textAlign: 'center' }}>Risk</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => {
                  const flash = flashingCells[item.id] || flashingCells[item.name];
                  const flashStyle: React.CSSProperties = flash === 'up'
                    ? { backgroundColor: '#DCFCE7', color: '#15803D', transition: 'all 0.3s', fontWeight: 700 }
                    : flash === 'down'
                    ? { backgroundColor: '#FEE2E2', color: '#B91C1C', transition: 'all 0.3s', fontWeight: 700 }
                    : {};

                  return (
                    <tr
                      key={item.id}
                      onClick={() => onSelectMedicine?.(item)}
                      style={{
                        borderBottom: '1px solid #F1F5F9',
                        cursor: 'pointer',
                        transition: 'background-color 0.1s'
                      }}
                      className="hover:bg-slate-50"
                    >
                      <td style={{ padding: '10px 14px' }}>
                        <div style={{ fontWeight: 600, color: '#0F172A' }}>{item.name}</div>
                        <div style={{ fontSize: 10, color: '#64748B' }}>{item.category} · {item.unit}</div>
                      </td>

                      <td style={{ padding: '10px 14px' }}>
                        <div style={{ color: '#334155', fontWeight: 500 }}>{item.facility_name}</div>
                        <div style={{ fontSize: 10, color: '#64748B' }}>{item.district}</div>
                      </td>

                      {/* Changed cell flashes SUBTLY (Section 12 requirement) */}
                      <td style={{ padding: '10px 14px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', ...flashStyle }}>
                        {item.current_stock.toLocaleString()}
                        {flash === 'down' && <span style={{ marginLeft: 4, fontSize: 10 }}>↓</span>}
                        {flash === 'up' && <span style={{ marginLeft: 4, fontSize: 10 }}>↑</span>}
                      </td>

                      <td style={{ padding: '10px 14px', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                        <span style={{ fontWeight: 600, color: item.predicted_stockout_days < 3 ? '#DC2626' : '#334155' }}>
                          {item.predicted_stockout_days}d
                        </span>
                      </td>

                      <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: 4,
                            color: getRiskColor(item.risk_level),
                            backgroundColor: getRiskBg(item.risk_level)
                          }}
                        >
                          {item.risk_level}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Right-Side Real-Time Activity Feed (Section 13) ── */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: 10,
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column',
            maxHeight: compact ? 360 : 590
          }}
        >
          <div
            style={{
              padding: '12px 16px',
              borderBottom: '1px solid #E2E8F0',
              background: '#F8FAFC',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: 13, color: '#0F172A' }}>
              <Activity size={15} color="#0284C7" />
              <span>LIVE INVENTORY ACTIVITY</span>
            </div>
            <span style={{ fontSize: 10, fontWeight: 700, color: '#16A34A', background: '#DCFCE7', padding: '2px 6px', borderRadius: 4 }}>
              REAL-TIME
            </span>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {activityFeed.length === 0 ? (
              <div style={{ padding: 24, textAlign: 'center', color: '#94A3B8', fontSize: 12 }}>
                Waiting for inventory telemetry stream...
              </div>
            ) : (
              activityFeed.map((evt, idx) => {
                const isPositive = evt.change > 0;
                const isExcursion = evt.type === 'TEMPERATURE_WARNING';

                return (
                  <div
                    key={evt.id || idx}
                    style={{
                      padding: 10,
                      borderRadius: 6,
                      background: '#F8FAFC',
                      borderLeft: `3px solid ${isExcursion ? '#F59E0B' : isPositive ? '#10B981' : '#EF4444'}`,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 2,
                      animation: idx === 0 ? 'fadeIn 0.25s ease-out' : 'none'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#64748B' }}>
                      <span style={{ fontWeight: 600 }}>{evt.timestamp}</span>
                      <span style={{ fontWeight: 700, color: isExcursion ? '#D97706' : isPositive ? '#059669' : '#DC2626' }}>
                        {isExcursion ? 'ALERT' : `${isPositive ? '+' : ''}${evt.change} units`}
                      </span>
                    </div>

                    <div style={{ fontSize: 12, fontWeight: 700, color: '#0F172A' }}>
                      {evt.medicine}
                    </div>

                    <div style={{ fontSize: 11, color: '#475569' }}>
                      {evt.facility_name} · {evt.reason}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveInventoryFeed;
