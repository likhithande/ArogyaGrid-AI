import {
  PHC, District, StateSummary, Medicine, DemandForecast, StockoutPrediction,
  RedistributionRecommendation, EmergencyScenario, FederatedRound, AnomalyItem,
  SupplyChainNode, SupplyChainEdge, ResilienceScore, AuditLog, SimulationParams,
  SimulationResult, CopilotResponse, Language, Role,
  AutonomousAgent, AgentCollaborationMessage, ResilienceBrainSignal, CascadeSimulationResult,
  EarlyWarningItem, SmartProcurementItem, SupplierProfile, AlternativeRoute, SwapMarketOffer,
  EmergencyPlaybook, MedicalEquipment, ColdChainSensor, EnergyResilienceMetric,
  ModelObservatoryMetric, DataQualityMetric, RootCauseDiagnostic, DecisionOption, ScalabilityMetrics,
  EcosystemNode, EcosystemEdge, PropagationStep, ResourceMatchProposal, ParetoObjectiveTradeoff,
  AuctionScenario, FutureBottleneck, ResourceWastageRisk, BatchExpiryItem, EdgeNodeInfo,
  ChampionChallengerModel, ContinuousLearningStage, ExtractedDocData, ReconciliationDiscrepancy,
  DataLineageItem, SecurityEventItem, DigitalSignatureApproval, CrisisTimelineEvent, IncidentTask,
  PostMortemInsight, PresetScenario, SustainabilityMetric, SmartRouteItem, LiveMovingVehicle,
  NotificationItem, AiStorySlide, JudgeFaqItem, ArchitectureLayer, GoogleCloudMapping, IotSensorEvent,
  AgentExecutionRequest, AgentExecutionResponse, SwarmMissionRequest, SwarmMissionResponse
} from '../types';

const API_BASE = '/api';

export async function fetchDashboardSummary(): Promise<any> {
  try {
    const res = await fetch(`${API_BASE}/dashboard`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Backend unavailable, using fallback telemetry:', e);
  }
  return {
    network_status: "OPERATIONAL",
    total_phcs: 694,
    active_phcs: 690,
    total_districts: 51,
    total_states: 8,
    medicine_availability_pct: 89.9,
    critical_stockouts_count: 3,
    total_beds: 8430,
    beds_occupied: 5852,
    beds_available: 2578,
    bed_occupancy_pct: 69.4,
    doctor_attendance_pct: 92.8,
    current_daily_footfall: 138346,
    predicted_7d_footfall: 177082,
    supply_risk_index: 28.5,
    emergency_readiness_score: 87.2,
    national_resilience_index: 82.4,
    active_emergencies_count: 1,
    active_alerts_count: 4,
    pending_redistributions_count: 2,
    federated_participating_nodes: 1248,
    federated_accuracy_pct: 94.6
  };
}

export async function fetchPHCs(limit = 100, state?: string, status?: string): Promise<PHC[]> {
  try {
    const params = new URLSearchParams();
    params.set('limit', limit.toString());
    if (state) params.set('state', state);
    if (status) params.set('status', status);
    const res = await fetch(`${API_BASE}/phcs?${params.toString()}`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Using fallback PHCs:', e);
  }
  // Return fallback representative PHCs
  return [
    {
      id: "PHC-0042",
      name: "Machilipatnam Coastal PHC (Krishna)",
      code: "AP-HWC-0042",
      state: "Andhra Pradesh",
      district: "Krishna",
      subdistrict: "Machilipatnam-Block-1",
      lat: 16.1907,
      lng: 81.1394,
      type: "PHC",
      beds_total: 16,
      beds_occupied: 14,
      beds_icu: 2,
      beds_oxygen: 6,
      doctors_present: 2,
      doctors_sanctioned: 2,
      nurses_present: 4,
      nurses_sanctioned: 5,
      pharmacists_present: 1,
      staff_total: 10,
      daily_footfall: 285,
      stock_health_score: 41.5,
      resilience_index: 54.0,
      status: "CRITICAL",
      contact_officer: "Medical Officer Dr. K. Srinivas Rao",
      phone: "+91 98480 12845"
    },
    {
      id: "PHC-0018",
      name: "Avanigadda Rural Hospital (Krishna)",
      code: "AP-HWC-0018",
      state: "Andhra Pradesh",
      district: "Krishna",
      subdistrict: "Avanigadda-Taluk-2",
      lat: 16.0234,
      lng: 80.9167,
      type: "CHC",
      beds_total: 30,
      beds_occupied: 27,
      beds_icu: 4,
      beds_oxygen: 10,
      doctors_present: 3,
      doctors_sanctioned: 4,
      nurses_present: 7,
      nurses_sanctioned: 8,
      pharmacists_present: 1,
      staff_total: 15,
      daily_footfall: 310,
      stock_health_score: 52.0,
      resilience_index: 59.2,
      status: "CRITICAL",
      contact_officer: "Dr. V. Lakshmi Devi",
      phone: "+91 98480 34912"
    },
    {
      id: "PHC-0065",
      name: "Guntur Urban Community Health Centre",
      code: "AP-HWC-0065",
      state: "Andhra Pradesh",
      district: "Guntur",
      subdistrict: "Guntur-Mandal-1",
      lat: 16.3067,
      lng: 80.4365,
      type: "CHC",
      beds_total: 32,
      beds_occupied: 22,
      beds_icu: 4,
      beds_oxygen: 12,
      doctors_present: 4,
      doctors_sanctioned: 4,
      nurses_present: 8,
      nurses_sanctioned: 8,
      pharmacists_present: 1,
      staff_total: 17,
      daily_footfall: 340,
      stock_health_score: 91.5,
      resilience_index: 89.0,
      status: "NORMAL",
      contact_officer: "Dr. P. Ramachandra",
      phone: "+91 98480 87123"
    },
    {
      id: "PHC-0112",
      name: "Kakinada Port Rural Primary Health Centre",
      code: "AP-HWC-0112",
      state: "Andhra Pradesh",
      district: "East Godavari",
      subdistrict: "Kakinada-Tehsil-3",
      lat: 16.9891,
      lng: 82.2475,
      type: "PHC",
      beds_total: 12,
      beds_occupied: 9,
      beds_icu: 1,
      beds_oxygen: 4,
      doctors_present: 2,
      doctors_sanctioned: 2,
      nurses_present: 3,
      nurses_sanctioned: 4,
      pharmacists_present: 1,
      staff_total: 9,
      daily_footfall: 195,
      stock_health_score: 64.0,
      resilience_index: 68.5,
      status: "WARNING",
      contact_officer: "Dr. M. Venkat Reddy",
      phone: "+91 98480 65129"
    }
  ];
}

export async function fetchDistricts(): Promise<District[]> {
  try {
    const res = await fetch(`${API_BASE}/districts`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Using fallback districts:', e);
  }
  return [
    { id: "DIST-001", name: "Krishna", state: "Andhra Pradesh", lat: 16.1907, lng: 81.1394, total_phcs: 15, active_phcs: 13, population: 4517398, total_beds: 340, beds_occupied: 298, critical_stockouts_count: 8, resilience_score: 63.4, risk_level: "CRITICAL", avg_daily_footfall: 4200, chief_medical_officer: "Dr. K. Srinivas Rao" },
    { id: "DIST-002", name: "Guntur", state: "Andhra Pradesh", lat: 16.3067, lng: 80.4365, total_phcs: 14, active_phcs: 14, population: 4887813, total_beds: 360, beds_occupied: 245, critical_stockouts_count: 2, resilience_score: 86.8, risk_level: "LOW", avg_daily_footfall: 3900, chief_medical_officer: "Dr. V. Lakshmi Devi" },
    { id: "DIST-003", name: "Visakhapatnam", state: "Andhra Pradesh", lat: 17.6868, lng: 83.2185, total_phcs: 16, active_phcs: 16, population: 4290589, total_beds: 410, beds_occupied: 310, critical_stockouts_count: 1, resilience_score: 91.2, risk_level: "LOW", avg_daily_footfall: 5100, chief_medical_officer: "Dr. P. Ramachandra" },
    { id: "DIST-004", name: "East Godavari", state: "Andhra Pradesh", lat: 17.0005, lng: 81.8040, total_phcs: 14, active_phcs: 13, population: 5154296, total_beds: 350, beds_occupied: 280, critical_stockouts_count: 6, resilience_score: 69.1, risk_level: "HIGH", avg_daily_footfall: 4600, chief_medical_officer: "Dr. M. Venkat Reddy" },
    { id: "DIST-009", name: "Hyderabad", state: "Telangana", lat: 17.3850, lng: 78.4867, total_phcs: 16, active_phcs: 16, population: 3943323, total_beds: 450, beds_occupied: 320, critical_stockouts_count: 0, resilience_score: 94.5, risk_level: "LOW", avg_daily_footfall: 6200, chief_medical_officer: "Dr. J. Venugopal" },
    { id: "DIST-012", name: "Warangal", state: "Telangana", lat: 17.9689, lng: 79.5941, total_phcs: 13, active_phcs: 13, population: 1800000, total_beds: 290, beds_occupied: 215, critical_stockouts_count: 3, resilience_score: 74.8, risk_level: "MEDIUM", avg_daily_footfall: 2800, chief_medical_officer: "Dr. N. Rajender" },
    { id: "DIST-016", name: "Pune", state: "Maharashtra", lat: 18.5204, lng: 73.8567, total_phcs: 15, active_phcs: 15, population: 9429408, total_beds: 430, beds_occupied: 310, critical_stockouts_count: 1, resilience_score: 92.4, risk_level: "LOW", avg_daily_footfall: 5900, chief_medical_officer: "Dr. Bhagwan Pawar" },
    { id: "DIST-023", name: "Bengaluru Urban", state: "Karnataka", lat: 12.9716, lng: 77.5946, total_phcs: 16, active_phcs: 16, population: 9621551, total_beds: 460, beds_occupied: 335, critical_stockouts_count: 0, resilience_score: 95.1, risk_level: "LOW", avg_daily_footfall: 6400, chief_medical_officer: "Dr. K. Srinivas" }
  ];
}

export async function fetchStates(): Promise<StateSummary[]> {
  try {
    const res = await fetch(`${API_BASE}/states`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Using fallback states:', e);
  }
  return [
    { id: "STATE-AP", name: "Andhra Pradesh", code: "AP", total_districts: 8, total_phcs: 114, active_phcs: 111, total_beds: 2750, beds_occupied: 2010, overall_resilience: 77.4, critical_alerts_count: 24, active_emergencies: 1 },
    { id: "STATE-TG", name: "Telangana", code: "TG", total_districts: 7, total_phcs: 98, active_phcs: 97, total_beds: 2340, beds_occupied: 1680, overall_resilience: 84.2, critical_alerts_count: 9, active_emergencies: 0 },
    { id: "STATE-MH", name: "Maharashtra", code: "MH", total_districts: 7, total_phcs: 102, active_phcs: 102, total_beds: 2510, beds_occupied: 1790, overall_resilience: 87.6, critical_alerts_count: 8, active_emergencies: 0 },
    { id: "STATE-KA", name: "Karnataka", code: "KA", total_districts: 6, total_phcs: 84, active_phcs: 84, total_beds: 2120, beds_occupied: 1530, overall_resilience: 88.1, critical_alerts_count: 6, active_emergencies: 0 },
    { id: "STATE-TN", name: "Tamil Nadu", code: "TN", total_districts: 5, total_phcs: 72, active_phcs: 72, total_beds: 1840, beds_occupied: 1350, overall_resilience: 89.4, critical_alerts_count: 5, active_emergencies: 0 },
    { id: "STATE-UP", name: "Uttar Pradesh", code: "UP", total_districts: 6, total_phcs: 88, active_phcs: 86, total_beds: 2260, beds_occupied: 1710, overall_resilience: 75.8, critical_alerts_count: 18, active_emergencies: 0 },
    { id: "STATE-OD", name: "Odisha", code: "OD", total_districts: 5, total_phcs: 68, active_phcs: 66, total_beds: 1720, beds_occupied: 1260, overall_resilience: 76.2, critical_alerts_count: 14, active_emergencies: 0 },
    { id: "STATE-KL", name: "Kerala", code: "KL", total_districts: 7, total_phcs: 70, active_phcs: 70, total_beds: 1890, beds_occupied: 1320, overall_resilience: 91.5, critical_alerts_count: 3, active_emergencies: 0 }
  ];
}

export async function fetchMedicines(category?: string, riskLevel?: string): Promise<Medicine[]> {
  try {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (riskLevel) params.set('risk_level', riskLevel);
    const res = await fetch(`${API_BASE}/medicines?${params.toString()}`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Using fallback medicines:', e);
  }
  return [
    { id: "MED-005", code: "NLEM-105", name: "Oral Rehydration Salts (ORS) WHO Formula", category: "IV Fluid", dosage_form: "Sachet", unit: "packets", essential_nlem: true, unit_cost: 8.0, current_stock: 1240, min_threshold: 1120, reorder_point: 2240, safety_stock: 840, daily_consumption_avg: 280, predicted_demand: 340, supplier_lead_time_days: 5, predicted_stockout_days: 3.2, risk_level: "CRITICAL", batch_number: "IN-BT-005-72", expiry_date: "2027-04-15", fefo_priority: "URGENT_DISPATCH" },
    { id: "MED-018", code: "NLEM-118", name: "Anti-Snake Venom (Polyvalent) Lyophilized", category: "Emergency", dosage_form: "Vial", unit: "vials", essential_nlem: true, unit_cost: 650.0, current_stock: 190, min_threshold: 72, reorder_point: 198, safety_stock: 54, daily_consumption_avg: 18, predicted_demand: 24, supplier_lead_time_days: 8, predicted_stockout_days: 2.9, risk_level: "CRITICAL", batch_number: "IN-BT-018-44", expiry_date: "2027-02-10", fefo_priority: "URGENT_DISPATCH" },
    { id: "MED-001", code: "NLEM-101", name: "Paracetamol 500mg Tablets", category: "Analgesic", dosage_form: "Tablet", unit: "strips", essential_nlem: true, unit_cost: 12.5, current_stock: 14200, min_threshold: 1800, reorder_point: 3150, safety_stock: 1350, daily_consumption_avg: 450, predicted_demand: 590, supplier_lead_time_days: 4, predicted_stockout_days: 3.6, risk_level: "HIGH", batch_number: "IN-BT-001-92", expiry_date: "2027-08-20", fefo_priority: "MONITOR" },
    { id: "MED-011", code: "NLEM-111", name: "Amoxicillin + Clavulanic Acid 625mg", category: "Antibiotic", dosage_form: "Tablet", unit: "strips", essential_nlem: true, unit_cost: 65.0, current_stock: 3600, min_threshold: 840, reorder_point: 1890, safety_stock: 630, daily_consumption_avg: 210, predicted_demand: 265, supplier_lead_time_days: 6, predicted_stockout_days: 6.8, risk_level: "HIGH", batch_number: "IN-BT-011-38", expiry_date: "2027-06-12", fefo_priority: "MONITOR" },
    { id: "MED-006", code: "NLEM-106", name: "Ringer Lactate (RL) 500ml IV", category: "IV Fluid", dosage_form: "Bottle", unit: "bottles", essential_nlem: true, unit_cost: 45.0, current_stock: 3100, min_threshold: 480, reorder_point: 960, safety_stock: 360, daily_consumption_avg: 120, predicted_demand: 155, supplier_lead_time_days: 5, predicted_stockout_days: 8.5, risk_level: "MEDIUM", batch_number: "IN-BT-006-15", expiry_date: "2027-11-30", fefo_priority: "NORMAL" }
  ];
}

export async function fetchDemandForecast(medId?: string, district?: string, horizon = '7d'): Promise<DemandForecast> {
  try {
    const params = new URLSearchParams();
    if (medId) params.set('medicine_id', medId);
    if (district) params.set('district_name', district);
    params.set('horizon', horizon);
    const res = await fetch(`${API_BASE}/forecast?${params.toString()}`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Using fallback forecast:', e);
  }
  return {
    medicine_id: medId || "MED-001",
    medicine_name: "Paracetamol 500mg Tablets",
    district_name: district || "Krishna",
    horizon: horizon as any,
    current_demand_rate: 450,
    predicted_demand_total: 4130,
    trend_pct: 31.0,
    confidence_score: 93.4,
    anomaly_detected: true,
    risk_level: "CRITICAL",
    points: [
      { date: "Day -6", historical: 430, predicted: 430, ci_lower: 395, ci_upper: 465 },
      { date: "Day -4", historical: 445, predicted: 445, ci_lower: 410, ci_upper: 480 },
      { date: "Day -2", historical: 480, predicted: 480, ci_lower: 440, ci_upper: 520 },
      { date: "Today", historical: 510, predicted: 510, ci_lower: 470, ci_upper: 550 },
      { date: "Day +1", historical: null, predicted: 545, ci_lower: 505, ci_upper: 585 },
      { date: "Day +2", historical: null, predicted: 578, ci_lower: 532, ci_upper: 624 },
      { date: "Day +3", historical: null, predicted: 610, ci_lower: 560, ci_upper: 660 },
      { date: "Day +5", historical: null, predicted: 642, ci_lower: 585, ci_upper: 700 },
      { date: "Day +7", historical: null, predicted: 668, ci_lower: 605, ci_upper: 730 }
    ],
    explanation_factors: {
      "Historical 6-Month Baseline": 32.0,
      "Monsoon Viral Fever Cluster": 28.0,
      "Patient Footfall Surge (+27%)": 21.0,
      "Cluster Shortages at Adjacent PHCs": 11.0,
      "Weather & Inundation Shock": 8.0
    },
    ai_summary: "Paracetamol demand in District Krishna is projected to increase 31% over the next 7 days. Driven by flood inundation waterlogging and an acute febrile illness cluster across 3 coastal blocks."
  };
}

export async function fetchStockoutPredictions(): Promise<StockoutPrediction[]> {
  try {
    const res = await fetch(`${API_BASE}/stockout-risk`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Using fallback stockout predictions:', e);
  }
  return [
    {
      id: "PRED-MED-005",
      medicine_id: "MED-005",
      medicine_name: "Oral Rehydration Salts (ORS) WHO Formula",
      category: "IV Fluid",
      district_name: "Krishna",
      phc_name: "Machilipatnam Coastal PHC",
      current_stock: 1240,
      avg_daily_demand: 280,
      predicted_daily_demand: 340,
      lead_time_days: 5,
      safety_stock: 840,
      reorder_point: 2240,
      predicted_stockout_days: 3.2,
      risk_level: "CRITICAL",
      stockout_date: "2027-04-15",
      ai_recommendation: "Redistribute 800 units from Guntur Central Warehouse or trigger emergency procurement."
    },
    {
      id: "PRED-MED-018",
      medicine_id: "MED-018",
      medicine_name: "Anti-Snake Venom (Polyvalent) Lyophilized",
      category: "Emergency",
      district_name: "Warangal",
      phc_name: "Hanamkonda Primary Clinic",
      current_stock: 190,
      avg_daily_demand: 18,
      predicted_daily_demand: 24,
      lead_time_days: 8,
      safety_stock: 54,
      reorder_point: 198,
      predicted_stockout_days: 2.9,
      risk_level: "CRITICAL",
      stockout_date: "2027-02-10",
      ai_recommendation: "Pre-position 60 vials from Hyderabad Osmania regional store within 12 hours."
    },
    {
      id: "PRED-MED-001",
      medicine_id: "MED-001",
      medicine_name: "Paracetamol 500mg Tablets",
      category: "Analgesic",
      district_name: "Krishna",
      phc_name: "Avanigadda Rural Hospital",
      current_stock: 14200,
      avg_daily_demand: 450,
      predicted_daily_demand: 590,
      lead_time_days: 4,
      safety_stock: 1350,
      reorder_point: 3150,
      predicted_stockout_days: 3.6,
      risk_level: "HIGH",
      stockout_date: "2027-08-20",
      ai_recommendation: "Lateral dispatch of 2,400 strips from Visakhapatnam Hub."
    }
  ];
}

export async function fetchRedistributions(): Promise<RedistributionRecommendation[]> {
  try {
    const res = await fetch(`${API_BASE}/redistribution`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Using fallback redistributions:', e);
  }
  return [
    {
      id: "REDIST-001",
      source_district: "Guntur",
      source_phc: "Guntur Medical College Central Depot",
      dest_district: "Krishna",
      dest_phc: "Machilipatnam Coastal PHC (PHC-0042)",
      medicine_name: "Oral Rehydration Salts (ORS) WHO Formula",
      quantity: 800,
      distance_km: 54.2,
      estimated_transit_hours: 1.8,
      urgency: "URGENT",
      source_excess_days: 18.4,
      dest_deficit_days: 2.8,
      expected_impact: "Prevents total stock-out in 42 hours; restores safety reserve to 12.5 days for 3,400 vulnerable outpatient beneficiaries.",
      ai_reasoning: "District A (Krishna) has projected ORS exhaustion in 2.8 days driven by 34% acute gastroenteritis footfall. District B (Guntur) holds 18.4 days excess stock with low local variance.",
      status: "PENDING",
      timestamp: "Today, 14:15 IST"
    },
    {
      id: "REDIST-002",
      source_district: "Visakhapatnam",
      source_phc: "King George Hospital Supply Store",
      dest_district: "East Godavari",
      dest_phc: "Kakinada Rural PHC",
      medicine_name: "Paracetamol 500mg Tablets",
      quantity: 2400,
      distance_km: 148.0,
      estimated_transit_hours: 3.5,
      urgency: "HIGH",
      source_excess_days: 24.0,
      dest_deficit_days: 3.1,
      expected_impact: "Eliminates antibiotic and antipyretic backlog across 3 sub-district primary health posts.",
      ai_reasoning: "Visakhapatnam regional hub received a large manufacturing batch; surplus exceeds 90th percentile safety band.",
      status: "APPROVED",
      timestamp: "Today, 11:30 IST"
    },
    {
      id: "REDIST-003",
      source_district: "Hyderabad",
      source_phc: "Osmania General Depot",
      dest_district: "Warangal",
      dest_phc: "Hanamkonda Primary Clinic",
      medicine_name: "Anti-Snake Venom (Polyvalent)",
      quantity: 60,
      distance_km: 142.5,
      estimated_transit_hours: 2.9,
      urgency: "URGENT",
      source_excess_days: 31.0,
      dest_deficit_days: 1.4,
      expected_impact: "Protects high-risk agricultural harvesting zone experiencing 40% surge in venom bites.",
      ai_reasoning: "Life-saving emergency serum stock in Warangal is at critical 1.4-day threshold. Hyderabad has buffer capacity.",
      status: "IN_TRANSIT",
      timestamp: "Today, 09:20 IST"
    }
  ];
}

export async function approveRedistribution(recId: string): Promise<any> {
  try {
    const res = await fetch(`${API_BASE}/redistribution/${recId}/approve`, { method: 'POST' });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Backend offline, simulated local approval:', e);
  }
  return { status: "success", id: recId, new_state: "APPROVED" };
}

export async function fetchEmergencies(): Promise<EmergencyScenario[]> {
  try {
    const res = await fetch(`${API_BASE}/emergencies`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Using fallback emergencies:', e);
  }
  return [
    {
      id: "EMERG-FLOOD-01",
      type: "FLOOD",
      title: "Monsoon River Inundation & Flash Flood Surge",
      description: "Simulated Krishna & Godavari delta flash floods across Krishna, East Godavari, and Guntur districts impacting 1.8M citizens.",
      severity: "TIER_3_CRITICAL",
      affected_districts: ["Krishna", "East Godavari", "Guntur"],
      patient_surge_pct: 42,
      medicine_requirement_surge_pct: 28,
      bed_requirement_delta: 620,
      critical_phcs_count: 17,
      recommended_transfers_count: 12,
      estimated_response_gap_pct: 8,
      priority_actions: [
        "Pre-position 10,000 sachets of ORS and 5,000 strips of Halazone water purification tablets at relief camps",
        "Deploy 6 amphibious mobile health units to inundated coastal riverbanks",
        "Trigger automated lateral inventory reallocation from inland Guntur warehouses",
        "Establish temporary 50-bed triage shelters at Machilipatnam and Avanigadda"
      ],
      activated: true
    },
    {
      id: "EMERG-OUTBREAK-02",
      type: "OUTBREAK",
      title: "Vector-Borne Dengue & Chikungunya Spike",
      description: "Rapid surge in acute febrile illnesses detected in high-density urban wards of Hyderabad and Rangareddy.",
      severity: "TIER_2",
      affected_districts: ["Hyderabad", "Rangareddy", "Medchal-Malkajgiri"],
      patient_surge_pct: 34,
      medicine_requirement_surge_pct: 22,
      bed_requirement_delta: 340,
      critical_phcs_count: 9,
      recommended_transfers_count: 7,
      estimated_response_gap_pct: 4,
      priority_actions: [
        "Expedite distribution of 2,500 Dengue NS1 rapid diagnostic test kits to urban primary clinics",
        "Mobilize 15 additional pediatric ward nurses to community health centres",
        "Reroute intravenous fluid supplies from state central repository"
      ],
      activated: false
    }
  ];
}

export async function toggleEmergencyMode(id: string): Promise<any> {
  try {
    const res = await fetch(`${API_BASE}/emergencies/${id}/toggle`, { method: 'POST' });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Backend offline, simulated emergency toggle:', e);
  }
  return { status: "success", id, activated: true };
}

export async function runSimulation(params: SimulationParams): Promise<SimulationResult> {
  try {
    const res = await fetch(`${API_BASE}/simulation/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Using fallback simulation calculation:', e);
  }
  return {
    scenario_name: `What-If Simulation (+${params.patient_demand_delta_pct}% Demand, -${params.supply_disruption_pct}% Supply)`,
    baseline: {
      daily_footfall: 138346,
      bed_occupancy_pct: 69.4,
      occupied_beds: 5852,
      critical_stockout_items: 3,
      critical_phcs: 4,
      staff_workload_ratio: 18.2,
      resilience_score: 82.4
    },
    projected: {
      daily_footfall: Math.round(138346 * (1 + params.patient_demand_delta_pct / 100)),
      bed_occupancy_pct: Math.min(98.5, 69.4 + params.patient_demand_delta_pct * 0.35),
      occupied_beds: Math.round(5852 * (1 + params.patient_demand_delta_pct * 0.007)),
      critical_stockout_items: Math.min(25, 3 + Math.round(params.patient_demand_delta_pct * 0.18 + params.supply_disruption_pct * 0.12)),
      critical_phcs: Math.min(60, 4 + Math.round(params.patient_demand_delta_pct * 0.35)),
      staff_workload_ratio: +(18.2 * (1 + params.patient_demand_delta_pct / 100) / Math.max(0.4, 1 - params.staff_shortage_pct / 100)).toFixed(1),
      resilience_score: Math.max(38.0, +(82.4 - params.patient_demand_delta_pct * 0.38 - params.supply_disruption_pct * 0.3).toFixed(1))
    },
    net_changes: {
      footfall_delta_pct: params.patient_demand_delta_pct,
      stockouts_increase: Math.round(params.patient_demand_delta_pct * 0.18 + params.supply_disruption_pct * 0.12),
      critical_phcs_delta: Math.round(params.patient_demand_delta_pct * 0.35)
    },
    critical_phcs_impacted: 17,
    additional_beds_needed: 620,
    expected_stockout_items: 11,
    recommended_transfers: [],
    recommended_interventions: [
      "Establish auxiliary emergency triage wings in high-occupancy community health centres.",
      "Authorize fast-track emergency local procurement vouchers for affected district officers.",
      "Re-route medicine convoys via national express corridors to circumvent local transit delays."
    ]
  };
}

export async function fetchFederatedStatus(): Promise<any> {
  try {
    const res = await fetch(`${API_BASE}/federated-learning`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Using fallback federated status:', e);
  }
  return {
    status: "OPERATIONAL",
    current_round: 18,
    latest_round: {
      round_number: 18,
      timestamp: "Today, 14:00 IST",
      participating_nodes: 1248,
      model_version: "Arogya-FedNet-v2.18",
      aggregation_loss: 0.19,
      accuracy_pct: 94.6,
      privacy_epsilon: 1.20,
      delta_improvement_pct: 1.2,
      data_transmitted_mb: 524.2,
      raw_data_shared: "0.00 KB (Zero Patient PII)"
    },
    total_enrolled_nodes: 1280,
    active_training_nodes: 1248,
    participation_rate_pct: 97.5,
    global_model_version: "Arogya-FedNet-v2.18",
    aggregation_algorithm: "Federated Averaging (FedAvg) + Differential Privacy (DP-SGD)",
    privacy_budget_epsilon: 1.20,
    differential_privacy_delta: "1e-5",
    raw_patient_data_shared: "0.00 KB (Zero Patient PII Transmitted)",
    local_training_framework: "TensorFlow Lite / PyTorch Edge Embedded",
    history: [
      { round_number: 1, timestamp: "7d ago", participating_nodes: 412, model_version: "v2.1", aggregation_loss: 1.48, accuracy_pct: 64.2, privacy_epsilon: 0.4, delta_improvement_pct: 0.0, data_transmitted_mb: 173.0, raw_data_shared: "0.00 KB" },
      { round_number: 6, timestamp: "5d ago", participating_nodes: 840, model_version: "v2.6", aggregation_loss: 0.84, accuracy_pct: 78.8, privacy_epsilon: 0.8, delta_improvement_pct: 7.3, data_transmitted_mb: 352.8, raw_data_shared: "0.00 KB" },
      { round_number: 12, timestamp: "3d ago", participating_nodes: 1140, model_version: "v2.12", aggregation_loss: 0.42, accuracy_pct: 87.9, privacy_epsilon: 1.0, delta_improvement_pct: 4.5, data_transmitted_mb: 478.8, raw_data_shared: "0.00 KB" },
      { round_number: 17, timestamp: "1d ago", participating_nodes: 1240, model_version: "v2.17", aggregation_loss: 0.24, accuracy_pct: 93.4, privacy_epsilon: 1.15, delta_improvement_pct: 2.2, data_transmitted_mb: 520.8, raw_data_shared: "0.00 KB" },
      { round_number: 18, timestamp: "Just now", participating_nodes: 1248, model_version: "v2.18", aggregation_loss: 0.19, accuracy_pct: 94.6, privacy_epsilon: 1.20, delta_improvement_pct: 1.2, data_transmitted_mb: 524.2, raw_data_shared: "0.00 KB" }
    ]
  };
}

export async function triggerFederatedRound(): Promise<FederatedRound> {
  try {
    const res = await fetch(`${API_BASE}/federated-learning/round`, { method: 'POST' });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Backend offline, simulated round trigger:', e);
  }
  return {
    round_number: 19,
    timestamp: "Just now",
    participating_nodes: 1254,
    model_version: "Arogya-FedNet-v2.19",
    aggregation_loss: 0.17,
    accuracy_pct: 95.1,
    privacy_epsilon: 1.25,
    delta_improvement_pct: 0.5,
    data_transmitted_mb: 528.4,
    raw_data_shared: "0.00 KB (Zero Patient PII)"
  };
}

export async function fetchAlerts(): Promise<AnomalyItem[]> {
  try {
    const res = await fetch(`${API_BASE}/alerts`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Using fallback alerts:', e);
  }
  return [
    {
      id: "ANOM-001",
      type: "SUDDEN_CONSUMPTION_SPIKE",
      phc_id: "PHC-0042",
      phc_name: "Machilipatnam Coastal PHC (Krishna)",
      district_name: "Krishna",
      metric: "Paracetamol 500mg Daily Consumption",
      normal_baseline: 450.0,
      current_value: 1665.0,
      deviation_multiplier: 3.7,
      severity: "CRITICAL",
      possible_causes: [
        "Localized viral fever / Dengue outbreak cluster reported in Ward 4 & 5",
        "Neighboring Sub-centre PHC-0043 stock-out causing patient diversion",
        "Unrecorded bulk dispatch or data reporting divergence"
      ],
      recommended_investigation: "Audit physical inventory ledger at Machilipatnam PHC; trigger emergency replenishment of 2,500 strips within 12 hours.",
      detected_at: "2 hours ago"
    },
    {
      id: "ANOM-002",
      type: "STOCKOUT_IMMINENT",
      phc_id: "PHC-0018",
      phc_name: "Avanigadda Rural Hospital (Krishna)",
      district_name: "Krishna",
      metric: "Oral Rehydration Salts (ORS) Inventory",
      normal_baseline: 1200.0,
      current_value: 180.0,
      deviation_multiplier: 0.15,
      severity: "CRITICAL",
      possible_causes: [
        "Diarrheal spike following river inundation",
        "Delayed regional delivery from Vijayawada depot"
      ],
      recommended_investigation: "Authorize immediate lateral transfer of 800 packets from Guntur Central Warehouse (Distance: 48 km).",
      detected_at: "3 hours ago"
    }
  ];
}

export async function fetchSupplyChain(): Promise<{ nodes: SupplyChainNode[]; edges: SupplyChainEdge[] }> {
  try {
    const res = await fetch(`${API_BASE}/supply-chain`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Using fallback supply chain graph:', e);
  }
  return {
    nodes: [
      { id: "HUB-NAT-01", name: "National Strategic Health Logistics Centre (Hyderabad)", type: "CENTRAL_HUB", lat: 17.3850, lng: 78.4867, district: "Hyderabad", capacity: 1000000, utilization_pct: 72, stock_health: "HEALTHY", inventory_count: 720000 },
      { id: "HUB-STATE-01", name: "Andhra Pradesh Central Medical Depot (Vijayawada)", type: "STATE_DEPOT", lat: 16.5062, lng: 80.6480, district: "Krishna", capacity: 150000, utilization_pct: 84, stock_health: "HEALTHY", inventory_count: 126000 },
      { id: "STORE-DIST-001", name: "Krishna District Drug Warehouse", type: "DISTRICT_STORE", lat: 16.1907, lng: 81.1394, district: "Krishna", capacity: 35000, utilization_pct: 92, stock_health: "VULNERABLE", inventory_count: 32200 },
      { id: "STORE-DIST-002", name: "Guntur District Drug Warehouse", type: "DISTRICT_STORE", lat: 16.3067, lng: 80.4365, district: "Guntur", capacity: 35000, utilization_pct: 68, stock_health: "HEALTHY", inventory_count: 23800 },
      { id: "PHC-0042", name: "Machilipatnam Coastal PHC", type: "PHC", lat: 16.1800, lng: 81.1300, district: "Krishna", capacity: 5000, utilization_pct: 96, stock_health: "VULNERABLE", inventory_count: 4800 }
    ],
    edges: [
      { id: "ROUTE-01", source_id: "HUB-NAT-01", target_id: "HUB-STATE-01", distance_km: 275.0, transit_time_hours: 5.5, risk_level: "LOW", status: "ACTIVE", route_name: "Corridor NH-65 (Hyderabad -> Vijayawada)" },
      { id: "ROUTE-02", source_id: "HUB-STATE-01", target_id: "STORE-DIST-001", distance_km: 68.0, transit_time_hours: 2.2, risk_level: "HIGH", status: "CONGESTED", route_name: "Corridor NH-216 (Flood Risk Choke Point)" },
      { id: "ROUTE-03", source_id: "STORE-DIST-002", target_id: "STORE-DIST-001", distance_km: 54.0, transit_time_hours: 1.8, risk_level: "LOW", status: "ACTIVE", route_name: "Lateral Transfer Arterial Link (Guntur -> Krishna)" },
      { id: "ROUTE-04", source_id: "STORE-DIST-001", target_id: "PHC-0042", distance_km: 18.0, transit_time_hours: 0.6, risk_level: "HIGH", status: "ACTIVE", route_name: "Coastal Access Road (Machilipatnam)" }
    ]
  };
}

export async function fetchResilienceScore(): Promise<ResilienceScore> {
  try {
    const res = await fetch(`${API_BASE}/resilience`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Using fallback resilience score:', e);
  }
  return {
    overall_index: 82.4,
    status: "STABLE",
    components: [
      { name: "Inventory Stability Index", score: 79.2, weight: 0.20, status: "HEALTHY", description: "Average days-of-stock across 104 NLEM essential medicines" },
      { name: "Demand Volatility Buffer", score: 74.5, weight: 0.15, status: "MODERATE", description: "Variance resistance against acute infectious surges" },
      { name: "Supply Lead-Time Reliability", score: 81.0, weight: 0.15, status: "HEALTHY", description: "On-time delivery performance from central & state depots" },
      { name: "Personnel & Attendance Coverage", score: 88.4, weight: 0.15, status: "HEALTHY", description: "Duty roster coverage of medical officers, nurses & pharmacists" },
      { name: "Bed Capacity & ICU Surge Reserve", score: 76.8, weight: 0.15, status: "MODERATE", description: "Oxygen, ventilator & emergency bed availability buffer" },
      { name: "Transport & Route Reliability", score: 83.0, weight: 0.10, status: "HEALTHY", description: "Expressway logistics clearance and transit detour latency" },
      { name: "Emergency Response Readiness", score: 89.5, weight: 0.10, status: "EXCELLENT", description: "Automated triage plan readiness and pre-positioned contingency kits" }
    ],
    disclaimer: "Prototype decision-support resilience index based on synthetic healthcare telemetry."
  };
}

export async function fetchAuditLogs(): Promise<AuditLog[]> {
  try {
    const res = await fetch(`${API_BASE}/audit-logs`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Using fallback audit logs:', e);
  }
  return [
    { id: "AUDIT-0001", timestamp: "Today, 14:10 IST", user_name: "Dr. Arvind Sharma", role: "National Health Administrator", action: "APPROVED_REDISTRIBUTION", resource: "REDIST-002: 2,400 Paracetamol strips Visakhapatnam -> East Godavari", previous_state: "PENDING", new_state: "APPROVED", ip_address: "10.0.1.45", status: "SUCCESS" },
    { id: "AUDIT-0002", timestamp: "Today, 13:45 IST", user_name: "P. Lakshmi", role: "Emergency Response Coordinator", action: "ACTIVATED_EMERGENCY_MODE", resource: "EMERG-FLOOD-01: Krishna & Godavari Delta Flood Scenario", previous_state: "INACTIVE", new_state: "ACTIVE_TIER_3", ip_address: "10.0.2.19", status: "SUCCESS" },
    { id: "AUDIT-0003", timestamp: "Today, 12:20 IST", user_name: "System AI Agent", role: "Federated Engine", action: "FEDERATED_AGGREGATION_ROUND", resource: "Round #18: Aggregated gradients across 1,248 nodes", previous_state: "Round #17", new_state: "Round #18", ip_address: "10.0.0.1", status: "SUCCESS" }
  ];
}

export async function askCopilot(query: string, language: Language = 'en', role: Role = 'National Health Administrator'): Promise<CopilotResponse> {
  try {
    const res = await fetch(`${API_BASE}/copilot/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, language, role })
    });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Using fallback copilot responses:', e);
  }

  // Fallback intelligent answer
  return {
    answer: `Analysis for "${query}": Based on federated telemetry across 691 PHCs, District Krishna is under Critical alert with 3.2 days remaining for ORS. Recommended action is approving the pending transfer from Guntur Central Depot.`,
    language: language,
    supporting_metrics: [
      { label: "Critical District", value: "Krishna (AP)", badge: "CRITICAL" },
      { label: "Depletion Window", value: "3.2 Days", badge: "URGENT" },
      { label: "Surplus Source", value: "Guntur (+18.4d)", badge: "HEALTHY" }
    ],
    recommended_actions: [
      "Approve lateral transfer REDIST-001 (800 units ORS)",
      "Activate flood response contingency roster"
    ],
    suggested_followups: [
      "Why is District Krishna showing high risk?",
      "What medicines may run out within 72 hours?",
      "Simulate a 40% patient surge"
    ],
    explanation: "Calculated by multi-factor regression considering rainfall gauge, footfall trends, and inventory balance."
  };
}

export async function fetchSituationReport(): Promise<any> {
  try {
    const res = await fetch(`${API_BASE}/reports/situation-report`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Using fallback report:', e);
  }
  return {
    title: "National Health Resilience Situation Report",
    generated_at: new Date().toISOString(),
    national_resilience_index: 82.4,
    total_phcs: 694,
    critical_phcs_count: 4,
    critical_medicines_count: 3,
    active_emergencies: 1,
    markdown: `# NATIONAL HEALTH RESILIENCE SITUATION REPORT\nArogyaGrid AI - Offline Backup Report`
  };
}

// ============================================================
// NEXT-GENERATION API CALLERS
// ============================================================

export async function fetchBrainSignals(): Promise<ResilienceBrainSignal[]> {
  try {
    const res = await fetch(`${API_BASE}/brain/signals`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Using fallback brain signals:', e);
  }
  return [
    {
      id: "SIG-01",
      category: "INVENTORY",
      stage: "RISK_DETECTION",
      title: "ORS Buffer Critical Depletion Imminent",
      observation: "Frontline stock decreased by 42% over past 48 hours in coastal belt.",
      prediction: "Days-to-depletion stands at 2.4 days against 14-day statutory reserve.",
      risk_score: 88.5,
      opportunity: "Immediate lateral transfer from inland surplus depot in Guntur (+18.4d buffer).",
      recommended_action: "Execute REDIST-001 (800 units ORS) with GPS tracking clearance.",
      confidence: 96.4,
      timestamp: "Just now"
    },
    {
      id: "SIG-02",
      category: "WEATHER",
      stage: "AI_ANALYSIS",
      title: "Monsoon Inundation Along NH-216 Logistics Corridor",
      observation: "Rainfall gauge at Machilipatnam recorded 142mm precipitation in 24 hours.",
      prediction: "Transit delays projected to increase by 2.2 hours for medical supply trucks.",
      risk_score: 74.0,
      opportunity: "Reroute pharmaceutical logistics via elevated State Highway 42.",
      recommended_action: "Issue alternative route clearance and notify dispatch command.",
      confidence: 91.0,
      timestamp: "2 mins ago"
    },
    {
      id: "SIG-03",
      category: "DEMAND",
      stage: "FORECAST",
      title: "Acute Gastroenteritis Outpatient Surge Vector",
      observation: "OPD footfall +34% above seasonal baseline in Krishna delta clinics.",
      prediction: "Expected 7-day cumulative outpatient demand will reach 4,820 patients.",
      risk_score: 82.0,
      opportunity: "Pre-position 5,000 sachets of ORS and IV fluids at community health posts.",
      recommended_action: "Activate rapid replenishment playbook and auxiliary triage tents.",
      confidence: 94.8,
      timestamp: "5 mins ago"
    },
    {
      id: "SIG-04",
      category: "LOGISTICS",
      stage: "OPTIMIZATION",
      title: "Cross-District Lateral Equilibrium Solver",
      observation: "Guntur depot holds 28 days of Paracetamol and ORS safety stock.",
      prediction: "Redistributing 850 units will drop Guntur to 21 days (still above 14d safety threshold).",
      risk_score: 22.0,
      opportunity: "Zero procurement cost; solves Krishna deficit within 6.5 hours transit.",
      recommended_action: "Approve lateral reallocation plan under Human-in-the-Loop review.",
      confidence: 97.2,
      timestamp: "8 mins ago"
    }
  ];
}

export async function fetchAutonomousAgents(): Promise<AutonomousAgent[]> {
  try {
    const res = await fetch(`${API_BASE}/agents`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Using fallback autonomous agents:', e);
  }
  return [
    {
      id: "AGENT-01",
      name: "Demand Forecast Agent",
      role: "Epidemiological & Outpatient Influx Forecaster",
      status: "ACTIVE",
      current_task: "Simulating 7-day multi-horizon vector demand across 51 districts",
      last_execution: "12s ago",
      confidence: 95.4,
      detected_issues: 3,
      recommendations_count: 8,
      avatar_color: "cyan",
      activity_log: [
        "Detected +31.0% Paracetamol demand divergence in District Krishna",
        "Aggregated weekly trend factors from 14 coastal community clinics",
        "Published updated 95% Confidence Interval band to Central Bus"
      ]
    },
    {
      id: "AGENT-02",
      name: "Inventory Intelligence Agent",
      role: "FEFO, Buffer Depletion & Safety Stock Sentinel",
      status: "ACTIVE",
      current_task: "Calculating days-to-zero stock levels for 104 NLEM medicines",
      last_execution: "24s ago",
      confidence: 96.8,
      detected_issues: 3,
      recommendations_count: 12,
      avatar_color: "emerald",
      activity_log: [
        "Flagged ORS depletion risk at 3.2 days in Machilipatnam",
        "Audited FEFO batch IN-BT-005-72 nearing 65-day threshold",
        "Synced reserve buffers with Central Warehouse ledger"
      ]
    },
    {
      id: "AGENT-03",
      name: "Supply Chain Logistics Agent",
      role: "Transit Route Clearance & Corridor Velocity Analyzer",
      status: "ACTIVE",
      current_task: "Monitoring GPS carrier vehicle telematics and arterial chokes",
      last_execution: "38s ago",
      confidence: 91.2,
      detected_issues: 2,
      recommendations_count: 4,
      avatar_color: "sky",
      activity_log: [
        "Alerted on waterlogging delay along NH-216 (+2.2 hours detour)",
        "Identified surplus inventory depot at Guntur (+18.4 days excess)",
        "Verified arterial highway clearance via State Highway 42"
      ]
    },
    {
      id: "AGENT-04",
      name: "Emergency Response Agent",
      role: "Disaster Impact & Surge Triage Coordinator",
      status: "ALERT",
      current_task: "Orchestrating flood contingency protocol in Krishna River basin",
      last_execution: "45s ago",
      confidence: 93.5,
      detected_issues: 4,
      recommendations_count: 6,
      avatar_color: "amber",
      activity_log: [
        "Triggered Flood Scenario response matrix in sub-division",
        "Calculated bed surge deficit (620 acute beds required)",
        "Issued contingency mobilization alert to district health officer"
      ]
    },
    {
      id: "AGENT-05",
      name: "Workforce & Personnel Agent",
      role: "Roster Coverage & Shift Burnout Balancer",
      status: "ACTIVE",
      current_task: "Balancing clinical officer attendance across 694 primary health clinics",
      last_execution: "1m ago",
      confidence: 94.0,
      detected_issues: 1,
      recommendations_count: 3,
      avatar_color: "indigo",
      activity_log: [
        "Verified 92.8% state-wide doctor attendance check-in",
        "Recommended 2 auxiliary nurse deployments to coastal outreach posts"
      ]
    },
    {
      id: "AGENT-06",
      name: "Anomaly Detection Agent",
      role: "Z-Score Statistical Deviation & Sensor Outlier Sentinel",
      status: "ACTIVE",
      current_task: "Running real-time streaming Z-score anomaly scans on medicine issues",
      last_execution: "15s ago",
      confidence: 98.1,
      detected_issues: 2,
      recommendations_count: 2,
      avatar_color: "rose",
      activity_log: [
        "Flagged anomalous 3.4x consumption spike in ORS sachets",
        "Filtered 4 sensor packet transmission glitches from raw stream"
      ]
    },
    {
      id: "AGENT-07",
      name: "Optimization Agent",
      role: "Integer Linear Programming (ILP) Redistribution Solver",
      status: "ACTIVE",
      current_task: "Solving multi-commodity transshipment network flow equations",
      last_execution: "30s ago",
      confidence: 97.4,
      detected_issues: 0,
      recommendations_count: 5,
      avatar_color: "teal",
      activity_log: [
        "Generated Pareto-optimal transfer plan: Guntur -> Krishna (800 units)",
        "Minimized overall network ton-km logistics cost by 18.2%"
      ]
    },
    {
      id: "AGENT-08",
      name: "Report Generation Agent",
      role: "Automated SITREP & Multilingual Briefing Synthesizer",
      status: "IDLE",
      current_task: "Assembling Morning Health Intelligence Briefing & Executive Summary",
      last_execution: "3m ago",
      confidence: 98.9,
      detected_issues: 0,
      recommendations_count: 1,
      avatar_color: "violet",
      activity_log: [
        "Synthesized 12-page comprehensive Situation Report",
        "Published multi-lingual executive briefs in English, Hindi, and Telugu"
      ]
    },
    {
      id: "AGENT-09",
      name: "Data Quality Agent",
      role: "Telemetry Cleansing & Sensor Integrity Guardian",
      status: "ACTIVE",
      current_task: "Validating cold-chain temperature telemetry and missing records",
      last_execution: "18s ago",
      confidence: 99.2,
      detected_issues: 0,
      recommendations_count: 1,
      avatar_color: "emerald",
      activity_log: [
        "Validated 145,800 telemetry packets with 98.4% data health score",
        "Deduplicated 3 double-submitted dispensing records"
      ]
    },
    {
      id: "AGENT-10",
      name: "Arogya Copilot Agent",
      role: "Multilingual Conversational Natural Language Engine",
      status: "ACTIVE",
      current_task: "Standing by for user voice & text queries with live semantic RAG",
      last_execution: "Now",
      confidence: 96.5,
      detected_issues: 0,
      recommendations_count: 4,
      avatar_color: "purple",
      activity_log: [
        "Armed with 694 PHC metrics, live inventory, and simulation sandbox",
        "Speech synthesis active in English, Hindi, and Telugu"
      ]
    }
  ];
}

export async function fetchAgentCollaboration(): Promise<AgentCollaborationMessage[]> {
  try {
    const res = await fetch(`${API_BASE}/agents/collaboration`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Using fallback agent collaboration:', e);
  }
  return [
    {
      id: "MSG-01",
      sender_agent: "Demand Forecast Agent",
      timestamp: "10:14:02 IST",
      content: "District Krishna outpatient demand projected to increase by +32.0% over the next 7 days due to waterborne diarrheal cluster.",
      sentiment: "ALERT",
      affected_resource: "Oral Rehydration Salts (ORS) & Paracetamol",
      priority: "HIGH"
    },
    {
      id: "MSG-02",
      sender_agent: "Inventory Intelligence Agent",
      timestamp: "10:14:18 IST",
      content: "Current on-hand inventory in Machilipatnam Coastal PHC will deplete in 3.1 days under this demand surge.",
      sentiment: "ALERT",
      affected_resource: "ORS WHO Formula (420 boxes remaining)",
      priority: "CRITICAL"
    },
    {
      id: "MSG-03",
      sender_agent: "Supply Chain Logistics Agent",
      timestamp: "10:14:35 IST",
      content: "Nearest verified surplus warehouse is Guntur Central Medical Depot (Distance: 68km, Buffer: +18.4 days excess).",
      sentiment: "INFO",
      affected_resource: "Guntur State Warehouse Depot-02",
      priority: "MEDIUM"
    },
    {
      id: "MSG-04",
      sender_agent: "Optimization Agent",
      timestamp: "10:14:50 IST",
      content: "ILP solver calculated optimal transfer: Reallocate 750 units ORS from Guntur to Krishna. Transit time: 6.5 hours via SH-42 detour.",
      sentiment: "PROPOSAL",
      affected_resource: "Lateral Route GNT-KRI-42",
      priority: "HIGH"
    },
    {
      id: "MSG-05",
      sender_agent: "Emergency Response Agent",
      timestamp: "10:15:05 IST",
      content: "Concurred. District Krishna is designated Priority Level-4 due to localized river flooding. Fast-track approval requested.",
      sentiment: "CONSENSUS",
      affected_resource: "Emergency Contingency Corridor",
      priority: "CRITICAL"
    }
  ];
}

export async function runCascadeSimulation(trigger = "Warehouse failure"): Promise<CascadeSimulationResult> {
  try {
    const res = await fetch(`${API_BASE}/simulation/cascade?trigger_scenario=${encodeURIComponent(trigger)}`, {
      method: 'POST'
    });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Using fallback cascade simulation:', e);
  }
  return {
    trigger_event: trigger,
    root_cause_facility: "Guntur Regional Pharmaceutical Warehouse (WH-02)",
    primary_impacts: [
      {
        id: "PRIM-01",
        name: "Central Inbound Supply Disruption",
        level: "PRIMARY",
        status: "FAILED",
        impact_description: "Automated warehouse racking and power grid outage halted bulk outbound loading docks.",
        affected_metric: "Outbound Dispatch Throughput",
        delay_or_deficit: "-85% Shipments (4,200 crates held)"
      },
      {
        id: "PRIM-02",
        name: "Regional Cold-Chain Interruption",
        level: "PRIMARY",
        status: "DEGRADED",
        impact_description: "Secondary cooling generator kicked in with 18 hours reserve fuel remaining.",
        affected_metric: "Cold-Chain Vaccine Buffer",
        delay_or_deficit: "18h Critical Fuel Horizon"
      }
    ],
    secondary_impacts: [
      {
        id: "SEC-01",
        name: "District Inventory Starvation (Krishna & Prakasam)",
        level: "SECONDARY",
        status: "AT_RISK",
        impact_description: "Daily replenishment convoys cancelled; 42 district clinics forced onto local safety stocks.",
        affected_metric: "Days of Supply on Hand",
        delay_or_deficit: "Dropped from 14.0d to 4.2d"
      },
      {
        id: "SEC-02",
        name: "Emergency Stock Squeeze in Tertiary Facilities",
        level: "SECONDARY",
        status: "AT_RISK",
        impact_description: "General hospital dispensaries absorbing unrouted primary clinic prescriptions.",
        affected_metric: "OPD Prescription Fulfillment Rate",
        delay_or_deficit: "-22% Fulfillment Speed"
      }
    ],
    tertiary_impacts: [
      {
        id: "TERT-01",
        name: "Frontline Patient Service Saturation",
        level: "TERTIARY",
        status: "DEGRADED",
        impact_description: "Patients visiting multiple PHCs seeking ORS and antibiotics; footfall overcrowding triage areas.",
        affected_metric: "Average Outpatient Wait Times",
        delay_or_deficit: "+85 Minutes per Consultation"
      },
      {
        id: "TERT-02",
        name: "Cascading Emergency Bed Saturation",
        level: "TERTIARY",
        status: "FAILED",
        impact_description: "Delayed oral medication triggers increased intravenous hydration and overnight observation admissions.",
        affected_metric: "Observation Bed Occupancy",
        delay_or_deficit: "96.4% Occupancy (Saturation Alert)"
      }
    ],
    total_facilities_vulnerable: 64,
    estimated_population_impacted: 485000,
    containment_actions: [
      "Bypass Guntur warehouse by directly routing consignments from Hyderabad Central Reserve Depot",
      "Authorize lateral inter-district swaps between East Godavari and Krishna",
      "Deploy 4 mobile emergency medical dispensing vans to high-footfall coastal clinics"
    ]
  };
}

export async function fetchEarlyWarnings(): Promise<EarlyWarningItem[]> {
  try {
    const res = await fetch(`${API_BASE}/early-warnings`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Using fallback early warnings:', e);
  }
  return [
    {
      id: "WARN-01",
      level: 4,
      level_name: "CRITICAL",
      category: "MEDICINE_SHORTAGE",
      facility_or_district: "Machilipatnam Coastal PHC (Krishna)",
      metric_name: "ORS Statutory Safety Reserve",
      current_value: "2.4 Days on Hand",
      threshold_value: "14 Days Statutory Buffer",
      horizon_hours: 48,
      confidence: 96.5,
      evolution_trend: "INCREASING",
      mitigation_action: "Execute Lateral Transfer REDIST-001 from Guntur Depot via SH-42"
    },
    {
      id: "WARN-02",
      level: 3,
      level_name: "HIGH_RISK",
      category: "BED_SATURATION",
      facility_or_district: "Guntur Urban Community Hospital",
      metric_name: "ICU & Oxygen Bed Occupancy",
      current_value: "92.4% Occupancy",
      threshold_value: "80.0% Warning Trigger",
      horizon_hours: 72,
      confidence: 91.0,
      evolution_trend: "INCREASING",
      mitigation_action: "Activate 15 auxiliary surge beds and triage mild admissions to sub-centre"
    },
    {
      id: "WARN-03",
      level: 2,
      level_name: "WARNING",
      category: "COLD_CHAIN_TEMPERATURE",
      facility_or_district: "Bhadradri Tribal PHC Vaccine Cold Box",
      metric_name: "ILR Internal Chamber Temperature",
      current_value: "7.4 °C",
      threshold_value: "8.0 °C Upper Breach Limit",
      horizon_hours: 12,
      confidence: 94.2,
      evolution_trend: "STABLE",
      mitigation_action: "Inspect backup generator inverter and transfer doses to secondary cold box"
    },
    {
      id: "WARN-04",
      level: 1,
      level_name: "WATCH",
      category: "STAFFING_GAP",
      facility_or_district: "Avanigadda Rural Hospital",
      metric_name: "Night Shift Clinical Coverage",
      current_value: "1 Medical Officer Present",
      threshold_value: "2 Minimum Required",
      horizon_hours: 24,
      confidence: 88.0,
      evolution_trend: "STABLE",
      mitigation_action: "Mobilize auxiliary duty doctor from sub-divisional hospital"
    }
  ];
}

export async function fetchSmartProcurement(): Promise<SmartProcurementItem[]> {
  try {
    const res = await fetch(`${API_BASE}/procurement/recommendations`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Using fallback smart procurement:', e);
  }
  return [
    {
      id: "PROC-01",
      medicine_code: "NLEM-005",
      medicine_name: "Oral Rehydration Salts (ORS) WHO Formula",
      current_stock: 420,
      reorder_point: 850,
      safety_stock: 600,
      economic_order_qty: 12500,
      supplier_lead_time_days: 5,
      urgency: "HIGH",
      projected_demand_30d: 9400,
      estimated_cost_inr: 187500.0,
      preferred_supplier: "Bharat Serum & Vaccines Logistics",
      ai_rationale: "Projected monsoon surge will deplete reserves within 2.4 days. Lead time is 5 days, requiring immediate EOQ purchase order."
    },
    {
      id: "PROC-02",
      medicine_code: "NLEM-001",
      medicine_name: "Paracetamol 500mg Tablets",
      current_stock: 1200,
      reorder_point: 2400,
      safety_stock: 1800,
      economic_order_qty: 25000,
      supplier_lead_time_days: 4,
      urgency: "HIGH",
      projected_demand_30d: 22000,
      estimated_cost_inr: 87500.0,
      preferred_supplier: "Andhra Medical Supplies Corp (AMSC)",
      ai_rationale: "Demand pace +31% due to seasonal pyrexia. Reorder trigger breached."
    },
    {
      id: "PROC-03",
      medicine_code: "NLEM-012",
      medicine_name: "Amoxicillin 500mg Capsules",
      current_stock: 850,
      reorder_point: 1100,
      safety_stock: 900,
      economic_order_qty: 8000,
      supplier_lead_time_days: 6,
      urgency: "MEDIUM",
      projected_demand_30d: 6500,
      estimated_cost_inr: 120000.0,
      preferred_supplier: "Hindustan Antibiotics Ltd",
      ai_rationale: "Steady consumption with moderate lead-time variability. Standard replenishment cycle."
    }
  ];
}

export async function fetchSuppliers(): Promise<SupplierProfile[]> {
  try {
    const res = await fetch(`${API_BASE}/suppliers`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Using fallback suppliers:', e);
  }
  return [
    {
      id: "SUP-01",
      name: "Andhra Medical Supplies Corporation (AMSC)",
      tier: "PRIMARY",
      delivery_reliability_pct: 94.8,
      average_delay_days: 0.8,
      order_fulfillment_pct: 98.2,
      lead_time_days: 4,
      risk_level: "LOW",
      active_contracts: 12,
      specialty_catalog: ["Essential NLEM Tablets", "Oral Rehydration Solutions", "Analgesics"]
    },
    {
      id: "SUP-02",
      name: "Bharat Serum & Vaccines Logistics",
      tier: "PRIMARY",
      delivery_reliability_pct: 96.5,
      average_delay_days: 0.4,
      order_fulfillment_pct: 99.1,
      lead_time_days: 3,
      risk_level: "LOW",
      active_contracts: 8,
      specialty_catalog: ["Cold-Chain Vaccines", "Anti-Snake Venom", "Insulin Preparations"]
    },
    {
      id: "SUP-03",
      name: "Coastal Pharma Transporters Ltd",
      tier: "SECONDARY",
      delivery_reliability_pct: 82.0,
      average_delay_days: 2.4,
      order_fulfillment_pct: 88.5,
      lead_time_days: 7,
      risk_level: "HIGH",
      active_contracts: 4,
      specialty_catalog: ["Heavy Infusions (RL/NS)", "Disinfectants", "Surgical Gloves"]
    }
  ];
}

export async function fetchAlternativeRoutes(): Promise<AlternativeRoute[]> {
  try {
    const res = await fetch(`${API_BASE}/routes/alternatives`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Using fallback alternative routes:', e);
  }
  return [
    {
      id: "ROUTE-ALT-01",
      origin: "Guntur Central Medical Depot",
      destination: "Machilipatnam Coastal PHC",
      primary_route_name: "National Highway 216 Coastal Highway",
      primary_route_status: "WATERLOGGED",
      alt_route_name: "State Highway 42 Bypass via Tenali & Gudivada",
      alt_distance_km: 84.5,
      alt_delivery_time_delta_hrs: 2.2,
      alt_capacity_status: "CLEAR_FOR_HEAVY_TRUCKS",
      risk_index: 18.0
    },
    {
      id: "ROUTE-ALT-02",
      origin: "Hyderabad Central Medical Store",
      destination: "Khammam District Hospital",
      primary_route_name: "NH-65 Expressway",
      primary_route_status: "OPERATIONAL",
      alt_route_name: "Suryapet State Road Link",
      alt_distance_km: 198.0,
      alt_delivery_time_delta_hrs: 0.8,
      alt_capacity_status: "OPERATIONAL",
      risk_index: 12.0
    }
  ];
}

export async function fetchSwapMarket(): Promise<SwapMarketOffer[]> {
  try {
    const res = await fetch(`${API_BASE}/swap-market`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Using fallback swap market:', e);
  }
  return [
    {
      id: "SWAP-01",
      district_name: "Guntur",
      phc_name: "Guntur Central Medical Depot",
      type: "SURPLUS",
      medicine_name: "Oral Rehydration Salts (ORS) WHO Formula",
      quantity: 1200,
      days_buffer: 28.5,
      urgency: "LOW",
      compatibility_score: 98.5,
      matched_district: "Krishna",
      status: "MATCHED"
    },
    {
      id: "SWAP-02",
      district_name: "Krishna",
      phc_name: "Machilipatnam Coastal PHC",
      type: "NEED",
      medicine_name: "Oral Rehydration Salts (ORS) WHO Formula",
      quantity: 800,
      days_buffer: 3.2,
      urgency: "URGENT",
      compatibility_score: 98.5,
      matched_district: "Guntur",
      status: "MATCHED"
    },
    {
      id: "SWAP-03",
      district_name: "Visakhapatnam",
      phc_name: "King George Hospital Supply Store",
      type: "SURPLUS",
      medicine_name: "Paracetamol 500mg Tablets",
      quantity: 5000,
      days_buffer: 24.0,
      urgency: "LOW",
      compatibility_score: 94.0,
      matched_district: "East Godavari",
      status: "OPEN"
    }
  ];
}

export async function approveSwapOffer(offerId: string): Promise<any> {
  try {
    const res = await fetch(`${API_BASE}/swap-market/${offerId}/approve`, { method: 'POST' });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Using fallback approve swap offer:', e);
  }
  return {
    status: "APPROVED",
    offer_id: offerId,
    message: `Resource transfer for offer ${offerId} authorized by Administrator.`,
    timestamp: "Just now",
    audit_tx: `TX-SWAP-${offerId}-8492`
  };
}

export async function fetchPlaybooks(): Promise<EmergencyPlaybook[]> {
  try {
    const res = await fetch(`${API_BASE}/playbooks`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Using fallback playbooks:', e);
  }
  return [
    {
      id: "PLAY-01",
      disaster_type: "FLOOD",
      title: "Monsoon River Flash Inundation Protocol",
      trigger_criteria: "River water level > Danger Mark + 10-day rainfall exceeding 300mm",
      immediate_actions: [
        "Deploy 6 amphibious boat health clinics along river delta",
        "Pre-position 10,000 sachets of ORS and 5,000 water purification tablets",
        "Erect auxiliary 50-bed triage tents on elevated school grounds",
        "Activate lateral stock transfers from inland Guntur warehouses"
      ],
      priority_phcs: ["Machilipatnam Coastal PHC", "Avanigadda Rural Hospital", "Nagayalanka Primary Clinic"],
      resource_requirements: {
        "ORS Packets": "15,000",
        "IV Fluids (RL/NS)": "5,000 bottles",
        "Halazone Water Tablets": "20,000 strips",
        "Mobile Triage Tents": "6 units"
      },
      recovery_milestones: [
        "Recede water gauge below alert threshold",
        "Clear 100% gastrointestinal outpatient surge backlog",
        "Replenish frontline safety stock to 14 days",
        "Restore permanent power grid and demobilize diesel generators"
      ],
      active_phase: "RESPONSE"
    },
    {
      id: "PLAY-02",
      disaster_type: "OUTBREAK",
      title: "Vector-Borne Dengue & Acute Febrile Illness Surge",
      trigger_criteria: "Local fever test positivity > 18% in high-density urban wards",
      immediate_actions: [
        "Expedite distribution of 2,500 Dengue NS1 rapid diagnostic test kits",
        "Mobilize 15 pediatric nursing officers to community health centres",
        "Reroute intravenous fluid supplies from state central repository"
      ],
      priority_phcs: ["Hyderabad Urban Health Centre", "Charminar Dispensary", "Secunderabad Community Hospital"],
      resource_requirements: {
        "Dengue NS1 Antigen Kits": "3,000",
        "Paracetamol 500mg": "25,000 strips",
        "Platelet Infusion Sets": "800 sets"
      },
      recovery_milestones: [
        "Test positivity drops below 5%",
        "Zero ICU mortality from hemorrhagic shock",
        "Restock rapid diagnostic test kits to 30-day baseline"
      ],
      active_phase: "INACTIVE"
    },
    {
      id: "PLAY-03",
      disaster_type: "CYCLONE",
      title: "Severe Coastal Storm & Windstorm Disruption Protocol",
      trigger_criteria: "IMD Category-3 cyclone alert landfall projection < 48 hours",
      immediate_actions: [
        "Inspect diesel fuel reserves at all 26 coastal PHCs (Minimum 72 hours fuel)",
        "Secure emergency trauma kits and cold-chain vaccines in reinforced shelters",
        "Activate satellite communication telemetry fallback"
      ],
      priority_phcs: ["Puri Beach Primary Health Post", "Ganjam Coastal CHC", "Visakhapatnam Harbor Clinic"],
      resource_requirements: {
        "Emergency Trauma Kits": "1,200",
        "Surgical Sutures & Gloves": "10,000 pairs",
        "Generator Diesel Reserve": "15,000 Litres"
      },
      recovery_milestones: [
        "Structural safety clearance of all PHC buildings",
        "Reconnection of optical fiber broadband telemetry",
        "Debris removal from arterial logistics lanes"
      ],
      active_phase: "INACTIVE"
    }
  ];
}

export async function togglePlaybookPhase(playbookId: string, phase: string): Promise<any> {
  try {
    const res = await fetch(`${API_BASE}/playbooks/${playbookId}/toggle-phase?phase=${encodeURIComponent(phase)}`, {
      method: 'POST'
    });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Using fallback toggle playbook phase:', e);
  }
  return {
    status: "UPDATED",
    playbook_id: playbookId,
    active_phase: phase,
    message: `Emergency Playbook ${playbookId} switched to ${phase} mode.`
  };
}

export async function fetchEquipmentTelemetry(): Promise<{
  equipment: MedicalEquipment[];
  cold_chain: ColdChainSensor[];
  energy: EnergyResilienceMetric[];
}> {
  try {
    const res = await fetch(`${API_BASE}/equipment-telemetry`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Using fallback equipment telemetry:', e);
  }
  return {
    equipment: [
      {
        id: "EQ-001",
        name: "Pressure Swing Adsorption (PSA) Oxygen Plant (500 LPM)",
        category: "OXYGEN_PLANT",
        phc_id: "PHC-0042",
        phc_name: "Machilipatnam Coastal PHC",
        district_name: "Krishna",
        age_years: 3.2,
        usage_hours_daily: 22.5,
        maintenance_health_score: 88.0,
        status: "OPERATIONAL",
        failure_probability_pct: 4.2,
        next_service_due: "In 45 Days"
      },
      {
        id: "EQ-002",
        name: "Ice-Lined Refrigerator (ILR) 200L Vaccine Storage",
        category: "REFRIGERATION",
        phc_id: "PHC-0042",
        phc_name: "Machilipatnam Coastal PHC",
        district_name: "Krishna",
        age_years: 2.8,
        usage_hours_daily: 24.0,
        maintenance_health_score: 94.5,
        status: "OPERATIONAL",
        failure_probability_pct: 1.8,
        next_service_due: "In 60 Days"
      },
      {
        id: "EQ-003",
        name: "Emergency 45 kVA Silent Diesel Generator Set",
        category: "GENERATOR",
        phc_id: "PHC-0018",
        phc_name: "Avanigadda Rural Hospital",
        district_name: "Krishna",
        age_years: 4.5,
        usage_hours_daily: 14.0,
        maintenance_health_score: 78.2,
        status: "MAINTENANCE_DUE",
        failure_probability_pct: 12.5,
        next_service_due: "Overdue by 3 Days"
      }
    ],
    cold_chain: [
      {
        id: "CC-001",
        facility_name: "Machilipatnam Vaccine Hub (ILR Unit 1)",
        district_name: "Krishna",
        storage_type: "ILR_VACCINE",
        current_temp_c: 4.2,
        min_safe_temp_c: 2.0,
        max_safe_temp_c: 8.0,
        status: "NORMAL",
        vaccine_doses_secured: 4850,
        last_ping: "30s ago",
        backup_power_ready: true
      },
      {
        id: "CC-003",
        facility_name: "Bhadradri Tribal PHC Cold Box",
        district_name: "Khammam",
        storage_type: "ILR_VACCINE",
        current_temp_c: 7.4,
        min_safe_temp_c: 2.0,
        max_safe_temp_c: 8.0,
        status: "WARNING",
        vaccine_doses_secured: 950,
        last_ping: "2m ago",
        backup_power_ready: false
      }
    ],
    energy: [
      {
        id: "ENG-01",
        facility_name: "Machilipatnam Coastal PHC",
        district_name: "Krishna",
        grid_power_status: "FLUCTUATING",
        diesel_generator_hours_left: 38.5,
        solar_battery_storage_kwh: 24.0,
        critical_load_supported_hours: 48.0,
        risk_level: "MODERATE"
      },
      {
        id: "ENG-02",
        facility_name: "Avanigadda Rural Hospital",
        district_name: "Krishna",
        grid_power_status: "OUTAGE",
        diesel_generator_hours_left: 18.0,
        solar_battery_storage_kwh: 12.5,
        critical_load_supported_hours: 22.0,
        risk_level: "CRITICAL"
      }
    ]
  };
}

export async function fetchObservatory(): Promise<{
  models: ModelObservatoryMetric[];
  quality: DataQualityMetric;
}> {
  try {
    const res = await fetch(`${API_BASE}/observatory`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Using fallback observatory:', e);
  }
  return {
    models: [
      {
        model_id: "MOD-01",
        name: "Demand Forecast Time-Series Ensemble",
        version: "v2.4.1",
        last_trained: "2 days ago",
        accuracy_pct: 94.6,
        drift_level_pct: 2.1,
        inference_latency_ms: 18.4,
        daily_predictions_count: 6940,
        status: "OPTIMAL"
      },
      {
        model_id: "MOD-02",
        name: "Stock-Out Lead-Time Depletion Classifier",
        version: "v2.2.0",
        last_trained: "4 days ago",
        accuracy_pct: 96.8,
        drift_level_pct: 1.4,
        inference_latency_ms: 12.2,
        daily_predictions_count: 48500,
        status: "OPTIMAL"
      },
      {
        model_id: "MOD-03",
        name: "Z-Score Anomaly Detection Filter",
        version: "v1.9.4",
        last_trained: "1 day ago",
        accuracy_pct: 98.1,
        drift_level_pct: 3.8,
        inference_latency_ms: 8.5,
        daily_predictions_count: 145000,
        status: "MONITOR_DRIFT"
      },
      {
        model_id: "MOD-04",
        name: "Integer Linear Programming Route Optimizer",
        version: "v3.1.0",
        last_trained: "Continuous Solver",
        accuracy_pct: 97.4,
        drift_level_pct: 0.0,
        inference_latency_ms: 45.0,
        daily_predictions_count: 340,
        status: "OPTIMAL"
      }
    ],
    quality: {
      overall_quality_score: 98.4,
      missing_telemetry_fields: 14,
      duplicate_records_flagged: 3,
      impossible_values_filtered: 0,
      stale_sensors_count: 2,
      outliers_detected: 4,
      total_records_processed: 145800,
      last_audit_run: "Just now"
    }
  };
}

export async function fetchRootCauseDiagnostics(): Promise<RootCauseDiagnostic> {
  try {
    const res = await fetch(`${API_BASE}/root-cause`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Using fallback root cause diagnostics:', e);
  }
  return {
    incident_id: "INC-2026-0924",
    title: "Oral Rehydration Salts (ORS) & Paracetamol Stock-Out Vulnerability",
    district_name: "Krishna",
    phc_name: "Machilipatnam Coastal PHC",
    primary_symptom: "Stock reserve depleted to 2.4 days against 14-day statutory buffer",
    factors: [
      {
        name: "Acute Influx of Monsoon Waterborne Gastroenteritis",
        contribution_pct: 34.5,
        observed_metric: "+46% OPD Footfall",
        baseline_metric: "320 patients/day",
        category: "DEMAND_SURGE",
        explanation: "Monsoon river swelling triggered localized waterborne contamination in delta wards."
      },
      {
        name: "Arterial Highway Inundation along NH-216",
        contribution_pct: 28.0,
        observed_metric: "+2.4 Days Delivery Delay",
        baseline_metric: "18 Hours transit time",
        category: "SUPPLY_DISRUPTION",
        explanation: "Logistics carrier stranded due to submerged culvert; bypass via SH-42 required."
      },
      {
        name: "Supplier Consignment Batch Testing Backlog",
        contribution_pct: 21.5,
        observed_metric: "4 Days QA Hold",
        baseline_metric: "24 Hours QA Clearance",
        category: "SUPPLIER_PERFORMANCE",
        explanation: "Central depot testing delay on batch NLEM-ORS-402 held up regional dispatch."
      },
      {
        name: "Neighboring PHC Stockpile Hoarding",
        contribution_pct: 16.0,
        observed_metric: "+18 Days Excess Inventory in Avanigadda",
        baseline_metric: "14 Days Safety Stock",
        category: "DISTRIBUTION_INEFFICIENCY",
        explanation: "Sub-district distribution skew left downstream clinics depleted while inland clinic held surplus."
      }
    ],
    causal_chain: [
      "Localized River Flooding & Coastal Waterlogging",
      "Outpatient Gastrointestinal Spike (+46% Patient Influx)",
      "Frontline ORS/Paracetamol Consumption Accelerated 3.4x",
      "NH-216 Transit Route Blockage Stalled Replenishment Trucks",
      "Depletion to 2.4 Days-of-Supply with Zero Emergency Buffer"
    ],
    suggested_countermeasures: [
      "Execute lateral transfer of 850 ORS boxes from Avanigadda Rural Hospital (SH-42 detour)",
      "Switch procurement supplier allocation to Bharat Serum Logistics",
      "Pre-authorize rapid release of district contingency buffer"
    ]
  };
}

export async function fetchDecisionOptions(): Promise<DecisionOption[]> {
  try {
    const res = await fetch(`${API_BASE}/decision-options`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Using fallback decision options:', e);
  }
  return [
    {
      id: "OPT-A",
      label: "Option A: Lateral Redistribution from Guntur Surplus Warehouse",
      strategy: "LATERAL_REDISTRIBUTION",
      time_to_impact_hours: 6.5,
      resources_affected: "850 ORS boxes, 1,200 Paracetamol strips",
      shortage_reduction_pct: 88,
      transport_complexity: "LOW",
      financial_cost_inr: 14200.0,
      feasibility_score: 94,
      pros: [
        "Fastest turnaround (6.5 hours transit via State Highway 42)",
        "Zero procurement cost (utilizes verified state surplus buffer)",
        "Preserves regional inventory equilibrium without supplier delay"
      ],
      cons: [
        "Reduces Guntur warehouse buffer from 28 days to 21 days",
        "Requires district vehicle dispatch authorization"
      ]
    },
    {
      id: "OPT-B",
      label: "Option B: Fast-Track Emergency Purchase Order via Andhra Pharma Depot",
      strategy: "EMERGENCY_PURCHASE",
      time_to_impact_hours: 24.0,
      resources_affected: "2,500 ORS boxes, 5,000 Paracetamol strips",
      shortage_reduction_pct: 100,
      transport_complexity: "MODERATE",
      financial_cost_inr: 84000.0,
      feasibility_score: 78,
      pros: [
        "Completely restores 30-day statutory buffer for entire sub-division",
        "Does not deplete neighboring district stockpiles"
      ],
      cons: [
        "High commercial unit cost premium (+18% emergency surcharge)",
        "Requires emergency fiscal sign-off by District Collector",
        "Transit takes 24 hours (does not solve immediate 6-hour gap)"
      ]
    },
    {
      id: "OPT-C",
      label: "Option C: Activate Alternate Supplier (Bharat Serum Logistics)",
      strategy: "ALTERNATE_SUPPLIER",
      time_to_impact_hours: 18.0,
      resources_affected: "1,500 ORS boxes, 2,000 Paracetamol strips",
      shortage_reduction_pct: 92,
      transport_complexity: "MODERATE",
      financial_cost_inr: 42500.0,
      feasibility_score: 85,
      pros: [
        "Reliable carrier with cold-chain fleet and GPS tracking",
        "94.2% historical delivery SLA compliance"
      ],
      cons: [
        "Requires 2-hour contract validation protocol",
        "Slightly longer distance than inland depot transfer"
      ]
    },
    {
      id: "OPT-D",
      label: "Option D: Regional Stockpile Drawdown from Vijayawada Central Reserve",
      strategy: "REGIONAL_STOCKPILE",
      time_to_impact_hours: 12.0,
      resources_affected: "1,000 ORS boxes, 1,500 Paracetamol strips",
      shortage_reduction_pct: 82,
      transport_complexity: "LOW",
      financial_cost_inr: 18500.0,
      feasibility_score: 89,
      pros: [
        "Authorized state disaster reserve pool with pre-cleared logistics",
        "Balanced impact on regional health network"
      ],
      cons: [
        "Requires state health commissioner concurrence",
        "Depletes central reserve during monsoon season"
      ]
    }
  ];
}

export async function fetchScalabilityMetrics(phcScale = 1248): Promise<ScalabilityMetrics> {
  try {
    const res = await fetch(`${API_BASE}/scalability?phc_scale=${phcScale}`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Using fallback scalability metrics:', e);
  }
  const mult = phcScale / 1000.0;
  return {
    phc_scale: phcScale,
    daily_telemetry_events: Math.round(86400 * 12 * mult),
    data_throughput_gb_day: parseFloat((42.5 * mult).toFixed(2)),
    ai_inference_calls_daily: Math.round(185000 * mult),
    federated_edge_nodes: phcScale,
    active_supply_corridors: Math.round(420 * mult),
    simulated_sub_seconds_latency_ms: parseFloat((14.2 + (mult * 1.8)).toFixed(1)),
    server_clusters_required: Math.max(2, Math.round(mult * 4)),
    resilience_engine_capacity_pct: Math.min(98.5, parseFloat((65.0 + (mult * 4.2)).toFixed(1))),
    estimated_annual_cost_savings_inr_crores: parseFloat((18.5 * mult).toFixed(2)),
    prevented_critical_stockouts_annually: Math.round(1420 * mult)
  };
}

// ============================================================
// ULTRA-ADVANCED API CLIENT EXTENSIONS (90 MODULES)
// ============================================================

export async function fetchEcosystemGraph(): Promise<{
  nodes: EcosystemNode[];
  edges: EcosystemEdge[];
  bottlenecks: FutureBottleneck[];
}> {
  try {
    const res = await fetch(`${API_BASE}/graph/topology`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Using fallback ecosystem graph:', e);
  }
  return {
    nodes: [
      { id: "STATE-AP", name: "Andhra Pradesh State Grid", type: "STATE", status: "HEALTHY", risk_score: 18, connections_count: 26, details: "State Command HQ, Vijayawada" },
      { id: "DIST-KRI", name: "District Krishna", type: "DISTRICT", status: "CRITICAL", risk_score: 78, connections_count: 15, details: "Coastal flood vulnerability zone" },
      { id: "DIST-GUN", name: "District Guntur", type: "DISTRICT", status: "HEALTHY", risk_score: 22, connections_count: 14, details: "Surplus strategic reserve hub" },
      { id: "WH-VIJ-01", name: "Vijayawada Central Apex Warehouse", type: "WAREHOUSE", status: "HEALTHY", risk_score: 15, connections_count: 32, details: "Automated cold-chain & pallet storage" },
      { id: "WH-GNT-04", name: "Guntur Regional Depot W-17", type: "WAREHOUSE", status: "WARNING", risk_score: 64, connections_count: 18, details: "Projected bottleneck in 5 days due to influx" },
      { id: "SUP-REDDY", name: "Dr. Reddy's Regional Plant", type: "SUPPLIER", status: "HEALTHY", risk_score: 12, connections_count: 8, details: "Tier-1 API & IV Fluid manufacturer" },
      { id: "SUP-CIPLA", name: "Cipla Coastal Logistics Hub", type: "SUPPLIER", status: "WARNING", risk_score: 48, connections_count: 6, details: "2.5 day transit delay on waterlogged NH-216" },
      { id: "PHC-MACH-42", name: "Machilipatnam Coastal PHC", type: "PHC", status: "CRITICAL", risk_score: 84, connections_count: 9, details: "Stockout risk in 3.2 days, beds 91% occupied" },
      { id: "PHC-AVAN-18", name: "Avanigadda Riverine PHC", type: "PHC", status: "WARNING", risk_score: 58, connections_count: 7, details: "Acute diarrheal illness cluster, ORS deficit" },
      { id: "PHC-TEN-09", name: "Tenali Urban CHC", type: "PHC", status: "HEALTHY", risk_score: 19, connections_count: 11, details: "Surplus ORS & Paracetamol depot" },
      { id: "MED-ORS", name: "Oral Rehydration Salts (WHO formula)", type: "MEDICINE", status: "CRITICAL", risk_score: 82, connections_count: 42, details: "Depletion rate 280 units/day" },
      { id: "MED-PCM", name: "Paracetamol 500mg (IP)", type: "MEDICINE", status: "WARNING", risk_score: 61, connections_count: 55, details: "+31% demand surge" },
      { id: "BED-ICU-OXY", name: "Oxygenated ICU Bed Cluster", type: "BED", status: "WARNING", risk_score: 68, connections_count: 14, details: "88.4% occupancy in flood-affected blocks" },
      { id: "STAFF-EMERG", name: "Rapid Medical Response Corps", type: "PERSONNEL", status: "HEALTHY", risk_score: 25, connections_count: 19, details: "92.8% attendance, 4 mobile triage teams" },
      { id: "ROUTE-NH216", name: "National Highway 216 Coastal Route", type: "ROUTE", status: "BLOCKED", risk_score: 95, connections_count: 8, details: "Inundated at Mile 44, +4.8h transit" },
      { id: "ROUTE-SH42", name: "State Highway 42 Bypass Corridor", type: "ROUTE", status: "HEALTHY", risk_score: 24, connections_count: 7, details: "Operational alternative route (+2.2h)" },
      { id: "EMERG-MONSOON", name: "Monsoon Surge TIER-3 Emergency", type: "EMERGENCY", status: "CRITICAL", risk_score: 89, connections_count: 12, details: "Affects 18 coastal PHCs" },
      { id: "DEMAND-SURGE", name: "Pediatric Acute Gastroenteritis Demand", type: "DEMAND", status: "CRITICAL", risk_score: 79, connections_count: 16, details: "Predicted +44% 7-day surge" }
    ],
    edges: [
      { id: "E1", source: "DIST-KRI", target: "STATE-AP", relationship: "belongs_to", weight: 1.0, latency_hrs: 0, status: "ACTIVE", is_bottleneck: false },
      { id: "E2", source: "DIST-GUN", target: "STATE-AP", relationship: "belongs_to", weight: 1.0, latency_hrs: 0, status: "ACTIVE", is_bottleneck: false },
      { id: "E3", source: "PHC-MACH-42", target: "DIST-KRI", relationship: "belongs_to", weight: 1.0, latency_hrs: 0.5, status: "ACTIVE", is_bottleneck: false },
      { id: "E4", source: "PHC-AVAN-18", target: "DIST-KRI", relationship: "belongs_to", weight: 1.0, latency_hrs: 0.8, status: "ACTIVE", is_bottleneck: false },
      { id: "E5", source: "PHC-TEN-09", target: "DIST-GUN", relationship: "belongs_to", weight: 1.0, latency_hrs: 0.4, status: "ACTIVE", is_bottleneck: false },
      { id: "E6", source: "WH-VIJ-01", target: "PHC-MACH-42", relationship: "supplies", weight: 0.8, latency_hrs: 4.8, status: "CONGESTED", is_bottleneck: true },
      { id: "E7", source: "WH-GNT-04", target: "PHC-TEN-09", relationship: "supplies", weight: 1.0, latency_hrs: 1.2, status: "ACTIVE", is_bottleneck: false },
      { id: "E8", source: "SUP-REDDY", target: "WH-VIJ-01", relationship: "supplies", weight: 1.0, latency_hrs: 6.0, status: "ACTIVE", is_bottleneck: false },
      { id: "E9", source: "SUP-CIPLA", target: "WH-GNT-04", relationship: "supplies", weight: 0.6, latency_hrs: 14.5, status: "CONGESTED", is_bottleneck: true },
      { id: "E10", source: "PHC-MACH-42", target: "MED-ORS", relationship: "receives", weight: 0.3, latency_hrs: 0, status: "FAILED", is_bottleneck: true },
      { id: "E11", source: "PHC-TEN-09", target: "MED-ORS", relationship: "surplus_store", weight: 1.0, latency_hrs: 0, status: "ACTIVE", is_bottleneck: false },
      { id: "E12", source: "PHC-MACH-42", target: "BED-ICU-OXY", relationship: "has", weight: 0.9, latency_hrs: 0, status: "ACTIVE", is_bottleneck: true },
      { id: "E13", source: "PHC-MACH-42", target: "STAFF-EMERG", relationship: "requires", weight: 0.7, latency_hrs: 0, status: "ACTIVE", is_bottleneck: false },
      { id: "E14", source: "EMERG-MONSOON", target: "DIST-KRI", relationship: "affects", weight: 1.0, latency_hrs: 0, status: "ACTIVE", is_bottleneck: true },
      { id: "E15", source: "DEMAND-SURGE", target: "MED-ORS", relationship: "drives", weight: 1.0, latency_hrs: 0, status: "ACTIVE", is_bottleneck: true },
      { id: "E16", source: "ROUTE-NH216", target: "PHC-MACH-42", relationship: "transits", weight: 0.0, latency_hrs: 72.0, status: "FAILED", is_bottleneck: true },
      { id: "E17", source: "ROUTE-SH42", target: "PHC-MACH-42", relationship: "reroutes_to", weight: 0.85, latency_hrs: 3.2, status: "ACTIVE", is_bottleneck: false }
    ],
    bottlenecks: [
      {
        id: "BOT-01",
        facility_name: "Guntur Regional Depot W-17",
        facility_type: "Warehouse Node",
        current_utilization_pct: 88.5,
        predicted_utilization_5d: 104.2,
        risk_window: "Next 4–5 Days",
        risk_level: "CRITICAL",
        expected_inflow: 18400,
        expected_demand: 12100
      },
      {
        id: "BOT-02",
        facility_name: "NH-216 Coastal Choke Bridge",
        facility_type: "Transport Route",
        current_utilization_pct: 94.0,
        predicted_utilization_5d: 112.0,
        risk_window: "Next 48 Hours",
        risk_level: "HIGH",
        expected_inflow: 8500,
        expected_demand: 6200
      }
    ]
  };
}

export async function fetchPropagationSimulation(): Promise<PropagationStep[]> {
  try {
    const res = await fetch(`${API_BASE}/graph/risk-propagation`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Using fallback propagation steps:', e);
  }
  return [
    { step_num: 1, title: "Initial Disruption", facility: "Cipla Coastal Logistics Hub (Supplier)", status: "FAILED", effect: "Waterlogging shuts down automated sorting bay for 36 hours", severity: "HIGH" },
    { step_num: 2, title: "Corridor Failure", facility: "National Highway 216 (Mile 44)", status: "FAILED", effect: "Supply route blocked; transit detour adds 4.8 hours delivery latency", severity: "HIGH" },
    { step_num: 3, title: "Depot Starvation", facility: "District Krishna Central Warehouse", status: "DEGRADED", effect: "Safety stock depletion drops buffer from 18 days to 4.2 days", severity: "CRITICAL" },
    { step_num: 4, title: "Frontline Shortage", facility: "14 Coastal PHCs (including Machilipatnam)", status: "CRITICAL", effect: "Simultaneous stockout of ORS & Paracetamol within 72 hours", severity: "CRITICAL" },
    { step_num: 5, title: "Clinical Saturation", facility: "Machilipatnam Hospital Bed Network", status: "CRITICAL", effect: "Patient footfall surges +40%; oxygen bed occupancy spikes to 96%", severity: "CATASTROPHIC" }
  ];
}

export async function fetchResourceMatches(): Promise<ResourceMatchProposal[]> {
  try {
    const res = await fetch(`${API_BASE}/matching/proposals`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Using fallback resource matches:', e);
  }
  return [
    {
      id: "MATCH-01",
      surplus_district: "District Guntur (Tenali Urban CHC)",
      surplus_phc: "Tenali CHC (Surplus: 8,400 units, 32 days buffer)",
      need_district: "District Krishna (Machilipatnam Coastal PHC)",
      need_phc: "Machilipatnam PHC (Deficit: 5,000 units, 2.9 days left)",
      resource_name: "Oral Rehydration Salts (WHO Formula)",
      quantity: 5000,
      distance_km: 68.4,
      transit_hours: 2.1,
      expiry_date: "2027-11-30",
      urgency: "CRITICAL",
      compatibility_score: 98.4,
      reasoning: "Guntur retains 3,400 units (>16 days reserve). Transit via SH-42 avoids waterlogged NH-216. Low cold-chain storage constraint."
    },
    {
      id: "MATCH-02",
      surplus_district: "District Prakasam (Ongole Central Depot)",
      surplus_phc: "Ongole District Store (Surplus: 12,000 strips)",
      need_district: "District Krishna (Avanigadda Riverine PHC)",
      need_phc: "Avanigadda PHC (Deficit: 3,500 strips, 3.4 days left)",
      resource_name: "Paracetamol 500mg Tablets",
      quantity: 3500,
      distance_km: 112.0,
      transit_hours: 3.4,
      expiry_date: "2027-08-15",
      urgency: "HIGH",
      compatibility_score: 94.2,
      reasoning: "FEFO batch expires in 9 months at source; high consumption velocity at Avanigadda ensures zero spoilage."
    }
  ];
}

export async function fetchParetoTradeoffs(): Promise<ParetoObjectiveTradeoff[]> {
  try {
    const res = await fetch(`${API_BASE}/optimization/pareto`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Using fallback Pareto tradeoffs:', e);
  }
  return [
    {
      id: "STRAT-BALANCED",
      strategy_name: "Pareto Optimal (Balanced Resilience & Cost)",
      transit_hours: 2.4,
      stockout_risk_pct: 4.2,
      transport_cost_inr: 8400,
      coverage_pct: 96.8,
      readiness_score: 92.4,
      wastage_risk_pct: 1.8,
      recommended: true,
      tradeoff_explanation: "Minimizes stock-out probability to 4.2% while incurring modest INR 8,400 transit expenditure over secondary corridors."
    },
    {
      id: "STRAT-FAST",
      strategy_name: "Ultra-Fast Emergency Dispatch (Direct Express)",
      transit_hours: 1.2,
      stockout_risk_pct: 1.1,
      transport_cost_inr: 24500,
      coverage_pct: 99.2,
      readiness_score: 97.5,
      wastage_risk_pct: 2.4,
      recommended: false,
      tradeoff_explanation: "Maximizes speed via dedicated courier vans; 3x cost increase for a 1.2h reduction in delivery lead time."
    },
    {
      id: "STRAT-ECO",
      strategy_name: "Consolidated Batch Transit (Eco & Low Cost)",
      transit_hours: 5.6,
      stockout_risk_pct: 14.8,
      transport_cost_inr: 3200,
      coverage_pct: 88.0,
      readiness_score: 79.0,
      wastage_risk_pct: 0.9,
      recommended: false,
      tradeoff_explanation: "Groups dispatches into single freight carrier. Low financial cost but creates higher stockout exposure during peak flood hours."
    }
  ];
}

export async function fetchAuctionScenarios(): Promise<AuctionScenario[]> {
  return [
    {
      id: "AUC-ORS-01",
      title: "Limited Stock Allocation: 10,000 Units Oral Rehydration Salts",
      resource_name: "ORS Sachets (10,000 Total Available)",
      total_units: 10000,
      allocations: [
        { district: "District Krishna", allocated: 5200, need: 6000, urgency: "CRITICAL (Flood)", travel_time_hrs: 2.1, rationale: "Highest affected population density (34,000 flood evacuees)" },
        { district: "District Guntur", allocated: 2800, need: 3200, urgency: "HIGH (Cluster)", travel_time_hrs: 1.4, rationale: "Secondary prevention against spillover cases in peri-urban slums" },
        { district: "District Prakasam", allocated: 2000, need: 2500, urgency: "MEDIUM (Monitor)", travel_time_hrs: 3.2, rationale: "Maintains regional baseline safety buffer above 12 days" }
      ]
    },
    {
      id: "AUC-OXY-02",
      title: "Emergency Oxygen Cylinder Allocation: 120 Jumbo D-Type Cylinders",
      resource_name: "Oxygen Cylinders 7000L",
      total_units: 120,
      allocations: [
        { district: "District Krishna Coastal Hospitals", allocated: 65, need: 75, urgency: "CRITICAL", travel_time_hrs: 2.8, rationale: "88.4% bed occupancy; power grid fluctuating near coast" },
        { district: "District West Godavari CHCs", allocated: 35, need: 40, urgency: "HIGH", travel_time_hrs: 3.5, rationale: "Contingency reserve for river island dispensaries" },
        { district: "State Mobile Triage Unit", allocated: 20, need: 20, urgency: "HIGH", travel_time_hrs: 0.8, rationale: "Dedicated supply for field trauma tents" }
      ]
    }
  ];
}

export async function fetchResourceWastageRisks(): Promise<ResourceWastageRisk[]> {
  return [
    { id: "WASTE-01", resource_type: "EXPIRY", facility_name: "Ongole District Medical Store", estimated_quantity: 4200, unit: "Strips", potential_loss_inr: 84000, time_window: "Expires in 42 Days", recommended_action: "Expedite FEFO dispatch to high-velocity Machilipatnam clinic" },
    { id: "WASTE-02", resource_type: "OVERSTOCK", facility_name: "Tenali Urban CHC", estimated_quantity: 8400, unit: "ORS Packets", potential_loss_inr: 126000, time_window: "Holding 64 Days Excess", recommended_action: "Redistribute 5,000 units to deficit Krishna coastal cluster" },
    { id: "WASTE-03", resource_type: "UNUSED_BEDS", facility_name: "Guntur Specialty Extension", estimated_quantity: 38, unit: "Available Beds", potential_loss_inr: 190000, time_window: "14 Days Sub-40% Occupancy", recommended_action: "Designate overflow receiving center for flood evacuation referrals" },
    { id: "WASTE-04", resource_type: "UNDERUTILIZED_EQUIPMENT", facility_name: "Bapatla PHC", estimated_quantity: 2, unit: "PSA Oxygen Generators", potential_loss_inr: 340000, time_window: "Operating at 18% capacity", recommended_action: "Transfer 1 unit to Machilipatnam field hospital cluster" }
  ];
}

export async function fetchBatchExpiryList(): Promise<BatchExpiryItem[]> {
  return [
    { batch_id: "BATCH-PCM-2024-B8", medicine_name: "Paracetamol 500mg", quantity: 3800, expiry_date: "2026-11-15", current_phc: "Tenali Urban CHC", consumption_rate_daily: 45, days_to_expiry: 46, expiry_risk: "CRITICAL", recommended_dest_phc: "Machilipatnam Coastal PHC (Velocity: 210/day)" },
    { batch_id: "BATCH-ORS-2024-C2", medicine_name: "Oral Rehydration Salts", quantity: 2400, expiry_date: "2026-12-05", current_phc: "Ongole Central Store", consumption_rate_daily: 30, days_to_expiry: 66, expiry_risk: "HIGH", recommended_dest_phc: "Avanigadda Riverine PHC (Velocity: 160/day)" },
    { batch_id: "BATCH-AMX-2025-A1", medicine_name: "Amoxicillin 250mg", quantity: 1800, expiry_date: "2027-04-20", current_phc: "Guntur Medical Depot", consumption_rate_daily: 22, days_to_expiry: 202, expiry_risk: "LOW", recommended_dest_phc: "Normal FEFO Routine Dispatch" }
  ];
}

export async function fetchEdgeNodes(): Promise<EdgeNodeInfo[]> {
  return [
    { id: "EDGE-001", phc_name: "Machilipatnam Coastal PHC", district: "Krishna", is_online: true, local_inference_count: 1420, model_version: "Arogya-Edge-v2.4-AP", last_sync: "2 mins ago", pending_updates: 0, sync_status: "SYNC_COMPLETE" },
    { id: "EDGE-002", phc_name: "Avanigadda Riverine PHC", district: "Krishna", is_online: false, local_inference_count: 890, model_version: "Arogya-Edge-v2.4-AP", last_sync: "48 mins ago", pending_updates: 14, sync_status: "LOCAL_MODE" },
    { id: "EDGE-003", phc_name: "Bapatla Coastal PHC", district: "Guntur", is_online: true, local_inference_count: 1120, model_version: "Arogya-Edge-v2.4-AP", last_sync: "Just now", pending_updates: 0, sync_status: "SYNCING" },
    { id: "EDGE-004", phc_name: "Tenali Urban CHC", district: "Guntur", is_online: true, local_inference_count: 2410, model_version: "Arogya-Edge-v2.4-AP", last_sync: "5 mins ago", pending_updates: 0, sync_status: "SYNC_COMPLETE" }
  ];
}

export async function fetchChampionChallengers(): Promise<ChampionChallengerModel[]> {
  return [
    { model_id: "CHAMP-01", name: "Champion: Arogya-FedNet-v2.4 (DP-SGD FedAvg)", mae_error: 3.12, latency_ms: 18.4, stability_score: 96.2, data_requirements: "Gradient tensors only (ε=1.20)", status: "DEPLOYED_PRIMARY" },
    { model_id: "CHALL-02", name: "Challenger A: SpatioTemporal Graph WaveNet", mae_error: 2.88, latency_ms: 32.1, stability_score: 93.8, data_requirements: "Edge graph topological embeddings", status: "EVALUATION_ACTIVE" },
    { model_id: "CHALL-03", name: "Challenger B: Hierarchical Bayesian Ensemble", mae_error: 3.45, latency_ms: 14.2, stability_score: 98.1, data_requirements: "Parametric regional priors", status: "BENCHMARK_TEST" }
  ];
}

export async function fetchContinuousLearningStages(): Promise<ContinuousLearningStage[]> {
  return [
    { stage: "STAGE-1", name: "1. Decentralized Ingestion & Differential Privacy Clipping", status: "COMPLETED", metric: "1,248 nodes validated (Clipping norm C=1.0)", latency_ms: 240 },
    { stage: "STAGE-2", name: "2. Real-Time Concept Drift Sentinel & KS-Test", status: "COMPLETED", metric: "Drift p-value: 0.082 (Nominal range)", latency_ms: 110 },
    { stage: "STAGE-3", name: "3. Federated Weight Aggregator (FedAvg)", status: "RUNNING", metric: "Round #19: 94.6% Accuracy, Loss: 0.118", latency_ms: 450 },
    { stage: "STAGE-4", name: "4. Automated Safety & Fairness Verification Guardrails", status: "IDLE", metric: "Zero clinical prescription autonomy gate", latency_ms: 85 },
    { stage: "STAGE-5", name: "5. Hot-Swappable Edge Model Rollout", status: "IDLE", metric: "Canary deployment on 5% edge nodes", latency_ms: 120 }
  ];
}

export async function fetchExtractedDocuments(): Promise<ExtractedDocData[]> {
  return [
    {
      id: "DOC-001",
      filename: "Krishna_District_Weekly_Reconciliation_SITREP.pdf",
      doc_type: "SUPPLY_REPORT",
      upload_time: "Today, 09:14 IST",
      extracted_tables: [
        { item: "ORS Sachets", recorded_qty: 1240, counted_qty: 1210, discrepancy: -30 },
        { item: "Paracetamol 500mg", recorded_qty: 4800, counted_qty: 4800, discrepancy: 0 },
        { item: "IV Saline 500ml", recorded_qty: 620, counted_qty: 605, discrepancy: -15 }
      ],
      extracted_entities: {
        "Reporting District": "Krishna",
        "Authorizing Officer": "Dr. T. Venkataramaiah, DHO",
        "Verification Status": "Human Auditor Flagged Discrepancy",
        "Confidence Score": "98.7% (OCR Confidence)"
      },
      confidence_pct: 98.7,
      status: "PENDING_VERIFICATION"
    }
  ];
}

export async function fetchReconciliationDiscrepancies(): Promise<ReconciliationDiscrepancy[]> {
  return [
    { id: "RECON-01", item_name: "Oral Rehydration Salts (WHO formula)", warehouse_qty: 10000, district_qty: 9200, system_qty: 9850, variance_pct: 6.5, status: "FLAGGED", suggested_resolution: "650 units in transit logged on SH-42 detour; audit physical receipt before ledger reconciliation." },
    { id: "RECON-02", item_name: "Paracetamol 500mg Strips", warehouse_qty: 15000, district_qty: 14850, system_qty: 15000, variance_pct: 1.0, status: "RESOLVED", suggested_resolution: "Within 1.0% allowable clinical handling threshold; automatically reconciled." },
    { id: "RECON-03", item_name: "Ceftriaxone 1g Injections", warehouse_qty: 1200, district_qty: 1040, system_qty: 1200, variance_pct: 13.3, status: "FLAGGED", suggested_resolution: "160 units quarantined under batch recall alert BATCH-CFX-90; holds separate quarantine ledger." }
  ];
}

export async function fetchDataLineageItems(): Promise<DataLineageItem[]> {
  return [
    { metric_name: "7-Day Demand Forecast (Paracetamol, Krishna)", source: "Machilipatnam EHR + 6-month historical dispensing ledger", timestamp: "Today 10:42 IST", transformation: "Outlier filtering (Z > 3.0 clipped) + Seasonality adjustment", model: "Arogya-FedNet-v2.4 (Federated LSTM-GBM Ensemble)", prediction_output: "Surge +31% (95% CI: +24% to +38%)" },
    { metric_name: "Depletion Days (ORS, Coastal Block)", source: "Daily dispensary inventory scanner & active outpatient footfall", timestamp: "Today 11:05 IST", transformation: "Moving average daily draw rate * weather surge multiplier", model: "Dynamic Stockout Engine v2.1", prediction_output: "3.2 Days to zero stock" },
    { metric_name: "National Resilience Index (82.4/100)", source: "Multi-echelon telemetric telemetry (694 PHCs, 51 Districts)", timestamp: "Live Continuous", transformation: "7-Factor Weighted Composite with normalization [0-100]", model: "Resilience Matrix Engine v2.4", prediction_output: "82.4 / 100 (Operational Resilient)" }
  ];
}

export async function fetchSecurityEvents(): Promise<SecurityEventItem[]> {
  return [
    { id: "SEC-01", event_type: "UNAUTHORIZED_ATTEMPT", actor: "API Client 192.168.1.84", ip: "192.168.1.84", timestamp: "08:12 IST", severity: "HIGH", status: "CONTAINED" },
    { id: "SEC-02", event_type: "FAILED_LOGIN", actor: "User dho_krishna_admin", ip: "10.0.4.12", timestamp: "08:35 IST", severity: "LOW", status: "CONTAINED" },
    { id: "SEC-03", event_type: "PRIVILEGE_CHANGE", actor: "Security Admin root_audit", ip: "127.0.0.1", timestamp: "09:00 IST", severity: "MEDIUM", status: "CONTAINED" },
    { id: "SEC-04", event_type: "SUSPICIOUS_API", actor: "Automated Scraping Probe", ip: "45.132.88.2", timestamp: "09:42 IST", severity: "HIGH", status: "CONTAINED" }
  ];
}

export async function fetchDigitalSignatures(): Promise<DigitalSignatureApproval[]> {
  return [
    {
      audit_id: "SIG-AP-2026-8842",
      workflow_title: "Lateral Redistribution Approval: 5,000 ORS units from Guntur to Krishna",
      requested_by: "Dr. K. Srinivas (District Health Officer, Krishna)",
      reviewed_by: "AI Optimization Engine (ILP Solver, Feasibility 98.4%)",
      approved_by: "Dr. Sunita Rao (Director of Public Health, Andhra Pradesh)",
      timestamp: "Today, 09:28:44 IST",
      cryptographic_hash: "sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
      status: "SIGNED"
    },
    {
      audit_id: "SIG-AP-2026-8843",
      workflow_title: "Emergency Oxygen Reserve Allocation: 65 Cylinders to Machilipatnam Hospital",
      requested_by: "Dr. N. Rajender (Emergency Response Coordinator)",
      reviewed_by: "AI Medical Device Sentinel (PSA Oxygen Plant Alert)",
      approved_by: "Principal Secretary (Health & Family Welfare)",
      timestamp: "Today, 10:15:10 IST",
      cryptographic_hash: "sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      status: "SIGNED"
    }
  ];
}

export async function fetchCrisisTimeline(): Promise<CrisisTimelineEvent[]> {
  return [
    { time_str: "08:00 IST", event_title: "Hydrological Anomaly Detected", department: "IMD Weather Sentinel", description: "Heavy coastal precipitation trigger at Krishna delta river basin", status: "DONE" },
    { time_str: "08:15 IST", event_title: "Demand Forecast Surge Computed", department: "AI Demand Forecaster", description: "Predictive model flags +31% pediatric acute diarrheal cases", status: "DONE" },
    { time_str: "08:30 IST", event_title: "Stock-Out Vulnerability Identified", department: "Inventory Sentinel", description: "ORS stockout predicted in 3.2 days at Machilipatnam Coastal PHC", status: "DONE" },
    { time_str: "08:45 IST", event_title: "Alternative Surplus Located", department: "AI Resource Matching", description: "Tenali CHC (Guntur) identified with 8,400 units surplus (>32 days)", status: "DONE" },
    { time_str: "09:00 IST", event_title: "ILP Optimization Recommendation", department: "Optimization Solver", description: "Generated optimal route via SH-42 detour (+2.2h transit, zero flood exposure)", status: "DONE" },
    { time_str: "09:15 IST", event_title: "Human Director Approval Granted", department: "State Command HQ", description: "Director of Public Health signs dispatch warrant with digital cryptographic audit", status: "DONE" },
    { time_str: "09:30 IST", event_title: "Transfer Workflow & Transit In-Motion", department: "Logistics Telematics", description: "Vehicle AP-07-TJ-4428 departed Tenali depot, ETA 11:45 IST", status: "IN_PROGRESS" },
    { time_str: "11:45 IST", event_title: "Scheduled PHC Arrival & Cold-Chain Handover", department: "Frontline Dispensary", description: "Verification at Machilipatnam pharmacy dispensary dock", status: "SCHEDULED" }
  ];
}

export async function fetchIncidentTasks(): Promise<IncidentTask[]> {
  return [
    { id: "TASK-01", title: "Verify Machilipatnam coastal PHC generator fuel reserve", assignee: "Dr. K. Srinivas", status: "MITIGATING", priority: "CRITICAL" },
    { id: "TASK-02", title: "Pre-position 5,000 ORS units via SH-42 detour", assignee: "Transport Officer Prasad", status: "INVESTIGATING", priority: "CRITICAL" },
    { id: "TASK-03", title: "Activate 40 reserve triage beds at Krishna District Hospital", assignee: "Dr. N. Rajender", status: "OPEN", priority: "HIGH" },
    { id: "TASK-04", title: "Conduct tele-health check on 12 marooned Sub-Centres", assignee: "Staff Nurse Shanti", status: "OPEN", priority: "MEDIUM" },
    { id: "TASK-05", title: "Publish 06:00 IST Morning SITREP Advisory", assignee: "AI Report Synthesizer", status: "RECOVERING", priority: "HIGH" }
  ];
}

export async function fetchPostMortemInsight(): Promise<PostMortemInsight> {
  return {
    incident_id: "FLOOD-2026-001",
    timeline_summary: "Tier-3 Monsoon flash-flood in Krishna district delta causing NH-216 choke, rapid stock exhaustion, and hospital occupancy spike to 91%.",
    root_causes: [
      "Heavy 140mm rainfall in 6 hours breaching Krishna canal bank",
      "Supplier reliance on single primary road corridor (NH-216)",
      "Localized PHC safety stock configured at 10% instead of monsoon protocol 20%"
    ],
    resource_gaps: [
      "ORS deficit of 3,800 units at frontline clinics",
      "Generator diesel reserve below 24-hour threshold at 3 sub-centres",
      "Oxygen backup battery storage needed in coastal wards"
    ],
    response_actions: [
      "Lateral redistribution of 5,000 units from Guntur surplus depot",
      "Rerouting all transit trucks via State Highway 42 corridor",
      "Mobilization of 4 rapid medical triage teams from Vijayawada"
    ],
    bottlenecks_identified: [
      "NH-216 Mile 44 bridge culvert prone to recurring inundation",
      "Manual phone verification delays for inter-district medicine requisitions"
    ],
    preventive_measures: [
      "Auto-trigger monsoon safety buffer increase to 20% on IMD red alert",
      "Pre-clear bilateral transfer MOUs between neighboring district health societies",
      "Install solar-powered IoT cold-chain monitors at all vulnerable coastal PHCs"
    ]
  };
}

export async function fetchPresetScenarios(): Promise<PresetScenario[]> {
  return [
    { id: "SCEN-01", title: "Baseline Normal Operations", category: "Standard", description: "Nominal patient footfall, 90%+ medicine availability, normal transit times.", demand_surge_pct: 0, supply_cut_pct: 0, transport_delay_days: 0, staff_shortage_pct: 0, affected_phcs_est: 0 },
    { id: "SCEN-02", title: "Monsoon Flood Crisis (Tier-3)", category: "Natural Disaster", description: "Coastal flooding, road inundation, diarrheal fever spike, stockout exposure.", demand_surge_pct: 40, supply_cut_pct: 35, transport_delay_days: 3, staff_shortage_pct: 15, affected_phcs_est: 28 },
    { id: "SCEN-03", title: "Coastal Cyclone Landfall", category: "Severe Weather", description: "High wind damage, power grid outage, emergency trauma surge, hospital cut-off.", demand_surge_pct: 55, supply_cut_pct: 60, transport_delay_days: 5, staff_shortage_pct: 25, affected_phcs_est: 44 },
    { id: "SCEN-04", title: "Acute Gastroenteritis Disease Outbreak", category: "Epidemic", description: "Viral/bacterial waterborne outbreak requiring rapid antibiotics and IV fluids.", demand_surge_pct: 65, supply_cut_pct: 10, transport_delay_days: 1, staff_shortage_pct: 20, affected_phcs_est: 35 },
    { id: "SCEN-05", title: "Severe Summer Heatwave", category: "Climate Shock", description: "Extreme heat stress, elderly dehydration, cold-chain refrigeration load stress.", demand_surge_pct: 30, supply_cut_pct: 5, transport_delay_days: 0, staff_shortage_pct: 10, affected_phcs_est: 52 },
    { id: "SCEN-06", title: "Primary API Supplier Plant Shutdown", category: "Supply Chain", description: "Regulatory or manufacturing halt at major supplier factory; 4-week lead time.", demand_surge_pct: 5, supply_cut_pct: 75, transport_delay_days: 7, staff_shortage_pct: 0, affected_phcs_est: 110 },
    { id: "SCEN-07", title: "Regional Central Warehouse Fire/Lockdown", category: "Infrastructure", description: "Major depot offline; inventory re-routing to secondary district hubs.", demand_surge_pct: 0, supply_cut_pct: 50, transport_delay_days: 4, staff_shortage_pct: 5, affected_phcs_est: 85 },
    { id: "SCEN-08", title: "Critical Transport Corridor Strike / Blockade", category: "Logistics", description: "National expressways closed; detour routes operating at 150% transit time.", demand_surge_pct: 0, supply_cut_pct: 40, transport_delay_days: 6, staff_shortage_pct: 0, affected_phcs_est: 62 },
    { id: "SCEN-09", title: "Mass Casualty Patient Surge", category: "Emergency Trauma", description: "Industrial accident or transport derailment; urgent surgical blood & bed demand.", demand_surge_pct: 80, supply_cut_pct: 20, transport_delay_days: 0, staff_shortage_pct: 30, affected_phcs_est: 18 },
    { id: "SCEN-10", title: "Healthcare Worker Seasonal Flu Strike / Shortage", category: "Human Resource", description: "35% of doctors and nursing staff absent due to illness; clinic rationing.", demand_surge_pct: 15, supply_cut_pct: 0, transport_delay_days: 1, staff_shortage_pct: 35, affected_phcs_est: 74 },
    { id: "SCEN-11", title: "Prolonged Power Grid Blackout", category: "Utilities", description: "3-day regional power failure; cold-chain and oxygen concentrators on generators.", demand_surge_pct: 20, supply_cut_pct: 25, transport_delay_days: 2, staff_shortage_pct: 15, affected_phcs_est: 95 }
  ];
}

export async function fetchSustainabilityMetrics(): Promise<SustainabilityMetric> {
  return {
    transport_total_km: 14850,
    cold_chain_kwh: 1240,
    warehouse_kwh: 4850,
    estimated_co2_kg: 3420,
    eco_routing_savings_pct: 16.4
  };
}

export async function fetchSmartRoutes(): Promise<SmartRouteItem[]> {
  return [
    { id: "SR-01", origin: "Vijayawada Central Depot", destination: "Machilipatnam Coastal PHC", primary_route: "NH-216 (Coastal Highway)", primary_status: "WATERLOGGED / BLOCKED", alt_route: "State Highway 42 (Gudivada Corridor)", distance_km: 74.2, eta_hours: 2.2, delay_risk_pct: 88.0 },
    { id: "SR-02", origin: "Guntur Regional Warehouse", destination: "Tenali Urban CHC", primary_route: "Guntur-Tenali Expressway", primary_status: "OPERATIONAL", alt_route: "Chebrolu Rural By-pass", distance_km: 32.5, eta_hours: 0.8, delay_risk_pct: 5.0 },
    { id: "SR-03", origin: "Ongole District Store", destination: "Avanigadda Riverine PHC", primary_route: "NH-16 to NH-216", primary_status: "CONGESTED", alt_route: "Repalle Ferry Cross + SH-44", distance_km: 118.0, eta_hours: 3.6, delay_risk_pct: 42.0 }
  ];
}

export async function fetchLiveVehicles(): Promise<LiveMovingVehicle[]> {
  return [
    { id: "VEH-01", vehicle_no: "AP-07-TJ-4428", origin: "Tenali Depot", destination: "Machilipatnam PHC", cargo: "5,000 ORS Units, 2,000 PCM", current_lat: 16.24, current_lng: 80.64, eta_str: "11:45 IST (1h 15m remaining)", priority: "EMERGENCY" },
    { id: "VEH-02", vehicle_no: "AP-16-BX-9012", origin: "Vijayawada Central", destination: "Guntur Regional Depot", cargo: "20 Oxygen Cylinders", current_lat: 16.51, current_lng: 80.52, eta_str: "12:10 IST (1h 40m remaining)", priority: "HIGH" },
    { id: "VEH-03", vehicle_no: "AP-27-KK-1144", origin: "Ongole District Store", destination: "Avanigadda Clinic", cargo: "3,500 Paracetamol, 600 IV Saline", current_lat: 15.98, current_lng: 80.45, eta_str: "13:30 IST (3h 00m remaining)", priority: "ROUTINE" }
  ];
}

export async function fetchNotifications(): Promise<NotificationItem[]> {
  return [
    { id: "NOTIF-01", channel: "BANNER", title: "Tier-3 Emergency Active", message: "Monsoon flood disaster mode engaged for District Krishna. Lateral redistribution corridors prioritized.", timestamp: "10 mins ago", read: false, severity: "CRITICAL" },
    { id: "NOTIF-02", channel: "IN_APP", title: "New AI Redistribution Recommended", message: "Match #01 ready for human review: 5,000 ORS units from Tenali to Machilipatnam.", timestamp: "25 mins ago", read: false, severity: "WARNING" },
    { id: "NOTIF-03", channel: "TASK", title: "Task Assigned", message: "Dr. Srinivas assigned: Verify generator fuel reserve at coastal sub-centres.", timestamp: "1 hour ago", read: true, severity: "INFO" },
    { id: "NOTIF-04", channel: "EMAIL", title: "[Simulated Email] 06:00 IST Morning SITREP", message: "Daily brief dispatched to Health Commissioner & 51 District Health Officers.", timestamp: "2 hours ago", read: true, severity: "INFO" }
  ];
}

export async function fetchAiStorySlides(): Promise<AiStorySlide[]> {
  return [
    { step_num: 1, title: "Step 1: The Initial Weather Shock", subtitle: "06:00 IST — Torrential Coastal Inundation", narrative: "Unprecedented 140mm rainfall inundated the Krishna river delta. The AI Weather Sentinel detected abnormal rain intensity 4 hours before ground reports arrived.", metric_highlight: "+140mm Rain in 6h", visual_type: "WEATHER_SURGE" },
    { step_num: 2, title: "Step 2: Road Corridor Severance", subtitle: "07:30 IST — NH-216 Bridge Overtopping", narrative: "National Highway 216 was closed to heavy freight at Mile 44. The system automatically flagged a +4.8h delivery delay for all direct pharmaceutical shipments.", metric_highlight: "NH-216 Blocked", visual_type: "ROUTE_BLOCKED" },
    { step_num: 3, title: "Step 3: Rapid Inventory Drawdown", subtitle: "08:15 IST — Acute Fever Outbreak Spike", narrative: "Patient footfall surged +38% at Machilipatnam Coastal PHC. Daily consumption of ORS jumped from 280 to 420 units, collapsing the stock buffer to 3.2 days.", metric_highlight: "3.2 Days to Stockout", visual_type: "INVENTORY_COLLAPSE" },
    { step_num: 4, title: "Step 4: AI P2P Match Identification", subtitle: "08:45 IST — Neighboring Surplus Discovered", narrative: "The AI Resource Matching engine scanned 694 facilities and paired Machilipatnam with Tenali CHC (Guntur), which had 8,400 units in reserve (>32 days).", metric_highlight: "8,400 Units Surplus Found", visual_type: "RESOURCE_MATCH" },
    { step_num: 5, title: "Step 5: Smart Route Optimization", subtitle: "09:00 IST — State Highway 42 Detour Computed", narrative: "The routing engine bypassed the waterlogged highway, selecting State Highway 42. Transit time was reduced to 2.1 hours with 0% flood inundation risk.", metric_highlight: "Transit: 2.1h via SH-42", visual_type: "DETOUR_OPTIMIZATION" },
    { step_num: 6, title: "Step 6: Cryptographic Human Approval", subtitle: "09:15 IST — Director Sign-Off & Dispatch", narrative: "The State Health Director approved the dispatch warrant in one click. An immutable cryptographic audit record was logged and telematics was initiated.", metric_highlight: "1-Click Digital Sign-Off", visual_type: "DISPATCH_AUTHORIZED" }
  ];
}

export async function fetchJudgeFaqs(): Promise<JudgeFaqItem[]> {
  return [
    {
      question: "How does Federated Learning protect patient privacy?",
      concise_answer: "Zero raw patient data or medical records ever leave the PHC edge clinic. Only mathematical weight gradients (ΔW) are transmitted using Differential Privacy (DP-SGD, ε=1.20).",
      technical_details: "Each PHC node trains a local PyTorch/TensorFlow Lite model on local EHR records. Gradients are clipped to norm C=1.0 and Gaussian noise is injected before transmission to the central FedAvg aggregator.",
      category: "Privacy & AI"
    },
    {
      question: "How does the Demand Forecasting model work?",
      concise_answer: "An explainable hybrid LSTM-Gradient Boosted ensemble forecasting across 24h, 7d, 30d, and 90d horizons with 95% Confidence Intervals.",
      technical_details: "Combines 6-month historical baseline, localized weather anomalies, mobile footfall influx, and disease cluster indicators with SHAP-based transparent feature attribution.",
      category: "Machine Learning"
    },
    {
      question: "How does the Resource Optimization engine operate?",
      concise_answer: "An Integer Linear Programming (ILP) solver matching deficit clinics (<3.5 days) with surplus depots (>14 days) while minimizing road transit and cost.",
      technical_details: "Formulated as a multi-commodity network flow problem with capacity, lead time, and FEFO expiry constraints solved in sub-second latency.",
      category: "Optimization"
    },
    {
      question: "How does the platform handle AI uncertainty and avoid hallucinations?",
      concise_answer: "Strict grounding: Arogya Copilot only answers from validated platform telemetry and returns 'I don't have sufficient data' rather than guessing. Actions require human approval.",
      technical_details: "Retrieval-Augmented Generation (RAG) architecture binds responses to verifiable database records, providing supporting metric chips, data lineage, and confidence scores.",
      category: "Responsible AI"
    },
    {
      question: "How does the architecture scale to 10,000+ PHCs pan-India?",
      concise_answer: "Decentralized edge architecture: local nodes handle clinic-level inference; central microservices ingest asynchronous telemetry via lightweight streaming.",
      technical_details: "Cloud-native design ready for Google Cloud Run, Vertex AI, and BigQuery, processing ~1.2 million events daily with sub-second API response times.",
      category: "Scalability"
    }
  ];
}

export async function fetchArchitectureLayers(): Promise<ArchitectureLayer[]> {
  return [
    { id: "LAYER-FE", name: "1. Presentation & Command Layer", tech_stack: ["React 19", "TypeScript", "Tailwind CSS v4", "Recharts", "Lucide Icons"], purpose: "Delivers executive, operational, and technical observability interfaces with sub-second interactivity.", dependencies: ["REST API", "WebSocket Telemetry Mesh"], data_flow: "Browser Client <- HTTP/JSON & WS Push -> Fast Edge CDN" },
    { id: "LAYER-API", name: "2. Core Application & API Mesh", tech_stack: ["Python 3.14", "FastAPI", "Uvicorn ASGI", "Pydantic v2"], purpose: "High-throughput asynchronous API gateway handling validation, RBAC security, and real-time streaming.", dependencies: ["AI Models", "Optimization Solvers", "Synthetic Data Store"], data_flow: "FastAPI Gateway -> Services Layer -> Data Cache" },
    { id: "LAYER-AI", name: "3. Decentralized AI & Federated Engine", tech_stack: ["DP-SGD FedAvg", "PyTorch Edge", "XGBoost", "Scikit-Learn"], purpose: "Privacy-preserving federated model aggregation with Differential Privacy budget ε=1.20.", dependencies: ["Edge PHC Nodes", "Gradient Buffers"], data_flow: "Edge Nodes --(Gradients only)--> Central Aggregator" },
    { id: "LAYER-OPT", name: "4. Optimization & Decision Solvers", tech_stack: ["Integer Linear Programming", "Network Simplex", "Pareto Multi-Objective"], purpose: "Calculates optimal lateral inventory redistributions and multi-echelon routing under supply shocks.", dependencies: ["Ecosystem Graph", "Supply Chain Topology"], data_flow: "Input Matrix -> ILP Solver -> Pareto Recommendation" },
    { id: "LAYER-CLOUD", name: "5. Cloud-Native Enterprise Infrastructure", tech_stack: ["Google Cloud Run", "Vertex AI", "BigQuery", "Pub/Sub", "Cloud Storage"], purpose: "Serverless scalable hosting architecture capable of horizontal auto-scaling from 100 to 10,000+ PHCs.", dependencies: ["Container Registry", "Identity & Access Management"], data_flow: "Pub/Sub Stream -> Cloud Run Workers -> BigQuery Warehouse" }
  ];
}

export async function fetchGoogleCloudMappings(): Promise<GoogleCloudMapping[]> {
  return [
    { component: "Arogya Copilot & Document Intelligence", gcp_service: "Google Vertex AI (Gemini 1.5 Pro / Flash)", architecture_role: "Multimodal document extraction, natural language intent recognition, and multilingual voice synthesis.", cost_tier: "Pay-per-token serverless" },
    { component: "Central Federated Aggregator & Models", gcp_service: "Vertex AI Custom Training / Model Registry", architecture_role: "Manages versioned global models (Arogya-FedNet), tracks drift metrics, and distributes edge binaries.", cost_tier: "On-demand GPU/CPU training" },
    { component: "Pan-India Healthcare Telemetry Lake", gcp_service: "Google Cloud BigQuery", architecture_role: "Serverless petabyte-scale analytics for historical consumption, epidemic trend analysis, and audit trails.", cost_tier: "Active storage & query analysis" },
    { component: "FastAPI Backend & Graph Engine", gcp_service: "Google Cloud Run", architecture_role: "Fully managed container execution auto-scaling from 0 to 1,000 concurrent instances with sub-second scale-up.", cost_tier: "Pay-per-request execution" },
    { component: "Real-Time Telemetry & Sensor Messaging", gcp_service: "Google Cloud Pub/Sub", architecture_role: "Global ingest messaging bus streaming telemetry events from 1,248+ PHC and cold-chain IoT nodes.", cost_tier: "Pay-per-GB streamed" },
    { component: "Document Vault & Model Checkpoints", gcp_service: "Google Cloud Storage (GCS)", architecture_role: "Encrypted object storage for uploaded supply reports, SITREP PDFs, and federated checkpoint weights.", cost_tier: "Regional Standard Tier" }
  ];
}

export async function fetchIotSensorEvents(): Promise<IotSensorEvent[]> {
  return [
    { sensor_id: "IOT-TEMP-04", sensor_type: "COLD_STORAGE", location: "Machilipatnam Coastal PHC (ILR-2)", reading_value: "9.2°C", normal_range: "2.0°C – 8.0°C", is_anomaly: true, timestamp: "2 mins ago" },
    { sensor_id: "IOT-PWR-12", sensor_type: "POWER_GRID", location: "Krishna Delta Sub-Centres", reading_value: "Grid Outage (DG Running)", normal_range: "230V Grid Active", is_anomaly: true, timestamp: "8 mins ago" },
    { sensor_id: "IOT-OXY-01", sensor_type: "EQUIPMENT", location: "Machilipatnam Hospital PSA Plant", reading_value: "93.4% Purity (540 LPM)", normal_range: "90% – 96% Purity", is_anomaly: false, timestamp: "Just now" },
    { sensor_id: "IOT-SCAN-88", sensor_type: "INVENTORY_SCANNER", location: "Tenali Urban CHC Dispensary", reading_value: "Barcode Batch Verified (8,400 ORS)", normal_range: "FEFO Valid", is_anomaly: false, timestamp: "12 mins ago" },
    { sensor_id: "IOT-TEMP-09", sensor_type: "TEMPERATURE", location: "Transit Van AP-07-TJ-4428 Cooler", reading_value: "4.8°C", normal_range: "2.0°C – 8.0°C", is_anomaly: false, timestamp: "Just now" }
  ];
}

export async function executeAgentTask(req: AgentExecutionRequest): Promise<AgentExecutionResponse> {
  const res = await fetch(`${API_BASE}/agents/execute`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req)
  });
  if (!res.ok) {
    throw new Error(`Failed to execute agent task: ${res.statusText}`);
  }
  return await res.json();
}

export async function executeSwarmMission(req: SwarmMissionRequest): Promise<SwarmMissionResponse> {
  const res = await fetch(`${API_BASE}/agents/swarm-mission`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req)
  });
  if (!res.ok) {
    throw new Error(`Failed to launch swarm mission: ${res.statusText}`);
  }
  return await res.json();
}

export async function approveAgentAction(actionId: string, agentId: string): Promise<any> {
  const res = await fetch(`${API_BASE}/agents/approve-action?action_id=${encodeURIComponent(actionId)}&agent_id=${encodeURIComponent(agentId)}`, {
    method: 'POST'
  });
  if (!res.ok) {
    throw new Error(`Failed to approve agent action: ${res.statusText}`);
  }
  return await res.json();
}

// ============================================================
// LIVE INVENTORY API CLIENTS
// ============================================================

export async function fetchLiveInventory(search?: string, risk?: string): Promise<any[]> {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (risk && risk !== 'ALL') params.append('risk', risk);
  const q = params.toString() ? `?${params.toString()}` : '';
  const res = await fetch(`${API_BASE}/inventory${q}`);
  if (!res.ok) throw new Error('Failed to fetch inventory');
  return await res.json();
}

export async function fetchLiveInventorySummary(): Promise<any> {
  const res = await fetch(`${API_BASE}/inventory/summary`);
  if (!res.ok) throw new Error('Failed to fetch inventory summary');
  return await res.json();
}

export async function fetchLiveInventoryChanges(): Promise<any[]> {
  const res = await fetch(`${API_BASE}/inventory/changes`);
  if (!res.ok) throw new Error('Failed to fetch inventory changes');
  return await res.json();
}

// ============================================================
// NATIONAL INCIDENTS API CLIENTS
// ============================================================

export async function fetchNationalIncidents(state?: string, severity?: string): Promise<any[]> {
  const params = new URLSearchParams();
  if (state) params.append('state', state);
  if (severity) params.append('severity', severity);
  const q = params.toString() ? `?${params.toString()}` : '';
  const res = await fetch(`${API_BASE}/incidents${q}`);
  if (!res.ok) throw new Error('Failed to fetch incidents');
  return await res.json();
}

export async function fetchNationalIncidentsSummary(): Promise<any> {
  const res = await fetch(`${API_BASE}/incidents/summary`);
  if (!res.ok) throw new Error('Failed to fetch incidents summary');
  return await res.json();
}

export async function createIncidentPlan(incidentId: string): Promise<any> {
  const res = await fetch(`${API_BASE}/incidents/${encodeURIComponent(incidentId)}/response-plan`, {
    method: 'POST'
  });
  if (!res.ok) throw new Error('Failed to create incident response plan');
  return await res.json();
}

export async function toggleDemoIncidents(enabled: boolean): Promise<any> {
  const res = await fetch(`${API_BASE}/incidents/toggle-demo?enabled=${enabled}`, {
    method: 'POST'
  });
  if (!res.ok) throw new Error('Failed to toggle demo incidents');
  return await res.json();
}



