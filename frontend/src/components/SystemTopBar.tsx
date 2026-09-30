import React, { useState } from 'react';
import { AlertTriangle, Globe2, Moon, Sun, Settings, ChevronDown } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { Role, Language } from '../types';
import { AppMode } from '../pages/ThePulseView';

interface SystemTopBarProps {
  currentRole: Role;
  onRoleChange: (role: Role) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  darkMode: boolean;
  onToggleTheme: () => void;
  isEmergency: boolean;
  mode: AppMode;
  onNavigate: (v: string) => void;
}

const ROLES: Role[] = [
  'National Health Administrator',
  'State Health Administrator',
  'District Health Officer',
  'PHC Administrator',
  'Supply Chain Manager',
  'Emergency Response Coordinator',
  'Data/AI Analyst',
];

const LANGS: { code: Language; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'hi', label: 'HI' },
  { code: 'te', label: 'TE' },
];

const MODE_COLORS: Record<AppMode, string> = {
  observe: '#06B6D4',
  predict: '#818CF8',
  intervene: '#F59E0B',
};

export const SystemTopBar: React.FC<SystemTopBarProps> = ({
  currentRole,
  onRoleChange,
  language,
  onLanguageChange,
  darkMode,
  onToggleTheme,
  isEmergency,
  mode,
  onNavigate,
}) => {
  const [roleOpen, setRoleOpen] = useState(false);
  const modeCol = MODE_COLORS[mode];

  return (
    <header className="ag-topbar" role="banner" aria-label="ArogyaGrid AI system header">

      {/* ── Left: Brand ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <BrandLogo />

        {/* Mode indicator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 5,
          padding: '3px 10px',
          borderRadius: 9999,
          background: `${modeCol}12`,
          border: `1px solid ${modeCol}28`,
        }}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: modeCol }} />
          <span style={{
            fontSize: 9.5, fontWeight: 700, letterSpacing: '0.09em',
            textTransform: 'uppercase', color: modeCol,
            fontFamily: 'JetBrains Mono',
          }}>
            {mode} mode
          </span>
        </div>
      </div>

      {/* ── Center: Emergency indicator ── */}
      {isEmergency && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '4px 14px',
          borderRadius: 9999,
          background: 'rgba(239,68,68,0.1)',
          border: '1px solid rgba(239,68,68,0.25)',
          animation: 'emergency-pulse 2.5s ease-in-out infinite',
        }}>
          <AlertTriangle size={13} color="#EF4444" />
          <span style={{ fontSize: 10, fontWeight: 700, color: '#EF4444', letterSpacing: '0.08em', fontFamily: 'JetBrains Mono' }}>
            MONSOON EMERGENCY · FLOOD-2026 · ACTIVE
          </span>
          <button
            onClick={() => onNavigate('incident-room')}
            style={{
              fontSize: 9.5, fontWeight: 700, color: '#FCA5A5', cursor: 'pointer',
              background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: 4, padding: '2px 7px', fontFamily: 'JetBrains Mono',
            }}
          >
            WAR ROOM →
          </button>
        </div>
      )}

      {/* ── Right: Controls ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>

        {/* Language switcher */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          padding: '2px 3px',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 8,
        }}>
          {LANGS.map(l => (
            <button
              key={l.code}
              onClick={() => onLanguageChange(l.code)}
              style={{
                padding: '3px 8px',
                borderRadius: 5,
                background: language === l.code ? 'rgba(255,255,255,0.1)' : 'transparent',
                border: 'none',
                color: language === l.code ? '#F1F5F9' : 'rgba(255,255,255,0.3)',
                fontSize: 10.5,
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'JetBrains Mono',
                transition: 'all 0.15s ease',
                letterSpacing: '0.05em',
              }}
              aria-label={`Switch to ${l.label}`}
            >
              {l.label}
            </button>
          ))}
        </div>

        {/* Theme toggle */}
        <button
          onClick={onToggleTheme}
          aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          style={{
            width: 30, height: 30, borderRadius: 8,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.07)',
            color: 'rgba(255,255,255,0.4)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.15s ease',
          }}
        >
          {darkMode ? <Sun size={14} /> : <Moon size={14} />}
        </button>

        {/* Settings */}
        <button
          onClick={() => onNavigate('settings')}
          aria-label="Settings"
          style={{
            width: 30, height: 30, borderRadius: 8,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.07)',
            color: 'rgba(255,255,255,0.4)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Settings size={14} />
        </button>

        {/* Role selector */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setRoleOpen(!roleOpen)}
            aria-label="Switch role"
            aria-expanded={roleOpen}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '5px 10px 5px 12px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 9,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <div style={{
              width: 6, height: 6, borderRadius: '50%', background: '#22C55E',
              boxShadow: '0 0 6px rgba(34,197,94,0.6)',
              animation: 'live-pulse 2s ease-in-out infinite',
            }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.7)', maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {currentRole}
            </span>
            <ChevronDown size={12} style={{ color: 'rgba(255,255,255,0.3)', transform: roleOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s ease' }} />
          </button>

          {roleOpen && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 6px)',
              right: 0,
              width: 240,
              background: 'rgba(10,18,32,0.98)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 12,
              boxShadow: '0 16px 40px rgba(0,0,0,0.6)',
              overflow: 'hidden',
              zIndex: 200,
              backdropFilter: 'blur(20px)',
              animation: 'panel-emerge 0.18s ease both',
            }}>
              <div style={{ padding: '8px 4px' }}>
                {ROLES.map(r => (
                  <button
                    key={r}
                    onClick={() => { onRoleChange(r); setRoleOpen(false); }}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      background: r === currentRole ? 'rgba(37,99,235,0.12)' : 'transparent',
                      border: 'none',
                      borderRadius: 7,
                      color: r === currentRole ? '#60A5FA' : 'rgba(255,255,255,0.6)',
                      fontSize: 12,
                      fontWeight: r === currentRole ? 700 : 500,
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.12s ease',
                    }}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
