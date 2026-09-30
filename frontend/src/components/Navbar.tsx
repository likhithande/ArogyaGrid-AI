import React, { useState } from 'react';
import {
  ShieldAlert, Sparkles, Bell, Globe, Sun, Moon,
  Activity, Award, CheckCircle2, AlertTriangle, ChevronDown,
  Search, User, LogIn, Monitor, Contrast, Type, X
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { Role, Language } from '../types';

interface NavbarProps {
  currentRole: Role;
  onRoleChange: (role: Role) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  isEmergencyActive: boolean;
  onToggleEmergency: () => void;
  onOpenCopilot: () => void;
  onOpenJudgeTour: () => void;
  onOpenCommandPalette?: () => void;
  onOpenPresentationMode?: () => void;
  onOpenLoginModal?: () => void;
  darkMode: boolean;
  onToggleTheme: () => void;
  onNavigateToView: (view: string) => void;
  activeAlertsCount: number;
  currentView?: string;
  onOpenMobileCenter?: () => void;
  highContrast?: boolean;
  onToggleHighContrast?: () => void;
  fontScale?: 'normal' | 'large' | 'xl';
  onChangeFontScale?: (scale: 'normal' | 'large' | 'xl') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  language,
  onLanguageChange,
  isEmergencyActive,
  onToggleEmergency,
  onOpenCopilot,
  onOpenJudgeTour,
  onOpenCommandPalette,
  onOpenPresentationMode,
  onOpenLoginModal,
  darkMode,
  onToggleTheme,
  onNavigateToView,
  activeAlertsCount,
  currentView = 'overview',
  onOpenMobileCenter,
  highContrast = false,
  onToggleHighContrast,
  fontScale = 'normal',
  onChangeFontScale,
}) => {
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [showAlertsDropdown, setShowAlertsDropdown] = useState(false);
  const [showAccessDropdown, setShowAccessDropdown] = useState(false);

  const closeAll = () => {
    setShowRoleDropdown(false);
    setShowLangDropdown(false);
    setShowAlertsDropdown(false);
    setShowAccessDropdown(false);
  };

  const isLayer1 = currentView === 'executive-view' || currentView === 'executive-brief';
  const isLayer3 = ['technical-deep-dive', 'edge-federation', 'observatory', 'federated'].includes(currentView);
  const isLayer2 = !isLayer1 && !isLayer3;

  const viewTitles: Record<string, string> = {
    'overview': 'Command Center',
    'graph-intelligence': 'Healthcare Graph',
    'ai-matching': 'Resource Matching',
    'national-resilience-map': 'National Map',
    'incident-room': 'AI War Room',
    'scenario-lab': 'Resilience Lab',
    'iot-stream': 'IoT Stream',
    'forecast': 'Demand Intelligence',
    'stockout': 'Medicine Risk Center',
    'cascade-simulation': 'Cascade Simulator',
    'simulation': 'Digital Twin',
    'root-cause': 'Causal Root Cause',
    'anomalies': 'Anomaly Sentinel',
    'redistribution': 'Resource Optimization',
    'procurement': 'Smart Procurement',
    'suppliers': 'Routing & Convoys',
    'swap-market': 'Resource Swap',
    'supply-chain': 'Supply Chain Network',
    'early-warnings': 'Early Warning Matrix',
    'playbooks': 'SOP Playbooks',
    'equipment': 'Cold Chain IoT',
    'map': 'District Intelligence',
    'personnel-beds': 'Personnel & Beds',
    'inventory-fefo': 'Inventory FEFO',
    'technical-deep-dive': 'Architecture & Audit',
    'edge-federation': 'Edge AI & Federation',
    'multimodal-docs': 'Document Intelligence',
    'security-zero-trust': 'Zero-Trust Security',
    'vision-2030': 'Vision 2030',
    'observatory': 'Model Observatory',
    'federated': 'Federated AI Network',
    'scalability': 'Ethics & Scalability',
    'executive-brief': 'Executive Brief',
    'executive-view': 'Executive Layer',
    'reports': 'Report Center',
    'audit-logs': 'Audit Ledger',
    'agents': 'AI Agent Operations',
    'settings': 'Settings',
    'landing': 'Product Portal',
  };
  const currentTitle = viewTitles[currentView] || 'Intelligence Console';

  const roles: Role[] = [
    'National Health Administrator',
    'State Health Administrator',
    'District Health Officer',
    'PHC Administrator',
    'Supply Chain Manager',
    'Emergency Response Coordinator',
    'Data/AI Analyst'
  ];

  const languages: { code: Language; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिंदी' },
    { code: 'te', label: 'తెలుగు' },
  ];

  const alertItems = [
    { severity: 'critical', title: 'Stock-out Risk: ORS', loc: 'Khammam District', time: '2 min ago', icon: AlertTriangle },
    { severity: 'warning', title: 'Demand Surge +27%', loc: 'Warangal PHC-042', time: '14 min ago', icon: Activity },
    { severity: 'critical', title: 'Paracetamol Buffer <5%', loc: 'Adilabad District', time: '31 min ago', icon: AlertTriangle },
    { severity: 'info', title: 'Federated Round 47 complete', loc: 'AI Network', time: '45 min ago', icon: CheckCircle2 },
  ];

  const severityStyles: Record<string, { dot: string; text: string }> = {
    critical: { dot: 'bg-red-400', text: 'text-red-400' },
    warning: { dot: 'bg-amber-400', text: 'text-amber-400' },
    info: { dot: 'bg-blue-400', text: 'text-blue-400' },
    success: { dot: 'bg-emerald-400', text: 'text-emerald-400' },
  };

  const dropdownBase = "absolute right-0 mt-2 rounded-xl shadow-2xl p-1.5 z-50 min-w-[200px] animate-in fade-in zoom-in-95 duration-150";
  const dropdownStyle = {
    background: '#0C1424',
    border: '1px solid #1A2438',
  };

  return (
    <>
      {/* Emergency Banner */}
      {isEmergencyActive && (
        <div
          className="sticky top-0 z-50 flex items-center justify-between px-4 py-2 animate-emergency-pulse"
          style={{ background: '#7F1D1D', borderBottom: '1px solid rgba(239,68,68,0.4)' }}
          role="alert"
          aria-live="assertive"
        >
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-400" />
            </span>
            <span className="text-[11px] font-bold text-red-200 tracking-wider uppercase" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              ● EMERGENCY DRILL ACTIVE — Flood Response Simulation 2026
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigateToView('incident-room')}
              className="text-[11px] font-bold text-red-300 hover:text-red-100 underline underline-offset-2 transition-colors cursor-pointer"
            >
              VIEW WAR ROOM
            </button>
            <button
              onClick={onToggleEmergency}
              className="text-red-300 hover:text-red-100 transition-colors cursor-pointer"
              aria-label="Dismiss emergency banner"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Navbar */}
      <header
        className="sticky top-0 z-40 w-full flex items-center justify-between px-4 py-0 transition-colors"
        style={{
          background: darkMode ? 'rgba(7,11,20,0.97)' : 'rgba(247,249,252,0.97)',
          borderBottom: `1px solid ${darkMode ? '#1A2438' : '#E2E8F0'}`,
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          height: '52px',
        }}
      >
        {/* LEFT: Logo + Breadcrumb + Layer Switcher */}
        <div className="flex items-center gap-4 h-full">
          {/* Logo */}
          <button
            onClick={() => onNavigateToView('overview')}
            className="flex-shrink-0 cursor-pointer"
            aria-label="ArogyaGrid AI — Go to Command Center"
          >
            <BrandLogo size="sm" showTagline={false} lightMode={!darkMode} />
          </button>

          {/* Divider */}
          <div className="hidden md:block w-px h-5" style={{ background: '#1A2438' }} />

          {/* Breadcrumb */}
          <div className="hidden md:flex items-center gap-1.5">
            <span className="text-[11px]" style={{ color: '#3A4A63' }}>ArogyaGrid</span>
            <span className="text-[11px]" style={{ color: '#3A4A63' }}>/</span>
            <span className="text-[12px] font-semibold" style={{ color: darkMode ? '#CBD5E1' : '#1E293B' }}>
              {currentTitle}
            </span>
          </div>

          {/* Layer Switcher */}
          <div
            className="hidden lg:flex items-center gap-0.5 p-0.5 rounded-lg ml-1"
            style={{ background: darkMode ? '#0C1424' : '#F1F5F9', border: `1px solid ${darkMode ? '#1A2438' : '#E2E8F0'}` }}
          >
            {[
              { key: 'executive-view', label: 'Executive', check: isLayer1, accent: '#F59E0B' },
              { key: 'overview', label: 'Operations', check: isLayer2, accent: '#06B6D4' },
              { key: 'technical-deep-dive', label: 'Technical', check: isLayer3, accent: '#8B5CF6' },
            ].map(({ key, label, check, accent }) => (
              <button
                key={key}
                onClick={() => onNavigateToView(key)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer"
                style={{
                  background: check ? accent : 'transparent',
                  color: check ? '#fff' : darkMode ? '#64748B' : '#94A3B8',
                  boxShadow: check ? `0 2px 8px -2px ${accent}60` : 'none',
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT: Actions */}
        <div className="flex items-center gap-1.5 h-full">

          {/* Search */}
          {onOpenCommandPalette && (
            <button
              onClick={onOpenCommandPalette}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all cursor-pointer"
              style={{
                background: darkMode ? '#0C1424' : '#F1F5F9',
                border: `1px solid ${darkMode ? '#1A2438' : '#E2E8F0'}`,
                color: darkMode ? '#64748B' : '#94A3B8',
              }}
              title="Global Search (Ctrl + K)"
              aria-label="Open global search (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5" style={{ color: '#06B6D4' }} />
              <span>Search...</span>
              <kbd className="px-1.5 py-0.5 rounded text-[9.5px] font-mono"
                style={{ background: darkMode ? '#111827' : '#E2E8F0', color: '#64748B', border: `1px solid ${darkMode ? '#1A2438' : '#CBD5E1'}` }}>
                ⌘K
              </kbd>
            </button>
          )}

          {/* System Status */}
          <div
            className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10.5px] font-mono font-semibold"
            style={{
              background: 'rgba(22,163,74,0.08)',
              border: '1px solid rgba(22,163,74,0.2)',
              color: '#22C55E',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>OPERATIONAL</span>
          </div>

          {/* Judge Tour */}
          <button
            onClick={onOpenJudgeTour}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11.5px] font-semibold transition-all cursor-pointer"
            style={{
              background: 'rgba(245,158,11,0.10)',
              border: '1px solid rgba(245,158,11,0.25)',
              color: '#F59E0B',
            }}
            title="Start Judge Demo Tour"
          >
            <Award className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Demo</span>
          </button>

          {/* Emergency Toggle */}
          <button
            onClick={onToggleEmergency}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11.5px] font-semibold transition-all cursor-pointer"
            style={{
              background: isEmergencyActive ? '#DC2626' : darkMode ? '#0C1424' : '#F1F5F9',
              border: isEmergencyActive ? '1px solid rgba(239,68,68,0.5)' : `1px solid ${darkMode ? '#1A2438' : '#E2E8F0'}`,
              color: isEmergencyActive ? '#fff' : darkMode ? '#64748B' : '#94A3B8',
            }}
            title="Toggle Emergency Mode"
          >
            <ShieldAlert className={`w-3.5 h-3.5 ${isEmergencyActive ? 'text-red-100' : 'text-red-400'}`} />
            <span className="hidden sm:inline">{isEmergencyActive ? 'Emergency' : 'Drill'}</span>
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => { setShowAlertsDropdown(!showAlertsDropdown); setShowRoleDropdown(false); setShowLangDropdown(false); setShowAccessDropdown(false); }}
              className="relative p-2 rounded-lg transition-all cursor-pointer"
              style={{
                background: showAlertsDropdown ? (darkMode ? '#111827' : '#F1F5F9') : 'transparent',
                color: darkMode ? '#64748B' : '#94A3B8',
              }}
              aria-label={`${activeAlertsCount} notifications`}
            >
              <Bell className="w-4 h-4" />
              {activeAlertsCount > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 w-4 h-4 flex items-center justify-center text-[9px] font-bold rounded-full text-white"
                  style={{ background: '#DC2626' }}
                >
                  {activeAlertsCount}
                </span>
              )}
            </button>

            {showAlertsDropdown && (
              <div className={dropdownBase} style={{ ...dropdownStyle, width: '320px' }}>
                <div className="px-3 py-2 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-300">Active Alerts</span>
                  <button
                    className="text-[10px] font-semibold text-blue-400 hover:text-blue-300 cursor-pointer transition-colors"
                    onClick={() => { closeAll(); onNavigateToView('stockout'); }}
                  >
                    View all
                  </button>
                </div>
                <div className="mt-1 space-y-0.5">
                  {alertItems.map((alert, i) => {
                    const Icon = alert.icon;
                    const style = severityStyles[alert.severity] || severityStyles.info;
                    return (
                      <div
                        key={i}
                        className="flex items-start gap-2.5 px-3 py-2.5 rounded-lg cursor-pointer transition-colors hover:bg-white/[0.04]"
                      >
                        <span className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${style.dot}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] font-semibold text-slate-200 leading-tight">{alert.title}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">{alert.loc}</p>
                        </div>
                        <span className="text-[10px] text-slate-500 flex-shrink-0 mt-0.5" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{alert.time}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Language */}
          <div className="relative hidden md:block">
            <button
              onClick={() => { setShowLangDropdown(!showLangDropdown); setShowRoleDropdown(false); setShowAlertsDropdown(false); setShowAccessDropdown(false); }}
              className="flex items-center gap-1 p-2 rounded-lg transition-all cursor-pointer"
              style={{ color: darkMode ? '#64748B' : '#94A3B8' }}
              aria-label="Select language"
            >
              <Globe className="w-4 h-4" />
            </button>
            {showLangDropdown && (
              <div className={dropdownBase} style={dropdownStyle}>
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => { onLanguageChange(lang.code); setShowLangDropdown(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] transition-colors cursor-pointer hover:bg-white/[0.06]"
                    style={{ color: language === lang.code ? '#22D3EE' : '#94A3B8' }}
                  >
                    {language === lang.code && <CheckCircle2 className="w-3 h-3 text-cyan-400 flex-shrink-0" />}
                    {language !== lang.code && <span className="w-3 flex-shrink-0" />}
                    {lang.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-lg transition-all cursor-pointer"
            style={{ color: darkMode ? '#64748B' : '#94A3B8' }}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Copilot */}
          <button
            onClick={onOpenCopilot}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, rgba(37,99,235,0.2), rgba(6,182,212,0.15))',
              border: '1px solid rgba(6,182,212,0.25)',
              color: '#22D3EE',
            }}
            title="Open Arogya Copilot"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Copilot</span>
          </button>

          {/* User / Role */}
          <div className="relative">
            <button
              onClick={() => { setShowRoleDropdown(!showRoleDropdown); setShowLangDropdown(false); setShowAlertsDropdown(false); setShowAccessDropdown(false); }}
              className="flex items-center gap-2 pl-1.5 pr-2.5 py-1.5 rounded-lg transition-all cursor-pointer"
              style={{
                background: darkMode ? '#0C1424' : '#F1F5F9',
                border: `1px solid ${darkMode ? '#1A2438' : '#E2E8F0'}`,
              }}
            >
              <div
                className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(37,99,235,0.15)', border: '1px solid rgba(37,99,235,0.2)' }}
              >
                <User className="w-3 h-3 text-blue-400" />
              </div>
              <span className="hidden md:inline text-[11.5px] font-semibold max-w-[110px] truncate"
                style={{ color: darkMode ? '#CBD5E1' : '#334155' }}>
                {currentRole.split(' ')[0]} {currentRole.split(' ')[1] || ''}
              </span>
              <ChevronDown className="w-3 h-3 hidden md:inline" style={{ color: '#64748B' }} />
            </button>

            {showRoleDropdown && (
              <div className={dropdownBase} style={{ ...dropdownStyle, width: '240px' }}>
                <div className="px-3 py-2 border-b mb-1" style={{ borderColor: '#1A2438' }}>
                  <p className="text-[10.5px] font-bold tracking-wider uppercase" style={{ color: '#3A4A63', fontFamily: "'JetBrains Mono', monospace" }}>
                    Access Role
                  </p>
                </div>
                {roles.map((role) => (
                  <button
                    key={role}
                    onClick={() => { onRoleChange(role); setShowRoleDropdown(false); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12px] transition-colors cursor-pointer hover:bg-white/[0.06]"
                    style={{ color: currentRole === role ? '#22D3EE' : '#94A3B8' }}
                  >
                    {currentRole === role
                      ? <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                      : <span className="w-3.5 flex-shrink-0" />
                    }
                    <span className={currentRole === role ? 'font-semibold text-cyan-300' : ''}>{role}</span>
                  </button>
                ))}
                {onOpenLoginModal && (
                  <div className="border-t mt-1 pt-1" style={{ borderColor: '#1A2438' }}>
                    <button
                      onClick={() => { setShowRoleDropdown(false); onOpenLoginModal(); }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] font-medium cursor-pointer hover:bg-white/[0.06] transition-colors"
                      style={{ color: '#06B6D4' }}
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      Enterprise Sign In
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Click-outside overlay for dropdowns */}
      {(showRoleDropdown || showLangDropdown || showAlertsDropdown || showAccessDropdown) && (
        <div
          className="fixed inset-0 z-30"
          onClick={closeAll}
          aria-hidden="true"
        />
      )}
    </>
  );
};
