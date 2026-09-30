export interface PHC {
  id: string;
  name: string;
  code: string;
  state: string;
  district: string;
  subdistrict: string;
  lat: number;
  lng: number;
  type: 'PHC' | 'CHC' | 'Sub-Centre';
  beds_total: number;
  beds_occupied: number;
  beds_icu: number;
  beds_oxygen: number;
  doctors_present: number;
  doctors_sanctioned: number;
  nurses_present: number;
  nurses_sanctioned: number;
  pharmacists_present: number;
  staff_total: number;
  daily_footfall: number;
  stock_health_score: number;
  resilience_index: number;
  status: 'NORMAL' | 'WARNING' | 'CRITICAL';
  contact_officer: string;
  phone: string;
}

export interface District {
  id: string;
  name: string;
  state: string;
  lat: number;
  lng: number;
  total_phcs: number;
  active_phcs: number;
  population: number;
  total_beds: number;
  beds_occupied: number;
  critical_stockouts_count: number;
  resilience_score: number;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  avg_daily_footfall: number;
  chief_medical_officer: string;
}

export interface StateSummary {
  id: string;
  name: string;
  code: string;
  total_districts: number;
  total_phcs: number;
  active_phcs: number;
  total_beds: number;
  beds_occupied: number;
  overall_resilience: number;
  critical_alerts_count: number;
  active_emergencies: number;
}

export interface Medicine {
  id: string;
  code: string;
  name: string;
  category: string;
  dosage_form: string;
  unit: string;
  essential_nlem: boolean;
  unit_cost: number;
  current_stock: number;
  min_threshold: number;
  reorder_point: number;
  safety_stock: number;
  daily_consumption_avg: number;
  predicted_demand: number;
  supplier_lead_time_days: number;
  predicted_stockout_days: number;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  batch_number: string;
  expiry_date: string;
  fefo_priority: 'URGENT_DISPATCH' | 'NORMAL' | 'MONITOR';
}

export interface DemandForecastPoint {
  date: string;
  historical?: number | null;
  predicted: number;
  ci_lower: number;
  ci_upper: number;
}

export interface DemandForecast {
  medicine_id: string;
  medicine_name: string;
  district_name: string;
  horizon: '24h' | '7d' | '30d' | '90d';
  current_demand_rate: number;
  predicted_demand_total: number;
  trend_pct: number;
  confidence_score: number;
  anomaly_detected: boolean;
  risk_level: string;
  points: DemandForecastPoint[];
  explanation_factors: Record<string, number>;
  ai_summary: string;
}

export interface StockoutPrediction {
  id: string;
  medicine_id: string;
  medicine_name: string;
  category: string;
  district_name: string;
  phc_name: string;
  current_stock: number;
  avg_daily_demand: number;
  predicted_daily_demand: number;
  lead_time_days: number;
  safety_stock: number;
  reorder_point: number;
  predicted_stockout_days: number;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  stockout_date: string;
  ai_recommendation: string;
}

export interface RedistributionRecommendation {
  id: string;
  source_district: string;
  source_phc: string;
  dest_district: string;
  dest_phc: string;
  medicine_name: string;
  quantity: number;
  distance_km: number;
  estimated_transit_hours: number;
  urgency: 'URGENT' | 'HIGH' | 'MEDIUM';
  source_excess_days: number;
  dest_deficit_days: number;
  expected_impact: string;
  ai_reasoning: string;
  status: 'PENDING' | 'APPROVED' | 'IN_TRANSIT' | 'DELIVERED';
  timestamp: string;
}

export interface EmergencyScenario {
  id: string;
  type: string;
  title: string;
  description: string;
  severity: 'TIER_1' | 'TIER_2' | 'TIER_3_CRITICAL';
  affected_districts: string[];
  patient_surge_pct: number;
  medicine_requirement_surge_pct: number;
  bed_requirement_delta: number;
  critical_phcs_count: number;
  recommended_transfers_count: number;
  estimated_response_gap_pct: number;
  priority_actions: string[];
  activated: boolean;
}

export interface FederatedRound {
  round_number: number;
  timestamp: string;
  participating_nodes: number;
  model_version: string;
  aggregation_loss: number;
  accuracy_pct: number;
  privacy_epsilon: number;
  delta_improvement_pct: number;
  data_transmitted_mb: number;
  raw_data_shared: string;
}

export interface AnomalyItem {
  id: string;
  type: string;
  phc_id: string;
  phc_name: string;
  district_name: string;
  metric: string;
  normal_baseline: number;
  current_value: number;
  deviation_multiplier: number;
  severity: 'WARNING' | 'CRITICAL';
  possible_causes: string[];
  recommended_investigation: string;
  detected_at: string;
}

export interface SupplyChainNode {
  id: string;
  name: string;
  type: 'CENTRAL_HUB' | 'STATE_DEPOT' | 'DISTRICT_STORE' | 'PHC' | 'SUPPLIER';
  lat: number;
  lng: number;
  district: string;
  capacity: number;
  utilization_pct: number;
  stock_health: 'HEALTHY' | 'MODERATE' | 'VULNERABLE';
  inventory_count: number;
}

export interface SupplyChainEdge {
  id: string;
  source_id: string;
  target_id: string;
  distance_km: number;
  transit_time_hours: number;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'ACTIVE' | 'CONGESTED' | 'BLOCKED';
  route_name: string;
}

export interface ResilienceMetric {
  name: string;
  score: number;
  weight: number;
  status: string;
  description: string;
}

export interface ResilienceScore {
  overall_index: number;
  status: string;
  components: ResilienceMetric[];
  disclaimer: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user_name: string;
  role: string;
  action: string;
  resource: string;
  previous_state?: string;
  new_state?: string;
  ip_address: string;
  status: string;
}

export interface SimulationParams {
  patient_demand_delta_pct: number;
  supply_disruption_pct: number;
  transport_delay_days: number;
  staff_shortage_pct: number;
  affected_districts?: string[];
}

export interface SimulationResult {
  scenario_name: string;
  baseline: Record<string, any>;
  projected: Record<string, any>;
  net_changes: Record<string, any>;
  critical_phcs_impacted: number;
  additional_beds_needed: number;
  expected_stockout_items: number;
  recommended_transfers: RedistributionRecommendation[];
  recommended_interventions: string[];
}

export interface CopilotResponse {
  answer: string;
  language: string;
  supporting_metrics: Array<{ label: string; value: string; badge?: string }>;
  recommended_actions: string[];
  suggested_followups: string[];
  chart_type?: string;
  chart_data?: any[];
  explanation: string;
}

export type Role =
  | 'National Health Administrator'
  | 'State Health Administrator'
  | 'District Health Officer'
  | 'PHC Administrator'
  | 'Supply Chain Manager'
  | 'Emergency Response Coordinator'
  | 'Data/AI Analyst';

export type Language = 'en' | 'hi' | 'te';

// ============================================================
// NEXT-GENERATION TYPES
// ============================================================

export interface AutonomousAgent {
  id: string;
  name: string;
  role: string;
  status: 'ACTIVE' | 'PROCESSING' | 'IDLE' | 'ALERT';
  current_task: string;
  last_execution: string;
  confidence: number;
  detected_issues: number;
  recommendations_count: number;
  avatar_color: string;
  activity_log: string[];
}

export interface AgentCollaborationMessage {
  id: string;
  sender_agent: string;
  timestamp: string;
  content: string;
  sentiment: 'ALERT' | 'INFO' | 'PROPOSAL' | 'CONSENSUS';
  affected_resource: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM';
}

export interface ResilienceBrainSignal {
  id: string;
  category: 'INVENTORY' | 'DEMAND' | 'CAPACITY' | 'LOGISTICS' | 'WEATHER' | 'WORKFORCE';
  stage: 'LIVE_SIGNAL' | 'AI_ANALYSIS' | 'RISK_DETECTION' | 'FORECAST' | 'OPTIMIZATION' | 'RECOMMENDATION';
  title: string;
  observation: string;
  prediction: string;
  risk_score: number;
  opportunity: string;
  recommended_action: string;
  confidence: number;
  timestamp: string;
}

export interface CascadeNode {
  id: string;
  name: string;
  level: 'PRIMARY' | 'SECONDARY' | 'TERTIARY';
  status: 'FAILED' | 'DEGRADED' | 'AT_RISK' | 'STABLE';
  impact_description: string;
  affected_metric: string;
  delay_or_deficit: string;
}

export interface CascadeSimulationResult {
  trigger_event: string;
  root_cause_facility: string;
  primary_impacts: CascadeNode[];
  secondary_impacts: CascadeNode[];
  tertiary_impacts: CascadeNode[];
  total_facilities_vulnerable: number;
  estimated_population_impacted: number;
  containment_actions: string[];
}

export interface EarlyWarningItem {
  id: string;
  level: 1 | 2 | 3 | 4 | 5;
  level_name: 'WATCH' | 'WARNING' | 'HIGH_RISK' | 'CRITICAL' | 'EMERGENCY';
  category: string;
  facility_or_district: string;
  metric_name: string;
  current_value: string;
  threshold_value: string;
  horizon_hours: number;
  confidence: number;
  evolution_trend: 'INCREASING' | 'STABLE' | 'DECREASING';
  mitigation_action: string;
}

export interface SmartProcurementItem {
  id: string;
  medicine_code: string;
  medicine_name: string;
  current_stock: number;
  reorder_point: number;
  safety_stock: number;
  economic_order_qty: number;
  supplier_lead_time_days: number;
  urgency: 'HIGH' | 'MEDIUM' | 'NORMAL';
  projected_demand_30d: number;
  estimated_cost_inr: number;
  preferred_supplier: string;
  ai_rationale: string;
}

export interface SupplierProfile {
  id: string;
  name: string;
  tier: 'PRIMARY' | 'SECONDARY' | 'CONTINGENCY';
  delivery_reliability_pct: number;
  average_delay_days: number;
  order_fulfillment_pct: number;
  lead_time_days: number;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
  active_contracts: number;
  specialty_catalog: string[];
}

export interface AlternativeRoute {
  id: string;
  origin: string;
  destination: string;
  primary_route_name: string;
  primary_route_status: 'BLOCKED' | 'WATERLOGGED' | 'CONGESTED' | 'OPERATIONAL';
  alt_route_name: string;
  alt_distance_km: number;
  alt_delivery_time_delta_hrs: number;
  alt_capacity_status: string;
  risk_index: number;
}

export interface SwapMarketOffer {
  id: string;
  district_name: string;
  phc_name: string;
  type: 'SURPLUS' | 'NEED';
  medicine_name: string;
  quantity: number;
  days_buffer: number;
  urgency: 'URGENT' | 'HIGH' | 'LOW';
  compatibility_score: number;
  matched_district: string;
  status: 'OPEN' | 'MATCHED' | 'TRANSFERRED';
}

export interface EmergencyPlaybook {
  id: string;
  disaster_type: string;
  title: string;
  trigger_criteria: string;
  immediate_actions: string[];
  priority_phcs: string[];
  resource_requirements: Record<string, string>;
  recovery_milestones: string[];
  active_phase: 'RESPONSE' | 'RECOVERY' | 'INACTIVE';
}

export interface MedicalEquipment {
  id: string;
  name: string;
  category: 'OXYGEN_PLANT' | 'REFRIGERATION' | 'GENERATOR' | 'VENTILATOR' | 'DIAGNOSTIC';
  phc_id: string;
  phc_name: string;
  district_name: string;
  age_years: number;
  usage_hours_daily: number;
  maintenance_health_score: number;
  status: 'OPERATIONAL' | 'MAINTENANCE_DUE' | 'CRITICAL_RISK';
  failure_probability_pct: number;
  next_service_due: string;
}

export interface ColdChainSensor {
  id: string;
  facility_name: string;
  district_name: string;
  storage_type: string;
  current_temp_c: number;
  min_safe_temp_c: number;
  max_safe_temp_c: number;
  status: 'NORMAL' | 'WARNING' | 'BREACH';
  vaccine_doses_secured: number;
  last_ping: string;
  backup_power_ready: boolean;
}

export interface EnergyResilienceMetric {
  id: string;
  facility_name: string;
  district_name: string;
  grid_power_status: 'OPERATIONAL' | 'OUTAGE' | 'FLUCTUATING';
  diesel_generator_hours_left: number;
  solar_battery_storage_kwh: number;
  critical_load_supported_hours: number;
  risk_level: 'HEALTHY' | 'MODERATE' | 'CRITICAL';
}

export interface ModelObservatoryMetric {
  model_id: string;
  name: string;
  version: string;
  last_trained: string;
  accuracy_pct: number;
  drift_level_pct: number;
  inference_latency_ms: number;
  daily_predictions_count: number;
  status: 'OPTIMAL' | 'MONITOR_DRIFT' | 'RETRAINING_RECOMMENDED';
}

export interface DataQualityMetric {
  overall_quality_score: number;
  missing_telemetry_fields: number;
  duplicate_records_flagged: number;
  impossible_values_filtered: number;
  stale_sensors_count: number;
  outliers_detected: number;
  total_records_processed: number;
  last_audit_run: string;
}

export interface RootCauseFactor {
  name: string;
  contribution_pct: number;
  observed_metric: string;
  baseline_metric: string;
  category: string;
  explanation: string;
}

export interface RootCauseDiagnostic {
  incident_id: string;
  title: string;
  district_name: string;
  phc_name: string;
  primary_symptom: string;
  factors: RootCauseFactor[];
  causal_chain: string[];
  suggested_countermeasures: string[];
}

export interface DecisionOption {
  id: string;
  label: string;
  strategy: string;
  time_to_impact_hours: number;
  resources_affected: string;
  shortage_reduction_pct: number;
  transport_complexity: 'LOW' | 'MODERATE' | 'HIGH';
  financial_cost_inr: number;
  feasibility_score: number;
  pros: string[];
  cons: string[];
}

export interface ScalabilityMetrics {
  phc_scale: number;
  daily_telemetry_events: number;
  data_throughput_gb_day: number;
  ai_inference_calls_daily: number;
  federated_edge_nodes: number;
  active_supply_corridors: number;
  simulated_sub_seconds_latency_ms: number;
  server_clusters_required: number;
  resilience_engine_capacity_pct: number;
  estimated_annual_cost_savings_inr_crores: number;
  prevented_critical_stockouts_annually: number;
}

// ============================================================
// ULTRA-ADVANCED HEALTHCARE RESILIENCE TYPES (90-MODULE PACK)
// ============================================================

export type EcosystemNodeType =
  | 'PHC' | 'DISTRICT' | 'STATE' | 'WAREHOUSE'
  | 'SUPPLIER' | 'MEDICINE' | 'BED' | 'PERSONNEL'
  | 'ROUTE' | 'EMERGENCY' | 'DEMAND';

export interface EcosystemNode {
  id: string;
  name: string;
  type: EcosystemNodeType;
  status: 'HEALTHY' | 'WARNING' | 'CRITICAL' | 'BLOCKED';
  risk_score: number;
  connections_count: number;
  lat?: number;
  lng?: number;
  details: string;
}

export interface EcosystemEdge {
  id: string;
  source: string;
  target: string;
  relationship: string;
  weight: number;
  latency_hrs: number;
  status: 'ACTIVE' | 'CONGESTED' | 'FAILED';
  is_bottleneck: boolean;
}

export interface PropagationStep {
  step_num: number;
  title: string;
  facility: string;
  status: 'FAILED' | 'DEGRADED' | 'CRITICAL';
  effect: string;
  severity: 'HIGH' | 'CRITICAL' | 'CATASTROPHIC';
}

export interface ResourceMatchProposal {
  id: string;
  surplus_district: string;
  surplus_phc: string;
  need_district: string;
  need_phc: string;
  resource_name: string;
  quantity: number;
  distance_km: number;
  transit_hours: number;
  expiry_date: string;
  urgency: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  compatibility_score: number;
  reasoning: string;
}

export interface ParetoObjectiveTradeoff {
  id: string;
  strategy_name: string;
  transit_hours: number;
  stockout_risk_pct: number;
  transport_cost_inr: number;
  coverage_pct: number;
  readiness_score: number;
  wastage_risk_pct: number;
  recommended: boolean;
  tradeoff_explanation: string;
}

export interface AuctionScenario {
  id: string;
  title: string;
  resource_name: string;
  total_units: number;
  allocations: Array<{
    district: string;
    allocated: number;
    need: number;
    urgency: string;
    travel_time_hrs: number;
    rationale: string;
  }>;
}

export interface FutureBottleneck {
  id: string;
  facility_name: string;
  facility_type: string;
  current_utilization_pct: number;
  predicted_utilization_5d: number;
  risk_window: string;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  expected_inflow: number;
  expected_demand: number;
}

export interface ResourceWastageRisk {
  id: string;
  resource_type: 'OVERSTOCK' | 'EXPIRY' | 'UNUSED_BEDS' | 'UNDERUTILIZED_EQUIPMENT' | 'IDLE_STAFF';
  facility_name: string;
  estimated_quantity: number;
  unit: string;
  potential_loss_inr: number;
  time_window: string;
  recommended_action: string;
}

export interface BatchExpiryItem {
  batch_id: string;
  medicine_name: string;
  quantity: number;
  expiry_date: string;
  current_phc: string;
  consumption_rate_daily: number;
  days_to_expiry: number;
  expiry_risk: 'CRITICAL' | 'HIGH' | 'LOW';
  recommended_dest_phc: string;
}

export interface EdgeNodeInfo {
  id: string;
  phc_name: string;
  district: string;
  is_online: boolean;
  local_inference_count: number;
  model_version: string;
  last_sync: string;
  pending_updates: number;
  sync_status: 'LOCAL_MODE' | 'SYNCING' | 'SYNC_COMPLETE';
}

export interface ChampionChallengerModel {
  model_id: string;
  name: string;
  mae_error: number;
  latency_ms: number;
  stability_score: number;
  data_requirements: string;
  status: string;
}

export interface ContinuousLearningStage {
  stage: string;
  name: string;
  status: 'IDLE' | 'RUNNING' | 'COMPLETED';
  metric: string;
  latency_ms: number;
}

export interface ExtractedDocData {
  id: string;
  filename: string;
  doc_type: 'SUPPLY_REPORT' | 'DISTRICT_CENSUS' | 'EMERGENCY_BULLETIN';
  upload_time: string;
  extracted_tables: any[];
  extracted_entities: Record<string, string>;
  confidence_pct: number;
  status: 'PENDING_VERIFICATION' | 'APPROVED' | 'REJECTED';
}

export interface ReconciliationDiscrepancy {
  id: string;
  item_name: string;
  warehouse_qty: number;
  district_qty: number;
  system_qty: number;
  variance_pct: number;
  status: 'FLAGGED' | 'RESOLVED';
  suggested_resolution: string;
}

export interface DataLineageItem {
  metric_name: string;
  source: string;
  timestamp: string;
  transformation: string;
  model: string;
  prediction_output: string;
}

export interface SecurityEventItem {
  id: string;
  event_type: 'FAILED_LOGIN' | 'SUSPICIOUS_API' | 'UNAUTHORIZED_ATTEMPT' | 'PRIVILEGE_CHANGE' | 'UNUSUAL_ACCESS';
  actor: string;
  ip: string;
  timestamp: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'ACTIVE' | 'CONTAINED';
}

export interface DigitalSignatureApproval {
  audit_id: string;
  workflow_title: string;
  requested_by: string;
  reviewed_by: string;
  approved_by: string;
  timestamp: string;
  cryptographic_hash: string;
  status: 'SIGNED' | 'PENDING';
}

export interface CrisisTimelineEvent {
  time_str: string;
  event_title: string;
  department: string;
  description: string;
  status: 'DONE' | 'IN_PROGRESS' | 'SCHEDULED';
}

export interface IncidentTask {
  id: string;
  title: string;
  assignee: string;
  status: 'OPEN' | 'INVESTIGATING' | 'MITIGATING' | 'RECOVERING' | 'CLOSED';
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM';
}

export interface PostMortemInsight {
  incident_id: string;
  timeline_summary: string;
  root_causes: string[];
  resource_gaps: string[];
  response_actions: string[];
  bottlenecks_identified: string[];
  preventive_measures: string[];
}

export interface PresetScenario {
  id: string;
  title: string;
  category: string;
  description: string;
  demand_surge_pct: number;
  supply_cut_pct: number;
  transport_delay_days: number;
  staff_shortage_pct: number;
  affected_phcs_est: number;
}

export interface SustainabilityMetric {
  transport_total_km: number;
  cold_chain_kwh: number;
  warehouse_kwh: number;
  estimated_co2_kg: number;
  eco_routing_savings_pct: number;
}

export interface SmartRouteItem {
  id: string;
  origin: string;
  destination: string;
  primary_route: string;
  primary_status: string;
  alt_route: string;
  distance_km: number;
  eta_hours: number;
  delay_risk_pct: number;
}

export interface LiveMovingVehicle {
  id: string;
  vehicle_no: string;
  origin: string;
  destination: string;
  cargo: string;
  current_lat: number;
  current_lng: number;
  eta_str: string;
  priority: 'EMERGENCY' | 'HIGH' | 'ROUTINE';
}

export interface NotificationItem {
  id: string;
  channel: 'DASHBOARD' | 'EMAIL' | 'IN_APP' | 'BANNER' | 'TASK';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
}

export interface DashboardWidgetConfig {
  id: string;
  title: string;
  visible: boolean;
  order: number;
  size: 'small' | 'medium' | 'large';
}

export interface AiStorySlide {
  step_num: number;
  title: string;
  subtitle: string;
  narrative: string;
  metric_highlight: string;
  visual_type: string;
}

export interface JudgeFaqItem {
  question: string;
  concise_answer: string;
  technical_details: string;
  category: string;
}

export interface ArchitectureLayer {
  id: string;
  name: string;
  tech_stack: string[];
  purpose: string;
  dependencies: string[];
  data_flow: string;
}

export interface GoogleCloudMapping {
  component: string;
  gcp_service: string;
  architecture_role: string;
  cost_tier: string;
}

export interface IotSensorEvent {
  sensor_id: string;
  sensor_type: 'TEMPERATURE' | 'INVENTORY_SCANNER' | 'POWER_GRID' | 'COLD_STORAGE' | 'EQUIPMENT';
  location: string;
  reading_value: string;
  normal_range: string;
  is_anomaly: boolean;
  timestamp: string;
}

// ====================================================
// GENERATIVE & INTERACTIVE AGENT TYPES
// ====================================================

export interface AgentToolCall {
  tool_name: string;
  parameters: Record<string, any>;
  result: any;
  execution_time_ms: number;
}

export interface AgentThoughtStep {
  step_number: number;
  title: string;
  thought: string;
  tool_call?: AgentToolCall;
  observation?: string;
}

export interface AgentActionProposal {
  id: string;
  title: string;
  action_type: 'DISPATCH_CONVOY' | 'FEFO_TRANSFER' | 'SURGE_BED_REALLOCATION' | 'SIGN_BRIEF' | string;
  target_entities: string[];
  quantity?: number;
  risk_mitigated: string;
  status: 'PROPOSED' | 'APPROVED' | 'EXECUTED';
  confidence: number;
}

export interface AgentExecutionRequest {
  agent_id: string;
  prompt: string;
  autonomy_level?: 'SEMI_AUTONOMOUS' | 'AUTONOMOUS';
  reasoning_depth?: 'STANDARD' | 'DEEP_COT';
  temperature?: number;
  context?: Record<string, any>;
}

export interface AgentExecutionResponse {
  execution_id: string;
  agent_id: string;
  agent_name: string;
  status: string;
  thought_chain: AgentThoughtStep[];
  generative_summary: string;
  generated_deliverables: Record<string, any>;
  proposed_actions: AgentActionProposal[];
  confidence: number;
  execution_duration_sec: number;
  timestamp: string;
}

export interface SwarmMissionStep {
  agent_id: string;
  agent_name: string;
  role: string;
  status: 'COMPLETED' | 'ACTIVE' | 'PENDING';
  input_from_previous: string;
  reasoning: string;
  output_generated: string;
  handoff_to_next: string;
  timestamp: string;
}

export interface SwarmMissionRequest {
  mission_id?: string;
  title?: string;
  objective: string;
  region?: string;
  hazard_type?: string;
  severity?: string;
}

export interface SwarmMissionResponse {
  mission_id: string;
  title: string;
  objective: string;
  region: string;
  severity: string;
  overall_status: string;
  steps: SwarmMissionStep[];
  consensus_score: number;
  executive_verdict: string;
  final_action_plan: Array<{
    priority: string;
    action: string;
    detail: string;
    owner: string;
    status: string;
  }>;
  timestamp: string;
}


