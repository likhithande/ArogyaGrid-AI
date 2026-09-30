from fastapi import APIRouter, HTTPException, Query, WebSocket, WebSocketDisconnect
from typing import List, Optional, Dict, Any
import asyncio
import json
import random

from models.schemas import (
    PHC, District, StateSummary, Medicine, DemandForecast,
    StockoutPrediction, RedistributionRecommendation, EmergencyScenario,
    FederatedRound, AnomalyItem, SupplyChainNode, SupplyChainEdge, ResilienceScore,
    ResilienceMetric, AuditLog, SimulationParams, SimulationResult,
    CopilotQueryRequest, CopilotResponse,
    AgentExecutionRequest, AgentExecutionResponse, SwarmMissionRequest, SwarmMissionResponse
)
from data.synthetic_generator import data_store
from services.forecasting import get_demand_forecast
from services.optimization import get_redistributions, approve_redistribution, generate_optimized_plan
from services.simulation import run_resilience_simulation
from services.federated import get_federated_overview, trigger_federated_round
from services.copilot import ask_arogya_copilot
from services.reports import generate_situation_report
from services.agents_engine import execute_single_agent, execute_swarm_collaboration
from services.inventory_engine import inventory_engine, RECENT_INVENTORY_CHANGES
from services.incident_engine import incident_engine
from services.live_engine import live_broadcaster

api_router = APIRouter()

@api_router.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "ArogyaGrid AI Core Engine",
        "version": "2.4.0",
        "mode": "FEDERATED_COMMAND_CENTER"
    }

@api_router.get("/dashboard")
def get_dashboard_summary():
    total_phcs = len(data_store.phcs)
    active_phcs = sum(1 for p in data_store.phcs if p.status != "CRITICAL")
    total_beds = sum(p.beds_total for p in data_store.phcs)
    beds_occupied = sum(p.beds_occupied for p in data_store.phcs)
    beds_available = total_beds - beds_occupied

    total_doctors_pres = sum(p.doctors_present for p in data_store.phcs)
    total_doctors_sanc = sum(p.doctors_sanctioned for p in data_store.phcs)
    doctor_attendance_pct = round((total_doctors_pres / max(1, total_doctors_sanc)) * 100, 1)

    crit_stockouts = sum(1 for m in data_store.medicines if m.risk_level == "CRITICAL")
    avail_meds = sum(1 for m in data_store.medicines if m.risk_level in ["LOW", "MEDIUM"])
    medicine_availability_pct = round((avail_meds / max(1, len(data_store.medicines))) * 100, 1)

    total_footfall = sum(p.daily_footfall for p in data_store.phcs)
    pred_footfall_7d = int(total_footfall * 1.28)

    active_emergencies = sum(1 for e in data_store.emergencies if e.activated)
    pending_redist = sum(1 for r in data_store.redistributions if r.status == "PENDING")

    return {
        "network_status": "OPERATIONAL",
        "total_phcs": total_phcs,
        "active_phcs": active_phcs,
        "total_districts": len(data_store.districts),
        "total_states": len(data_store.states),
        "medicine_availability_pct": medicine_availability_pct,
        "critical_stockouts_count": crit_stockouts,
        "total_beds": total_beds,
        "beds_occupied": beds_occupied,
        "beds_available": beds_available,
        "bed_occupancy_pct": round((beds_occupied / max(1, total_beds)) * 100, 1),
        "doctor_attendance_pct": doctor_attendance_pct,
        "current_daily_footfall": total_footfall,
        "predicted_7d_footfall": pred_footfall_7d,
        "supply_risk_index": 28.5, # lower is better
        "emergency_readiness_score": 87.2,
        "national_resilience_index": 82.4,
        "active_emergencies_count": active_emergencies,
        "active_alerts_count": len(data_store.alerts),
        "pending_redistributions_count": pending_redist,
        "federated_participating_nodes": 1248,
        "federated_accuracy_pct": 94.6
    }

@api_router.get("/phcs", response_model=List[PHC])
def list_phcs(
    state: Optional[str] = None,
    district: Optional[str] = None,
    status: Optional[str] = None,
    limit: int = Query(default=100, le=1000)
):
    results = data_store.phcs
    if state:
        results = [p for p in results if p.state.lower() == state.lower()]
    if district:
        results = [p for p in results if p.district.lower() == district.lower()]
    if status:
        results = [p for p in results if p.status.lower() == status.lower()]
    return results[:limit]

@api_router.get("/phcs/{phc_id}", response_model=PHC)
def get_phc_by_id(phc_id: str):
    for p in data_store.phcs:
        if p.id == phc_id:
            return p
    raise HTTPException(status_code=404, detail="PHC not found")

@api_router.get("/districts", response_model=List[District])
def list_districts(state: Optional[str] = None):
    if state:
        return [d for d in data_store.districts if d.state.lower() == state.lower()]
    return data_store.districts

@api_router.get("/states", response_model=List[StateSummary])
def list_states():
    return data_store.states

@api_router.get("/medicines", response_model=List[Medicine])
def list_medicines(
    category: Optional[str] = None,
    risk_level: Optional[str] = None,
    search: Optional[str] = None
):
    results = data_store.medicines
    if category:
        results = [m for m in results if m.category.lower() == category.lower()]
    if risk_level:
        results = [m for m in results if m.risk_level.lower() == risk_level.lower()]
    if search:
        s = search.lower()
        results = [m for m in results if s in m.name.lower() or s in m.code.lower()]
    return results

@api_router.get("/forecast", response_model=DemandForecast)
def forecast_demand(
    medicine_id: Optional[str] = None,
    district_name: Optional[str] = "Krishna",
    horizon: str = "7d"
):
    return get_demand_forecast(medicine_id, district_name, horizon)

@api_router.get("/stockout-risk", response_model=List[StockoutPrediction])
def get_stockout_predictions():
    # Return mapped stockout items for high/critical medicines
    predictions: List[StockoutPrediction] = []
    for m in data_store.medicines:
        if m.risk_level in ["CRITICAL", "HIGH", "MEDIUM"]:
            rec = "Trigger lateral redistribution from neighboring district store" if m.risk_level == "CRITICAL" else "Schedule replenishment consignment within standard lead-time window"
            predictions.append(StockoutPrediction(
                id=f"PRED-{m.id}",
                medicine_id=m.id,
                medicine_name=m.name,
                category=m.category,
                district_name="Krishna" if m.risk_level == "CRITICAL" else "Guntur",
                phc_name="Machilipatnam Coastal PHC" if m.risk_level == "CRITICAL" else "District Central Depot",
                current_stock=m.current_stock,
                avg_daily_demand=m.daily_consumption_avg,
                predicted_daily_demand=m.predicted_demand,
                lead_time_days=m.supplier_lead_time_days,
                safety_stock=m.safety_stock,
                reorder_point=m.reorder_point,
                predicted_stockout_days=m.predicted_stockout_days,
                risk_level=m.risk_level,
                stockout_date=m.expiry_date,
                ai_recommendation=rec
            ))
    return predictions

@api_router.get("/alerts", response_model=List[AnomalyItem])
def get_active_alerts():
    return data_store.alerts

@api_router.post("/alerts/{alert_id}/acknowledge")
def acknowledge_alert(alert_id: str):
    for a in data_store.alerts:
        if a.id == alert_id:
            return {"status": "success", "alert_id": alert_id, "action": "ACKNOWLEDGED"}
    raise HTTPException(status_code=404, detail="Alert not found")

@api_router.get("/emergencies", response_model=List[EmergencyScenario])
def list_emergencies():
    return data_store.emergencies

@api_router.post("/emergencies/{emergency_id}/toggle")
def toggle_emergency(emergency_id: str):
    for e in data_store.emergencies:
        if e.id == emergency_id:
            e.activated = not e.activated
            return {"status": "success", "id": e.id, "activated": e.activated, "title": e.title}
    raise HTTPException(status_code=404, detail="Emergency scenario not found")

@api_router.get("/redistribution", response_model=List[RedistributionRecommendation])
def list_redistributions():
    return get_redistributions()

@api_router.post("/redistribution/{rec_id}/approve")
def approve_transfer_endpoint(rec_id: str):
    res = approve_redistribution(rec_id)
    if not res:
        raise HTTPException(status_code=404, detail="Recommendation not found")
    return {"status": "success", "recommendation": res}

@api_router.post("/redistribution/generate-plan")
def generate_plan_endpoint():
    return generate_optimized_plan()

@api_router.post("/simulation/run", response_model=SimulationResult)
def run_simulation_endpoint(params: SimulationParams):
    return run_resilience_simulation(params)

@api_router.get("/federated-learning")
def federated_overview():
    return get_federated_overview()

@api_router.post("/federated-learning/round")
def run_federated_round():
    return trigger_federated_round()

@api_router.get("/resilience", response_model=ResilienceScore)
def get_resilience_breakdown():
    components = [
        ResilienceMetric(name="Inventory Stability Index", score=79.2, weight=0.20, status="HEALTHY", description="Average days-of-stock across 104 NLEM essential medicines"),
        ResilienceMetric(name="Demand Volatility Buffer", score=74.5, weight=0.15, status="MODERATE", description="Variance resistance against acute infectious surges"),
        ResilienceMetric(name="Supply Lead-Time Reliability", score=81.0, weight=0.15, status="HEALTHY", description="On-time delivery performance from central & state depots"),
        ResilienceMetric(name="Personnel & Attendance Coverage", score=88.4, weight=0.15, status="HEALTHY", description="Duty roster coverage of medical officers, nurses & pharmacists"),
        ResilienceMetric(name="Bed Capacity & ICU Surge Reserve", score=76.8, weight=0.15, status="MODERATE", description="Oxygen, ventilator & emergency bed availability buffer"),
        ResilienceMetric(name="Transport & Route Reliability", score=83.0, weight=0.10, status="HEALTHY", description="Expressway logistics clearance and transit detour latency"),
        ResilienceMetric(name="Emergency Response Readiness", score=89.5, weight=0.10, status="EXCELLENT", description="Automated triage plan readiness and pre-positioned contingency kits")
    ]
    return ResilienceScore(
        overall_index=82.4,
        status="STABLE",
        components=components
    )

@api_router.get("/supply-chain")
def get_supply_chain_network():
    return {
        "nodes": data_store.supply_nodes,
        "edges": data_store.supply_edges
    }

@api_router.post("/copilot/query", response_model=CopilotResponse)
def copilot_query_endpoint(req: CopilotQueryRequest):
    return ask_arogya_copilot(req)

@api_router.get("/reports/situation-report")
def situation_report_endpoint():
    return generate_situation_report()

@api_router.get("/audit-logs", response_model=List[AuditLog])
def list_audit_logs():
    return data_store.audit_logs

@api_router.post("/scenarios/apply")
def apply_demo_scenario(scenario_key: str = Query(...)):
    # Switch scenarios for judge demos
    if scenario_key == "flood_emergency":
        for e in data_store.emergencies:
            e.activated = (e.type == "FLOOD")
        for m in data_store.medicines:
            if "ORS" in m.name or "Paracetamol" in m.name:
                m.risk_level = "CRITICAL"
                m.predicted_stockout_days = 2.4
        return {"status": "applied", "scenario": "Flood Emergency Active"}
    elif scenario_key == "medicine_shortage":
        for m in data_store.medicines[:8]:
            m.risk_level = "CRITICAL"
            m.predicted_stockout_days = 1.9
        return {"status": "applied", "scenario": "Multi-district Medicine Stock-out Crisis"}
    elif scenario_key == "patient_surge":
        for p in data_store.phcs:
            p.daily_footfall = int(p.daily_footfall * 1.45)
            p.beds_occupied = min(p.beds_total, int(p.beds_occupied * 1.35))
        return {"status": "applied", "scenario": "+45% Patient Surge Active"}
    else: # normal
        for e in data_store.emergencies:
            e.activated = False
        return {"status": "applied", "scenario": "Normal Steady-State Operation"}

# ============================================================
# NEXT-GENERATION RESILIENCE & AUTONOMOUS AGENT ENDPOINTS
# ============================================================
from data.nextgen_generator import (
    generate_autonomous_agents,
    generate_agent_collaboration,
    generate_resilience_brain_signals,
    generate_cascade_simulation,
    generate_early_warnings,
    generate_smart_procurement,
    generate_suppliers,
    generate_alternative_routes,
    generate_swap_offers,
    generate_playbooks,
    generate_equipment_and_cold_chain,
    generate_model_observatory_and_quality,
    generate_root_cause_diagnostics,
    generate_decision_options,
    generate_scalability_simulation
)

@api_router.get("/brain/signals")
def get_brain_signals():
    return generate_resilience_brain_signals()

@api_router.get("/agents")
def get_autonomous_agents():
    return generate_autonomous_agents()

@api_router.get("/agents/collaboration")
def get_agent_collaboration():
    return generate_agent_collaboration()

@api_router.post("/agents/execute", response_model=AgentExecutionResponse)
def run_agent_task(req: AgentExecutionRequest):
    return execute_single_agent(req)

@api_router.post("/agents/swarm-mission", response_model=SwarmMissionResponse)
def run_swarm_mission(req: SwarmMissionRequest):
    return execute_swarm_collaboration(req)

@api_router.post("/agents/approve-action")
def approve_agent_action(action_id: str = Query(...), agent_id: str = Query(...), approver: str = Query(default="National Health Administrator")):
    import time
    return {
        "status": "APPROVED",
        "action_id": action_id,
        "agent_id": agent_id,
        "approved_by": approver,
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S IST"),
        "audit_tx": f"TX-AGENT-ACT-{action_id}-{int(time.time())}",
        "execution_state": "DISPATCHED_TO_FLEET"
    }

@api_router.post("/simulation/cascade")
def run_cascade_simulation(trigger_scenario: str = Query(default="Warehouse failure")):
    return generate_cascade_simulation(trigger_scenario=trigger_scenario)

@api_router.get("/early-warnings")
def get_early_warnings():
    return generate_early_warnings()

@api_router.get("/procurement/recommendations")
def get_procurement_recommendations():
    return generate_smart_procurement()

@api_router.get("/suppliers")
def get_suppliers():
    return generate_suppliers()

@api_router.get("/routes/alternatives")
def get_alternative_routes():
    return generate_alternative_routes()

@api_router.get("/swap-market")
def get_swap_market():
    return generate_swap_offers()

@api_router.post("/swap-market/{offer_id}/approve")
def approve_swap_offer(offer_id: str):
    return {
        "status": "APPROVED",
        "offer_id": offer_id,
        "message": f"Resource transfer for offer {offer_id} authorized by Administrator.",
        "timestamp": "Just now",
        "audit_tx": f"TX-SWAP-{offer_id}-8492"
    }

@api_router.get("/playbooks")
def get_playbooks():
    return generate_playbooks()

@api_router.post("/playbooks/{playbook_id}/toggle-phase")
def toggle_playbook_phase(playbook_id: str, phase: str = Query(default="RECOVERY")):
    return {
        "status": "UPDATED",
        "playbook_id": playbook_id,
        "active_phase": phase,
        "message": f"Emergency Playbook {playbook_id} switched to {phase} mode."
    }

@api_router.get("/equipment-telemetry")
def get_equipment_and_sensors():
    return generate_equipment_and_cold_chain()

@api_router.get("/observatory")
def get_observatory_and_quality():
    return generate_model_observatory_and_quality()

@api_router.get("/root-cause")
def get_root_cause_analysis():
    return generate_root_cause_diagnostics()

@api_router.get("/decision-options")
def get_decision_options():
    return generate_decision_options()

@api_router.get("/scalability")
def get_scalability_metrics(phc_scale: int = Query(default=1248)):
    return generate_scalability_simulation(phc_scale=phc_scale)

# ============================================================
# ULTRA-ADVANCED AROGYAGRID AI ROUTES (90 MODULES)
# ============================================================

@api_router.get("/graph/topology")
def get_graph_topology():
    return {
        "nodes": [
            { "id": "STATE-AP", "name": "Andhra Pradesh State Grid", "type": "STATE", "status": "HEALTHY", "risk_score": 18, "connections_count": 26, "details": "State Command HQ, Vijayawada" },
            { "id": "DIST-KRI", "name": "District Krishna", "type": "DISTRICT", "status": "CRITICAL", "risk_score": 78, "connections_count": 15, "details": "Coastal flood vulnerability zone" },
            { "id": "DIST-GUN", "name": "District Guntur", "type": "DISTRICT", "status": "HEALTHY", "risk_score": 22, "connections_count": 14, "details": "Surplus strategic reserve hub" },
            { "id": "WH-VIJ-01", "name": "Vijayawada Central Apex Warehouse", "type": "WAREHOUSE", "status": "HEALTHY", "risk_score": 15, "connections_count": 32, "details": "Automated cold-chain & pallet storage" },
            { "id": "WH-GNT-04", "name": "Guntur Regional Depot W-17", "type": "WAREHOUSE", "status": "WARNING", "risk_score": 64, "connections_count": 18, "details": "Projected bottleneck in 5 days due to influx" },
            { "id": "SUP-REDDY", "name": "Dr. Reddy's Regional Plant", "type": "SUPPLIER", "status": "HEALTHY", "risk_score": 12, "connections_count": 8, "details": "Tier-1 API & IV Fluid manufacturer" },
            { "id": "SUP-CIPLA", "name": "Cipla Coastal Logistics Hub", "type": "SUPPLIER", "status": "WARNING", "risk_score": 48, "connections_count": 6, "details": "2.5 day transit delay on waterlogged NH-216" },
            { "id": "PHC-MACH-42", "name": "Machilipatnam Coastal PHC", "type": "PHC", "status": "CRITICAL", "risk_score": 84, "connections_count": 9, "details": "Stockout risk in 3.2 days, beds 91% occupied" },
            { "id": "PHC-AVAN-18", "name": "Avanigadda Riverine PHC", "type": "PHC", "status": "WARNING", "risk_score": 58, "connections_count": 7, "details": "Acute diarrheal illness cluster, ORS deficit" },
            { "id": "PHC-TEN-09", "name": "Tenali Urban CHC", "type": "PHC", "status": "HEALTHY", "risk_score": 19, "connections_count": 11, "details": "Surplus ORS & Paracetamol depot" },
            { "id": "MED-ORS", "name": "Oral Rehydration Salts (WHO formula)", "type": "MEDICINE", "status": "CRITICAL", "risk_score": 82, "connections_count": 42, "details": "Depletion rate 280 units/day" },
            { "id": "MED-PCM", "name": "Paracetamol 500mg (IP)", "type": "MEDICINE", "status": "WARNING", "risk_score": 61, "connections_count": 55, "details": "+31% demand surge" },
            { "id": "BED-ICU-OXY", "name": "Oxygenated ICU Bed Cluster", "type": "BED", "status": "WARNING", "risk_score": 68, "connections_count": 14, "details": "88.4% occupancy in flood-affected blocks" },
            { "id": "STAFF-EMERG", "name": "Rapid Medical Response Corps", "type": "PERSONNEL", "status": "HEALTHY", "risk_score": 25, "connections_count": 19, "details": "92.8% attendance, 4 mobile triage teams" },
            { "id": "ROUTE-NH216", "name": "National Highway 216 Coastal Route", "type": "ROUTE", "status": "BLOCKED", "risk_score": 95, "connections_count": 8, "details": "Inundated at Mile 44, +4.8h transit" },
            { "id": "ROUTE-SH42", "name": "State Highway 42 Bypass Corridor", "type": "ROUTE", "status": "HEALTHY", "risk_score": 24, "connections_count": 7, "details": "Operational alternative route (+2.2h)" },
            { "id": "EMERG-MONSOON", "name": "Monsoon Surge TIER-3 Emergency", "type": "EMERGENCY", "status": "CRITICAL", "risk_score": 89, "connections_count": 12, "details": "Affects 18 coastal PHCs" },
            { "id": "DEMAND-SURGE", "name": "Pediatric Acute Gastroenteritis Demand", "type": "DEMAND", "status": "CRITICAL", "risk_score": 79, "connections_count": 16, "details": "Predicted +44% 7-day surge" }
        ],
        "edges": [
            { "id": "E1", "source": "DIST-KRI", "target": "STATE-AP", "relationship": "belongs_to", "weight": 1.0, "latency_hrs": 0, "status": "ACTIVE", "is_bottleneck": False },
            { "id": "E2", "source": "DIST-GUN", "target": "STATE-AP", "relationship": "belongs_to", "weight": 1.0, "latency_hrs": 0, "status": "ACTIVE", "is_bottleneck": False },
            { "id": "E3", "source": "PHC-MACH-42", "target": "DIST-KRI", "relationship": "belongs_to", "weight": 1.0, "latency_hrs": 0.5, "status": "ACTIVE", "is_bottleneck": False },
            { "id": "E4", "source": "PHC-AVAN-18", "target": "DIST-KRI", "relationship": "belongs_to", "weight": 1.0, "latency_hrs": 0.8, "status": "ACTIVE", "is_bottleneck": False },
            { "id": "E5", "source": "PHC-TEN-09", "target": "DIST-GUN", "relationship": "belongs_to", "weight": 1.0, "latency_hrs": 0.4, "status": "ACTIVE", "is_bottleneck": False },
            { "id": "E6", "source": "WH-VIJ-01", "target": "PHC-MACH-42", "relationship": "supplies", "weight": 0.8, "latency_hrs": 4.8, "status": "CONGESTED", "is_bottleneck": True },
            { "id": "E7", "source": "WH-GNT-04", "target": "PHC-TEN-09", "relationship": "supplies", "weight": 1.0, "latency_hrs": 1.2, "status": "ACTIVE", "is_bottleneck": False },
            { "id": "E8", "source": "SUP-REDDY", "target": "WH-VIJ-01", "relationship": "supplies", "weight": 1.0, "latency_hrs": 6.0, "status": "ACTIVE", "is_bottleneck": False },
            { "id": "E9", "source": "SUP-CIPLA", "target": "WH-GNT-04", "relationship": "supplies", "weight": 0.6, "latency_hrs": 14.5, "status": "CONGESTED", "is_bottleneck": True },
            { "id": "E10", "source": "PHC-MACH-42", "target": "MED-ORS", "relationship": "receives", "weight": 0.3, "latency_hrs": 0, "status": "FAILED", "is_bottleneck": True },
            { "id": "E11", "source": "PHC-TEN-09", "target": "MED-ORS", "relationship": "surplus_store", "weight": 1.0, "latency_hrs": 0, "status": "ACTIVE", "is_bottleneck": False },
            { "id": "E12", "source": "PHC-MACH-42", "target": "BED-ICU-OXY", "relationship": "has", "weight": 0.9, "latency_hrs": 0, "status": "ACTIVE", "is_bottleneck": True },
            { "id": "E13", "source": "PHC-MACH-42", "target": "STAFF-EMERG", "relationship": "requires", "weight": 0.7, "latency_hrs": 0, "status": "ACTIVE", "is_bottleneck": False },
            { "id": "E14", "source": "EMERG-MONSOON", "target": "DIST-KRI", "relationship": "affects", "weight": 1.0, "latency_hrs": 0, "status": "ACTIVE", "is_bottleneck": True },
            { "id": "E15", "source": "DEMAND-SURGE", "target": "MED-ORS", "relationship": "drives", "weight": 1.0, "latency_hrs": 0, "status": "ACTIVE", "is_bottleneck": True },
            { "id": "E16", "source": "ROUTE-NH216", "target": "PHC-MACH-42", "relationship": "transits", "weight": 0.0, "latency_hrs": 72.0, "status": "FAILED", "is_bottleneck": True },
            { "id": "E17", "source": "ROUTE-SH42", "target": "PHC-MACH-42", "relationship": "reroutes_to", "weight": 0.85, "latency_hrs": 3.2, "status": "ACTIVE", "is_bottleneck": False }
        ],
        "bottlenecks": [
            {
                "id": "BOT-01",
                "facility_name": "Guntur Regional Depot W-17",
                "facility_type": "Warehouse Node",
                "current_utilization_pct": 88.5,
                "predicted_utilization_5d": 104.2,
                "risk_window": "Next 4–5 Days",
                "risk_level": "CRITICAL",
                "expected_inflow": 18400,
                "expected_demand": 12100
            },
            {
                "id": "BOT-02",
                "facility_name": "NH-216 Coastal Choke Bridge",
                "facility_type": "Transport Route",
                "current_utilization_pct": 94.0,
                "predicted_utilization_5d": 112.0,
                "risk_window": "Next 48 Hours",
                "risk_level": "HIGH",
                "expected_inflow": 8500,
                "expected_demand": 6200
            }
        ]
    }

@api_router.get("/graph/risk-propagation")
def get_risk_propagation():
    return [
        { "step_num": 1, "title": "Initial Disruption", "facility": "Cipla Coastal Logistics Hub (Supplier)", "status": "FAILED", "effect": "Waterlogging shuts down automated sorting bay for 36 hours", "severity": "HIGH" },
        { "step_num": 2, "title": "Corridor Failure", "facility": "National Highway 216 (Mile 44)", "status": "FAILED", "effect": "Supply route blocked; transit detour adds 4.8 hours delivery latency", "severity": "HIGH" },
        { "step_num": 3, "title": "Depot Starvation", "facility": "District Krishna Central Warehouse", "status": "DEGRADED", "effect": "Safety stock depletion drops buffer from 18 days to 4.2 days", "severity": "CRITICAL" },
        { "step_num": 4, "title": "Frontline Shortage", "facility": "14 Coastal PHCs (including Machilipatnam)", "status": "CRITICAL", "effect": "Simultaneous stockout of ORS & Paracetamol within 72 hours", "severity": "CRITICAL" },
        { "step_num": 5, "title": "Clinical Saturation", "facility": "Machilipatnam Hospital Bed Network", "status": "CRITICAL", "effect": "Patient footfall surges +40%; oxygen bed occupancy spikes to 96%", "severity": "CATASTROPHIC" }
    ]

@api_router.get("/matching/proposals")
def get_resource_matching_proposals():
    return [
        {
            "id": "MATCH-01",
            "surplus_district": "District Guntur (Tenali Urban CHC)",
            "surplus_phc": "Tenali CHC (Surplus: 8,400 units, 32 days buffer)",
            "need_district": "District Krishna (Machilipatnam Coastal PHC)",
            "need_phc": "Machilipatnam PHC (Deficit: 5,000 units, 2.9 days left)",
            "resource_name": "Oral Rehydration Salts (WHO Formula)",
            "quantity": 5000,
            "distance_km": 68.4,
            "transit_hours": 2.1,
            "expiry_date": "2027-11-30",
            "urgency": "CRITICAL",
            "compatibility_score": 98.4,
            "reasoning": "Guntur retains 3,400 units (>16 days reserve). Transit via SH-42 avoids waterlogged NH-216. Low cold-chain storage constraint."
        },
        {
            "id": "MATCH-02",
            "surplus_district": "District Prakasam (Ongole Central Depot)",
            "surplus_phc": "Ongole District Store (Surplus: 12,000 strips)",
            "need_district": "District Krishna (Avanigadda Riverine PHC)",
            "need_phc": "Avanigadda PHC (Deficit: 3,500 strips, 3.4 days left)",
            "resource_name": "Paracetamol 500mg Tablets",
            "quantity": 3500,
            "distance_km": 112.0,
            "transit_hours": 3.4,
            "expiry_date": "2027-08-15",
            "urgency": "HIGH",
            "compatibility_score": 94.2,
            "reasoning": "FEFO batch expires in 9 months at source; high consumption velocity at Avanigadda ensures zero spoilage."
        }
    ]

@api_router.get("/optimization/pareto")
def get_pareto_tradeoffs():
    return [
        {
            "id": "STRAT-BALANCED",
            "strategy_name": "Pareto Optimal (Balanced Resilience & Cost)",
            "transit_hours": 2.4,
            "stockout_risk_pct": 4.2,
            "transport_cost_inr": 8400,
            "coverage_pct": 96.8,
            "readiness_score": 92.4,
            "wastage_risk_pct": 1.8,
            "recommended": True,
            "tradeoff_explanation": "Minimizes stock-out probability to 4.2% while incurring modest INR 8,400 transit expenditure over secondary corridors."
        },
        {
            "id": "STRAT-FAST",
            "strategy_name": "Ultra-Fast Emergency Dispatch (Direct Express)",
            "transit_hours": 1.2,
            "stockout_risk_pct": 1.1,
            "transport_cost_inr": 24500,
            "coverage_pct": 99.2,
            "readiness_score": 97.5,
            "wastage_risk_pct": 2.4,
            "recommended": False,
            "tradeoff_explanation": "Maximizes speed via dedicated courier vans; 3x cost increase for a 1.2h reduction in delivery lead time."
        },
        {
            "id": "STRAT-ECO",
            "strategy_name": "Consolidated Batch Transit (Eco & Low Cost)",
            "transit_hours": 5.6,
            "stockout_risk_pct": 14.8,
            "transport_cost_inr": 3200,
            "coverage_pct": 88.0,
            "readiness_score": 79.0,
            "wastage_risk_pct": 0.9,
            "recommended": False,
            "tradeoff_explanation": "Groups dispatches into single freight carrier. Low financial cost but creates higher stockout exposure during peak flood hours."
        }
    ]

@api_router.get("/security/events")
def get_security_events():
    return [
        { "id": "SEC-01", "event_type": "UNAUTHORIZED_ATTEMPT", "actor": "API Client 192.168.1.84", "ip": "192.168.1.84", "timestamp": "08:12 IST", "severity": "HIGH", "status": "CONTAINED" },
        { "id": "SEC-02", "event_type": "FAILED_LOGIN", "actor": "User dho_krishna_admin", "ip": "10.0.4.12", "timestamp": "08:35 IST", "severity": "LOW", "status": "CONTAINED" },
        { "id": "SEC-03", "event_type": "PRIVILEGE_CHANGE", "actor": "Security Admin root_audit", "ip": "127.0.0.1", "timestamp": "09:00 IST", "severity": "MEDIUM", "status": "CONTAINED" },
        { "id": "SEC-04", "event_type": "SUSPICIOUS_API", "actor": "Automated Scraping Probe", "ip": "45.132.88.2", "timestamp": "09:42 IST", "severity": "HIGH", "status": "CONTAINED" }
    ]

@api_router.post("/security/sign")
def sign_approval(workflow_id: str = Query(...), approver: str = Query(...)):
    import hashlib
    import time
    timestamp = time.strftime("%Y-%m-%d %H:%M:%S IST")
    hash_str = hashlib.sha256(f"{workflow_id}:{approver}:{timestamp}".encode()).hexdigest()
    return {
        "status": "SIGNED",
        "audit_id": f"SIG-AP-{int(time.time())}",
        "workflow_id": workflow_id,
        "approved_by": approver,
        "timestamp": timestamp,
        "cryptographic_hash": f"sha256:{hash_str}",
        "blockchain_audit_valid": True
    }

@api_router.get("/reconciliation")
def get_reconciliation_data():
    return [
        { "id": "RECON-01", "item_name": "Oral Rehydration Salts (WHO formula)", "warehouse_qty": 10000, "district_qty": 9200, "system_qty": 9850, "variance_pct": 6.5, "status": "FLAGGED", "suggested_resolution": "650 units in transit logged on SH-42 detour; audit physical receipt before ledger reconciliation." },
        { "id": "RECON-02", "item_name": "Paracetamol 500mg Strips", "warehouse_qty": 15000, "district_qty": 14850, "system_qty": 15000, "variance_pct": 1.0, "status": "RESOLVED", "suggested_resolution": "Within 1.0% allowable clinical handling threshold; automatically reconciled." },
        { "id": "RECON-03", "item_name": "Ceftriaxone 1g Injections", "warehouse_qty": 1200, "district_qty": 1040, "system_qty": 1200, "variance_pct": 13.3, "status": "FLAGGED", "suggested_resolution": "160 units quarantined under batch recall alert BATCH-CFX-90; holds separate quarantine ledger." }
    ]

@api_router.get("/scenarios/catalog")
def get_scenarios_catalog():
    return [
        { "id": "SCEN-01", "title": "Baseline Normal Operations", "category": "Standard", "description": "Nominal patient footfall, 90%+ medicine availability, normal transit times.", "demand_surge_pct": 0, "supply_cut_pct": 0, "transport_delay_days": 0, "staff_shortage_pct": 0, "affected_phcs_est": 0 },
        { "id": "SCEN-02", "title": "Monsoon Flood Crisis (Tier-3)", "category": "Natural Disaster", "description": "Coastal flooding, road inundation, diarrheal fever spike, stockout exposure.", "demand_surge_pct": 40, "supply_cut_pct": 35, "transport_delay_days": 3, "staff_shortage_pct": 15, "affected_phcs_est": 28 },
        { "id": "SCEN-03", "title": "Coastal Cyclone Landfall", "category": "Severe Weather", "description": "High wind damage, power grid outage, emergency trauma surge, hospital cut-off.", "demand_surge_pct": 55, "supply_cut_pct": 60, "transport_delay_days": 5, "staff_shortage_pct": 25, "affected_phcs_est": 44 },
        { "id": "SCEN-04", "title": "Acute Gastroenteritis Disease Outbreak", "category": "Epidemic", "description": "Viral/bacterial waterborne outbreak requiring rapid antibiotics and IV fluids.", "demand_surge_pct": 65, "supply_cut_pct": 10, "transport_delay_days": 1, "staff_shortage_pct": 20, "affected_phcs_est": 35 }
    ]

@api_router.post("/synthetic/generate")
def generate_custom_scenario(params: Dict[str, Any]):
    return {
        "status": "SUCCESS",
        "scenario_id": f"SYNTH-{int(asyncio.get_event_loop().time())}",
        "parameters_applied": params,
        "generated_phcs": params.get("phc_count", 694),
        "synthetic_seed": random.randint(10000, 99999),
        "message": "Generated new high-fidelity synthetic healthcare resilience dataset with realistic time-series curves."
    }

# ============================================================
# LIVE INVENTORY INTELLIGENCE APIS & STREAMS
# ============================================================

@api_router.get("/inventory")
def get_all_inventory(search: Optional[str] = None, risk: Optional[str] = None):
    items = inventory_engine.get_all_medicines()
    if search:
        s = search.lower()
        items = [m for m in items if s in m.name.lower() or s in m.category.lower()]
    if risk:
        r = risk.upper()
        items = [m for m in items if m.risk_level == r]
    return items

@api_router.get("/inventory/summary")
def get_inventory_summary_metrics():
    return inventory_engine.get_inventory_summary()

@api_router.get("/inventory/critical")
def get_critical_inventory():
    return inventory_engine.get_critical_medicines()

@api_router.get("/inventory/changes")
def get_recent_inventory_changes():
    return inventory_engine.get_recent_changes()

@api_router.get("/inventory/{med_id}")
def get_inventory_item(med_id: str):
    item = inventory_engine.get_by_id(med_id)
    if not item:
        raise HTTPException(status_code=404, detail="Medicine record not found")
    return item

# ============================================================
# NATIONAL INCIDENT TELEMETRY APIS
# ============================================================

@api_router.get("/incidents")
def get_all_incidents(state: Optional[str] = None, severity: Optional[str] = None, status: Optional[str] = None):
    return incident_engine.get_all(state=state, severity=severity, status=status)

@api_router.get("/incidents/summary")
def get_incidents_summary():
    return incident_engine.get_summary()

@api_router.get("/incidents/{incident_id}")
def get_incident_detail(incident_id: str):
    inc = incident_engine.get_by_id(incident_id)
    if not inc:
        raise HTTPException(status_code=404, detail="Incident not found")
    return inc

@api_router.post("/incidents/{incident_id}/response-plan")
def create_incident_response_plan(incident_id: str):
    return incident_engine.create_response_plan(incident_id)

@api_router.post("/incidents/toggle-demo")
def toggle_incident_demo(enabled: bool = Query(...)):
    incident_engine.demo_mode = enabled
    return {"demo_mode": incident_engine.demo_mode, "status": "UPDATED"}

# ============================================================
# UNIFIED LIVE WEBSOCKET SUITE
# ============================================================

@api_router.websocket("/ws/live")
async def websocket_live_endpoint(websocket: WebSocket):
    await live_broadcaster.register(websocket)
    try:
        while True:
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        live_broadcaster.unregister(websocket)
    except Exception:
        live_broadcaster.unregister(websocket)

@api_router.websocket("/ws/inventory")
async def websocket_inventory_endpoint(websocket: WebSocket):
    await live_broadcaster.register(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        live_broadcaster.unregister(websocket)
    except Exception:
        live_broadcaster.unregister(websocket)

@api_router.websocket("/ws/incidents")
async def websocket_incidents_endpoint(websocket: WebSocket):
    await live_broadcaster.register(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        live_broadcaster.unregister(websocket)
    except Exception:
        live_broadcaster.unregister(websocket)

@api_router.websocket("/ws/agents")
async def websocket_agents_endpoint(websocket: WebSocket):
    await live_broadcaster.register(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        live_broadcaster.unregister(websocket)
    except Exception:
        live_broadcaster.unregister(websocket)


