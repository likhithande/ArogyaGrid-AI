import React, { useState, useEffect, useRef } from 'react';
import {
  Search, LayoutDashboard, Brain, TrendingUp, Package, Network,
  AlertTriangle, Building2, Pill, Users, Snowflake, Truck,
  Sparkles, Cpu, GitFork, Bot, BarChart3, FileText, Bell,
  Activity, Settings, X, ArrowRight, CornerDownLeft
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (viewId: string) => void;
  onOpenCopilot: () => void;
}

interface CommandItem {
  id: string;
  label: string;
  category: string;
  description: string;
  icon: React.ReactNode;
  badge?: string;
  badgeType?: 'critical' | 'warning' | 'stable';
  action?: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onOpenCopilot,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commandItems: CommandItem[] = [
    // Command Center
    { id: 'overview', label: 'Command Center Overview', category: 'COMMAND CENTER', description: 'National healthcare resilience index and operations map', icon: <LayoutDashboard size={16} /> },
    { id: 'intelligence', label: 'Intelligence Stream', category: 'COMMAND CENTER', description: 'Autonomous surveillance alerts and anomaly stream', icon: <Brain size={16} />, badge: '3 live' },
    { id: 'forecasting', label: 'Demand Forecasting', category: 'COMMAND CENTER', description: 'AI projected medicine consumption and causal drivers', icon: <TrendingUp size={16} /> },
    { id: 'inventory', label: 'Inventory Intelligence', category: 'COMMAND CENTER', description: 'FEFO expiry sequencing and facility stock levels', icon: <Package size={16} /> },
    { id: 'supply-network', label: 'Supply Network', category: 'COMMAND CENTER', description: 'Transit corridors, transit times, and route reliability', icon: <Network size={16} /> },
    { id: 'emergency-operations', label: 'Emergency Operations', category: 'COMMAND CENTER', description: 'Crisis command, landfall timeline, and surge rosters', icon: <AlertTriangle size={16} />, badge: 'Incident Active', badgeType: 'critical' },

    // Resource Management
    { id: 'hospitals', label: 'Hospitals & Beds', category: 'RESOURCE MANAGEMENT', description: 'ICU headroom, bed occupancy, and facility status', icon: <Building2 size={16} /> },
    { id: 'medicines', label: 'Essential Medicines', category: 'RESOURCE MANAGEMENT', description: 'NLEM 2026 catalog, safety buffers, and lead times', icon: <Pill size={16} /> },
    { id: 'personnel', label: 'Clinical Personnel', category: 'RESOURCE MANAGEMENT', description: 'On-duty doctors, trauma nurses, and emergency roster', icon: <Users size={16} /> },
    { id: 'cold-chain', label: 'Cold Chain Surveillance', category: 'RESOURCE MANAGEMENT', description: 'IoT thermal loggers, vaccines, and power redundancy', icon: <Snowflake size={16} />, badge: '1 Excursion', badgeType: 'warning' },
    { id: 'suppliers', label: 'Suppliers & Vendors', category: 'RESOURCE MANAGEMENT', description: 'Vendor fulfillment SLAs, active contracts, and lead times', icon: <Truck size={16} /> },

    // AI & Simulation
    { id: 'copilot', label: 'Arogya Copilot', category: 'AI & SIMULATION', description: 'Conversational healthcare assistant with live context', icon: <Sparkles size={16} />, action: onOpenCopilot },
    { id: 'digital-twin', label: 'Digital Twin', category: 'AI & SIMULATION', description: 'Stress-test healthcare network before real-world action', icon: <Cpu size={16} /> },
    { id: 'what-if', label: 'What-If Simulator', category: 'AI & SIMULATION', description: 'Multi-scenario Monte Carlo disaster policy evaluation', icon: <GitFork size={16} /> },
    { id: 'ai-agents', label: 'Multi-Agent AI', category: 'AI & SIMULATION', description: 'Status and outputs from 8 autonomous domain agents', icon: <Bot size={16} /> },

    // Insights & System
    { id: 'analytics', label: 'Executive Analytics', category: 'INSIGHTS', description: 'Stock-out mitigation KPIs and waste reduction charts', icon: <BarChart3 size={16} /> },
    { id: 'reports', label: 'Executive Reports', category: 'INSIGHTS', description: 'Weekly Healthcare Resilience Brief for MoHFW', icon: <FileText size={16} /> },
    { id: 'alerts', label: 'Alert Center', category: 'INSIGHTS', description: 'Triage critical disruptions and assign responses', icon: <Bell size={16} />, badge: '4 Pending', badgeType: 'warning' },
    { id: 'model-health', label: 'Model Observatory', category: 'INSIGHTS', description: 'Federated learning health and differential privacy', icon: <Activity size={16} /> },
    { id: 'settings', label: 'System Settings', category: 'SYSTEM', description: 'Administrator profile, credentials, and notifications', icon: <Settings size={16} /> },
  ];

  const filtered = query.trim() === ''
    ? commandItems
    : commandItems.filter(item =>
        item.label.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
      );

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 40);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1 < filtered.length ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 >= 0 ? prev - 1 : filtered.length - 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const selected = filtered[selectedIndex];
        if (selected) {
          if (selected.action) selected.action();
          else onNavigate(selected.id);
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filtered, selectedIndex, onClose, onNavigate]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '12vh',
        background: 'rgba(11, 18, 32, 0.45)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 600,
          background: '#FFFFFF',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-modal)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'fadeIn 0.15s ease forwards',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '14px 18px',
            borderBottom: '1px solid var(--border-default)',
            background: 'var(--bg-surface-elevated)',
          }}
        >
          <Search size={18} color="var(--color-green)" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search commands, facilities, medicines, simulations..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              fontSize: 14,
              fontWeight: 500,
              color: 'var(--text-primary)',
              outline: 'none',
            }}
          />
          <kbd
            style={{
              fontSize: 11,
              fontWeight: 700,
              padding: '2px 7px',
              borderRadius: 4,
              background: '#FFFFFF',
              border: '1px solid var(--border-default)',
              color: 'var(--text-secondary)',
              fontFamily: 'JetBrains Mono, monospace',
            }}
          >
            ESC
          </kbd>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              padding: 2,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Command Items List */}
        <div
          style={{
            maxHeight: 380,
            overflowY: 'auto',
            padding: '8px 10px',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          {filtered.length === 0 ? (
            <div style={{ padding: '32px 20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <p style={{ fontSize: 13, fontWeight: 500 }}>No results found for "{query}"</p>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                Try searching for "Amoxicillin", "Emergency", "Forecast", or "Routes"
              </p>
            </div>
          ) : (
            filtered.map((item, index) => {
              const isSelected = index === selectedIndex;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.action) item.action();
                    else onNavigate(item.id);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '9px 12px',
                    borderRadius: 'var(--radius-sm)',
                    background: isSelected ? 'var(--color-green-light)' : 'transparent',
                    border: `1px solid ${isSelected ? 'var(--color-green-border)' : 'transparent'}`,
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.1s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 6,
                        background: isSelected ? '#FFFFFF' : 'var(--bg-surface-elevated)',
                        border: '1px solid var(--border-default)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isSelected ? 'var(--color-green-deep)' : 'var(--text-secondary)',
                      }}
                    >
                      {item.icon}
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span
                          style={{
                            fontSize: 13,
                            fontWeight: isSelected ? 700 : 600,
                            color: isSelected ? 'var(--color-green-deep)' : 'var(--text-primary)',
                          }}
                        >
                          {item.label}
                        </span>
                        {item.badge && (
                          <span
                            className={`ag-badge ${
                              item.badgeType === 'critical'
                                ? 'ag-badge-critical'
                                : item.badgeType === 'warning'
                                ? 'ag-badge-warning'
                                : 'ag-badge-neutral'
                            }`}
                            style={{ fontSize: 9.5, padding: '1px 5px' }}
                          >
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 1, margin: 0 }}>
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span
                      style={{
                        fontSize: 9.5,
                        fontWeight: 700,
                        color: 'var(--text-muted)',
                        textTransform: 'uppercase',
                        fontFamily: 'JetBrains Mono',
                      }}
                    >
                      {item.category}
                    </span>
                    {isSelected && (
                      <CornerDownLeft size={13} color="var(--color-green-deep)" />
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div
          style={{
            padding: '8px 18px',
            borderTop: '1px solid var(--border-default)',
            background: 'var(--bg-surface-elevated)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 11,
            color: 'var(--text-secondary)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span>↑↓ to navigate</span>
            <span>↵ to select</span>
            <span>ESC to close</span>
          </div>
          <span style={{ fontWeight: 600, color: 'var(--color-green-deep)' }}>
            AROGYAGRID AI · Resilient Command
          </span>
        </div>
      </div>
    </div>
  );
};
