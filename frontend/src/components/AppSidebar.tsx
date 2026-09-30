import React from 'react';
import {
  LayoutDashboard, Brain, TrendingUp, Package, Network, AlertTriangle,
  Building2, Pill, Users, Snowflake, Truck,
  Sparkles, Cpu, GitFork, Bot,
  BarChart3, FileText, Bell, Activity, Settings, ShieldCheck,
  ChevronLeft, ChevronRight, Menu
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: string;
  badgeType?: 'warning' | 'critical' | 'neutral';
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

interface AppSidebarProps {
  currentView: string;
  onSelectView: (viewId: string) => void;
  unreadAlertCount?: number;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const NAV_GROUPS: NavGroup[] = [
  {
    title: 'COMMAND CENTER',
    items: [
      { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={18} /> },
      { id: 'intelligence', label: 'Intelligence', icon: <Brain size={18} />, badge: '3 live' },
      { id: 'forecasting', label: 'Forecasting', icon: <TrendingUp size={18} /> },
      { id: 'inventory', label: 'Inventory', icon: <Package size={18} /> },
      { id: 'supply-network', label: 'Supply Network', icon: <Network size={18} /> },
      { id: 'emergency-operations', label: 'Emergency Operations', icon: <AlertTriangle size={18} />, badge: 'Active', badgeType: 'critical' },
    ],
  },
  {
    title: 'RESOURCE MANAGEMENT',
    items: [
      { id: 'hospitals', label: 'Hospitals', icon: <Building2 size={18} /> },
      { id: 'medicines', label: 'Medicines', icon: <Pill size={18} /> },
      { id: 'personnel', label: 'Personnel', icon: <Users size={18} /> },
      { id: 'cold-chain', label: 'Cold Chain', icon: <Snowflake size={18} /> },
      { id: 'suppliers', label: 'Suppliers', icon: <Truck size={18} /> },
    ],
  },
  {
    title: 'AI & SIMULATION',
    items: [
      { id: 'copilot', label: 'Arogya Copilot', icon: <Sparkles size={18} /> },
      { id: 'digital-twin', label: 'Digital Twin', icon: <Cpu size={18} /> },
      { id: 'what-if', label: 'What-If Simulator', icon: <GitFork size={18} /> },
      { id: 'ai-agents', label: 'AI Agents', icon: <Bot size={18} />, badge: '8 idle' },
    ],
  },
  {
    title: 'INSIGHTS',
    items: [
      { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={18} /> },
      { id: 'reports', label: 'Reports', icon: <FileText size={18} /> },
      { id: 'alerts', label: 'Alerts', icon: <Bell size={18} />, badge: '4', badgeType: 'warning' },
      { id: 'model-health', label: 'Model Health', icon: <Activity size={18} /> },
    ],
  },
];

export const AppSidebar: React.FC<AppSidebarProps> = ({
  currentView,
  onSelectView,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  return (
    <aside
      style={{
        width: isCollapsed ? 68 : 250,
        height: '100vh',
        background: 'var(--bg-sidebar)',
        borderRight: '1px solid var(--border-default)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        userSelect: 'none',
        transition: 'width 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        overflow: 'hidden',
      }}
    >
      {/* ── Brand Header with 4-node network symbol (Section 2) ── */}
      <div
        style={{
          padding: isCollapsed ? '16px 14px' : '18px 20px 16px',
          borderBottom: '1px solid var(--border-default)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Minimal 4-node network symbol */}
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: 'var(--color-green-light)',
              border: '1px solid var(--color-green-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <line x1="6" y1="6" x2="18" y2="6" stroke="#0B8F6A" strokeWidth="1.8" />
              <line x1="6" y1="18" x2="18" y2="18" stroke="#0B8F6A" strokeWidth="1.8" />
              <line x1="6" y1="6" x2="6" y2="18" stroke="#0B8F6A" strokeWidth="1.8" />
              <line x1="18" y1="6" x2="18" y2="18" stroke="#0B8F6A" strokeWidth="1.8" />
              <line x1="6" y1="6" x2="18" y2="18" stroke="#0B8F6A" strokeWidth="1.2" strokeDasharray="2 2" />
              <circle cx="6" cy="6" r="2.8" fill="#0B8F6A" />
              <circle cx="18" cy="6" r="2.8" fill="#075E4F" />
              <circle cx="6" cy="18" r="2.8" fill="#075E4F" />
              <circle cx="18" cy="18" r="2.8" fill="#0B8F6A" />
            </svg>
          </div>

          {!isCollapsed && (
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                  AROGYAGRID
                </span>
                <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--color-green)', fontFamily: 'JetBrains Mono' }}>
                  AI
                </span>
              </div>
              <p style={{ fontSize: 10, color: 'var(--text-secondary)', lineHeight: 1.2, marginTop: 1, margin: 0 }}>
                Healthcare Resilience Intelligence
              </p>
            </div>
          )}
        </div>

        {!isCollapsed && onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              padding: 4,
              borderRadius: 4,
            }}
            title="Collapse sidebar"
          >
            <ChevronLeft size={16} />
          </button>
        )}
      </div>

      {/* ── Scrollable Navigation Groups ── */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: isCollapsed ? '14px 6px' : '14px 10px',
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
        }}
      >
        {NAV_GROUPS.map((group) => (
          <div key={group.title}>
            {!isCollapsed && (
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: 'var(--text-muted)',
                  letterSpacing: '0.06em',
                  padding: '0 10px 6px',
                  textTransform: 'uppercase',
                  fontFamily: 'JetBrains Mono, monospace',
                }}
              >
                {group.title}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {group.items.map((item) => {
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectView(item.id)}
                    title={isCollapsed ? item.label : undefined}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: isCollapsed ? 'center' : 'space-between',
                      padding: isCollapsed ? '9px 0' : '8px 10px',
                      borderRadius: 'var(--radius-sm)',
                      background: isActive ? 'var(--color-green-light)' : 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                      position: 'relative',
                      transition: 'all 0.12s ease',
                    }}
                  >
                    {/* Active vertical green indicator (Section 2 Spec) */}
                    {isActive && (
                      <div
                        style={{
                          position: 'absolute',
                          left: 0,
                          top: 4,
                          bottom: 4,
                          width: 3,
                          borderRadius: '0 3px 3px 0',
                          background: 'var(--color-green)',
                        }}
                      />
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginLeft: !isCollapsed && isActive ? 4 : 0 }}>
                      <span
                        style={{
                          color: isActive ? 'var(--color-green)' : 'var(--text-secondary)',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        {item.icon}
                      </span>
                      {!isCollapsed && (
                        <span
                          style={{
                            fontSize: 13,
                            fontWeight: isActive ? 700 : 500,
                            color: isActive ? 'var(--color-green-deep)' : 'var(--text-primary)',
                          }}
                        >
                          {item.label}
                        </span>
                      )}
                    </div>

                    {!isCollapsed && item.badge && (
                      <span
                        style={{
                          fontSize: 9.5,
                          fontWeight: 700,
                          padding: '1px 6px',
                          borderRadius: 4,
                          background:
                            item.badgeType === 'critical'
                              ? 'var(--color-critical-light)'
                              : item.badgeType === 'warning'
                              ? 'var(--color-warning-light)'
                              : '#F1F5F9',
                          color:
                            item.badgeType === 'critical'
                              ? 'var(--color-critical)'
                              : item.badgeType === 'warning'
                              ? 'var(--color-warning)'
                              : 'var(--text-secondary)',
                          fontFamily: 'JetBrains Mono, monospace',
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* ── Footer: Organization, Profile, Settings (Section 2) ── */}
      <div
        style={{
          borderTop: '1px solid var(--border-default)',
          padding: isCollapsed ? '12px 6px' : '12px 14px',
          background: 'var(--bg-surface-elevated)',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        {!isCollapsed ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: 9.5, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'JetBrains Mono' }}>
                  ORGANIZATION
                </span>
                <p style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--text-primary)', marginTop: 1, margin: 0 }}>
                  National Health Authority
                </p>
              </div>
              <button
                onClick={() => onSelectView('settings')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-secondary)',
                  padding: 4,
                  borderRadius: 4,
                }}
                title="Settings"
              >
                <Settings size={15} />
              </button>
            </div>

            {/* Profile Card */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '8px 10px',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: 'var(--color-green-light)',
                  border: '1px solid var(--color-green-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 11,
                  fontWeight: 700,
                  color: 'var(--color-green)',
                }}
              >
                RS
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0 }}>
                  Dr. Rajesh Sharma
                </p>
                <p style={{ fontSize: 10, color: 'var(--text-secondary)', margin: 0 }}>
                  Chief Administrator
                </p>
              </div>
              <ShieldCheck size={14} color="var(--color-green)" />
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
            <button
              onClick={() => onSelectView('settings')}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
              title="Settings"
            >
              <Settings size={16} />
            </button>
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: '50%',
                background: 'var(--color-green-light)',
                border: '1px solid var(--color-green-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 11,
                fontWeight: 700,
                color: 'var(--color-green)',
              }}
              title="Dr. Rajesh Sharma"
            >
              RS
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
