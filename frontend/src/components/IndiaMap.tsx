import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import './IndiaMap.css';
import {
  MapPin, ShieldAlert, Layers, Navigation, ZoomIn, ZoomOut,
  Maximize2, RotateCcw, AlertTriangle, Truck, Building2, CheckCircle2,
  Info, ExternalLink, Activity
} from 'lucide-react';

export interface IndiaStateInfo {
  id: string;
  name: string;
  code: string;
  capital: string;
  lat: number;
  lng: number;
  resilienceScore: number;
  status: 'incident' | 'warning' | 'stable';
  hospitalsCount: number;
  activeSurge: string;
  isIncidentZone?: boolean;
}

export interface RealHospitalInfo {
  id: string;
  name: string;
  shortName: string;
  location: string;
  district: string;
  category: string;
  totalBeds: number;
  icuBeds: number;
  occupiedBeds: number;
  oxygenStatus: string;
  status: 'incident' | 'warning' | 'stable' | 'critical';
  daysOfStock: number;
  criticalItem?: string;
  lat: number;
  lng: number;
  x: number;
  y: number;
  doctorsPresent: number;
  doctorsSanctioned: number;
  dailyFootfall: number;
  isIncidentEpicenter?: boolean;
}

export interface FederalHubInfo {
  name: string;
  code: string;
  lat: number;
  lng: number;
  x: number;
  y: number;
  role: string;
  reserveUnits: string;
}

// 21 Key States & UTs across India with accurate geographical centroids
export const INDIA_STATES_DATA: IndiaStateInfo[] = [
  {
    id: 'jk-la',
    name: 'Jammu, Kashmir & Ladakh',
    code: 'JK & LA',
    capital: 'Srinagar / Leh',
    lat: 34.0837,
    lng: 74.7973,
    resilienceScore: 91.5,
    status: 'stable',
    hospitalsCount: 310,
    activeSurge: 'High-Altitude Cold Buffers Active',
  },
  {
    id: 'hp-uk',
    name: 'Himachal & Uttarakhand',
    code: 'HP & UK',
    capital: 'Shimla / Dehradun',
    lat: 30.5,
    lng: 78.5,
    resilienceScore: 93.0,
    status: 'stable',
    hospitalsCount: 380,
    activeSurge: 'Himalayan Logistics Normal',
  },
  {
    id: 'pb-hr',
    name: 'Punjab & Haryana',
    code: 'PB & HR',
    capital: 'Chandigarh (PGIMER Hub)',
    lat: 30.7333,
    lng: 76.7794,
    resilienceScore: 94.0,
    status: 'stable',
    hospitalsCount: 590,
    activeSurge: 'Northern Pharma Stockpile Ready',
  },
  {
    id: 'dl',
    name: 'Delhi NCR (Federal Apex)',
    code: 'DL',
    capital: 'AIIMS New Delhi',
    lat: 28.6139,
    lng: 77.2090,
    resilienceScore: 98.8,
    status: 'stable',
    hospitalsCount: 260,
    activeSurge: 'MoHFW Federal Emergency Room Active',
  },
  {
    id: 'rj',
    name: 'Rajasthan',
    code: 'RJ',
    capital: 'Jaipur (SMS Hospital)',
    lat: 26.9124,
    lng: 75.7873,
    resilienceScore: 89.4,
    status: 'stable',
    hospitalsCount: 640,
    activeSurge: 'Western Buffer Stable',
  },
  {
    id: 'up',
    name: 'Uttar Pradesh',
    code: 'UP',
    capital: 'Lucknow (SGPGIMS & KGMU)',
    lat: 26.8467,
    lng: 80.9462,
    resilienceScore: 86.8,
    status: 'warning',
    hospitalsCount: 1180,
    activeSurge: 'Monsoon Surveillance Elevated',
  },
  {
    id: 'br',
    name: 'Bihar',
    code: 'BR',
    capital: 'Patna (AIIMS Patna)',
    lat: 25.5941,
    lng: 85.1376,
    resilienceScore: 85.2,
    status: 'warning',
    hospitalsCount: 520,
    activeSurge: 'River Basin Flooding Monitored',
  },
  {
    id: 'wb',
    name: 'West Bengal & Sikkim',
    code: 'WB',
    capital: 'Kolkata (SSKM Hub)',
    lat: 22.9868,
    lng: 87.8550,
    resilienceScore: 90.5,
    status: 'stable',
    hospitalsCount: 680,
    activeSurge: 'Eastern Port Medical Readiness High',
  },
  {
    id: 'ne',
    name: 'Assam & North-Eastern States',
    code: 'NE',
    capital: 'Guwahati (GMCH Hub)',
    lat: 26.2006,
    lng: 92.9376,
    resilienceScore: 88.5,
    status: 'stable',
    hospitalsCount: 460,
    activeSurge: 'Remote Valley Air-Drop Reserves Ready',
  },
  {
    id: 'jh',
    name: 'Jharkhand',
    code: 'JH',
    capital: 'Ranchi (RIMS)',
    lat: 23.6102,
    lng: 85.2799,
    resilienceScore: 87.2,
    status: 'stable',
    hospitalsCount: 340,
    activeSurge: 'Trauma & Mining Healthcare Network',
  },
  {
    id: 'mp',
    name: 'Madhya Pradesh',
    code: 'MP',
    capital: 'Bhopal (AIIMS Bhopal)',
    lat: 23.4733,
    lng: 77.9479,
    resilienceScore: 88.6,
    status: 'stable',
    hospitalsCount: 820,
    activeSurge: 'Central Logistics Normal',
  },
  {
    id: 'gj',
    name: 'Gujarat',
    code: 'GJ',
    capital: 'Ahmedabad (Civil Hospital)',
    lat: 23.0225,
    lng: 72.5714,
    resilienceScore: 95.2,
    status: 'stable',
    hospitalsCount: 560,
    activeSurge: 'Active API Pharma Production Fleet',
  },
  {
    id: 'cg',
    name: 'Chhattisgarh',
    code: 'CG',
    capital: 'Raipur (AIIMS Raipur)',
    lat: 21.2787,
    lng: 81.8661,
    resilienceScore: 89.0,
    status: 'stable',
    hospitalsCount: 390,
    activeSurge: 'Forest Outreach Healthcare Units Active',
  },
  {
    id: 'od',
    name: 'Odisha',
    code: 'OD',
    capital: 'Bhubaneswar (AIIMS Emergency)',
    lat: 20.2961,
    lng: 85.8245,
    resilienceScore: 84.5,
    status: 'warning',
    hospitalsCount: 440,
    activeSurge: 'Coastal Depression Storm Watch',
  },
  {
    id: 'mh',
    name: 'Maharashtra',
    code: 'MH',
    capital: 'Mumbai (KEM & Tata Memorial)',
    lat: 19.7515,
    lng: 75.7139,
    resilienceScore: 94.0,
    status: 'stable',
    hospitalsCount: 920,
    activeSurge: 'Western Tertiary Buffer Active',
  },
  {
    id: 'ga',
    name: 'Goa',
    code: 'GA',
    capital: 'Panaji (GMC Bambolim)',
    lat: 15.2993,
    lng: 74.1240,
    resilienceScore: 97.0,
    status: 'stable',
    hospitalsCount: 65,
    activeSurge: 'Coastal Transit Clear',
  },
  {
    id: 'ts',
    name: 'Telangana',
    code: 'TS',
    capital: 'Hyderabad (NIMS & Genome Valley)',
    lat: 17.8496,
    lng: 79.1151,
    resilienceScore: 94.5,
    status: 'stable',
    hospitalsCount: 510,
    activeSurge: 'Strategic Pharma Airlift Reserve Ready',
  },
  {
    id: 'ap',
    name: 'Andhra Pradesh (Active Incident Sector)',
    code: 'AP',
    capital: 'Amaravati / Vijayawada (Crisis Command)',
    lat: 16.5062,
    lng: 80.6480,
    resilienceScore: 87.0,
    status: 'incident',
    hospitalsCount: 694,
    activeSurge: 'Severe Cyclone & Coastal Inundation Alert',
    isIncidentZone: true,
  },
  {
    id: 'ka',
    name: 'Karnataka',
    code: 'KA',
    capital: 'Bengaluru (NIMHANS)',
    lat: 12.9716,
    lng: 77.5946,
    resilienceScore: 91.5,
    status: 'stable',
    hospitalsCount: 650,
    activeSurge: 'Biotech Corridors Open',
  },
  {
    id: 'kl',
    name: 'Kerala',
    code: 'KL',
    capital: 'Thiruvananthapuram',
    lat: 10.8505,
    lng: 76.2711,
    resilienceScore: 96.5,
    status: 'stable',
    hospitalsCount: 410,
    activeSurge: 'Public Health Surveillance Robust',
  },
  {
    id: 'tn',
    name: 'Tamil Nadu',
    code: 'TN',
    capital: 'Chennai (MMC & Stanley)',
    lat: 13.0827,
    lng: 80.2707,
    resilienceScore: 92.8,
    status: 'stable',
    hospitalsCount: 740,
    activeSurge: 'Southern Maritime Corridors Active',
  },
];

// Federal Medical Reserve Hubs
export const FEDERAL_HUBS_DATA: FederalHubInfo[] = [
  { name: 'AIIMS New Delhi (Federal Command Apex)', code: 'AIIMS DEL', lat: 28.5672, lng: 77.2100, x: 181, y: 104, role: 'National Command & Strategic Vaccines', reserveUnits: '1,200,000' },
  { name: 'KEM Hospital & Research Hub Mumbai', code: 'KEM MUM', lat: 19.0028, lng: 72.8427, x: 110, y: 245, role: 'Western Tertiary Buffer & Plasma', reserveUnits: '780,000' },
  { name: 'Madras Medical College & Stanley Chennai', code: 'MMC CHE', lat: 13.0827, lng: 80.2707, x: 235, y: 375, role: 'Southern Maritime Medical Depot', reserveUnits: '640,000' },
  { name: 'AIIMS Emergency Wing Bhubaneswar', code: 'AIIMS BBS', lat: 20.2312, lng: 85.7766, x: 310, y: 228, role: 'Eastern Cyclone Emergency Reserve', reserveUnits: '420,000' },
  { name: 'NIMHANS & Victoria Hub Bengaluru', code: 'NIM BLR', lat: 12.9392, lng: 77.5959, x: 172, y: 325, role: 'Biotech & Anti-Infective Stockpile', reserveUnits: '590,000' },
  { name: 'NIMS Strategic Reserve Hyderabad', code: 'NIMS HYD', lat: 17.4193, lng: 78.4483, x: 218, y: 265, role: 'Central Redistribution Airlift Depot', reserveUnits: '950,000' }
];

// 12 Real Geocoded Hospitals in the Krishna / Guntur / Coastal Andhra Incident Sector
export const REAL_HOSPITALS_DATA: RealHospitalInfo[] = [
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
    lat: 16.5131,
    lng: 80.6234,
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
    lat: 16.5165,
    lng: 80.6650,
    x: 325,
    y: 185,
    doctorsPresent: 64,
    doctorsSanctioned: 68,
    dailyFootfall: 2150
  },
  {
    id: 'hosp-aiims-mangalagiri',
    name: 'AIIMS Mangalagiri (Apex Federal Tertiary Hub)',
    shortName: 'AIIMS Mangalagiri',
    location: 'NH-16, Mangalagiri, Guntur',
    district: 'Guntur',
    category: 'Federal Institute',
    totalBeds: 960,
    icuBeds: 80,
    occupiedBeds: 680,
    oxygenStatus: 'Central Liquid Grid (20k Liter Tank)',
    status: 'stable',
    daysOfStock: 14.8,
    criticalItem: 'Regional Strategic Stock Reserve Hub',
    lat: 16.4380,
    lng: 80.5610,
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
    lat: 16.3067,
    lng: 80.4365,
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
    lat: 16.1875,
    lng: 81.1389,
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
    lat: 16.5100,
    lng: 80.6270,
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
    location: 'Collectorate Road, Guntur',
    district: 'Guntur',
    category: 'Private Critical Care',
    totalBeds: 350,
    icuBeds: 45,
    occupiedBeds: 290,
    oxygenStatus: 'Liquid Oxygen Reservoir (92%)',
    status: 'stable',
    daysOfStock: 8.2,
    lat: 16.3120,
    lng: 80.4420,
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
    location: 'Near Kanaka Durga Varadhi, Tadepalli',
    district: 'Guntur (Vijayawada Gateway)',
    category: 'Private Critical Care',
    totalBeds: 250,
    icuBeds: 38,
    occupiedBeds: 215,
    oxygenStatus: 'Dedicated Onsite Oxygen Generation Plant',
    status: 'stable',
    daysOfStock: 6.8,
    lat: 16.4862,
    lng: 80.6033,
    x: 290,
    y: 215,
    doctorsPresent: 36,
    doctorsSanctioned: 40,
    dailyFootfall: 880
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
    lat: 16.2430,
    lng: 80.6400,
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
    lat: 16.5500,
    lng: 80.6300,
    x: 310,
    y: 175,
    doctorsPresent: 2,
    doctorsSanctioned: 2,
    dailyFootfall: 160,
    isIncidentEpicenter: true
  },
  {
    id: 'hosp-gudivada',
    name: 'Area Hospital Gudivada',
    shortName: 'Gudivada Area Hospital',
    location: 'Main Road, Gudivada, Krishna',
    district: 'Krishna',
    category: 'Community Health Centre',
    totalBeds: 100,
    icuBeds: 10,
    occupiedBeds: 88,
    oxygenStatus: 'Bulk Cylinders Active',
    status: 'warning',
    daysOfStock: 3.2,
    criticalItem: 'ORS stock replenishment required within 48h',
    lat: 16.4344,
    lng: 80.9932,
    x: 355,
    y: 215,
    doctorsPresent: 12,
    doctorsSanctioned: 15,
    dailyFootfall: 480
  },
  {
    id: 'hosp-pamarru',
    name: 'Pamarru Community Health Centre',
    shortName: 'Pamarru CHC',
    location: 'National Highway Junction, Pamarru',
    district: 'Krishna',
    category: 'PHC',
    totalBeds: 30,
    icuBeds: 4,
    occupiedBeds: 26,
    oxygenStatus: 'Cylinder Manifold',
    status: 'warning',
    daysOfStock: 2.8,
    criticalItem: 'Electrolyte IV fluids at 3 days cover',
    lat: 16.3267,
    lng: 80.9600,
    x: 345,
    y: 245,
    doctorsPresent: 4,
    doctorsSanctioned: 5,
    dailyFootfall: 220
  }
];

export interface IndiaMapProps {
  mode: 'gis' | 'vector' | 'incident';
  onModeChange?: (mode: 'gis' | 'vector' | 'incident') => void;
  selectedState: any | null;
  onSelectState: (state: any | null) => void;
  selectedHospital: RealHospitalInfo | null;
  onSelectHospital: (hospital: RealHospitalInfo | null) => void;
  selectedLayer?: 'all' | 'critical' | 'corridors' | 'hospitals';
  onNavigateToView?: (viewId: string) => void;
  onSelectContext?: (ctx: any) => void;
}

export const IndiaMap: React.FC<IndiaMapProps> = ({
  mode,
  onModeChange,
  selectedState,
  onSelectState,
  selectedHospital,
  onSelectHospital,
  selectedLayer = 'all',
  onNavigateToView,
  onSelectContext,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  const [gisTileStyle, setGisTileStyle] = useState<'voyager' | 'osm' | 'dark'>('voyager');
  const [hoveredState, setHoveredState] = useState<IndiaStateInfo | null>(null);
  const [hoveredHospital, setHoveredHospital] = useState<RealHospitalInfo | null>(null);

  // Initialize or reconfigure Leaflet map
  useEffect(() => {
    if (mode !== 'gis' && mode !== 'incident') return;
    if (!mapContainerRef.current) return;

    // Center coordinates & zoom depending on mode
    const centerLatLng: [number, number] = mode === 'incident' 
      ? [16.42, 80.75] 
      : [22.9, 79.5];
    const initialZoom = mode === 'incident' ? 9.8 : 4.8;

    if (!leafletMapRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: centerLatLng,
        zoom: initialZoom,
        minZoom: 4,
        maxZoom: 16,
        zoomControl: false,
        attributionControl: false,
      });

      // Add Custom Zoom Control in top right
      L.control.zoom({ position: 'topright' }).addTo(map);

      leafletMapRef.current = map;
      markersLayerRef.current = L.layerGroup().addTo(map);
    } else {
      leafletMapRef.current.setView(centerLatLng, initialZoom, { animate: true });
    }

    // Set Tile Layer
    const tileUrls = {
      voyager: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      osm: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    };

    // Remove existing tile layers
    leafletMapRef.current.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        leafletMapRef.current?.removeLayer(layer);
      }
    });

    L.tileLayer(tileUrls[gisTileStyle], {
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(leafletMapRef.current);

    // Invalidate size on container layout
    setTimeout(() => {
      leafletMapRef.current?.invalidateSize();
    }, 200);

    return () => {
      // Keep map instance alive across toggles if container exists
    };
  }, [mode, gisTileStyle]);

  // Render Overlays / Markers in Leaflet
  useEffect(() => {
    if ((mode !== 'gis' && mode !== 'incident') || !leafletMapRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();
    const map = leafletMapRef.current;
    const layerGroup = markersLayerRef.current;

    // 1. Supply Routes Polylines
    if (selectedLayer === 'all' || selectedLayer === 'corridors') {
      // NH-16 Coastal Route (Vijayawada -> Eluru) [Disrupted / Flood Alert]
      const nh16Coords: [number, number][] = [
        [16.5131, 80.6234], // Vijayawada
        [16.5650, 80.7850],
        [16.6340, 80.9500],
        [16.7100, 81.0950], // Eluru
      ];
      L.polyline(nh16Coords, {
        color: '#dc2626',
        weight: 4,
        dashArray: '8, 8',
        opacity: 0.9,
      })
        .bindTooltip('NH-16: +6.2h Flood Delay (Waterlogged Mile 42)', { sticky: true })
        .addTo(layerGroup);

      // SH-42 Tenali Priority Green Bypass (Vijayawada -> Tenali -> Guntur)
      const sh42Coords: [number, number][] = [
        [16.5131, 80.6234], // Vijayawada
        [16.4862, 80.6033], // Tadepalli
        [16.3650, 80.6300],
        [16.2430, 80.6400], // Tenali
        [16.3067, 80.4365], // Guntur
      ];
      L.polyline(sh42Coords, {
        color: '#0b8f6a',
        weight: 4.5,
        opacity: 0.9,
      })
        .bindTooltip('SH-42 Tenali Bypass: CLEAR / High-Priority Convoy Corridor', { sticky: true })
        .addTo(layerGroup);

      // Hyderabad Strategic Reserve -> Vijayawada Expressway
      const hydVjaCoords: [number, number][] = [
        [17.4193, 78.4483], // Hyderabad NIMS
        [17.1500, 79.2000], // Suryapet
        [16.8500, 79.8000], // Nandigama
        [16.5131, 80.6234], // Vijayawada
      ];
      L.polyline(hydVjaCoords, {
        color: '#2563eb',
        weight: 3.5,
        opacity: 0.85,
        dashArray: '6, 6',
      })
        .bindTooltip('NH-65: Strategic Pharma Dispatch Lane (Active Airlift & Convoys)', { sticky: true })
        .addTo(layerGroup);

      // Coastal feeder: Guntur -> Gudivada -> Machilipatnam
      const coastalFeeder: [number, number][] = [
        [16.3067, 80.4365], // Guntur
        [16.4344, 80.9932], // Gudivada
        [16.1875, 81.1389], // Machilipatnam
      ];
      L.polyline(coastalFeeder, {
        color: '#d97706',
        weight: 3.5,
        opacity: 0.85,
      })
        .bindTooltip('Coastal Emergency Line: ORS & Antibiotic Feeder', { sticky: true })
        .addTo(layerGroup);
    }

    // 2. Incident Epicenter Pulsing Crosshair at Machilipatnam / Krishna
    const pulseIcon = L.divIcon({
      className: 'india-map-marker',
      html: `
        <div class="pulse-beacon" style="width: 32px; height: 32px;">
          <div style="width: 14px; height: 14px; border-radius: 50%; background: #dc2626; border: 2px solid #ffffff; box-shadow: 0 0 12px rgba(220,38,38,0.8);"></div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });
    L.marker([16.1875, 81.1389], { icon: pulseIcon, zIndexOffset: 2000 })
      .bindTooltip('🎯 CRISIS EPICENTER: Machilipatnam Coastal Sector', { permanent: false, direction: 'top' })
      .addTo(layerGroup);

    // 3. Federal Reserve Hubs (In National GIS View)
    if (mode === 'gis' && (selectedLayer === 'all' || selectedLayer === 'hospitals')) {
      FEDERAL_HUBS_DATA.forEach((hub) => {
        const hubIcon = L.divIcon({
          className: 'india-map-marker',
          html: `
            <div style="background: #ffffff; border: 2px solid #2563eb; border-radius: 6px; padding: 3px 6px; box-shadow: 0 2px 6px rgba(0,0,0,0.15); display: flex; align-items: center; gap: 4px; font-weight: 800; font-size: 10px; color: #1e3a8a; white-space: nowrap;">
              <span style="width: 7px; height: 7px; border-radius: 50%; background: #2563eb; display: inline-block;"></span>
              ${hub.code}
            </div>
          `,
          iconSize: [68, 22],
          iconAnchor: [34, 11],
        });

        const marker = L.marker([hub.lat, hub.lng], { icon: hubIcon });
        marker.bindPopup(`
          <div style="padding: 10px 14px; font-family: 'Inter', sans-serif;">
            <div style="font-size: 10px; font-weight: 800; color: #2563eb; text-transform: uppercase;">Federal Tertiary Reserve</div>
            <div style="font-size: 13px; font-weight: 800; color: #0b1220; margin-top: 2px;">${hub.name}</div>
            <div style="font-size: 11px; color: #64748b; margin-top: 4px;">Role: ${hub.role}</div>
            <div style="font-size: 11px; font-weight: 700; color: #0b8f6a; margin-top: 4px;">Strategic Buffer: ${hub.reserveUnits} units</div>
          </div>
        `, { className: 'arogya-leaflet-popup' });
        marker.addTo(layerGroup);
      });
    }

    // 4. State Resilience Markers (In National GIS View)
    if (mode === 'gis' && (selectedLayer === 'all' || selectedLayer === 'critical')) {
      INDIA_STATES_DATA.forEach((st) => {
        const isCritical = st.status === 'incident';
        const isWarn = st.status === 'warning';
        const color = isCritical ? '#dc2626' : isWarn ? '#d97706' : '#0b8f6a';

        if (selectedLayer === 'critical' && st.status === 'stable') return;

        const stateIcon = L.divIcon({
          className: 'india-map-marker',
          html: `
            <div style="background: ${isCritical ? '#fef2f2' : '#ffffff'}; border: 2px solid ${color}; border-radius: 20px; padding: 2px 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.12); display: flex; align-items: center; gap: 4px; font-size: 10px; font-weight: 700; color: ${color}; white-space: nowrap;">
              <span>${st.code}</span>
              <span style="font-size: 9px; opacity: 0.85;">${st.resilienceScore}</span>
            </div>
          `,
          iconSize: [60, 20],
          iconAnchor: [30, 10],
        });

        const marker = L.marker([st.lat, st.lng], { icon: stateIcon });
        marker.on('click', () => {
          onSelectState(st);
          onSelectHospital(null);
          if (st.isIncidentZone) {
            onSelectContext?.('Andhra Pradesh (State)');
          }
        });
        marker.bindTooltip(`
          <strong>${st.name}</strong><br/>
          Resilience: ${st.resilienceScore}/100<br/>
          Apex: ${st.capital}<br/>
          Surge: ${st.activeSurge}
        `);
        marker.addTo(layerGroup);
      });
    }

    // 5. Real Hospital Markers (In Incident View or when zoomed in)
    if (mode === 'incident' || selectedLayer === 'hospitals' || selectedLayer === 'all') {
      REAL_HOSPITALS_DATA.forEach((hosp) => {
        const isCrit = hosp.status === 'critical';
        const isWarn = hosp.status === 'warning';
        const pinColor = isCrit ? '#dc2626' : isWarn ? '#d97706' : '#0b8f6a';
        const isSelected = selectedHospital?.id === hosp.id;

        if (selectedLayer === 'critical' && hosp.status === 'stable') return;

        const hospIcon = L.divIcon({
          className: 'india-map-marker',
          html: `
            <div style="display: flex; flex-direction: column; align-items: center;">
              <div style="background: ${pinColor}; width: ${isSelected ? 20 : 14}px; height: ${isSelected ? 20 : 14}px; border-radius: 50%; border: 2px solid #ffffff; box-shadow: 0 2px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: #ffffff; font-weight: 900; font-size: 8px;">
                +
              </div>
              <div style="background: rgba(255,255,255,0.95); border: 1px solid #cbd5e1; border-radius: 4px; padding: 1px 4px; margin-top: 2px; font-size: 8.5px; font-weight: 700; color: #0b1220; white-space: nowrap; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                ${hosp.shortName}
              </div>
            </div>
          `,
          iconSize: [80, 36],
          iconAnchor: [40, 18],
        });

        const marker = L.marker([hosp.lat, hosp.lng], { icon: hospIcon, zIndexOffset: isSelected ? 1500 : 500 });
        marker.on('click', () => {
          onSelectHospital(hosp);
          onSelectState(null);
        });

        marker.bindPopup(`
          <div style="padding: 10px 14px; min-width: 200px;">
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px;">
              <span style="font-size: 9px; font-weight: 800; color: ${pinColor}; text-transform: uppercase;">${hosp.category}</span>
              <span style="font-size: 9px; font-weight: 700; padding: 2px 6px; border-radius: 4px; background: ${pinColor}15; color: ${pinColor};">${hosp.status.toUpperCase()}</span>
            </div>
            <div style="font-size: 12.5px; font-weight: 800; color: #0b1220; margin-top: 3px;">${hosp.name}</div>
            <div style="font-size: 10.5px; color: #64748b; margin-top: 2px;">📍 ${hosp.location}</div>
            <div style="margin-top: 8px; display: grid; grid-template-columns: 1fr 1fr; gap: 6px; font-size: 10px; background: #f8fafc; padding: 6px; border-radius: 6px;">
              <div>Beds: <strong>${hosp.occupiedBeds}/${hosp.totalBeds}</strong></div>
              <div>ICU: <strong>${hosp.icuBeds} Free</strong></div>
              <div>Stock: <strong style="color: ${hosp.daysOfStock < 2 ? '#dc2626' : '#0b8f6a'}">${hosp.daysOfStock}d</strong></div>
              <div>Oxygen: <strong>Operational</strong></div>
            </div>
          </div>
        `, { className: 'arogya-leaflet-popup' });

        marker.addTo(layerGroup);
      });
    }
  }, [mode, selectedLayer, selectedHospital, selectedState]);

  const handleResetToIndia = () => {
    onModeChange?.('gis');
    onSelectState(null);
    onSelectHospital(null);
    leafletMapRef.current?.setView([22.9, 79.5], 4.8, { animate: true });
    onSelectContext?.('India (National)');
  };

  const handleFocusCrisisZone = () => {
    onModeChange?.('incident');
    onSelectState(null);
    leafletMapRef.current?.setView([16.42, 80.75], 9.8, { animate: true });
    onSelectContext?.('Krishna District (Vijayawada)');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', position: 'relative' }}>
      {/* ── TOP MAP CONTROLS & MODE TOGGLES ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 10,
          padding: '10px 14px',
          background: '#FFFFFF',
          borderBottom: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0',
          zIndex: 10,
        }}
      >
        {/* Left: Mode Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', background: '#F1F5F9', padding: 2, borderRadius: 6, border: '1px solid var(--border-default)' }}>
            <button
              id="btn-gis-india-map"
              onClick={() => {
                onModeChange?.('gis');
                leafletMapRef.current?.setView([22.9, 79.5], 4.8, { animate: true });
                onSelectContext?.('India (National)');
              }}
              style={{
                padding: '4px 10px',
                borderRadius: 4,
                background: mode === 'gis' ? '#FFFFFF' : 'transparent',
                border: mode === 'gis' ? '1px solid var(--border-default)' : 'none',
                boxShadow: mode === 'gis' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                color: mode === 'gis' ? 'var(--color-green-deep)' : 'var(--text-secondary)',
                fontSize: 11,
                fontWeight: mode === 'gis' ? 700 : 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
              }}
            >
              <span>🗺️</span> Real GIS Map (India)
            </button>

            <button
              id="btn-vector-india-map"
              onClick={() => {
                onModeChange?.('vector');
                onSelectContext?.('India (National)');
              }}
              style={{
                padding: '4px 10px',
                borderRadius: 4,
                background: mode === 'vector' ? '#FFFFFF' : 'transparent',
                border: mode === 'vector' ? '1px solid var(--border-default)' : 'none',
                boxShadow: mode === 'vector' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                color: mode === 'vector' ? 'var(--color-blue)' : 'var(--text-secondary)',
                fontSize: 11,
                fontWeight: mode === 'vector' ? 700 : 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
              }}
            >
              <span>🇮🇳</span> Vector State Resilience
            </button>

            <button
              id="btn-incident-radar-map"
              onClick={() => {
                onModeChange?.('incident');
                leafletMapRef.current?.setView([16.42, 80.75], 9.8, { animate: true });
                onSelectContext?.('Krishna District (Vijayawada)');
              }}
              style={{
                padding: '4px 10px',
                borderRadius: 4,
                background: mode === 'incident' ? '#FFFFFF' : 'transparent',
                border: mode === 'incident' ? '1px solid var(--border-default)' : 'none',
                boxShadow: mode === 'incident' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                color: mode === 'incident' ? 'var(--color-critical)' : 'var(--text-secondary)',
                fontSize: 11,
                fontWeight: mode === 'incident' ? 700 : 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
              }}
            >
              <span>🎯</span> Crisis Radar (AP Sector)
            </button>
          </div>

          {/* Quick Zoom Presets */}
          <button
            onClick={handleResetToIndia}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: '4px 8px',
              borderRadius: 4,
              background: '#FFFFFF',
              border: '1px solid var(--border-default)',
              fontSize: 10.5,
              fontWeight: 600,
              color: 'var(--text-secondary)',
              cursor: 'pointer',
            }}
            title="Reset view to whole of India"
          >
            <RotateCcw size={12} /> Fit India
          </button>

          <button
            onClick={handleFocusCrisisZone}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: '4px 8px',
              borderRadius: 4,
              background: '#FEF2F2',
              border: '1px solid #FECACA',
              fontSize: 10.5,
              fontWeight: 700,
              color: 'var(--color-critical)',
              cursor: 'pointer',
            }}
            title="Zoom directly to Coastal Andhra crisis sector"
          >
            <span>🚨</span> Zoom Crisis Epicenter
          </button>
        </div>

        {/* Right: Base layer style selector (in GIS mode) */}
        {mode === 'gis' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 10.5, color: 'var(--text-muted)', fontWeight: 600 }}>Tile:</span>
            {(['voyager', 'osm', 'dark'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setGisTileStyle(st)}
                style={{
                  padding: '3px 8px',
                  borderRadius: 4,
                  fontSize: 10,
                  fontWeight: gisTileStyle === st ? 700 : 500,
                  background: gisTileStyle === st ? 'var(--color-green-light)' : '#F8FAFC',
                  border: `1px solid ${gisTileStyle === st ? 'var(--color-green-border)' : 'var(--border-default)'}`,
                  color: gisTileStyle === st ? 'var(--color-green-deep)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                }}
              >
                {st === 'voyager' ? 'Voyager' : st === 'osm' ? 'OSM' : 'Dark Radar'}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── MAP CANVAS DISPLAY ── */}
      <div
        style={{
          flex: 1,
          minHeight: 480,
          position: 'relative',
          background: '#F8FAFC',
          overflow: 'hidden',
          borderRadius: '0 0 var(--radius-sm) var(--radius-sm)',
        }}
      >
        {/* Leaflet Container (Visible in 'gis' and 'incident' modes) */}
        <div
          ref={mapContainerRef}
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            inset: 0,
            display: mode === 'vector' ? 'none' : 'block',
            zIndex: 1,
          }}
        />

        {/* ── VECTOR INDIA MAP (Rendered when in 'vector' mode) ── */}
        {mode === 'vector' && (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 12 }}>
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 600 520"
              style={{ maxHeight: 500, userSelect: 'none' }}
            >
              <defs>
                <pattern id="grid-india-vector" width="24" height="24" patternUnits="userSpaceOnUse">
                  <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#E2E8F0" strokeWidth="0.6" />
                </pattern>
                {/* Gradient for coastlines */}
                <linearGradient id="bay-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#EFF6FF" />
                  <stop offset="100%" stopColor="#DBEAFE" />
                </linearGradient>
              </defs>

              <rect width="600" height="520" fill="url(#grid-india-vector)" />

              {/* Ocean Boundaries */}
              <path d="M 370,510 Q 400,360 450,270 T 600,160 L 600,520 Z" fill="url(#bay-gradient)" stroke="#BFDBFE" strokeWidth="1.2" />
              <text x="470" y="360" fill="#93C5FD" fontSize="11" fontWeight="800" letterSpacing="0.1em">BAY OF BENGAL</text>

              <path d="M 0,250 Q 80,300 130,390 T 170,520 L 0,520 Z" fill="url(#bay-gradient)" stroke="#BFDBFE" strokeWidth="1.2" />
              <text x="35" y="410" fill="#93C5FD" fontSize="11" fontWeight="800" letterSpacing="0.1em">ARABIAN SEA</text>

              {/* Sri Lanka */}
              <ellipse cx="295" cy="502" rx="10" ry="15" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.2" />
              <text x="295" y="505" fill="#94A3B8" fontSize="7" fontWeight="600" textAnchor="middle">SRI LANKA</text>

              {/* Lakshadweep & Andaman */}
              <g fill="#94A3B8">
                <circle cx="130" cy="440" r="3" />
                <circle cx="135" cy="455" r="3" />
                <circle cx="140" cy="470" r="2.5" />
                <text x="85" y="455" fill="#94A3B8" fontSize="8" fontWeight="600">LAKSHADWEEP</text>

                <circle cx="530" cy="400" r="3.5" />
                <circle cx="535" cy="420" r="4" />
                <circle cx="538" cy="445" r="3.5" />
                <circle cx="542" cy="470" r="3" />
                <text x="500" y="490" fill="#94A3B8" fontSize="8" fontWeight="600">ANDAMAN & NICOBAR</text>
              </g>

              {/* ACCURATE GEOGRAPHIC OUTLINE OF INDIA */}
              {/* 1. Jammu, Kashmir & Ladakh (Crown of India) */}
              <path
                d="M 195,22 C 215,16 245,28 260,42 C 275,56 280,78 265,95 C 250,98 235,92 220,95 C 205,92 195,78 185,65 C 175,50 180,30 195,22 Z"
                fill={hoveredState?.id === 'jk-la' ? '#F1F5F9' : '#FFFFFF'}
                stroke="#94A3B8"
                strokeWidth="1.5"
                className="india-state-path"
                onMouseEnter={() => setHoveredState(INDIA_STATES_DATA[0])}
                onMouseLeave={() => setHoveredState(null)}
                onClick={() => onSelectState(INDIA_STATES_DATA[0])}
              />
              <text x="228" y="60" fontSize="8.5" fontWeight="700" fill="#1E293B" textAnchor="middle">JK & LA</text>

              {/* 2. Punjab, Haryana & Chandigarh */}
              <path
                d="M 180,95 C 195,92 210,95 218,102 L 210,135 C 190,138 175,130 168,115 C 165,102 172,96 180,95 Z"
                fill="#FFFFFF"
                stroke="#94A3B8"
                strokeWidth="1.4"
                className="india-state-path"
                onMouseEnter={() => setHoveredState(INDIA_STATES_DATA[2])}
                onMouseLeave={() => setHoveredState(null)}
                onClick={() => onSelectState(INDIA_STATES_DATA[2])}
              />
              <text x="192" y="118" fontSize="8" fontWeight="700" fill="#1E293B" textAnchor="middle">PB & HR</text>

              {/* 3. Himachal Pradesh & Uttarakhand */}
              <path
                d="M 218,102 C 235,95 255,100 270,115 L 265,135 C 248,132 232,130 220,128 L 210,135 Z"
                fill="#FFFFFF"
                stroke="#94A3B8"
                strokeWidth="1.4"
                className="india-state-path"
                onMouseEnter={() => setHoveredState(INDIA_STATES_DATA[1])}
                onMouseLeave={() => setHoveredState(null)}
                onClick={() => onSelectState(INDIA_STATES_DATA[1])}
              />
              <text x="242" y="122" fontSize="7.5" fontWeight="700" fill="#1E293B" textAnchor="middle">HP & UK</text>

              {/* 4. Delhi NCR */}
              <circle
                cx="218"
                cy="138"
                r="6"
                fill="#EFF6FF"
                stroke="#2563EB"
                strokeWidth="2"
                style={{ cursor: 'pointer' }}
                onClick={() => onSelectState(INDIA_STATES_DATA[3])}
              />
              <text x="218" y="140" fontSize="6.5" fontWeight="800" fill="#2563EB" textAnchor="middle">DL</text>

              {/* 5. Rajasthan (Iconic Western Thar Contour) */}
              <path
                d="M 168,115 C 175,130 190,138 205,142 L 198,198 C 175,205 145,198 120,185 C 95,165 105,135 125,120 C 145,115 160,118 168,115 Z"
                fill="#FFFFFF"
                stroke="#94A3B8"
                strokeWidth="1.5"
                className="india-state-path"
                onMouseEnter={() => setHoveredState(INDIA_STATES_DATA[4])}
                onMouseLeave={() => setHoveredState(null)}
                onClick={() => onSelectState(INDIA_STATES_DATA[4])}
              />
              <text x="150" y="160" fontSize="9" fontWeight="700" fill="#1E293B" textAnchor="middle">RJ</text>

              {/* 6. Gujarat (Iconic Dual Peninsulas: Kutch & Kathiawar) */}
              <path
                d="M 120,185 C 135,192 145,198 152,220 C 140,230 115,232 98,245 C 75,248 68,225 78,205 C 90,195 110,195 120,185 Z"
                fill="#FFFFFF"
                stroke="#94A3B8"
                strokeWidth="1.5"
                className="india-state-path"
                onMouseEnter={() => setHoveredState(INDIA_STATES_DATA[11])}
                onMouseLeave={() => setHoveredState(null)}
                onClick={() => onSelectState(INDIA_STATES_DATA[11])}
              />
              <text x="110" y="222" fontSize="9" fontWeight="700" fill="#1E293B" textAnchor="middle">GJ</text>

              {/* 7. Uttar Pradesh (Gangetic Basin) */}
              <path
                d="M 220,128 C 248,132 270,125 315,145 C 322,175 310,195 285,198 C 255,195 235,190 205,188 L 205,142 Z"
                fill="#FFFFFF"
                stroke="#94A3B8"
                strokeWidth="1.4"
                className="india-state-path"
                onMouseEnter={() => setHoveredState(INDIA_STATES_DATA[5])}
                onMouseLeave={() => setHoveredState(null)}
                onClick={() => onSelectState(INDIA_STATES_DATA[5])}
              />
              <text x="260" y="165" fontSize="9" fontWeight="700" fill="#1E293B" textAnchor="middle">UP</text>

              {/* 8. Bihar */}
              <path
                d="M 315,145 C 345,150 365,155 372,185 C 352,192 335,195 315,192 L 310,170 Z"
                fill="#FFFFFF"
                stroke="#94A3B8"
                strokeWidth="1.4"
                className="india-state-path"
                onMouseEnter={() => setHoveredState(INDIA_STATES_DATA[6])}
                onMouseLeave={() => setHoveredState(null)}
                onClick={() => onSelectState(INDIA_STATES_DATA[6])}
              />
              <text x="342" y="172" fontSize="8.5" fontWeight="700" fill="#1E293B" textAnchor="middle">BR</text>

              {/* 9. West Bengal (Delta & Corridor) */}
              <path
                d="M 372,145 C 382,142 388,168 395,192 C 390,225 372,242 360,240 C 355,215 362,195 372,185 Z"
                fill="#FFFFFF"
                stroke="#94A3B8"
                strokeWidth="1.4"
                className="india-state-path"
                onMouseEnter={() => setHoveredState(INDIA_STATES_DATA[7])}
                onMouseLeave={() => setHoveredState(null)}
                onClick={() => onSelectState(INDIA_STATES_DATA[7])}
              />
              <text x="378" y="205" fontSize="8" fontWeight="700" fill="#1E293B" textAnchor="middle">WB</text>

              {/* 10. Assam & North-East (Seven Sisters) */}
              <path
                d="M 395,145 C 430,120 480,130 500,165 C 495,195 460,210 435,215 C 410,210 398,185 395,160 Z"
                fill="#FFFFFF"
                stroke="#94A3B8"
                strokeWidth="1.5"
                className="india-state-path"
                onMouseEnter={() => setHoveredState(INDIA_STATES_DATA[8])}
                onMouseLeave={() => setHoveredState(null)}
                onClick={() => onSelectState(INDIA_STATES_DATA[8])}
              />
              <text x="445" y="168" fontSize="9" fontWeight="700" fill="#1E293B" textAnchor="middle">NE & ASSAM</text>

              {/* 11. Madhya Pradesh (Central Heart) */}
              <path
                d="M 198,198 C 235,190 285,195 305,215 C 300,255 265,265 220,265 C 180,260 165,240 162,220 Z"
                fill="#FFFFFF"
                stroke="#94A3B8"
                strokeWidth="1.5"
                className="india-state-path"
                onMouseEnter={() => setHoveredState(INDIA_STATES_DATA[10])}
                onMouseLeave={() => setHoveredState(null)}
                onClick={() => onSelectState(INDIA_STATES_DATA[10])}
              />
              <text x="235" y="235" fontSize="9" fontWeight="700" fill="#1E293B" textAnchor="middle">MP</text>

              {/* 12. Jharkhand & Chhattisgarh */}
              <path
                d="M 305,215 C 335,205 355,215 355,245 C 342,285 315,295 295,285 C 285,265 295,235 305,215 Z"
                fill="#FFFFFF"
                stroke="#94A3B8"
                strokeWidth="1.4"
                className="india-state-path"
                onMouseEnter={() => setHoveredState(INDIA_STATES_DATA[9])}
                onMouseLeave={() => setHoveredState(null)}
                onClick={() => onSelectState(INDIA_STATES_DATA[9])}
              />
              <text x="325" y="255" fontSize="8" fontWeight="700" fill="#1E293B" textAnchor="middle">JH & CG</text>

              {/* 13. Odisha (Coastal Curve) */}
              <path
                d="M 355,245 C 375,245 390,265 375,305 C 352,315 330,305 315,295 C 330,275 342,255 355,245 Z"
                fill="#FFFFFF"
                stroke="#94A3B8"
                strokeWidth="1.4"
                className="india-state-path"
                onMouseEnter={() => setHoveredState(INDIA_STATES_DATA[13])}
                onMouseLeave={() => setHoveredState(null)}
                onClick={() => onSelectState(INDIA_STATES_DATA[13])}
              />
              <text x="350" y="280" fontSize="8.5" fontWeight="700" fill="#1E293B" textAnchor="middle">OD</text>

              {/* 14. Maharashtra (Western Deccan & Konkan) */}
              <path
                d="M 152,220 C 180,225 220,225 240,270 C 235,315 195,325 155,315 C 135,285 140,245 152,220 Z"
                fill="#FFFFFF"
                stroke="#94A3B8"
                strokeWidth="1.5"
                className="india-state-path"
                onMouseEnter={() => setHoveredState(INDIA_STATES_DATA[14])}
                onMouseLeave={() => setHoveredState(null)}
                onClick={() => onSelectState(INDIA_STATES_DATA[14])}
              />
              <text x="185" y="278" fontSize="9" fontWeight="700" fill="#1E293B" textAnchor="middle">MH</text>

              {/* 15. Telangana */}
              <path
                d="M 240,270 C 275,270 288,295 285,320 C 265,335 245,335 235,315 Z"
                fill="#FFFFFF"
                stroke="#94A3B8"
                strokeWidth="1.4"
                className="india-state-path"
                onMouseEnter={() => setHoveredState(INDIA_STATES_DATA[16])}
                onMouseLeave={() => setHoveredState(null)}
                onClick={() => onSelectState(INDIA_STATES_DATA[16])}
              />
              <text x="260" y="305" fontSize="8.5" fontWeight="700" fill="#1E293B" textAnchor="middle">TS</text>

              {/* 16. Andhra Pradesh (CRISIS INCIDENT SECTOR) - Highlighted with Crimson Beacon */}
              <path
                d="M 285,320 C 320,310 345,335 320,385 C 290,410 265,405 255,385 C 255,355 265,335 285,320 Z"
                fill="#FEE2E2"
                stroke="var(--color-critical)"
                strokeWidth="2.5"
                className="india-state-path"
                style={{ filter: 'drop-shadow(0 2px 8px rgba(220,38,38,0.25))' }}
                onMouseEnter={() => setHoveredState(INDIA_STATES_DATA[17])}
                onMouseLeave={() => setHoveredState(null)}
                onClick={() => {
                  onSelectState(INDIA_STATES_DATA[17]);
                  onModeChange?.('incident');
                }}
              />
              <text x="290" y="360" fontSize="10" fontWeight="800" fill="var(--color-critical)" textAnchor="middle">
                AP (CRISIS)
              </text>

              {/* Pulsing crisis ring on AP */}
              <circle cx="310" cy="355" r="14" fill="none" stroke="var(--color-critical)" strokeWidth="1.8" opacity="0.6">
                <animate attributeName="r" values="8;20;8" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.8;0;0.8" dur="2s" repeatCount="indefinite" />
              </circle>
              <circle cx="310" cy="355" r="4.5" fill="var(--color-critical)" />

              {/* 17. Karnataka */}
              <path
                d="M 155,315 C 195,325 235,315 240,365 C 230,415 190,425 175,400 C 160,370 150,335 155,315 Z"
                fill="#FFFFFF"
                stroke="#94A3B8"
                strokeWidth="1.4"
                className="india-state-path"
                onMouseEnter={() => setHoveredState(INDIA_STATES_DATA[18])}
                onMouseLeave={() => setHoveredState(null)}
                onClick={() => onSelectState(INDIA_STATES_DATA[18])}
              />
              <text x="195" y="370" fontSize="8.5" fontWeight="700" fill="#1E293B" textAnchor="middle">KA</text>

              {/* 18. Kerala (Malabar Coast) */}
              <path
                d="M 175,400 C 190,425 195,465 190,488 C 180,485 172,455 170,425 Z"
                fill="#FFFFFF"
                stroke="#94A3B8"
                strokeWidth="1.4"
                className="india-state-path"
                onMouseEnter={() => setHoveredState(INDIA_STATES_DATA[19])}
                onMouseLeave={() => setHoveredState(null)}
                onClick={() => onSelectState(INDIA_STATES_DATA[19])}
              />
              <text x="180" y="450" fontSize="7.5" fontWeight="700" fill="#1E293B" textAnchor="middle">KL</text>

              {/* 19. Tamil Nadu (Southern Apex to Cape Comorin) */}
              <path
                d="M 235,385 C 265,385 275,425 260,475 C 240,495 210,495 190,488 C 195,465 210,425 235,385 Z"
                fill="#FFFFFF"
                stroke="#94A3B8"
                strokeWidth="1.4"
                className="india-state-path"
                onMouseEnter={() => setHoveredState(INDIA_STATES_DATA[20])}
                onMouseLeave={() => setHoveredState(null)}
                onClick={() => onSelectState(INDIA_STATES_DATA[20])}
              />
              <text x="235" y="445" fontSize="8.5" fontWeight="700" fill="#1E293B" textAnchor="middle">TN</text>

              {/* Federal Tertiary Reserve Pins */}
              {FEDERAL_HUBS_DATA.map((hub) => (
                <g key={hub.code} style={{ pointerEvents: 'none' }}>
                  <circle cx={hub.x + 30} cy={hub.y + 15} r="5" fill="#2563EB" stroke="#FFFFFF" strokeWidth="1.5" />
                  <circle cx={hub.x + 30} cy={hub.y + 15} r="2" fill="#FFFFFF" />
                  <text x={hub.x + 38} y={hub.y + 18} fill="#1E3A8A" fontSize="7.5" fontWeight="800" fontFamily="JetBrains Mono">
                    {hub.code}
                  </text>
                </g>
              ))}

              {/* Action Banner to Enter Crisis Radar */}
              <g
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  onModeChange?.('incident');
                  onSelectContext?.('Krishna District (Vijayawada)');
                }}
              >
                <rect x="280" y="415" width="230" height="28" rx="6" fill="#FFFFFF" stroke="var(--color-critical)" strokeWidth="1.5" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.1))" />
                <text x="395" y="433" fill="var(--color-critical)" fontSize="10" fontWeight="800" textAnchor="middle">
                  🎯 Enter Incident Sector (12 Real Hospitals)
                </text>
              </g>
            </svg>
          </div>
        )}

        {/* ── MAP LEGEND OVERLAY (Corner HUD) ── */}
        <div
          style={{
            position: 'absolute',
            bottom: 12,
            left: 12,
            background: 'rgba(255, 255, 255, 0.94)',
            backdropFilter: 'blur(8px)',
            border: '1px solid var(--border-default)',
            borderRadius: 8,
            padding: '8px 12px',
            boxShadow: 'var(--shadow-subtle)',
            fontSize: 10.5,
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            gap: 5,
            fontFamily: 'Inter, sans-serif',
          }}
        >
          <span style={{ fontSize: 9.5, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            National Resilience Legend
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-secondary)' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#0B8F6A' }} /> Stable Buffer (&gt;14d)
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-secondary)' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#D97706' }} /> Warning Buffer (7-14d)
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-secondary)' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#DC2626' }} /> Critical / Flood Crisis (&lt;3d)
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-secondary)' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#2563EB' }} /> Federal Apex Hub
            </span>
          </div>
        </div>

        {/* ── DRILLDOWN PROMPT BANNER (Top Center HUD) ── */}
        <div
          style={{
            position: 'absolute',
            top: 10,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(255, 255, 255, 0.92)',
            backdropFilter: 'blur(6px)',
            border: '1px solid var(--border-default)',
            borderRadius: 20,
            padding: '4px 14px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
            fontSize: 11,
            fontWeight: 700,
            color: 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            zIndex: 10,
            pointerEvents: 'none',
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#0B8F6A', animation: 'pulse 1.5s infinite' }} />
          <span>
            {mode === 'incident' 
              ? 'Tactical Crisis Sector: Coastal Andhra (Krishna & Guntur Districts)'
              : 'Interactive India Healthcare Grid: Click any State or Federal Hub to inspect'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default IndiaMap;
