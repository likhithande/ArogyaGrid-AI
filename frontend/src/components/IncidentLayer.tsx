import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { IncidentItem } from './IncidentDrawer';

interface IncidentLayerProps {
  map: L.Map | null;
  incidents: IncidentItem[];
  onSelectIncident: (incident: IncidentItem) => void;
  selectedIncidentId?: string | null;
  visible?: boolean;
}

export const IncidentLayer: React.FC<IncidentLayerProps> = ({
  map,
  incidents,
  onSelectIncident,
  selectedIncidentId,
  visible = true
}) => {
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!map) return;

    if (!layerGroupRef.current) {
      layerGroupRef.current = L.layerGroup().addTo(map);
    }

    const layerGroup = layerGroupRef.current;
    layerGroup.clearLayers();

    if (!visible) return;

    incidents.forEach((inc) => {
      const isSelected = selectedIncidentId === inc.id;
      const isCritical = inc.severity === 'CRITICAL';
      const isHigh = inc.severity === 'HIGH';
      const isMedium = inc.severity === 'MEDIUM';

      const color =
        isCritical ? '#EF4444' :
        isHigh ? '#F97316' :
        isMedium ? '#F59E0B' : '#3B82F6';

      const pulseHtml = inc.isNew ? `<span class="incident-pulse-ring" style="border-color:${color}"></span>` : '';

      const markerHtml = `
        <div class="custom-incident-marker ${inc.isNew ? 'is-new-incident' : ''} ${isSelected ? 'is-selected' : ''}" style="--marker-color:${color};">
          ${pulseHtml}
          <div class="marker-pin" style="background-color:${color};">
            <span class="marker-dot"></span>
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: markerHtml,
        className: 'incident-marker-icon',
        iconSize: [28, 28],
        iconAnchor: [14, 28],
        popupAnchor: [0, -28]
      });

      const marker = L.marker([inc.latitude, inc.longitude], { icon: customIcon });

      // Clean executive tooltip
      const tooltipContent = `
        <div style="font-family: inherit; font-size: 11px; padding: 4px 6px; line-height: 1.3;">
          <div style="font-weight: 700; color: ${color}; text-transform: uppercase; font-size: 9px; letter-spacing: 0.05em;">
            ● ${inc.severity} · ${inc.type}
          </div>
          <div style="font-weight: 700; color: #0F172A; margin-top: 2px;">
            ${inc.title}
          </div>
          <div style="color: #64748B; font-size: 10px; margin-top: 2px;">
            ${inc.district}, ${inc.state}
          </div>
          <div style="margin-top: 4px; display: flex; gap: 8px; font-size: 10px; color: #334155; font-weight: 600;">
            <span>${inc.affectedHospitals} Hospitals</span>
            <span>${(inc.affectedPopulation / 1000000).toFixed(1)}M Pop</span>
          </div>
        </div>
      `;

      marker.bindTooltip(tooltipContent, {
        direction: 'top',
        className: 'custom-leaflet-tooltip',
        offset: [0, -26]
      });

      marker.on('click', () => {
        onSelectIncident(inc);
      });

      marker.addTo(layerGroup);
    });

    return () => {
      // Retain layerGroup
    };
  }, [map, incidents, visible, selectedIncidentId, onSelectIncident]);

  return null;
};

export default IncidentLayer;
