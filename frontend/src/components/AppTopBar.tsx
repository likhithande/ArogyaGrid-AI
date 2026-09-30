import React, { useState } from 'react';
import {
  Search, Bell, Sparkles, ChevronDown, Check,
  Activity, MapPin, Building, Shield, Menu
} from 'lucide-react';

interface AppTopBarProps {
  onOpenCommandPalette: () => void;
  onOpenCopilot: () => void;
  onOpenNotifications?: () => void;
  onToggleSidebar?: () => void;
  currentContext?: GeographicContext;
  onSelectContext?: (ctx: GeographicContext) => void;
}

export type GeographicContext = 'India (National)' | 'Andhra Pradesh (State)' | 'Krishna District (Vijayawada)' | 'Krishna District Hospital' | 'Vijayawada PHC-04';

export const AppTopBar: React.FC<AppTopBarProps> = ({
  onOpenCommandPalette,
  onOpenCopilot,
  onOpenNotifications,
  onToggleSidebar,
  currentContext,
  onSelectContext,
}) => {
  const [internalContext, setInternalContext] = useState<GeographicContext>('Krishna District (Vijayawada)');
  const [isContextDropdownOpen, setIsContextDropdownOpen] = useState(false);

  const context = currentContext || internalContext;

  const handleSelect = (ctx: GeographicContext) => {
    setInternalContext(ctx);
    if (onSelectContext) {
      onSelectContext(ctx);
    }
    setIsContextDropdownOpen(false);
  };

  // Switching hierarchy: India, State, District, Hospital, PHC (Section 3 Spec)
  const contextOptions: { label: GeographicContext; tier: string; sub: string }[] = [
    { label: 'India (National)', tier: 'NATIONAL COMMAND', sub: 'All 28 States · 780 Districts · 24,000 PHCs' },
    { label: 'Andhra Pradesh (State)', tier: 'STATE COMMAND', sub: 'State Health Authority · 26 Districts' },
    { label: 'Krishna District (Vijayawada)', tier: 'DISTRICT COMMAND', sub: 'District Operations Center · 54 Facilities' },
    { label: 'Krishna District Hospital', tier: 'TERTIARY HOSPITAL', sub: '450 Beds · 45 ICU · Referral Node' },
    { label: 'Vijayawada PHC-04', tier: 'PRIMARY HEALTH CENTRE', sub: 'Primary Facility · 4,280 Units Stock' },
  ];

  const getBreadcrumbLabel = () => {
    if (context === 'India (National)') return 'INDIA';
    if (context === 'Andhra Pradesh (State)') return 'INDIA › ANDHRA PRADESH';
    if (context === 'Krishna District (Vijayawada)') return 'INDIA › ANDHRA PRADESH › VIJAYAWADA';
    if (context === 'Krishna District Hospital') return 'ANDHRA PRADESH › VIJAYAWADA › HOSPITAL';
    return 'VIJAYAWADA › PHC-04';
  };

  return (
    <header
      style={{
        height: 52,
        background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-default)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        position: 'sticky',
        top: 0,
        zIndex: 40,
        userSelect: 'none',
      }}
    >
      {/* ── Left: Context Hierarchy Breadcrumbs (Section 3 Spec) ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, position: 'relative' }}>
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              padding: 4,
              borderRadius: 4,
              display: 'flex',
              alignItems: 'center',
            }}
            title="Toggle Sidebar"
          >
            <Menu size={18} />
          </button>
        )}

        {/* Current context breadcrumb switcher */}
        <button
          onClick={() => setIsContextDropdownOpen(!isContextDropdownOpen)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '5px 11px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-default)',
            cursor: 'pointer',
            fontSize: 12,
            fontWeight: 600,
            color: 'var(--text-primary)',
          }}
        >
          <span style={{ color: 'var(--color-green)', display: 'flex', alignItems: 'center' }}>
            <MapPin size={13} />
          </span>
          <span style={{ fontFamily: 'Inter, sans-serif' }}>
            {getBreadcrumbLabel()}
          </span>
          <ChevronDown size={13} style={{ color: 'var(--text-secondary)', marginLeft: 2 }} />
        </button>

        {/* Dropdown for Context Switching: India, State, District, Hospital, PHC */}
        {isContextDropdownOpen && (
          <div
            style={{
              position: 'absolute',
              top: 'calc(100% + 6px)',
              left: 0,
              width: 320,
              background: '#FFFFFF',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-dropdown)',
              padding: 6,
              zIndex: 100,
              animation: 'fadeIn 0.12s ease forwards',
            }}
          >
            <div style={{ padding: '6px 10px', fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'JetBrains Mono' }}>
              Switch Operations Context Hierarchy
            </div>

            {contextOptions.map((opt) => {
              const isSelected = context === opt.label;
              return (
                <button
                  key={opt.label}
                  onClick={() => handleSelect(opt.label)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 10px',
                    borderRadius: 6,
                    background: isSelected ? 'var(--color-green-light)' : 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    marginBottom: 2,
                  }}
                >
                  <div>
                    <span style={{ fontSize: 9.5, fontWeight: 700, color: isSelected ? 'var(--color-green-deep)' : 'var(--text-muted)', fontFamily: 'JetBrains Mono', textTransform: 'uppercase' }}>
                      {opt.tier}
                    </span>
                    <p style={{ fontSize: 12.5, fontWeight: 700, color: isSelected ? 'var(--color-green-deep)' : 'var(--text-primary)', margin: 0 }}>
                      {opt.label}
                    </p>
                    <p style={{ fontSize: 11, color: 'var(--text-secondary)', margin: 0, marginTop: 1 }}>
                      {opt.sub}
                    </p>
                  </div>
                  {isSelected && <Check size={15} color="var(--color-green)" />}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Center: GLOBAL SEARCH with ⌘ K (Section 3 Spec) ── */}
      <div style={{ flex: 1, maxWidth: 460, margin: '0 20px' }}>
        <button
          onClick={onOpenCommandPalette}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '6px 12px',
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            textAlign: 'left',
            color: 'var(--text-secondary)',
            fontSize: 12.5,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Search size={14} color="#64748B" />
            <span>Search medicines, hospitals, districts, alerts...</span>
          </div>
          <kbd
            style={{
              padding: '2px 6px',
              fontSize: 10,
              fontWeight: 700,
              background: '#FFFFFF',
              border: '1px solid var(--border-default)',
              borderRadius: 4,
              color: 'var(--text-secondary)',
              fontFamily: 'JetBrains Mono, monospace',
            }}
          >
            ⌘ K
          </kbd>
        </button>
      </div>

      {/* ── Right: Live System Status, notification icon, AI Copilot, profile (Section 3) ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Live System Status: ● SYSTEM OPERATIONAL (Exact Section 3 Spec) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '4px 10px',
            background: 'var(--color-green-light)',
            border: '1px solid var(--color-green-border)',
            borderRadius: 9999,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: 'var(--color-green)',
            }}
          />
          <span
            style={{
              fontSize: 10.5,
              fontWeight: 800,
              color: 'var(--color-green-deep)',
              letterSpacing: '0.04em',
              fontFamily: 'JetBrains Mono, monospace',
            }}
          >
            SYSTEM OPERATIONAL
          </span>
        </div>

        {/* AI Copilot Quick Launcher */}
        <button
          onClick={onOpenCopilot}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '5px 12px',
            background: 'var(--color-green-light)',
            border: '1px solid var(--color-green-border)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--color-green-deep)',
            fontSize: 12,
            fontWeight: 700,
            cursor: 'pointer',
          }}
          title="Open Arogya Copilot"
        >
          <Sparkles size={13} color="var(--color-green)" />
          <span>Arogya Copilot</span>
        </button>

        {/* Notification Bell */}
        <button
          onClick={onOpenNotifications}
          style={{
            width: 32,
            height: 32,
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-default)',
            background: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            position: 'relative',
          }}
          title="Alerts and Notifications"
        >
          <Bell size={15} />
          <span
            style={{
              position: 'absolute',
              top: 5,
              right: 5,
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: 'var(--color-warning)',
            }}
          />
        </button>

        {/* Profile Avatar */}
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: '50%',
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-default)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 11,
            fontWeight: 700,
            color: 'var(--text-primary)',
          }}
          title="Dr. Rajesh Sharma · Chief Administrator"
        >
          RS
        </div>
      </div>
    </header>
  );
};
