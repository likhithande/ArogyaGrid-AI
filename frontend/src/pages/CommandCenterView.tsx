import React, { useState, useEffect, useCallback } from 'react';
import {
  Shield, AlertTriangle, ArrowRight, RefreshCw,
  CheckCircle2, TrendingUp, Clock, MapPin,
  Building, ChevronRight, Activity, Truck, ExternalLink,
  Layers, Filter, Eye, ShieldCheck, Zap, Compass, Building2,
  Crosshair, Radio, Info, Package, Bot, ShieldAlert
} from 'lucide-react';
import { RiskBadge, StatusBadge } from '../components/design-system';
import { GeographicContext } from '../components/AppTopBar';
import { IndiaMap } from '../components/IndiaMap';
import { LiveClock } from '../components/LiveClock';
import { LiveStatusIndicator } from '../components/LiveStatusIndicator';
import { IndiaPoliticalMap } from '../components/IndiaPoliticalMap';
import { LiveInventoryFeed } from '../components/LiveInventoryFeed';
import { useLiveSocket } from '../hooks/useLiveSocket';
import { toggleDemoIncidents } from '../services/api';

export interface RealHospital {
  id: string;
  name: string;
  shortName: string;
  location: string;
  district: string;
  category: 'National Apex' | 'Government Teaching' | 'District Hospital' | 'Private Critical Care' | 'CHC' | 'PHC';
  totalBeds: number;
  icuBeds: number;
  occupiedBeds: number;
  oxygenStatus: string;
  status: 'critical' | 'warning' | 'stable';
  daysOfStock: number;
  criticalItem?: string;
  x: number;
  y: number;
  doctorsPresent: number;
  doctorsSanctioned: number;
  dailyFootfall: number;
  isIncidentEpicenter?: boolean;
}

export interface IndiaState {
  id: string;
  name: string;
  code: string;
  capital: string;
  svgPath: string;
  labelX: number;
  labelY: number;
  resilienceScore: number;
  status: 'incident' | 'warning' | 'stable';
  hospitalsCount: number;
  activeSurge: string;
  isIncidentZone?: boolean;
}

// 12 Real Hospitals Located in the Incident Area (Krishna, NTR, Guntur, Coastal Andhra)
const REAL_HOSPITALS: RealHospital[] = [
  {
    id: 'hosp-old-ggh',
    name: 'Government General Hospital (Old GGH), Vijayawada',
    shortName: 'Old GGH Vijayawada',
    location: 'Hanumanpet, Station Road, Vijayawada',
    district: 'Krishna (NTR)',
    category: 'Government Teaching',
    totalBeds: 550,
    icuBeds: 52,
    occupiedBeds: 508,
    oxygenStatus: 'PSA Plant 94% (420 LPM)',
    status: 'warning',
    daysOfStock: 2.1,
    criticalItem: '+34% Outpatient Gastroenteritis Surge',
    x: 295,
    y: 195,
    doctorsPresent: 48,
    doctorsSanctioned: 52,
    dailyFootfall: 1840,
    isIncidentEpicenter: true
  },
  {
    id: 'hosp-new-ggh',
    name: 'New Government General Hospital (Siddhartha Medical College)',
    shortName: 'New GGH Gunadala',
    location: 'Ring Road, Gunadala, Vijayawada',
    district: 'Krishna',
    category: 'Government Teaching',
    totalBeds: 650,
    icuBeds: 60,
    occupiedBeds: 540,
    oxygenStatus: 'Dedicated Cryogenic Liquid Oxygen Active',
    status: 'stable',
    daysOfStock: 9.4,
    x: 325,
    y: 185,
    doctorsPresent: 64,
    doctorsSanctioned: 68,
    dailyFootfall: 2150
  },
  {
    id: 'hosp-aiims-mangalagiri',
    name: 'All India Institute of Medical Sciences (AIIMS) Mangalagiri',
    shortName: 'AIIMS Mangalagiri',
    location: 'NH-16 Mangalagiri, Guntur/Vijayawada Border',
    district: 'Guntur',
    category: 'National Apex',
    totalBeds: 960,
    icuBeds: 120,
    occupiedBeds: 680,
    oxygenStatus: 'Central Liquid Grid (20k Liter Tank)',
    status: 'stable',
    daysOfStock: 14.8,
    criticalItem: 'Regional Strategic Stock Reserve Hub',
    x: 280,
    y: 225,
    doctorsPresent: 142,
    doctorsSanctioned: 150,
    dailyFootfall: 3200
  },
  {
    id: 'hosp-guntur-ggh',
    name: 'Guntur Government Comprehensive General Hospital (GGH Guntur)',
    shortName: 'GGH Guntur',
    location: 'Kanna Vari Thota, Sambasiva Pet, Guntur',
    district: 'Guntur',
    category: 'Government Teaching',
    totalBeds: 1200,
    icuBeds: 95,
    occupiedBeds: 1040,
    oxygenStatus: 'High Volume Liquid Oxygen (Operational)',
    status: 'stable',
    daysOfStock: 11.2,
    criticalItem: 'Central Blood, Plasma & Antivenom Bank',
    x: 260,
    y: 265,
    doctorsPresent: 98,
    doctorsSanctioned: 110,
    dailyFootfall: 2980
  },
  {
    id: 'hosp-machilipatnam',
    name: 'District General Hospital Machilipatnam',
    shortName: 'District Hospital Machilipatnam',
    location: 'Coastal Cyclone Landfall Zone, Machilipatnam Port',
    district: 'Krishna',
    category: 'District Hospital',
    totalBeds: 250,
    icuBeds: 24,
    occupiedBeds: 242,
    oxygenStatus: 'Dual Manifold Cylinder Bank (42 Left)',
    status: 'critical',
    daysOfStock: 0.8,
    criticalItem: 'Amoxicillin & ORS Rupture in 18 Hours',
    x: 395,
    y: 255,
    doctorsPresent: 18,
    doctorsSanctioned: 24,
    dailyFootfall: 920,
    isIncidentEpicenter: true
  },
  {
    id: 'hosp-andhra',
    name: 'Andhra Hospitals Heart & Brain Institute',
    shortName: 'Andhra Hospitals Vijayawada',
    location: 'C.V.R. Complex, Governorpet, Vijayawada',
    district: 'Krishna',
    category: 'Private Critical Care',
    totalBeds: 180,
    icuBeds: 30,
    occupiedBeds: 145,
    oxygenStatus: 'Full Onsite Cryogenic Supply',
    status: 'stable',
    daysOfStock: 7.5,
    x: 310,
    y: 200,
    doctorsPresent: 28,
    doctorsSanctioned: 30,
    dailyFootfall: 640
  },
  {
    id: 'hosp-ramesh',
    name: 'Aster Ramesh Hospitals',
    shortName: 'Ramesh Hospitals Guntur/Vijayawada',
    location: 'Collectorate Road, Guntur & ITI Road, Vijayawada',
    district: 'Guntur',
    category: 'Private Critical Care',
    totalBeds: 350,
    icuBeds: 45,
    occupiedBeds: 290,
    oxygenStatus: 'Liquid Oxygen Reservoir (92%)',
    status: 'stable',
    daysOfStock: 8.2,
    x: 275,
    y: 250,
    doctorsPresent: 45,
    doctorsSanctioned: 48,
    dailyFootfall: 1120
  },
  {
    id: 'hosp-manipal',
    name: 'Manipal Hospital Tadepalli',
    shortName: 'Manipal Hospital Tadepalli',
    location: 'Near Kanaka Durga Varadhi, Tadepalli, Vijayawada',
    district: 'Guntur (Vijayawada Gateway)',
    category: 'Private Critical Care',
    totalBeds: 250,
    icuBeds: 38,
    occupiedBeds: 215,
    oxygenStatus: 'Dedicated Onsite Oxygen Generation Plant',
    status: 'stable',
    daysOfStock: 6.8,
    x: 290,
    y: 210,
    doctorsPresent: 36,
    doctorsSanctioned: 40,
    dailyFootfall: 890
  },
  {
    id: 'hosp-avanigadda',
    name: 'Community Health Centre (CHC) Avanigadda',
    shortName: 'CHC Avanigadda (Delta Island)',
    location: 'Diviseema Riverine Delta, Avanigadda',
    district: 'Krishna',
    category: 'CHC',
    totalBeds: 50,
    icuBeds: 4,
    occupiedBeds: 48,
    oxygenStatus: 'Emergency Cylinder Reserves Only',
    status: 'warning',
    daysOfStock: 1.9,
    criticalItem: 'Cut-off Risk: Lowland Flood Barrier Inundation',
    x: 375,
    y: 295,
    doctorsPresent: 5,
    doctorsSanctioned: 6,
    dailyFootfall: 380,
    isIncidentEpicenter: true
  },
  {
    id: 'hosp-gudivada',
    name: 'Area Hospital Gudivada',
    shortName: 'Area Hospital Gudivada',
    location: 'Gudivada Urban Node, Krishna',
    district: 'Krishna',
    category: 'District Hospital',
    totalBeds: 100,
    icuBeds: 12,
    occupiedBeds: 82,
    oxygenStatus: 'Grid Manifold (Stable)',
    status: 'stable',
    daysOfStock: 5.6,
    x: 350,
    y: 220,
    doctorsPresent: 14,
    doctorsSanctioned: 16,
    dailyFootfall: 560
  },
  {
    id: 'hosp-tenali',
    name: 'Tenali Sub-District Hospital & Urban CHC',
    shortName: 'Tenali Sub-District Hospital',
    location: 'Station Road, Tenali, Guntur',
    district: 'Guntur',
    category: 'District Hospital',
    totalBeds: 160,
    icuBeds: 18,
    occupiedBeds: 118,
    oxygenStatus: 'PSA Generator (98% Pure)',
    status: 'stable',
    daysOfStock: 16.5,
    criticalItem: 'Surplus Reserve: 8,400 Units ORS & Antibiotics',
    x: 300,
    y: 270,
    doctorsPresent: 18,
    doctorsSanctioned: 20,
    dailyFootfall: 620
  },
  {
    id: 'hosp-phc-04',
    name: 'Primary Health Centre (PHC) Vijayawada Rural / PHC-04',
    shortName: 'Vijayawada PHC-04',
    location: 'Gollapudi / Nunna Rural Mandal, Krishna',
    district: 'Krishna',
    category: 'PHC',
    totalBeds: 12,
    icuBeds: 2,
    occupiedBeds: 9,
    oxygenStatus: '2 Portable Concentrators Active',
    status: 'critical',
    daysOfStock: 1.8,
    criticalItem: '4,280 Units Stock · FEFO Transfer Required',
    x: 310,
    y: 175,
    doctorsPresent: 2,
    doctorsSanctioned: 2,
    dailyFootfall: 160,
    isIncidentEpicenter: true
  }
];

// India Political Map States (Comprehensive Federal Healthcare Grid)
const INDIA_POLITICAL_STATES: IndiaState[] = [
  {
    id: 'jk-la',
    name: 'Jammu, Kashmir & Ladakh',
    code: 'JK & LA',
    capital: 'Srinagar / Leh (High-Altitude Command)',
    svgPath: 'M 160,20 L 195,15 L 225,28 L 240,55 L 210,65 L 180,62 L 155,48 Z',
    labelX: 195,
    labelY: 42,
    resilienceScore: 91.5,
    status: 'stable',
    hospitalsCount: 310,
    activeSurge: 'High-Altitude Cold Buffers Active'
  },
  {
    id: 'hp-uk',
    name: 'Himachal & Uttarakhand',
    code: 'HP & UK',
    capital: 'Shimla / Dehradun Hub',
    svgPath: 'M 180,62 L 210,65 L 235,72 L 240,98 L 205,102 L 185,82 Z',
    labelX: 208,
    labelY: 85,
    resilienceScore: 93.0,
    status: 'stable',
    hospitalsCount: 380,
    activeSurge: 'Himalayan Logistics Normal'
  },
  {
    id: 'pb-hr',
    name: 'Punjab & Haryana',
    code: 'PB & HR',
    capital: 'Chandigarh (PGIMER Strategic Hub)',
    svgPath: 'M 145,62 L 180,62 L 185,82 L 178,112 L 140,112 L 138,85 Z',
    labelX: 158,
    labelY: 90,
    resilienceScore: 94.0,
    status: 'stable',
    hospitalsCount: 590,
    activeSurge: 'Northern Pharma Stockpile Ready'
  },
  {
    id: 'dl',
    name: 'Delhi NCR (Federal Apex)',
    code: 'DL',
    capital: 'AIIMS New Delhi (National Command)',
    svgPath: 'M 174,96 L 188,96 L 188,110 L 174,110 Z',
    labelX: 181,
    labelY: 104,
    resilienceScore: 98.8,
    status: 'stable',
    hospitalsCount: 260,
    activeSurge: 'MoHFW Federal Emergency Room Active'
  },
  {
    id: 'rj',
    name: 'Rajasthan',
    code: 'RJ',
    capital: 'Jaipur (SMS Medical College)',
    svgPath: 'M 90,95 L 145,95 L 155,125 L 148,168 L 115,175 L 75,145 L 80,115 Z',
    labelX: 115,
    labelY: 135,
    resilienceScore: 89.4,
    status: 'stable',
    hospitalsCount: 640,
    activeSurge: 'Western Buffer Stable'
  },
  {
    id: 'up',
    name: 'Uttar Pradesh',
    code: 'UP',
    capital: 'Lucknow (KGMU & SGPGIMS Hub)',
    svgPath: 'M 185,82 L 205,102 L 240,98 L 275,115 L 280,155 L 200,155 L 178,112 Z',
    labelX: 230,
    labelY: 128,
    resilienceScore: 86.8,
    status: 'warning',
    hospitalsCount: 1180,
    activeSurge: 'Monsoon Surveillance Elevated'
  },
  {
    id: 'br',
    name: 'Bihar',
    code: 'BR',
    capital: 'Patna (AIIMS Patna Reserve)',
    svgPath: 'M 275,115 L 322,118 L 325,155 L 280,155 Z',
    labelX: 300,
    labelY: 138,
    resilienceScore: 85.2,
    status: 'warning',
    hospitalsCount: 520,
    activeSurge: 'River Basin Flooding Monitored'
  },
  {
    id: 'wb',
    name: 'West Bengal & Sikkim',
    code: 'WB',
    capital: 'Kolkata (SSKM Hub)',
    svgPath: 'M 322,110 L 334,108 L 338,135 L 350,150 L 344,195 L 322,205 L 316,168 L 325,155 Z',
    labelX: 332,
    labelY: 168,
    resilienceScore: 90.5,
    status: 'stable',
    hospitalsCount: 680,
    activeSurge: 'Eastern Port Medical Readiness High'
  },
  {
    id: 'ne',
    name: 'Assam & North-Eastern States',
    code: 'NE',
    capital: 'Guwahati (GMCH Regional Hub)',
    svgPath: 'M 345,115 L 395,95 L 435,108 L 440,140 L 405,155 L 375,175 L 350,155 L 345,130 Z',
    labelX: 390,
    labelY: 134,
    resilienceScore: 88.5,
    status: 'stable',
    hospitalsCount: 460,
    activeSurge: 'Remote Valley Air-Drop Reserves Ready'
  },
  {
    id: 'jh',
    name: 'Jharkhand',
    code: 'JH',
    capital: 'Ranchi (RIMS Hub)',
    svgPath: 'M 280,155 L 316,155 L 316,198 L 270,198 Z',
    labelX: 294,
    labelY: 178,
    resilienceScore: 87.2,
    status: 'stable',
    hospitalsCount: 340,
    activeSurge: 'Trauma & Mining Healthcare Network'
  },
  {
    id: 'mp',
    name: 'Madhya Pradesh',
    code: 'MP',
    capital: 'Bhopal (AIIMS Bhopal)',
    svgPath: 'M 148,168 L 200,155 L 280,155 L 270,198 L 245,225 L 175,225 L 138,188 Z',
    labelX: 205,
    labelY: 190,
    resilienceScore: 88.6,
    status: 'stable',
    hospitalsCount: 820,
    activeSurge: 'Central Logistics Normal'
  },
  {
    id: 'gj',
    name: 'Gujarat',
    code: 'GJ',
    capital: 'Ahmedabad (Civil Hospital API Buffer)',
    svgPath: 'M 75,145 L 115,175 L 138,188 L 125,230 L 85,230 L 58,205 L 48,175 L 68,162 Z',
    labelX: 88,
    labelY: 195,
    resilienceScore: 95.2,
    status: 'stable',
    hospitalsCount: 560,
    activeSurge: 'Active API Pharma Production Fleet'
  },
  {
    id: 'cg',
    name: 'Chhattisgarh',
    code: 'CG',
    capital: 'Raipur (AIIMS Raipur)',
    svgPath: 'M 245,198 L 270,198 L 285,255 L 245,265 L 235,225 Z',
    labelX: 256,
    labelY: 232,
    resilienceScore: 89.0,
    status: 'stable',
    hospitalsCount: 390,
    activeSurge: 'Forest Outreach Healthcare Units Active'
  },
  {
    id: 'od',
    name: 'Odisha',
    code: 'OD',
    capital: 'Bhubaneswar (AIIMS Emergency Wing)',
    svgPath: 'M 280,200 L 322,205 L 338,230 L 315,265 L 285,255 Z',
    labelX: 305,
    labelY: 232,
    resilienceScore: 84.5,
    status: 'warning',
    hospitalsCount: 440,
    activeSurge: 'Coastal Depression Storm Watch'
  },
  {
    id: 'mh',
    name: 'Maharashtra',
    code: 'MH',
    capital: 'Mumbai (KEM & Tata Memorial Hub)',
    svgPath: 'M 105,225 L 175,225 L 235,225 L 225,275 L 160,285 L 115,280 L 102,245 Z',
    labelX: 160,
    labelY: 252,
    resilienceScore: 94.0,
    status: 'stable',
    hospitalsCount: 920,
    activeSurge: 'Western Tertiary Buffer Active'
  },
  {
    id: 'ga',
    name: 'Goa',
    code: 'GA',
    capital: 'Panaji (GMC Bambolim)',
    svgPath: 'M 116,282 L 126,282 L 125,296 L 115,296 Z',
    labelX: 120,
    labelY: 290,
    resilienceScore: 97.0,
    status: 'stable',
    hospitalsCount: 65,
    activeSurge: 'Coastal Transit Clear'
  },
  {
    id: 'ts',
    name: 'Telangana',
    code: 'TS',
    capital: 'Hyderabad (NIMS & Genome Valley)',
    svgPath: 'M 195,245 L 240,245 L 245,285 L 195,285 Z',
    labelX: 218,
    labelY: 265,
    resilienceScore: 94.5,
    status: 'stable',
    hospitalsCount: 510,
    activeSurge: 'Strategic Pharma Airlift Reserve Ready'
  },
  {
    id: 'ap',
    name: 'Andhra Pradesh (Active Incident Sector)',
    code: 'AP',
    capital: 'Amaravati / Vijayawada (Crisis Command)',
    svgPath: 'M 240,255 L 285,255 L 315,265 Q 295,310 270,355 L 220,355 L 210,305 L 245,285 Z',
    labelX: 262,
    labelY: 305,
    resilienceScore: 87.0,
    status: 'incident',
    hospitalsCount: 694,
    activeSurge: 'Severe Cyclone & Coastal Inundation Alert',
    isIncidentZone: true
  },
  {
    id: 'ka',
    name: 'Karnataka',
    code: 'KA',
    capital: 'Bengaluru (NIMHANS & Victoria Hub)',
    svgPath: 'M 126,282 L 160,285 L 195,285 L 210,320 L 190,365 L 138,345 L 125,296 Z',
    labelX: 162,
    labelY: 320,
    resilienceScore: 91.5,
    status: 'stable',
    hospitalsCount: 650,
    activeSurge: 'Biotech Corridors Open'
  },
  {
    id: 'kl',
    name: 'Kerala',
    code: 'KL',
    capital: 'Thiruvananthapuram (Medical College)',
    svgPath: 'M 152,365 L 172,365 L 168,425 L 148,410 Z',
    labelX: 158,
    labelY: 390,
    resilienceScore: 96.5,
    status: 'stable',
    hospitalsCount: 410,
    activeSurge: 'Public Health Surveillance Robust'
  },
  {
    id: 'tn',
    name: 'Tamil Nadu',
    code: 'TN',
    capital: 'Chennai (MMC & Stanley Strategic Hub)',
    svgPath: 'M 190,355 L 220,355 L 245,355 L 235,425 L 168,425 L 172,365 L 190,355 Z',
    labelX: 205,
    labelY: 388,
    resilienceScore: 92.8,
    status: 'stable',
    hospitalsCount: 740,
    activeSurge: 'Southern Maritime Corridors Active'
  }
];

interface FederalHub {
  name: string;
  code: string;
  x: number;
  y: number;
}

const FEDERAL_HUBS: FederalHub[] = [
  { name: 'AIIMS New Delhi (Federal Command Apex)', code: 'AIIMS DEL', x: 181, y: 104 },
  { name: 'KEM Hospital & Research Hub Mumbai', code: 'KEM MUM', x: 110, y: 245 },
  { name: 'Madras Medical College & Stanley Chennai', code: 'MMC CHE', x: 235, y: 375 },
  { name: 'AIIMS Emergency Wing Bhubaneswar', code: 'AIIMS BBS', x: 310, y: 228 },
  { name: 'NIMHANS & Victoria Hub Bengaluru', code: 'NIM BLR', x: 172, y: 325 },
  { name: 'NIMS Strategic Reserve Hyderabad', code: 'NIMS HYD', x: 218, y: 265 }
];

interface CommandCenterViewProps {
  onNavigateToView?: (viewId: string) => void;
  onOpenCopilot?: () => void;
  selectedContext?: GeographicContext | string;
  onSelectContext?: (ctx: GeographicContext) => void;
}

export const CommandCenterView: React.FC<CommandCenterViewProps> = ({
  onNavigateToView,
  onOpenCopilot,
  selectedContext = 'India (National)',
  onSelectContext,
}) => {
  // Map mode state: Real GIS Leaflet Map vs Vector India Map vs Incident Zone Map
  const [mapMode, setMapMode] = useState<'gis' | 'vector' | 'incident'>('gis');
  const [hoveredHospital, setHoveredHospital] = useState<RealHospital | null>(null);
  const [selectedHospital, setSelectedHospital] = useState<RealHospital | null>(null);
  const [hoveredState, setHoveredState] = useState<IndiaState | null>(null);
  const [selectedState, setSelectedState] = useState<IndiaState | null>(null);
  const [selectedLayer, setSelectedLayer] = useState<'all' | 'critical' | 'corridors' | 'hospitals'>('all');
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);

  // ── Live Command Center State (Sections 10, 21, 24, 25, 30, 38) ──
  const [liveResilienceScore, setLiveResilienceScore] = useState<number>(87.4);
  const [demoMode, setDemoMode] = useState<boolean>(true);
  const [liveAgentStatuses, setLiveAgentStatuses] = useState<Record<string, string>>({
    demand: 'EXECUTING',
    inventory: 'MONITORING',
    generative_ai: 'ANALYZING',
    emergency: 'READY',
    supply: 'MONITORING',
  });
  const [liveIncidentCounts, setLiveIncidentCounts] = useState({
    active: 47,
    last_hour: 5,
    critical: 8,
    high: 17,
    medium: 22,
  });
  const [nationalInventorySummary, setNationalInventorySummary] = useState({
    facilities_monitored: 8420,
    medicines_monitored: 12480,
    critical_count: 84,
    low_stock_count: 327,
    normal_count: 12069,
  });
  const [liveInventoryQuick, setLiveInventoryQuick] = useState([
    { medicine: 'Amoxicillin 500mg', qty: 4268, change: -12, dir: 'down' },
    { medicine: 'Oral Rehydration Salts', qty: 8420, change: 800, dir: 'up' },
    { medicine: 'Insulin Glargine', qty: 840, change: 0, dir: 'stable' },
  ]);
  const [liveIntelligenceEvents, setLiveIntelligenceEvents] = useState([
    { time: '09:42', text: 'Medicine shortage detected', tag: 'CRITICAL', color: '#DC2626' },
    { time: '09:41', text: 'Inventory transfer completed', tag: 'LOGISTICS', color: '#16A34A' },
    { time: '09:40', text: 'Emergency Agent activated', tag: 'SWARM', color: '#0284C7' },
    { time: '09:39', text: 'Demand anomaly detected', tag: 'EPIDEMIOLOGY', color: '#D97706' },
  ]);

  const handleLiveEvent = useCallback((event: any) => {
    if (event.type === 'TELEMETRY_HEARTBEAT' && event.pulse) {
      if (event.pulse.national_resilience) {
        setLiveResilienceScore(event.pulse.national_resilience);
      }
    } else if (event.type === 'INVENTORY_UPDATE') {
      if (event.event) {
        const evt = event.event;
        setLiveInventoryQuick((prev) => [
          {
            medicine: evt.medicine,
            qty: evt.quantity,
            change: evt.change,
            dir: evt.change > 0 ? 'up' : evt.change < 0 ? 'down' : 'stable',
          },
          ...prev.slice(0, 2),
        ]);
        setLiveIntelligenceEvents((prev) => [
          {
            time: evt.timestamp ? evt.timestamp.slice(0, 5) : '09:42',
            text: `${evt.medicine} ${evt.change > 0 ? '+' : ''}${evt.change} (${evt.facility_name})`,
            tag: 'INVENTORY',
            color: evt.change > 0 ? '#16A34A' : '#DC2626',
          },
          ...prev.slice(0, 3),
        ]);
      }
      if (event.summary) {
        setNationalInventorySummary((prev) => ({ ...prev, ...event.summary }));
      }
    } else if (event.type === 'AGENT_STATUS') {
      if (event.all_statuses) {
        setLiveAgentStatuses(event.all_statuses);
      } else if (event.agent_id && event.status) {
        setLiveAgentStatuses((prev) => ({ ...prev, [event.agent_id]: event.status }));
      }
    } else if (event.type === 'INCIDENT_CREATED') {
      if (event.incident) {
        setLiveIntelligenceEvents((prev) => [
          {
            time: event.timestamp ? event.timestamp.slice(0, 5) : '09:43',
            text: `Incident: ${event.incident.title} (${event.incident.state})`,
            tag: event.incident.severity,
            color: '#DC2626',
          },
          ...prev.slice(0, 3),
        ]);
        setLiveIncidentCounts((prev) => ({
          ...prev,
          active: prev.active + 1,
          last_hour: prev.last_hour + 1,
        }));
      }
      if (event.summary) {
        setLiveIncidentCounts((prev) => ({
          ...prev,
          active: event.summary.total_active || prev.active,
          critical: event.summary.critical || prev.critical,
          high: event.summary.high || prev.high,
          medium: event.summary.medium || prev.medium,
        }));
      }
    }
  }, []);

  useLiveSocket(handleLiveEvent);

  // ── Location-aware data: updates every section when context changes ──
  const LOCATION_DATA: Record<string, {
    subtitle: string;
    score: number;
    scoreStatus: string;
    scoreDelta: string;
    scoreDesc: string;
    pillars: { label: string; value: number }[];
  }> = {
    'India (National)': {
      subtitle: 'National healthcare resilience overview · 30 September 2026 · 09:42 IST',
      score: 87,
      scoreStatus: 'STABLE',
      scoreDelta: '+2.4 pts vs 7d avg',
      scoreDesc: 'Composite metric across 694 facilities and 51 operational districts',
      pillars: [
        { label: 'Supply continuity', value: 92 },
        { label: 'Inventory health', value: 84 },
        { label: 'Emergency readiness', value: 89 },
        { label: 'Network stability', value: 83 },
      ],
    },
    'Andhra Pradesh (State)': {
      subtitle: 'Andhra Pradesh state command · 30 September 2026 · 09:42 IST',
      score: 81,
      scoreStatus: 'STABLE',
      scoreDelta: '+1.1 pts vs 7d avg',
      scoreDesc: 'Composite metric across 186 facilities and 26 districts in AP',
      pillars: [
        { label: 'Supply continuity', value: 88 },
        { label: 'Inventory health', value: 79 },
        { label: 'Emergency readiness', value: 83 },
        { label: 'Network stability', value: 76 },
      ],
    },
    'Krishna District (Vijayawada)': {
      subtitle: 'Krishna District operations · Vijayawada · 30 September 2026 · 09:42 IST',
      score: 73,
      scoreStatus: 'WARNING',
      scoreDelta: '-3.2 pts vs 7d avg',
      scoreDesc: 'Composite metric across 54 facilities in Krishna & NTR districts',
      pillars: [
        { label: 'Supply continuity', value: 71 },
        { label: 'Inventory health', value: 68 },
        { label: 'Emergency readiness', value: 79 },
        { label: 'Network stability', value: 74 },
      ],
    },
    'Krishna District Hospital': {
      subtitle: 'Krishna District Hospital · Machilipatnam · 30 September 2026 · 09:42 IST',
      score: 68,
      scoreStatus: 'WARNING',
      scoreDelta: '-5.1 pts vs 7d avg',
      scoreDesc: 'Hospital-level resilience · 450 beds · 45 ICU · Referral Node',
      pillars: [
        { label: 'Bed occupancy', value: 82 },
        { label: 'Medicine stock', value: 61 },
        { label: 'Staff readiness', value: 74 },
        { label: 'Equipment health', value: 69 },
      ],
    },
    'Vijayawada PHC-04': {
      subtitle: 'Vijayawada PHC-04 · Primary Health Centre · 30 September 2026 · 09:42 IST',
      score: 59,
      scoreStatus: 'CRITICAL',
      scoreDelta: '-8.7 pts vs 7d avg',
      scoreDesc: 'PHC-level resilience · 4,280 units stock · High footfall zone',
      pillars: [
        { label: 'Stock sufficiency', value: 54 },
        { label: 'Staff presence', value: 67 },
        { label: 'ORS & Paracetamol', value: 48 },
        { label: 'Cold chain health', value: 72 },
      ],
    },
  };

  const locData = LOCATION_DATA[selectedContext as string] || LOCATION_DATA['India (National)'];

  // Status colour mapping for resilience ring and badge
  const statusColor = locData.scoreStatus === 'CRITICAL'
    ? 'var(--color-critical)'
    : locData.scoreStatus === 'WARNING'
      ? 'var(--color-warning)'
      : 'var(--color-green)';
  const statusBadgeClass = locData.scoreStatus === 'CRITICAL'
    ? 'ag-badge ag-badge-critical'
    : locData.scoreStatus === 'WARNING'
      ? 'ag-badge ag-badge-warning'
      : 'ag-badge ag-badge-stable';

  // Auto-switch map mode and highlight hospital if context changes from topbar!
  useEffect(() => {
    if (selectedContext === 'India (National)') {
      setMapMode('gis');
      setSelectedHospital(null);
    } else if (selectedContext === 'Andhra Pradesh (State)') {
      setMapMode('gis');
      const ap = INDIA_POLITICAL_STATES.find((s) => s.id === 'ap') || null;
      setSelectedState(ap);
    } else if (selectedContext === 'Krishna District (Vijayawada)') {
      setMapMode('incident');
    } else if (selectedContext === 'Krishna District Hospital') {
      setMapMode('incident');
      const target = REAL_HOSPITALS.find((h) => h.id === 'hosp-machilipatnam') || REAL_HOSPITALS[0];
      setSelectedHospital(target);
    } else if (selectedContext === 'Vijayawada PHC-04') {
      setMapMode('incident');
      const target = REAL_HOSPITALS.find((h) => h.id === 'hosp-phc-04') || REAL_HOSPITALS[11];
      setSelectedHospital(target);
    }
  }, [selectedContext]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* ── 1. HEADER (Section 2, 4, 31, 38) ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <LiveClock
          showGreeting={true}
          roleTitle="Administrator"
          subtitlePrefix="Healthcare resilience overview"
        />

        {/* Action Controls: Live Status Indicator + Demo Mode Toggle + Emergency Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <LiveStatusIndicator showSyncTime={true} showDemoNotice={true} />

          <button
            onClick={() => {
              const next = !demoMode;
              setDemoMode(next);
              toggleDemoIncidents(next).catch(() => {});
            }}
            style={{
              padding: '6px 12px',
              borderRadius: 6,
              background: demoMode ? '#F0F9FF' : '#F8FAFC',
              border: `1px solid ${demoMode ? '#0284C7' : 'var(--border-default)'}`,
              color: demoMode ? '#0284C7' : 'var(--text-secondary)',
              fontSize: 11,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              transition: 'all 0.15s ease',
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: demoMode ? '#0284C7' : '#94A3B8',
              }}
            />
            <span>DEMO MODE: {demoMode ? 'ON' : 'OFF'}</span>
          </button>

          <button
            onClick={() => {
              setIsEmergencyActive(!isEmergencyActive);
              if (!isEmergencyActive) {
                onNavigateToView?.('emergency-operations');
              }
            }}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-sm)',
              background: isEmergencyActive ? 'var(--color-critical)' : '#FFFFFF',
              color: isEmergencyActive ? '#FFFFFF' : 'var(--color-critical)',
              border: '1px solid var(--color-critical)',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              transition: 'all 0.15s ease',
            }}
          >
            <AlertTriangle size={13} />
            <span>{isEmergencyActive ? 'Emergency Mode Active' : 'Emergency Mode'}</span>
          </button>
        </div>
      </div>

      {/* ── NATIONAL COUNTERS: INCIDENTS & INVENTORY (Section 24 & 25) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div
          onClick={() => onNavigateToView?.('emergency-operations')}
          className="ag-card"
          style={{ padding: '14px 18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'all 0.15s' }}
        >
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              ACTIVE INCIDENTS (ALL-INDIA)
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 4 }}>
              <span style={{ fontSize: 24, fontWeight: 800, color: '#DC2626', fontFamily: 'JetBrains Mono' }}>
                {liveIncidentCounts.active}
              </span>
              <span style={{ fontSize: 11, color: '#EA580C', fontWeight: 600 }}>
                +{liveIncidentCounts.last_hour} in last hour
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6, fontSize: 11 }}>
            <span style={{ padding: '3px 8px', borderRadius: 4, background: '#FEF2F2', color: '#DC2626', fontWeight: 700 }}>
              Critical: {liveIncidentCounts.critical}
            </span>
            <span style={{ padding: '3px 8px', borderRadius: 4, background: '#FFF7ED', color: '#EA580C', fontWeight: 700 }}>
              High: {liveIncidentCounts.high}
            </span>
            <span style={{ padding: '3px 8px', borderRadius: 4, background: '#FFFBEB', color: '#D97706', fontWeight: 700 }}>
              Medium: {liveIncidentCounts.medium}
            </span>
          </div>
        </div>

        <div
          onClick={() => onNavigateToView?.('inventory-intelligence')}
          className="ag-card"
          style={{ padding: '14px 18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'all 0.15s' }}
        >
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              MEDICINES MONITORED
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 4 }}>
              <span style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'JetBrains Mono' }}>
                {nationalInventorySummary.medicines_monitored.toLocaleString()}
              </span>
              <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                across {nationalInventorySummary.facilities_monitored.toLocaleString()} facilities
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6, fontSize: 11 }}>
            <span style={{ padding: '3px 8px', borderRadius: 4, background: '#FEF2F2', color: '#DC2626', fontWeight: 700 }}>
              Critical: {nationalInventorySummary.critical_count}
            </span>
            <span style={{ padding: '3px 8px', borderRadius: 4, background: '#FFF7ED', color: '#EA580C', fontWeight: 700 }}>
              Low Stock: {nationalInventorySummary.low_stock_count}
            </span>
            <span style={{ padding: '3px 8px', borderRadius: 4, background: '#F0FDF4', color: '#16A34A', fontWeight: 700 }}>
              Normal: {nationalInventorySummary.normal_count.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* ── ACTIVE OPERATIONS CONTEXT BANNER ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
          padding: '10px 16px',
          background: 'var(--surface-primary)',
          border: '1px solid var(--border-default)',
          borderRadius: 8,
          boxShadow: 'var(--shadow-subtle)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 6,
              background: 'var(--color-green-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-green-deep)',
            }}
          >
            <MapPin size={16} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'JetBrains Mono' }}>
                CURRENT OPERATIONS FOCUS
              </span>
              <span className="ag-badge ag-badge-stable" style={{ fontSize: 10 }}>
                ● Active Grid Synchronized
              </span>
            </div>
            <h3 style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              {selectedContext}
            </h3>
          </div>
        </div>

        {/* Quick Context View Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <button
            onClick={() => {
              setMapMode('gis');
              onSelectContext?.('India (National)');
            }}
            style={{
              padding: '5px 10px',
              fontSize: 11.5,
              fontWeight: 700,
              borderRadius: 6,
              border: `1px solid ${mapMode === 'gis' ? 'var(--color-green)' : 'var(--border-default)'}`,
              background: mapMode === 'gis' ? 'var(--color-green-light)' : '#FFFFFF',
              color: mapMode === 'gis' ? 'var(--color-green-deep)' : 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
            }}
          >
            🗺️ India GIS Map
          </button>
          <button
            onClick={() => {
              setMapMode('vector');
              onSelectContext?.('India (National)');
            }}
            style={{
              padding: '5px 10px',
              fontSize: 11.5,
              fontWeight: 700,
              borderRadius: 6,
              border: `1px solid ${mapMode === 'vector' ? 'var(--color-blue)' : 'var(--border-default)'}`,
              background: mapMode === 'vector' ? 'var(--color-blue-light)' : '#FFFFFF',
              color: mapMode === 'vector' ? 'var(--color-blue)' : 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
            }}
          >
            🇮🇳 Vector Resilience
          </button>
          <button
            onClick={() => {
              setMapMode('incident');
              onSelectContext?.('Krishna District (Vijayawada)');
            }}
            style={{
              padding: '5px 10px',
              fontSize: 11.5,
              fontWeight: 700,
              borderRadius: 6,
              border: `1px solid ${mapMode === 'incident' ? 'var(--color-critical)' : 'var(--border-default)'}`,
              background: mapMode === 'incident' ? 'var(--color-critical-light)' : '#FFFFFF',
              color: mapMode === 'incident' ? 'var(--color-critical)' : 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
            }}
          >
            🎯 Incident Zone (AP)
          </button>
        </div>
      </div>

      {/* ── 2. COMPACT RESILIENCE SCORE SECTION (Section 4) ── */}
      <div
        className="ag-card"
        style={{
          padding: '18px 24px',
          display: 'grid',
          gridTemplateColumns: 'auto 1fr',
          gap: 28,
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          {/* Semi-circular Circular SVG Visualization (Section 4 Spec) */}
          <div style={{ position: 'relative', width: 88, height: 88, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="88" height="88" viewBox="0 0 88 88" style={{ transform: 'rotate(-90deg)' }}>
              <circle
                cx="44"
                cy="44"
                r="38"
                fill="none"
                stroke="#E2E8F0"
                strokeWidth="7"
              />
              <circle
                cx="44"
                cy="44"
                r="38"
                fill="none"
                stroke={statusColor}
                strokeWidth="7"
                strokeDasharray={`${(locData.score / 100) * 238.7} 238.7`}
                strokeLinecap="round"
              />
            </svg>
            <div style={{ position: 'absolute', textAlign: 'center' }}>
              <span style={{ fontSize: 26, fontWeight: 900, color: statusColor, lineHeight: 1, fontFamily: 'JetBrains Mono' }}>
                {selectedContext === 'India (National)' ? liveResilienceScore : locData.score}
              </span>
              <span style={{ fontSize: 10, color: 'var(--text-muted)', display: 'block', fontWeight: 600 }}>
                /100
              </span>
            </div>
          </div>

          <div>
            <span style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: 'JetBrains Mono' }}>
              HEALTHCARE RESILIENCE
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 3 }}>
              <span style={{ fontSize: 18, fontWeight: 800, color: statusColor, letterSpacing: '-0.01em' }}>
                {locData.scoreStatus}
              </span>
              <span className={statusBadgeClass}>
                {locData.scoreDelta}
              </span>
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2, margin: 0 }}>
              {locData.scoreDesc}
            </p>
          </div>
        </div>

        {/* 4 Pillars: dynamic per selected location */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          {locData.pillars.map((item) => (
            <div
              key={item.label}
              style={{
                padding: '10px 14px',
                background: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>
                  {item.label}
                </span>
                <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'JetBrains Mono' }}>
                  {item.value}%
                </span>
              </div>
              <div style={{ height: 5, background: '#E2E8F0', borderRadius: 3, overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${item.value}%`,
                    background: item.value >= 85 ? 'var(--color-green)' : 'var(--color-warning)',
                    borderRadius: 3,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 3. MAIN SECTION: NATIONAL HEALTHCARE NETWORK MAP + LIVE INTELLIGENCE (Section 38 Layout) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.65fr 1fr', gap: 20 }}>
        {/* Left: Interactive India Political Map */}
        <div className="ag-card" style={{ padding: 16, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  NATIONAL HEALTHCARE NETWORK
                </h2>
                <span className="ag-badge ag-badge-stable" style={{ fontSize: 10 }}>
                  36 States & UTs Monitored
                </span>
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2, margin: 0 }}>
                Interactive political cartography · Administrative boundaries · Time simulation · Incident clustering
              </p>
            </div>
          </div>

          <IndiaPoliticalMap
            onStateSelect={(stName) => {
              if (onSelectContext && stName.includes('Andhra Pradesh')) {
                onSelectContext('Andhra Pradesh (State)');
              }
            }}
            onNavigateToView={onNavigateToView}
          />
        </div>

        {/* Right: Section 38 Command Center Intelligence Stack */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* 1. LIVE INCIDENTS CARD (Section 38) */}
          <div className="ag-card" style={{ padding: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 6 }}>
                <ShieldAlert size={15} color="#DC2626" />
                <span>LIVE INCIDENTS</span>
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#DC2626' }}>
                {liveIncidentCounts.active} ACTIVE
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
              <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 6, padding: '8px 10px', textAlign: 'center' }}>
                <div style={{ fontSize: 10, color: '#991B1B', fontWeight: 600 }}>Critical</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#DC2626', fontFamily: 'JetBrains Mono' }}>
                  {liveIncidentCounts.critical}
                </div>
              </div>
              <div style={{ background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: 6, padding: '8px 10px', textAlign: 'center' }}>
                <div style={{ fontSize: 10, color: '#9A3412', fontWeight: 600 }}>High</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#EA580C', fontFamily: 'JetBrains Mono' }}>
                  {liveIncidentCounts.high}
                </div>
              </div>
              <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 6, padding: '8px 10px', textAlign: 'center' }}>
                <div style={{ fontSize: 10, color: '#92400E', fontWeight: 600 }}>Medium</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#D97706', fontFamily: 'JetBrains Mono' }}>
                  {liveIncidentCounts.medium}
                </div>
              </div>
            </div>
          </div>

          {/* 2. LIVE INTELLIGENCE FEED (Section 38) */}
          <div className="ag-card" style={{ padding: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Activity size={15} color="#0284C7" />
                <span>LIVE INTELLIGENCE</span>
              </div>
              <span className="ag-badge ag-badge-stable" style={{ fontSize: 10 }}>Continuous</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {liveIntelligenceEvents.slice(0, 4).map((evt, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 11.5, padding: '4px 0', borderBottom: idx < 3 ? '1px solid #F1F5F9' : 'none' }}>
                  <span style={{ fontFamily: 'JetBrains Mono', color: '#64748B', fontWeight: 600, minWidth: 38 }}>
                    {evt.time}
                  </span>
                  <span style={{ flex: 1, color: '#1E293B', fontWeight: 500 }}>
                    {evt.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 3. AI AGENT ACTIVITY (Section 38) */}
          <div className="ag-card" style={{ padding: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Bot size={15} color="#8B5CF6" />
                <span>AI AGENT ACTIVITY</span>
              </div>
              <button
                onClick={() => onNavigateToView?.('ai-agents')}
                style={{ background: 'none', border: 'none', color: '#0284C7', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}
              >
                Agent Center →
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {[
                { name: 'Demand Agent', status: liveAgentStatuses.demand || 'EXECUTING', color: '#0284C7' },
                { name: 'Inventory Agent', status: liveAgentStatuses.inventory || 'MONITORING', color: '#10B981' },
                { name: 'Generative AI Agent', status: liveAgentStatuses.generative_ai || 'ANALYZING', color: '#8B5CF6' },
                { name: 'Emergency Agent', status: liveAgentStatuses.emergency || 'READY', color: '#EF4444' },
              ].map((ag) => (
                <div key={ag.name} style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 6, padding: '8px 10px' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#0F172A' }}>{ag.name}</div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: ag.color, marginTop: 2 }}>
                    ● {ag.status}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. LIVE INVENTORY TICKER (Section 38) */}
          <div className="ag-card" style={{ padding: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Package size={15} color="#10B981" />
                <span>LIVE INVENTORY</span>
              </div>
              <button
                onClick={() => onNavigateToView?.('inventory-intelligence')}
                style={{ background: 'none', border: 'none', color: '#0284C7', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}
              >
                Full Ledger →
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {liveInventoryQuick.map((m, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12, padding: '4px 0', borderBottom: idx < liveInventoryQuick.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
                  <span style={{ fontWeight: 600, color: '#1E293B' }}>{m.medicine}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, color: '#0F172A' }}>
                      {m.qty.toLocaleString()}
                    </span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: m.dir === 'down' ? '#DC2626' : m.dir === 'up' ? '#16A34A' : '#64748B' }}>
                      {m.dir === 'down' ? `↓ ${Math.abs(m.change)}` : m.dir === 'up' ? `↑ ${m.change}` : 'stable'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── 4. FULL LIVE INVENTORY FEED & ACTIVITY STREAM (Sections 10-13) ── */}
      <LiveInventoryFeed compact={true} onSelectMedicine={() => onNavigateToView?.('inventory-intelligence')} />

      {/* ── 4. CRITICAL RISKS SECTION (Section 5 Spec) ── */}
      <div className="ag-card" style={{ padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              CRITICAL RISKS
            </h2>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 1, margin: 0 }}>
              Sophisticated horizontal risk rows prioritized by time-to-depletion
            </p>
          </div>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            3 Active Escalations
          </span>
        </div>

        {/* 3 Sophisticated Horizontal Risk Rows (Section 5 Spec) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {/* Row 1: AMOXICILLIN Krishna District */}
          <div
            style={{
              padding: '12px 18px',
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-default)',
              borderLeft: '4px solid var(--color-critical)',
              borderRadius: 'var(--radius-sm)',
              display: 'grid',
              gridTemplateColumns: '1.2fr 1fr 1fr 1fr 1.2fr auto',
              alignItems: 'center',
              gap: 16,
            }}
          >
            <div>
              <p style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                AMOXICILLIN
              </p>
              <p style={{ fontSize: 11.5, color: 'var(--text-secondary)', marginTop: 1, margin: 0 }}>
                Krishna District (Vijayawada PHC-04)
              </p>
            </div>
            <div>
              <span style={{ fontSize: 10.5, color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>
                Stock
              </span>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'JetBrains Mono' }}>
                1.8 days
              </span>
            </div>
            <div>
              <span style={{ fontSize: 10.5, color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>
                Predicted stock-out
              </span>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-critical)', fontFamily: 'JetBrains Mono' }}>
                18h
              </span>
            </div>
            <div>
              <span style={{ fontSize: 10.5, color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>
                Risk
              </span>
              <span className="ag-badge ag-badge-critical">
                HIGH
              </span>
            </div>
            <div>
              <span style={{ fontSize: 10.5, color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>
                Action
              </span>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>
                Transfer inventory
              </span>
            </div>
            <button
              onClick={() => onNavigateToView?.('inventory')}
              className="ag-btn-secondary"
              style={{ padding: '6px 14px', fontSize: 12 }}
            >
              Transfer
            </button>
          </div>

          {/* Row 2: INSULIN NTR District */}
          <div
            style={{
              padding: '12px 18px',
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-default)',
              borderLeft: '4px solid var(--color-warning)',
              borderRadius: 'var(--radius-sm)',
              display: 'grid',
              gridTemplateColumns: '1.2fr 1fr 1fr 1fr 1.2fr auto',
              alignItems: 'center',
              gap: 16,
            }}
          >
            <div>
              <p style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                INSULIN
              </p>
              <p style={{ fontSize: 11.5, color: 'var(--text-secondary)', marginTop: 1, margin: 0 }}>
                NTR District Cold Depot Unit 3
              </p>
            </div>
            <div>
              <span style={{ fontSize: 10.5, color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>
                Stock
              </span>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'JetBrains Mono' }}>
                2.4 days
              </span>
            </div>
            <div>
              <span style={{ fontSize: 10.5, color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>
                Cold-chain
              </span>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-warning)', fontFamily: 'JetBrains Mono' }}>
                Warning (+6.8°C)
              </span>
            </div>
            <div>
              <span style={{ fontSize: 10.5, color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>
                Risk
              </span>
              <span className="ag-badge ag-badge-warning">
                MEDIUM
              </span>
            </div>
            <div>
              <span style={{ fontSize: 10.5, color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>
                Action
              </span>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>
                Inspect facility
              </span>
            </div>
            <button
              onClick={() => onNavigateToView?.('cold-chain')}
              className="ag-btn-secondary"
              style={{ padding: '6px 14px', fontSize: 12 }}
            >
              Inspect
            </button>
          </div>

          {/* Row 3: OXYGEN Guntur */}
          <div
            style={{
              padding: '12px 18px',
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-default)',
              borderLeft: '4px solid var(--color-warning)',
              borderRadius: 'var(--radius-sm)',
              display: 'grid',
              gridTemplateColumns: '1.2fr 1fr 1fr 1fr 1.2fr auto',
              alignItems: 'center',
              gap: 16,
            }}
          >
            <div>
              <p style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                OXYGEN
              </p>
              <p style={{ fontSize: 11.5, color: 'var(--text-secondary)', marginTop: 1, margin: 0 }}>
                Guntur Government Comprehensive Hospital
              </p>
            </div>
            <div>
              <span style={{ fontSize: 10.5, color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>
                Stock
              </span>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'JetBrains Mono' }}>
                4.1 days
              </span>
            </div>
            <div>
              <span style={{ fontSize: 10.5, color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>
                Demand
              </span>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-warning)', fontFamily: 'JetBrains Mono' }}>
                +21% surge
              </span>
            </div>
            <div>
              <span style={{ fontSize: 10.5, color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>
                Risk
              </span>
              <span className="ag-badge ag-badge-warning">
                MEDIUM
              </span>
            </div>
            <div>
              <span style={{ fontSize: 10.5, color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>
                Action
              </span>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>
                Increase allocation
              </span>
            </div>
            <button
              onClick={() => onNavigateToView?.('inventory')}
              className="ag-btn-secondary"
              style={{ padding: '6px 14px', fontSize: 12 }}
            >
              Allocate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
