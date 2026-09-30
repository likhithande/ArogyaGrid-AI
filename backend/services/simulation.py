import math
from typing import Dict, Any, List
from models.schemas import SimulationParams, SimulationResult, RedistributionRecommendation
from data.synthetic_generator import data_store

def run_resilience_simulation(params: SimulationParams) -> SimulationResult:
    # Baseline network metrics across the 691 PHCs
    total_phcs = len(data_store.phcs)
    total_beds = sum(p.beds_total for p in data_store.phcs)
    base_occupied_beds = sum(p.beds_occupied for p in data_store.phcs)
    base_occupancy_pct = round((base_occupied_beds / max(1, total_beds)) * 100, 1)

    total_staff = sum(p.staff_total for p in data_store.phcs)
    base_footfall = sum(p.daily_footfall for p in data_store.phcs)

    # Multipliers based on shock parameters
    demand_mult = 1.0 + (params.patient_demand_delta_pct / 100.0)
    supply_mult = 1.0 - (params.supply_disruption_pct / 100.0)
    delay_factor = 1.0 + (params.transport_delay_days * 0.14)
    staff_mult = 1.0 - (params.staff_shortage_pct / 100.0)

    # Projected calculations
    proj_footfall = int(base_footfall * demand_mult)
    proj_occupied_beds = min(total_beds, int(base_occupied_beds * (1.0 + (params.patient_demand_delta_pct * 0.0085))))
    proj_occupancy_pct = round((proj_occupied_beds / max(1, total_beds)) * 100, 1)
    
    # Stock-out impact: increased demand + curtailed supply + delayed transport
    base_critical_stockouts = sum(1 for m in data_store.medicines if m.risk_level == "CRITICAL")
    stockout_multiplier = (demand_mult / max(0.2, supply_mult)) * delay_factor
    proj_critical_stockouts = min(len(data_store.medicines), int(base_critical_stockouts * stockout_multiplier))

    # Critical PHCs impacted
    base_critical_phcs = sum(1 for p in data_store.phcs if p.status == "CRITICAL")
    proj_critical_phcs = min(total_phcs, int(base_critical_phcs * (1.0 + (params.patient_demand_delta_pct * 0.02) + (params.supply_disruption_pct * 0.015))))

    # Staffing pressure index (ratio of footfall per active staff member)
    base_workload = round(base_footfall / max(1, total_staff), 1)
    proj_active_staff = max(1, int(total_staff * staff_mult))
    proj_workload = round(proj_footfall / proj_active_staff, 1)

    # Bed deficit
    additional_beds_needed = max(0, int((base_occupied_beds * demand_mult * 0.3) - (total_beds - base_occupied_beds)))

    # Recommended interventions
    interventions: List[str] = []
    if params.patient_demand_delta_pct >= 30:
        interventions.append("Establish field triage tents adjacent to district general hospitals to absorb 35% outpatient overflow.")
    if params.supply_disruption_pct >= 25:
        interventions.append("Authorize emergency decentralized medicine procurement with pre-approved district flex-funds.")
    if params.transport_delay_days >= 3:
        interventions.append("Activate secondary rail/express freight transport lanes bypassing congested state arterial highways.")
    if params.staff_shortage_pct >= 15:
        interventions.append("Deploy post-graduate medical interns and emergency reserve nursing rosters on 12-hour rotating shifts.")

    recommended_transfers = data_store.redistributions[:3]

    return SimulationResult(
        scenario_name=f"What-If: +{params.patient_demand_delta_pct}% Demand, -{params.supply_disruption_pct}% Supply, +{params.transport_delay_days}d Transport Delay",
        baseline={
            "daily_footfall": base_footfall,
            "bed_occupancy_pct": base_occupancy_pct,
            "occupied_beds": base_occupied_beds,
            "critical_stockout_items": base_critical_stockouts,
            "critical_phcs": base_critical_phcs,
            "staff_workload_ratio": base_workload,
            "resilience_score": 82.4
        },
        projected={
            "daily_footfall": proj_footfall,
            "bed_occupancy_pct": proj_occupancy_pct,
            "occupied_beds": proj_occupied_beds,
            "critical_stockout_items": proj_critical_stockouts,
            "critical_phcs": proj_critical_phcs,
            "staff_workload_ratio": proj_workload,
            "resilience_score": round(max(35.0, 82.4 - (params.patient_demand_delta_pct * 0.4) - (params.supply_disruption_pct * 0.35) - (params.transport_delay_days * 2.5)), 1)
        },
        net_changes={
            "footfall_delta": proj_footfall - base_footfall,
            "footfall_delta_pct": params.patient_demand_delta_pct,
            "bed_occupancy_delta_pct": round(proj_occupancy_pct - base_occupancy_pct, 1),
            "stockouts_increase": proj_critical_stockouts - base_critical_stockouts,
            "critical_phcs_delta": proj_critical_phcs - base_critical_phcs,
            "workload_delta_pct": round(((proj_workload - base_workload) / base_workload) * 100, 1)
        },
        critical_phcs_impacted=proj_critical_phcs,
        additional_beds_needed=additional_beds_needed,
        expected_stockout_items=proj_critical_stockouts,
        recommended_transfers=recommended_transfers,
        recommended_interventions=interventions
    )
