import random
import time
from datetime import datetime
from typing import List, Dict, Any, Optional

INITIAL_INCIDENTS: List[Dict[str, Any]] = [
    {
        "id": "INC-OD-001",
        "title": "Severe Cyclone Alert (Bay of Bengal Depression)",
        "type": "Cyclone",
        "severity": "CRITICAL",
        "state": "Odisha",
        "district": "Puri & Jagatsinghpur",
        "latitude": 19.8135,
        "longitude": 85.8312,
        "timestamp": datetime.now().strftime("%H:%M IST"),
        "affectedHospitals": 42,
        "affectedPopulation": 2400000,
        "status": "ACTIVE",
        "medicineDemandSurge": "+38%",
        "transportDisruptionPct": 27,
        "aiAssessment": "HIGH CASCADE RISK: Coastal storm surge projected to inundate primary arterial corridors within 12 hours.",
        "description": "Deep depression in Bay of Bengal intensifying into severe cyclonic storm with wind gusts up to 120 km/h and localized 2.5m storm surges.",
        "recommendedAction": "Redistribute emergency medicines (ORS, IV fluids, suture kits, antivenom) from Bhubaneswar regional warehouse to coastal district hubs immediately."
    },
    {
        "id": "INC-AP-002",
        "title": "Coastal Inundation & Acute Gastroenteritis Surge",
        "type": "Disease Outbreak",
        "severity": "CRITICAL",
        "state": "Andhra Pradesh",
        "district": "Krishna (Machilipatnam)",
        "latitude": 16.1875,
        "longitude": 81.1389,
        "timestamp": datetime.now().strftime("%H:%M IST"),
        "affectedHospitals": 28,
        "affectedPopulation": 920000,
        "status": "ACTIVE",
        "medicineDemandSurge": "+64%",
        "transportDisruptionPct": 42,
        "aiAssessment": "ACUTE SHORTAGE IMMINENT: Amoxicillin and electrolyte buffer will deplete within 18 hours at current outpatient footfall.",
        "description": "High tide storm surge flooding drinking water sumps in Avanigadda and Machilipatnam mandals, triggering 34% surge in diarrheal cases.",
        "recommendedAction": "Execute transfer REDIST-001: Reroute 14,000 ORS sachets and 420 Amoxicillin blister packs from Guntur buffer via Tenali bypass."
    },
    {
        "id": "INC-MH-003",
        "title": "Critical Antibiotic & Suture Kit Depletion",
        "type": "Medicine Shortage",
        "severity": "HIGH",
        "state": "Maharashtra",
        "district": "Nagpur & Wardha",
        "latitude": 21.1458,
        "longitude": 79.0882,
        "timestamp": datetime.now().strftime("%H:%M IST"),
        "affectedHospitals": 18,
        "affectedPopulation": 640000,
        "status": "ACTIVE",
        "medicineDemandSurge": "+24%",
        "transportDisruptionPct": 10,
        "aiAssessment": "SUPPLY DEFICIT: Primary regional vendor consignment delayed by 5 days due to packaging batch recall.",
        "description": "Frontline CHCs and Sub-District Hospitals reporting less than 2.8 days of Ceftriaxone injection stock.",
        "recommendedAction": "Mobilize emergency release voucher from Pune Zonal Central Medical Depot."
    },
    {
        "id": "INC-DL-004",
        "title": "Extreme Heatwave & Respiratory Dehydration Wave",
        "type": "Heatwave",
        "severity": "HIGH",
        "state": "Delhi",
        "district": "North & East Delhi",
        "latitude": 28.6139,
        "longitude": 77.2090,
        "timestamp": datetime.now().strftime("%H:%M IST"),
        "affectedHospitals": 35,
        "affectedPopulation": 1850000,
        "status": "ACTIVE",
        "medicineDemandSurge": "+31%",
        "transportDisruptionPct": 5,
        "aiAssessment": "TERTIARY LOAD ELEVATED: Heat stroke ICU admissions up 45% across apex institutions.",
        "description": "Ambient temperatures touching 46.2°C triggering elevated emergency room visits for dehydration, heat cramps and syncope.",
        "recommendedAction": "Activate AIIMS Delhi and Safdarjung auxiliary heat relief wards; deploy mobile hydration vans."
    },
    {
        "id": "INC-AS-005",
        "title": "Brahmaputra Flood Surge & River Island Cutoff",
        "type": "Flood",
        "severity": "CRITICAL",
        "state": "Assam",
        "district": "Majuli & Dhemaji",
        "latitude": 26.9500,
        "longitude": 94.2000,
        "timestamp": datetime.now().strftime("%H:%M IST"),
        "affectedHospitals": 16,
        "affectedPopulation": 480000,
        "status": "ACTIVE",
        "medicineDemandSurge": "+52%",
        "transportDisruptionPct": 65,
        "aiAssessment": "ISOLATION HAZARD: River crossing ferries suspended; island dispensaries reachable only via river ambulance.",
        "description": "Severe monsoon catchment runoff causing Brahmaputra to breach warning marks at Nematighat.",
        "recommendedAction": "Airlift emergency water purification halazone tablets and snake venom antiserum from Guwahati."
    },
    {
        "id": "INC-KA-006",
        "title": "Cold-Chain Thermal Excursion (Insulin & Vaccines)",
        "type": "Cold Chain Failure",
        "severity": "MEDIUM",
        "state": "Karnataka",
        "district": "Bengaluru Urban",
        "latitude": 12.9716,
        "longitude": 77.5946,
        "timestamp": datetime.now().strftime("%H:%M IST"),
        "affectedHospitals": 6,
        "affectedPopulation": 120000,
        "status": "ACTIVE",
        "medicineDemandSurge": "+0%",
        "transportDisruptionPct": 0,
        "aiAssessment": "IOT SENSOR ALERT: Compressor phase failure detected in Sub-Depot Unit 4; ambient temp climbed to +7.4°C.",
        "description": "Electrical busbar fault in regional cold store refrigerator; 4,200 vaccine doses at risk of thermal degradation.",
        "recommendedAction": "Engage backup solar-battery inverter and dispatch on-call biomedical engineering technician."
    },
    {
        "id": "INC-TN-007",
        "title": "Post-Monsoon Dengue Vector Spike",
        "type": "Disease Outbreak",
        "severity": "HIGH",
        "state": "Tamil Nadu",
        "district": "Chennai & Tiruvallur",
        "latitude": 13.0827,
        "longitude": 80.2707,
        "timestamp": datetime.now().strftime("%H:%M IST"),
        "affectedHospitals": 24,
        "affectedPopulation": 1100000,
        "status": "ACTIVE",
        "medicineDemandSurge": "+44%",
        "transportDisruptionPct": 4,
        "aiAssessment": "BLOOD PRODUCT DEFICIT: Platelet apheresis demand running 2.1x standard weekly baseline.",
        "description": "Entomological vector index exceeding safety thresholds following unseasonal stagnant waterlogging in peri-urban slums.",
        "recommendedAction": "Activate inter-district platelet sharing protocol with Vellore and Salem medical colleges."
    },
    {
        "id": "INC-WB-008",
        "title": "Sunderbans Tidal Surge & Antivenom Depletion",
        "type": "Flood",
        "severity": "HIGH",
        "state": "West Bengal",
        "district": "South 24 Parganas",
        "latitude": 22.1500,
        "longitude": 88.6000,
        "timestamp": datetime.now().strftime("%H:%M IST"),
        "affectedHospitals": 12,
        "affectedPopulation": 380000,
        "status": "ACTIVE",
        "medicineDemandSurge": "+35%",
        "transportDisruptionPct": 50,
        "aiAssessment": "REPTILE DISPLACEMENT: Rising delta floodwaters forcing venomous snakes into human settlements.",
        "description": "Embankment breaches in Gosaba and Basanti causing acute snakebite incidents; local PHC antivenom stock down to 18 vials.",
        "recommendedAction": "Dispatch 250 vials Polyvalent Antisnake Venom via speed-boat medical patrol from Canning."
    },
    {
        "id": "INC-KL-009",
        "title": "Leptospirosis Surveillance & Flood Runoff",
        "type": "Disease Outbreak",
        "severity": "MEDIUM",
        "state": "Kerala",
        "district": "Alappuzha & Ernakulam",
        "latitude": 9.9816,
        "longitude": 76.2999,
        "timestamp": datetime.now().strftime("%H:%M IST"),
        "affectedHospitals": 15,
        "affectedPopulation": 540000,
        "status": "ACTIVE",
        "medicineDemandSurge": "+28%",
        "transportDisruptionPct": 12,
        "aiAssessment": "EARLY DETECTION: Doxycycline prophylaxis distribution initiated for field rescue workers.",
        "description": "Seasonal inundation of paddy fields leading to rodent contamination in agricultural zones.",
        "recommendedAction": "Issue public health advisory and release 50,000 Doxycycline 100mg capsules to grassroots ASHA workers."
    },
    {
        "id": "INC-GJ-010",
        "title": "Chemical Industrial Corridor Drill & Trauma Buffer",
        "type": "Mass Casualty",
        "severity": "MEDIUM",
        "state": "Gujarat",
        "district": "Surat & Bharuch",
        "latitude": 21.1702,
        "longitude": 72.8311,
        "timestamp": datetime.now().strftime("%H:%M IST"),
        "affectedHospitals": 14,
        "affectedPopulation": 450000,
        "status": "ACTIVE",
        "medicineDemandSurge": "+18%",
        "transportDisruptionPct": 8,
        "aiAssessment": "SIMULATION / PROTOCOL AUDIT: Testing toxic inhalation response protocols and burn trauma triage.",
        "description": "Hazardous chemical transport corridor simulation evaluating emergency decontamination readiness.",
        "recommendedAction": "Verify oxygen manifold backup purity and pre-position nebulizer solution inventory."
    },
    {
        "id": "INC-UP-011",
        "title": "Ganges Basin Acute Viral Syndrome Surge",
        "type": "Disease Outbreak",
        "severity": "HIGH",
        "state": "Uttar Pradesh",
        "district": "Varanasi & Gorakhpur",
        "latitude": 25.3176,
        "longitude": 82.9739,
        "timestamp": datetime.now().strftime("%H:%M IST"),
        "affectedHospitals": 32,
        "affectedPopulation": 2100000,
        "status": "ACTIVE",
        "medicineDemandSurge": "+36%",
        "transportDisruptionPct": 6,
        "aiAssessment": "PEDIATRIC ICU PRESSURE: Outpatient fever footfall elevated 42% across eastern district hospitals.",
        "description": "Post-monsoon seasonal fever clusters testing pediatric bed headroom in KGMU and AIIMS Gorakhpur.",
        "recommendedAction": "Redistribute pediatric paracetamol suspension and electrolyte fluids from Lucknow warehouse."
    },
    {
        "id": "INC-BR-012",
        "title": "Kosi River Embankment High Water Watch",
        "type": "Flood",
        "severity": "HIGH",
        "state": "Bihar",
        "district": "Supaul & Saharsa",
        "latitude": 26.1200,
        "longitude": 86.6000,
        "timestamp": datetime.now().strftime("%H:%M IST"),
        "affectedHospitals": 19,
        "affectedPopulation": 1400000,
        "status": "ACTIVE",
        "medicineDemandSurge": "+40%",
        "transportDisruptionPct": 38,
        "aiAssessment": "WATERBORNE RISK: Submerged hand pumps increasing coliform contamination probability.",
        "description": "Discharge from Nepal catchment raising Kosi river levels to danger mark across 4 blocks.",
        "recommendedAction": "Distribute chlorine tablets, bleaching powder and anti-diarrheal kits to flood shelter camps."
    },
    {
        "id": "INC-JK-013",
        "title": "National Highway NH-44 Landslide Logistics Block",
        "type": "Landslide",
        "severity": "HIGH",
        "state": "Jammu and Kashmir",
        "district": "Ramban & Anantnag",
        "latitude": 33.2500,
        "longitude": 75.2500,
        "timestamp": datetime.now().strftime("%H:%M IST"),
        "affectedHospitals": 8,
        "affectedPopulation": 260000,
        "status": "ACTIVE",
        "medicineDemandSurge": "+15%",
        "transportDisruptionPct": 75,
        "aiAssessment": "TRANSIT ARTERY SEVERANCE: Key pharmaceutical convoy bound for Srinagar delayed by 18 hours.",
        "description": "Shooting stones and debris blockage near Banihal tunnel preventing heavy vehicle transit.",
        "recommendedAction": "Activate Mughal Road alternative transit detour and air-courier emergency insulin to valley hubs."
    },
    {
        "id": "INC-RJ-014",
        "title": "Desert Heat Dehydration & Dialysis Fluid Deficit",
        "type": "Drought",
        "severity": "MEDIUM",
        "state": "Rajasthan",
        "district": "Barmer & Jaisalmer",
        "latitude": 25.7500,
        "longitude": 71.3900,
        "timestamp": datetime.now().strftime("%H:%M IST"),
        "affectedHospitals": 11,
        "affectedPopulation": 320000,
        "status": "ACTIVE",
        "medicineDemandSurge": "+22%",
        "transportDisruptionPct": 5,
        "aiAssessment": "WATER SCARCITY: Local RO purification plant running at 50% capacity due to ground table depletion.",
        "description": "Water scarcity affecting sterile hemodialysis operations in border sub-district hospitals.",
        "recommendedAction": "Dispatch tanker water supplies with dedicated UV treatment and replenish peritoneal dialysis kits."
    },
    {
        "id": "INC-TS-015",
        "title": "Genome Valley High-Volume Vaccine Redistribution",
        "type": "Medicine Shortage",
        "severity": "MEDIUM",
        "state": "Telangana",
        "district": "Hyderabad & Rangareddy",
        "latitude": 17.4193,
        "longitude": 78.4483,
        "timestamp": datetime.now().strftime("%H:%M IST"),
        "affectedHospitals": 18,
        "affectedPopulation": 1200000,
        "status": "ACTIVE",
        "medicineDemandSurge": "+12%",
        "transportDisruptionPct": 0,
        "aiAssessment": "STRATEGIC OUTFLOW: NIMS Hub mobilizing 45,000 units to support coastal Andhra cyclone response.",
        "description": "Routine scheduled buffer mobilization to support interstate public healthcare resilience.",
        "recommendedAction": "Authorize Green Freight Corridor for NH-65 fleet convoy departing at 11:00 IST."
    }
]

# Additional 32 synthetic incidents generated dynamically to provide full coverage across all 36 states & UTs
EXTRA_STATES = [
    ("Arunachal Pradesh", "Tawang", 27.58, 91.86, "Landslide", "MEDIUM", "Mountain pass rockfall delaying supply transit"),
    ("Manipur", "Churachandpur", 24.33, 93.68, "Road Disruption", "MEDIUM", "Hill road waterlogging triggering buffer alert"),
    ("Mizoram", "Aizawl", 23.72, 92.71, "Medicine Shortage", "MEDIUM", "Anti-rabies vaccine buffer depleted to 3 days"),
    ("Nagaland", "Kohima", 25.67, 94.10, "Hospital Overload", "LOW", "Pediatric ward bed occupancy touching 88%"),
    ("Tripura", "Agartala", 23.83, 91.28, "Power Failure", "MEDIUM", "Grid substation trip; hospital running on auxiliary diesel"),
    ("Meghalaya", "Cherrapunji (Sohra)", 25.27, 91.73, "Water Contamination", "HIGH", "Flash flooding turbidity impacting PHC filtration"),
    ("Sikkim", "Gangtok", 27.33, 88.61, "Cold Chain Failure", "LOW", "High-altitude temperature monitoring nominal"),
    ("Himachal Pradesh", "Kullu & Manali", 31.95, 77.10, "Flood", "HIGH", "Beas river overflow near sub-divisional hospital"),
    ("Uttarakhand", "Chamoli & Joshimath", 30.55, 79.56, "Landslide", "HIGH", "Pilgrim route health post medical stock check"),
    ("Punjab", "Amritsar", 31.63, 74.87, "Hospital Overload", "MEDIUM", "Post-harvest respiratory outpatient uptick"),
    ("Haryana", "Hisar", 29.15, 75.72, "Heatwave", "MEDIUM", "Elevated heat stress protocols active"),
    ("Goa", "South Goa (Margao)", 15.28, 73.98, "Medicine Shortage", "LOW", "Routine buffer replenishment requested"),
    ("Puducherry", "Puducherry", 11.94, 79.80, "Cyclone", "MEDIUM", "Coastal high swell warning issued"),
    ("Chandigarh", "Chandigarh", 30.73, 76.77, "Hospital Overload", "LOW", "PGIMER referral influx running at +14%"),
    ("Ladakh", "Kargil", 34.55, 76.13, "Cold Chain Failure", "MEDIUM", "Extreme sub-zero insulation heating test"),
    ("Andaman and Nicobar Islands", "Port Blair", 11.66, 92.74, "Supply Disruption", "MEDIUM", "Inter-island maritime medical vessel servicing"),
    ("Dadra and Nagar Haveli and Daman and Diu", "Silvassa", 20.27, 73.01, "Fire", "LOW", "Industrial park fire drill at district hospital"),
    ("Lakshadweep", "Kavaratti", 10.56, 72.63, "Medicine Shortage", "MEDIUM", "Helicopter medical airlift standby active"),
    ("Chhattisgarh", "Bastar (Jagdalpur)", 19.07, 82.01, "Disease Outbreak", "HIGH", "Malaria surveillance camp testing rapid kits"),
    ("Jharkhand", "Dhanbad", 23.79, 86.43, "Hospital Overload", "MEDIUM", "Mining trauma center bed allocation check"),
    ("Madhya Pradesh", "Indore", 22.71, 75.85, "Medicine Shortage", "LOW", "Inventory transfer completed successfully"),
    ("Gujarat", "Kutch (Bhuj)", 23.24, 69.66, "Drought", "LOW", "Desert saline zone water testing active"),
    ("Rajasthan", "Bikaner", 28.02, 73.31, "Heatwave", "MEDIUM", "Summer hydration protocol active"),
    ("Odisha", "Balasore", 21.49, 86.91, "Cyclone", "HIGH", "Coastal evacuation center stocking underway"),
    ("Andhra Pradesh", "Guntur", 16.30, 80.43, "Hospital Overload", "MEDIUM", "GGH Guntur receiving trauma transfers"),
    ("Telangana", "Warangal", 17.96, 79.59, "Medicine Shortage", "LOW", "Regional warehouse buffer verified"),
    ("Maharashtra", "Pune", 18.52, 73.85, "Hospital Overload", "MEDIUM", "Urban teaching hospital bed headroom at 18%"),
    ("Tamil Nadu", "Madurai", 9.92, 78.11, "Disease Outbreak", "LOW", "Viral fever screening camps operating"),
    ("Karnataka", "Mysuru", 12.29, 76.63, "Cold Chain Failure", "LOW", "Solar vaccine refrigerator operational"),
    ("Kerala", "Kozhikode", 11.25, 75.78, "Disease Outbreak", "LOW", "Nipah preventive surveillance negative"),
    ("West Bengal", "Darjeeling", 27.03, 88.26, "Landslide", "MEDIUM", "Hill road transport caution in effect"),
    ("Bihar", "Muzaffarpur", 26.12, 85.39, "Disease Outbreak", "HIGH", "Seasonal acute encephalitis syndrome surveillance")
]

counter = 16
for st, dist, lat, lng, cat, sev, desc in EXTRA_STATES:
    INITIAL_INCIDENTS.append({
        "id": f"INC-{counter:03d}",
        "title": f"{cat} Alert ({dist})",
        "type": cat,
        "severity": sev,
        "state": st,
        "district": dist,
        "latitude": lat,
        "longitude": lng,
        "timestamp": datetime.now().strftime("%H:%M IST"),
        "affectedHospitals": random.randint(3, 22),
        "affectedPopulation": random.randint(80000, 1200000),
        "status": "ACTIVE",
        "medicineDemandSurge": f"+{random.randint(10, 48)}%",
        "transportDisruptionPct": random.randint(2, 45),
        "aiAssessment": f"MONITORED: {desc}. Telemetry within manageable parameters.",
        "description": desc,
        "recommendedAction": f"Maintain routine safety buffer and monitor telemetry stream at {dist} operations room."
    })
    counter += 1

class IncidentEngine:
    def __init__(self):
        self.incidents: List[Dict[str, Any]] = list(INITIAL_INCIDENTS)
        self.demo_mode: bool = True
        self.last_generation_time = time.time()

    def get_all(
        self,
        state: Optional[str] = None,
        severity: Optional[str] = None,
        category: Optional[str] = None,
        status: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        results = self.incidents
        if state and state != "ALL":
            results = [inc for inc in results if inc["state"].lower() == state.lower()]
        if severity and severity != "ALL":
            results = [inc for inc in results if inc["severity"].lower() == severity.lower()]
        if category and category != "ALL":
            results = [inc for inc in results if inc["type"].lower() == category.lower()]
        if status:
            results = [inc for inc in results if inc["status"].lower() == status.lower()]
        return results

    def get_by_id(self, incident_id: str) -> Optional[Dict[str, Any]]:
        for inc in self.incidents:
            if inc["id"] == incident_id:
                return inc
        return None

    def get_summary(self) -> Dict[str, Any]:
        total = len(self.incidents)
        critical = sum(1 for i in self.incidents if i["severity"] == "CRITICAL")
        high = sum(1 for i in self.incidents if i["severity"] == "HIGH")
        medium = sum(1 for i in self.incidents if i["severity"] == "MEDIUM")
        low = sum(1 for i in self.incidents if i["severity"] == "LOW")

        return {
            "total_active": total,
            "total_incidents": total,
            "critical": critical,
            "high": high,
            "medium": medium,
            "low": low,
            "last_hour_delta": "+5",
            "coverage": "ALL 28 STATES & 8 UNION TERRITORIES",
            "telemetry_source": "SIMULATED NATIONAL INCIDENT DATA (DEMO MODE)",
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S IST")
        }

    def generate_synthetic_incident(self) -> Optional[Dict[str, Any]]:
        """
        Periodically creates a new synthetic demonstration incident (Every 20-60s in Demo Mode).
        """
        if not self.demo_mode:
            return None

        sample_scenarios = [
            ("Nagpur", "Maharashtra", 21.1458, 79.0882, "Medicine Shortage", "HIGH", "Antibiotic buffer rupture detected across 4 talukas"),
            ("Guwahati", "Assam", 26.1554, 91.7764, "Flood", "HIGH", "Flash flood inundation warning at river feeder health centers"),
            ("Varanasi", "Uttar Pradesh", 25.3176, 82.9739, "Disease Outbreak", "MEDIUM", "Syndromic diarrhea surveillance cluster identified"),
            ("Puri", "Odisha", 19.8135, 85.8312, "Cyclone", "CRITICAL", "Coastal storm surge outer bands reaching landfall sector"),
            ("Machilipatnam", "Andhra Pradesh", 16.1875, 81.1389, "Medicine Shortage", "CRITICAL", "Frontline ORS and trauma kits reaching zero-stock threshold")
        ]

        dist, st, lat, lng, cat, sev, desc = random.choice(sample_scenarios)
        new_id = f"INC-{int(time.time()) % 10000:04d}"

        new_incident = {
            "id": new_id,
            "title": f"DEMO: {cat} Alert ({dist})",
            "type": cat,
            "severity": sev,
            "state": st,
            "district": dist,
            "latitude": lat + random.uniform(-0.05, 0.05),
            "longitude": lng + random.uniform(-0.05, 0.05),
            "timestamp": datetime.now().strftime("%H:%M:%S IST"),
            "affectedHospitals": random.randint(6, 24),
            "affectedPopulation": random.randint(150000, 850000),
            "status": "ACTIVE",
            "medicineDemandSurge": f"+{random.randint(20, 55)}%",
            "transportDisruptionPct": random.randint(15, 45),
            "aiAssessment": f"NEW ARRIVAL: {desc}. Automated AI agents mobilizing.",
            "description": desc,
            "recommendedAction": f"Execute emergency pre-positioning and alert CMO {dist}.",
            "isNew": True
        }

        self.incidents.insert(0, new_incident)
        if len(self.incidents) > 80:
            self.incidents.pop()

        return new_incident

    def create_response_plan(self, incident_id: str) -> Dict[str, Any]:
        inc = self.get_by_id(incident_id)
        if not inc:
            inc = self.incidents[0]

        return {
            "incident_id": inc["id"],
            "title": inc["title"],
            "state": inc["state"],
            "severity": inc["severity"],
            "plan_id": f"PLAN-{inc['id']}-AUTO",
            "generated_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S IST"),
            "collaborating_agents": [
                {"agent": "Emergency Agent", "status": "COMPLETED", "contribution": f"Identified {inc['affectedHospitals']} affected healthcare facilities and mapped high-tide inundation envelope."},
                {"agent": "Demand Agent", "status": "COMPLETED", "contribution": f"Forecasted medicine demand surge at {inc.get('medicineDemandSurge', '+35%')} for next 72 hours."},
                {"agent": "Inventory Agent", "status": "COMPLETED", "contribution": "Identified 84,200 surplus electrolyte, ORS, and IV fluid units across 3 regional depots."},
                {"agent": "Supply Agent", "status": "COMPLETED", "contribution": "Computed 2 clear alternative logistics corridors bypassing flooded highway sections."},
                {"agent": "Optimization Agent", "status": "COMPLETED", "contribution": "Formulated MILP redistribution schedule minimizing delivery latency to under 3.5 hours."},
                {"agent": "Generative AI Agent", "status": "COMPLETED", "contribution": f"Executive summary synthesized: 'Mitigation plan reduces projected stock rupture risk by 68% for {inc['state']}.'"}
            ],
            "approved": False,
            "recommended_transfers": [
                {"source": "Central Strategic Depot", "destination": f"{inc['district']} District Hospital", "item": "ORS Sachets", "qty": 8400},
                {"source": "Regional Reserve WH", "destination": f"{inc['district']} Frontline PHCs", "item": "Amoxicillin 500mg", "qty": 2400}
            ]
        }

# Global Singleton Instance
incident_engine = IncidentEngine()
