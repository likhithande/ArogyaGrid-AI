from datetime import datetime
from typing import Dict, Any, List
from models.schemas import FederatedRound, AuditLog
from data.synthetic_generator import data_store

def get_federated_rounds() -> List[FederatedRound]:
    return data_store.federated_rounds

def get_federated_overview() -> Dict[str, Any]:
    latest = data_store.federated_rounds[-1] if data_store.federated_rounds else None
    return {
        "status": "OPERATIONAL",
        "current_round": latest.round_number if latest else 18,
        "latest_round": latest,
        "total_enrolled_nodes": 1280,
        "active_training_nodes": latest.participating_nodes if latest else 1248,
        "participation_rate_pct": 97.5,
        "global_model_version": latest.model_version if latest else "Arogya-FedNet-v2.18",
        "aggregation_algorithm": "Federated Averaging (FedAvg) + Differential Privacy (DP-SGD)",
        "privacy_budget_epsilon": latest.privacy_epsilon if latest else 1.20,
        "differential_privacy_delta": "1e-5",
        "raw_patient_data_shared": "0.00 KB (Zero Patient PII Transmitted)",
        "local_training_framework": "TensorFlow Lite / PyTorch Edge Embedded",
        "central_aggregator_location": "National Health Informatics Data Center (NIC / Hyderabad)",
        "history": data_store.federated_rounds
    }

def trigger_federated_round() -> FederatedRound:
    now = datetime.now()
    latest = data_store.federated_rounds[-1]
    new_round_num = latest.round_number + 1
    new_nodes = min(1280, latest.participating_nodes + 6)
    new_loss = max(0.12, round(latest.aggregation_loss * 0.91, 3))
    new_acc = min(98.5, round(latest.accuracy_pct + 0.45, 2))
    new_eps = round(latest.privacy_epsilon + 0.05, 2)
    delta_imp = round(new_acc - latest.accuracy_pct, 2)

    new_round = FederatedRound(
        round_number=new_round_num,
        timestamp=now.strftime("%Y-%m-%d %H:%M:%S"),
        participating_nodes=new_nodes,
        model_version=f"Arogya-FedNet-v2.{new_round_num}",
        aggregation_loss=new_loss,
        accuracy_pct=new_acc,
        privacy_epsilon=new_eps,
        delta_improvement_pct=delta_imp,
        data_transmitted_mb=round(new_nodes * 0.43, 1),
        raw_data_shared="0.00 KB (Zero Patient PII)"
    )
    data_store.federated_rounds.append(new_round)

    # Append to audit log
    data_store.audit_logs.insert(0, AuditLog(
        id=f"AUDIT-{len(data_store.audit_logs)+1:04d}",
        timestamp=now.strftime("%Y-%m-%d %H:%M:%S"),
        user_name="Federated Orchestrator Engine",
        role="Automated AI Core",
        action="FEDERATED_AGGREGATION_ROUND",
        resource=f"Round #{new_round_num}: Aggregated local gradient tensors from {new_nodes} PHC nodes",
        previous_state=f"Model v2.{latest.round_number} (Acc: {latest.accuracy_pct}%)",
        new_state=f"Model v2.{new_round_num} (Acc: {new_acc}%)",
        status="SUCCESS"
    ))

    return new_round
