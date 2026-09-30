import React, { useState, useEffect } from 'react';
import {
  FileText, Upload, CheckCircle2, AlertTriangle, Search,
  GitCommit, ShieldCheck, Eye, Sparkles, Database, FileSpreadsheet,
  Layers, Clock, ArrowRight, XCircle
} from 'lucide-react';
import {
  fetchExtractedDocuments, fetchReconciliationDiscrepancies, fetchDataLineageItems
} from '../services/api';
import {
  ExtractedDocData, ReconciliationDiscrepancy, DataLineageItem
} from '../types';

export const MultimodalAndDocumentView: React.FC = () => {
  const [documents, setDocuments] = useState<ExtractedDocData[]>([]);
  const [reconciliations, setReconciliations] = useState<ReconciliationDiscrepancy[]>([]);
  const [lineageItems, setLineageItems] = useState<DataLineageItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Tabs
  const [activeTab, setActiveTab] = useState<'upload' | 'reconciliation' | 'lineage' | 'factcheck'>('upload');
  const [isSimulatingUpload, setIsSimulatingUpload] = useState<boolean>(false);
  const [verifiedDocs, setVerifiedDocs] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [d, r, l] = await Promise.all([
        fetchExtractedDocuments(),
        fetchReconciliationDiscrepancies(),
        fetchDataLineageItems()
      ]);
      setDocuments(d);
      setReconciliations(r);
      setLineageItems(l);
      setLoading(false);
    }
    loadData();
  }, []);

  const handleSimulateNewUpload = () => {
    setIsSimulatingUpload(true);
    setTimeout(() => {
      setIsSimulatingUpload(false);
      const newDoc: ExtractedDocData = {
        id: `DOC-00${documents.length + 1}`,
        filename: "East_Godavari_Emergency_Supply_Manifest.pdf",
        doc_type: "SUPPLY_REPORT",
        upload_time: "Just now",
        extracted_tables: [
          { item: "Doxycycline 100mg", recorded_qty: 3000, counted_qty: 3000, discrepancy: 0 },
          { item: "Ciprofloxacin 500mg", recorded_qty: 1800, counted_qty: 1750, discrepancy: -50 }
        ],
        extracted_entities: {
          "Source Depot": "Kakinada Port Warehouse",
          "Verification Status": "AI Extracted (Pending Sign-off)",
          "Confidence Score": "99.1% (High Fidelity)"
        },
        confidence_pct: 99.1,
        status: "PENDING_VERIFICATION"
      };
      setDocuments([newDoc, ...documents]);
    }, 1200);
  };

  const handleApproveDoc = (id: string) => {
    setVerifiedDocs(prev => ({ ...prev, [id]: true }));
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
      <div className="rounded-2xl border border-sky-800/40 bg-gradient-to-r from-slate-900 via-slate-900 to-sky-950/50 p-6 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-sky-500/20 px-3 py-0.5 text-xs font-semibold text-sky-400 border border-sky-500/30">
                MODULES 16, 17, 18, 19, 20
              </span>
              <span className="rounded-full bg-emerald-500/20 px-3 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/30">
                MULTIMODAL INTELLIGENCE ONLINE
              </span>
            </div>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-white lg:text-3xl">
              Multimodal AI Center & Document Intelligence
            </h1>
            <p className="mt-1 text-sm text-slate-300">
              Extracts structured inventory tables from PDF/CSV/Image supply manifests, flags multi-source data discrepancies, provides end-to-end audit data lineage, and provides fact-checking.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'upload', label: 'Document Intelligence & OCR' },
              { id: 'reconciliation', label: 'Data Reconciliation' },
              { id: 'lineage', label: 'Data Lineage Explorer' },
              { id: 'factcheck', label: 'AI Fact-Check Layer' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-sky-500 text-slate-950 shadow-lg shadow-sky-500/25 font-bold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* TAB 1: DOCUMENT INTELLIGENCE & OCR */}
      {activeTab === 'upload' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl backdrop-blur-md">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <FileText className="h-5 w-5 text-sky-400" />
                  Multimodal Ingestion & Document Intelligence
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Upload PDF manifests, scanned paper dispatches, or emergency bulletins. The AI extracts structured tables and requires human review before database insertion.
                </p>
              </div>

              <button
                onClick={handleSimulateNewUpload}
                disabled={isSimulatingUpload}
                className="rounded-xl bg-sky-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-sky-600/30 hover:bg-sky-500 disabled:opacity-50 flex items-center gap-1.5 mt-3 md:mt-0"
              >
                <Upload className="h-4 w-4" />
                {isSimulatingUpload ? 'Extracting via Vertex OCR...' : 'Upload Manifest (Demo PDF)'}
              </button>
            </div>

            <div className="mt-6 space-y-6">
              {documents.map((doc) => {
                const isApproved = verifiedDocs[doc.id];
                return (
                  <div key={doc.id} className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5">
                    <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-3 gap-2">
                      <div className="flex items-center gap-3">
                        <span className="rounded bg-sky-500/20 p-2 text-sky-400">
                          <FileSpreadsheet className="h-5 w-5" />
                        </span>
                        <div>
                          <h4 className="font-bold text-white text-sm">{doc.filename}</h4>
                          <span className="text-[11px] text-slate-400">Uploaded {doc.upload_time} | Type: {doc.doc_type}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-bold text-emerald-400">
                          {doc.confidence_pct}% AI Confidence
                        </span>
                        {isApproved ? (
                          <span className="flex items-center gap-1 text-xs font-bold text-emerald-400">
                            <CheckCircle2 className="h-4 w-4" /> COMMITTED TO DB
                          </span>
                        ) : (
                          <button
                            onClick={() => handleApproveDoc(doc.id)}
                            className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-500 transition-colors"
                          >
                            Approve Extracted Data
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Extracted Entities */}
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                      {Object.entries(doc.extracted_entities).map(([k, v], i) => (
                        <div key={i} className="rounded-lg bg-slate-900/60 p-2.5 border border-slate-800/80">
                          <span className="text-slate-400 text-[10px]">{k}</span>
                          <p className="font-semibold text-white mt-0.5">{v}</p>
                        </div>
                      ))}
                    </div>

                    {/* Extracted Table */}
                    <div className="mt-4 overflow-x-auto border-t border-slate-800 pt-3">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Extracted Tabular Items
                      </span>
                      <table className="w-full text-left text-xs mt-2">
                        <thead>
                          <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                            <th className="pb-2">Medicine / Resource</th>
                            <th className="pb-2">Recorded Qty</th>
                            <th className="pb-2">Counted Qty</th>
                            <th className="pb-2">Discrepancy</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/40">
                          {doc.extracted_tables.map((t, idx) => (
                            <tr key={idx}>
                              <td className="py-2 font-semibold text-white">{t.item}</td>
                              <td className="py-2 text-slate-300">{t.recorded_qty.toLocaleString()}</td>
                              <td className="py-2 text-slate-300">{t.counted_qty.toLocaleString()}</td>
                              <td className="py-2">
                                <span className={`font-bold ${t.discrepancy < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                                  {t.discrepancy === 0 ? '0 (Match)' : `${t.discrepancy} units`}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DATA RECONCILIATION */}
      {activeTab === 'reconciliation' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl backdrop-blur-md">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-400" />
                Cross-Source AI Data Reconciliation
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Compares warehouse physical counts, district reports, and system telemetry. Flags variance above threshold and blocks silent overwrites.
              </p>
            </div>

            <div className="mt-6 space-y-4">
              {reconciliations.map((rec) => (
                <div key={rec.id} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-xs">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-white text-sm">{rec.item_name}</h4>
                    <span className={`rounded px-2.5 py-0.5 text-[10px] font-bold ${
                      rec.status === 'FLAGGED' ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {rec.status === 'FLAGGED' ? 'RECONCILIATION REQUIRED' : 'RECONCILED'}
                    </span>
                  </div>

                  <div className="mt-3 grid grid-cols-4 gap-2 text-center text-[11px]">
                    <div className="rounded-lg bg-slate-900 p-2 border border-slate-800">
                      <span className="text-slate-400">Warehouse Count</span>
                      <p className="font-bold text-white mt-0.5">{rec.warehouse_qty.toLocaleString()}</p>
                    </div>
                    <div className="rounded-lg bg-slate-900 p-2 border border-slate-800">
                      <span className="text-slate-400">District Report</span>
                      <p className="font-bold text-white mt-0.5">{rec.district_qty.toLocaleString()}</p>
                    </div>
                    <div className="rounded-lg bg-slate-900 p-2 border border-slate-800">
                      <span className="text-slate-400">System Telemetry</span>
                      <p className="font-bold text-cyan-400 mt-0.5">{rec.system_qty.toLocaleString()}</p>
                    </div>
                    <div className="rounded-lg bg-slate-900 p-2 border border-slate-800">
                      <span className="text-slate-400">Variance %</span>
                      <p className={`font-bold mt-0.5 ${rec.variance_pct > 5 ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {rec.variance_pct}%
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 rounded-lg bg-slate-900/60 p-2.5 border border-slate-800 text-[11px] text-slate-300">
                    <span className="font-semibold text-amber-300">Suggested Action:</span> {rec.suggested_resolution}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DATA LINEAGE EXPLORER */}
      {activeTab === 'lineage' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl backdrop-blur-md">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <GitCommit className="h-5 w-5 text-sky-400" />
                Explainable Data Lineage & Provenance Tracker
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Inspect the mathematical provenance behind any platform metric: Source &rarr; Timestamp &rarr; Data Transformation &rarr; Model Architecture &rarr; Output.
              </p>
            </div>

            <div className="mt-6 space-y-4">
              {lineageItems.map((item, idx) => (
                <div key={idx} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5 text-xs">
                  <h4 className="font-bold text-white text-sm text-cyan-300">{item.metric_name}</h4>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div className="rounded-lg bg-slate-900 p-3 border border-slate-800">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">1. Raw Source</span>
                      <p className="mt-1 text-slate-200">{item.source}</p>
                      <span className="text-[10px] text-slate-400 mt-1 block">{item.timestamp}</span>
                    </div>

                    <div className="rounded-lg bg-slate-900 p-3 border border-slate-800">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">2. Transformation</span>
                      <p className="mt-1 text-slate-200">{item.transformation}</p>
                    </div>

                    <div className="rounded-lg bg-slate-900 p-3 border border-slate-800">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">3. AI / ML Model</span>
                      <p className="mt-1 font-mono text-teal-300">{item.model}</p>
                    </div>

                    <div className="rounded-lg bg-slate-900 p-3 border border-slate-800">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">4. Prediction Output</span>
                      <p className="mt-1 font-bold text-emerald-400">{item.prediction_output}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: FACT-CHECK LAYER */}
      {activeTab === 'factcheck' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl backdrop-blur-md">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-400" />
                AI Fact-Checking Layer & Hallucination Guard
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Ensures every executive summary and Copilot assertion is backed by verifiable platform evidence, timestamped telemetry, and bounded confidence intervals.
              </p>
            </div>

            <div className="mt-6 space-y-4">
              {[
                { claim: "Oral Rehydration Salts (ORS) will deplete within 3.2 days at Machilipatnam Coastal PHC.", evidence: "Verified against 1,240 on-hand stock and 280 units/day draw rate.", confidence: "99.4%", timestamp: "Today 11:05 IST", status: "VERIFIED_FACT" },
                { claim: "National Highway 216 is currently impassable for pharmaceutical courier trucks.", evidence: "Verified against NHAI sensor telemetry at Mile 44 (waterlogged 0.8m).", confidence: "98.8%", timestamp: "Today 07:30 IST", status: "VERIFIED_FACT" },
                { claim: "Tenali Urban CHC holds 8,400 units surplus capable of supporting 32 days.", evidence: "Verified against Tenali dispensary barcode scanner audit BATCH-ORS-2024-C2.", confidence: "99.1%", timestamp: "Today 08:45 IST", status: "VERIFIED_FACT" }
              ].map((fact, i) => (
                <div key={i} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{fact.claim}</span>
                    <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                      {fact.status}
                    </span>
                  </div>
                  <p className="mt-2 text-slate-300 text-[11px]"><strong className="text-slate-400">Evidence Basis:</strong> {fact.evidence}</p>
                  <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                    <span>Confidence: <strong className="text-teal-300">{fact.confidence}</strong></span>
                    <span>Timestamp: {fact.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
