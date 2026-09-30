import React, { useState } from 'react';
import {
  FileText, Download, CheckCircle2, Printer,
  Share2, Shield, Calendar, Building
} from 'lucide-react';

export const ExecutiveReportView: React.FC = () => {
  const [format, setFormat] = useState<'PDF' | 'Excel' | 'Presentation'>('PDF');
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportReady, setReportReady] = useState(true);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setReportReady(true);
    }, 700);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* ── 1. HEADER (Section 15) ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            WEEKLY HEALTHCARE RESILIENCE BRIEF
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>
            Official dossier prepared for the Ministry of Health and Family Welfare (MoHFW) & State Health Directors
          </p>
        </div>

        {/* Format Selectors & Generate Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex', background: '#FFFFFF', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)', padding: 2 }}>
            {(['PDF', 'Excel', 'Presentation'] as const).map((fmt) => (
              <button
                key={fmt}
                onClick={() => setFormat(fmt)}
                style={{
                  padding: '5px 12px',
                  borderRadius: 4,
                  background: format === fmt ? 'var(--color-green-light)' : 'transparent',
                  border: 'none',
                  color: format === fmt ? 'var(--color-green-deep)' : 'var(--text-secondary)',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {fmt}
              </button>
            ))}
          </div>

          <button
            onClick={handleGenerate}
            className="ag-btn-primary"
          >
            <Download size={14} /> {isGenerating ? 'Generating…' : `GENERATE REPORT (${format})`}
          </button>
        </div>
      </div>

      {/* ── 2. REPORT PREVIEW DOCUMENT (Section 15) ── */}
      <div
        className="ag-card"
        style={{
          padding: '32px 40px',
          maxWidth: 960,
          margin: '0 auto',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
          background: '#FFFFFF',
          border: '1px solid var(--border-default)',
        }}
      >
        {/* Document Header */}
        <div style={{ borderBottom: '2px solid #0B8F6A', paddingBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--color-green)', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'JetBrains Mono' }}>
              NATIONAL HEALTH AUTHORITY · MoHFW GOVT OF INDIA
            </span>
            <h2 style={{ fontSize: 20, fontWeight: 900, color: 'var(--text-primary)', marginTop: 4 }}>
              HEALTHCARE NETWORK RESILIENCE BRIEFING
            </h2>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
              Reporting Period: 23 September 2026 – 30 September 2026 · Cycle 39-2026
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span className="ag-badge ag-badge-stable">Resilience Score: 87/100</span>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Classification: Official Medical Use</p>
          </div>
        </div>

        {/* 1. Executive Summary (Section 15) */}
        <div>
          <h3 style={{ fontSize: 14, fontWeight: 800, color: 'var(--color-green-deep)', textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '1px solid var(--border-default)', paddingBottom: 4, marginBottom: 8 }}>
            1. EXECUTIVE SUMMARY
          </h3>
          <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--text-primary)' }}>
            The national public healthcare network maintained a composite resilience index of <strong>87/100 (Stable)</strong> across 694 Primary Health Centres (PHCs) and 51 monitored districts. Early warning surveillance successfully intercepted and mitigated 142 potential stock-out conditions without patient interruption. Elevated surveillance is active along the Bay of Bengal coastline due to pre-landfall severe weather patterns.
          </p>
        </div>

        {/* 2. Critical Risks (Section 15) */}
        <div>
          <h3 style={{ fontSize: 14, fontWeight: 800, color: 'var(--color-green-deep)', textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '1px solid var(--border-default)', paddingBottom: 4, marginBottom: 8 }}>
            2. CRITICAL RISKS
          </h3>
          <ul style={{ paddingLeft: 18, fontSize: 13, lineHeight: 1.7, color: 'var(--text-primary)' }}>
            <li><strong>Amoxicillin 500mg (Krishna District):</strong> Current buffer at 1.8 days of stock due to monsoon respiratory surge. Automated 420-unit transfer from Guntur Central Warehouse approved.</li>
            <li><strong>Insulin Glargine (NTR District):</strong> Cold chain monitoring flagged a +6.8°C excursion at sub-depot unit 3. Auxiliary solar compressor deployed.</li>
            <li><strong>NH-16 Corridor Waterlogging:</strong> Eluru bypass transit delay (+6h). South feeder reroute through Tenali operational.</li>
          </ul>
        </div>

        {/* 3. Supply Network Continuity (Section 15) */}
        <div>
          <h3 style={{ fontSize: 14, fontWeight: 800, color: 'var(--color-green-deep)', textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '1px solid var(--border-default)', paddingBottom: 4, marginBottom: 8 }}>
            3. SUPPLY NETWORK TELEMETRY
          </h3>
          <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--text-primary)' }}>
            Average transit reliability across 32 active corridors was <strong>94.2%</strong>. Inter-facility redistribution latency averaged 1 hour 42 minutes, well within the 4-hour emergency window. Zero critical cold-chain batches experienced viability loss.
          </p>
        </div>

        {/* 4. Medicine Demand Forecast (Section 15) */}
        <div>
          <h3 style={{ fontSize: 14, fontWeight: 800, color: 'var(--color-green-deep)', textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '1px solid var(--border-default)', paddingBottom: 4, marginBottom: 8 }}>
            4. 7-DAY DEMAND FORECAST
          </h3>
          <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--text-primary)' }}>
            Projected demand for essential antibiotics, ORS electrolytes, and antipyretics will peak at +34% above historical averages by 03 October 2026. State central depots have prepositioned 18,400 reserve units.
          </p>
        </div>

        {/* 5. Emergency Readiness (Section 15) */}
        <div>
          <h3 style={{ fontSize: 14, fontWeight: 800, color: 'var(--color-green-deep)', textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '1px solid var(--border-default)', paddingBottom: 4, marginBottom: 8 }}>
            5. EMERGENCY READINESS
          </h3>
          <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--text-primary)' }}>
            Emergency incident posture <strong>AGR-2026-0930 (Cyclone Response)</strong> stands at Stage T-0. Bed occupancy reserves are maintained at 30.6% available headroom across district referral facilities.
          </p>
        </div>

        {/* 6. AI Recommendations (Section 15) */}
        <div style={{ background: 'var(--color-green-light)', border: '1px solid var(--color-green-border)', borderRadius: 8, padding: '14px 16px' }}>
          <h3 style={{ fontSize: 13, fontWeight: 800, color: 'var(--color-green-deep)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6 }}>
            6. SYNTHESIZED AI RECOMMENDATIONS
          </h3>
          <ol style={{ paddingLeft: 18, fontSize: 12.5, lineHeight: 1.6, color: '#064E3B' }}>
            <li>Authorize 800-unit ORS dispatch from Coastal Strategic Warehouse to Machilipatnam PHC.</li>
            <li>Maintain green corridor traffic priority clearance on Tenali feeder route for 48 hours.</li>
            <li>Rebalance pediatric bed allocations at Guntur District Hospital.</li>
          </ol>
        </div>

        {/* Signatures */}
        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-default)', paddingTop: 16, marginTop: 8 }}>
          <div>
            <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>Dr. Rajesh Sharma</p>
            <p style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Chief Health Administrator · National Health Authority</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>ArogyaGrid Autonomous Agent Hub</p>
            <p style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Cryptographically Verified · SHA-256 Audit Seal</p>
          </div>
        </div>
      </div>
    </div>
  );
};
