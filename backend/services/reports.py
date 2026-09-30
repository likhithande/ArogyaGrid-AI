from datetime import datetime
from typing import Dict, Any
from data.synthetic_generator import data_store

def generate_situation_report() -> Dict[str, Any]:
    now = datetime.now()
    total_phcs = len(data_store.phcs)
    active_phcs = sum(1 for p in data_store.phcs if p.status != "CRITICAL")
    total_beds = sum(p.beds_total for p in data_store.phcs)
    beds_occ = sum(p.beds_occupied for p in data_store.phcs)
    occupancy_pct = round((beds_occ / max(1, total_beds)) * 100, 1)

    crit_meds = [m for m in data_store.medicines if m.risk_level == "CRITICAL"]
    high_meds = [m for m in data_store.medicines if m.risk_level == "HIGH"]

    crit_phcs = [p for p in data_store.phcs if p.status == "CRITICAL"]

    markdown_report = f"""# NATIONAL HEALTH RESILIENCE SITUATION REPORT (SITREP)
**AROGYAGRID AI FEDERATED INTELLIGENCE PLATFORM**
*Classification: OFFICIAL - SENSITIVE (HACKATHON DEMO / SYNTHETIC DATA)*
*Generated on: {now.strftime('%d %B %Y, %H:%M:%S IST')}*

---

## 1. EXECUTIVE SUMMARY
ArogyaGrid AI is actively observing **{total_phcs} Primary Health Centres (PHCs)** across **{len(data_store.districts)} districts** and **{len(data_store.states)} states**.
The composite **National Health Resilience Index stands at 82.4/100 (STABLE)** with localized critical stress detected in **District Krishna (Andhra Pradesh)** due to upstream flood inundation.
Immediate lateral reallocations have been generated to buffer a 34% surge in gastrointestinal demand, preventing total ORS stock-out within 72 hours.

---

## 2. KEY METRICS & KPI SNAPSHOT
| Metric Name | Value | Status |
| :--- | :--- | :--- |
| Total PHCs Monitored | {total_phcs} Facilities | 100% Online |
| Active Operational PHCs | {active_phcs} / {total_phcs} ({round(active_phcs/total_phcs*100, 1)}%) | Normal Range |
| Total Inpatient Beds | {total_beds:,} Beds | Baseline Capacity |
| Current Bed Occupancy | {beds_occ:,} Beds ({occupancy_pct}%) | Moderate High |
| Critical Stock-Out Items | {len(crit_meds)} Medicines | Action Required |
| High Stock-Out Risk Items | {len(high_meds)} Medicines | Monitored |
| Active Emergency Tiers | 1 Active (Tier-3 Flood) | Active Response |
| Federated Training Nodes | 1,248 Edge PHC Nodes | Round #18 (94.6% Acc) |

---

## 3. CRITICAL STOCK-OUT RISKS & LEAD-TIME DEFICITS
The following essential medications have dropped below the mandated 5-day emergency threshold:
"""
    for m in crit_meds[:5]:
        markdown_report += f"\n- **{m.name}** ({m.category}): Current Stock: {m.current_stock:,} {m.unit} | Predicted Depletion: **{m.predicted_stockout_days} Days** | Lead Time: {m.supplier_lead_time_days} Days | *Action: Trigger lateral dispatch or emergency PO.*"

    markdown_report += f"""

---

## 4. DISTRICT RISK PRIORITIES & VULNERABILITIES
The top vulnerable administrative districts requiring immediate logistical intervention:
1. **District Krishna (Andhra Pradesh)**: Resilience 63.4/100 (CRITICAL) - 17 impacted PHCs, flood inundation along Krishna delta.
2. **District East Godavari (Andhra Pradesh)**: Resilience 69.1/100 (HIGH) - Transit delay along NH-16 culverts.
3. **District Puri (Odisha)**: Resilience 71.2/100 (HIGH) - Coastal moisture vulnerability and seasonal diarrheal spike.
4. **District Warangal (Telangana)**: Resilience 74.8/100 (MEDIUM) - Anti-snake venom depletion in rural tribal blocks.

---

## 5. RECOMMENDED INTERVENTIONS & LATERAL RESOURCE MOVEMENTS
ArogyaGrid AI's Optimization Engine recommends the following cross-district dispatches:
"""
    for r in data_store.redistributions:
        markdown_report += f"\n- **[{r.urgency}] {r.medicine_name}**: Move **{r.quantity:,} units** from **{r.source_district}** to **{r.dest_district}** (Transit: {r.estimated_transit_hours} hrs, {r.distance_km} km). *Impact: {r.expected_impact}*"

    markdown_report += """

---

## 6. FEDERATED AI PRIVACY & INTEGRITY STATEMENT
- **Differential Privacy Budget (ε)**: 1.20 | δ = 1e-5
- **Patient PII Shared**: **0.00 KB** (Only edge gradient tensors exchanged with Central Aggregator)
- **Local Model Accuracy**: 94.6% across 1,248 distributed PHC edge nodes.

---
*Report certified by ArogyaGrid AI Autonomous Intelligence Core. Decision-support prototype based on synthetic data.*
"""

    return {
        "title": "National Health Resilience Situation Report",
        "generated_at": now.strftime("%Y-%m-%d %H:%M:%S"),
        "national_resilience_index": 82.4,
        "total_phcs": total_phcs,
        "critical_phcs_count": len(crit_phcs),
        "critical_medicines_count": len(crit_meds),
        "active_emergencies": 1,
        "markdown": markdown_report,
        "csv_summary": (
            "Metric,Value,Status\n"
            f"Total PHCs,{total_phcs},Monitored\n"
            f"Bed Occupancy Pct,{occupancy_pct}%,Active\n"
            f"Critical Stockout Items,{len(crit_meds)},Urgent\n"
            "Resilience Score,82.4,Stable\n"
        )
    }
