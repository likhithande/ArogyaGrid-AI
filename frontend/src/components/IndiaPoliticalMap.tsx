import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import statesGeoData from '../data/indiaStatesData';
import { IncidentLayer } from './IncidentLayer';
import { IncidentDrawer, IncidentItem } from './IncidentDrawer';
import {
  Layers, ZoomIn, ZoomOut, Maximize2, RotateCcw, Play, Pause,
  Clock, ShieldAlert, CheckCircle2, ChevronRight, X, Activity,
  Building2, AlertTriangle, Truck, MapPin
} from 'lucide-react';

export type TimeHorizon = 'LIVE' | '+6H' | '+24H' | '+72H' | '+7D';

interface IndiaPoliticalMapProps {
  onStateSelect?: (stateName: string, stateData: any) => void;
  onNavigateToView?: (viewId: string) => void;
  className?: string;
}

export const IndiaPoliticalMap: React.FC<IndiaPoliticalMapProps> = ({
  onStateSelect,
  onNavigateToView,
  className = ''
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const geoJsonLayerRef = useRef<L.GeoJSON | null>(null);

  // Time Horizon Simulation State (Section 6)
  const [timeHorizon, setTimeHorizon] = useState<TimeHorizon>('LIVE');
  const [isPlayingTimeline, setIsPlayingTimeline] = useState<boolean>(false);

  // Active Layers (Section 27 & 28)
  const [layers, setLayers] = useState({
    resilience: true,
    incidents: true,
    hospitals: false,
    phcs: false,
    supplyRoutes: false,
    emergencyZones: false
  });

  // Selected State / Incident Drawer State (Section 4 & 9)
  const [selectedState, setSelectedState] = useState<any | null>(null);
  const [selectedIncident, setSelectedIncident] = useState<IncidentItem | null>(null);
  const [activeDrilldown, setActiveDrilldown] = useState<string>('India');
  const [isLayerPanelOpen, setIsLayerPanelOpen] = useState<boolean>(false);

  // National Incidents list
  const [incidents, setIncidents] = useState<IncidentItem[]>([]);

  // Fetch National Incidents from backend
  const fetchIncidents = useCallback(async () => {
    try {
      const res = await fetch('/api/incidents');
      if (res.ok) {
        const data = await res.json();
        setIncidents(data);
      }
    } catch {
      // Fallback already baked into engine or socket
    }
  }, []);

  useEffect(() => {
    fetchIncidents();
  }, [fetchIncidents]);

  // Dynamic simulation multipliers based on selected time horizon (Section 6)
  const horizonModifiers = useMemo(() => {
    switch (timeHorizon) {
      case '+6H':
        return { resilienceDelta: -2.4, availDelta: -3.0, incidentMultiplier: 1.1, label: '+6 Hours Projection' };
      case '+24H':
        return { resilienceDelta: -7.8, availDelta: -9.5, incidentMultiplier: 1.4, label: '+24 Hours Peak Storm Surge' };
      case '+72H':
        return { resilienceDelta: -4.2, availDelta: -5.0, incidentMultiplier: 1.25, label: '+72 Hours Mid-Cycle Stabilization' };
      case '+7D':
        return { resilienceDelta: +3.5, availDelta: +4.2, incidentMultiplier: 0.85, label: '+7 Days Post-Redistribution Recovery' };
      default: // LIVE
        return { resilienceDelta: 0, availDelta: 0, incidentMultiplier: 1.0, label: 'Live Operational Telemetry' };
    }
  }, [timeHorizon]);

  // Automated Timeline Player (Section 6)
  useEffect(() => {
    if (!isPlayingTimeline) return;
    const horizons: TimeHorizon[] = ['LIVE', '+6H', '+24H', '+72H', '+7D'];
    const interval = setInterval(() => {
      setTimeHorizon((prev) => {
        const idx = horizons.indexOf(prev);
        const nextIdx = (idx + 1) % horizons.length;
        return horizons[nextIdx];
      });
    }, 2800);

    return () => clearInterval(interval);
  }, [isPlayingTimeline]);

  // Determine resilience color (Section 5)
  const getResilienceColor = useCallback((score: number) => {
    if (score >= 80) return '#10B981'; // Stable - Green
    if (score >= 60) return '#3B82F6'; // Watch - Blue/Amber
    if (score >= 40) return '#F97316'; // High Risk - Orange
    return '#EF4444'; // Critical - Red
  }, []);

  // Compute simulated state metrics based on time horizon
  const getSimulatedStateProps = useCallback((props: any) => {
    const isCoastalHazardZone = ['Odisha', 'Andhra Pradesh', 'West Bengal', 'Tamil Nadu'].includes(props.name);
    const multiplier = isCoastalHazardZone ? 1.8 : 0.6;

    const baseResilience = props.healthcare_resilience || 78.0;
    const simulatedResilience = Math.max(25, Math.min(99, Number((baseResilience + horizonModifiers.resilienceDelta * multiplier).toFixed(1))));

    const baseAvail = props.medicine_availability || 85.0;
    const simulatedAvail = Math.max(30, Math.min(100, Number((baseAvail + horizonModifiers.availDelta * multiplier).toFixed(1))));

    const baseIncidents = props.active_incidents || 2;
    const simulatedIncidents = Math.max(1, Math.round(baseIncidents * (isCoastalHazardZone ? horizonModifiers.incidentMultiplier : 1.0)));

    let riskLabel = 'LOW';
    if (simulatedResilience < 40) riskLabel = 'CRITICAL';
    else if (simulatedResilience < 60) riskLabel = 'HIGH';
    else if (simulatedResilience < 80) riskLabel = 'WATCH';

    return {
      ...props,
      healthcare_resilience: simulatedResilience,
      medicine_availability: simulatedAvail,
      active_incidents: simulatedIncidents,
      inventory_risk: riskLabel
    };
  }, [horizonModifiers]);

  // Leaflet Polygon Styling
  const stateStyle = useCallback((feature: any) => {
    if (!feature || !feature.properties) return {};
    const simProps = getSimulatedStateProps(feature.properties);
    const color = getResilienceColor(simProps.healthcare_resilience);
    const isSelected = selectedState && selectedState.name === feature.properties.name;

    return {
      fillColor: layers.resilience ? color : '#E2E8F0',
      weight: isSelected ? 3 : 1.5,
      opacity: 1,
      color: isSelected ? '#0F172A' : '#FFFFFF',
      dashArray: isSelected ? '' : '',
      fillOpacity: isSelected ? 0.85 : 0.68
    };
  }, [layers.resilience, selectedState, getSimulatedStateProps, getResilienceColor]);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Centered over India [22.0, 80.0]
    const map = L.map(mapContainerRef.current, {
      center: [22.9, 79.5],
      zoom: 4.8,
      minZoom: 4,
      maxZoom: 10,
      zoomControl: false,
      attributionControl: false
    });

    mapInstanceRef.current = map;

    // Base OpenStreetMap tiles (free, no watermark)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      opacity: 0.65
    }).addTo(map);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update GeoJSON Layer when time horizon or state selection changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (geoJsonLayerRef.current) {
      geoJsonLayerRef.current.remove();
    }

    const geoJsonLayer = L.geoJSON(statesGeoData as any, {
      style: stateStyle,
      onEachFeature: (feature, layer) => {
        const rawProps = feature.properties;

        // Mouse hover interaction (Section 4)
        layer.on({
          mouseover: (e) => {
            const target = e.target;
            target.setStyle({
              weight: 2.5,
              color: '#0F172A',
              fillOpacity: 0.88
            });
            target.bringToFront();

            const sim = getSimulatedStateProps(rawProps);
            const resColor = getResilienceColor(sim.healthcare_resilience);

            const tooltipHtml = `
              <div style="font-family: inherit; font-size: 11px; padding: 6px 8px; line-height: 1.35; min-width: 140px;">
                <div style="font-size: 9px; font-weight: 700; color: #64748B; text-transform: uppercase; letter-spacing: 0.05em;">
                  STATE
                </div>
                <div style="font-size: 13px; font-weight: 800; color: #0F172A; margin-bottom: 4px;">
                  ${sim.name}
                </div>
                <div style="display: flex; justify-content: space-between; margin-top: 3px;">
                  <span style="color: #64748B;">Healthcare Resilience:</span>
                  <span style="font-weight: 700; color: ${resColor};">${sim.healthcare_resilience}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-top: 2px;">
                  <span style="color: #64748B;">Medicine Availability:</span>
                  <span style="font-weight: 600; color: #0F172A;">${sim.medicine_availability}%</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-top: 2px;">
                  <span style="color: #64748B;">Hospitals:</span>
                  <span style="font-weight: 600; color: #0F172A;">${sim.hospitals.toLocaleString()}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-top: 2px;">
                  <span style="color: #64748B;">Active Incidents:</span>
                  <span style="font-weight: 700; color: #DC2626;">${sim.active_incidents}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-top: 2px;">
                  <span style="color: #64748B;">Inventory Risk:</span>
                  <span style="font-weight: 700; color: ${resColor};">${sim.inventory_risk}</span>
                </div>
              </div>
            `;
            target.bindTooltip(tooltipHtml, { sticky: true, className: 'custom-state-tooltip' }).openTooltip();
          },
          mouseout: (e) => {
            geoJsonLayer.resetStyle(e.target);
          },
          click: (e) => {
            const sim = getSimulatedStateProps(rawProps);
            setSelectedState(sim);
            setActiveDrilldown(sim.name);
            if (onStateSelect) {
              onStateSelect(sim.name, sim);
            }
            // Pan to feature bounds
            map.fitBounds(e.target.getBounds(), { padding: [40, 40], maxZoom: 7 });
          }
        });
      }
    });

    geoJsonLayer.addTo(map);
    geoJsonLayerRef.current = geoJsonLayer;
  }, [stateStyle, getSimulatedStateProps, getResilienceColor, onStateSelect]);

  // Reset Map View
  const handleResetView = useCallback(() => {
    const map = mapInstanceRef.current;
    if (map) {
      map.setView([22.9, 79.5], 4.8);
      setSelectedState(null);
      setSelectedIncident(null);
      setActiveDrilldown('India');
    }
  }, []);

  // Zoom Helpers
  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();

  return (
    <div
      className={`india-political-map-wrapper relative w-full h-[640px] rounded-xl overflow-hidden border border-slate-200 bg-slate-50 shadow-sm ${className}`}
      style={{ minHeight: 640 }}
    >
      {/* ── Top Floating Simulation Header (Section 6) ── */}
      <div
        style={{
          position: 'absolute',
          top: 14,
          left: 14,
          zIndex: 400,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(8px)',
          border: '1px solid #E2E8F0',
          borderRadius: 8,
          padding: '6px 10px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, color: '#334155' }}>
          <Clock size={14} color="#0284C7" />
          <span>TIME HORIZON:</span>
        </div>

        <div style={{ display: 'flex', background: '#F1F5F9', borderRadius: 6, padding: 2 }}>
          {(['LIVE', '+6H', '+24H', '+72H', '+7D'] as TimeHorizon[]).map((hz) => (
            <button
              key={hz}
              onClick={() => setTimeHorizon(hz)}
              style={{
                border: 'none',
                padding: '4px 8px',
                fontSize: 10,
                fontWeight: 700,
                borderRadius: 4,
                cursor: 'pointer',
                background: timeHorizon === hz ? '#0284C7' : 'transparent',
                color: timeHorizon === hz ? '#FFFFFF' : '#475569',
                transition: 'all 0.15s'
              }}
            >
              {hz}
            </button>
          ))}
        </div>

        {/* Play Timeline Button */}
        <button
          onClick={() => setIsPlayingTimeline(!isPlayingTimeline)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            border: '1px solid #CBD5E1',
            borderRadius: 6,
            background: isPlayingTimeline ? '#DCFCE7' : '#FFFFFF',
            color: isPlayingTimeline ? '#15803D' : '#334155',
            padding: '4px 8px',
            fontSize: 10,
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          {isPlayingTimeline ? <Pause size={12} /> : <Play size={12} fill="#334155" />}
          <span>{isPlayingTimeline ? 'PAUSE' : '▶ PLAY TIMELINE'}</span>
        </button>
      </div>

      {/* ── Breadcrumb Drilldown (Section 29) ── */}
      <div
        style={{
          position: 'absolute',
          top: 14,
          right: 14,
          zIndex: 400,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          background: 'rgba(255, 255, 255, 0.95)',
          border: '1px solid #E2E8F0',
          borderRadius: 8,
          padding: '6px 12px',
          fontSize: 11,
          fontWeight: 600,
          color: '#475569',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
        }}
      >
        <span
          onClick={handleResetView}
          style={{ cursor: 'pointer', color: '#0284C7' }}
        >
          India (National)
        </span>
        {selectedState && (
          <>
            <ChevronRight size={12} />
            <span style={{ color: '#0F172A', fontWeight: 700 }}>{selectedState.name}</span>
          </>
        )}
      </div>

      {/* ── Leaflet Container ── */}
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%', zIndex: 1 }} />

      {/* ── Incident Layer Markers (Section 8) ── */}
      <IncidentLayer
        map={mapInstanceRef.current}
        incidents={incidents}
        onSelectIncident={(inc) => setSelectedIncident(inc)}
        selectedIncidentId={selectedIncident?.id}
        visible={layers.incidents}
      />

      {/* ── Map Navigation & Tool Controls ── */}
      <div
        style={{
          position: 'absolute',
          bottom: 24,
          left: 14,
          zIndex: 400,
          display: 'flex',
          flexDirection: 'column',
          gap: 6
        }}
      >
        <div style={{ background: '#FFFFFF', borderRadius: 8, border: '1px solid #E2E8F0', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <button
            onClick={handleZoomIn}
            title="Zoom In"
            style={{ width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', borderBottom: '1px solid #E2E8F0', cursor: 'pointer', color: '#334155' }}
          >
            <ZoomIn size={16} />
          </button>
          <button
            onClick={handleZoomOut}
            title="Zoom Out"
            style={{ width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', color: '#334155' }}
          >
            <ZoomOut size={16} />
          </button>
        </div>

        <button
          onClick={handleResetView}
          title="Reset View"
          style={{
            width: 34,
            height: 34,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: 8,
            cursor: 'pointer',
            color: '#334155',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
          }}
        >
          <RotateCcw size={15} />
        </button>

        {/* Layers Toggle Button */}
        <button
          onClick={() => setIsLayerPanelOpen(!isLayerPanelOpen)}
          title="Toggle Layers"
          style={{
            width: 34,
            height: 34,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: isLayerPanelOpen ? '#0284C7' : '#FFFFFF',
            color: isLayerPanelOpen ? '#FFFFFF' : '#334155',
            border: '1px solid #E2E8F0',
            borderRadius: 8,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
          }}
        >
          <Layers size={16} />
        </button>
      </div>

      {/* ── Map Control Floating Panel (Section 28) ── */}
      {isLayerPanelOpen && (
        <div
          style={{
            position: 'absolute',
            bottom: 24,
            left: 56,
            zIndex: 450,
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: 8,
            padding: 12,
            boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
            minWidth: 190
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 700, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>
            MAP LAYERS
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12, color: '#334155' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={layers.resilience}
                onChange={(e) => setLayers({ ...layers, resilience: e.target.checked })}
              />
              <span>Healthcare Risk</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={layers.incidents}
                onChange={(e) => setLayers({ ...layers, incidents: e.target.checked })}
              />
              <span>Incidents ({incidents.length})</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={layers.hospitals}
                onChange={(e) => setLayers({ ...layers, hospitals: e.target.checked })}
              />
              <span>Hospitals</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={layers.phcs}
                onChange={(e) => setLayers({ ...layers, phcs: e.target.checked })}
              />
              <span>PHCs</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={layers.supplyRoutes}
                onChange={(e) => setLayers({ ...layers, supplyRoutes: e.target.checked })}
              />
              <span>Supply Routes</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={layers.emergencyZones}
                onChange={(e) => setLayers({ ...layers, emergencyZones: e.target.checked })}
              />
              <span>Emergency Zones</span>
            </label>
          </div>
        </div>
      )}

      {/* ── Resilience Color Legend (Section 5) ── */}
      <div
        style={{
          position: 'absolute',
          bottom: 24,
          right: 14,
          zIndex: 400,
          background: 'rgba(255, 255, 255, 0.95)',
          border: '1px solid #E2E8F0',
          borderRadius: 8,
          padding: '8px 12px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          fontSize: 11
        }}
      >
        <div style={{ fontWeight: 700, color: '#0F172A', marginBottom: 4, letterSpacing: '0.03em' }}>
          HEALTHCARE RESILIENCE
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 12px', color: '#475569' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#10B981' }} />
            <span>Stable (80–100)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#3B82F6' }} />
            <span>Watch (60–79)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#F97316' }} />
            <span>High Risk (40–59)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#EF4444' }} />
            <span>Critical (0–39)</span>
          </div>
        </div>
      </div>

      {/* ── Right-Side Detailed State Drawer (Section 4) ── */}
      {selectedState && !selectedIncident && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            width: 360,
            maxWidth: '100%',
            background: '#FFFFFF',
            borderLeft: '1px solid #E2E8F0',
            boxShadow: '-4px 0 16px rgba(0,0,0,0.1)',
            zIndex: 500,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* Drawer Header */}
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0', background: '#F8FAFC', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#64748B', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                STATE HEALTHCARE NETWORK
              </div>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0F172A', margin: 0, textTransform: 'uppercase' }}>
                {selectedState.name}
              </h2>
              <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>
                Capital: {selectedState.capital} · {selectedState.type}
              </div>
            </div>
            <button
              onClick={() => setSelectedState(null)}
              style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', padding: 4 }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Drawer Body KPIs */}
          <div style={{ flex: 1, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Resilience Score Card */}
            <div
              style={{
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: 8,
                padding: 14,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>Healthcare Resilience</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: getResilienceColor(selectedState.healthcare_resilience), marginTop: 2 }}>
                  {selectedState.healthcare_resilience}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 4,
                    color: getResilienceColor(selectedState.healthcare_resilience),
                    background: `${getResilienceColor(selectedState.healthcare_resilience)}15`
                  }}
                >
                  {selectedState.inventory_risk}
                </span>
                <div style={{ fontSize: 10, color: '#64748B', marginTop: 4 }}>
                  {horizonModifiers.label}
                </div>
              </div>
            </div>

            {/* Metrics List (Section 4) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 6, padding: 10 }}>
                <div style={{ fontSize: 10, color: '#64748B' }}>Hospitals</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', marginTop: 2 }}>
                  {selectedState.hospitals.toLocaleString()}
                </div>
              </div>

              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 6, padding: 10 }}>
                <div style={{ fontSize: 10, color: '#64748B' }}>PHCs</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', marginTop: 2 }}>
                  {selectedState.phcs.toLocaleString()}
                </div>
              </div>

              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 6, padding: 10 }}>
                <div style={{ fontSize: 10, color: '#64748B' }}>Medicine Availability</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#059669', marginTop: 2 }}>
                  {selectedState.medicine_availability}%
                </div>
              </div>

              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 6, padding: 10 }}>
                <div style={{ fontSize: 10, color: '#64748B' }}>Critical Stockouts</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#DC2626', marginTop: 2 }}>
                  {selectedState.critical_stockouts}
                </div>
              </div>

              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 6, padding: 10 }}>
                <div style={{ fontSize: 10, color: '#64748B' }}>Active Incidents</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#EA580C', marginTop: 2 }}>
                  {selectedState.active_incidents}
                </div>
              </div>

              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 6, padding: 10 }}>
                <div style={{ fontSize: 10, color: '#64748B' }}>Emergency Readiness</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#0284C7', marginTop: 2 }}>
                  {selectedState.emergency_readiness}%
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons (Section 4) */}
          <div style={{ padding: 16, borderTop: '1px solid #E2E8F0', background: '#F8FAFC', display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
              <button
                onClick={() => onNavigateToView?.('inventory-intelligence')}
                style={{ padding: '8px 10px', background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: 6, fontSize: 11, fontWeight: 600, color: '#334155', cursor: 'pointer' }}
              >
                View Inventory
              </button>
              <button
                onClick={() => {
                  setLayers({ ...layers, incidents: true });
                }}
                style={{ padding: '8px 10px', background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: 6, fontSize: 11, fontWeight: 600, color: '#334155', cursor: 'pointer' }}
              >
                View Incidents
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
              <button
                onClick={() => onNavigateToView?.('hospitals')}
                style={{ padding: '8px 10px', background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: 6, fontSize: 11, fontWeight: 600, color: '#334155', cursor: 'pointer' }}
              >
                View Hospitals
              </button>
              <button
                onClick={() => onNavigateToView?.('emergency-operations')}
                style={{ padding: '8px 10px', background: '#EF4444', border: 'none', borderRadius: 6, fontSize: 11, fontWeight: 700, color: '#FFFFFF', cursor: 'pointer' }}
              >
                Simulate Emergency
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Incident Detail Drawer (Section 9) ── */}
      <IncidentDrawer
        incident={selectedIncident}
        onClose={() => setSelectedIncident(null)}
        onRunResponsePlan={() => {
          if (onNavigateToView) onNavigateToView('ai-war-room');
        }}
        onSimulateResponse={() => {
          if (onNavigateToView) onNavigateToView('simulation');
        }}
        onAssignAgent={() => {
          if (onNavigateToView) onNavigateToView('ai-agents');
        }}
        onViewHospitals={() => {
          if (onNavigateToView) onNavigateToView('hospitals');
        }}
      />
    </div>
  );
};

export default IndiaPoliticalMap;
