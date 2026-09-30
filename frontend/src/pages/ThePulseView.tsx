import React, { useState, useCallback, useRef, useEffect } from 'react';
import { NetworkCanvas, NetworkNode, NODES } from '../components/NetworkCanvas';
import {
  Sparkles, X, AlertTriangle, ArrowRight,
  Clock, Eye, Cpu, Shield, Brain, Volume2, VolumeX,
  Split, GitMerge, Layers, Zap, CheckCircle2, ChevronRight, Activity
} from 'lucide-react';
import { Language, Role } from '../types';
import { askCopilot } from '../services/api';
import {
  playApprovalSound, playEmergencySound, playModeTransitionSound,
  playSimulationPulseSound, isSoundEnabled, setSoundEnabled
} from '../services/soundFx';
import { TRANSLATIONS } from '../services/i18n';

export type AppMode = 'observe' | 'predict' | 'intervene';

const TIME_LABELS = ['NOW', '6H', '24H', '72H', '7D', '30D'];

interface ThePulseViewProps {
  mode: AppMode;
  onModeChange: (m: AppMode) => void;
  isEmergency: boolean;
  language: Language;
  currentRole: Role;
  onOpenCopilot: () => void;
  onNavigateToView: (v: string) => void;
  onApproveRedistribution: () => void;
}

export const ThePulseView: React.FC<ThePulseViewProps> = ({
  mode,
  onModeChange,
  isEmergency,
  language,
  currentRole,
  onOpenCopilot,
  onNavigateToView,
  onApproveRedistribution,
}) => {
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);
  const [timeIndex, setTimeIndex] = useState(0);
  const [copilotHighlight, setCopilotHighlight] = useState<string[]>([]);
  const [copilotQuery, setCopilotQuery] = useState('');
  const [copilotResponse, setCopilotResponse] = useState<{ text: string; highlights: string[] } | null>(null);
  const [isCopilotActive, setIsCopilotActive] = useState(false);
  const [isLoadingCopilot, setIsLoadingCopilot] = useState(false);
  const [showApproval, setShowApproval] = useState(false);
  const [showWhyPanel, setShowWhyPanel] = useState(false);

  // Advanced living model toggles (Point 8, 14, 16, 20, 29, 31, 50)
  const [showSplit, setShowSplit] = useState(false);
  const [splitPosition, setSplitPosition] = useState(50);
  const [simulationDemand, setSimulationDemand] = useState(0); // 0, 10, 25, 40, 60
  const [activeScenario, setActiveScenario] = useState<string>('baseline');
  const [zoomLevel, setZoomLevel] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [isFlowMode, setIsFlowMode] = useState(true);
  const [isFederatedMode, setIsFederatedMode] = useState(false);
  const [isAgentConstellation, setIsAgentConstellation] = useState(false);
  const [soundOn, setSoundOn] = useState(false);

  const timelineRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  // Sound toggle handler
  const handleToggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
    if (next) playModeTransitionSound();
  };

  // Timeline interaction (Point 7)
  const handleTimelineClick = (e: React.MouseEvent) => {
    if (!timelineRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const nextIdx = Math.round(pct * (TIME_LABELS.length - 1));
    setTimeIndex(nextIdx);
    playSimulationPulseSound();
    if (nextIdx > 0 && mode === 'observe') {
      onModeChange('predict');
    }
  };

  // Spatial Copilot query (Point 11, 12)
  const handleCopilotQuery = async (query?: string) => {
    const q = query || copilotQuery;
    if (!q.trim()) return;
    setIsLoadingCopilot(true);
    setCopilotQuery('');

    try {
      const response = await askCopilot(q, language, currentRole);
      const highlights: string[] = [];
      const lq = q.toLowerCase();

      if (lq.includes('krishna') || lq.includes('shortage') || lq.includes('risk') || lq.includes('critical')) {
        highlights.push('d-krishna', 'phc-001', 'phc-042', 'd-khammam', 'phc-207');
        setSelectedNode(NODES.find(n => n.id === 'd-krishna') || null);
        setZoomLevel(3);
      } else if (lq.includes('andhra') || lq.includes('ap')) {
        highlights.push('ap-state', 'd-krishna', 'd-guntur', 'd-vizag', 'phc-001', 'phc-042', 'phc-118');
        setZoomLevel(2);
      } else if (lq.includes('warehouse') || lq.includes('supply')) {
        highlights.push('nat-hub', 'wh-coastal', 'wh-dec-central', 'ap-state', 'ts-state');
        setIsFlowMode(true);
      } else if (lq.includes('simulate') || lq.includes('40%') || lq.includes('demand')) {
        setSimulationDemand(40);
        setActiveScenario('flood');
        onModeChange('predict');
      } else if (lq.includes('federated') || lq.includes('privacy') || lq.includes('model')) {
        setIsFederatedMode(true);
      }

      setCopilotResponse({ text: response.answer, highlights });
      setCopilotHighlight(highlights);
    } catch {
      setCopilotResponse({ text: 'Telemetry analysis synchronized with central model.', highlights: [] });
    } finally {
      setIsLoadingCopilot(false);
    }
  };

  const clearCopilot = () => {
    setCopilotResponse(null);
    setCopilotHighlight([]);
    setIsCopilotActive(false);
  };

  const handleSelectNode = useCallback((node: NetworkNode) => {
    setSelectedNode(prev => (prev?.id === node.id ? null : node));
    setCopilotHighlight([]);
  }, []);

  const handleModeChangeWithSound = (m: AppMode) => {
    playModeTransitionSound();
    onModeChange(m);
  };

  const modeColor = {
    observe: '#06B6D4',
    predict: '#818CF8',
    intervene: '#F59E0B',
  }[mode];

  // Living Vitals with dynamic pressure calculation
  const vitals = [
    { label: t.vitals.supplyPressure, value: 72 + (simulationDemand > 0 ? 14 : 0), unit: '/100', status: 'warn', sub: t.vitalSubs.supplySub },
    { label: t.vitals.demandPressure, value: 64 + (simulationDemand > 0 ? simulationDemand : 0), unit: '/100', status: simulationDemand > 25 ? 'crit' : 'warn', sub: t.vitalSubs.demandSub },
    { label: t.vitals.networkResilience, value: Math.max(50, 84 - Math.round(simulationDemand * 0.4)), unit: '/100', status: 'cyan', sub: t.vitalSubs.resilienceSub },
    { label: t.vitals.phcsAtRisk, value: 47 + (simulationDemand > 0 ? 22 : 0), unit: '', status: 'crit', sub: t.vitalSubs.riskSub },
    { label: t.vitals.aiConfidence, value: '93%', unit: '', status: 'ai', sub: t.vitalSubs.confidenceSub },
  ];

  return (
    <div className="ag-canvas" style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* ── Canvas substrate ── */}
      <div className="ag-canvas-grid" />
      <div className="ag-canvas-radial" />
      <div className={`mode-${mode}-overlay`} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', transition: 'background 0.8s ease' }} />

      {/* ── Emergency transformation overlay ── */}
      {isEmergency && (
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 80% 60% at 38% 60%, rgba(239,68,68,0.06) 0%, transparent 70%)',
          transition: 'all 0.5s ease',
        }} />
      )}

      {/* ── THE LIVING HEALTHCARE NETWORK MAP ── */}
      <NetworkCanvas
        mode={mode}
        timeOffset={timeIndex}
        isEmergency={isEmergency}
        onSelectNode={handleSelectNode}
        selectedNodeId={selectedNode?.id ?? null}
        copilotHighlight={copilotHighlight}
        isSplitView={showSplit}
        splitPosition={splitPosition}
        onSplitChange={setSplitPosition}
        simulationDemand={simulationDemand}
        zoomLevel={zoomLevel}
        isFlowMode={isFlowMode}
        isFederatedMode={isFederatedMode}
        isAgentConstellation={isAgentConstellation}
      />

      {/* ═══════════════════════════════════════════
          TOP-LEFT: Three Fundamental Modes & Living Controls
      ═══════════════════════════════════════════ */}
      <div style={{ position: 'absolute', top: 14, left: 14, display: 'flex', flexDirection: 'column', gap: 6, zIndex: 20 }}>
        {/* Mode Selector */}
        <div style={{
          background: 'rgba(4,8,15,0.88)',
          border: `1px solid ${modeColor}25`,
          borderRadius: 14,
          padding: '4px 5px',
          backdropFilter: 'blur(20px)',
          display: 'flex', gap: 3,
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        }}>
          {(['observe', 'predict', 'intervene'] as AppMode[]).map(m => {
            const mc = { observe: '#06B6D4', predict: '#818CF8', intervene: '#F59E0B' }[m];
            const icon = { observe: '◉', predict: '◎', intervene: '◈' }[m];
            const active = mode === m;
            return (
              <button
                key={m}
                onClick={() => handleModeChangeWithSound(m)}
                aria-label={`${m} mode`}
                aria-pressed={active}
                style={{
                  padding: '7px 15px',
                  borderRadius: 10,
                  border: `1px solid ${active ? `${mc}40` : 'transparent'}`,
                  background: active ? `${mc}16` : 'transparent',
                  color: active ? mc : 'rgba(255,255,255,0.35)',
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  cursor: 'pointer',
                  transition: 'all 0.18s ease',
                  fontFamily: 'JetBrains Mono',
                  display: 'flex', alignItems: 'center', gap: 6,
                }}
              >
                <span>{icon}</span>
                {t.modes[m]}
              </button>
            );
          })}
        </div>

        {/* Network Heartbeat + Sound Toggle */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '6px 12px',
          background: 'rgba(4,8,15,0.80)',
          border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: 10,
          backdropFilter: 'blur(12px)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            {/* Heartbeat bars */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 1.5, height: 16 }}>
              {[5, 12, 7, 16, 8, 14, 6, 10, 5, 12, 4, 9].map((h, i) => (
                <div key={i} style={{
                  width: 1.5,
                  height: h,
                  background: isEmergency ? '#EF4444' : '#22D3EE',
                  borderRadius: 1,
                  opacity: 0.7,
                  animation: `heartbeat-bar ${isEmergency ? 0.9 : 1.6}s ease-in-out ${i * 0.05}s infinite`,
                }} />
              ))}
            </div>
            <span style={{ fontSize: 9, fontWeight: 700, color: isEmergency ? '#F87171' : 'rgba(255,255,255,0.35)', fontFamily: 'JetBrains Mono', letterSpacing: '0.08em' }}>
              NETWORK PULSE · {isEmergency ? 'RAPID SURGE' : 'STEADY'}
            </span>
          </div>

          <button
            onClick={handleToggleSound}
            aria-label={soundOn ? 'Mute sound' : 'Enable spatial sound'}
            title={soundOn ? 'Sound: On' : 'Sound: Off'}
            style={{
              background: soundOn ? 'rgba(34,211,238,0.1)' : 'transparent',
              border: `1px solid ${soundOn ? 'rgba(34,211,238,0.3)' : 'rgba(255,255,255,0.06)'}`,
              borderRadius: 6,
              padding: '3px 6px',
              color: soundOn ? '#22D3EE' : 'rgba(255,255,255,0.3)',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 4,
              fontSize: 9, fontFamily: 'JetBrains Mono',
            }}
          >
            {soundOn ? <Volume2 size={12} /> : <VolumeX size={12} />}
            <span>{soundOn ? 'AUDIO' : 'MUTE'}</span>
          </button>
        </div>

        {/* Spatial Feature Toggles: Split Reality, Digital Twin, Flow, Federated, Constellation */}
        <div style={{
          display: 'flex', gap: 4, flexWrap: 'wrap',
          background: 'rgba(4,8,15,0.75)',
          border: '1px solid rgba(255,255,255,0.04)',
          borderRadius: 10, padding: 4,
          backdropFilter: 'blur(12px)',
        }}>
          {/* Split Reality Toggle (Point 8, 21) */}
          <button
            onClick={() => {
              setShowSplit(prev => !prev);
              playModeTransitionSound();
            }}
            style={{
              padding: '4px 8px', borderRadius: 6,
              background: showSplit ? 'rgba(129,140,248,0.18)' : 'transparent',
              border: `1px solid ${showSplit ? '#818CF8' : 'rgba(255,255,255,0.06)'}`,
              color: showSplit ? '#C7D2FE' : 'rgba(255,255,255,0.4)',
              fontSize: 9, fontWeight: 700, fontFamily: 'JetBrains Mono', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 4,
            }}
          >
            <Split size={11} />
            <span>SPLIT REALITY</span>
          </button>

          {/* Flow Mode Toggle (Point 16) */}
          <button
            onClick={() => setIsFlowMode(prev => !prev)}
            style={{
              padding: '4px 8px', borderRadius: 6,
              background: isFlowMode ? 'rgba(6,182,212,0.16)' : 'transparent',
              border: `1px solid ${isFlowMode ? '#06B6D4' : 'rgba(255,255,255,0.06)'}`,
              color: isFlowMode ? '#67E8F9' : 'rgba(255,255,255,0.4)',
              fontSize: 9, fontWeight: 700, fontFamily: 'JetBrains Mono', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 4,
            }}
          >
            <Activity size={11} />
            <span>FLOW MODE</span>
          </button>

          {/* Federated Privacy Toggle (Point 29, 30) */}
          <button
            onClick={() => {
              setIsFederatedMode(prev => !prev);
              playModeTransitionSound();
            }}
            style={{
              padding: '4px 8px', borderRadius: 6,
              background: isFederatedMode ? 'rgba(16,185,129,0.16)' : 'transparent',
              border: `1px solid ${isFederatedMode ? '#10B981' : 'rgba(255,255,255,0.06)'}`,
              color: isFederatedMode ? '#6EE7B7' : 'rgba(255,255,255,0.4)',
              fontSize: 9, fontWeight: 700, fontFamily: 'JetBrains Mono', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 4,
            }}
          >
            <Shield size={11} />
            <span>FEDERATED AI</span>
          </button>

          {/* Agent Constellation Toggle (Point 31) */}
          <button
            onClick={() => setIsAgentConstellation(prev => !prev)}
            style={{
              padding: '4px 8px', borderRadius: 6,
              background: isAgentConstellation ? 'rgba(192,132,252,0.16)' : 'transparent',
              border: `1px solid ${isAgentConstellation ? '#C084FC' : 'rgba(255,255,255,0.06)'}`,
              color: isAgentConstellation ? '#E9D5FF' : 'rgba(255,255,255,0.4)',
              fontSize: 9, fontWeight: 700, fontFamily: 'JetBrains Mono', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 4,
            }}
          >
            <Brain size={11} />
            <span>CONSTELLATION</span>
          </button>
        </div>

        {/* Spatial Detail / Zoom Level (Point 14) */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 2,
          padding: '3px 6px',
          background: 'rgba(4,8,15,0.75)',
          border: '1px solid rgba(255,255,255,0.04)',
          borderRadius: 8,
          backdropFilter: 'blur(10px)',
          width: 'fit-content',
        }}>
          <span style={{ fontSize: 8.5, color: 'rgba(255,255,255,0.3)', fontFamily: 'JetBrains Mono', marginRight: 4 }}>
            LENS:
          </span>
          {[
            { lvl: 1, label: 'L1 NAT' },
            { lvl: 2, label: 'L2 STATE' },
            { lvl: 3, label: 'L3 DIST' },
            { lvl: 4, label: 'L4 PHC' },
          ].map(z => (
            <button
              key={z.lvl}
              onClick={() => {
                setZoomLevel(z.lvl as any);
                playSimulationPulseSound();
              }}
              style={{
                padding: '2px 6px', borderRadius: 4,
                background: zoomLevel === z.lvl ? 'rgba(37,99,235,0.2)' : 'transparent',
                border: `1px solid ${zoomLevel === z.lvl ? 'rgba(37,99,235,0.4)' : 'transparent'}`,
                color: zoomLevel === z.lvl ? '#60A5FA' : 'rgba(255,255,255,0.35)',
                fontSize: 8.5, fontWeight: 700, fontFamily: 'JetBrains Mono', cursor: 'pointer',
              }}
            >
              {z.label}
            </button>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          TOP-RIGHT: Vital Signs (Living System Metrics - Point 22, 36)
      ═══════════════════════════════════════════ */}
      <div style={{
        position: 'absolute', top: 14, right: 14,
        display: 'flex', flexDirection: 'column', gap: 5,
        pointerEvents: 'none', zIndex: 20,
      }}>
        {vitals.map(v => {
          const vColor = v.status === 'crit' ? '#EF4444'
            : v.status === 'warn' ? '#F59E0B'
            : v.status === 'ai' ? '#A5B4FC'
            : '#22D3EE';
          return (
            <div key={v.label} style={{
              background: 'rgba(4,8,15,0.85)',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: 12,
              padding: '8px 14px',
              display: 'flex', alignItems: 'center', gap: 14,
              backdropFilter: 'blur(16px)',
              minWidth: 210,
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            }}>
              <div style={{ flex: 1 }}>
                <p style={{
                  fontSize: 8.5, fontWeight: 700, letterSpacing: '0.10em',
                  textTransform: 'uppercase' as const,
                  color: 'rgba(255,255,255,0.3)', fontFamily: 'JetBrains Mono',
                  marginBottom: 2,
                }}>
                  {v.label}
                </p>
                <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', lineHeight: 1.2 }}>
                  {v.sub}
                </p>
              </div>
              <div style={{ textAlign: 'right', display: 'flex', alignItems: 'baseline', gap: 2 }}>
                <span style={{
                  fontSize: 24, fontWeight: 900, letterSpacing: '-0.04em',
                  color: vColor, fontFamily: 'Inter, sans-serif', lineHeight: 1,
                }}>
                  {v.value}
                </span>
                {v.unit && (
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', fontWeight: 600 }}>
                    {v.unit}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ═══════════════════════════════════════════
          CENTER-BOTTOM: DIGITAL TWIN SIMULATION BAR (Point 20, 26)
      ═══════════════════════════════════════════ */}
      <div style={{
        position: 'absolute', bottom: 78, left: '50%', transform: 'translateX(-50%)',
        zIndex: 25, display: 'flex', alignItems: 'center', gap: 8,
        background: 'rgba(4,8,15,0.92)',
        border: '1px solid rgba(245,158,11,0.22)',
        borderRadius: 14, padding: '6px 14px',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginRight: 8 }}>
          <Cpu size={13} color="#F59E0B" />
          <span style={{ fontSize: 9.5, fontWeight: 800, color: '#FCD34D', fontFamily: 'JetBrains Mono', letterSpacing: '0.08em' }}>
            DIGITAL TWIN SIMULATION:
          </span>
        </div>

        {/* Demand Surge Presets */}
        <div style={{ display: 'flex', gap: 4 }}>
          {[
            { val: 0, label: 'BASELINE' },
            { val: 10, label: '+10%' },
            { val: 25, label: '+25%' },
            { val: 40, label: '+40% MONSOON' },
            { val: 60, label: '+60% FLOOD' },
          ].map(opt => (
            <button
              key={opt.val}
              onClick={() => {
                setSimulationDemand(opt.val);
                playSimulationPulseSound();
              }}
              style={{
                padding: '4px 10px', borderRadius: 7,
                background: simulationDemand === opt.val ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${simulationDemand === opt.val ? '#F59E0B' : 'rgba(255,255,255,0.06)'}`,
                color: simulationDemand === opt.val ? '#FCD34D' : 'rgba(255,255,255,0.45)',
                fontSize: 9.5, fontWeight: 700, fontFamily: 'JetBrains Mono', cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {simulationDemand > 0 && (
          <button
            onClick={() => {
              setSimulationDemand(0);
              playSimulationPulseSound();
            }}
            style={{
              padding: '3px 8px', borderRadius: 5,
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
              color: '#FCA5A5', fontSize: 9, fontWeight: 700, fontFamily: 'JetBrains Mono', cursor: 'pointer',
            }}
          >
            RESET
          </button>
        )}
      </div>

      {/* ═══════════════════════════════════════════
          BOTTOM: TEMPORAL HORIZON SCRUBBER (Point 7)
      ═══════════════════════════════════════════ */}
      <div className="ag-timeline" aria-label="Temporal navigation">
        <span className="ag-timeline-label active" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Clock size={11} />
          {TIME_LABELS[timeIndex]}
        </span>
        <div
          ref={timelineRef}
          className="ag-timeline-track"
          onClick={handleTimelineClick}
          style={{ cursor: 'pointer' }}
          role="slider"
          aria-valuemin={0}
          aria-valuemax={TIME_LABELS.length - 1}
          aria-valuenow={timeIndex}
          aria-label="Time horizon"
        >
          <div className="ag-timeline-progress" style={{ width: `${(timeIndex / (TIME_LABELS.length - 1)) * 100}%` }} />
          <div className="ag-timeline-thumb" style={{ left: `calc(${(timeIndex / (TIME_LABELS.length - 1)) * 100}% - 6px)` }} />
        </div>
        {TIME_LABELS.map((label, i) => (
          <button
            key={label}
            onClick={() => {
              setTimeIndex(i);
              playSimulationPulseSound();
            }}
            aria-label={`Set time to ${label}`}
            style={{
              fontSize: 9, fontWeight: 700, letterSpacing: '0.08em',
              textTransform: 'uppercase' as const,
              color: i === timeIndex ? '#22D3EE' : i < timeIndex ? 'rgba(34,211,238,0.3)' : 'rgba(255,255,255,0.22)',
              background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: 'JetBrains Mono', transition: 'color 0.15s ease',
              padding: '2px 4px',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ═══════════════════════════════════════════
          SPATIAL AROGYA COPILOT (Bottom Right - Point 11, 12)
      ═══════════════════════════════════════════ */}
      <div style={{ position: 'absolute', bottom: 130, right: 14, zIndex: 25, width: 380 }}>
        {copilotResponse && (
          <div style={{
            marginBottom: 8,
            background: 'rgba(4,8,15,0.95)',
            border: '1px solid rgba(129,140,248,0.25)',
            borderRadius: 16, padding: '14px 16px',
            backdropFilter: 'blur(24px)',
            boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
            animation: 'panel-emerge 0.22s ease both',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 8.5, fontWeight: 700, color: '#818CF8', letterSpacing: '0.10em', textTransform: 'uppercase' as const, fontFamily: 'JetBrains Mono' }}>
                ◈ Arogya Copilot · Spatial Intelligence
              </span>
              <button onClick={clearCopilot} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', padding: 0 }}>
                <X size={14} />
              </button>
            </div>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.82)', lineHeight: 1.6 }}>
              {copilotResponse.text}
            </p>
            {copilotResponse.highlights.length > 0 && (
              <p style={{ fontSize: 10.5, color: '#818CF8', marginTop: 8, fontFamily: 'JetBrains Mono' }}>
                ↑ {copilotResponse.highlights.length} healthcare entities illuminated on living network
              </p>
            )}
          </div>
        )}

        {isCopilotActive ? (
          <div style={{
            background: 'rgba(4,8,15,0.96)',
            border: '1px solid rgba(129,140,248,0.3)',
            borderRadius: 16, padding: '10px 12px 10px 16px',
            backdropFilter: 'blur(24px)',
            display: 'flex', alignItems: 'center', gap: 8,
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#818CF8', fontFamily: 'JetBrains Mono' }}>◈</span>
            <input
              ref={inputRef}
              value={copilotQuery}
              onChange={e => setCopilotQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCopilotQuery()}
              placeholder="Ask ArogyaGrid: 'Show shortages in AP'…"
              autoFocus
              style={{
                flex: 1, background: 'transparent', border: 'none', outline: 'none',
                color: 'rgba(255,255,255,0.9)', fontSize: 13, fontFamily: 'Inter, sans-serif',
              }}
            />
            {isLoadingCopilot ? (
              <div style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.1)', borderTopColor: '#818CF8', animation: 'spin 1s linear infinite' }} />
            ) : (
              <button
                onClick={() => handleCopilotQuery()}
                style={{
                  background: '#818CF8', border: 'none', borderRadius: 8,
                  padding: '6px 12px', color: '#fff', cursor: 'pointer',
                  fontSize: 10, fontWeight: 700, fontFamily: 'JetBrains Mono',
                }}
              >
                EXECUTE
              </button>
            )}
            <button onClick={() => setIsCopilotActive(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer' }}>
              <X size={14} />
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 5, flexWrap: 'wrap' }}>
            {[
              'Show shortages in AP',
              'Simulate 40% demand increase',
              'Which districts at risk?',
            ].map(q => (
              <button
                key={q}
                onClick={() => {
                  setIsCopilotActive(true);
                  handleCopilotQuery(q);
                }}
                style={{
                  padding: '5px 11px',
                  background: 'rgba(4,8,15,0.85)',
                  border: '1px solid rgba(129,140,248,0.16)',
                  borderRadius: 9999, color: 'rgba(255,255,255,0.5)',
                  fontSize: 10, cursor: 'pointer',
                  backdropFilter: 'blur(12px)', transition: 'all 0.15s ease',
                }}
              >
                {q}
              </button>
            ))}
            <button
              onClick={() => setIsCopilotActive(true)}
              style={{
                padding: '5px 14px',
                background: 'rgba(129,140,248,0.1)',
                border: '1px solid rgba(129,140,248,0.25)',
                borderRadius: 9999, color: '#A5B4FC',
                fontSize: 10, fontWeight: 700, cursor: 'pointer',
                backdropFilter: 'blur(12px)', fontFamily: 'JetBrains Mono',
                letterSpacing: '0.06em',
              }}
            >
              ◈ ASK COPILOT
            </button>
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════
          CONTEXTUAL INTELLIGENCE PANEL (Point 13, 61-64)
      ═══════════════════════════════════════════ */}
      {selectedNode && !showApproval && !showWhyPanel && (
        <ContextPanel
          node={selectedNode}
          mode={mode}
          simulationDemand={simulationDemand}
          language={language}
          onClose={() => setSelectedNode(null)}
          onNavigate={onNavigateToView}
          onOpenApproval={() => setShowApproval(true)}
          onOpenWhy={() => setShowWhyPanel(true)}
          onWhatsNext={() => handleModeChangeWithSound('intervene')}
          onWhatIf={() => {
            handleModeChangeWithSound('predict');
            setSimulationDemand(25);
          }}
        />
      )}

      {/* ── Why Panel (Causal factor attribution - Point 61) ── */}
      {showWhyPanel && (
        <WhyPanel
          node={selectedNode || NODES.find(n => n.id === 'd-krishna')!}
          onClose={() => setShowWhyPanel(false)}
        />
      )}

      {/* ── Human Approval Decision Surface (Point 28) ── */}
      {showApproval && (
        <ApprovalSurface
          onApprove={() => {
            setShowApproval(false);
            playApprovalSound();
            onApproveRedistribution();
            setCopilotResponse({
              text: 'HUMAN APPROVAL GRANTED: 800 units ORS dispatched from Coastal Strategic Warehouse to PHC-001 Machilipatnam. Real-time GPS tracking initialized. Projected ETA: 12 Hours.',
              highlights: ['wh-coastal', 'phc-001'],
            });
            setCopilotHighlight(['wh-coastal', 'phc-001']);
          }}
          onReject={() => setShowApproval(false)}
          onSimulate={() => {
            setShowApproval(false);
            setSimulationDemand(25);
            onModeChange('predict');
          }}
        />
      )}
    </div>
  );
};

/* ══════════════════════════════════════════
   CONTEXTUAL INTELLIGENCE PANEL (Point 13, 61-64)
══════════════════════════════════════════ */
const ContextPanel: React.FC<{
  node: NetworkNode;
  mode: AppMode;
  simulationDemand: number;
  language: Language;
  onClose: () => void;
  onNavigate: (v: string) => void;
  onOpenApproval: () => void;
  onOpenWhy: () => void;
  onWhatsNext: () => void;
  onWhatIf: () => void;
}> = ({ node, mode, simulationDemand, language, onClose, onNavigate, onOpenApproval, onOpenWhy, onWhatsNext, onWhatIf }) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const press = Math.min(100, Math.round(node.pressure + (simulationDemand > 0 ? simulationDemand * 0.45 : 0)));
  const statusColor = press > 80 ? '#EF4444' : press > 55 ? '#F59E0B' : '#06B6D4';
  const statusText = press > 80 ? 'CRITICAL RISK' : press > 55 ? 'PRESSURE ELEVATED' : 'OPERATIONAL';

  const typeMap: Record<string, string> = {
    national: 'National Distribution Hub',
    state: 'State Strategic Warehouse',
    district: 'District Health Command',
    phc: 'Primary Health Centre (PHC)',
    warehouse: 'Regional Strategic Buffer',
    supplier: 'Pharmaceutical Supplier',
  };

  return (
    <div className="ag-context-panel" style={{ zIndex: 50 }}>
      {/* Header */}
      <div className="ag-context-panel-header">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.3)', fontFamily: 'JetBrains Mono' }}>
              {typeMap[node.type]}
            </span>
            <h3 style={{ fontSize: 17, fontWeight: 800, color: '#F8FAFC', letterSpacing: '-0.02em', marginTop: 3 }}>
              {node.label}
            </h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', padding: 0 }}>
            <X size={16} />
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
          <span style={{
            fontSize: 8.5, fontWeight: 700, letterSpacing: '0.08em', padding: '3px 8px', borderRadius: 5,
            background: `${statusColor}14`, color: statusColor, border: `1px solid ${statusColor}30`, fontFamily: 'JetBrains Mono',
          }}>
            {statusText}
          </span>
          {node.hasFutureSignal && (
            <span style={{
              fontSize: 8.5, fontWeight: 700, letterSpacing: '0.06em', padding: '3px 8px', borderRadius: 5,
              background: 'rgba(129,140,248,0.1)', color: '#A5B4FC', border: '1px solid rgba(129,140,248,0.22)', fontFamily: 'JetBrains Mono',
            }}>
              {node.signalLabel}
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="ag-context-panel-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Inventory Pressure Gauge */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.10em', textTransform: 'uppercase' as const, fontFamily: 'JetBrains Mono' }}>
              Inventory Stress Index
            </span>
            <span style={{ fontSize: 13, fontWeight: 800, color: statusColor, fontFamily: 'JetBrains Mono' }}>
              {press}/100
            </span>
          </div>
          <div style={{ height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ height: '100%', borderRadius: 2, background: statusColor, width: `${press}%`, transition: 'width 0.6s ease' }} />
          </div>
        </div>

        {/* Key Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
          {[
            { label: 'ORS Stock', value: `${node.orsStock?.toLocaleString() || 850} pkts`, warn: press > 70 },
            { label: 'Stockout Horizon', value: `${node.daysToStockout || 2.5} Days`, warn: (node.daysToStockout || 5) < 3 },
            { label: 'Bed Utilization', value: `${72 + Math.round(press * 0.2)}%`, warn: press > 70 },
            { label: 'Personnel', value: '94% On-Duty', warn: false },
          ].map(({ label, value, warn }) => (
            <div key={label} style={{ padding: '8px 10px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: 8 }}>
              <p style={{ fontSize: 8.5, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' as const, letterSpacing: '0.08em', fontFamily: 'JetBrains Mono', marginBottom: 3 }}>
                {label}
              </p>
              <p style={{ fontSize: 13, fontWeight: 700, color: warn ? '#F59E0B' : 'rgba(255,255,255,0.8)', fontFamily: 'JetBrains Mono' }}>
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* AI Signal */}
        <div style={{ padding: '10px 12px', background: 'rgba(129,140,248,0.05)', border: '1px solid rgba(129,140,248,0.16)', borderRadius: 10, borderLeft: '3px solid #818CF8' }}>
          <p style={{ fontSize: 8.5, fontWeight: 700, color: '#818CF8', letterSpacing: '0.10em', textTransform: 'uppercase' as const, fontFamily: 'JetBrains Mono', marginBottom: 4 }}>
            ◈ AI Autonomous Signal
          </p>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>
            {press > 80
              ? 'Critical depletion trajectory detected within 48h. Coastal rainfall + NH-16 transit delays amplify stockout probability to 91%.'
              : 'Network demand expanding steadily. Reorder triggers active.'}
          </p>
        </div>

        {/* The Three Questions Framework: WHY? / WHAT IF? / WHAT NEXT? (Point 61-64) */}
        <div style={{ display: 'flex', gap: 6 }}>
          <button onClick={onOpenWhy} className="ag-why-btn ag-why-btn-why" style={{ flex: 1, textAlign: 'center' }}>
            {t.threeQuestions.why}
          </button>
          <button onClick={onWhatIf} className="ag-why-btn ag-why-btn-whatif" style={{ flex: 1, textAlign: 'center' }}>
            {t.threeQuestions.whatIf}
          </button>
          <button onClick={onWhatsNext} className="ag-why-btn ag-why-btn-whatnext" style={{ flex: 1, textAlign: 'center' }}>
            {t.threeQuestions.whatNext}
          </button>
        </div>

        {/* Action Button */}
        {press > 60 && (
          <button
            onClick={onOpenApproval}
            style={{
              width: '100%', padding: '9px 0', borderRadius: 9,
              background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.28)',
              color: '#4ADE80', fontSize: 10.5, fontWeight: 700, cursor: 'pointer',
              fontFamily: 'JetBrains Mono', letterSpacing: '0.05em',
            }}
          >
            ◉ REVIEW AI REDISTRIBUTION PROPOSAL
          </button>
        )}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════
   WHY PANEL — Causal Factor Attribution (Point 33, 61)
══════════════════════════════════════════ */
const WhyPanel: React.FC<{ node: NetworkNode; onClose: () => void }> = ({ node, onClose }) => {
  const factors = [
    { label: 'Monsoon Influx Surge', pct: 34, color: '#EF4444' },
    { label: 'Inventory Depletion Velocity', pct: 28, color: '#F59E0B' },
    { label: 'Supplier Lead Time Delay (+2d)', pct: 22, color: '#F97316' },
    { label: 'Seasonal Enteric Pattern', pct: 16, color: '#818CF8' },
  ];

  return (
    <div className="ag-context-panel" style={{ zIndex: 60 }}>
      <div className="ag-context-panel-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: 8.5, fontWeight: 700, color: '#818CF8', letterSpacing: '0.12em', textTransform: 'uppercase' as const, fontFamily: 'JetBrains Mono' }}>
              ◈ CAUSAL REASONING LAYER
            </span>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#F8FAFC', marginTop: 4, letterSpacing: '-0.02em' }}>
              Why is this node under pressure?
            </h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer' }}>
            <X size={16} />
          </button>
        </div>
        <p style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.45)', marginTop: 4 }}>
          Target: <strong style={{ color: '#fff' }}>{node.label}</strong> — XAI Shapley Decomposition
        </p>
      </div>

      <div className="ag-context-panel-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ padding: '12px 14px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.18)', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 36, fontWeight: 900, color: '#EF4444', fontFamily: 'Inter', lineHeight: 1 }}>HIGH</span>
          <div>
            <p style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.35)', fontFamily: 'JetBrains Mono', textTransform: 'uppercase' as const, letterSpacing: '0.10em' }}>
              Projected Stockout Window
            </p>
            <p style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.65)', marginTop: 2 }}>
              Zero ORS buffer reached in 48 hours without intervention.
            </p>
          </div>
        </div>

        <div>
          <p style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.12em', textTransform: 'uppercase' as const, fontFamily: 'JetBrains Mono', marginBottom: 10 }}>
            Contributing Signals
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {factors.map(f => (
              <div key={f.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)' }}>{f.label}</span>
                  <span style={{ fontSize: 12, fontWeight: 800, color: f.color, fontFamily: 'JetBrains Mono' }}>{f.pct}%</span>
                </div>
                <div style={{ height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${f.pct}%`, background: f.color, borderRadius: 2 }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: '10px 12px', background: 'rgba(129,140,248,0.05)', border: '1px solid rgba(129,140,248,0.14)', borderRadius: 10 }}>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>
            Verified against 36-month seasonal history. Explanations conform to Explainable AI (XAI) transparent weight attribution guidelines.
          </p>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════
   HUMAN APPROVAL SURFACE (Point 28)
══════════════════════════════════════════ */
const ApprovalSurface: React.FC<{
  onApprove: () => void;
  onReject: () => void;
  onSimulate: () => void;
}> = ({ onApprove, onReject, onSimulate }) => (
  <div className="ag-approval-surface">
    <div className="ag-approval-card">
      <div style={{ padding: '22px 28px 18px', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(245,158,11,0.03)' }}>
        <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#F59E0B', fontFamily: 'JetBrains Mono' }}>
          ◈ AI Intervention Proposal · Human Verification Required
        </span>
        <h2 style={{ fontSize: 22, fontWeight: 900, color: '#F8FAFC', letterSpacing: '-0.03em', marginTop: 8 }}>
          Emergency Stock Redistribution
        </h2>
      </div>

      <div style={{ padding: '22px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22 }}>
          <div style={{ flex: 1, padding: '14px 16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12, textAlign: 'center' }}>
            <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', fontFamily: 'JetBrains Mono', letterSpacing: '0.08em', marginBottom: 5 }}>SOURCE HUB</p>
            <p style={{ fontSize: 15, fontWeight: 700, color: '#F8FAFC' }}>Coastal Strategic WH</p>
            <p style={{ fontSize: 11, color: '#22D3EE', marginTop: 3 }}>ORS · 12,500 surplus units</p>
          </div>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ArrowRight size={16} color="#FCD34D" />
          </div>
          <div style={{ flex: 1, padding: '14px 16px', background: 'rgba(239,68,68,0.03)', border: '1px solid rgba(239,68,68,0.14)', borderRadius: 12, textAlign: 'center' }}>
            <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', fontFamily: 'JetBrains Mono', letterSpacing: '0.08em', marginBottom: 5 }}>DESTINATION</p>
            <p style={{ fontSize: 15, fontWeight: 700, color: '#F8FAFC' }}>PHC-001 Machilipatnam</p>
            <p style={{ fontSize: 11, color: '#EF4444', marginTop: 3 }}>CRITICAL · 48H Stockout</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 22 }}>
          {[
            { label: 'Transfer Volume', value: '800 Units', sub: 'ORS Powder packets' },
            { label: 'Transit Time', value: '12 Hours', sub: 'Via NH-16 green corridor' },
            { label: 'Post-Impact', value: 'MODERATE', sub: 'Extends buffer by 14 days' },
          ].map(({ label, value, sub }) => (
            <div key={label} style={{ padding: '12px 14px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: 10, textAlign: 'center' }}>
              <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', fontFamily: 'JetBrains Mono', letterSpacing: '0.08em', marginBottom: 4 }}>{label}</p>
              <p style={{ fontSize: 17, fontWeight: 900, color: '#F8FAFC', letterSpacing: '-0.02em', fontFamily: 'Inter' }}>{value}</p>
              <p style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.4)', marginTop: 3 }}>{sub}</p>
            </div>
          ))}
        </div>

        <div style={{ padding: '12px 14px', background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.16)', borderRadius: 10, marginBottom: 22 }}>
          <p style={{ fontSize: 9, fontWeight: 700, color: '#4ADE80', fontFamily: 'JetBrains Mono', letterSpacing: '0.10em', marginBottom: 4 }}>
            SIMULATED IMPACT PROJECTION
          </p>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', lineHeight: 1.55 }}>
            Stockout risk drops from <strong style={{ color: '#EF4444' }}>95% (CRITICAL)</strong> to <strong style={{ color: '#4ADE80' }}>22% (STABLE)</strong>. No stock deficit induced at Coastal Warehouse.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 1fr', gap: 8 }}>
          <button
            onClick={onApprove}
            style={{
              padding: '11px 0', borderRadius: 10,
              background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.35)',
              color: '#4ADE80', fontSize: 11, fontWeight: 800, cursor: 'pointer',
              fontFamily: 'JetBrains Mono', letterSpacing: '0.05em',
            }}
          >
            APPROVE & DISPATCH
          </button>
          <button
            onClick={onSimulate}
            style={{
              padding: '11px 0', borderRadius: 10,
              background: 'rgba(129,140,248,0.08)', border: '1px solid rgba(129,140,248,0.22)',
              color: '#A5B4FC', fontSize: 11, fontWeight: 700, cursor: 'pointer',
              fontFamily: 'JetBrains Mono',
            }}
          >
            SIMULATE
          </button>
          <button
            style={{
              padding: '11px 0', borderRadius: 10,
              background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.22)',
              color: '#FCD34D', fontSize: 11, fontWeight: 700, cursor: 'pointer',
              fontFamily: 'JetBrains Mono',
            }}
          >
            MODIFY
          </button>
          <button
            onClick={onReject}
            style={{
              padding: '11px 0', borderRadius: 10,
              background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.18)',
              color: '#FCA5A5', fontSize: 11, fontWeight: 700, cursor: 'pointer',
              fontFamily: 'JetBrains Mono',
            }}
          >
            REJECT
          </button>
        </div>
      </div>
    </div>
  </div>
);
