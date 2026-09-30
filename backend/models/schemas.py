from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class GeoPoint(BaseModel):
    lat: float
    lng: float

class PHC(BaseModel):
    id: str
    name: str
    code: str
    state: str
    district: str
    subdistrict: str
    lat: float
    lng: float
    type: str = "PHC" # PHC, CHC, Sub-Centre
    beds_total: int
    beds_occupied: int
    beds_icu: int
    beds_oxygen: int
    doctors_present: int
    doctors_sanctioned: int
    nurses_present: int
    nurses_sanctioned: int
    pharmacists_present: int
    staff_total: int
    daily_footfall: int
    stock_health_score: float # 0 - 100
    resilience_index: float # 0 - 100
    status: str # NORMAL, WARNING, CRITICAL
    contact_officer: str
    phone: str

class District(BaseModel):
    id: str
    name: str
    state: str
    lat: float
    lng: float
    total_phcs: int
    active_phcs: int
    population: int
    total_beds: int
    beds_occupied: int
    critical_stockouts_count: int
    resilience_score: float
    risk_level: str # LOW, MEDIUM, HIGH, CRITICAL
    avg_daily_footfall: int
    chief_medical_officer: str

class StateSummary(BaseModel):
    id: str
    name: str
    code: str
    total_districts: int
    total_phcs: int
    active_phcs: int
    total_beds: int
    beds_occupied: int
    overall_resilience: float
    critical_alerts_count: int
    active_emergencies: int

class Medicine(BaseModel):
    id: str
    code: str
    name: str
    category: str # Antibiotic, Analgesic, IV Fluid, Vaccine, Chronic, Emergency, Maternal
    dosage_form: str
    unit: str
    essential_nlem: bool = True
    unit_cost: float
    current_stock: int
    min_threshold: int
    reorder_point: int
    safety_stock: int
    daily_consumption_avg: int
    predicted_demand: int
    supplier_lead_time_days: int
    predicted_stockout_days: float
    risk_level: str # LOW, MEDIUM, HIGH, CRITICAL
    batch_number: str
    expiry_date: str
    fefo_priority: str # URGENT_DISPATCH, NORMAL, MONITOR

class DemandForecastPoint(BaseModel):
    date: str
    historical: Optional[float] = None
    predicted: float
    ci_lower: float
    ci_upper: float

class DemandForecast(BaseModel):
    medicine_id: str
    medicine_name: str
    district_name: str
    horizon: str # 24h, 7d, 30d, 90d
    current_demand_rate: float
    predicted_demand_total: float
    trend_pct: float
    confidence_score: float # 0 - 100
    anomaly_detected: bool
    risk_level: str
    points: List[DemandForecastPoint]
    explanation_factors: Dict[str, float] # e.g. {"historical_consumption": 35, "disease_season": 25, "footfall_surge": 20, "nearby_stockout": 12, "weather_shock": 8}
    ai_summary: str

class StockoutPrediction(BaseModel):
    id: str
    medicine_id: str
    medicine_name: str
    category: str
    district_name: str
    phc_name: str
    current_stock: int
    avg_daily_demand: int
    predicted_daily_demand: int
    lead_time_days: int
    safety_stock: int
    reorder_point: int
    predicted_stockout_days: float
    risk_level: str # LOW, MEDIUM, HIGH, CRITICAL
    stockout_date: str
    ai_recommendation: str

class RedistributionRecommendation(BaseModel):
    id: str
    source_district: str
    source_phc: str
    dest_district: str
    dest_phc: str
    medicine_name: str
    quantity: int
    distance_km: float
    estimated_transit_hours: float
    urgency: str # URGENT, HIGH, MEDIUM
    source_excess_days: float
    dest_deficit_days: float
    expected_impact: str
    ai_reasoning: str
    status: str # PENDING, APPROVED, IN_TRANSIT, DELIVERED
    timestamp: str

class EmergencyScenario(BaseModel):
    id: str
    type: str # FLOOD, CYCLONE, OUTBREAK, HEATWAVE, MASS_CASUALTY, SUPPLY_FAILURE
    title: str
    description: str
    severity: str # TIER_1, TIER_2, TIER_3_CRITICAL
    affected_districts: List[str]
    patient_surge_pct: int
    medicine_requirement_surge_pct: int
    bed_requirement_delta: int
    critical_phcs_count: int
    recommended_transfers_count: int
    estimated_response_gap_pct: int
    priority_actions: List[str]
    activated: bool = False

class FederatedRound(BaseModel):
    round_number: int
    timestamp: str
    participating_nodes: int
    model_version: str
    aggregation_loss: float
    accuracy_pct: float
    privacy_epsilon: float
    delta_improvement_pct: float
    data_transmitted_mb: float
    raw_data_shared: str = "0.00 KB (Zero Patient PII)"

class AnomalyItem(BaseModel):
    id: str
    type: str
    phc_id: str
    phc_name: str
    district_name: str
    metric: str
    normal_baseline: float
    current_value: float
    deviation_multiplier: float
    severity: str # WARNING, CRITICAL
    possible_causes: List[str]
    recommended_investigation: str
    detected_at: str

class SupplyChainNode(BaseModel):
    id: str
    name: str
    type: str # CENTRAL_HUB, STATE_DEPOT, DISTRICT_STORE, PHC, SUPPLIER
    lat: float
    lng: float
    district: str
    capacity: int
    utilization_pct: int
    stock_health: str # HEALTHY, MODERATE, VULNERABLE
    inventory_count: int

class SupplyChainEdge(BaseModel):
    id: str
    source_id: str
    target_id: str
    distance_km: float
    transit_time_hours: float
    risk_level: str # LOW, MEDIUM, HIGH
    status: str # ACTIVE, CONGESTED, BLOCKED
    route_name: str

class ResilienceMetric(BaseModel):
    name: str
    score: float # 0 - 100
    weight: float
    status: str
    description: str

class ResilienceScore(BaseModel):
    overall_index: float
    status: str
    components: List[ResilienceMetric]
    disclaimer: str = "Prototype decision-support resilience index based on synthetic healthcare telemetry."

class AuditLog(BaseModel):
    id: str
    timestamp: str
    user_name: str
    role: str
    action: str
    resource: str
    previous_state: Optional[str] = None
    new_state: Optional[str] = None
    ip_address: str = "10.0.4.12"
    status: str = "SUCCESS"

class CopilotQueryRequest(BaseModel):
    query: str
    language: str = "en" # en, hi, te
    role: str = "National Health Administrator"
    context: Optional[Dict[str, Any]] = None

class CopilotResponse(BaseModel):
    answer: str
    language: str
    supporting_metrics: List[Dict[str, Any]]
    recommended_actions: List[str]
    suggested_followups: List[str]
    chart_type: Optional[str] = None
    chart_data: Optional[List[Dict[str, Any]]] = None
    explanation: str

class SimulationParams(BaseModel):
    patient_demand_delta_pct: int = 40 # +10 to +60
    supply_disruption_pct: int = 20    # 0 to 80
    transport_delay_days: int = 2      # 0 to 7
    staff_shortage_pct: int = 15       # 0 to 50
    affected_districts: Optional[List[str]] = None

class SimulationResult(BaseModel):
    scenario_name: str
    baseline: Dict[str, Any]
    projected: Dict[str, Any]
    net_changes: Dict[str, Any]
    critical_phcs_impacted: int
    additional_beds_needed: int
    expected_stockout_items: int
    recommended_transfers: List[RedistributionRecommendation]
    recommended_interventions: List[str]

# ====================================================
# ADVANCED NEXT-GEN EXPANSION SCHEMAS
# ====================================================

class AutonomousAgent(BaseModel):
    id: str
    name: str
    role: str
    status: str # ACTIVE, IDLE, PROCESSING, WARNING
    current_task: str
    last_execution: str
    confidence: float # 0 - 100
    detected_issues: int
    recommendations_count: int
    avatar_color: str
    activity_log: List[str]

class AgentCollaborationMessage(BaseModel):
    id: str
    agent_id: str
    agent_name: str
    role: str
    content: str
    timestamp: str
    sentiment: str # INFO, ALERT, CONSENSUS, PROPOSAL
    linked_district: Optional[str] = None

class ResilienceBrainSignal(BaseModel):
    id: str
    category: str # INVENTORY, DEMAND, CAPACITY, ROUTE, CLIMATE, STAFF
    source: str
    signal_name: str
    value: str
    delta_pct: float
    status: str # HEALTHY, ELEVATED, CRITICAL
    timestamp: str
    summary: str

class CascadeNode(BaseModel):
    id: str
    title: str
    layer: str # PRIMARY, SECONDARY, TERTIARY
    entity_type: str # WAREHOUSE, PHC, TRANSPORT, POPULATION
    failure_mode: str
    severity: str # WARNING, CRITICAL
    latency_hours: float
    affected_nodes_count: int
    description: str

class CascadeSimulationResult(BaseModel):
    trigger_event: str
    root_cause_facility: str
    primary_impacts: List[CascadeNode]
    secondary_impacts: List[CascadeNode]
    tertiary_impacts: List[CascadeNode]
    total_facilities_vulnerable: int
    estimated_population_impacted: int
    containment_actions: List[str]

class EarlyWarningItem(BaseModel):
    id: str
    level: int # 1 = WATCH, 2 = WARNING, 3 = HIGH_RISK, 4 = CRITICAL, 5 = EMERGENCY
    level_label: str
    title: str
    category: str
    district_name: str
    time_horizon_hours: int
    confidence_pct: float
    contributing_factors: List[str]
    affected_resources: List[str]
    suggested_mitigation: str
    detected_at: str

class SmartProcurementItem(BaseModel):
    id: str
    medicine_id: str
    medicine_name: str
    category: str
    current_stock: int
    daily_consumption: int
    reorder_point: int
    economic_order_quantity: int
    recommended_order_quantity: int
    supplier_name: str
    lead_time_days: int
    unit_cost: float
    total_estimated_cost_inr: float
    urgency: str # URGENT, HIGH, SCHEDULED
    procurement_reason: str
    status: str # PENDING_APPROVAL, ORDERED, IN_TRANSIT

class SupplierProfile(BaseModel):
    id: str
    name: str
    headquarters: str
    delivery_reliability_pct: float
    avg_delay_days: float
    order_fulfillment_pct: float
    active_contracts_count: int
    risk_level: str # LOW, MEDIUM, HIGH
    historical_performance: str # IMPROVING, STABLE, DECLINING
    lead_time_standard_days: int
    primary_catalog: List[str]
    status_alert: Optional[str] = None

class AlternativeRoute(BaseModel):
    id: str
    primary_route_name: str
    primary_status: str # BLOCKED, CONGESTED, NORMAL
    alternative_route_name: str
    detour_distance_km: float
    extra_transit_hours: float
    capacity_pct: int
    risk_level: str # LOW, MEDIUM, HIGH
    reason: str
    recommended: bool

class SwapMarketOffer(BaseModel):
    id: str
    district_name: str
    phc_name: str
    type: str # SURPLUS, NEED
    medicine_name: str
    quantity: int
    days_buffer: float
    urgency: str
    compatibility_score: float # 0 - 100
    matched_district: Optional[str] = None
    status: str # OPEN, MATCHED, EXECUTING

class EmergencyPlaybook(BaseModel):
    id: str
    disaster_type: str # FLOOD, CYCLONE, HEATWAVE, OUTBREAK, CASUALTY
    title: str
    trigger_criteria: str
    immediate_actions: List[str]
    priority_phcs: List[str]
    resource_requirements: Dict[str, str]
    recovery_milestones: List[str]
    active_phase: str # RESPONSE, RECOVERY, INACTIVE

class RootCauseFactor(BaseModel):
    name: str
    contribution_pct: float
    observed_metric: str
    baseline_metric: str
    category: str
    explanation: str

class RootCauseDiagnostic(BaseModel):
    incident_id: str
    title: str
    district_name: str
    phc_name: str
    primary_symptom: str
    factors: List[RootCauseFactor]
    causal_chain: List[str]
    suggested_countermeasures: List[str]

class DecisionOption(BaseModel):
    id: str
    label: str
    strategy: str # LATERAL_REDISTRIBUTION, EMERGENCY_PURCHASE, ALTERNATE_SUPPLIER, REGIONAL_STOCKPILE
    time_to_impact_hours: float
    resources_affected: str
    shortage_reduction_pct: int
    transport_complexity: str # LOW, MODERATE, HIGH
    financial_cost_inr: float
    feasibility_score: int # 0 - 100
    pros: List[str]
    cons: List[str]

class MedicalEquipment(BaseModel):
    id: str
    name: str
    category: str # OXYGEN_PLANT, REFRIGERATION, GENERATOR, VENTILATOR
    phc_id: str
    phc_name: str
    district_name: str
    age_years: float
    usage_hours_daily: float
    maintenance_health_score: float # 0 - 100
    status: str # OPERATIONAL, MAINTENANCE_DUE, AT_RISK
    failure_probability_pct: float
    next_service_due: str

class ColdChainSensor(BaseModel):
    id: str
    facility_name: str
    district_name: str
    storage_type: str # ILR_VACCINE, DEEP_FREEZER, BLOOD_BANK
    current_temp_c: float
    min_safe_temp_c: float = 2.0
    max_safe_temp_c: float = 8.0
    status: str # NORMAL, WARNING, BREACH
    vaccine_doses_secured: int
    last_ping: str
    backup_power_ready: bool

class EnergyResilienceMetric(BaseModel):
    id: str
    facility_name: str
    district_name: str
    grid_power_status: str # ONLINE, FLUCTUATING, OUTAGE
    diesel_generator_hours_left: float
    solar_battery_storage_kwh: float
    critical_load_supported_hours: float
    risk_level: str

class ModelObservatoryMetric(BaseModel):
    model_id: str
    name: str
    version: str
    last_trained: str
    accuracy_pct: float
    drift_level_pct: float
    inference_latency_ms: float
    daily_predictions_count: int
    status: str # OPTIMAL, MONITOR_DRIFT, RETRAINING_RECOMMENDED

class DataQualityMetric(BaseModel):
    overall_quality_score: float # 0 - 100
    missing_telemetry_fields: int
    duplicate_records_flagged: int
    impossible_values_filtered: int
    stale_sensors_count: int
    outliers_detected: int
    total_records_processed: int
    last_audit_run: str

# ====================================================
# GENERATIVE & AGENTIC INTERACTIVE SCHEMAS
# ====================================================

class AgentToolCall(BaseModel):
    tool_name: str
    parameters: Dict[str, Any] = Field(default_factory=dict)
    result: Any
    execution_time_ms: int

class AgentThoughtStep(BaseModel):
    step_number: int
    title: str
    thought: str
    tool_call: Optional[AgentToolCall] = None
    observation: Optional[str] = None

class AgentActionProposal(BaseModel):
    id: str
    title: str
    action_type: str # DISPATCH_CONVOY, FEFO_TRANSFER, SURGE_BED_REALLOCATION, SIGN_BRIEF
    target_entities: List[str]
    quantity: Optional[int] = None
    risk_mitigated: str
    status: str = "PROPOSED" # PROPOSED, APPROVED, EXECUTED
    confidence: float

class AgentExecutionRequest(BaseModel):
    agent_id: str
    prompt: str
    autonomy_level: str = "SEMI_AUTONOMOUS" # SEMI_AUTONOMOUS, AUTONOMOUS
    reasoning_depth: str = "STANDARD" # STANDARD, DEEP_COT
    temperature: float = 0.4
    context: Optional[Dict[str, Any]] = None

class AgentExecutionResponse(BaseModel):
    execution_id: str
    agent_id: str
    agent_name: str
    status: str
    thought_chain: List[AgentThoughtStep]
    generative_summary: str
    generated_deliverables: Dict[str, Any] = Field(default_factory=dict)
    proposed_actions: List[AgentActionProposal] = Field(default_factory=list)
    confidence: float
    execution_duration_sec: float
    timestamp: str

class SwarmMissionStep(BaseModel):
    agent_id: str
    agent_name: str
    role: str
    status: str
    input_from_previous: str
    reasoning: str
    output_generated: str
    handoff_to_next: str
    timestamp: str

class SwarmMissionRequest(BaseModel):
    mission_id: Optional[str] = None
    title: Optional[str] = None
    objective: str
    region: str = "Coastal Andhra Pradesh"
    hazard_type: str = "CYCLONE"
    severity: str = "CRITICAL"

class SwarmMissionResponse(BaseModel):
    mission_id: str
    title: str
    objective: str
    region: str
    severity: str
    overall_status: str
    steps: List[SwarmMissionStep]
    consensus_score: float
    executive_verdict: str
    final_action_plan: List[Dict[str, Any]]
    timestamp: str


