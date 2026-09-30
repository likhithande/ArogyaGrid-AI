import React from 'react';
import {
  LayoutDashboard, Map, TrendingUp, AlertOctagon, RefreshCw,
  ShieldAlert, Cpu, Network, Activity, GitFork, Users,
  FileText, History, Sparkles, Brain, Bot,
  Flame, Globe2, ShoppingCart, Truck, ArrowLeftRight, BookOpen,
  Wrench, Database, Scale, Sun, AlertTriangle,
  Lock, Compass, Radio, ChevronLeft, ChevronRight, User,
  BarChart3, Layers, Zap, Settings
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface SidebarProps {
  currentView: string;
  onSelectView: (view: string) => void;
  isEmergencyActive: boolean;
  collapsed: boolean;
  onToggleCollapse: () => void;
  currentRole?: string;
  onOpenLoginModal?: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: any;
  badge?: string;
  badgeVariant?: 'info' | 'critical' | 'warning' | 'success' | 'ai';
  highlight?: boolean;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  isEmergencyActive,
  collapsed,
  onToggleCollapse,
  currentRole = 'National Health Administrator',
  onOpenLoginModal
}) => {
  const navSections: NavSection[] = [
    {
      title: "OVERVIEW",
      items: [
        { id: "overview", label: "Command Center", icon: LayoutDashboard, badge: "LIVE", badgeVariant: 'success' },
        { id: "national-resilience-map", label: "National Map", icon: Globe2, badge: "4D", badgeVariant: 'info' },
        { id: "map", label: "District Intelligence", icon: Map },
        { id: "executive-view", label: "Executive Brief", icon: Sun, badge: "L1", badgeVariant: 'ai' },
      ]
    },
    {
      title: "AI INTELLIGENCE",
      items: [
        { id: "forecast", label: "Demand Intelligence", icon: TrendingUp, badge: "AI", badgeVariant: 'ai' },
        { id: "stockout", label: "Medicine Risk Center", icon: AlertOctagon, badge: "XAI", badgeVariant: 'warning' },
        { id: "anomalies", label: "Anomaly Sentinel", icon: Activity },
        { id: "root-cause", label: "Causal Root Cause", icon: Brain, badge: "XAI", badgeVariant: 'ai' },
        { id: "early-warnings", label: "Early Warning Matrix", icon: AlertTriangle },
      ]
    },
    {
      title: "SUPPLY & LOGISTICS",
      items: [
        { id: "supply-chain", label: "Supply Chain Network", icon: GitFork },
        { id: "redistribution", label: "Resource Optimization", icon: ArrowLeftRight, badge: "AI", badgeVariant: 'ai' },
        { id: "suppliers", label: "Routing & Convoys", icon: Truck },
        { id: "inventory-fefo", label: "Inventory FEFO", icon: Layers },
        { id: "equipment", label: "Cold Chain IoT", icon: Wrench },
        { id: "procurement", label: "Smart Procurement", icon: ShoppingCart },
      ]
    },
    {
      title: "SIMULATION & EMERGENCY",
      items: [
        {
          id: "incident-room", label: "AI War Room", icon: ShieldAlert,
          badge: isEmergencyActive ? "ACTIVE" : undefined,
          badgeVariant: 'critical',
          highlight: isEmergencyActive
        },
        { id: "simulation", label: "Digital Twin", icon: Cpu, badge: "What-If", badgeVariant: 'info' },
        { id: "scenario-lab", label: "Resilience Lab", icon: BarChart3 },
        { id: "cascade-simulation", label: "Cascade Failure", icon: Flame },
        { id: "playbooks", label: "SOP Playbooks", icon: BookOpen },
      ]
    },
    {
      title: "FEDERATED AI",
      items: [
        { id: "federated", label: "Federated Learning", icon: Network, badge: "FL", badgeVariant: 'ai' },
        { id: "agents", label: "AI Agent Operations", icon: Bot, badge: "10", badgeVariant: 'ai' },
        { id: "edge-federation", label: "Edge AI & Federation", icon: Radio },
        { id: "graph-intelligence", label: "Healthcare Graph", icon: Zap },
      ]
    },
    {
      title: "GOVERNANCE",
      items: [
        { id: "observatory", label: "Model Observatory", icon: Activity },
        { id: "audit-logs", label: "Audit Ledger", icon: History },
        { id: "reports", label: "Report Center", icon: Sparkles },
        { id: "security-zero-trust", label: "Zero-Trust Security", icon: Lock },
        { id: "multimodal-docs", label: "Document Intelligence", icon: FileText },
        { id: "scalability", label: "Ethics & Scale", icon: Scale },
        { id: "vision-2030", label: "Vision 2030", icon: Compass },
        { id: "technical-deep-dive", label: "Architecture & Audit", icon: Database },
        { id: "settings", label: "Settings", icon: Settings },
      ]
    }
  ];

  const badgeStyles: Record<string, string> = {
    info: 'bg-blue-950/80 text-blue-300 border-blue-800/60',
    critical: 'bg-red-950/80 text-red-300 border-red-800/60',
    warning: 'bg-amber-950/80 text-amber-300 border-amber-800/60',
    success: 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60',
    ai: 'bg-cyan-950/80 text-cyan-300 border-cyan-800/60',
  };

  return (
    <aside
      className={`relative z-30 flex flex-col transition-all duration-300 select-none flex-shrink-0 ${
        collapsed ? 'w-14' : 'w-60'
      }`}
      style={{
        background: '#070B14',
        borderRight: '1px solid #1A2438',
      }}
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Brand Header */}
      <div
        className={`flex items-center border-b ${collapsed ? 'justify-center px-3 py-3.5' : 'px-4 py-3.5'}`}
        style={{ borderColor: '#1A2438' }}
      >
        {!collapsed ? (
          <BrandLogo size="sm" showTagline={false} className="flex-1" />
        ) : (
          <BrandLogo size="sm" iconOnly={true} />
        )}
      </div>

      {/* Scrollable Navigation */}
      <div className="flex-1 overflow-y-auto py-3 space-y-5"
        style={{ scrollbarWidth: 'none' }}
      >
        {navSections.map((section, sIdx) => (
          <div key={sIdx}>
            {/* Section Label */}
            {!collapsed && (
              <div className="px-4 pb-1.5">
                <span
                  className="text-[9.5px] font-bold tracking-[0.12em] uppercase"
                  style={{
                    color: '#3A4A63',
                    fontFamily: "'JetBrains Mono', monospace"
                  }}
                >
                  {section.title}
                </span>
              </div>
            )}

            {/* Nav Items */}
            <div className="space-y-0.5 px-2">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                const isHighlight = item.highlight;

                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectView(item.id)}
                    title={item.label}
                    aria-current={isActive ? 'page' : undefined}
                    className={`
                      w-full flex items-center gap-2.5 rounded-lg transition-all duration-150 cursor-pointer
                      ${collapsed ? 'justify-center px-0 py-2.5' : 'px-3 py-2'}
                      ${isActive
                        ? 'text-white font-semibold'
                        : isHighlight
                        ? 'text-red-300 font-medium'
                        : 'text-slate-400 hover:text-slate-200 font-medium'
                      }
                    `}
                    style={{
                      background: isActive
                        ? 'rgba(37, 99, 235, 0.12)'
                        : isHighlight
                        ? 'rgba(220, 38, 38, 0.08)'
                        : 'transparent',
                      border: isActive
                        ? '1px solid rgba(37, 99, 235, 0.25)'
                        : isHighlight
                        ? '1px solid rgba(220, 38, 38, 0.2)'
                        : '1px solid transparent',
                    }}
                  >
                    <Icon
                      className={`flex-shrink-0 transition-colors ${
                        collapsed ? 'w-4.5 h-4.5' : 'w-4 h-4'
                      } ${
                        isActive ? 'text-blue-400' : isHighlight ? 'text-red-400' : 'text-slate-500 group-hover:text-slate-300'
                      }`}
                      style={{ width: collapsed ? '18px' : '15px', height: collapsed ? '18px' : '15px' }}
                    />

                    {!collapsed && (
                      <div className="flex items-center justify-between flex-1 min-w-0">
                        <span className="text-[12.5px] truncate">{item.label}</span>
                        {item.badge && (
                          <span
                            className={`
                              text-[9px] px-1.5 py-0.5 rounded font-mono font-bold uppercase border flex-shrink-0 ml-1
                              ${item.badgeVariant ? badgeStyles[item.badgeVariant] : 'bg-slate-900 text-slate-400 border-slate-800'}
                            `}
                          >
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer: System Status & Profile */}
      <div
        className="border-t"
        style={{ borderColor: '#1A2438' }}
      >
        {/* User Profile */}
        {!collapsed && (
          <button
            onClick={onOpenLoginModal}
            className="w-full flex items-center gap-2.5 px-4 py-3 transition-colors cursor-pointer hover:bg-white/[0.03] text-left"
            title="Switch role or authenticate"
          >
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(37,99,235,0.15)', border: '1px solid rgba(37,99,235,0.25)' }}
            >
              <User className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11.5px] font-semibold text-slate-200 truncate leading-tight">
                {currentRole}
              </p>
              <p className="text-[10px] flex items-center gap-1 mt-0.5"
                style={{ color: '#22C55E', fontFamily: "'JetBrains Mono', monospace" }}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                Authenticated · Synced
              </p>
            </div>
          </button>
        )}

        {/* Collapse toggle & version */}
        <div className={`flex items-center px-3 py-2.5 ${collapsed ? 'justify-center' : 'justify-between'}`}>
          {!collapsed && (
            <span
              className="text-[9.5px] font-mono"
              style={{ color: '#2A3A52' }}
            >
              v2.5.0 · Enterprise
            </span>
          )}
          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-md transition-colors cursor-pointer"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid #1A2438',
              color: '#3A4A63'
            }}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed
              ? <ChevronRight className="w-3.5 h-3.5" />
              : <ChevronLeft className="w-3.5 h-3.5" />
            }
          </button>
        </div>
      </div>
    </aside>
  );
};
