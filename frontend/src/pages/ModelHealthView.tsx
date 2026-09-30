import React from 'react';
import { Activity, ShieldCheck, Cpu, RefreshCw, CheckCircle2, AlertTriangle, Download } from 'lucide-react';

export const ModelHealthView: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            AI MODEL OBSERVATORY & HEALTH
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>
            Federated weight convergence, data drift metrics, differential privacy verification, and latency benchmarks
          </p>
        </div>
        <span className="ag-badge ag-badge-stable">● 1,248 Federated Nodes Connected</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {[
          { label: 'Forecast Accuracy (MAPE)', value: '94.6%', sub: 'Target: >90% precision' },
          { label: 'Differential Privacy (ε)', value: '0.85', sub: 'Zero raw patient leakage' },
          { label: 'Inference Latency', value: '42ms', sub: 'Edge model execution time' },
          { label: 'Data Drift Score', value: '0.02', sub: 'Baseline shift within tolerance' },
        ].map(m => (
          <div key={m.label} className="ag-card" style={{ padding: '14px 18px' }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)' }}>{m.label}</span>
            <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'JetBrains Mono', marginTop: 4 }}>
              {m.value}
            </div>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{m.sub}</p>
          </div>
        ))}
      </div>

      <div className="ag-card" style={{ padding: 22 }}>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>
          FEDERATED LEARNING AUDIT & DPDP ACT COMPLIANCE
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          <p>
            • <strong>Local Processing Guarantee:</strong> All patient diagnostic records and biometric footfall telemetry remain strictly locked inside PHC edge hardware boundaries.
          </p>
          <p>
            • <strong>Secure Aggregation (FedAvg):</strong> Only cryptographically blinded weight gradients travel across national TLS 1.3 channels to the central Resilience Brain.
          </p>
          <p>
            • <strong>Explainable AI Protocol:</strong> All automated stockout predictions produce deterministic Shapley causal attribution weights (no uninterpretable black-box decisions).
          </p>
        </div>
      </div>
    </div>
  );
};
