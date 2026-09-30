import React, { useState } from 'react';
import {
  Globe2, Brain, TrendingUp, Cpu, AlertTriangle, Sparkles,
  Search, Activity, ChevronRight, Command
} from 'lucide-react';
import { AppMode } from '../pages/ThePulseView';

interface DockItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  mode?: AppMode;
  viewId?: string;
  modeClass: string;
  badge?: string;
  badgeColor?: string;
}

interface FloatingDockProps {
  activeView: string;
  mode: AppMode;
  isEmergency: boolean;
  onSelectView: (v: string) => void;
  onModeChange: (m: AppMode) => void;
  onOpenCopilot: () => void;
  onOpenCommandPalette: () => void;
}

const DOCK_ITEMS: DockItem[] = [
  {
    id: 'pulse',
    icon: <Activity size={20} strokeWidth={1.8} />,
    label: 'THE PULSE',
    viewId: 'overview',
    modeClass: 'mode-observe',
  },
  {
    id: 'intelligence',
    icon: <Brain size={20} strokeWidth={1.8} />,
    label: 'INTELLIGENCE',
    viewId: 'stockout',
    modeClass: 'mode-predict',
  },
  {
    id: 'supply',
    icon: <Globe2 size={20} strokeWidth={1.8} />,
    label: 'SUPPLY',
    viewId: 'supply-chain',
    modeClass: 'mode-observe',
  },
  {
    id: 'simulate',
    icon: <Cpu size={20} strokeWidth={1.8} />,
    label: 'SIMULATE',
    viewId: 'simulation',
    modeClass: 'mode-intervene',
  },
  {
    id: 'emergency',
    icon: <AlertTriangle size={20} strokeWidth={1.8} />,
    label: 'EMERGENCY',
    viewId: 'incident-room',
    modeClass: 'mode-emergency',
    badge: 'LIVE',
    badgeColor: '#EF4444',
  },
  {
    id: 'ai',
    icon: <Sparkles size={20} strokeWidth={1.8} />,
    label: 'AI',
    viewId: 'agents',
    modeClass: 'mode-predict',
  },
];

export const FloatingDock: React.FC<FloatingDockProps> = ({
  activeView,
  mode,
  isEmergency,
  onSelectView,
  onModeChange,
  onOpenCopilot,
  onOpenCommandPalette,
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const getModeColor = (item: DockItem): string => {
    if (item.modeClass === 'mode-emergency') return '#EF4444';
    if (item.modeClass === 'mode-predict') return '#818CF8';
    if (item.modeClass === 'mode-intervene') return '#F59E0B';
    return '#06B6D4';
  };

  return (
    <div className="ag-dock" role="navigation" aria-label="Primary navigation">

      {/* ── Main Nav Items ── */}
      {DOCK_ITEMS.map((item) => {
        const isActive = activeView === item.viewId;
        const isHovered = hoveredId === item.id;
        const col = getModeColor(item);

        return (
          <div key={item.id} style={{ position: 'relative' }}>
            {/* Tooltip */}
            {isHovered && (
              <div style={{
                position: 'absolute',
                bottom: '100%',
                left: '50%',
                transform: 'translateX(-50%)',
                marginBottom: 8,
                padding: '4px 10px',
                background: 'rgba(4,8,15,0.95)',
                border: `1px solid ${col}30`,
                borderRadius: 6,
                fontSize: 10,
                fontWeight: 700,
                color: col,
                letterSpacing: '0.08em',
                fontFamily: 'JetBrains Mono',
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
                zIndex: 200,
              }}>
                {item.label}
              </div>
            )}

            <button
              onClick={() => {
                if (item.viewId) onSelectView(item.viewId);
                if (item.mode) onModeChange(item.mode);
              }}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
              className={`ag-dock-item ${item.modeClass} ${isActive ? 'active' : ''}`}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              {/* Icon */}
              <span
                className="ag-dock-icon"
                style={{
                  color: isActive ? col : isHovered ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.35)',
                  transition: 'color 0.18s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {item.icon}
              </span>

              {/* Badge (emergency indicator) */}
              {item.badge && (
                <span style={{
                  position: 'absolute',
                  top: 4,
                  right: 6,
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: item.badgeColor,
                  boxShadow: `0 0 6px ${item.badgeColor}`,
                  animation: 'live-pulse 2s ease-in-out infinite',
                }} />
              )}

              {/* Label */}
              <span className="ag-dock-label" style={{
                color: isActive ? col : 'rgba(255,255,255,0.3)',
              }}>
                {item.label}
              </span>
            </button>
          </div>
        );
      })}

      {/* ── Separator ── */}
      <div className="ag-dock-separator" />

      {/* ── Search / Command Palette ── */}
      <button
        onClick={onOpenCommandPalette}
        onMouseEnter={() => setHoveredId('search')}
        onMouseLeave={() => setHoveredId(null)}
        className="ag-dock-item"
        aria-label="Command palette (Ctrl+K)"
        title="Ctrl+K"
        style={{ position: 'relative' }}
      >
        {hoveredId === 'search' && (
          <div style={{
            position: 'absolute',
            bottom: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            marginBottom: 8,
            padding: '4px 10px',
            background: 'rgba(4,8,15,0.95)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 6,
            fontSize: 10,
            fontWeight: 700,
            color: 'rgba(255,255,255,0.5)',
            letterSpacing: '0.06em',
            fontFamily: 'JetBrains Mono',
            whiteSpace: 'nowrap',
            display: 'flex',
            gap: 6,
            alignItems: 'center',
          }}>
            <span>SEARCH</span>
            <span style={{
              padding: '1px 5px',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 3,
              fontSize: 9,
            }}>
              ⌘K
            </span>
          </div>
        )}
        <span className="ag-dock-icon" style={{ color: hoveredId === 'search' ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Search size={18} strokeWidth={1.8} />
        </span>
        <span className="ag-dock-label">SEARCH</span>
      </button>

      {/* ── Copilot ── */}
      <button
        onClick={onOpenCopilot}
        onMouseEnter={() => setHoveredId('copilot')}
        onMouseLeave={() => setHoveredId(null)}
        className="ag-dock-item"
        aria-label="Open Arogya Copilot"
        style={{ position: 'relative' }}
      >
        {hoveredId === 'copilot' && (
          <div style={{
            position: 'absolute',
            bottom: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            marginBottom: 8,
            padding: '4px 10px',
            background: 'rgba(4,8,15,0.95)',
            border: '1px solid rgba(129,140,248,0.3)',
            borderRadius: 6,
            fontSize: 10,
            fontWeight: 700,
            color: '#A5B4FC',
            letterSpacing: '0.08em',
            fontFamily: 'JetBrains Mono',
            whiteSpace: 'nowrap',
          }}>
            AROGYA COPILOT
          </div>
        )}
        <span className="ag-dock-icon" style={{ color: hoveredId === 'copilot' ? '#A5B4FC' : 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <Sparkles size={18} strokeWidth={1.8} />
          <span style={{
            position: 'absolute',
            top: -3,
            right: -3,
            width: 5,
            height: 5,
            borderRadius: '50%',
            background: '#818CF8',
            animation: 'ai-signal-pulse 2s ease-in-out infinite',
          }} />
        </span>
        <span className="ag-dock-label">COPILOT</span>
      </button>
    </div>
  );
};
