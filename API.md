# REST & WEBSOCKET API SPECIFICATION
### ArogyaGrid AI v2.4

Base URL: `http://127.0.0.1:8000/api`
Interactive Swagger Docs: `http://127.0.0.1:8000/docs`

---

## 1. Core Endpoints

### `GET /api/health`
Health check and engine status.
- **Response**: `{"status": "healthy", "service": "ArogyaGrid AI Core Engine", "version": "2.4.0"}`

### `GET /api/dashboard`
Returns high-level national command metrics.
- **Response**:
```json
{
  "network_status": "OPERATIONAL",
  "total_phcs": 694,
  "active_phcs": 690,
  "total_districts": 51,
  "total_states": 8,
  "medicine_availability_pct": 89.9,
  "critical_stockouts_count": 3,
  "total_beds": 8430,
  "beds_occupied": 5852,
  "beds_available": 2578,
  "bed_occupancy_pct": 69.4,
  "doctor_attendance_pct": 92.8,
  "national_resilience_index": 82.4,
  "active_emergencies_count": 1,
  "federated_participating_nodes": 1248
}
```

---

## 2. Geospatial & Facilities

### `GET /api/phcs`
Lists PHC facilities with optional query filters:
- Query Parameters: `state`, `district`, `status`, `limit` (default: 100).

### `GET /api/districts`
Returns 51 monitored districts with coordinates, population, CMO, and resilience score.

### `GET /api/states`
Returns state-level infrastructure summaries.

---

## 3. Inventory & AI Forecasting

### `GET /api/medicines`
Returns the 100+ medicine catalog with current stock, lead time, reorder points, batch numbers, and FEFO priorities.

### `GET /api/forecast`
AI Demand forecasting endpoint:
- Query Parameters: `medicine_id`, `district_name`, `horizon` (`24h`, `7d`, `30d`, `90d`).
- **Response**: Returns time-series prediction points, 95% confidence intervals, and explainable AI feature attribution weights.

### `GET /api/stockout-risk`
Calculates imminent stock-outs, days-to-zero, safety stock, and AI replenishment recommendations.

---

## 4. Lateral Redistribution & Optimization

### `GET /api/redistribution`
Lists all calculated cross-district lateral transfers.

### `POST /api/redistribution/{rec_id}/approve`
Approves a pending lateral transfer, shifts status to `APPROVED`, and writes an immutable entry into the audit trail.

### `POST /api/redistribution/generate-plan`
Triggers integer linear programming re-optimization across network buffers.

---

## 5. Digital Twin & Emergency Simulation

### `POST /api/simulation/run`
Executes digital twin shock simulation:
- **Body**:
```json
{
  "patient_demand_delta_pct": 40,
  "supply_disruption_pct": 20,
  "transport_delay_days": 2,
  "staff_shortage_pct": 15
}
```
- **Response**: Comparative before vs after metrics, bed deficits, additional stock-out counts, and emergency interventions.

### `GET /api/emergencies`
Lists disaster scenarios (Flood, Outbreak, Cyclone, Heatwave).

### `POST /api/emergencies/{emergency_id}/toggle`
Toggles active disaster response protocol.

---

## 6. Federated Learning Core

### `GET /api/federated-learning`
Returns current epoch status, model version, differential privacy epsilon, accuracy curves, and node counts.

### `POST /api/federated-learning/round`
Simulates parameter aggregation across 1,248 nodes for the next round.

---

## 7. Arogya Copilot

### `POST /api/copilot/query`
Natural-language conversational query endpoint:
- **Body**:
```json
{
  "query": "Which districts are at highest stock-out risk?",
  "language": "en",
  "role": "National Health Administrator"
}
```
- **Response**: Answer string, supporting metric cards, suggested follow-ups, and action directives. Supports queries in English, Hindi, and Telugu.

---

## 8. Real-Time WebSocket

### `WS /ws/telemetry`
Streams continuous telemetry heartbeats and outpatient footfall adjustments every 4 seconds.
