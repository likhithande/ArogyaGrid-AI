# ARTIFICIAL INTELLIGENCE & MATHEMATICAL FOUNDATIONS
### ArogyaGrid AI: Federated Machine Learning & Optimization Core

---

## 1. Multi-Horizon Demand Forecasting

### Architecture
ArogyaGrid AI employs an ensemble multi-horizon forecasting pipeline designed for epidemiological and inventory elasticity:
1. **Holt-Winters Exponential Smoothing with Multiplicative Seasonality**: Captures recurring weekly and monthly cycles in clinic attendance.
2. **Exogenous Feature Decomposition**:
   $$y_{t+h} = \alpha \cdot \text{Base}_t + \beta \cdot \text{EpiTrend}_t + \gamma \cdot \text{FootfallSurge}_t + \delta \cdot \text{ClusterStockout}_t + \zeta \cdot \text{Shock}_t$$
3. **Dynamic Confidence Envelopes**:
   The $95\%$ confidence bounds widen asymptotically over time horizon $h \in \{1, 7, 30, 90\}$:
   $$\text{CI}_{95\%}(h) = \hat{y}_h \pm 1.96 \cdot \sigma \cdot \sqrt{1 + \kappa \cdot h}$$

### Transparent Explainable AI (XAI)
Rather than uninterpretable deep layers, ArogyaGrid AI uses an additive Shapley-inspired attribution model where every predicted surge is partitioned into quantifiable physical drivers:
- **Baseline Consumption (32%)**: 6-month historical moving average.
- **Disease-Season Velocity (28%)**: Inundation and acute gastroenteritis/fever cluster coefficients.
- **Patient Footfall Expansion (21%)**: Outpatient surge detected at intake triage.
- **Adjacent PHC Stock-Out Diversion (11%)**: Cross-facility patient redirection.
- **Weather / Disaster Shock (8%)**: Upstream river flood gauge index.

---

## 2. Federated Learning & Differential Privacy (DP-SGD)

### Mathematical Formulation
To guarantee that individual citizen health records are never extracted or reconstructed from central models:
1. **Local Edge Training**:
   Each of the 1,248 PHCs trains a local parameter vector $\theta_k$ on its local records $D_k$:
   $$\theta_k^{(t+1)} = \theta^{(t)} - \eta \cdot \nabla L(\theta^{(t)}; D_k)$$

2. **Per-Sample Gradient Clipping**:
   To prevent any single patient's record from disproportionately altering weight updates:
   $$\bar{g}_i = g_i \cdot \min\left(1, \frac{C}{\|g_i\|_2}\right)$$
   where $C$ is the clipping threshold ($C = 1.0$).

3. **Gaussian Noise Addition**:
   $$\tilde{g}_k = \frac{1}{|B|} \left( \sum_{i \in B} \bar{g}_i + \mathcal{N}\left(0, \sigma^2 C^2 I\right) \right)$$

4. **Privacy Budget Accounting**:
   Using the Moments Accountant, privacy loss is bounded by:
   $$\varepsilon = 1.20, \quad \delta = 10^{-5}$$
   guaranteeing strong $(\varepsilon, \delta)$-differential privacy.

---

## 3. Lateral Resource Redistribution Solver

### Integer Linear Programming (ILP) Optimization
When a set of deficit facilities $D$ face projected stock-out in $\le 3.5$ days, the system queries the network digraph for candidate surplus facilities $S$ where stock exceeds 14 days of local demand.

The objective function minimizes total delivery latency and risk:
$$\min \sum_{i \in S} \sum_{j \in D} \left( \text{Distance}_{ij} \cdot \text{CongestionFactor}_{ij} + \lambda \cdot \text{UrgencyPenalty}_j \right) \cdot X_{ij}$$

Subject to:
1. **Source Buffer Conservation**:
   $$\text{CurrentStock}_i - \sum_{j} X_{ij} \ge \text{SafetyStock}_i$$
2. **Deficit Satisfaction**:
   $$\sum_{i} X_{ij} \ge \text{DeficitQuantity}_j$$
3. **Integrity Constraint**:
   $$X_{ij} \ge 0, \quad X_{ij} \in \mathbb{Z}$$

---

## 4. Multi-Factor Resilience Index

The composite **National Health Supply Resilience Score** ($82.4/100$) is computed as:
$$\text{Resilience Index} = \sum_{k=1}^7 w_k \cdot S_k$$

| Sub-Metric Component ($S_k$) | Weight ($w_k$) | Operational Definition |
| :--- | :--- | :--- |
| **Inventory Stability** | 0.20 | Ratio of medicines above mandated 5-day safety threshold |
| **Demand Volatility Buffer** | 0.15 | Resilience against acute infectious surge variance |
| **Supply Lead-Time Reliability** | 0.15 | On-time delivery coefficient from central & state depots |
| **Medical Staffing Coverage** | 0.15 | Duty roster attendance of doctors, nurses & pharmacists |
| **Bed Surge Capacity** | 0.15 | Oxygen-supported & ICU emergency bed availability buffer |
| **Transport Route Clearance** | 0.10 | Road corridor transit latency without waterlogging delays |
| **Emergency Response Readiness** | 0.10 | Contingency kit pre-positioning and rapid triage plans |
