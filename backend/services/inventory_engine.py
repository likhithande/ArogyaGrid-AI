import random
import time
from datetime import datetime
from typing import List, Dict, Any, Optional
from data.synthetic_generator import data_store
from models.schemas import Medicine

# Event Ring Buffer for Live Activity Feed
RECENT_INVENTORY_CHANGES: List[Dict[str, Any]] = [
    {
        "id": "EVT-1001",
        "timestamp": datetime.now().strftime("%H:%M:%S IST"),
        "facility_id": "PHC-0042",
        "facility_name": "Vijayawada PHC-04",
        "district": "Krishna",
        "state": "Andhra Pradesh",
        "medicine": "Amoxicillin 500mg",
        "type": "DISPENSE",
        "previous_quantity": 4280,
        "quantity": 4268,
        "change": -12,
        "reason": "Outpatient dispensing - gastroenteritis triage"
    },
    {
        "id": "EVT-1002",
        "timestamp": datetime.now().strftime("%H:%M:%S IST"),
        "facility_id": "PHC-0018",
        "facility_name": "Machilipatnam Coastal PHC",
        "district": "Krishna",
        "state": "Andhra Pradesh",
        "medicine": "Oral Rehydration Salts (ORS)",
        "type": "RECEIPT",
        "previous_quantity": 7620,
        "quantity": 8420,
        "change": 800,
        "reason": "Emergency cyclone prepositioning consignment received"
    },
    {
        "id": "EVT-1003",
        "timestamp": datetime.now().strftime("%H:%M:%S IST"),
        "facility_id": "DEPOT-003",
        "facility_name": "NTR District Cold Depot",
        "district": "NTR",
        "state": "Andhra Pradesh",
        "medicine": "Insulin Glargine 100IU/ml",
        "type": "TEMPERATURE_WARNING",
        "previous_quantity": 840,
        "quantity": 840,
        "change": 0,
        "reason": "Thermal telemetry excursion (+6.8°C) - auxiliary cooling engaged"
    },
    {
        "id": "EVT-1004",
        "timestamp": datetime.now().strftime("%H:%M:%S IST"),
        "facility_id": "DH-0002",
        "facility_name": "Guntur District Hospital",
        "district": "Guntur",
        "state": "Andhra Pradesh",
        "medicine": "Paracetamol 500mg Tablets",
        "type": "TRANSFER",
        "previous_quantity": 14200,
        "quantity": 16200,
        "change": 2000,
        "reason": "Lateral transfer completed from Hyderabad Strategic Reserve"
    }
]

FACILITIES = [
    {"id": "PHC-0042", "name": "Vijayawada PHC-04", "district": "Krishna", "state": "Andhra Pradesh"},
    {"id": "PHC-0018", "name": "Machilipatnam Coastal PHC", "district": "Krishna", "state": "Andhra Pradesh"},
    {"id": "DH-0002", "name": "Guntur District Hospital", "district": "Guntur", "state": "Andhra Pradesh"},
    {"id": "DH-0001", "name": "Old GGH Vijayawada", "district": "Krishna (NTR)", "state": "Andhra Pradesh"},
    {"id": "AIIMS-001", "name": "AIIMS New Delhi Apex Hub", "district": "New Delhi", "state": "Delhi"},
    {"id": "KEM-001", "name": "KEM Hospital Mumbai", "district": "Mumbai", "state": "Maharashtra"},
    {"id": "DH-0008", "name": "Puri District Hospital", "district": "Puri", "state": "Odisha"},
    {"id": "PHC-0112", "name": "Paradip Coastal CHC", "district": "Jagatsinghpur", "state": "Odisha"},
    {"id": "NIMS-001", "name": "NIMS Strategic Reserve", "district": "Hyderabad", "state": "Telangana"},
    {"id": "GMCH-001", "name": "Guwahati Medical College Hub", "district": "Kamrup", "state": "Assam"}
]

EVENT_COUNTER = 1005

class InventoryEngine:
    def __init__(self):
        self.monitored_facilities = 8420
        self.monitored_medicines = 12480
        self.updates_per_second = 4.2
        self.is_running = True

    def get_inventory_items(
        self,
        search: Optional[str] = None,
        category: Optional[str] = None,
        risk_level: Optional[str] = None,
        limit: int = 100,
        offset: int = 0
    ) -> List[Dict[str, Any]]:
        results = data_store.medicines
        if search:
            q = search.lower().strip()
            results = [m for m in results if q in m.name.lower() or q in m.code.lower() or q in m.category.lower()]
        if category and category != "All":
            results = [m for m in results if m.category.lower() == category.lower()]
        if risk_level and risk_level != "All":
            results = [m for m in results if m.risk_level.lower() == risk_level.lower()]
        
        # Serialize to dict with live telemetry attributes
        items = []
        for m in results[offset : offset + limit]:
            items.append({
                "id": m.id,
                "code": m.code,
                "name": m.name,
                "category": m.category,
                "dosage_form": m.dosage_form,
                "unit": m.unit,
                "unit_cost": m.unit_cost,
                "current_stock": m.current_stock,
                "daily_consumption_avg": m.daily_consumption_avg,
                "predicted_demand": m.predicted_demand,
                "safety_stock": m.safety_stock,
                "reorder_point": m.reorder_point,
                "supplier_lead_time_days": m.supplier_lead_time_days,
                "predicted_stockout_days": m.predicted_stockout_days,
                "risk_level": m.risk_level,
                "temperature_status": "NORMAL" if m.risk_level != "CRITICAL" else random.choice(["NORMAL", "WARNING", "CRITICAL"]),
                "last_updated": datetime.now().strftime("%H:%M:%S IST")
            })
        return items

    def get_inventory_item(self, item_id: str) -> Optional[Dict[str, Any]]:
        for m in data_store.medicines:
            if m.id == item_id or m.code == item_id:
                return {
                    "id": m.id,
                    "code": m.code,
                    "name": m.name,
                    "category": m.category,
                    "dosage_form": m.dosage_form,
                    "unit": m.unit,
                    "unit_cost": m.unit_cost,
                    "current_stock": m.current_stock,
                    "daily_consumption_avg": m.daily_consumption_avg,
                    "predicted_demand": m.predicted_demand,
                    "safety_stock": m.safety_stock,
                    "reorder_point": m.reorder_point,
                    "supplier_lead_time_days": m.supplier_lead_time_days,
                    "predicted_stockout_days": m.predicted_stockout_days,
                    "risk_level": m.risk_level,
                    "expiry_date": m.expiry_date,
                    "fefo_priority": "CRITICAL" if m.predicted_stockout_days < 3.0 else "NORMAL"
                }
        return None

    def get_inventory_summary(self) -> Dict[str, Any]:
        meds = data_store.medicines
        total = len(meds)
        critical = sum(1 for m in meds if m.risk_level == "CRITICAL")
        low = sum(1 for m in meds if m.risk_level == "HIGH")
        moderate = sum(1 for m in meds if m.risk_level == "MEDIUM")
        normal = sum(1 for m in meds if m.risk_level == "LOW")

        total_units = sum(m.current_stock for m in meds)
        avg_days = round(sum(m.predicted_stockout_days for m in meds) / max(1, total), 1)

        return {
            "status": "LIVE",
            "last_update": datetime.now().strftime("%Y-%m-%d %H:%M:%S IST"),
            "updates_per_second": self.updates_per_second,
            "facilities_monitored": self.monitored_facilities,
            "medicines_monitored": self.monitored_medicines,
            "total_catalogue_items": total,
            "critical_stockouts_count": critical,
            "critical_stockouts": critical,
            "low_stock_count": low,
            "low_stock": low,
            "moderate_stock_count": moderate,
            "normal_stock_count": normal,
            "normal_stock": normal,
            "total_units_inventory": total_units,
            "average_days_of_stock": avg_days,
            "fefo_compliance_pct": 98.4
        }

    get_summary = get_inventory_summary

    def get_critical_inventory(self) -> List[Dict[str, Any]]:
        critical_meds = [m for m in data_store.medicines if m.risk_level in ["CRITICAL", "HIGH"]]
        items = []
        for m in critical_meds[:15]:
            items.append({
                "id": m.id,
                "name": m.name,
                "current_stock": m.current_stock,
                "predicted_stockout_days": m.predicted_stockout_days,
                "risk_level": m.risk_level,
                "recommended_action": f"Emergency lateral transfer of {int(m.daily_consumption_avg * 4)} units required"
            })
        return items

    get_critical = get_critical_inventory

    def get_recent_changes(self, limit: int = 20) -> List[Dict[str, Any]]:
        return RECENT_INVENTORY_CHANGES[:limit]

    def simulate_event(self) -> Dict[str, Any]:
        """
        Executes a logical, realistic stock event that mutates backend in-memory state.
        Dispatches DISPENSE, RECEIPT, TRANSFER, EXPIRY, ADJUSTMENT.
        """
        global EVENT_COUNTER
        EVENT_COUNTER += 1

        med = random.choice(data_store.medicines)
        facility = random.choice(FACILITIES)
        event_type = random.choice(["DISPENSE", "DISPENSE", "RECEIPT", "TRANSFER", "DAMAGE", "ADJUSTMENT"])

        prev_qty = med.current_stock
        change = 0
        reason = ""

        if event_type == "DISPENSE":
            # Realistic reduction of 4 to 28 units based on outpatient footfall
            change = -random.randint(4, 28)
            new_qty = max(0, prev_qty + change)
            med.current_stock = new_qty
            reason = f"Clinical prescription dispensing ({abs(change)} {med.unit})"
        elif event_type == "RECEIPT":
            # Influx from regional depot
            change = random.choice([200, 400, 800, 1200])
            new_qty = prev_qty + change
            med.current_stock = new_qty
            reason = f"Restock shipment arrival (+{change} {med.unit} batch verified)"
        elif event_type == "TRANSFER":
            # Redistribution movement
            change = random.choice([-240, 240, -420, 420])
            new_qty = max(0, prev_qty + change)
            med.current_stock = new_qty
            reason = f"Lateral buffer transfer to cover local deficit ({'+' if change > 0 else ''}{change} {med.unit})"
        elif event_type == "DAMAGE":
            change = -random.randint(2, 6)
            new_qty = max(0, prev_qty + change)
            med.current_stock = new_qty
            reason = f"Cold-chain / vial breakage audit adjustment ({change} {med.unit})"
        else: # ADJUSTMENT
            change = random.choice([-5, 5, -10, 10])
            new_qty = max(0, prev_qty + change)
            med.current_stock = new_qty
            reason = f"Cycle count reconciliation ({'+' if change > 0 else ''}{change} {med.unit})"

        # Dynamically recalculate days of stock and risk level
        daily = max(1, med.daily_consumption_avg)
        new_days = round(med.current_stock / daily, 1)
        med.predicted_stockout_days = new_days
        if new_days < 2.5:
            med.risk_level = "CRITICAL"
        elif new_days < 5.0:
            med.risk_level = "HIGH"
        elif new_days < 10.0:
            med.risk_level = "MEDIUM"
        else:
            med.risk_level = "LOW"

        event = {
            "id": f"EVT-{EVENT_COUNTER}",
            "type": event_type,
            "timestamp": datetime.now().strftime("%H:%M:%S IST"),
            "facility_id": facility["id"],
            "facility_name": facility["name"],
            "district": facility["district"],
            "state": facility["state"],
            "medicine_id": med.id,
            "medicine": med.name,
            "previous_quantity": prev_qty,
            "quantity": med.current_stock,
            "change": change,
            "days_of_stock": new_days,
            "risk_level": med.risk_level,
            "reason": reason
        }

        # Insert at front of buffer
        RECENT_INVENTORY_CHANGES.insert(0, event)
        if len(RECENT_INVENTORY_CHANGES) > 60:
            RECENT_INVENTORY_CHANGES.pop()

        return event

# Global Singleton Instance
inventory_engine = InventoryEngine()
