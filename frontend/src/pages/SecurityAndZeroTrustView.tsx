import React, { useState, useEffect } from 'react';
import {
  Shield, Key, Lock, AlertOctagon, CheckCircle2, History,
  FileCheck, ShieldAlert, UserCheck, Terminal, Fingerprint,
  RefreshCw, Check, AlertTriangle
} from 'lucide-react';
import { fetchSecurityEvents, fetchDigitalSignatures } from '../services/api';
import { SecurityEventItem, DigitalSignatureApproval } from '../types';

export const SecurityAndZeroTrustView: React.FC = () => {
  const [events, setEvents] = useState<SecurityEventItem[]>([]);
  const [signatures, setSignatures] = useState<DigitalSignatureApproval[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // New simulated digital sign modal
  const [isSigning, setIsSigning] = useState<boolean>(false);
  const [signWorkflowName, setSignWorkflowName] = useState<string>("Emergency Logistics Detour Warrant #9921");
  const [signSuccess, setSignSuccess] = useState<boolean>(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [ev, sig] = await Promise.all([
        fetchSecurityEvents(),
        fetchDigitalSignatures()
      ]);
      setEvents(ev);
      setSignatures(sig);
      setLoading(false);
    }
    loadData();
  }, []);

  const handleSimulateSign = () => {
    setIsSigning(true);
    setTimeout(() => {
      setIsSigning(false);
      setSignSuccess(true);
      const newSig: DigitalSignatureApproval = {
        audit_id: `SIG-AP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        workflow_title: signWorkflowName,
        requested_by: "District Health Officer (Krishna)",
        reviewed_by: "AI Authorization Guard",
        approved_by: "Dr. Sunita Rao (Director of Public Health)",
        timestamp: "Just now",
        cryptographic_hash: "sha256:d8a27d53b219e44d32a93907c11f42d2a452147321e1e0a2979201a084620021",
        status: "SIGNED"
      };
      setSignatures([newSig, ...signatures]);
    }, 1400);
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl border border-red-800/40 bg-gradient-to-r from-slate-900 via-slate-900 to-red-950/50 p-6 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-red-500/20 px-3 py-0.5 text-xs font-semibold text-red-400 border border-red-500/30">
                MODULES 32, 33, 34
              </span>
              <span className="rounded-full bg-emerald-500/20 px-3 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/30">
                ZERO-TRUST GOVERNANCE ACTIVE
              </span>
            </div>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-white lg:text-3xl">
              Zero-Trust Security Center & Cryptographic Audit
            </h1>
            <p className="mt-1 text-sm text-slate-300">
              Role-based least privilege enforcement, live security event telemetry, synthetic probe monitoring, and cryptographic digital approval signatures.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 rounded-full bg-slate-800 px-3 py-1.5 text-xs font-mono text-cyan-300 border border-slate-700">
              <Shield className="h-3.5 w-3.5 text-emerald-400" />
              RBAC Strict Gatekeeper
            </span>
          </div>
        </div>
      </div>

      {/* Zero-Trust Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { title: "Identity & MFA", desc: "Hardware token / Biometric authentication", status: "VERIFIED", icon: Fingerprint, color: "text-emerald-400" },
          { title: "Least Privilege RBAC", desc: "Strict separation between Clinician & DHO", status: "ENFORCED", icon: Key, color: "text-cyan-400" },
          { title: "Zero Raw PII Policy", desc: "Differential Privacy ε=1.20 mathematically proven", status: "0.00 KB LEAK", icon: Lock, color: "text-indigo-400" },
          { title: "Immutable Audit Ledger", desc: "SHA-256 cryptographic verification", status: "100% AUDITABLE", icon: FileCheck, color: "text-teal-400" }
        ].map((pillar, i) => (
          <div key={i} className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-bold">{pillar.title}</span>
              <pillar.icon className={`h-4 w-4 ${pillar.color}`} />
            </div>
            <p className="mt-2 text-slate-300 text-[11px]">{pillar.desc}</p>
            <span className="mt-3 inline-block rounded bg-black/40 px-2 py-0.5 text-[9px] font-bold text-emerald-400">
              {pillar.status}
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Security Event Telemetry */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-red-400" />
              <h3 className="text-sm font-bold text-white">Live Security Event Sentinel (Synthetic Probes)</h3>
            </div>
            <span className="rounded-full bg-red-500/20 px-2.5 py-0.5 text-[10px] font-bold text-red-400">
              {events.length} Probes Blocked
            </span>
          </div>

          <div className="mt-4 space-y-3">
            {events.map((ev) => (
              <div key={ev.id} className="rounded-xl border border-slate-800 bg-slate-950/70 p-3.5 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-cyan-300 font-bold">{ev.id}</span>
                    <span className="rounded bg-red-500/20 px-1.5 py-0.5 text-[9px] font-bold text-red-400">
                      {ev.event_type}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400">{ev.timestamp}</span>
                </div>

                <div className="mt-2 flex items-center justify-between text-slate-300 text-[11px]">
                  <span>Actor / IP: <strong className="text-white">{ev.actor} ({ev.ip})</strong></span>
                  <span className="font-bold text-emerald-400">{ev.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Digital Signature Approval Workflow */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <FileCheck className="h-4 w-4 text-teal-400" />
              <h3 className="text-sm font-bold text-white">Cryptographic Digital Signature Workflow</h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">SHA-256 Validated</span>
          </div>

          {/* Interactive 1-Click Signing Action */}
          <div className="mt-4 rounded-xl border border-teal-900/40 bg-teal-950/20 p-4 text-xs">
            <span className="font-bold text-teal-300">Simulate Administrative High-Impact Approval</span>
            <p className="text-[11px] text-slate-300 mt-1">
              Actions involving inter-district lateral dispatch or emergency vaccine draws require high-level cryptographic authorization.
            </p>

            <div className="mt-3 flex items-center gap-2">
              <input
                type="text"
                value={signWorkflowName}
                onChange={(e) => setSignWorkflowName(e.target.value)}
                className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-white focus:border-teal-500 focus:outline-none"
              />
              <button
                onClick={handleSimulateSign}
                disabled={isSigning}
                className="rounded-lg bg-teal-600 px-3.5 py-1.5 text-xs font-bold text-slate-950 hover:bg-teal-500 disabled:opacity-50 transition-colors"
              >
                {isSigning ? 'Hashing...' : 'Sign with Digital Key'}
              </button>
            </div>
            {signSuccess && (
              <span className="mt-2 block text-[11px] text-emerald-400 font-semibold">
                ✓ Cryptographic sign-off generated and appended to immutable audit ledger.
              </span>
            )}
          </div>

          {/* List of Signed Approvals */}
          <div className="mt-4 space-y-3 max-h-64 overflow-y-auto pr-1">
            {signatures.map((sig) => (
              <div key={sig.audit_id} className="rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white line-clamp-1">{sig.workflow_title}</span>
                  <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[9px] font-bold text-emerald-400">
                    {sig.status}
                  </span>
                </div>

                <div className="mt-2 text-slate-400 text-[10px] space-y-0.5">
                  <div>Approved By: <strong className="text-white">{sig.approved_by}</strong></div>
                  <div>Timestamp: <span className="text-slate-300">{sig.timestamp}</span></div>
                  <div className="truncate font-mono text-teal-400">Hash: {sig.cryptographic_hash}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
