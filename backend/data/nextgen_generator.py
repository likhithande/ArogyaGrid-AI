import random
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional

from models.schemas import (
    AutonomousAgent, AgentCollaborationMessage, ResilienceBrainSignal,
    CascadeNode, CascadeSimulationResult, EarlyWarningItem, SmartProcurementItem,
    SupplierProfile, AlternativeRoute, SwapMarketOffer, EmergencyPlaybook,
    RootCauseDiagnostic, RootCauseFactor, DecisionOption, MedicalEquipment,
    ColdChainSensor, EnergyResilienceMetric, ModelObservatoryMetric, DataQualityMetric
)

def generate_autonomous_agents() -> List[AutonomousAgent]:
    now = datetime.now()
    return [
        AutonomousAgent(
            id="AGENT-01",
            name="Demand Forecast Agent",
            role="Epidemiological & Outpatient Influx Forecaster",
            status="ACTIVE",
            current_task="Simulating 7-day multi-horizon vector demand across 51 districts",
            last_execution=(now - timedelta(seconds=14)).strftime("%H:%M:%S IST"),
            confidence=95.4,
            detected_issues=3,
            recommendations_count=8,
            avatar_color="cyan",
            activity_log=[
                "Detected +31.0% Paracetamol demand divergence in District Krishna",
                "Aggregated weekly trend factors from 14 coastal community clinics",
                "Published updated 95% Confidence Interval band to Central Bus"
            ]
        ),
        AutonomousAgent(
            id="AGENT-02",
            name="Inventory Intelligence Agent",
            role="FEFO, Buffer Depletion & Safety Stock Sentinel",
            status="ACTIVE",
            current_task="Calculating days-to-zero stock levels for 104 NLEM medicines",
            last_execution=(now - timedelta(seconds=28)).strftime("%H:%M:%S IST"),
            confidence=96.8,
            detected_issues=3,
            recommendations_count=12,
            avatar_color="emerald",
            activity_log=[
                "Flagged ORS depletion risk at 3.2 days in Machilipatnam",
                "Audited FEFO batch IN-BT-005-72 nearing 65-day threshold",
                "Synced reserve buffers with Central Warehouse ledger"
            ]
        ),
        AutonomousAgent(
            id="AGENT-03",
            name="Supply Chain Logistics Agent",
            role="Transit Route Clearance & Corridor Velocity Analyzer",
            status="ACTIVE",
            current_task="Monitoring GPS carrier vehicle telematics and arterial chokes",
            last_execution=(now - timedelta(seconds=42)).strftime("%H:%M:%S IST"),
            confidence=91.2,
            detected_issues=2,
            recommendations_count=4,
            avatar_color="sky",
            activity_log=[
                "Alerted on waterlogging delay along NH-216 (+2.2 hours detour)",
                "Identified surplus inventory depot at Guntur (+18.4 days excess)",
                "Verified arterial highway clearance via State Highway 42"
            ]
        ),
        AutonomousAgent(
            id="AGENT-04",
            name="Emergency Response Agent",
            role="Disaster Impact & Surge Triage Coordinator",
            status="ACTIVE",
            current_task="Executing Tier-3 Flood Protocol across Krishna & Godavari delta",
            last_execution=(now - timedelta(seconds=55)).strftime("%H:%M:%S IST"),
            confidence=94.0,
            detected_issues=1,
            recommendations_count=6,
            avatar_color="rose",
            activity_log=[
                "Modeled +42% outpatient surge impact across 17 vulnerable PHCs",
                "Allocated 620 contingency beds across secondary triage tents",
                "Activated automated relief camp pre-positioning directives"
            ]
        ),
        AutonomousAgent(
            id="AGENT-05",
            name="Workforce & Capacity Agent",
            role="Personnel Attendance & Duty Roster Intelligence",
            status="ACTIVE",
            current_task="Tracking clinical shift coverage and workload exhaustion scores",
            last_execution=(now - timedelta(minutes=2)).strftime("%H:%M:%S IST"),
            confidence=92.5,
            detected_issues=2,
            recommendations_count=3,
            avatar_color="purple",
            activity_log=[
                "Identified doctor attendance dip (38%) at Bhadradri Tribal PHC",
                "Calculated workload index spike (26.4 patients/staff-hr) in Krishna",
                "Dispatched mobile medical team unit #04 recommendation"
            ]
        ),
        AutonomousAgent(
            id="AGENT-06",
            name="Anomaly Detection Agent",
            role="Statistical Z-Score & Outlier Surveillance Sentinel",
            status="ACTIVE",
            current_task="Scanning telemetry streams for sudden statistical spikes",
            last_execution=(now - timedelta(minutes=3)).strftime("%H:%M:%S IST"),
            confidence=98.1,
            detected_issues=4,
            recommendations_count=5,
            avatar_color="amber",
            activity_log=[
                "Flagged critical 3.7x Paracetamol consumption spike at PHC-0042",
                "Confirmed Z-score +4.2 sigma statistical deviation",
                "Correlated symptom clusters with local acute fever outbreak"
            ]
        ),
        AutonomousAgent(
            id="AGENT-07",
            name="Optimization Solver Agent",
            role="Integer Linear Programming (ILP) Redistribution Solver",
            status="ACTIVE",
            current_task="Solving minimal-latency cross-district supply pairings",
            last_execution=(now - timedelta(minutes=4)).strftime("%H:%M:%S IST"),
            confidence=97.4,
            detected_issues=1,
            recommendations_count=4,
            avatar_color="cyan",
            activity_log=[
                "Computed optimal pairing: 800 units ORS Guntur -> Machilipatnam",
                "Estimated delivery duration at 1.8 hours (54.2 km road distance)",
                "Submitted transfer order REDIST-001 for human administrative sign-off"
            ]
        ),
        AutonomousAgent(
            id="AGENT-08",
            name="Report Generation Agent",
            role="Executive AI Briefing & Situation Report (SITREP) Compiler",
            status="IDLE",
            current_task="Ready for on-demand synthesis and automated morning briefing",
            last_execution=(now - timedelta(minutes=15)).strftime("%H:%M:%S IST"),
            confidence=99.0,
            detected_issues=0,
            recommendations_count=1,
            avatar_color="blue",
            activity_log=[
                "Compiled official Situation Report for Ministry review",
                "Structured cross-district resilience matrix into PDF/CSV formats",
                "Archived executive briefing snapshot in secure repository"
            ]
        ),
        AutonomousAgent(
            id="AGENT-09",
            name="Generative AI Agent",
            role="Natural-Language Healthcare Intelligence & Decision Synthesis",
            status="ACTIVE",
            current_task="Synthesizing multi-agent mitigation directives for national leadership",
            last_execution=(now - timedelta(seconds=22)).strftime("%H:%M:%S IST"),
            confidence=98.2,
            detected_issues=1,
            recommendations_count=7,
            avatar_color="purple",
            activity_log=[
                "Generated executive response plan for coastal cyclone front",
                "Cross-synthesized inventory buffers with epidemiological surge forecast",
                "Formulated P1/P2/P3 actionable directives for Cabinet briefing"
            ]
        ),
        AutonomousAgent(
            id="AGENT-10",
            name="Arogya Reasoning Agent",
            role="Deep Clinical & Epidemiological Causal Reasoning",
            status="ACTIVE",
            current_task="Tracing root causal graph of regional supply and cold-chain bottlenecks",
            last_execution=(now - timedelta(minutes=2)).strftime("%H:%M:%S IST"),
            confidence=96.4,
            detected_issues=2,
            recommendations_count=5,
            avatar_color="blue",
            activity_log=[
                "Isolated root failure cause to rural substation grid excursions",
                "Ran counterfactual simulation for auxiliary solar-battery pre-positioning",
                "Constructed 182-node clinical vulnerability tree for coastal mandals"
            ]
        ),
        AutonomousAgent(
            id="AGENT-11",
            name="Data Intelligence Agent",
            role="National Health Data Ingestion & Stream Harmonizer",
            status="ACTIVE",
            current_task="Auditing 384,000 real-time telemetry records across 8,420 facilities",
            last_execution=(now - timedelta(seconds=11)).strftime("%H:%M:%S IST"),
            confidence=99.4,
            detected_issues=0,
            recommendations_count=3,
            avatar_color="emerald",
            activity_log=[
                "Verified zero PII exposure across federated parameter channels",
                "Harmonized district hospital registers with central stockout ledger",
                "National Telemetry Integrity Score rated 99.4 / 100 [OPTIMAL]"
            ]
        ),
        AutonomousAgent(
            id="AGENT-12",
            name="Incident Response Agent",
            role="Emergency Protocol Dispatcher & First-Action Orchestrator",
            status="ACTIVE",
            current_task="Triaging 47 active national incident telemetry markers",
            last_execution=(now - timedelta(seconds=35)).strftime("%H:%M:%S IST"),
            confidence=99.1,
            detected_issues=8,
            recommendations_count=14,
            avatar_color="rose",
            activity_log=[
                "Triaged 8 Critical Category incidents across Odisha, AP, and Maharashtra",
                "Dispatched automated First-Action directives to State Emergency Centers",
                "Placed 12 Quick Response Medical Teams (QRMT) on 15-minute standby"
            ]
        )
    ]

def generate_agent_collaboration() -> List[AgentCollaborationMessage]:
    now = datetime.now()
    return [
        AgentCollaborationMessage(
            id="CHAT-01",
            agent_id="AGENT-01",
            agent_name="Demand Forecast Agent",
            role="Demand Specialist",
            content="ALERT: District Krishna 7-day projected demand for Oral Rehydration Salts (ORS) has surged +34% due to localized river inundation.",
            timestamp=(now - timedelta(minutes=18)).strftime("%H:%M:%S"),
            sentiment="ALERT",
            linked_district="Krishna"
        ),
        AgentCollaborationMessage(
            id="CHAT-02",
            agent_id="AGENT-02",
            agent_name="Inventory Intelligence Agent",
            role="Inventory Sentinel",
            content="CONFIRMED: Machilipatnam Coastal PHC holds only 1,240 units. At current consumption velocity, facility faces complete stock-out in 3.2 days (critical threshold).",
            timestamp=(now - timedelta(minutes=16)).strftime("%H:%M:%S"),
            sentiment="ALERT",
            linked_district="Krishna"
        ),
        AgentCollaborationMessage(
            id="CHAT-03",
            agent_id="AGENT-03",
            agent_name="Supply Chain Logistics Agent",
            role="Logistics Analyzer",
            content="CORRIDOR SCAN: Nearest candidate surplus repository is Guntur Medical College Depot (Holds 18.4 days buffer, 4,200 available units). Distance: 54.2 km. Highway NH-16 is clear.",
            timestamp=(now - timedelta(minutes=14)).strftime("%H:%M:%S"),
            sentiment="PROPOSAL",
            linked_district="Guntur"
        ),
        AgentCollaborationMessage(
            id="CHAT-04",
            agent_id="AGENT-07",
            agent_name="Optimization Solver Agent",
            role="Optimization Solver",
            content="OPTIMIZATION FORMULATED: Recommend lateral reallocation of 800 units ORS from Guntur -> Machilipatnam. Will restore local safety buffer to 12.5 days without depleting Guntur.",
            timestamp=(now - timedelta(minutes=12)).strftime("%H:%M:%S"),
            sentiment="PROPOSAL",
            linked_district="Krishna"
        ),
        AgentCollaborationMessage(
            id="CHAT-05",
            agent_id="AGENT-04",
            agent_name="Emergency Response Agent",
            role="Emergency Coordinator",
            content="TIER-3 ENDORSEMENT: District Krishna is officially under active flood emergency protocol. Recommend immediate administrative approval and priority dispatch escort.",
            timestamp=(now - timedelta(minutes=10)).strftime("%H:%M:%S"),
            sentiment="CONSENSUS",
            linked_district="Krishna"
        ),
        AgentCollaborationMessage(
            id="CHAT-06",
            agent_id="AGENT-10",
            agent_name="Arogya Copilot Agent",
            role="Administrative Copilot",
            content="CONSENSUS REACHED: Recommendation REDIST-001 queued for Human-in-the-Loop administrative approval. Ready for one-click authorization by Health Administrator.",
            timestamp=(now - timedelta(minutes=8)).strftime("%H:%M:%S"),
            sentiment="CONSENSUS",
            linked_district="Krishna"
        )
    ]

def generate_resilience_brain_signals() -> List[ResilienceBrainSignal]:
    now = datetime.now()
    return [
        ResilienceBrainSignal(
            id="SIG-01",
            category="INVENTORY",
            source="Machilipatnam Coastal PHC (Krishna)",
            signal_name="Oral Rehydration Salts (ORS) Reserve Level",
            value="1,240 units (3.2 Days Left)",
            delta_pct=-28.4,
            status="CRITICAL",
            timestamp=(now - timedelta(minutes=2)).strftime("%H:%M:%S"),
            summary="Rapid stock depletion driven by acute diarrheal outpatient cluster"
        ),
        ResilienceBrainSignal(
            id="SIG-02",
            category="DEMAND",
            source="Coastal Delta Surveillance Gateway",
            signal_name="Acute Febrile & GI Outpatient Velocity",
            value="145,880 Daily Patients (+40%)",
            delta_pct=34.2,
            status="CRITICAL",
            timestamp=(now - timedelta(minutes=4)).strftime("%H:%M:%S"),
            summary="Inundation waterlogging triggering localized illness surge"
        ),
        ResilienceBrainSignal(
            id="SIG-03",
            category="CAPACITY",
            source="Krishna District General Hospital",
            signal_name="Inpatient ICU & Oxygen Bed Saturation",
            value="88.4% Occupied (Deficit: 620 Beds)",
            delta_pct=14.5,
            status="ELEVATED",
            timestamp=(now - timedelta(minutes=6)).strftime("%H:%M:%S"),
            summary="Emergency bed occupancy approaching saturation limit"
        ),
        ResilienceBrainSignal(
            id="SIG-04",
            category="ROUTE",
            source="NH-216 Logistics Monitoring Node",
            signal_name="Arterial Road Transit Velocity",
            value="+2.2 Hours Transit Delay",
            delta_pct=42.0,
            status="ELEVATED",
            timestamp=(now - timedelta(minutes=8)).strftime("%H:%M:%S"),
            summary="Waterlogged culvert bridge near Machilipatnam causing carrier slowdown"
        ),
        ResilienceBrainSignal(
            id="SIG-05",
            category="STAFF",
            source="Bhadradri Tribal PHC Gateway",
            signal_name="Clinical Shift Duty Roster Coverage",
            value="38% Attendance (2 of 6 Present)",
            delta_pct=-62.0,
            status="CRITICAL",
            timestamp=(now - timedelta(minutes=10)).strftime("%H:%M:%S"),
            summary="Hill road transit blockage preventing incoming nursing staff changeover"
        ),
        ResilienceBrainSignal(
            id="SIG-06",
            category="CLIMATE",
            source="Central Water Commission River Gauge",
            signal_name="Krishna River Inundation Level",
            value="Above Danger Mark (12.4m)",
            delta_pct=18.0,
            status="ELEVATED",
            timestamp=(now - timedelta(minutes=12)).strftime("%H:%M:%S"),
            summary="Monsoon flash flood surge impacting 3 low-lying sub-districts"
        )
    ]

def generate_cascade_simulation(trigger_scenario: str = "Warehouse failure") -> CascadeSimulationResult:
    return CascadeSimulationResult(
        trigger_event=f"Catastrophic Shock: {trigger_scenario}",
        root_cause_facility="Andhra Pradesh State Medical Depot (Vijayawada)",
        primary_impacts=[
            CascadeNode(
                id="CASC-PRI-01",
                title="Regional State Depot Consignment Freeze",
                layer="PRIMARY",
                entity_type="WAREHOUSE",
                failure_mode="Bulk dispatch automated sorting system power failure",
                severity="CRITICAL",
                latency_hours=0.0,
                affected_nodes_count=1,
                description="Halt of 48 scheduled refrigerated pharmaceutical dispatches."
            ),
            CascadeNode(
                id="CASC-PRI-02",
                title="Highway Corridor Logistics Blockade",
                layer="PRIMARY",
                entity_type="TRANSPORT",
                failure_mode="Outbound carrier vehicles stalled at depot perimeter",
                severity="WARNING",
                latency_hours=2.0,
                affected_nodes_count=14,
                description="Immediate delay of 12,000 essential antibiotic units."
            )
        ],
        secondary_impacts=[
            CascadeNode(
                id="CASC-SEC-01",
                title="District Drug Warehouse Buffer Starvation",
                layer="SECONDARY",
                entity_type="WAREHOUSE",
                failure_mode="District Krishna & Guntur reserve levels drop by 45%",
                severity="CRITICAL",
                latency_hours=12.0,
                affected_nodes_count=2,
                description="Depots unable to fulfill scheduled morning rural PHC replenishments."
            ),
            CascadeNode(
                id="CASC-SEC-02",
                title="Cold-Chain Vaccine Buffer Criticality",
                layer="SECONDARY",
                entity_type="PHC",
                failure_mode="Sub-center vaccine ice-lined refrigerators (ILR) deplete buffer",
                severity="WARNING",
                latency_hours=18.0,
                affected_nodes_count=28,
                description="Immunization sessions paused in 28 rural blocks."
            )
        ],
        tertiary_impacts=[
            CascadeNode(
                id="CASC-TER-01",
                title="Frontline PHC Total Stock-Out & Patient Redirection",
                layer="TERTIARY",
                entity_type="PHC",
                failure_mode="17 coastal PHCs experience complete exhaustion of ORS and Paracetamol",
                severity="CRITICAL",
                latency_hours=36.0,
                affected_nodes_count=17,
                description="Patients redirected to tertiary district general hospitals causing overcrowding."
            ),
            CascadeNode(
                id="CASC-TER-02",
                title="Mass Outpatient Influx at District Hospital",
                layer="TERTIARY",
                entity_type="POPULATION",
                failure_mode="Trauma and emergency ward occupancy hits 114%",
                severity="CRITICAL",
                latency_hours=48.0,
                affected_nodes_count=1,
                description="Severe physician burnout and delayed emergency care."
            )
        ],
        total_facilities_vulnerable=48,
        estimated_population_impacted=1840000,
        containment_actions=[
            "Activate secondary decentralized procurement flex-funds at district level within 4 hours",
            "Reroute emergency medical supplies from Hyderabad National Strategic Reserve Depot via rail express",
            "Deploy mobile health clinics with onboard battery-operated refrigerators to bypass depot halt"
        ]
    )

def generate_early_warnings() -> List[EarlyWarningItem]:
    now = datetime.now()
    return [
        EarlyWarningItem(
            id="WARN-01",
            level=4,
            level_label="CRITICAL",
            title="ORS & Antipyretic Exhaustion Imminent",
            category="MEDICINE_SHORTAGE",
            district_name="Krishna",
            time_horizon_hours=72,
            confidence_pct=94.2,
            contributing_factors=["Monsoon flood diarrheal spike", "NH-216 road transit delay", "3.2-day current buffer"],
            affected_resources=["Oral Rehydration Salts (ORS)", "Paracetamol 500mg Tablets"],
            suggested_mitigation="Approve lateral transfer REDIST-001 (800 units from Guntur) within 12 hours.",
            detected_at=(now - timedelta(hours=1)).strftime("%H:%M IST")
        ),
        EarlyWarningItem(
            id="WARN-02",
            level=4,
            level_label="CRITICAL",
            title="Inpatient Bed Saturation Deficit",
            category="BED_SATURATION",
            district_name="Krishna",
            time_horizon_hours=48,
            confidence_pct=89.0,
            contributing_factors=["88.4% current bed occupancy", "+42% flood outpatient surge", "Limited isolation wards"],
            affected_resources=["General Inpatient Beds", "Oxygen Manifold Cylinders"],
            suggested_mitigation="Erect two 50-bed outdoor disaster triage tents at Machilipatnam and Avanigadda.",
            detected_at=(now - timedelta(hours=2)).strftime("%H:%M IST")
        ),
        EarlyWarningItem(
            id="WARN-03",
            level=3,
            level_label="HIGH_RISK",
            title="Anti-Snake Venom Stock Deficit",
            category="EMERGENCY_SUPPLY",
            district_name="Warangal",
            time_horizon_hours=96,
            confidence_pct=91.5,
            contributing_factors=["Harvesting season reptile bite surge", "Supplier 8-day lead time", "1.4-day remaining buffer"],
            affected_resources=["Anti-Snake Venom (Polyvalent) Lyophilized"],
            suggested_mitigation="Transfer 60 vials from Hyderabad Osmania Central Reserve.",
            detected_at=(now - timedelta(hours=4)).strftime("%H:%M IST")
        ),
        EarlyWarningItem(
            id="WARN-04",
            level=2,
            level_label="WARNING",
            title="Clinical Shift Coverage Gap",
            category="STAFFING_GAP",
            district_name="Khammam",
            time_horizon_hours=24,
            confidence_pct=88.0,
            contributing_factors=["Tribal hill transit landslides", "Monsoon season viral sickness"],
            affected_resources=["Duty Medical Officers", "Nursing Staff"],
            suggested_mitigation="Deploy Mobile Medical Unit #04 from district headquarters.",
            detected_at=(now - timedelta(hours=6)).strftime("%H:%M IST")
        ),
        EarlyWarningItem(
            id="WARN-05",
            level=1,
            level_label="WATCH",
            title="Monsoon Rainfall Influx Surveillance",
            category="CLIMATE_RISK",
            district_name="East Godavari",
            time_horizon_hours=120,
            confidence_pct=82.0,
            contributing_factors=["Upstream Godavari river discharge", "Culvert waterlogging vulnerability"],
            affected_resources=["Pharmaceutical Road Transit Carriers"],
            suggested_mitigation="Pre-inspect State Highway 42 alternative logistics bypass.",
            detected_at=(now - timedelta(hours=8)).strftime("%H:%M IST")
        )
    ]

def generate_smart_procurement() -> List[SmartProcurementItem]:
    return [
        SmartProcurementItem(
            id="PROC-001",
            medicine_id="MED-005",
            medicine_name="Oral Rehydration Salts (ORS) WHO Formula",
            category="IV Fluid & Rehydration",
            current_stock=1240,
            daily_consumption=340,
            reorder_point=2240,
            economic_order_quantity=12500,
            recommended_order_quantity=15000,
            supplier_name="Bharat Parenterals & Fluids Ltd.",
            lead_time_days=5,
            unit_cost=8.0,
            total_estimated_cost_inr=120000.0,
            urgency="URGENT",
            procurement_reason="Current stock is 45% below safety threshold during active flood emergency. Supplier lead time requires immediate order placement.",
            status="PENDING_APPROVAL"
        ),
        SmartProcurementItem(
            id="PROC-002",
            medicine_id="MED-018",
            medicine_name="Anti-Snake Venom (Polyvalent) Lyophilized",
            category="Emergency Serum",
            current_stock=190,
            daily_consumption=24,
            reorder_point=198,
            economic_order_quantity=500,
            recommended_order_quantity=600,
            supplier_name="Serum Institute of India Logistics",
            lead_time_days=8,
            unit_cost=650.0,
            total_estimated_cost_inr=390000.0,
            urgency="URGENT",
            procurement_reason="Agricultural harvest season has depleted tribal buffer stock to 2.9 days.",
            status="PENDING_APPROVAL"
        ),
        SmartProcurementItem(
            id="PROC-003",
            medicine_id="MED-001",
            medicine_name="Paracetamol 500mg Tablets",
            category="Analgesic & Antipyretic",
            current_stock=14200,
            daily_consumption=590,
            reorder_point=3150,
            economic_order_quantity=25000,
            recommended_order_quantity=30000,
            supplier_name="Cipla National Healthcare Supply",
            lead_time_days=4,
            unit_cost=12.5,
            total_estimated_cost_inr=375000.0,
            urgency="HIGH",
            procurement_reason="Outbreak clusters across 3 coastal blocks accelerating daily depletion by 1.31x.",
            status="PENDING_APPROVAL"
        ),
        SmartProcurementItem(
            id="PROC-004",
            medicine_id="MED-011",
            medicine_name="Amoxicillin + Clavulanic Acid 625mg",
            category="Antibiotic",
            current_stock=3600,
            daily_consumption=265,
            reorder_point=1890,
            economic_order_quantity=8000,
            recommended_order_quantity=10000,
            supplier_name="Dr. Reddy's Laboratories Logistics",
            lead_time_days=6,
            unit_cost=65.0,
            total_estimated_cost_inr=650000.0,
            urgency="HIGH",
            procurement_reason="Respiratory infection surge in mining blocks approaching safety threshold.",
            status="ORDERED"
        )
    ]

def generate_suppliers() -> List[SupplierProfile]:
    return [
        SupplierProfile(
            id="SUPP-01",
            name="Bharat Parenterals & Fluids Ltd.",
            headquarters="Vadodara, Gujarat",
            delivery_reliability_pct=94.5,
            avg_delay_days=0.8,
            order_fulfillment_pct=98.2,
            active_contracts_count=18,
            risk_level="LOW",
            historical_performance="IMPROVING",
            lead_time_standard_days=5,
            primary_catalog=["Oral Rehydration Salts (ORS)", "Ringer Lactate IV", "Normal Saline 0.9%"],
            status_alert="Contracted carrier fleet operating on-time"
        ),
        SupplierProfile(
            id="SUPP-02",
            name="Serum Institute of India Logistics",
            headquarters="Pune, Maharashtra",
            delivery_reliability_pct=96.8,
            avg_delay_days=0.5,
            order_fulfillment_pct=99.1,
            active_contracts_count=24,
            risk_level="LOW",
            historical_performance="STABLE",
            lead_time_standard_days=8,
            primary_catalog=["Anti-Snake Venom", "Rabies Vaccine", "Tetanus Toxoid"],
            status_alert="Cold-chain air transport guaranteed"
        ),
        SupplierProfile(
            id="SUPP-03",
            name="Cipla National Healthcare Supply",
            headquarters="Mumbai, Maharashtra",
            delivery_reliability_pct=91.4,
            avg_delay_days=1.2,
            order_fulfillment_pct=96.4,
            active_contracts_count=32,
            risk_level="LOW",
            historical_performance="STABLE",
            lead_time_standard_days=4,
            primary_catalog=["Paracetamol Tablets", "Salbutamol Inhalers", "Metronidazole"],
            status_alert="High-volume contract active"
        ),
        SupplierProfile(
            id="SUPP-04",
            name="Dr. Reddy's Laboratories Logistics",
            headquarters="Hyderabad, Telangana",
            delivery_reliability_pct=88.2,
            avg_delay_days=2.1,
            order_fulfillment_pct=92.0,
            active_contracts_count=15,
            risk_level="MEDIUM",
            historical_performance="DECLINING",
            lead_time_standard_days=6,
            primary_catalog=["Amoxicillin + Clavulanic", "Cefixime 200mg", "Pantoprazole"],
            status_alert="Monsoon highway transit delays observed (+2.1 days avg delay)"
        )
    ]

def generate_alternative_routes() -> List[AlternativeRoute]:
    return [
        AlternativeRoute(
            id="ALT-01",
            primary_route_name="Corridor NH-216 (Vijayawada -> Machilipatnam)",
            primary_status="CONGESTED",
            alternative_route_name="State Highway 42 Bypass via Gudivada",
            detour_distance_km=18.5,
            extra_transit_hours=0.8,
            capacity_pct=85,
            risk_level="LOW",
            reason="Avoids waterlogged low-lying culvert bridge on NH-216. Road elevation +3.2m above flood level.",
            recommended=True
        ),
        AlternativeRoute(
            id="ALT-02",
            primary_route_name="Corridor NH-16 (Visakhapatnam -> Kakinada)",
            primary_status="CONGESTED",
            alternative_route_name="Costal Express Highway Link",
            detour_distance_km=24.0,
            extra_transit_hours=1.2,
            capacity_pct=90,
            risk_level="LOW",
            reason="Circumvents agricultural market traffic backlog around Tuni.",
            recommended=True
        ),
        AlternativeRoute(
            id="ALT-03",
            primary_route_name="Hill Highway SH-09 (Khammam -> Bhadradri)",
            primary_status="BLOCKED",
            alternative_route_name="Western Ridge Forest Route with 4x4 Escort",
            detour_distance_km=42.0,
            extra_transit_hours=2.5,
            capacity_pct=40,
            risk_level="HIGH",
            reason="Primary road blocked by rockfall. Alternative route requires off-road 4WD medical convoy.",
            recommended=False
        )
    ]

def generate_swap_offers() -> List[SwapMarketOffer]:
    return [
        SwapMarketOffer(
            id="SWAP-01",
            district_name="Guntur",
            phc_name="Guntur Medical College Central Depot",
            type="SURPLUS",
            medicine_name="Oral Rehydration Salts (ORS) WHO Formula",
            quantity=1200,
            days_buffer=18.4,
            urgency="LOW",
            compatibility_score=98.5,
            matched_district="Krishna",
            status="MATCHED"
        ),
        SwapMarketOffer(
            id="SWAP-02",
            district_name="Krishna",
            phc_name="Machilipatnam Coastal PHC",
            type="NEED",
            medicine_name="Oral Rehydration Salts (ORS) WHO Formula",
            quantity=800,
            days_buffer=3.2,
            urgency="URGENT",
            compatibility_score=98.5,
            matched_district="Guntur",
            status="MATCHED"
        ),
        SwapMarketOffer(
            id="SWAP-03",
            district_name="Visakhapatnam",
            phc_name="King George Hospital Supply Store",
            type="SURPLUS",
            medicine_name="Paracetamol 500mg Tablets",
            quantity=5000,
            days_buffer=24.0,
            urgency="LOW",
            compatibility_score=94.0,
            matched_district="East Godavari",
            status="OPEN"
        ),
        SwapMarketOffer(
            id="SWAP-04",
            district_name="Hyderabad",
            phc_name="Osmania General Store",
            type="SURPLUS",
            medicine_name="Anti-Snake Venom (Polyvalent)",
            quantity=120,
            days_buffer=31.0,
            urgency="LOW",
            compatibility_score=96.2,
            matched_district="Warangal",
            status="MATCHED"
        )
    ]

def generate_playbooks() -> List[EmergencyPlaybook]:
    return [
        EmergencyPlaybook(
            id="PLAY-01",
            disaster_type="FLOOD",
            title="Monsoon River Flash Inundation Protocol",
            trigger_criteria="River water level > Danger Mark + 10-day rainfall exceeding 300mm",
            immediate_actions=[
                "Deploy 6 amphibious boat health clinics along river delta",
                "Pre-position 10,000 sachets of ORS and 5,000 water purification tablets",
                "Erect auxiliary 50-bed triage tents on elevated school grounds",
                "Activate lateral stock transfers from inland Guntur warehouses"
            ],
            priority_phcs=["Machilipatnam Coastal PHC", "Avanigadda Rural Hospital", "Nagayalanka Primary Clinic"],
            resource_requirements={
                "ORS Packets": "15,000",
                "IV Fluids (RL/NS)": "5,000 bottles",
                "Halazone Water Tablets": "20,000 strips",
                "Mobile Triage Tents": "6 units"
            },
            recovery_milestones=[
                "Recede water gauge below alert threshold",
                "Clear 100% gastrointestinal outpatient surge backlog",
                "Replenish frontline safety stock to 14 days",
                "Restore permanent power grid and demobilize diesel generators"
            ],
            active_phase="RESPONSE"
        ),
        EmergencyPlaybook(
            id="PLAY-02",
            disaster_type="OUTBREAK",
            title="Vector-Borne Dengue & Acute Febrile Illness Surge",
            trigger_criteria="Local fever test positivity > 18% in high-density urban wards",
            immediate_actions=[
                "Expedite distribution of 2,500 Dengue NS1 rapid diagnostic test kits",
                "Mobilize 15 pediatric nursing officers to community health centres",
                "Reroute intravenous fluid supplies from state central repository"
            ],
            priority_phcs=["Hyderabad Urban Health Centre", "Charminar Dispensary", "Secunderabad Community Hospital"],
            resource_requirements={
                "Dengue NS1 Antigen Kits": "3,000",
                "Paracetamol 500mg": "25,000 strips",
                "Platelet Infusion Sets": "800 sets"
            },
            recovery_milestones=[
                "Test positivity drops below 5%",
                "Zero ICU mortality from hemorrhagic shock",
                "Restock rapid diagnostic test kits to 30-day baseline"
            ],
            active_phase="INACTIVE"
        ),
        EmergencyPlaybook(
            id="PLAY-03",
            disaster_type="CYCLONE",
            title="Severe Coastal Storm & Windstorm Disruption Protocol",
            trigger_criteria="IMD Category-3 cyclone alert landfall projection < 48 hours",
            immediate_actions=[
                "Inspect diesel fuel reserves at all 26 coastal PHCs (Minimum 72 hours fuel)",
                "Secure emergency trauma kits and cold-chain vaccines in reinforced shelters",
                "Activate satellite communication telemetry fallback"
            ],
            priority_phcs=["Puri Beach Primary Health Post", "Ganjam Coastal CHC", "Visakhapatnam Harbor Clinic"],
            resource_requirements={
                "Emergency Trauma Kits": "1,200",
                "Surgical Sutures & Gloves": "10,000 pairs",
                "Generator Diesel Reserve": "15,000 Litres"
            },
            recovery_milestones=[
                "Structural safety clearance of all PHC buildings",
                "Reconnection of optical fiber broadband telemetry",
                "Debris removal from arterial logistics lanes"
            ],
            active_phase="INACTIVE"
        )
    ]

def generate_equipment_and_cold_chain() -> Dict[str, Any]:
    equipment = [
        MedicalEquipment(
            id="EQ-001",
            name="Pressure Swing Adsorption (PSA) Oxygen Plant (500 LPM)",
            category="OXYGEN_PLANT",
            phc_id="PHC-0042",
            phc_name="Machilipatnam Coastal PHC",
            district_name="Krishna",
            age_years=3.2,
            usage_hours_daily=22.5,
            maintenance_health_score=88.0,
            status="OPERATIONAL",
            failure_probability_pct=4.2,
            next_service_due="In 45 Days"
        ),
        MedicalEquipment(
            id="EQ-002",
            name="Ice-Lined Refrigerator (ILR) 200L Vaccine Storage",
            category="REFRIGERATION",
            phc_id="PHC-0042",
            phc_name="Machilipatnam Coastal PHC",
            district_name="Krishna",
            age_years=2.8,
            usage_hours_daily=24.0,
            maintenance_health_score=94.5,
            status="OPERATIONAL",
            failure_probability_pct=1.8,
            next_service_due="In 60 Days"
        ),
        MedicalEquipment(
            id="EQ-003",
            name="Emergency 45 kVA Silent Diesel Generator Set",
            category="GENERATOR",
            phc_id="PHC-0018",
            phc_name="Avanigadda Rural Hospital",
            district_name="Krishna",
            age_years=4.5,
            usage_hours_daily=14.0,
            maintenance_health_score=78.2,
            status="MAINTENANCE_DUE",
            failure_probability_pct=12.5,
            next_service_due="Overdue by 3 Days"
        ),
        MedicalEquipment(
            id="EQ-004",
            name="Transport Intensive Care Ventilator (ICU Tier-2)",
            category="VENTILATOR",
            phc_id="PHC-0065",
            phc_name="Guntur Urban Community Health Centre",
            district_name="Guntur",
            age_years=1.8,
            usage_hours_daily=18.0,
            maintenance_health_score=96.0,
            status="OPERATIONAL",
            failure_probability_pct=0.9,
            next_service_due="In 90 Days"
        )
    ]

    cold_chain = [
        ColdChainSensor(
            id="CC-001",
            facility_name="Machilipatnam Vaccine Hub (ILR Unit 1)",
            district_name="Krishna",
            storage_type="ILR_VACCINE",
            current_temp_c=4.2,
            min_safe_temp_c=2.0,
            max_safe_temp_c=8.0,
            status="NORMAL",
            vaccine_doses_secured=4850,
            last_ping="30 seconds ago",
            backup_power_ready=True
        ),
        ColdChainSensor(
            id="CC-002",
            facility_name="Avanigadda Rural Clinic ILR",
            district_name="Krishna",
            storage_type="ILR_VACCINE",
            current_temp_c=5.1,
            min_safe_temp_c=2.0,
            max_safe_temp_c=8.0,
            status="NORMAL",
            vaccine_doses_secured=2200,
            last_ping="1 minute ago",
            backup_power_ready=True
        ),
        ColdChainSensor(
            id="CC-003",
            facility_name="Bhadradri Tribal PHC Cold Box",
            district_name="Khammam",
            storage_type="ILR_VACCINE",
            current_temp_c=7.4,
            min_safe_temp_c=2.0,
            max_safe_temp_c=8.0,
            status="WARNING",
            vaccine_doses_secured=950,
            last_ping="2 minutes ago",
            backup_power_ready=False
        )
    ]

    energy = [
        EnergyResilienceMetric(
            id="ENG-01",
            facility_name="Machilipatnam Coastal PHC",
            district_name="Krishna",
            grid_power_status="FLUCTUATING",
            diesel_generator_hours_left=38.5,
            solar_battery_storage_kwh=24.0,
            critical_load_supported_hours=48.0,
            risk_level="MODERATE"
        ),
        EnergyResilienceMetric(
            id="ENG-02",
            facility_name="Avanigadda Rural Hospital",
            district_name="Krishna",
            grid_power_status="OUTAGE",
            diesel_generator_hours_left=18.0,
            solar_battery_storage_kwh=12.5,
            critical_load_supported_hours=22.0,
            risk_level="CRITICAL"
        )
    ]

    return {
        "equipment": equipment,
        "cold_chain": cold_chain,
        "energy": energy
    }

def generate_model_observatory_and_quality() -> Dict[str, Any]:
    models = [
        ModelObservatoryMetric(
            model_id="MOD-01",
            name="Demand Forecast Time-Series Ensemble",
            version="v2.4.1",
            last_trained="2 days ago",
            accuracy_pct=94.6,
            drift_level_pct=2.1,
            inference_latency_ms=18.4,
            daily_predictions_count=6940,
            status="OPTIMAL"
        ),
        ModelObservatoryMetric(
            model_id="MOD-02",
            name="Stock-Out Lead-Time Depletion Classifier",
            version="v2.2.0",
            last_trained="4 days ago",
            accuracy_pct=96.8,
            drift_level_pct=1.4,
            inference_latency_ms=12.2,
            daily_predictions_count=48500,
            status="OPTIMAL"
        ),
        ModelObservatoryMetric(
            model_id="MOD-03",
            name="Z-Score Anomaly Detection Filter",
            version="v1.9.4",
            last_trained="1 day ago",
            accuracy_pct=98.1,
            drift_level_pct=3.8,
            inference_latency_ms=8.5,
            daily_predictions_count=145000,
            status="MONITOR_DRIFT"
        ),
        ModelObservatoryMetric(
            model_id="MOD-04",
            name="Integer Linear Programming Route Optimizer",
            version="v3.1.0",
            last_trained="Continuous Solver",
            accuracy_pct=97.4,
            drift_level_pct=0.0,
            inference_latency_ms=45.0,
            daily_predictions_count=340,
            status="OPTIMAL"
        )
    ]

    data_quality = DataQualityMetric(
        overall_quality_score=98.4,
        missing_telemetry_fields=14,
        duplicate_records_flagged=3,
        impossible_values_filtered=0,
        stale_sensors_count=2,
        outliers_detected=4,
        total_records_processed=145800,
        last_audit_run="Just now"
    )

    return {
        "models": models,
        "quality": data_quality
    }

def generate_root_cause_diagnostics() -> RootCauseDiagnostic:
    return RootCauseDiagnostic(
        incident_id="INC-2026-0924",
        title="Oral Rehydration Salts (ORS) & Paracetamol Stock-Out Vulnerability",
        district_name="Krishna",
        phc_name="Machilipatnam Coastal PHC",
        primary_symptom="Stock reserve depleted to 2.4 days against 14-day statutory buffer",
        factors=[
            RootCauseFactor(
                name="Acute Influx of Monsoon Waterborne Gastroenteritis",
                contribution_pct=34.5,
                observed_metric="+46% OPD Footfall",
                baseline_metric="320 patients/day",
                category="DEMAND_SURGE",
                explanation="Monsoon river swelling triggered localized waterborne contamination in delta wards."
            ),
            RootCauseFactor(
                name="Arterial Highway Inundation along NH-216",
                contribution_pct=28.0,
                observed_metric="+2.4 Days Delivery Delay",
                baseline_metric="18 Hours transit time",
                category="SUPPLY_DISRUPTION",
                explanation="Logistics carrier stranded due to submerged culvert; bypass via SH-42 required."
            ),
            RootCauseFactor(
                name="Supplier Consignment Batch Testing Backlog",
                contribution_pct=21.5,
                observed_metric="4 Days QA Hold",
                baseline_metric="24 Hours QA Clearance",
                category="SUPPLIER_PERFORMANCE",
                explanation="Central depot testing delay on batch NLEM-ORS-402 held up regional dispatch."
            ),
            RootCauseFactor(
                name="Neighboring PHC Stockpile Hoarding",
                contribution_pct=16.0,
                observed_metric="+18 Days Excess Inventory in Avanigadda",
                baseline_metric="14 Days Safety Stock",
                category="DISTRIBUTION_INEFFICIENCY",
                explanation="Sub-district distribution skew left downstream clinics depleted while inland clinic held surplus."
            )
        ],
        causal_chain=[
            "Localized River Flooding & Coastal Waterlogging",
            "Outpatient Gastrointestinal Spike (+46% Patient Influx)",
            "Frontline ORS/Paracetamol Consumption Accellerated 3.4x",
            "NH-216 Transit Route Blockage Stalled Replenishment Trucks",
            "Depletion to 2.4 Days-of-Supply with Zero Emergency Buffer"
        ],
        suggested_countermeasures=[
            "Execute lateral transfer of 850 ORS boxes from Avanigadda Rural Hospital (SH-42 detour)",
            "Switch procurement supplier allocation to Bharat Serum Logistics",
            "Pre-authorize rapid release of district contingency buffer"
        ]
    )

def generate_decision_options() -> List[DecisionOption]:
    return [
        DecisionOption(
            id="OPT-A",
            label="Option A: Lateral Redistribution from Guntur Surplus Warehouse",
            strategy="LATERAL_REDISTRIBUTION",
            time_to_impact_hours=6.5,
            resources_affected="850 ORS boxes, 1,200 Paracetamol strips",
            shortage_reduction_pct=88,
            transport_complexity="LOW",
            financial_cost_inr=14200.0,
            feasibility_score=94,
            pros=[
                "Fastest turnaround (6.5 hours transit via State Highway 42)",
                "Zero procurement cost (utilizes verified state surplus buffer)",
                "Preserves regional inventory equilibrium without supplier delay"
            ],
            cons=[
                "Reduces Guntur warehouse buffer from 28 days to 21 days",
                "Requires district vehicle dispatch authorization"
            ]
        ),
        DecisionOption(
            id="OPT-B",
            label="Option B: Fast-Track Emergency Purchase Order via Andhra Pharma Depot",
            strategy="EMERGENCY_PURCHASE",
            time_to_impact_hours=24.0,
            resources_affected="2,500 ORS boxes, 5,000 Paracetamol strips",
            shortage_reduction_pct=100,
            transport_complexity="MODERATE",
            financial_cost_inr=84000.0,
            feasibility_score=78,
            pros=[
                "Completely restores 30-day statutory buffer for entire sub-division",
                "Does not deplete neighboring district stockpiles"
            ],
            cons=[
                "High commercial unit cost premium (+18% emergency surcharge)",
                "Requires emergency fiscal sign-off by District Collector",
                "Transit takes 24 hours (does not solve immediate 6-hour gap)"
            ]
        ),
        DecisionOption(
            id="OPT-C",
            label="Option C: Activate Alternate Supplier (Bharat Serum Logistics)",
            strategy="ALTERNATE_SUPPLIER",
            time_to_impact_hours=18.0,
            resources_affected="1,500 ORS boxes, 2,000 Paracetamol strips",
            shortage_reduction_pct=92,
            transport_complexity="MODERATE",
            financial_cost_inr=42500.0,
            feasibility_score=85,
            pros=[
                "Reliable carrier with cold-chain fleet and GPS tracking",
                "94.2% historical delivery SLA compliance"
            ],
            cons=[
                "Requires 2-hour contract validation protocol",
                "Slightly longer distance than inland depot transfer"
            ]
        ),
        DecisionOption(
            id="OPT-D",
            label="Option D: Regional Stockpile Drawdown from Vijayawada Central Reserve",
            strategy="REGIONAL_STOCKPILE",
            time_to_impact_hours=12.0,
            resources_affected="1,000 ORS boxes, 1,500 Paracetamol strips",
            shortage_reduction_pct=82,
            transport_complexity="LOW",
            financial_cost_inr=18500.0,
            feasibility_score=89,
            pros=[
                "Authorized state disaster reserve pool with pre-cleared logistics",
                "Balanced impact on regional health network"
            ],
            cons=[
                "Requires state health commissioner concurrence",
                "Depletes central reserve during monsoon season"
            ]
        )
    ]

def generate_scalability_simulation(phc_scale: int = 1248) -> Dict[str, Any]:
    # phc_scale can be 100, 500, 1000, 5000, 10000+
    scale_multiplier = phc_scale / 1000.0
    return {
        "phc_scale": phc_scale,
        "daily_telemetry_events": int(86400 * 12 * scale_multiplier),
        "data_throughput_gb_day": round(42.5 * scale_multiplier, 2),
        "ai_inference_calls_daily": int(185000 * scale_multiplier),
        "federated_edge_nodes": phc_scale,
        "active_supply_corridors": int(420 * scale_multiplier),
        "simulated_sub_seconds_latency_ms": round(14.2 + (scale_multiplier * 1.8), 1),
        "server_clusters_required": max(2, int(scale_multiplier * 4)),
        "resilience_engine_capacity_pct": min(98.5, round(65.0 + (scale_multiplier * 4.2), 1)),
        "estimated_annual_cost_savings_inr_crores": round(18.5 * scale_multiplier, 2),
        "prevented_critical_stockouts_annually": int(1420 * scale_multiplier)
    }

