# SYSTEM ARCHITECTURE & TOPOLOGY
### AROGYAGRID AI: Federated Intelligence for Resilient Public Healthcare

---

## 1. Architectural Philosophy
ArogyaGrid AI is built on the tenet of **Edge-Centric Resilience with Centralized Optimization**:
1. **Decentralized Data Ownership**: Frontline health centres retain sovereign custody of citizen health records.
2. **Asymmetric Parameter Federation**: Local nodes send only lightweight gradient tensors $(\nabla_\theta L)$ to the central orchestrator.
3. **Multi-Echelon Supply Chain Graph**: Logistics nodes are represented as weighted digraphs $G = (V, E)$ where nodes $V$ represent storage capacity and edges $E$ model road transit resistance and flood risk.

---

## 2. Component Diagram

```mermaid
graph TD
    subgraph "Edge Layer (694+ PHCs)"
        PHC1["PHC-0042 Machilipatnam\n(Local EHR & TF Lite)"]
        PHC2["PHC-0018 Avanigadda\n(Local EHR & TF Lite)"]
        PHC3["PHC-0065 Guntur Urban\n(Local EHR & TF Lite)"]
    end

    subgraph "Differential Privacy Shroud"
        DP1["DP-SGD Noise Injection\n(ε = 1.20, δ = 1e-5)"]
    end

    subgraph "Central Intelligence Core (FastAPI / Cloud Run)"
        Aggregator["Federated Averaging Core\n(FedAvg v2.18)"]
        Twin["Digital Twin Network Graph\n(Multi-Tier Queue Dynamics)"]
        Forecast["Time-Series Forecasting Engine\n(24h - 90d Horizons)"]
        Solver["Integer Linear Programming Solver\n(Lateral Reallocation)"]
        Anomaly["Statistical Anomaly Engine\n(Z-Score Outlier Detector)"]
        CopilotEngine["Arogya Copilot Engine\n(Multilingual NLP + Gemini API)"]
    end

    subgraph "Presentation Layer (React 19 / Vite / Tailwind)"
        UI_Dash["National Command Center"]
        UI_Map["Geospatial Map Intelligence"]
        UI_Twin["Simulation Lab Controls"]
        UI_Voice["Voice & Multilingual Copilot"]
        UI_Judge["Guided Judge Tour Mode"]
    end

    PHC1 --> DP1
    PHC2 --> DP1
    PHC3 --> DP1
    DP1 --> Aggregator
    Aggregator --> Forecast
    Forecast --> Twin
    Twin --> Solver
    Aggregator --> Anomaly
    Aggregator --> CopilotEngine

    Forecast --> UI_Dash
    Twin --> UI_Twin
    Solver --> UI_Dash
    CopilotEngine --> UI_Voice
    Aggregator --> UI_Judge
```

---

## 3. Data Flow Pipelines

### A. Real-Time Telemetry Loop
1. PHCs log medication dispensations, bed admissions, and staff attendance.
2. Background WebSocket channels at `/ws/telemetry` stream live heartbeats and footfall adjustments to client dashboards every 4 seconds.
3. Dashboards dynamically render counter updates without page refreshes.

### B. Federated Aggregation Cycle
1. Participating PHC nodes initialize local training rounds on local outpatient arrival distributions.
2. Local gradients are clipped to $L_2$ norm $C$ and perturbed with calibrated Gaussian noise:
   $$\tilde{g} = \frac{1}{|B|} \left( \sum_{i \in B} \text{clip}(g_i, C) + \mathcal{N}(0, \sigma^2 C^2 I) \right)$$
3. The central server computes weighted model averages:
   $$W_{t+1} = \sum_{k=1}^K \frac{n_k}{n} W_{t+1}^k$$
4. Global model weights are broadcast back to edge clients, ensuring zero clinical patient records leave local devices.

### C. Lateral Redistribution Solver
1. Shortage detector identifies districts with:
   $$\text{Days of Stock} = \frac{\text{Current Stock}}{\max(\text{Daily Draw}, \text{Predicted Demand})} < \text{Lead Time} + 1$$
2. The Integer Linear Programming (ILP) algorithm solves for optimal flow:
   $$\min \sum_{i,j} d_{ij} \cdot t_{ij} \cdot x_{ij} \quad \text{subject to} \quad \text{Buffer}_i \ge \text{Safety Threshold}$$
3. Outputs source, destination, quantity, transit hours, and expected impact.
