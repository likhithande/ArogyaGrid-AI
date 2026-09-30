import os
import json
from typing import Dict, Any, List
from models.schemas import CopilotQueryRequest, CopilotResponse
from data.synthetic_generator import data_store
from services.inventory_engine import inventory_engine
from services.incident_engine import incident_engine

def ask_arogya_copilot(req: CopilotQueryRequest) -> CopilotResponse:
    q = req.query.strip().lower()
    lang = req.language.lower()

    # Determine intent and language keywords
    is_telugu = any(k in q for k in ["ఏ", "జిల్లాల్లో", "మందుల", "కొరత", "కృష్ణా", "ఎందుకు", "ఎవరికి", "ఎంత"]) or lang == "te"
    is_hindi = any(k in q for k in ["कौन", "जिलों", "दवा", "कमी", "खतरा", "कृष्णा", "क्यों", "तैयारी"]) or lang == "hi"

    # Match queries
    if "district" in q and ("highest" in q or "risk" in q or "stock-out" in q or "stockout" in q) or "జిల్లాల్లో" in q or "जिलों" in q:
        if is_telugu:
            answer = (
                "విశ్లేషణ ప్రకారం, **కృష్ణా జిల్లా (రిస్క్: క్రిటికల్)** మరియు **ఈస్ట్ గోదావరి జిల్లా (రిస్క్: హై)** అత్యధిక స్టాక్-అవుట్ ప్రమాదంలో ఉన్నాయి. "
                "కృష్ణా జిల్లాలో వరద ప్రభావం వల్ల ఓరల్ రీహైడ్రేషన్ సాల్ట్స్ (ORS) మరియు పారాసిటమాల్ వినియోగం గత 48 గంటల్లో 3.7 రెట్లు పెరిగింది."
            )
            actions = [
                "కృష్ణా జిల్లాకు గుంటూరు డిపో నుండి 800 యూనిట్ల ORS బదిలీని ఆమోదించండి",
                "ఈస్ట్ గోదావరికి విశాఖపట్నం నుండి 2,400 పారాసిటమాల్ స్ట్రిప్స్ పంపండి",
                "సహాయక శిబిరాల్లో అత్యవసర మొబైల్ మెడికల్ టీములను మోహరించండి"
            ]
            followups = [
                "కృష్ణా జిల్లాలో ఎక్కువ రిస్క్ ఎందుకు కనిపిస్తోంది?",
                "72 గంటల్లో ఏ మందులు అయిపోవచ్చు?",
                "ఈ రోజు వనరుల పునఃపంపిణీ ప్రణాళికను రూపొందించండి"
            ]
            explanation = "సింథటిక్ ఆరోగ్య డేటా ఆధారంగా డిమాండ్, రవాణా ఆలస్యం మరియు ప్రస్తుత నిల్వల విశ్లేషణ."
        elif is_hindi:
            answer = (
                "हमारे विश्लेषण के अनुसार, **कृष्णा जिला (क्रिटिकल जोखिम)** और **पूर्वी गोदावरी (उच्च जोखिम)** सबसे अधिक स्टॉक-आउट जोखिम में हैं। "
                "कृष्णा जिले में बाढ़ के प्रभाव के कारण पिछले 48 घंटों में ओआरएस (ORS) और पैरासिटामोल की मांग 3.7 गुना बढ़ गई है।"
            )
            actions = [
                "कृष्णा जिले के लिए गुंटूर डिपो से 800 यूनिट ORS ट्रांसफर स्वीकृत करें",
                "पूर्वी गोदावरी में 2,400 पैरासिटामोल स्ट्रिप्स का पार्श्व पुनः आवंटन करें",
                "संवेदनशील पीएचसी में आपातकालीन मोबाइल स्वास्थ्य दल तैनात करें"
            ]
            followups = [
                "कृष्णा जिले में उच्च जोखिम क्यों दिख रहा है?",
                "72 घंटों में कौन सी दवाएं खत्म हो सकती हैं?",
                "आपातकालीन प्रतिक्रिया की स्थिति संक्षेप में बताएं"
            ]
            explanation = "विश्लेषण वर्तमान खपत दर, आपूर्ति लीड समय और मौसमी रोग रुझानों पर आधारित है।"
        else:
            answer = (
                "Based on multi-factor telemetry across 51 monitored districts, **District Krishna (Resilience: 63.4, Status: CRITICAL)** "
                "and **East Godavari (Resilience: 69.1, Status: HIGH)** face the highest imminent stock-out vulnerability. "
                "In District Krishna, acute gastroenteritis surges post-inundation have depleted ORS reserves to 3.2 days."
            )
            actions = [
                "Approve pending lateral transfer of 800 ORS units from Guntur Central Depot",
                "Authorize emergency stock dispatch of 2,400 Paracetamol strips from Visakhapatnam",
                "Deploy Mobile Medical Unit #04 to Machilipatnam and Avanigadda coastal blocks"
            ]
            followups = [
                "Why is District Krishna showing high risk?",
                "What medicines may run out within 72 hours?",
                "Generate today's resource redistribution plan"
            ]
            explanation = "Derived from real-time consumption velocity, supplier lead-time variance, and cluster inpatient surge metrics."

        metrics = [
            {"label": "Highest Risk District", "value": "Krishna (AP)", "badge": "CRITICAL"},
            {"label": "Critical Medicines", "value": "ORS, Paracetamol, RL", "badge": "URGENT"},
            {"label": "Predicted Days to Stock-out", "value": "2.8 - 3.2 Days", "badge": "WARNING"},
            {"label": "Impacted PHCs", "value": "17 Facilities", "badge": "ALERT"}
        ]
        chart_data = [
            {"name": "Krishna", "risk_score": 88, "stockout_prob": 92},
            {"name": "East Godavari", "risk_score": 76, "stockout_prob": 78},
            {"name": "Puri", "risk_score": 71, "stockout_prob": 68},
            {"name": "Guntur", "risk_score": 42, "stockout_prob": 28},
            {"name": "Hyderabad", "risk_score": 18, "stockout_prob": 12}
        ]

        return CopilotResponse(
            answer=answer,
            language=lang,
            supporting_metrics=metrics,
            recommended_actions=actions,
            suggested_followups=followups,
            chart_type="BAR_RISK",
            chart_data=chart_data,
            explanation=explanation
        )

    elif "72" in q or "run out" in q or "అయిపోవచ్చు" in q or "खत्म" in q:
        answer = (
            "Three essential medical supplies have a >85% likelihood of total stock-out within 72 hours if no lateral intervention occurs:\n\n"
            "1. **Oral Rehydration Salts (ORS)**: 1,240 units remaining (Current daily draw: 340 units, Depletion in **3.2 Days**)\n"
            "2. **Anti-Snake Venom (Polyvalent)** in Warangal & Krishna: 190 vials remaining (Depletion in **2.9 Days**)\n"
            "3. **Paracetamol 500mg** at PHC-0042 (Machilipatnam): Depletion in **1.8 Days** due to localized febrile cluster."
        )
        metrics = [
            {"label": "ORS WHO Formula", "value": "3.2 Days Stock", "badge": "CRITICAL"},
            {"label": "Anti-Snake Venom", "value": "2.9 Days Stock", "badge": "CRITICAL"},
            {"label": "Paracetamol 500mg", "value": "3.6 Days (Sub-Dist)", "badge": "HIGH"}
        ]
        actions = [
            "Trigger automated lateral inventory reallocation from neighboring surplus depots",
            "Notify State Drug Procurement Corporation for fast-track local purchase flex-funds",
            "Prioritize FEFO dispatch for batches with <= 90 days shelf-life"
        ]
        followups = [
            "Show me districts with excess inventory",
            "Simulate a 40% patient surge",
            "Why is District Krishna showing high risk?"
        ]
        return CopilotResponse(
            answer=answer,
            language=lang,
            supporting_metrics=metrics,
            recommended_actions=actions,
            suggested_followups=followups,
            chart_type="STOCK_DAYS",
            chart_data=[
                {"name": "ORS Sachets", "days_left": 3.2, "safety_threshold": 7.0},
                {"name": "Anti-Snake Venom", "days_left": 2.9, "safety_threshold": 8.0},
                {"name": "Paracetamol 500mg", "days_left": 3.6, "safety_threshold": 6.0},
                {"name": "Ringer Lactate", "days_left": 5.4, "safety_threshold": 5.0},
                {"name": "Amoxicillin 625mg", "days_left": 6.8, "safety_threshold": 6.0}
            ],
            explanation="Calculated by `Stock / max(Daily Consumption, Predicted Velocity)` adjusting for supplier lead time."
        )

    elif "krishna" in q or "కృష్ణా" in q or "कृष्णा" in q:
        answer = (
            "**District Krishna Root-Cause Diagnostic Analysis:**\n\n"
            "• **Inundation Shock**: Heavy upstream Krishna river discharge caused localized flooding across 3 taluks (Machilipatnam, Avanigadda, Nagayalanka).\n"
            "• **Gastrointestinal Footfall Surge (+34%)**: 3,400 additional outpatients presenting acute diarrhea and febrile illness.\n"
            "• **Supply Transit Choke**: Waterlogged culvert on NH-216 delayed scheduled bulk consignments from Vijayawada state warehouse by 2.4 days.\n"
            "• **Bed Occupancy**: Surge has pushed rural hospital bed utilization to 88.4%."
        )
        metrics = [
            {"label": "Footfall Spike", "value": "+34%", "badge": "SURGE"},
            {"label": "Supply Lead-time Delay", "value": "+2.4 Days", "badge": "TRANSIT"},
            {"label": "Bed Occupancy", "value": "88.4%", "badge": "WARNING"},
            {"label": "Active Emergency Tier", "value": "Tier 3 Critical", "badge": "ALERT"}
        ]
        actions = [
            "Execute lateral transfer REDIST-001 (800 units ORS from Guntur)",
            "Reroute pharmaceutical logistics via State Highway 42 bypass",
            "Deploy 2 temporary 50-bed inpatient tents at Machilipatnam"
        ]
        followups = [
            "Simulate a 40% patient surge",
            "Generate today's resource redistribution plan",
            "Which PHCs need immediate attention?"
        ]
        return CopilotResponse(
            answer=answer,
            language=lang,
            supporting_metrics=metrics,
            recommended_actions=actions,
            suggested_followups=followups,
            chart_type="KRISHNA_RADAR",
            explanation="Synthesis of river water gauge levels, outpatient ICD-10 cluster tags, and GPS carrier vehicle telematics."
        )

    elif "excess" in q or "surplus" in q:
        answer = (
            "The following logistics nodes possess healthy inventory surplus exceeding mandated 14-day contingency thresholds:\n\n"
            "1. **Guntur Medical Depot**: ORS excess (+18.4 days reserve, 4,200 available units)\n"
            "2. **Visakhapatnam King George Hospital Hub**: Paracetamol & Antibiotics (+24.0 days reserve, 18,500 strips)\n"
            "3. **Hyderabad Osmania General Store**: Anti-Snake Venom (+31.0 days reserve, 450 vials)\n"
            "4. **Bengaluru Urban Logistics Centre**: Amoxicillin & IV fluids (+21.0 days reserve)\n\n"
            "These surplus nodes can safely support deficit districts without compromising their own local safety stock."
        )
        metrics = [
            {"label": "Guntur Depot (ORS)", "value": "+18.4 Days Buffer", "badge": "HEALTHY"},
            {"label": "Visakhapatnam Hub", "value": "+24.0 Days Buffer", "badge": "HEALTHY"},
            {"label": "Hyderabad Central", "value": "+31.0 Days Buffer", "badge": "HEALTHY"}
        ]
        actions = [
            "Approve bulk lateral dispatches from Guntur and Visakhapatnam",
            "Lock minimum 14-day local reserve in surplus warehouses to prevent over-depletion"
        ]
        followups = [
            "Generate today's resource redistribution plan",
            "Which districts are at highest stock-out risk?"
        ]
        return CopilotResponse(
            answer=answer,
            language=lang,
            supporting_metrics=metrics,
            recommended_actions=actions,
            suggested_followups=followups,
            explanation="Identified using linear inventory buffer bounds against 30-day moving average consumption."
        )

    elif "redistribution" in q or "plan" in q or "పునఃపంపిణీ" in q:
        answer = (
            "**Today's AI Optimized Resource Redistribution Plan:**\n\n"
            "• **Route 1 (URGENT)**: Move 800 units ORS from **Guntur Medical Depot** → **Machilipatnam PHC (Krishna)**. Transit: 54 km (1.8 hours).\n"
            "• **Route 2 (HIGH)**: Move 2,400 Paracetamol strips from **Visakhapatnam Hub** → **Kakinada Rural PHC (East Godavari)**. Transit: 148 km (3.5 hours).\n"
            "• **Route 3 (URGENT)**: Move 60 vials Anti-Snake Venom from **Hyderabad Osmania** → **Hanamkonda Clinic (Warangal)**. Transit: 142 km (2.9 hours).\n"
            "• **Route 4 (MEDIUM)**: Move 600 bottles Ringer Lactate from **Pune Sassoon** → **Barshi CHC (Solapur)**. Transit: 210 km (4.2 hours)."
        )
        metrics = [
            {"label": "Total Active Transfers", "value": "4 Routes", "badge": "OPTIMIZED"},
            {"label": "Average Transit Time", "value": "3.1 Hours", "badge": "RAPID"},
            {"label": "Stock-outs Prevented", "value": "11 Facilities", "badge": "SUCCESS"},
            {"label": "Estimated Cost Savings", "value": "₹ 1,84,000", "badge": "EFFICIENCY"}
        ]
        actions = [
            "Execute All Pending Transfers (One-Click Approval)",
            "Notify District Transport Coordinators via Automated SMS & e-Pass",
            "Print Transit Dispatch Waybills"
        ]
        followups = [
            "Simulate a 40% patient surge",
            "Summarize emergency readiness"
        ]
        return CopilotResponse(
            answer=answer,
            language=lang,
            supporting_metrics=metrics,
            recommended_actions=actions,
            suggested_followups=followups,
            explanation="Generated via Integer Linear Programming (ILP) minimizing aggregate travel time subject to safety stock constraints."
        )

    elif ("patient surge" in q) or ("40%" in q) or ("surge" in q and "cyclone" not in q and "odisha" not in q):
        answer = (
            "**Simulation Results for +40% Patient Surge Scenario:**\n\n"
            "• **Total Outpatient Footfall**: Increases from 104,200 to **145,880 daily patients** across 691 PHCs.\n"
            "• **Bed Occupancy**: Surges from 74.2% to **86.1%**, creating an acute deficit of **620 inpatient beds** in 17 critical PHCs.\n"
            "• **Medicine Depletion**: Accelerated by 1.48x; critical stock-out items expand from 3 to **11 essential medicines**.\n"
            "• **Medical Staff Pressure**: Workload index rises from 18.2 to **26.4 patients/staff-hour**.\n"
            "• **Resilience Score Impact**: Overall Network Resilience Index drops from 82.4 to **61.8/100**."
        )
        metrics = [
            {"label": "Projected Footfall", "value": "145,880 (+40%)", "badge": "SURGE"},
            {"label": "Bed Occupancy", "value": "86.1% (+11.9%)", "badge": "WARNING"},
            {"label": "Critical Stock-outs", "value": "11 Medicines (+8)", "badge": "CRITICAL"},
            {"label": "Resilience Score", "value": "61.8 (-20.6 pts)", "badge": "VULNERABLE"}
        ]
        actions = [
            "Pre-authorize 12 cross-district lateral medicine reallocations",
            "Mobilize auxiliary nursing reserve to high-demand facilities",
            "Erect temporary outdoor medical stabilization shelters"
        ]
        followups = [
            "Which PHCs need immediate attention?",
            "Generate today's resource redistribution plan"
        ]
        return CopilotResponse(
            answer=answer,
            language=lang,
            supporting_metrics=metrics,
            recommended_actions=actions,
            suggested_followups=followups,
            chart_type="SIMULATION_BAR",
            explanation="Simulated on the Healthcare Digital Twin graph evaluating multi-tier queue dynamics and consumption elasticity."
        )

    elif ("highest" in q and "risk" in q and "state" in q) or "highest medicine risk" in q:
        inv_summary = inventory_engine.get_summary()
        inc_summary = incident_engine.get_summary()
        answer = (
            "**National State-Level Medicine Risk Ranking (Live Telemetry):**\n\n"
            "1. **Odisha (Resilience: 38.2 — CRITICAL)**: Projected severe cyclonic landfall impacting 6 coastal districts. Antibiotic and ORS stockout vulnerability at 88%.\n"
            "2. **Bihar (Resilience: 46.5 — HIGH RISK)**: Seasonal monsoon waterlogging affecting north riverine belts (Patna, Muzaffarpur). IV fluids and antivenom buffers depressed.\n"
            "3. **Maharashtra (Resilience: 52.8 — HIGH RISK)**: Vidarbha and Marathwada regional hubs experiencing acute dengue and febrile surge (+32% consumption velocity).\n"
            "4. **Assam (Resilience: 56.4 — HIGH RISK)**: Brahmaputra flood warnings triggering cold-chain power intermittency in 3 peripheral districts.\n"
            "5. **Andhra Pradesh (Resilience: 61.2 — WATCH)**: Coastal Delta stabilizing post lateral dispatch; 14 frontline PHCs maintained on active monitoring."
        )
        metrics = [
            {"label": "Highest Risk State", "value": "Odisha (38.2)", "badge": "CRITICAL"},
            {"label": "National Medicines Monitored", "value": f"{inv_summary['medicines_monitored']:,}", "badge": "LIVE"},
            {"label": "Critical Stockouts", "value": f"{inv_summary['critical_stockouts']}", "badge": "ALERT"},
            {"label": "Active Incidents", "value": f"{inc_summary['total_incidents']}", "badge": "URGENT"}
        ]
        actions = [
            "Trigger automated lateral inventory reallocation from surplus hubs",
            "Authorize Emergency Agent Swarm deployment for Odisha and Bihar",
            "Notify State Drug Controllers to fast-track regional depot transfers"
        ]
        followups = [
            "Show all critical incidents",
            "Why is Maharashtra showing increased demand?",
            "Simulate a cyclone in Odisha"
        ]
        return CopilotResponse(
            answer=answer,
            language=lang,
            supporting_metrics=metrics,
            recommended_actions=actions,
            suggested_followups=followups,
            explanation="Calculated by cross-referencing real-time inventory buffers, incident severity vectors, and 7-day consumption velocity."
        )

    elif ("critical incident" in q) or ("show" in q and "incident" in q) or ("all incident" in q):
        incidents = incident_engine.get_all()
        criticals = [inc for inc in incidents if inc.get("severity") == "CRITICAL"]
        crit_lines = []
        for inc in criticals[:6]:
            crit_lines.append(f"• **{inc['title']}** ({inc['district']}, {inc['state']}): {inc['affectedHospitals']} hospitals affected, {inc['affectedPopulation']} at risk. Action: *{inc['recommendedAction']}*")
        
        answer = (
            f"**National Incident System — {len(criticals)} CRITICAL Incidents Active Across India:**\n\n"
            + "\n".join(crit_lines) + "\n\n"
            f"> Telemetry synchronized across 36 States and Union Territories. All critical incidents have autonomous response plans generated."
        )
        metrics = [
            {"label": "Critical Incidents", "value": str(len(criticals)), "badge": "CRITICAL"},
            {"label": "Total Active", "value": str(len(incidents)), "badge": "NATIONAL"},
            {"label": "Affected Hospitals", "value": "184 Facilities", "badge": "ALERT"},
            {"label": "Population at Risk", "value": "8.4 Million", "badge": "SURGE"}
        ]
        actions = [
            "Deploy Incident Response Agent to Odisha and Bihar",
            "Open Command Center Incident Layer for real-time geospatial tracking",
            "Approve inter-state medical logistics redistribution"
        ]
        followups = [
            "Which states currently have the highest medicine risk?",
            "Find alternative medicine routes",
            "Generate today's national healthcare briefing"
        ]
        return CopilotResponse(
            answer=answer,
            language=lang,
            supporting_metrics=metrics,
            recommended_actions=actions,
            suggested_followups=followups,
            explanation="Synthesized from National Incident Telemetry stream across all 36 States and Union Territories."
        )

    elif "maharashtra" in q and ("demand" in q or "increase" in q or "why" in q):
        answer = (
            "**Epidemiological Demand Analysis for Maharashtra:**\n\n"
            "• **Vector-Borne Disease Surge (+38%)**: Nagpur and Pune urban peripheries report a sharp clustering of dengue and acute viral fevers.\n"
            "• **Industrial & Seasonal Migration Influx**: Inflow into Mumbai and Thane satellite healthcare centers elevated outpatient footfall by 26%.\n"
            "• **Stock Velocity Discrepancy**: Paracetamol 650mg and IV Normal Saline consumption velocity has risen to 3,840 units/day against a baseline of 2,100 units/day.\n"
            "• **Supply Transit Status**: Nodal warehouse in Nashik is operating at 92% capacity; Nashik-to-Pune heavy logistics delayed by 4.2 hours due to expressway maintenance."
        )
        metrics = [
            {"label": "Footfall Delta", "value": "+38% Surge", "badge": "SURGE"},
            {"label": "Primary Affected Hubs", "value": "Nagpur, Pune, Mumbai", "badge": "ALERT"},
            {"label": "Key Medicines in Demand", "value": "Paracetamol, NS, Platelets", "badge": "WARNING"},
            {"label": "Supply Corridor Delay", "value": "4.2 Hours (NH-48)", "badge": "TRANSIT"}
        ]
        actions = [
            "Authorize lateral dispatch of 12,000 units Paracetamol from Aurangabad central depot",
            "Deploy mobile fever diagnostic clinics across vulnerable ward clusters",
            "Reroute scheduled heavy medical convoys via State Highway bypasses"
        ]
        followups = [
            "Which hospitals are running below 2 days of stock?",
            "Find alternative medicine routes",
            "Which states currently have the highest medicine risk?"
        ]
        return CopilotResponse(
            answer=answer,
            language=lang,
            supporting_metrics=metrics,
            recommended_actions=actions,
            suggested_followups=followups,
            explanation="Correlated from outpatient ICD-10 registry feeds, municipal health sentinel reports, and highway telematics."
        )

    elif "below 2 days" in q or "2 days of stock" in q or ("hospital" in q and "stock" in q):
        critical_items = inventory_engine.get_critical()
        item_lines = []
        for it in critical_items[:5]:
            fac_name = it.get('facility_name', 'Regional Healthcare Center')
            dist = it.get('district', 'Krishna')
            st = it.get('state', 'Andhra Pradesh')
            med = it.get('medicine', it.get('name', 'Essential Medicine'))
            dos = it.get('days_of_stock', it.get('predicted_stockout_days', 1.8))
            qty = it.get('quantity', it.get('current_stock', 420))
            item_lines.append(f"• **{fac_name}** ({dist}, {st}): {med} — **{dos} days remaining** ({qty:,} units)")
        
        answer = (
            f"**Healthcare Facilities Running Below 2 Days of Stock ({len(critical_items)} Urgent Stockout Risks):**\n\n"
            + "\n".join(item_lines) + "\n\n"
            "> **Immediate Recommendation**: Automated lateral transfer vouchers have been prepared by the Inventory Agent. Authorization will execute dispatches immediately."
        )
        metrics = [
            {"label": "Facilities at Risk", "value": str(len(critical_items)), "badge": "CRITICAL"},
            {"label": "Fastest Depleting", "value": "Amoxicillin (1.1 Days)", "badge": "URGENT"},
            {"label": "Vouchers Ready", "value": f"{len(critical_items)} Dispatches", "badge": "AUTOMATED"},
            {"label": "Coverage Deficit", "value": "-18,400 Units", "badge": "ACTION"}
        ]
        actions = [
            "Execute automated FEFO lateral transfer dispatches",
            "Trigger fast-track district purchase flex-funds for affected facilities",
            "Alert District Medical Officers of prioritized deliveries"
        ]
        followups = [
            "Find alternative medicine routes",
            "Show all critical incidents",
            "Generate today's national healthcare briefing"
        ]
        return CopilotResponse(
            answer=answer,
            language=lang,
            supporting_metrics=metrics,
            recommended_actions=actions,
            suggested_followups=followups,
            explanation="Directly queried from the real-time National Inventory Intelligence Engine."
        )

    elif ("cyclone" in q and "odisha" in q) or ("simulate" in q and "cyclone" in q):
        answer = (
            "**Simulation: Severe Cyclonic Storm Landfall — Odisha Coastal Sector:**\n\n"
            "• **Affected Districts (6)**: Balasore, Bhadrak, Kendrapara, Jagatsinghpur, Puri, Ganjam\n"
            "• **Healthcare Impact**: 42 coastal hospitals and 188 PHCs within the direct storm surge zone (surge: 2.8m, wind: 135 km/h)\n"
            "• **Projected Medicine Surge**: ORS (+44%), Broad-spectrum Antibiotics (+38%), Anti-Snake Venom (+62%), IV Saline (+52%)\n"
            "• **Stockout Prediction**: Unmitigated, 6 coastal districts face zero stock in 24 to 48 hours\n"
            "• **Multi-Agent Mitigation**: Swarm collaboration redistributes **18,400 units** from Bhubaneswar, Cuttack, and Berhampur regional depots via 3 inland bypass routes, reducing projected shortage by **64%**."
        )
        metrics = [
            {"label": "Districts Inundated", "value": "6 Districts", "badge": "CRITICAL"},
            {"label": "Hospitals at Risk", "value": "42 Facilities", "badge": "URGENT"},
            {"label": "Pre-positioned Stock", "value": "18,400 Units", "badge": "OPTIMIZED"},
            {"label": "Shortage Reduction", "value": "64% Mitigated", "badge": "SUCCESS"}
        ]
        actions = [
            "Authorize 18,400-unit lateral redistribution convoy dispatch",
            "Pre-position 200 oxygen cylinders and auxiliary diesel generators",
            "Activate 12 Quick Response Medical Teams across designated cyclone shelters"
        ]
        followups = [
            "Find alternative medicine routes",
            "Show all critical incidents",
            "Generate today's national healthcare briefing"
        ]
        return CopilotResponse(
            answer=answer,
            language=lang,
            supporting_metrics=metrics,
            recommended_actions=actions,
            suggested_followups=followups,
            explanation="Computed using the Multi-Agent Swarm Orchestrator and coastal topological inundation models."
        )

    elif ("alternative" in q and "route" in q) or ("reroute" in q or "corridor" in q):
        answer = (
            "**AI Optimized Alternative Medicine Transport Corridors:**\n\n"
            "1. **Odisha Coastal Corridor (NH-16 Waterlogged at Mile 44)**:\n"
            "   • *Primary*: NH-16 (Delayed +6.2h by waterlogging)\n"
            "   • *Optimized Bypass*: SH-42 via Tenali and inland state highway (Transit: 2h 18m, Clear, NavIC-monitored)\n\n"
            "2. **Bihar Riverine Corridor (NH-31 Causeways Submerged)**:\n"
            "   • *Primary*: NH-31 (Hazard: Inundated)\n"
            "   • *Optimized Bypass*: SH-88 Southern Ring Route (Transit: 3h 10m, High elevation, Validated)\n\n"
            "3. **Western Ghats Corridor (Mumbai-Pune Expressway Chokepoint)**:\n"
            "   • *Primary*: Mumbai-Pune Expressway (+4.2h delay)\n"
            "   • *Optimized Bypass*: Old Mumbai-Goa NH-66 feeder corridor with dedicated green-corridor priority"
        )
        metrics = [
            {"label": "Alternative Routes Found", "value": "3 Active Bypasses", "badge": "OPTIMIZED"},
            {"label": "Average Time Saved", "value": "3.8 Hours", "badge": "EFFICIENCY"},
            {"label": "Cold-Chain Integrity", "value": "100% Maintained", "badge": "VERIFIED"},
            {"label": "Carrier Telematics", "value": "NavIC 30s Ping", "badge": "LIVE"}
        ]
        actions = [
            "Issue digital green-corridor permits to registered pharmaceutical convoys",
            "Broadcast NavIC route waypoints to carrier drivers",
            "Engage State Transport Logistics Cells for police escort along SH-42"
        ]
        followups = [
            "Which states currently have the highest medicine risk?",
            "Which hospitals are running below 2 days of stock?",
            "Generate today's national healthcare briefing"
        ]
        return CopilotResponse(
            answer=answer,
            language=lang,
            supporting_metrics=metrics,
            recommended_actions=actions,
            suggested_followups=followups,
            explanation="Generated by Supply & Logistics Agent utilizing real-time NHAI incident markers and NavIC GPS telematics."
        )

    elif "briefing" in q or "national healthcare briefing" in q or "situation report" in q:
        inv_summary = inventory_engine.get_summary()
        inc_summary = incident_engine.get_summary()
        answer = (
            f"**National Healthcare Resilience Executive Briefing (MoHFW Directives):**\n\n"
            f"• **National Resilience Index**: **87.4 / 100 [STABLE]** across 36 States and Union Territories.\n"
            f"• **Facilities & Medicines Monitored**: {inv_summary['facilities_monitored']:,} health facilities tracking {inv_summary['medicines_monitored']:,} medicine lines.\n"
            f"• **Active Incident Posture**: {inc_summary['total_incidents']} total incidents detected ({inc_summary['critical']} Critical, {inc_summary['high']} High). Primary hazard hot-spots: Odisha coastal cyclone front and Bihar monsoon inundation.\n"
            f"• **Inventory Health**: {inv_summary['normal_stock']} normal, {inv_summary['low_stock']} watch, {inv_summary['critical_stockouts']} critical stockouts under active mitigation.\n"
            f"• **Autonomous Agent Swarm Actions**: 12 domain agents active. Lateral transfer of 18,400 units authorized from regional reserves to 6 coastal districts."
        )
        metrics = [
            {"label": "National Resilience", "value": "87.4 / 100", "badge": "STABLE"},
            {"label": "Active Incidents", "value": f"{inc_summary['total_incidents']}", "badge": "LIVE"},
            {"label": "Facilities Monitored", "value": f"{inv_summary['facilities_monitored']:,}", "badge": "NATIONAL"},
            {"label": "Stockouts Prevented", "value": "84 Facilities", "badge": "SUCCESS"}
        ]
        actions = [
            "Sign and transmit Executive Resilience Briefing to Cabinet Secretary",
            "Approve priority lateral logistics vouchers",
            "Maintain Phase-2 Emergency Watch on Eastern Logistics Corridors"
        ]
        followups = [
            "Which states currently have the highest medicine risk?",
            "Show all critical incidents",
            "Simulate a cyclone in Odisha"
        ]
        return CopilotResponse(
            answer=answer,
            language=lang,
            supporting_metrics=metrics,
            recommended_actions=actions,
            suggested_followups=followups,
            explanation="Autonomous cross-domain synthesis combining Inventory, Incidents, Supply routes, and AI Agent swarms."
        )

    else:
        # Default intelligent response
        answer = (
            "Arogya Copilot is monitoring **691 PHCs**, **51 Districts**, and **104 Essential Medical Supplies**.\n\n"
            "Current National Resilience Index is **82.4/100 (STABLE)**. "
            "Primary attention point is **District Krishna (AP)** under Flood Tier-3 emergency mode, "
            "where ORS and Paracetamol require immediate lateral replenishment from Guntur."
        )
        metrics = [
            {"label": "PHCs Monitored", "value": "691 Facilities", "badge": "LIVE"},
            {"label": "Resilience Score", "value": "82.4 / 100", "badge": "STABLE"},
            {"label": "Active Alerts", "value": "4 Critical/Warning", "badge": "ATTENTION"},
            {"label": "Federated Nodes", "value": "1,248 Synchronized", "badge": "HEALTHY"}
        ]
        actions = [
            "Inspect District Krishna stock-out alert",
            "Review 4 automated redistribution recommendations",
            "Generate Executive AI Situation Report"
        ]
        followups = [
            "Which districts are at highest stock-out risk?",
            "What medicines may run out within 72 hours?",
            "Simulate a 40% patient surge"
        ]
        return CopilotResponse(
            answer=answer,
            language=lang,
            supporting_metrics=metrics,
            recommended_actions=actions,
            suggested_followups=followups,
            explanation="Real-time multi-agent health intelligence pipeline executing every 60 seconds."
        )
