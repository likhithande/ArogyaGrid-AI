from datetime import datetime, timedelta
import random
import math
from typing import Dict, List, Optional
from models.schemas import DemandForecast, DemandForecastPoint
from data.synthetic_generator import data_store

def get_demand_forecast(
    medicine_id: Optional[str] = None,
    district_name: Optional[str] = "Krishna",
    horizon: str = "7d"
) -> DemandForecast:
    # Find matching medicine
    med = None
    if medicine_id:
        for m in data_store.medicines:
            if m.id == medicine_id or m.code == medicine_id:
                med = m
                break
    if not med:
        # Default to Paracetamol or ORS
        med = data_store.medicines[0]

    now = datetime.now()
    horizon_days_map = {
        "24h": 1,
        "7d": 7,
        "30d": 30,
        "90d": 90
    }
    days = horizon_days_map.get(horizon, 7)

    # Base daily rate
    base_rate = med.daily_consumption_avg
    is_crisis_district = district_name in ["Krishna", "East Godavari"]
    multiplier = 1.31 if is_crisis_district and ("Paracetamol" in med.name or "ORS" in med.name) else 1.12
    trend_pct = round((multiplier - 1.0) * 100, 1)

    points: List[DemandForecastPoint] = []

    # Generate 14 days historical
    for h in range(14, 0, -1):
        dt = (now - timedelta(days=h)).strftime("%b %d")
        hist_val = round(base_rate * (1.0 + 0.15 * math.sin(h * 0.7) + (random.random() - 0.5) * 0.08), 1)
        points.append(DemandForecastPoint(
            date=dt,
            historical=hist_val,
            predicted=hist_val,
            ci_lower=round(hist_val * 0.92, 1),
            ci_upper=round(hist_val * 1.08, 1)
        ))

    # Generate future horizon points
    accumulated_pred = 0.0
    step = 1 if days <= 7 else (2 if days <= 30 else 5)
    for f in range(1, days + 1, step):
        dt = (now + timedelta(days=f)).strftime("%b %d")
        growth_factor = 1.0 + ((multiplier - 1.0) * (f / days))
        pred_val = round(base_rate * growth_factor * (1.0 + 0.08 * math.sin(f * 0.5)), 1)
        accumulated_pred += pred_val * step
        # Confidence interval expands with horizon distance
        ci_spread = 0.05 + (0.003 * f)
        points.append(DemandForecastPoint(
            date=dt,
            historical=None,
            predicted=pred_val,
            ci_lower=round(pred_val * (1.0 - ci_spread), 1),
            ci_upper=round(pred_val * (1.0 + ci_spread), 1)
        ))

    confidence = round(94.2 - (days * 0.12), 1)
    risk_level = "CRITICAL" if (trend_pct > 25 and med.predicted_stockout_days < 5) else ("HIGH" if trend_pct > 15 else "MEDIUM")

    # Explainable AI factors breakdown
    factors = {
        "Historical 6-Month Baseline": 32.0,
        "Monsoon Season Gastroenteritis Trend": 28.0 if "ORS" in med.name else 22.0,
        "Patient Footfall Surge (+27%)": 21.0,
        "Cluster Stock-outs at Adjacent PHCs": 11.0,
        "Weather & Inundation Shock Index": 8.0
    }

    ai_summary = (
        f"{med.name} demand in {district_name or 'the network'} is projected to increase "
        f"{trend_pct}% over the next {horizon}. Driven primarily by seasonal acute illness trends "
        f"and a 27% footfall expansion across primary care clinics."
    )

    return DemandForecast(
        medicine_id=med.id,
        medicine_name=med.name,
        district_name=district_name or "All Monitored Districts",
        horizon=horizon,
        current_demand_rate=float(base_rate),
        predicted_demand_total=round(accumulated_pred, 1),
        trend_pct=trend_pct,
        confidence_score=confidence,
        anomaly_detected=is_crisis_district,
        risk_level=risk_level,
        points=points,
        explanation_factors=factors,
        ai_summary=ai_summary
    )
