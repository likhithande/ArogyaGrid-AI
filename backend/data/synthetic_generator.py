import random
import math
from datetime import datetime, timedelta
from typing import List, Dict, Any

from models.schemas import (
    PHC, District, StateSummary, Medicine, DemandForecast, DemandForecastPoint,
    StockoutPrediction, RedistributionRecommendation, EmergencyScenario,
    FederatedRound, AnomalyItem, SupplyChainNode, SupplyChainEdge, ResilienceScore,
    ResilienceMetric, AuditLog, SimulationResult,
    AutonomousAgent, AgentCollaborationMessage, ResilienceBrainSignal, CascadeNode,
    CascadeSimulationResult, EarlyWarningItem, SmartProcurementItem, SupplierProfile,
    AlternativeRoute, SwapMarketOffer, EmergencyPlaybook, RootCauseDiagnostic,
    RootCauseFactor, DecisionOption, MedicalEquipment, ColdChainSensor,
    EnergyResilienceMetric, ModelObservatoryMetric, DataQualityMetric
)

# Seed for reproducible realistic synthetic data
random.seed(42)

STATES_DATA = [
    {"name": "Andhra Pradesh", "code": "AP", "lat": 15.9129, "lng": 79.7400},
    {"name": "Telangana", "code": "TG", "lat": 17.1232, "lng": 79.2088},
    {"name": "Maharashtra", "code": "MH", "lat": 19.7515, "lng": 75.7139},
    {"name": "Karnataka", "code": "KA", "lat": 15.3173, "lng": 75.7139},
    {"name": "Tamil Nadu", "code": "TN", "lat": 11.1271, "lng": 78.6569},
    {"name": "Uttar Pradesh", "code": "UP", "lat": 26.8467, "lng": 80.9462},
    {"name": "Odisha", "code": "OD", "lat": 20.9517, "lng": 85.0985},
    {"name": "Kerala", "code": "KL", "lat": 10.8505, "lng": 76.2711}
]

DISTRICTS_RAW = [
    # Andhra Pradesh
    {"name": "Krishna", "state": "Andhra Pradesh", "lat": 16.1907, "lng": 81.1394, "pop": 4517398, "cmo": "Dr. K. Srinivas Rao"},
    {"name": "Guntur", "state": "Andhra Pradesh", "lat": 16.3067, "lng": 80.4365, "pop": 4887813, "cmo": "Dr. V. Lakshmi Devi"},
    {"name": "Visakhapatnam", "state": "Andhra Pradesh", "lat": 17.6868, "lng": 83.2185, "pop": 4290589, "cmo": "Dr. P. Ramachandra"},
    {"name": "East Godavari", "state": "Andhra Pradesh", "lat": 17.0005, "lng": 81.8040, "pop": 5154296, "cmo": "Dr. M. Venkat Reddy"},
    {"name": "Chittoor", "state": "Andhra Pradesh", "lat": 13.2172, "lng": 79.1003, "pop": 4174064, "cmo": "Dr. R. Sudhakar"},
    {"name": "Anantapur", "state": "Andhra Pradesh", "lat": 14.6819, "lng": 77.6006, "pop": 4081148, "cmo": "Dr. S. Mohan Babu"},
    {"name": "Kurnool", "state": "Andhra Pradesh", "lat": 15.8281, "lng": 78.0373, "pop": 4053463, "cmo": "Dr. A. Madhava Rao"},
    {"name": "Nellore", "state": "Andhra Pradesh", "lat": 14.4426, "lng": 79.9865, "pop": 2963557, "cmo": "Dr. G. Suresh"},

    # Telangana
    {"name": "Hyderabad", "state": "Telangana", "lat": 17.3850, "lng": 78.4867, "pop": 3943323, "cmo": "Dr. J. Venugopal"},
    {"name": "Rangareddy", "state": "Telangana", "lat": 17.2000, "lng": 78.4300, "pop": 5296741, "cmo": "Dr. T. Praveen Kumar"},
    {"name": "Medchal-Malkajgiri", "state": "Telangana", "lat": 17.6297, "lng": 78.4814, "pop": 2440073, "cmo": "Dr. B. Anuradha"},
    {"name": "Warangal", "state": "Telangana", "lat": 17.9689, "lng": 79.5941, "pop": 1800000, "cmo": "Dr. N. Rajender"},
    {"name": "Karimnagar", "state": "Telangana", "lat": 18.4386, "lng": 79.1288, "pop": 1005711, "cmo": "Dr. K. Ravinder"},
    {"name": "Nalgonda", "state": "Telangana", "lat": 17.0500, "lng": 79.2700, "pop": 1618416, "cmo": "Dr. Y. Shailaja"},
    {"name": "Khammam", "state": "Telangana", "lat": 17.2473, "lng": 80.1514, "pop": 1401639, "cmo": "Dr. D. Chandrasekhar"},

    # Maharashtra
    {"name": "Pune", "state": "Maharashtra", "lat": 18.5204, "lng": 73.8567, "pop": 9429408, "cmo": "Dr. Bhagwan Pawar"},
    {"name": "Thane", "state": "Maharashtra", "lat": 19.2183, "lng": 72.9781, "pop": 11060148, "cmo": "Dr. Kailas Pawar"},
    {"name": "Nagpur", "state": "Maharashtra", "lat": 21.1458, "lng": 79.0882, "pop": 4653570, "cmo": "Dr. Deepak Selokar"},
    {"name": "Nashik", "state": "Maharashtra", "lat": 19.9975, "lng": 73.7898, "pop": 6107187, "cmo": "Dr. Kapil Aher"},
    {"name": "Aurangabad (CSN)", "state": "Maharashtra", "lat": 19.8762, "lng": 75.3433, "pop": 3701282, "cmo": "Dr. Sudhakar Shelke"},
    {"name": "Solapur", "state": "Maharashtra", "lat": 17.6599, "lng": 75.9064, "pop": 4317756, "cmo": "Dr. Santosh Navale"},
    {"name": "Kolhapur", "state": "Maharashtra", "lat": 16.7050, "lng": 74.2433, "pop": 3876001, "cmo": "Dr. Rajesh Gaikwad"},

    # Karnataka
    {"name": "Bengaluru Urban", "state": "Karnataka", "lat": 12.9716, "lng": 77.5946, "pop": 9621551, "cmo": "Dr. K. Srinivas"},
    {"name": "Mysuru", "state": "Karnataka", "lat": 12.2958, "lng": 76.6394, "pop": 3001127, "cmo": "Dr. P. C. Kumaraswamy"},
    {"name": "Belagavi", "state": "Karnataka", "lat": 15.8497, "lng": 74.4977, "pop": 4779661, "cmo": "Dr. Mahesh Koni"},
    {"name": "Dharwad", "state": "Karnataka", "lat": 15.4589, "lng": 75.0078, "pop": 1847023, "cmo": "Dr. Shashi Patil"},
    {"name": "Ballari", "state": "Karnataka", "lat": 15.1394, "lng": 76.9214, "pop": 2452595, "cmo": "Dr. Janardhan Y"},
    {"name": "Dakshina Kannada", "state": "Karnataka", "lat": 12.8700, "lng": 74.8800, "pop": 2089649, "cmo": "Dr. Kishore Kumar"},

    # Tamil Nadu
    {"name": "Chennai", "state": "Tamil Nadu", "lat": 13.0827, "lng": 80.2707, "pop": 7088000, "cmo": "Dr. M. Jagadeesan"},
    {"name": "Coimbatore", "state": "Tamil Nadu", "lat": 11.0168, "lng": 76.9558, "pop": 3458045, "cmo": "Dr. P. Aruna"},
    {"name": "Madurai", "state": "Tamil Nadu", "lat": 9.9252, "lng": 78.1198, "pop": 3038252, "cmo": "Dr. K. V. Senthil"},
    {"name": "Salem", "state": "Tamil Nadu", "lat": 11.6643, "lng": 78.1460, "pop": 3482056, "cmo": "Dr. Soundammal"},
    {"name": "Tiruchirappalli", "state": "Tamil Nadu", "lat": 10.7905, "lng": 78.7047, "pop": 2722290, "cmo": "Dr. A. Subramani"},

    # Uttar Pradesh
    {"name": "Lucknow", "state": "Uttar Pradesh", "lat": 26.8467, "lng": 80.9462, "pop": 4589838, "cmo": "Dr. Manoj Agrawal"},
    {"name": "Varanasi", "state": "Uttar Pradesh", "lat": 25.3176, "lng": 82.9739, "pop": 3676841, "cmo": "Dr. Sandeep Chaudhary"},
    {"name": "Kanpur Nagar", "state": "Uttar Pradesh", "lat": 26.4499, "lng": 80.3319, "pop": 4581268, "cmo": "Dr. Alok Ranjan"},
    {"name": "Prayagraj", "state": "Uttar Pradesh", "lat": 25.4358, "lng": 81.8463, "pop": 5954391, "cmo": "Dr. Ashutosh Dubey"},
    {"name": "Agra", "state": "Uttar Pradesh", "lat": 27.1767, "lng": 78.0081, "pop": 4418797, "cmo": "Dr. Arun Srivastava"},
    {"name": "Gorakhpur", "state": "Uttar Pradesh", "lat": 26.7606, "lng": 83.3732, "pop": 4440895, "cmo": "Dr. Ashutosh Sahu"},

    # Odisha
    {"name": "Khordha (Bhubaneswar)", "state": "Odisha", "lat": 20.2961, "lng": 85.8245, "pop": 2251673, "cmo": "Dr. Artabandhu Nayak"},
    {"name": "Cuttack", "state": "Odisha", "lat": 20.4625, "lng": 85.8828, "pop": 2624470, "cmo": "Dr. Satyabrata Senapati"},
    {"name": "Ganjam", "state": "Odisha", "lat": 19.3149, "lng": 84.7941, "pop": 3529031, "cmo": "Dr. Uma Shankar Mishra"},
    {"name": "Puri", "state": "Odisha", "lat": 19.8135, "lng": 85.8312, "pop": 1698730, "cmo": "Dr. Sujata Mishra"},
    {"name": "Balasore", "state": "Odisha", "lat": 21.4934, "lng": 86.9135, "pop": 2320529, "cmo": "Dr. Dulalsen Jagatdeo"},

    # Kerala
    {"name": "Thiruvananthapuram", "state": "Kerala", "lat": 8.5241, "lng": 76.9366, "pop": 3301427, "cmo": "Dr. Bindu Mohan"},
    {"name": "Ernakulam (Kochi)", "state": "Kerala", "lat": 9.9816, "lng": 76.2999, "pop": 3282388, "cmo": "Dr. K. Sakeena"},
    {"name": "Kozhikode", "state": "Kerala", "lat": 11.2588, "lng": 75.7804, "pop": 3086293, "cmo": "Dr. Ummer Farooq"},
    {"name": "Thrissur", "state": "Kerala", "lat": 10.5276, "lng": 76.2144, "pop": 3121200, "cmo": "Dr. T. P. Sreedevi"},
    {"name": "Kollam", "state": "Kerala", "lat": 8.8932, "lng": 76.6141, "pop": 2635375, "cmo": "Dr. V. V. Ragesh"},
    {"name": "Malappuram", "state": "Kerala", "lat": 11.0510, "lng": 76.0711, "pop": 4112920, "cmo": "Dr. R. Renuka"},
    {"name": "Palakkad", "state": "Kerala", "lat": 10.7867, "lng": 76.6548, "pop": 2809934, "cmo": "Dr. K. P. Reetha"}
]

MEDICINES_DATA = [
    # Analgesic & Antipyretic
    {"name": "Paracetamol 500mg Tablets", "cat": "Analgesic", "form": "Tablet", "unit": "strips", "cost": 12.5, "stock": 14200, "daily": 450, "lead": 4},
    {"name": "Ibuprofen 400mg Tablets", "cat": "Analgesic", "form": "Tablet", "unit": "strips", "cost": 18.0, "stock": 9800, "daily": 260, "lead": 5},
    {"name": "Diclofenac Sodium 50mg", "cat": "Analgesic", "form": "Tablet", "unit": "strips", "cost": 15.0, "stock": 7400, "daily": 190, "lead": 4},
    {"name": "Tramadol Inj 50mg/ml", "cat": "Emergency", "form": "Ampoule", "unit": "vials", "cost": 32.0, "stock": 1850, "daily": 65, "lead": 6},

    # Rehydration & GI
    {"name": "Oral Rehydration Salts (ORS) WHO Formula", "cat": "IV Fluid", "form": "Sachet", "unit": "packets", "cost": 8.0, "stock": 1240, "daily": 280, "lead": 5},
    {"name": "Ringer Lactate (RL) 500ml IV", "cat": "IV Fluid", "form": "Bottle", "unit": "bottles", "cost": 45.0, "stock": 3100, "daily": 120, "lead": 5},
    {"name": "Normal Saline (0.9% NaCl) 500ml", "cat": "IV Fluid", "form": "Bottle", "unit": "bottles", "cost": 38.0, "stock": 4200, "daily": 150, "lead": 4},
    {"name": "Dextrose 5% 500ml IV", "cat": "IV Fluid", "form": "Bottle", "unit": "bottles", "cost": 40.0, "stock": 2900, "daily": 90, "lead": 5},
    {"name": "Pantoprazole 40mg Tablets", "cat": "GI", "form": "Tablet", "unit": "strips", "cost": 22.0, "stock": 8600, "daily": 310, "lead": 4},
    {"name": "Ondansetron 4mg Tablets", "cat": "GI", "form": "Tablet", "unit": "strips", "cost": 16.0, "stock": 4800, "daily": 140, "lead": 4},

    # Antibiotics & Anti-infectives
    {"name": "Amoxicillin + Clavulanic Acid 625mg", "cat": "Antibiotic", "form": "Tablet", "unit": "strips", "cost": 65.0, "stock": 3600, "daily": 210, "lead": 6},
    {"name": "Azithromycin 500mg Tablets", "cat": "Antibiotic", "form": "Tablet", "unit": "strips", "cost": 45.0, "stock": 5200, "daily": 180, "lead": 5},
    {"name": "Cefixime 200mg Tablets", "cat": "Antibiotic", "form": "Tablet", "unit": "strips", "cost": 55.0, "stock": 3100, "daily": 130, "lead": 6},
    {"name": "Ciprofloxacin 500mg Tablets", "cat": "Antibiotic", "form": "Tablet", "unit": "strips", "cost": 28.0, "stock": 6100, "daily": 175, "lead": 4},
    {"name": "Doxycycline 100mg Capsules", "cat": "Antibiotic", "form": "Capsule", "unit": "strips", "cost": 14.0, "stock": 7800, "daily": 160, "lead": 5},
    {"name": "Metronidazole 400mg Tablets", "cat": "Antibiotic", "form": "Tablet", "unit": "strips", "cost": 11.0, "stock": 8900, "daily": 240, "lead": 4},
    {"name": "Ceftriaxone Inj 1g", "cat": "Antibiotic", "form": "Vial", "unit": "vials", "cost": 48.0, "stock": 2100, "daily": 85, "lead": 7},

    # Emergency & Critical Care
    {"name": "Anti-Snake Venom (Polyvalent) Lyophilized", "cat": "Emergency", "form": "Vial", "unit": "vials", "cost": 650.0, "stock": 190, "daily": 18, "lead": 8},
    {"name": "Rabies Vaccine (Purified Vero Cell)", "cat": "Vaccine", "form": "Vial", "unit": "vials", "cost": 380.0, "stock": 420, "daily": 35, "lead": 7},
    {"name": "Adrenaline (Epinephrine) 1mg/ml Inj", "cat": "Emergency", "form": "Ampoule", "unit": "ampoules", "cost": 18.0, "stock": 850, "daily": 22, "lead": 5},
    {"name": "Atropine Sulphate 0.6mg/ml Inj", "cat": "Emergency", "form": "Ampoule", "unit": "ampoules", "cost": 12.0, "stock": 940, "daily": 15, "lead": 5},
    {"name": "Hydrocortisone Sodium Succinate 100mg Inj", "cat": "Emergency", "form": "Vial", "unit": "vials", "cost": 42.0, "stock": 1150, "daily": 45, "lead": 6},
    {"name": "Medical Oxygen (Type D Cylinder 46.7L)", "cat": "Emergency", "form": "Cylinder", "unit": "cylinders", "cost": 350.0, "stock": 380, "daily": 28, "lead": 3},

    # Maternal & Child Health
    {"name": "Oxytocin Inj 10 IU/ml", "cat": "Maternal", "form": "Ampoule", "unit": "ampoules", "cost": 24.0, "stock": 1650, "daily": 60, "lead": 5},
    {"name": "Iron and Folic Acid (IFA) Tablets", "cat": "Maternal", "form": "Tablet", "unit": "strips", "cost": 8.5, "stock": 38000, "daily": 1100, "lead": 6},
    {"name": "Calcium 500mg + Vitamin D3 Tablets", "cat": "Maternal", "form": "Tablet", "unit": "strips", "cost": 16.0, "stock": 24000, "daily": 750, "lead": 5},
    {"name": "Zinc Sulphate 20mg Tablets", "cat": "Pediatric", "form": "Tablet", "unit": "strips", "cost": 9.0, "stock": 14500, "daily": 320, "lead": 5},
    {"name": "Albendazole 400mg Chewable", "cat": "Pediatric", "form": "Tablet", "unit": "tablets", "cost": 6.0, "stock": 19000, "daily": 400, "lead": 5},

    # Chronic & Lifestyle
    {"name": "Metformin 500mg Tablets", "cat": "Chronic", "form": "Tablet", "unit": "strips", "cost": 14.0, "stock": 28000, "daily": 920, "lead": 5},
    {"name": "Amlodipine 5mg Tablets", "cat": "Chronic", "form": "Tablet", "unit": "strips", "cost": 12.0, "stock": 26000, "daily": 850, "lead": 5},
    {"name": "Enalapril 5mg Tablets", "cat": "Chronic", "form": "Tablet", "unit": "strips", "cost": 15.0, "stock": 12000, "daily": 380, "lead": 5},
    {"name": "Human Insulin 40 IU/ml 10ml (NPH)", "cat": "Chronic", "form": "Vial", "unit": "vials", "cost": 165.0, "stock": 2100, "daily": 75, "lead": 7},
    {"name": "Salbutamol 100mcg Inhaler", "cat": "Chronic", "form": "Inhaler", "unit": "canisters", "cost": 110.0, "stock": 1950, "daily": 65, "lead": 6},

    # Consumables & Diagnostics
    {"name": "Surgical Gloves (Size 7.0 Sterile)", "cat": "Consumables", "form": "Pair", "unit": "pairs", "cost": 18.0, "stock": 8500, "daily": 320, "lead": 4},
    {"name": "Disposable Syringes 5ml with Needle", "cat": "Consumables", "form": "Piece", "unit": "pieces", "cost": 4.5, "stock": 31000, "daily": 950, "lead": 4},
    {"name": "IV Infusion Sets Adult", "cat": "Consumables", "form": "Set", "unit": "sets", "cost": 22.0, "stock": 6800, "daily": 210, "lead": 4},
    {"name": "Rapid Malaria Antigen Detection Kits", "cat": "Diagnostics", "form": "Kit", "unit": "tests", "cost": 35.0, "stock": 4200, "daily": 110, "lead": 5},
    {"name": "Dengue NS1 Antigen Rapid Test Kits", "cat": "Diagnostics", "form": "Kit", "unit": "tests", "cost": 120.0, "stock": 1600, "daily": 85, "lead": 6},
    {"name": "Blood Glucose Test Strips", "cat": "Diagnostics", "form": "Strip", "unit": "strips", "cost": 15.0, "stock": 18500, "daily": 540, "lead": 4}
]

# Expand medicine list to reach 100+ unique entries dynamically with realistic pharmaceutical variations
PREFIXES = ["Amikacin 500mg Inj", "Gentamicin 80mg Inj", "Ampicillin 500mg", "Cotrimoxazole Double Strength",
            "Chlorpheniramine Maleate 4mg", "Cetirizine 10mg Tablets", "Levocetirizine 5mg", "Ranitidine 150mg",
            "Omeprazole 20mg Capsules", "Loperamide 2mg Tablets", "Bisacodyl 5mg Tablets", "Liquid Paraffin 100ml",
            "Povidone Iodine 5% Ointment 20g", "Silver Sulfadiazine 1% Cream", "Benzyl Benzoate 25% Lotion",
            "Miconazole 2% Cream", "Clotrimazole Pessaries 100mg", "Neomycin + Polymyxin Eye Drops",
            "Ciprofloxacin Eye Drops 0.3%", "Gentamicin 0.3% Eye Drops", "Atorvastatin 10mg Tablets",
            "Atenolol 50mg Tablets", "Telmisartan 40mg Tablets", "Furosemide 40mg Tablets", "Spironolactone 25mg",
            "Glibenclamide 5mg Tablets", "Glimepiride 1mg Tablets", "Levothyroxine 50mcg Tablets", "Carbamazepine 200mg",
            "Sodium Valproate 200mg", "Phenytoin 100mg Tablets", "Diazepam 5mg Tablets", "Haloperidol 5mg Tablets",
            "Amitriptyline 25mg Tablets", "Escitalopram 10mg Tablets", "Artesunate + Lumefantrine (ACT)",
            "Chloroquine Phosphate 250mg", "Primaquine 7.5mg Tablets", "Ivermectin 12mg Tablets", "Piperazine Citrate Syrup",
            "Mebendazole 100mg Tablets", "Vitamin A 100,000 IU Capsules", "Vitamin B-Complex Tablets", "Vitamin C 500mg Tablets",
            "Pyridoxine (Vit B6) 50mg", "Thiamine (Vit B1) 100mg", "Folic Acid 5mg Tablets", "Mifepristone 200mg",
            "Misoprostol 200mcg Tablets", "Methylergometrine 0.2mg Inj", "Magnesium Sulphate 50% Inj", "Nifedipine 10mg Capsules",
            "Methyldopa 250mg Tablets", "Betamethasone 4mg/ml Inj", "Pheniramine Maleate Inj", "Dexamethasone 4mg/ml Inj",
            "Ketamine 50mg/ml Inj", "Lignocaine 2% with Adrenaline", "Lignocaine 2% Plain Inj", "Bupivacaine 0.5% Heavy Inj",
            "Halazone Water Purification Tablets", "Zinc Sulfate Dispersible 20mg", "Amphotericin B Inj 50mg",
            "Meropenem Inj 1g", "Vancomycin Inj 500mg", "Levofloxacin 500mg Tablets", "Linezolid 600mg Tablets",
            "N-Acetylcysteine Inj 200mg/ml", "Pralidoxime (PAM) Inj 1g", "Calcium Gluconate 10% Inj"]

for idx, p in enumerate(PREFIXES):
    cat = "Essential"
    if "Inj" in p:
        cat = "Emergency"
    elif "Eye" in p or "Ointment" in p or "Cream" in p:
        cat = "Topical"
    elif "Tablets" in p or "Capsules" in p:
        cat = "General"
    MEDICINES_DATA.append({
        "name": p,
        "cat": cat,
        "form": "Injection" if "Inj" in p else ("Drops" if "Drops" in p else "Tablet"),
        "unit": "vials" if "Inj" in p else "strips",
        "cost": round(random.uniform(10, 180), 2),
        "stock": random.randint(1200, 18000),
        "daily": random.randint(40, 480),
        "lead": random.randint(3, 8)
    })

class SyntheticDataGenerator:
    def __init__(self):
        self.states: List[StateSummary] = []
        self.districts: List[District] = []
        self.phcs: List[PHC] = []
        self.medicines: List[Medicine] = []
        self.supply_nodes: List[SupplyChainNode] = []
        self.supply_edges: List[SupplyChainEdge] = []
        self.alerts: List[AnomalyItem] = []
        self.redistributions: List[RedistributionRecommendation] = []
        self.emergencies: List[EmergencyScenario] = []
        self.federated_rounds: List[FederatedRound] = []
        self.audit_logs: List[AuditLog] = []
        self.generate_all()

    def generate_all(self):
        self._generate_districts()
        self._generate_phcs()
        self._generate_medicines()
        self._generate_supply_chain()
        self._generate_anomalies_and_alerts()
        self._generate_redistributions()
        self._generate_emergencies()
        self._generate_federated_rounds()
        self._generate_audit_logs()
        self._generate_states_summary()

    def _generate_districts(self):
        for idx, d in enumerate(DISTRICTS_RAW):
            # District risk levels and resilience
            base_resilience = 78.0 + (random.random() * 18.0 - 9.0)
            if d["name"] in ["Krishna", "East Godavari", "Puri"]:
                # High risk / flood prone for scenario
                risk = "CRITICAL" if d["name"] == "Krishna" else "HIGH"
                resilience = round(base_resilience - 15, 1)
                critical_stockouts = random.randint(6, 14)
            elif d["name"] in ["Hyderabad", "Pune", "Bengaluru Urban", "Chennai"]:
                risk = "LOW"
                resilience = round(min(96.0, base_resilience + 10), 1)
                critical_stockouts = random.randint(0, 2)
            else:
                risk = random.choice(["LOW", "MEDIUM", "MEDIUM", "HIGH"])
                resilience = round(base_resilience, 1)
                critical_stockouts = random.randint(1, 5)

            total_phcs = random.randint(11, 16)
            active_phcs = total_phcs if risk != "CRITICAL" else total_phcs - random.randint(1, 2)
            total_beds = total_phcs * random.randint(18, 32)
            beds_occ = int(total_beds * random.uniform(0.68, 0.89))

            dist = District(
                id=f"DIST-{idx+1:03d}",
                name=d["name"],
                state=d["state"],
                lat=d["lat"],
                lng=d["lng"],
                total_phcs=total_phcs,
                active_phcs=active_phcs,
                population=d["pop"],
                total_beds=total_beds,
                beds_occupied=beds_occ,
                critical_stockouts_count=critical_stockouts,
                resilience_score=resilience,
                risk_level=risk,
                avg_daily_footfall=random.randint(1800, 6500),
                chief_medical_officer=d["cmo"]
            )
            self.districts.append(dist)

    def _generate_phcs(self):
        phc_counter = 1
        subdistrict_suffixes = ["Mandal", "Taluka", "Block", "Tehsil", "Circle"]

        for dist in self.districts:
            for i in range(dist.total_phcs):
                phc_id = f"PHC-{phc_counter:04d}"
                # jitter lat/lng slightly around district centroid
                lat = dist.lat + random.uniform(-0.16, 0.16)
                lng = dist.lng + random.uniform(-0.16, 0.16)

                phc_type = "PHC" if i > 2 else ("CHC" if i == 0 else "Sub-Centre")
                beds_total = 30 if phc_type == "CHC" else (12 if phc_type == "PHC" else 4)
                beds_occ = int(beds_total * random.uniform(0.50, 0.95))
                icu = 4 if phc_type == "CHC" else (1 if phc_type == "PHC" else 0)
                oxygen = 10 if phc_type == "CHC" else (4 if phc_type == "PHC" else 1)

                doc_sanc = 4 if phc_type == "CHC" else 2
                doc_pres = doc_sanc if random.random() > 0.18 else doc_sanc - 1
                nurse_sanc = 8 if phc_type == "CHC" else 4
                nurse_pres = max(1, nurse_sanc - (1 if random.random() > 0.25 else 0))

                # Highlight specific PHCs for rich story & demo
                if phc_id == "PHC-0042":
                    status = "CRITICAL"
                    stock_health = 41.5
                    resilience = 54.0
                    name = f"Machilipatnam Coastal PHC ({dist.name})"
                elif dist.risk_level == "CRITICAL" and i < 3:
                    status = "CRITICAL"
                    stock_health = round(random.uniform(45, 60), 1)
                    resilience = round(random.uniform(50, 65), 1)
                    name = f"{dist.name} Sector-{i+1} Community Clinic"
                elif dist.risk_level == "HIGH" and i < 2:
                    status = "WARNING"
                    stock_health = round(random.uniform(62, 74), 1)
                    resilience = round(random.uniform(68, 79), 1)
                    name = f"{dist.name} Rural PHC #{i+1}"
                else:
                    status = "NORMAL"
                    stock_health = round(random.uniform(82, 98), 1)
                    resilience = round(random.uniform(80, 95), 1)
                    name = f"{dist.name} Central PHC #{i+1}"

                item = PHC(
                    id=phc_id,
                    name=name,
                    code=f"AP-HWC-{phc_counter:04d}",
                    state=dist.state,
                    district=dist.name,
                    subdistrict=f"{dist.name}-{random.choice(subdistrict_suffixes)}-{(i%4)+1}",
                    lat=round(lat, 5),
                    lng=round(lng, 5),
                    type=phc_type,
                    beds_total=beds_total,
                    beds_occupied=beds_occ,
                    beds_icu=icu,
                    beds_oxygen=oxygen,
                    doctors_present=doc_pres,
                    doctors_sanctioned=doc_sanc,
                    nurses_present=nurse_pres,
                    nurses_sanctioned=nurse_sanc,
                    pharmacists_present=1 if random.random() > 0.08 else 0,
                    staff_total=doc_pres + nurse_pres + 4,
                    daily_footfall=random.randint(65, 340),
                    stock_health_score=stock_health,
                    resilience_index=resilience,
                    status=status,
                    contact_officer=f"Medical Officer Dr. {random.choice(['Reddy', 'Sharma', 'Patil', 'Iyer', 'Nair', 'Verma', 'Goud', 'Banerjee'])}",
                    phone=f"+91 98480 {random.randint(10000, 99999)}"
                )
                self.phcs.append(item)
                phc_counter += 1

    def _generate_medicines(self):
        now = datetime.now()
        for idx, m in enumerate(MEDICINES_DATA):
            med_id = f"MED-{idx+1:03d}"
            # Specific stock levels for story: ORS in Krishna, Paracetamol in PHC-042
            stock = m["stock"]
            daily = m["daily"]
            pred_demand = int(daily * random.uniform(1.05, 1.35))
            lead = m["lead"]
            safety = int(daily * 3)
            reorder = int((daily * lead) + safety)

            days_remaining = round(stock / max(1, pred_demand), 1)

            if m["name"].startswith("Oral Rehydration Salts"):
                # Critical stockout demo scenario
                stock = 1240
                daily = 280
                pred_demand = 340
                lead = 5
                days_remaining = 3.2
                risk = "CRITICAL"
                fefo = "URGENT_DISPATCH"
            elif days_remaining <= 3.5:
                risk = "CRITICAL"
                fefo = "URGENT_DISPATCH"
            elif days_remaining <= 7.0:
                risk = "HIGH"
                fefo = "MONITOR"
            elif days_remaining <= 14.0:
                risk = "MEDIUM"
                fefo = "NORMAL"
            else:
                risk = "LOW"
                fefo = "NORMAL"

            exp_date = (now + timedelta(days=random.randint(45, 720))).strftime("%Y-%m-%d")

            med = Medicine(
                id=med_id,
                code=f"NLEM-{idx+101}",
                name=m["name"],
                category=m["cat"],
                dosage_form=m["form"],
                unit=m["unit"],
                essential_nlem=True,
                unit_cost=m["cost"],
                current_stock=stock,
                min_threshold=int(daily * 4),
                reorder_point=reorder,
                safety_stock=safety,
                daily_consumption_avg=daily,
                predicted_demand=pred_demand,
                supplier_lead_time_days=lead,
                predicted_stockout_days=days_remaining,
                risk_level=risk,
                batch_number=f"IN-BT-{idx+1:03d}-{random.randint(10, 99)}",
                expiry_date=exp_date,
                fefo_priority=fefo
            )
            self.medicines.append(med)

    def _generate_supply_chain(self):
        # Create hubs for key states
        node_id_counter = 1
        depot_nodes = []
        for s in STATES_DATA:
            depot = SupplyChainNode(
                id=f"HUB-STATE-{node_id_counter:02d}",
                name=f"{s['name']} Central Medical Depot",
                type="STATE_DEPOT",
                lat=s["lat"],
                lng=s["lng"],
                district=s["name"],
                capacity=150000,
                utilization_pct=random.randint(68, 88),
                stock_health="HEALTHY",
                inventory_count=random.randint(95000, 140000)
            )
            self.supply_nodes.append(depot)
            depot_nodes.append(depot)
            node_id_counter += 1

        # Central National Warehouse in Hyderabad / Nagpur
        nat_hub = SupplyChainNode(
            id="HUB-NAT-01",
            name="National Strategic Health Logistics Centre (Hyderabad)",
            type="CENTRAL_HUB",
            lat=17.3850,
            lng=78.4867,
            district="Hyderabad",
            capacity=1000000,
            utilization_pct=72,
            stock_health="HEALTHY",
            inventory_count=720000
        )
        self.supply_nodes.append(nat_hub)

        # District stores and edges
        for d in self.districts[:20]:
            dist_store = SupplyChainNode(
                id=f"STORE-{d.id}",
                name=f"{d.name} District Drug Warehouse",
                type="DISTRICT_STORE",
                lat=d.lat + 0.02,
                lng=d.lng + 0.02,
                district=d.name,
                capacity=35000,
                utilization_pct=random.randint(55, 92),
                stock_health="VULNERABLE" if d.risk_level in ["CRITICAL", "HIGH"] else "HEALTHY",
                inventory_count=random.randint(18000, 32000)
            )
            self.supply_nodes.append(dist_store)

            # Edge from National Hub or State Depot to District store
            edge = SupplyChainEdge(
                id=f"ROUTE-CORR-{len(self.supply_edges)+1:03d}",
                source_id=nat_hub.id,
                target_id=dist_store.id,
                distance_km=round(random.uniform(45, 320), 1),
                transit_time_hours=round(random.uniform(2.5, 9.5), 1),
                risk_level="HIGH" if d.risk_level == "CRITICAL" else ("MEDIUM" if d.risk_level == "HIGH" else "LOW"),
                status="CONGESTED" if d.name in ["Krishna", "East Godavari"] else "ACTIVE",
                route_name=f"Corridor NH-{random.randint(44, 65)} -> {d.name}"
            )
            self.supply_edges.append(edge)

    def _generate_anomalies_and_alerts(self):
        now = datetime.now()
        # Highlighted prompt anomaly: PHC-042 Paracetamol 3.7x surge
        self.alerts.append(AnomalyItem(
            id="ANOM-001",
            type="SUDDEN_CONSUMPTION_SPIKE",
            phc_id="PHC-0042",
            phc_name="Machilipatnam Coastal PHC (Krishna)",
            district_name="Krishna",
            metric="Paracetamol 500mg Daily Consumption",
            normal_baseline=450.0,
            current_value=1665.0,
            deviation_multiplier=3.7,
            severity="CRITICAL",
            possible_causes=[
                "Localized viral fever / Dengue outbreak cluster reported in Ward 4 & 5",
                "Neighboring Sub-centre PHC-0043 stock-out causing patient diversion",
                "Unrecorded bulk dispatch or data reporting divergence"
            ],
            recommended_investigation="Audit physical inventory ledger at Machilipatnam PHC; trigger emergency replenishment of 2,500 strips within 12 hours.",
            detected_at=(now - timedelta(hours=2, minutes=15)).strftime("%Y-%m-%d %H:%M:%S")
        ))

        self.alerts.append(AnomalyItem(
            id="ANOM-002",
            type="STOCKOUT_IMMINENT",
            phc_id="PHC-0018",
            phc_name="Avanigadda Rural Hospital (Krishna)",
            district_name="Krishna",
            metric="Oral Rehydration Salts (ORS) Inventory",
            normal_baseline=1200.0,
            current_value=180.0,
            deviation_multiplier=0.15,
            severity="CRITICAL",
            possible_causes=[
                "Diarrheal spike following river inundation",
                "Delayed regional delivery from Vijayawada depot"
            ],
            recommended_investigation="Authorize immediate lateral transfer of 800 packets from Guntur Central Warehouse (Distance: 48 km).",
            detected_at=(now - timedelta(hours=3, minutes=45)).strftime("%Y-%m-%d %H:%M:%S")
        ))

        self.alerts.append(AnomalyItem(
            id="ANOM-003",
            type="PERSONNEL_ATTENDANCE_DEFICIT",
            phc_id="PHC-0089",
            phc_name="Bhadradri Tribal PHC (Telangana)",
            district_name="Khammam",
            metric="Medical Staff Shift Coverage",
            normal_baseline=8.0,
            current_value=3.0,
            deviation_multiplier=0.38,
            severity="WARNING",
            possible_causes=[
                "Monsoon transit road blockages in hill zone",
                "Flu sickness among duty nursing staff"
            ],
            recommended_investigation="Deploy mobile medical team unit #04 from district headquarters.",
            detected_at=(now - timedelta(hours=5, minutes=10)).strftime("%Y-%m-%d %H:%M:%S")
        ))

        self.alerts.append(AnomalyItem(
            id="ANOM-004",
            type="SUPPLY_TRANSIT_DELAY",
            phc_id="HUB-STATE-01",
            phc_name="East Godavari Highway Route",
            district_name="East Godavari",
            metric="Carrier Transit Delay Index",
            normal_baseline=4.0, # hours
            current_value=14.5,
            deviation_multiplier=3.6,
            severity="WARNING",
            possible_causes=[
                "Water logging along NH-16 culvert bridge near Rajahmundry",
                "Logistics dispatch vehicle mechanical breakdown"
            ],
            recommended_investigation="Reroute priority medical cargo via State Highway 42.",
            detected_at=(now - timedelta(hours=6, minutes=30)).strftime("%Y-%m-%d %H:%M:%S")
        ))

    def _generate_redistributions(self):
        now = datetime.now()
        # Prompt example: Move ORS/Paracetamol from District B (excess) to District A (shortage)
        self.redistributions.append(RedistributionRecommendation(
            id="REDIST-001",
            source_district="Guntur",
            source_phc="Guntur Medical College Central Depot",
            dest_district="Krishna",
            dest_phc="Machilipatnam Coastal PHC (PHC-0042)",
            medicine_name="Oral Rehydration Salts (ORS) WHO Formula",
            quantity=800,
            distance_km=54.2,
            estimated_transit_hours=1.8,
            urgency="URGENT",
            source_excess_days=18.4,
            dest_deficit_days=2.8,
            expected_impact="Prevents total stock-out in 42 hours; restores safety reserve to 12.5 days for 3,400 vulnerable outpatient beneficiaries.",
            ai_reasoning="District A (Krishna) has projected ORS exhaustion in 2.8 days driven by 34% acute gastroenteritis footfall. District B (Guntur) holds 18.4 days excess stock with low local variance.",
            status="PENDING",
            timestamp=(now - timedelta(minutes=45)).strftime("%Y-%m-%d %H:%M:%S")
        ))

        self.redistributions.append(RedistributionRecommendation(
            id="REDIST-002",
            source_district="Visakhapatnam",
            source_phc="King George Hospital Supply Store",
            dest_district="East Godavari",
            dest_phc="Kakinada Rural PHC",
            medicine_name="Paracetamol 500mg Tablets",
            quantity=2400,
            distance_km=148.0,
            estimated_transit_hours=3.5,
            urgency="HIGH",
            source_excess_days=24.0,
            dest_deficit_days=3.1,
            expected_impact="Eliminates antibiotic and antipyretic backlog across 3 sub-district primary health posts.",
            ai_reasoning="Visakhapatnam regional hub received a large manufacturing batch; surplus exceeds 90th percentile safety band.",
            status="APPROVED",
            timestamp=(now - timedelta(hours=3)).strftime("%Y-%m-%d %H:%M:%S")
        ))

        self.redistributions.append(RedistributionRecommendation(
            id="REDIST-003",
            source_district="Hyderabad",
            source_phc="Osmania General Depot",
            dest_district="Warangal",
            dest_phc="Hanamkonda Primary Clinic",
            medicine_name="Anti-Snake Venom (Polyvalent)",
            quantity=60,
            distance_km=142.5,
            estimated_transit_hours=2.9,
            urgency="URGENT",
            source_excess_days=31.0,
            dest_deficit_days=1.4,
            expected_impact="Protects high-risk agricultural harvesting zone experiencing 40% surge in venom bites.",
            ai_reasoning="Life-saving emergency serum stock in Warangal is at critical 1.4-day threshold. Hyderabad has buffer capacity.",
            status="IN_TRANSIT",
            timestamp=(now - timedelta(hours=5)).strftime("%Y-%m-%d %H:%M:%S")
        ))

        self.redistributions.append(RedistributionRecommendation(
            id="REDIST-004",
            source_district="Pune",
            source_phc="Sassoon Hospital Regional Store",
            dest_district="Solapur",
            dest_phc="Barshi Community Health Centre",
            medicine_name="Ringer Lactate (RL) 500ml IV",
            quantity=600,
            distance_km=210.0,
            estimated_transit_hours=4.2,
            urgency="MEDIUM",
            source_excess_days=16.0,
            dest_deficit_days=4.5,
            expected_impact="Replenishes trauma stabilization inventory before weekend high-traffic period.",
            ai_reasoning="Linear programming route optimization confirms minimal transit friction via Pune-Solapur expressway.",
            status="PENDING",
            timestamp=(now - timedelta(hours=7)).strftime("%Y-%m-%d %H:%M:%S")
        ))

    def _generate_emergencies(self):
        self.emergencies = [
            EmergencyScenario(
                id="EMERG-FLOOD-01",
                type="FLOOD",
                title="Monsoon River Inundation & Flash Flood Surge",
                description="Simulated Krishna & Godavari delta flash floods across Krishna, East Godavari, and Guntur districts impacting 1.8M citizens.",
                severity="TIER_3_CRITICAL",
                affected_districts=["Krishna", "East Godavari", "Guntur"],
                patient_surge_pct=42,
                medicine_requirement_surge_pct=28,
                bed_requirement_delta=620,
                critical_phcs_count=17,
                recommended_transfers_count=12,
                estimated_response_gap_pct=8,
                priority_actions=[
                    "Pre-position 10,000 sachets of ORS and 5,000 strips of Halazone water purification tablets at relief camps",
                    "Deploy 6 amphibious mobile health units to inundated coastal riverbanks",
                    "Trigger automated lateral inventory reallocation from inland Guntur warehouses",
                    "Establish temporary 50-bed triage shelters at Machilipatnam and Avanigadda"
                ],
                activated=True
            ),
            EmergencyScenario(
                id="EMERG-OUTBREAK-02",
                type="OUTBREAK",
                title="Vector-Borne Dengue & Chikungunya Spike",
                description="Rapid surge in acute febrile illnesses detected in high-density urban wards of Hyderabad and Rangareddy.",
                severity="TIER_2",
                affected_districts=["Hyderabad", "Rangareddy", "Medchal-Malkajgiri"],
                patient_surge_pct=34,
                medicine_requirement_surge_pct=22,
                bed_requirement_delta=340,
                critical_phcs_count=9,
                recommended_transfers_count=7,
                estimated_response_gap_pct=4,
                priority_actions=[
                    "Expedite distribution of 2,500 Dengue NS1 rapid diagnostic test kits to urban primary clinics",
                    "Mobilize 15 additional pediatric ward nurses to community health centres",
                    "Reroute intravenous fluid supplies from state central repository"
                ],
                activated=False
            ),
            EmergencyScenario(
                id="EMERG-CYCLONE-03",
                type="CYCLONE",
                title="Severe Coastal Storm & Windstorm Disruption",
                description="Simulated Category-3 cyclone landfall scenario along the northern Andhra and southern Odisha coastline.",
                severity="TIER_3_CRITICAL",
                affected_districts=["Visakhapatnam", "East Godavari", "Puri", "Ganjam"],
                patient_surge_pct=55,
                medicine_requirement_surge_pct=40,
                bed_requirement_delta=850,
                critical_phcs_count=26,
                recommended_transfers_count=18,
                estimated_response_gap_pct=12,
                priority_actions=[
                    "Verify emergency diesel generator fuel reserves at all 26 coastal PHCs",
                    "Stash 7-day contingency emergency trauma kits in reinforced storm shelters",
                    "Activate satellite-linked offline data synchronizers for uninterrupted telemetry"
                ],
                activated=False
            ),
            EmergencyScenario(
                id="EMERG-HEAT-04",
                type="HEATWAVE",
                title="Extreme Heatwave & Dehydration Emergency",
                description="Sustained temperatures exceeding 45°C triggering severe heat exhaustion and cardiovascular distress.",
                severity="TIER_1",
                affected_districts=["Nagpur", "Varanasi", "Kurnool", "Anantapur"],
                patient_surge_pct=26,
                medicine_requirement_surge_pct=19,
                bed_requirement_delta=210,
                critical_phcs_count=6,
                recommended_transfers_count=5,
                estimated_response_gap_pct=3,
                priority_actions=[
                    "Deploy cooling zones with cold saline infusion capacity across daytime outpatient units",
                    "Pre-position rehydration stations at major market hubs and agricultural centers"
                ],
                activated=False
            )
        ]

    def _generate_federated_rounds(self):
        now = datetime.now()
        history = [
            (1, 412, 1.48, 64.2, 0.4, 0.0),
            (3, 620, 1.12, 71.5, 0.6, 7.3),
            (6, 840, 0.84, 78.8, 0.8, 7.3),
            (9, 995, 0.58, 83.4, 0.9, 4.6),
            (12, 1140, 0.42, 87.9, 1.0, 4.5),
            (15, 1210, 0.31, 91.2, 1.1, 3.3),
            (17, 1240, 0.24, 93.4, 1.15, 2.2),
            (18, 1248, 0.19, 94.6, 1.20, 1.2)
        ]
        for r_num, nodes, loss, acc, eps, delta in history:
            time_offset = (18 - r_num) * 12
            self.federated_rounds.append(FederatedRound(
                round_number=r_num,
                timestamp=(now - timedelta(hours=time_offset)).strftime("%Y-%m-%d %H:%M:%S"),
                participating_nodes=nodes,
                model_version=f"Arogya-FedNet-v2.{r_num}",
                aggregation_loss=loss,
                accuracy_pct=acc,
                privacy_epsilon=eps,
                delta_improvement_pct=delta,
                data_transmitted_mb=round(nodes * 0.42, 1),
                raw_data_shared="0.00 KB (Zero Patient PII)"
            ))

    def _generate_audit_logs(self):
        now = datetime.now()
        actions = [
            ("Dr. Arvind Sharma", "National Health Administrator", "APPROVED_REDISTRIBUTION", "REDIST-002: 2400 units Paracetamol from Visakhapatnam -> East Godavari", "PENDING", "APPROVED"),
            ("P. Lakshmi", "Emergency Response Coordinator", "ACTIVATED_EMERGENCY_MODE", "EMERG-FLOOD-01: Krishna & Godavari Delta Flood Scenario", "INACTIVE", "ACTIVE_TIER_3"),
            ("K. Srinivas Rao", "District Health Officer (Krishna)", "ACKNOWLEDGED_ALERT", "ANOM-001: 3.7x Paracetamol Spike at Machilipatnam", "NEW", "ACKNOWLEDGED"),
            ("System AI Agent", "Federated Engine", "FEDERATED_AGGREGATION_ROUND", "Round #18: Aggregated gradients across 1,248 nodes", "Round #17", "Round #18"),
            ("Suresh Reddy", "Supply Chain Manager", "UPDATED_SAFETY_STOCK", "ORS threshold updated for Monsoon season (+25%)", "1,200", "1,500"),
            ("Dr. Meera Nair", "Data/AI Analyst", "RUN_RESILIENCE_SIMULATION", "Simulation: 40% patient surge + 20% supply disruption", "N/A", "Completed in 480ms")
        ]
        for idx, (user, role, act, res, prev, nxt) in enumerate(actions):
            self.audit_logs.append(AuditLog(
                id=f"AUDIT-{idx+1:04d}",
                timestamp=(now - timedelta(minutes=(idx+1)*35)).strftime("%Y-%m-%d %H:%M:%S"),
                user_name=user,
                role=role,
                action=act,
                resource=res,
                previous_state=prev,
                new_state=nxt,
                ip_address=f"10.0.{random.randint(1, 8)}.{random.randint(10, 99)}",
                status="SUCCESS"
            ))

    def _generate_states_summary(self):
        for s in STATES_DATA:
            districts_in_state = [d for d in self.districts if d.state == s["name"]]
            if not districts_in_state:
                continue
            total_districts = len(districts_in_state)
            total_phcs = sum(d.total_phcs for d in districts_in_state)
            active_phcs = sum(d.active_phcs for d in districts_in_state)
            total_beds = sum(d.total_beds for d in districts_in_state)
            beds_occ = sum(d.beds_occupied for d in districts_in_state)
            avg_resilience = round(sum(d.resilience_score for d in districts_in_state) / total_districts, 1)
            alerts = sum(d.critical_stockouts_count for d in districts_in_state)
            emergencies = 1 if s["name"] in ["Andhra Pradesh", "Telangana"] else 0

            self.states.append(StateSummary(
                id=f"STATE-{s['code']}",
                name=s["name"],
                code=s["code"],
                total_districts=total_districts,
                total_phcs=total_phcs,
                active_phcs=active_phcs,
                total_beds=total_beds,
                beds_occupied=beds_occ,
                overall_resilience=avg_resilience,
                critical_alerts_count=alerts,
                active_emergencies=emergencies
            ))

# Singleton instance
data_store = SyntheticDataGenerator()
