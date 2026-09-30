from datetime import datetime
from typing import List, Optional
from models.schemas import RedistributionRecommendation, AuditLog
from data.synthetic_generator import data_store

def get_redistributions() -> List[RedistributionRecommendation]:
    return data_store.redistributions

def approve_redistribution(rec_id: str, approver_name: str = "National Health Administrator") -> Optional[RedistributionRecommendation]:
    now = datetime.now()
    target_rec = None
    for r in data_store.redistributions:
        if r.id == rec_id:
            r.status = "APPROVED"
            target_rec = r
            break
    
    if target_rec:
        # Append to audit log
        data_store.audit_logs.insert(0, AuditLog(
            id=f"AUDIT-{len(data_store.audit_logs)+1:04d}",
            timestamp=now.strftime("%Y-%m-%d %H:%M:%S"),
            user_name=approver_name,
            role="Health Administrator",
            action="APPROVE_REDISTRIBUTION",
            resource=f"{target_rec.id}: {target_rec.quantity} units {target_rec.medicine_name} from {target_rec.source_district} to {target_rec.dest_district}",
            previous_state="PENDING",
            new_state="APPROVED",
            status="SUCCESS"
        ))
    return target_rec

def generate_optimized_plan() -> List[RedistributionRecommendation]:
    # Simulate generating new recommendations based on stock differences
    now = datetime.now()
    # Check if there are unassigned shortages
    new_id = f"REDIST-{len(data_store.redistributions)+1:03d}"
    new_rec = RedistributionRecommendation(
        id=new_id,
        source_district="Bengaluru Urban",
        source_phc="Victoria Hospital Logistics Hub",
        dest_district="Ballari",
        dest_phc="Sandur Taluk General Hospital",
        medicine_name="Amoxicillin + Clavulanic Acid 625mg",
        quantity=1500,
        distance_km=295.0,
        estimated_transit_hours=5.4,
        urgency="HIGH",
        source_excess_days=21.0,
        dest_deficit_days=3.4,
        expected_impact="Buffers respiratory infection surge in mining corridor; extends antibiotic reserve to 16 days.",
        ai_reasoning="Linear route solver identified Bengaluru Urban as lowest delivery latency source with 3.2x buffer above mandated threshold.",
        status="PENDING",
        timestamp=now.strftime("%Y-%m-%d %H:%M:%S")
    )
    # Don't add duplicate if already present
    if not any(r.id == new_id for r in data_store.redistributions):
        data_store.redistributions.append(new_rec)
    return data_store.redistributions
