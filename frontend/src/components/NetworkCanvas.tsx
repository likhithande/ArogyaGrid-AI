import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { playNodeSelectSound } from '../services/soundFx';

export interface NetworkNode {
  id: string;
  x: number; // 0-100 percent
  y: number;
  type: 'national' | 'state' | 'district' | 'phc' | 'warehouse' | 'supplier';
  label: string;
  status: 'healthy' | 'warning' | 'critical' | 'predicted';
  pressure: number; // 0-100
  hasFutureSignal?: boolean;
  signalLabel?: string;
  region?: string;
  orsStock?: number; // units
  daysToStockout?: number;
}

export interface NetworkEdge {
  from: string;
  to: string;
  type: 'supply' | 'demand' | 'critical' | 'ai-recommend';
  active: boolean;
  flowRate?: number;
  delayHours?: number;
}

export interface FlowParticle {
  id: string;
  edgeIdx: number;
  progress: number;
  speed: number;
  type: 'medicine' | 'equipment' | 'emergency' | 'model-update' | 'coldchain';
  size: number;
}

export interface NetworkCanvasProps {
  mode: 'observe' | 'predict' | 'intervene';
  timeOffset: number;
  isEmergency: boolean;
  onSelectNode: (node: NetworkNode) => void;
  selectedNodeId: string | null;
  copilotHighlight: string[];
  // Extended living digital model features
  isSplitView?: boolean;
  splitPosition?: number;
  onSplitChange?: (pos: number) => void;
  simulationDemand?: number; // 0, 10, 25, 40, 60
  zoomLevel?: 1 | 2 | 3 | 4 | 5;
  isFlowMode?: boolean;
  activeResource?: 'all' | 'medicine' | 'equipment' | 'emergency' | 'coldchain';
  isFederatedMode?: boolean;
  isAgentConstellation?: boolean;
}

/* ═══════════════════════════════════════════════
   INDIA SILHOUETTE PATH — organic national contour
═══════════════════════════════════════════════ */
const INDIA_PATH = `M 42,8 C 44,7 46,6 48,7 L 52,8 C 54,9 56,8 58,10 L 62,14 C 64,16 66,18 68,20
  L 72,22 C 73,24 74,26 73,28 L 72,32 C 71,34 72,36 71,38
  L 70,42 C 69,44 68,46 67,48 L 66,52 C 65,54 64,56 62,58
  L 60,62 C 58,64 56,66 54,68 L 52,72 C 50,74 48,76 46,78
  C 44,80 42,80 40,78 L 38,74 C 36,72 34,70 32,68
  L 30,64 C 28,62 26,60 25,58 L 24,54 C 23,52 22,50 22,48
  L 23,44 C 24,42 24,40 25,38 L 26,34 C 27,32 28,30 30,28
  L 32,24 C 34,20 36,16 38,12 L 40,10 Z`;

/* ═══════════════════════════════════════════════
   HEALTHCARE NETWORK NODES
═══════════════════════════════════════════════ */
export const NODES: NetworkNode[] = [
  // National hub
  { id: 'nat-hub', x: 48, y: 30, type: 'national', label: 'National Health Hub', status: 'healthy', pressure: 20, region: 'central', orsStock: 45000, daysToStockout: 90 },
  // Suppliers
  { id: 'sup-pharma', x: 22, y: 18, type: 'supplier', label: 'PharmaCorp India', status: 'healthy', pressure: 15, region: 'north', orsStock: 80000, daysToStockout: 120 },
  { id: 'sup-med', x: 72, y: 15, type: 'supplier', label: 'MedSupply Bios', status: 'warning', pressure: 55, region: 'east', orsStock: 22000, daysToStockout: 18 },
  // State hubs
  { id: 'ap-state', x: 38, y: 55, type: 'state', label: 'Andhra Pradesh Hub', status: 'warning', pressure: 58, hasFutureSignal: true, signalLabel: '72H RISK', region: 'south', orsStock: 8400, daysToStockout: 6 },
  { id: 'ts-state', x: 42, y: 40, type: 'state', label: 'Telangana State Hub', status: 'healthy', pressure: 35, region: 'south', orsStock: 16500, daysToStockout: 28 },
  { id: 'mh-state', x: 28, y: 38, type: 'state', label: 'Maharashtra Hub', status: 'healthy', pressure: 28, region: 'west', orsStock: 24000, daysToStockout: 35 },
  { id: 'ka-state', x: 32, y: 65, type: 'state', label: 'Karnataka State Hub', status: 'healthy', pressure: 22, region: 'south', orsStock: 19000, daysToStockout: 42 },
  { id: 'tn-state', x: 42, y: 75, type: 'state', label: 'Tamil Nadu Hub', status: 'warning', pressure: 61, region: 'south', orsStock: 9200, daysToStockout: 8 },
  { id: 'or-state', x: 58, y: 42, type: 'state', label: 'Odisha State Hub', status: 'healthy', pressure: 31, region: 'east', orsStock: 14000, daysToStockout: 22 },
  { id: 'wb-state', x: 65, y: 32, type: 'state', label: 'West Bengal Hub', status: 'warning', pressure: 54, region: 'east', orsStock: 7800, daysToStockout: 7 },
  { id: 'up-state', x: 45, y: 22, type: 'state', label: 'Uttar Pradesh Hub', status: 'healthy', pressure: 38, region: 'north', orsStock: 31000, daysToStockout: 30 },
  { id: 'rj-state', x: 30, y: 25, type: 'state', label: 'Rajasthan Hub', status: 'healthy', pressure: 26, region: 'west', orsStock: 18500, daysToStockout: 40 },
  // Districts
  { id: 'd-krishna', x: 36, y: 60, type: 'district', label: 'Krishna District', status: 'critical', pressure: 88, hasFutureSignal: true, signalLabel: '48H CRITICAL', region: 'south', orsStock: 850, daysToStockout: 2 },
  { id: 'd-guntur', x: 34, y: 63, type: 'district', label: 'Guntur District', status: 'warning', pressure: 65, region: 'south', orsStock: 1600, daysToStockout: 4 },
  { id: 'd-vizag', x: 44, y: 52, type: 'district', label: 'Visakhapatnam', status: 'healthy', pressure: 40, region: 'south', orsStock: 4200, daysToStockout: 14 },
  { id: 'd-khammam', x: 46, y: 46, type: 'district', label: 'Khammam District', status: 'warning', pressure: 72, hasFutureSignal: true, signalLabel: '24H SURGE', region: 'south', orsStock: 1100, daysToStockout: 3 },
  { id: 'd-warangal', x: 48, y: 38, type: 'district', label: 'Warangal District', status: 'healthy', pressure: 45, region: 'south', orsStock: 3400, daysToStockout: 12 },
  { id: 'd-hyd', x: 40, y: 42, type: 'district', label: 'Hyderabad Central', status: 'healthy', pressure: 30, region: 'south', orsStock: 8900, daysToStockout: 25 },
  { id: 'd-pune', x: 26, y: 42, type: 'district', label: 'Pune District', status: 'healthy', pressure: 25, region: 'west', orsStock: 6200, daysToStockout: 32 },
  { id: 'd-chennai', x: 44, y: 72, type: 'district', label: 'Chennai District', status: 'healthy', pressure: 33, region: 'south', orsStock: 5100, daysToStockout: 20 },
  // PHCs
  { id: 'phc-001', x: 33, y: 58, type: 'phc', label: 'PHC-001 Machilipatnam', status: 'critical', pressure: 95, hasFutureSignal: true, signalLabel: '24H STOCK-OUT', region: 'south', orsStock: 42, daysToStockout: 1 },
  { id: 'phc-042', x: 37, y: 62, type: 'phc', label: 'PHC-042 Vijayawada Rural', status: 'critical', pressure: 91, hasFutureSignal: true, signalLabel: 'ORS RISK', region: 'south', orsStock: 68, daysToStockout: 1.5 },
  { id: 'phc-118', x: 32, y: 65, type: 'phc', label: 'PHC-118 Tenali Coastal', status: 'warning', pressure: 68, region: 'south', orsStock: 180, daysToStockout: 3 },
  { id: 'phc-207', x: 48, y: 48, type: 'phc', label: 'PHC-207 Bhadrachalam', status: 'warning', pressure: 71, region: 'south', orsStock: 140, daysToStockout: 2.5 },
  { id: 'phc-310', x: 45, y: 54, type: 'phc', label: 'PHC-310 Anakapalle', status: 'healthy', pressure: 32, region: 'south', orsStock: 620, daysToStockout: 14 },
  { id: 'phc-445', x: 50, y: 40, type: 'phc', label: 'PHC-445 Kazipet Central', status: 'healthy', pressure: 28, region: 'south', orsStock: 540, daysToStockout: 18 },
  { id: 'phc-512', x: 60, y: 44, type: 'phc', label: 'PHC-512 Koraput Tribal', status: 'healthy', pressure: 22, region: 'east', orsStock: 480, daysToStockout: 21 },
  { id: 'phc-600', x: 67, y: 34, type: 'phc', label: 'PHC-600 Howrah West', status: 'warning', pressure: 62, region: 'east', orsStock: 210, daysToStockout: 4 },
  // Regional Strategic Warehouses
  { id: 'wh-coastal', x: 30, y: 58, type: 'warehouse', label: 'Coastal Strategic WH', status: 'healthy', pressure: 18, region: 'south', orsStock: 12500, daysToStockout: 45 },
  { id: 'wh-dec-central', x: 50, y: 32, type: 'warehouse', label: 'Deccan Central WH', status: 'healthy', pressure: 25, region: 'south', orsStock: 28000, daysToStockout: 60 },
  { id: 'wh-east', x: 62, y: 38, type: 'warehouse', label: 'Eastern Regional WH', status: 'healthy', pressure: 20, region: 'east', orsStock: 16000, daysToStockout: 50 },
];

export const EDGES: NetworkEdge[] = [
  // Supplier → National
  { from: 'sup-pharma', to: 'nat-hub', type: 'supply', active: true, flowRate: 0.7 },
  { from: 'sup-med', to: 'nat-hub', type: 'supply', active: true, flowRate: 0.5, delayHours: 48 },
  // National → States
  { from: 'nat-hub', to: 'ap-state', type: 'supply', active: true, flowRate: 0.8 },
  { from: 'nat-hub', to: 'ts-state', type: 'supply', active: true, flowRate: 0.6 },
  { from: 'nat-hub', to: 'mh-state', type: 'supply', active: true, flowRate: 0.6 },
  { from: 'nat-hub', to: 'tn-state', type: 'supply', active: true, flowRate: 0.7 },
  { from: 'nat-hub', to: 'or-state', type: 'supply', active: true, flowRate: 0.5 },
  { from: 'nat-hub', to: 'wb-state', type: 'supply', active: true, flowRate: 0.6 },
  { from: 'nat-hub', to: 'ka-state', type: 'supply', active: true, flowRate: 0.5 },
  { from: 'nat-hub', to: 'up-state', type: 'supply', active: true, flowRate: 0.6 },
  { from: 'nat-hub', to: 'rj-state', type: 'supply', active: true, flowRate: 0.4 },
  // Warehouses
  { from: 'nat-hub', to: 'wh-dec-central', type: 'supply', active: true, flowRate: 0.7 },
  { from: 'nat-hub', to: 'wh-east', type: 'supply', active: true, flowRate: 0.5 },
  { from: 'ap-state', to: 'wh-coastal', type: 'supply', active: true, flowRate: 0.8 },
  // State → Districts
  { from: 'ap-state', to: 'd-krishna', type: 'supply', active: true, flowRate: 0.9 },
  { from: 'ap-state', to: 'd-guntur', type: 'supply', active: true, flowRate: 0.7 },
  { from: 'ap-state', to: 'd-vizag', type: 'supply', active: true, flowRate: 0.6 },
  { from: 'ts-state', to: 'd-khammam', type: 'supply', active: true, flowRate: 0.7 },
  { from: 'ts-state', to: 'd-warangal', type: 'supply', active: true, flowRate: 0.5 },
  { from: 'ts-state', to: 'd-hyd', type: 'supply', active: true, flowRate: 0.6 },
  { from: 'mh-state', to: 'd-pune', type: 'supply', active: true, flowRate: 0.5 },
  { from: 'tn-state', to: 'd-chennai', type: 'supply', active: true, flowRate: 0.6 },
  // District → PHCs
  { from: 'd-krishna', to: 'phc-001', type: 'critical', active: true, flowRate: 1 },
  { from: 'd-krishna', to: 'phc-042', type: 'critical', active: true, flowRate: 1 },
  { from: 'd-guntur', to: 'phc-118', type: 'supply', active: true, flowRate: 0.6 },
  { from: 'd-khammam', to: 'phc-207', type: 'supply', active: true, flowRate: 0.7 },
  { from: 'd-vizag', to: 'phc-310', type: 'supply', active: true, flowRate: 0.5 },
  { from: 'd-warangal', to: 'phc-445', type: 'supply', active: true, flowRate: 0.5 },
  { from: 'or-state', to: 'phc-512', type: 'supply', active: true, flowRate: 0.4 },
  { from: 'wb-state', to: 'phc-600', type: 'supply', active: true, flowRate: 0.6 },
  // Warehouse → District
  { from: 'wh-coastal', to: 'd-krishna', type: 'supply', active: true, flowRate: 0.8 },
  { from: 'wh-dec-central', to: 'd-warangal', type: 'supply', active: true, flowRate: 0.5 },
  { from: 'wh-east', to: 'or-state', type: 'supply', active: true, flowRate: 0.5 },
];

const NODE_VISUAL = {
  national: { baseR: 20, shape: 'hexagon' as const },
  supplier: { baseR: 14, shape: 'diamond' as const },
  state: { baseR: 14, shape: 'circle' as const },
  district: { baseR: 10, shape: 'circle' as const },
  phc: { baseR: 6.5, shape: 'circle' as const },
  warehouse: { baseR: 12, shape: 'square' as const },
};

const STATUS_COLORS: Record<string, string> = {
  healthy: '#22D3EE',
  warning: '#F59E0B',
  critical: '#EF4444',
  predicted: '#818CF8',
};

const PARTICLE_COLORS: Record<string, string> = {
  medicine: '#22D3EE',
  equipment: '#818CF8',
  emergency: '#EF4444',
  'model-update': '#10B981',
  coldchain: '#06B6D4',
};

// Constellation Agent definitions (Point 31)
const AGENTS = [
  { id: 'demand', label: 'Demand Agent', angle: 0, r: 85, color: '#38BDF8', action: 'Analyzing 1,248 facilities' },
  { id: 'inventory', label: 'Inventory Agent', angle: 51, r: 90, color: '#818CF8', action: 'Evaluating 82,400 stock records' },
  { id: 'supply', label: 'Supply Route Agent', angle: 102, r: 85, color: '#22D3EE', action: 'Monitoring 312 transit routes' },
  { id: 'emergency', label: 'Emergency Agent', angle: 154, r: 95, color: '#EF4444', action: 'Tracking Godavari flood wave' },
  { id: 'anomaly', label: 'Anomaly Agent', angle: 205, r: 85, color: '#F59E0B', action: 'Scanning 4-sigma surge signals' },
  { id: 'optimization', label: 'Optimization Agent', angle: 257, r: 90, color: '#10B981', action: 'Testing 18 redistribution paths' },
  { id: 'governance', label: 'Privacy/Consent Agent', angle: 308, r: 85, color: '#C084FC', action: 'Enforcing DPDP & Zero-Trust' },
];

function hexPath(r: number): string {
  const pts: string[] = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    pts.push(`${Math.cos(angle) * r},${Math.sin(angle) * r}`);
  }
  return `M ${pts.join(' L ')} Z`;
}

function diamondPath(r: number): string {
  return `M 0,${-r} L ${r * 0.75},0 L 0,${r} L ${-r * 0.75},0 Z`;
}

function squarePath(r: number): string {
  const s = r * 0.85;
  return `M ${-s},${-s} L ${s},${-s} L ${s},${s} L ${-s},${s} Z`;
}

function organicPath(
  x1: number, y1: number, x2: number, y2: number, seed: number
): { path: string; cx: number; cy: number } {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const curvature = 0.12 + (seed % 7) * 0.02;
  const nx = -dy / dist;
  const ny = dx / dist;
  const offset = dist * curvature * ((seed % 3 === 0) ? -1 : 1);
  const cx = (x1 + x2) / 2 + nx * offset;
  const cy = (y1 + y2) / 2 + ny * offset;
  return { path: `M ${x1},${y1} Q ${cx},${cy} ${x2},${y2}`, cx, cy };
}

function bezierPoint(t: number, x1: number, y1: number, cx: number, cy: number, x2: number, y2: number) {
  const mt = 1 - t;
  return {
    x: mt * mt * x1 + 2 * mt * t * cx + t * t * x2,
    y: mt * mt * y1 + 2 * mt * t * cy + t * t * y2,
  };
}

export const NetworkCanvas: React.FC<NetworkCanvasProps> = ({
  mode,
  timeOffset,
  isEmergency,
  onSelectNode,
  selectedNodeId,
  copilotHighlight,
  isSplitView = false,
  splitPosition = 50,
  onSplitChange,
  simulationDemand = 0,
  zoomLevel = 1,
  isFlowMode = false,
  activeResource = 'all',
  isFederatedMode = false,
  isAgentConstellation = false,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [particles, setParticles] = useState<FlowParticle[]>([]);
  const [dimensions, setDimensions] = useState({ w: 1400, h: 800 });
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [isDraggingSplit, setIsDraggingSplit] = useState(false);
  const particleTimerRef = useRef(0);
  const particleIdRef = useRef(0);

  // Resize observer
  useEffect(() => {
    const measure = () => {
      if (svgRef.current?.parentElement) {
        const { clientWidth: w, clientHeight: h } = svgRef.current.parentElement;
        setDimensions({ w: Math.max(800, w), h: Math.max(600, h) });
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (svgRef.current?.parentElement) ro.observe(svgRef.current.parentElement);
    return () => ro.disconnect();
  }, []);

  // Split view dragging handler
  const handleSplitMouseMove = useCallback((e: MouseEvent) => {
    if (!isDraggingSplit || !svgRef.current || !onSplitChange) return;
    const rect = svgRef.current.getBoundingClientRect();
    const rawPct = ((e.clientX - rect.left) / rect.width) * 100;
    const clamped = Math.max(15, Math.min(85, rawPct));
    onSplitChange(clamped);
  }, [isDraggingSplit, onSplitChange]);

  const handleSplitMouseUp = useCallback(() => {
    setIsDraggingSplit(false);
  }, []);

  useEffect(() => {
    if (isDraggingSplit) {
      window.addEventListener('mousemove', handleSplitMouseMove);
      window.addEventListener('mouseup', handleSplitMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleSplitMouseMove);
        window.removeEventListener('mouseup', handleSplitMouseUp);
      };
    }
  }, [isDraggingSplit, handleSplitMouseMove, handleSplitMouseUp]);

  // Coordinate mapping with zoom & pan
  const toXY = useCallback((node: NetworkNode) => {
    const { w, h } = dimensions;
    let nx = node.x;
    let ny = node.y;

    // Zoom focus centers
    if (zoomLevel === 2) {
      // State focus on South Belt (AP/TS)
      nx = 38 + (node.x - 38) * 1.5;
      ny = 55 + (node.y - 55) * 1.5;
    } else if (zoomLevel === 3) {
      // District focus on Krishna/Guntur
      nx = 36 + (node.x - 36) * 2.2;
      ny = 60 + (node.y - 60) * 2.2;
    } else if (zoomLevel >= 4) {
      // PHC focus
      nx = 34 + (node.x - 34) * 3.0;
      ny = 59 + (node.y - 59) * 3.0;
    }

    return {
      x: (nx / 100) * w,
      y: (ny / 100) * h,
    };
  }, [dimensions, zoomLevel]);

  // Precompute edges
  const edgeGeometry = useMemo(() => {
    return EDGES.map((edge, i) => {
      const fromNode = NODES.find(n => n.id === edge.from);
      const toNode = NODES.find(n => n.id === edge.to);
      if (!fromNode || !toNode) return null;
      const { x: fx, y: fy } = toXY(fromNode);
      const { x: tx, y: ty } = toXY(toNode);
      const { path, cx, cy } = organicPath(fx, fy, tx, ty, i);
      return { fx, fy, tx, ty, cx, cy, path, edge, fromNode, toNode, idx: i };
    }).filter(Boolean) as Array<{
      fx: number; fy: number; tx: number; ty: number;
      cx: number; cy: number; path: string;
      edge: NetworkEdge; fromNode: NetworkNode; toNode: NetworkNode; idx: number;
    }>;
  }, [dimensions, toXY]);

  // Particle simulation loop
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const dt = Math.min(currentTime - lastTime, 40);
      lastTime = currentTime;
      particleTimerRef.current += dt;

      // Spawn rate based on mode
      const spawnInterval = isFlowMode ? 160 : isEmergency ? 220 : 360;
      if (particleTimerRef.current > spawnInterval) {
        particleTimerRef.current = 0;
        const count = isFlowMode ? 3 : 1;
        const spawned: FlowParticle[] = [];

        for (let i = 0; i < count; i++) {
          const edgeIdx = Math.floor(Math.random() * EDGES.length);
          const edge = EDGES[edgeIdx];

          let type: FlowParticle['type'] = 'medicine';
          if (isFederatedMode) {
            type = 'model-update';
          } else if (edge.type === 'critical') {
            type = 'emergency';
          } else if (activeResource === 'equipment') {
            type = 'equipment';
          } else if (activeResource === 'coldchain') {
            type = 'coldchain';
          } else {
            const types: FlowParticle['type'][] = ['medicine', 'equipment', 'medicine', 'coldchain'];
            type = types[Math.floor(Math.random() * types.length)];
          }

          spawned.push({
            id: `p-${particleIdRef.current++}`,
            edgeIdx,
            progress: 0,
            speed: (0.00035 + Math.random() * 0.0004) * (isEmergency ? 1.4 : 1),
            type,
            size: type === 'emergency' ? 3.5 : isFederatedMode ? 3.0 : 2.4,
          });
        }
        setParticles(prev => [...prev.slice(-80), ...spawned]);
      }

      setParticles(prev =>
        prev
          .map(p => ({ ...p, progress: p.progress + p.speed * dt }))
          .filter(p => p.progress < 1)
      );

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isFlowMode, isEmergency, isFederatedMode, activeResource]);

  // Calculate dynamic pressure with time & simulation surge
  const getEffectivePressure = useCallback((node: NetworkNode) => {
    let p = node.pressure;
    // Time scrub projection
    if (timeOffset > 0 && node.status !== 'healthy') {
      p += timeOffset * 3.5;
    }
    // Simulation demand surge
    if (simulationDemand > 0) {
      if (node.region === 'south' || node.status !== 'healthy') {
        p += simulationDemand * 0.45;
      } else {
        p += simulationDemand * 0.15;
      }
    }
    return Math.min(100, Math.round(p));
  }, [timeOffset, simulationDemand]);

  // Focus filter
  const isFocused = useCallback((nodeId: string) => {
    if (!selectedNodeId && copilotHighlight.length === 0) return true;
    if (copilotHighlight.length > 0) return copilotHighlight.includes(nodeId);
    if (selectedNodeId === nodeId) return true;
    const connected = EDGES.some(e =>
      (e.from === selectedNodeId && e.to === nodeId) ||
      (e.to === selectedNodeId && e.from === nodeId)
    );
    return connected;
  }, [selectedNodeId, copilotHighlight]);

  const { w, h } = dimensions;
  const splitX = (splitPosition / 100) * w;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox={`0 0 ${w} ${h}`}
        style={{ position: 'absolute', inset: 0, userSelect: 'none' }}
        aria-label="ArogyaGrid Living Healthcare Network Visualization"
      >
        <defs>
          {/* Subtle Ambient Vignettes */}
          <radialGradient id="net-vignette" cx="50%" cy="50%" r="72%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="100%" stopColor="rgba(2,5,11,0.65)" />
          </radialGradient>

          <radialGradient id="center-core" cx="48%" cy="40%" r="45%">
            <stop offset="0%" stopColor="rgba(6,182,212,0.06)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>

          <radialGradient id="simulation-glow" cx="42%" cy="60%" r="50%">
            <stop offset="0%" stopColor="rgba(245,158,11,0.08)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>

          <radialGradient id="flood-wave-glow" cx="36%" cy="60%" r="35%">
            <stop offset="0%" stopColor="rgba(239,68,68,0.12)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>

          {/* Glow Filters */}
          <filter id="soft-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <filter id="intense-glow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <filter id="aura-blur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="10" />
          </filter>

          {/* Split clip paths */}
          <clipPath id="split-left-clip">
            <rect x="0" y="0" width={splitX} height={h} />
          </clipPath>
          <clipPath id="split-right-clip">
            <rect x={splitX} y="0" width={w - splitX} height={h} />
          </clipPath>
        </defs>

        {/* ── Background layers ── */}
        <rect width={w} height={h} fill="url(#center-core)" />
        {simulationDemand > 0 && <rect width={w} height={h} fill="url(#simulation-glow)" />}
        {isEmergency && <rect width={w} height={h} fill="url(#flood-wave-glow)" />}
        <rect width={w} height={h} fill="url(#net-vignette)" />

        {/* ── India Silhouette Organic Contour ── */}
        <g style={{ pointerEvents: 'none', opacity: 0.05 }}>
          <path
            d={INDIA_PATH}
            fill="none"
            stroke="#06B6D4"
            strokeWidth="1.6"
            transform={`translate(${w * 0.08}, ${h * 0.03}) scale(${w / 100 * 0.84}, ${h / 100 * 0.94})`}
          />
        </g>

        {/* ── Subtle Network Matrix Grid ── */}
        <g style={{ pointerEvents: 'none', opacity: 0.025 }}>
          {Array.from({ length: Math.floor(w / 80) }, (_, i) => (
            <line key={`vg-${i}`} x1={(i + 1) * 80} y1={0} x2={(i + 1) * 80} y2={h} stroke="#2563EB" strokeWidth="0.5" />
          ))}
          {Array.from({ length: Math.floor(h / 80) }, (_, i) => (
            <line key={`hg-${i}`} x1={0} y1={(i + 1) * 80} x2={w} y2={(i + 1) * 80} stroke="#2563EB" strokeWidth="0.5" />
          ))}
        </g>

        {/* ── Pressure Field Auroras (Living System Glow) ── */}
        {NODES.filter(n => n.pressure > 35).map(node => {
          const { x, y } = toXY(node);
          const press = getEffectivePressure(node);
          const baseR = NODE_VISUAL[node.type].baseR;
          const auraR = baseR * 2.2 + press * 0.45;
          const col = press > 80 ? '#EF4444' : press > 55 ? '#F59E0B' : '#06B6D4';
          const focused = isFocused(node.id);

          return (
            <circle
              key={`aura-${node.id}`}
              cx={x} cy={y} r={auraR}
              fill={col}
              fillOpacity={focused ? 0.035 + press * 0.0004 : 0.008}
              filter="url(#aura-blur)"
              style={{ pointerEvents: 'none' }}
            >
              <animate attributeName="r" values={`${auraR};${auraR * 1.12};${auraR}`} dur={`${4 - press * 0.02}s`} repeatCount="indefinite" />
            </circle>
          );
        })}

        {/* ── Routes / Edges ── */}
        {edgeGeometry.map(geo => {
          const { edge, fromNode, toNode, path, idx } = geo;
          const focused = isFocused(fromNode.id) && isFocused(toNode.id);
          const isCrit = edge.type === 'critical';
          const isDelayed = edge.delayHours && edge.delayHours > 0;
          const strokeColor = isCrit ? '#EF4444' : isDelayed ? '#F59E0B' : '#2563EB';
          const baseOpacity = isCrit ? 0.6 : isDelayed ? 0.45 : 0.22;
          const opacity = focused ? baseOpacity : 0.04;

          return (
            <g key={`edge-${idx}`}>
              {/* Route Glow Trail */}
              {isCrit && focused && (
                <path d={path} fill="none" stroke="#EF4444" strokeWidth="5" strokeOpacity="0.09" filter="url(#aura-blur)" />
              )}
              {/* Route stroke */}
              <path
                d={path}
                fill="none"
                stroke={strokeColor}
                strokeWidth={isCrit ? 1.8 : 1.0}
                strokeOpacity={opacity}
                strokeDasharray={isCrit ? '6 4' : isDelayed ? '4 4' : 'none'}
              />
            </g>
          );
        })}

        {/* ── Flowing Resource Particles (Point 16, 17) ── */}
        {particles.map(p => {
          const geo = edgeGeometry[p.edgeIdx];
          if (!geo) return null;
          const { fx, fy, cx, cy, tx, ty } = geo;
          const pos = bezierPoint(p.progress, fx, fy, cx, cy, tx, ty);
          const color = PARTICLE_COLORS[p.type] || '#22D3EE';
          const opacity = Math.sin(p.progress * Math.PI) * 0.95;

          return (
            <g key={p.id} style={{ pointerEvents: 'none' }}>
              <circle cx={pos.x} cy={pos.y} r={p.size * 2.2} fill={color} fillOpacity={opacity * 0.18} />
              <circle cx={pos.x} cy={pos.y} r={p.size} fill={color} fillOpacity={opacity} />
            </g>
          );
        })}

        {/* ── Prediction Halos in PREDICT mode (Point 9) ── */}
        {(mode === 'predict' || isSplitView) && NODES.filter(n => n.hasFutureSignal).map(node => {
          const { x, y } = toXY(node);
          const r = NODE_VISUAL[node.type].baseR;

          return (
            <g key={`halo-${node.id}`} style={{ pointerEvents: 'none' }} clipPath={isSplitView ? 'url(#split-right-clip)' : undefined}>
              <circle cx={x} cy={y} r={r * 3.4} fill="none" stroke="#818CF8" strokeWidth="1" strokeDasharray="3 4" strokeOpacity="0.3">
                <animate attributeName="r" values={`${r * 2.8};${r * 3.8};${r * 2.8}`} dur="3.5s" repeatCount="indefinite" />
                <animate attributeName="stroke-opacity" values="0.2;0.5;0.2" dur="3.5s" repeatCount="indefinite" />
              </circle>
              <circle cx={x} cy={y} r={r * 1.8} fill="#818CF8" fillOpacity="0.04">
                <animate attributeName="fill-opacity" values="0.02;0.07;0.02" dur="3s" repeatCount="indefinite" />
              </circle>
            </g>
          );
        })}

        {/* ── Emergency Disturbance Shockwaves (Point 18, 19) ── */}
        {isEmergency && NODES.filter(n => n.status === 'critical').map(node => {
          const { x, y } = toXY(node);
          const r = NODE_VISUAL[node.type].baseR;

          return (
            <g key={`shock-${node.id}`} style={{ pointerEvents: 'none' }}>
              {[0, 0.7, 1.4].map((delay, i) => (
                <circle key={i} cx={x} cy={y} r={r * 2} fill="none" stroke="#EF4444" strokeWidth="0.9">
                  <animate attributeName="r" values={`${r * 1.4};${r * 5.2}`} dur="2.4s" begin={`${delay}s`} repeatCount="indefinite" />
                  <animate attributeName="stroke-opacity" values="0.6;0" dur="2.4s" begin={`${delay}s`} repeatCount="indefinite" />
                </circle>
              ))}
            </g>
          );
        })}

        {/* ── AI Recommendation Intervention Path (Point 27) ── */}
        {mode === 'intervene' && (() => {
          const from = NODES.find(n => n.id === 'wh-coastal');
          const to = NODES.find(n => n.id === 'phc-001');
          if (!from || !to) return null;
          const { x: fx, y: fy } = toXY(from);
          const { x: tx, y: ty } = toXY(to);
          const { path } = organicPath(fx, fy, tx, ty, 42);
          const mx = (fx + tx) / 2;
          const my = (fy + ty) / 2;

          return (
            <g opacity="0.95">
              <path d={path} fill="none" stroke="#F59E0B" strokeWidth="7" strokeOpacity="0.09" filter="url(#aura-blur)" />
              <path d={path} fill="none" stroke="#F59E0B" strokeWidth="2.2" strokeOpacity="0.85" strokeDasharray="8 5">
                <animate attributeName="stroke-dashoffset" values="0;-26" dur="1s" repeatCount="indefinite" />
              </path>
              <g transform={`translate(${mx}, ${my})`}>
                <rect x={-50} y={-15} width={100} height={30} rx={8} fill="rgba(8,14,28,0.95)" stroke="rgba(245,158,11,0.6)" strokeWidth="1" filter="url(#soft-glow)" />
                <text x={0} y={4} textAnchor="middle" fill="#FCD34D" fontSize="10.5" fontWeight="800" fontFamily="JetBrains Mono">
                  800 UNITS ORS
                </text>
              </g>
            </g>
          );
        })()}

        {/* ── Federated AI Privacy Boundary & Model Exchange (Point 29, 30) ── */}
        {isFederatedMode && NODES.filter(n => n.type === 'phc').map(node => {
          const { x, y } = toXY(node);
          return (
            <g key={`fed-${node.id}`} style={{ pointerEvents: 'none' }}>
              <circle cx={x} cy={y} r={18} fill="rgba(16,185,129,0.06)" stroke="#10B981" strokeWidth="1" strokeDasharray="3 3" />
              <text x={x} y={y - 22} textAnchor="middle" fill="#34D399" fontSize="8" fontWeight="700" fontFamily="JetBrains Mono">
                🔒 LOCAL DATA
              </text>
            </g>
          );
        })}

        {/* ── Healthcare Nodes (Point 4, 6) ── */}
        {NODES.map(node => {
          const { x, y } = toXY(node);
          const vis = NODE_VISUAL[node.type];
          const r = vis.baseR;
          const press = getEffectivePressure(node);
          const col = press > 80 ? '#EF4444' : press > 55 ? '#F59E0B' : '#06B6D4';
          const focused = isFocused(node.id);
          const isSelected = selectedNodeId === node.id;
          const isHovered = hoveredNode === node.id;
          const opacity = focused ? 1 : 0.12;
          const scale = isSelected ? 1.35 : isHovered ? 1.18 : 1;

          const shapePath = vis.shape === 'hexagon' ? hexPath(r)
            : vis.shape === 'diamond' ? diamondPath(r)
            : vis.shape === 'square' ? squarePath(r)
            : '';

          const fillColor = press > 80 ? 'rgba(28,6,6,0.92)'
            : press > 55 ? 'rgba(28,16,6,0.92)'
            : 'rgba(6,16,30,0.92)';

          return (
            <g
              key={node.id}
              style={{
                transform: `translate(${x}px, ${y}px) scale(${scale})`,
                transformOrigin: '0 0',
                opacity,
                cursor: 'pointer',
                transition: 'opacity 0.4s ease, transform 0.22s cubic-bezier(0.34,1.56,0.64,1)',
              }}
              onClick={() => {
                playNodeSelectSound();
                onSelectNode(node);
              }}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
              role="button"
              aria-label={`${node.label} ${node.type} pressure ${press}`}
            >
              {/* Selected Orbit Ring */}
              {isSelected && (
                <circle cx={0} cy={0} r={r + 12} fill="none" stroke={col} strokeWidth="1.2" strokeOpacity="0.6" strokeDasharray="3 4">
                  <animateTransform attributeName="transform" type="rotate" values="0;360" dur="10s" repeatCount="indefinite" />
                </circle>
              )}

              {/* Critical Pulsing Perimeter (Point 6) */}
              {press > 80 && (
                <>
                  <circle cx={0} cy={0} r={r + 3} fill="none" stroke="#EF4444" strokeWidth="1.4">
                    <animate attributeName="r" values={`${r + 3};${r + 16}`} dur="2s" repeatCount="indefinite" />
                    <animate attributeName="stroke-opacity" values="0.7;0" dur="2s" repeatCount="indefinite" />
                  </circle>
                  <circle cx={0} cy={0} r={r + 3} fill="none" stroke="#EF4444" strokeWidth="0.8">
                    <animate attributeName="r" values={`${r + 3};${r + 12}`} dur="2s" begin="0.8s" repeatCount="indefinite" />
                    <animate attributeName="stroke-opacity" values="0.5;0" dur="2s" begin="0.8s" repeatCount="indefinite" />
                  </circle>
                </>
              )}

              {/* Node Geometry */}
              {vis.shape === 'circle' ? (
                <circle
                  cx={0} cy={0} r={r}
                  fill={fillColor}
                  stroke={col}
                  strokeWidth={node.type === 'state' ? 2 : node.type === 'district' ? 1.4 : 1.1}
                  filter={(isSelected || isHovered) ? 'url(#soft-glow)' : undefined}
                />
              ) : (
                <path
                  d={shapePath}
                  fill={fillColor}
                  stroke={col}
                  strokeWidth={node.type === 'national' ? 2.2 : 1.6}
                  strokeLinejoin="round"
                  filter={(isSelected || isHovered) ? 'url(#intense-glow)' : undefined}
                />
              )}

              {/* National Hub Code */}
              {node.type === 'national' && (
                <text x={0} y={3.5} textAnchor="middle" fill="#22D3EE" fontSize={8} fontWeight="900" fontFamily="JetBrains Mono" style={{ pointerEvents: 'none' }}>
                  CORE
                </text>
              )}

              {/* Warehouse glyph */}
              {node.type === 'warehouse' && (
                <polygon points={`0,${-r * 0.4} ${r * 0.35},${r * 0.25} ${-r * 0.35},${r * 0.25}`} fill={col} opacity={0.7} />
              )}

              {/* Supplier glyph */}
              {node.type === 'supplier' && (
                <circle cx={0} cy={0} r={3} fill={col} opacity={0.8} />
              )}

              {/* Progressive Detail Node Labels (Point 14) */}
              {(node.type === 'national' || node.type === 'state' || node.type === 'warehouse' || isSelected || isHovered || zoomLevel >= 3) && (
                <text
                  x={0} y={r + 14}
                  textAnchor="middle"
                  fill={isSelected || isHovered ? col : 'rgba(255,255,255,0.45)'}
                  fontSize={node.type === 'national' ? 9.5 : node.type === 'state' ? 8.5 : 7.5}
                  fontWeight="600"
                  fontFamily="Inter, sans-serif"
                  style={{ pointerEvents: 'none' }}
                >
                  {node.label}
                </text>
              )}

              {/* Pressure readout on hover */}
              {(isHovered || isSelected) && (
                <g transform={`translate(${-r - 10}, ${-5})`}>
                  <text x={0} y={0} textAnchor="end" fill={col} fontSize={11} fontWeight="800" fontFamily="JetBrains Mono" style={{ pointerEvents: 'none' }}>
                    {press}%
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* ── Copilot Highlighting (Point 11) ── */}
        {copilotHighlight.length > 0 && (
          <rect width={w} height={h} fill="rgba(4,8,15,0.52)" style={{ pointerEvents: 'none' }} />
        )}
        {copilotHighlight.length > 0 && NODES.filter(n => copilotHighlight.includes(n.id)).map(node => {
          const { x, y } = toXY(node);
          const r = NODE_VISUAL[node.type].baseR;
          const col = STATUS_COLORS[node.status];
          return (
            <g key={`cop-${node.id}`} style={{ pointerEvents: 'none' }}>
              <circle cx={x} cy={y} r={r + 22} fill="none" stroke={col} strokeWidth="1.8" strokeDasharray="4 4">
                <animate attributeName="r" values={`${r + 18};${r + 26};${r + 18}`} dur="2s" repeatCount="indefinite" />
              </circle>
              <text x={x} y={y + r + 28} textAnchor="middle" fill={col} fontSize={8.5} fontWeight="700" fontFamily="JetBrains Mono">
                {node.label.toUpperCase()}
              </text>
            </g>
          );
        })}

        {/* ── AI Agent Constellation Overlay (Point 31, 32) ── */}
        {isAgentConstellation && (
          <g transform={`translate(${w * 0.76}, ${h * 0.44})`}>
            {/* Backdrop halo */}
            <circle cx={0} cy={0} r={140} fill="rgba(4,8,15,0.85)" stroke="rgba(129,140,248,0.2)" strokeWidth="1" filter="url(#aura-blur)" />
            {/* Central Resilience Brain */}
            <circle cx={0} cy={0} r={28} fill="rgba(14,24,46,0.95)" stroke="#818CF8" strokeWidth="2" filter="url(#intense-glow)" />
            <text x={0} y={4} textAnchor="middle" fill="#C7D2FE" fontSize="9" fontWeight="900" fontFamily="JetBrains Mono">
              BRAIN
            </text>
            {/* Orbiting Agents */}
            {AGENTS.map(agent => {
              const rad = (agent.angle * Math.PI) / 180;
              const ax = Math.cos(rad) * agent.r;
              const ay = Math.sin(rad) * agent.r;
              return (
                <g key={agent.id}>
                  {/* Comm Beam */}
                  <line x1={0} y1={0} x2={ax} y2={ay} stroke={agent.color} strokeWidth="1" strokeOpacity="0.4" strokeDasharray="2 3">
                    <animate attributeName="stroke-dashoffset" values="0;-10" dur="0.8s" repeatCount="indefinite" />
                  </line>
                  {/* Agent Node */}
                  <circle cx={ax} cy={ay} r={13} fill="rgba(6,12,24,0.95)" stroke={agent.color} strokeWidth="1.5" />
                  <text x={ax} y={ay + 22} textAnchor="middle" fill={agent.color} fontSize="7.5" fontWeight="700" fontFamily="JetBrains Mono">
                    {agent.label}
                  </text>
                </g>
              );
            })}
          </g>
        )}

        {/* ── Split Reality Vertical Divider (Point 8, 21) ── */}
        {isSplitView && (
          <g>
            {/* Divider line */}
            <line x1={splitX} y1={0} x2={splitX} y2={h} stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
            <line x1={splitX} y1={0} x2={splitX} y2={h} stroke="#818CF8" strokeWidth="1" strokeDasharray="6 4" />
            {/* Left/Right ambient watermarks */}
            <text x={splitX * 0.5} y={35} textAnchor="middle" fill="rgba(6,182,212,0.4)" fontSize="11" fontWeight="800" fontFamily="JetBrains Mono" letterSpacing="0.12em">
              ◀ CURRENT REALITY (OBSERVED)
            </text>
            <text x={splitX + (w - splitX) * 0.5} y={35} textAnchor="middle" fill="rgba(129,140,248,0.5)" fontSize="11" fontWeight="800" fontFamily="JetBrains Mono" letterSpacing="0.12em">
              AI FORECAST (+72H PREDICTED) ▶
            </text>
          </g>
        )}
      </svg>

      {/* ── Draggable Split Handle (Point 8, 21) ── */}
      {isSplitView && onSplitChange && (
        <div
          onMouseDown={() => setIsDraggingSplit(true)}
          style={{
            position: 'absolute',
            left: `${splitPosition}%`,
            top: '50%',
            transform: 'translate(-50%, -50%)',
            cursor: 'ew-resize',
            zIndex: 30,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{
            background: 'rgba(8,16,32,0.96)',
            border: '1px solid rgba(129,140,248,0.5)',
            borderRadius: 9999,
            padding: '6px 14px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.6), 0 0 16px rgba(129,140,248,0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            backdropFilter: 'blur(16px)',
          }}>
            <span style={{ fontSize: 9, fontWeight: 800, color: '#22D3EE', fontFamily: 'JetBrains Mono' }}>REALITY</span>
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10 }}>◧</span>
            <span style={{ fontSize: 9, fontWeight: 800, color: '#A5B4FC', fontFamily: 'JetBrains Mono' }}>FORECAST</span>
          </div>
        </div>
      )}
    </div>
  );
};
