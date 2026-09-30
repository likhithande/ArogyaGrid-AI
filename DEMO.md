# JUDGE DEMO GUIDE (3–5 MINUTE WALKTHROUGH)
### AROGYAGRID AI: National Health Resilience Intelligence Platform

This guide is structured for hackathon evaluators and judges to experience the full operational capability of ArogyaGrid AI in 3 to 5 minutes.

---

## Interactive Demo Flow: Step-by-Step

### STEP 1: Command Center Overview
1. Open the platform at `http://localhost:8000/` (or `http://localhost:5173/` if using Vite dev server).
2. Point out the top header:
   - **LIVE Beacon**: Pulsing green dot showing continuous simulated telemetry.
   - **KPI Cards**: 694 Monitored PHCs, 89.9% Medicine Availability, 3 Critical Shortages, 69.4% Bed Occupancy, 92.8% Medical Staffing, and composite **Resilience Index: 82.4/100**.
   - **Demand Trajectory**: 7-day projected surge chart comparing historical baseline with anticipated seasonal influx.

---

### STEP 2: Stock-Out Prediction Engine
1. In the left sidebar or KPI card, click **"Stock-Out Risks"**.
2. Examine the interactive table:
   - Focus on **Oral Rehydration Salts (ORS)** in **District Krishna (Machilipatnam Coastal PHC)**.
   - Current stock: **1,240 units** | Daily consumption: **280 units** | Surge draw: **340 units** | Supplier lead time: **5 days**.
   - **Predicted Stock-Out: 3.2 Days (CRITICAL)**.
   - Recommendation: *"Redistribute 800 units from Guntur Central Warehouse."*

---

### STEP 3: Geospatial Map Intelligence & District Drill-Down
1. In the left sidebar, click **"Map Intelligence"**.
2. Notice the interactive India map showing district pins color-coded by resilience status.
3. Click on the pulsing red pin for **District Krishna**:
   - Opens the detailed diagnostic drawer.
   - Observe 15 PHCs, 88.4% rural hospital occupancy, and localized flood inundation clusters.
   - Click on **Machilipatnam Coastal PHC (PHC-0042)** to view clinic-level bed numbers and stock health.

---

### STEP 4: Explainable AI (XAI) Panel
1. Click **"Demand Forecast"** in the sidebar.
2. Select **Paracetamol 500mg** and **District Krishna** with horizon set to **7 Days**.
3. Point out the **AI Explanation Panel**:
   - The model projects a **+31% demand surge**.
   - It decomposes this into transparent measurable factors:
     - 32% Historical 6-month baseline
     - 28% Monsoon acute fever outbreak trend
     - 21% Patient footfall expansion
     - 11% Neighboring PHC stock-out diversion
     - 8% Weather shock
   - Emphasize: *No black box—administrators understand exactly WHY the model alerted them.*

---

### STEP 5: Supply Chain Network Graph
1. Click **"Supply Chain Graph"** in the sidebar.
2. Observe the multi-echelon network topology:
   - National Central Hub (Hyderabad) $\rightarrow$ State Depot (Vijayawada) $\rightarrow$ District Stores $\rightarrow$ Frontline PHCs.
   - Note the red-highlighted route: **Corridor NH-216 (Flood Risk Choke Point)** causing an estimated $+2.2$ hours delay.

---

### STEP 6: Intelligent Resource Redistribution (Interactive Approval)
1. Click **"Redistribution AI"** in the sidebar.
2. Review recommendation **REDIST-001**:
   - Source: **Guntur Medical College Depot** (Holds $+18.4$ days excess buffer).
   - Destination: **Machilipatnam Coastal PHC (Krishna)** (Deficit: $2.8$ days stock left).
   - Quantity: **800 units ORS** | Transit: **54.2 km (~1.8 hours)**.
3. Click the cyan **"Approve Redistribution"** button:
   - Triggers confetti animation.
   - Status updates instantly to **APPROVED & IN DISPATCH**.
   - Logs an immutable entry into the administrative audit trail.

---

### STEP 7: Emergency Command Mode
1. Click **"Emergency Command"** in the sidebar or the header toggle.
2. Review the active **Monsoon River Inundation & Flash Flood Surge (Krishna Delta)**:
   - Patient surge: **+42%** | Medicine surge: **+28%** | Bed deficit: **+620 beds** | Critical PHCs: **17**.
   - Inspect the automated **Emergency Directives Checklist** (pre-positioning 10,000 ORS sachets, deploying mobile medical units, and lateral reallocations).

---

### STEP 8: Digital Twin "What-If" Simulation Lab
1. Click **"Digital Twin Lab"** in the sidebar.
2. Adjust the sliders:
   - Patient Demand Surge: **+40%**
   - Supply Disruption: **20%**
   - Transport Delay: **2 Days**
   - Medical Staff Shortage: **15%**
3. Review the live **BEFORE vs. AFTER** comparison table:
   - Outpatient footfall jumps from 138k to 193k.
   - Bed occupancy surges from 69.4% to 83.4%.
   - Resilience Index drops from 82.4 to 59.2.
   - Directives automatically generate auxiliary triage recommendations.

---

### STEP 9: Federated AI Architecture & Zero-PII Guarantee
1. Click **"Federated Learning"** in the sidebar.
2. Highlight key privacy metrics:
   - **Participating Edge Nodes**: 1,248 PHCs.
   - **Raw Patient Data Shared**: **0.00 KB** (Zero clinical PII transmitted).
   - **Differential Privacy Budget**: $\varepsilon = 1.20$.
   - **Global Model Accuracy**: 94.6%.
3. Click **"Trigger Next Federated Round"**:
   - Watch Round #19 aggregate live gradients and accuracy climb to 95.1%!

---

### STEP 10: Arogya Copilot (Multilingual & Voice)
1. Click **"Arogya Copilot"** in the top navigation bar.
2. Test sample queries by clicking a chip or typing:
   - English: *"Which districts are at highest stock-out risk?"*
   - Telugu: *"ఏ జిల్లాల్లో మందుల కొరత వచ్చే అవకాశం ఉంది?"*
   - Hindi: *"किन जिलों में दवाओं की कमी का सबसे अधिक खतरा है?"*
3. The Copilot returns structured answers, metric cards, action buttons, and follow-ups.
4. (Optional) Click the microphone button to test in-browser voice input.

---

### STEP 11: Executive AI Situation Report (SITREP)
1. Click **"Executive AI Report"** in the sidebar.
2. Review the generated official briefing document.
3. Test exporting via **"Print / PDF"**, **"CSV"**, or **"JSON Data"**.
