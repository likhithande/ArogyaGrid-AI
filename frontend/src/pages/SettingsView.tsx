import React, { useState } from 'react';
import {
  User, Shield, Bell, Moon, Sun, Globe,
  Cpu, Database, Activity, CheckCircle2, Lock, Key,
  Monitor, Contrast, Type, ChevronRight, Save
} from 'lucide-react';
import { Role, Language } from '../types';

interface SettingsViewProps {
  currentRole: Role;
  onRoleChange: (role: Role) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  darkMode: boolean;
  onToggleTheme: () => void;
  highContrast: boolean;
  onToggleHighContrast: () => void;
  fontScale: 'normal' | 'large' | 'xl';
  onChangeFontScale: (scale: 'normal' | 'large' | 'xl') => void;
}

const ToggleSwitch: React.FC<{ enabled: boolean; onToggle: () => void; label?: string }> = ({ enabled, onToggle, label }) => (
  <button
    onClick={onToggle}
    role="switch"
    aria-checked={enabled}
    aria-label={label}
    style={{
      position: 'relative',
      display: 'inline-flex',
      height: 22,
      width: 42,
      borderRadius: 9999,
      cursor: 'pointer',
      alignItems: 'center',
      border: 'none',
      background: enabled ? 'var(--color-green)' : '#CBD5E1',
      transition: 'background-color 0.15s ease',
      padding: 2,
    }}
  >
    <span
      style={{
        display: 'inline-block',
        height: 18,
        width: 18,
        borderRadius: '50%',
        background: '#FFFFFF',
        boxShadow: '0 1px 2px rgba(0,0,0,0.15)',
        transform: enabled ? 'translateX(20px)' : 'translateX(0px)',
        transition: 'transform 0.15s ease',
      }}
    />
  </button>
);

const SettingRow: React.FC<{
  label: string;
  desc?: string;
  children: React.ReactNode;
}> = ({ label, desc, children }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 16,
      padding: '14px 0',
      borderBottom: '1px solid var(--border-subtle)',
    }}
  >
    <div style={{ flex: 1, minWidth: 0 }}>
      <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{label}</p>
      {desc && <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2, margin: 0 }}>{desc}</p>}
    </div>
    <div style={{ flexShrink: 0 }}>{children}</div>
  </div>
);

type Tab = 'profile' | 'security' | 'notifications' | 'ai' | 'data' | 'system';

export const SettingsView: React.FC<SettingsViewProps> = ({
  currentRole,
  onRoleChange,
  language,
  onLanguageChange,
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [officerName, setOfficerName] = useState('Dr. Rajesh Sharma');
  const [officerEmail, setOfficerEmail] = useState('administrator@arogyagrid.gov.in');
  const [emergencyAlerts, setEmergencyAlerts] = useState(true);
  const [emailDigest, setEmailDigest] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [aiAutoSuggest, setAiAutoSuggest] = useState(true);
  const [xaiExplain, setXaiExplain] = useState(true);
  const [federatedShare, setFederatedShare] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const roles: Role[] = [
    'National Health Administrator',
    'State Health Administrator',
    'District Health Officer',
    'PHC Administrator',
    'Supply Chain Manager',
    'Emergency Response Coordinator',
    'Data/AI Analyst',
  ];

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'profile', label: 'Profile & Role', icon: <User size={15} /> },
    { id: 'security', label: 'Security & SSO', icon: <Shield size={15} /> },
    { id: 'notifications', label: 'Emergency Alerts', icon: <Bell size={15} /> },
    { id: 'ai', label: 'AI & Inference Config', icon: <Cpu size={15} /> },
    { id: 'data', label: 'DPDP Act Compliance', icon: <Database size={15} /> },
    { id: 'system', label: 'System Health', icon: <Activity size={15} /> },
  ];

  const inputStyle: React.CSSProperties = {
    background: 'var(--bg-surface-elevated)',
    border: '1px solid var(--border-default)',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--text-primary)',
    padding: '7px 12px',
    fontSize: '13px',
    outline: 'none',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: 0 }}>
            PLATFORM SETTINGS & GOVERNANCE
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2, margin: 0 }}>
            Organization preferences, administrative roles, explainable AI thresholds, and cryptographic privacy verification
          </p>
        </div>

        <button
          onClick={handleSave}
          className="ag-btn-primary"
        >
          {saved ? <CheckCircle2 size={14} /> : <Save size={14} />}
          <span>{saved ? 'Changes Saved' : 'Save Preferences'}</span>
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 20 }}>
        {/* Tab Sidebar */}
        <div className="ag-card" style={{ padding: 8, height: 'fit-content', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '9px 12px',
                  borderRadius: 'var(--radius-sm)',
                  background: isActive ? 'var(--color-green-light)' : 'transparent',
                  border: `1px solid ${isActive ? 'var(--color-green-border)' : 'transparent'}`,
                  color: isActive ? 'var(--color-green-deep)' : 'var(--text-secondary)',
                  fontSize: 13,
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.12s ease',
                }}
              >
                <span style={{ color: isActive ? 'var(--color-green)' : 'var(--text-muted)' }}>
                  {tab.icon}
                </span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Pane */}
        <div className="ag-card" style={{ padding: '20px 24px' }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 14, margin: '0 0 14px 0', borderBottom: '1px solid var(--border-default)', paddingBottom: 10 }}>
            {tabs.find((t) => t.id === activeTab)?.label}
          </h2>

          <div>
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <>
                <SettingRow label="Official Name" desc="Administrator identity attached to official reports and dispatch orders">
                  <input
                    value={officerName}
                    onChange={(e) => setOfficerName(e.target.value)}
                    style={{ ...inputStyle, width: 240 }}
                  />
                </SettingRow>

                <SettingRow label="Official Email" desc="Used for resilience brief dispatch and two-factor authentication">
                  <input
                    value={officerEmail}
                    onChange={(e) => setOfficerEmail(e.target.value)}
                    style={{ ...inputStyle, width: 240 }}
                  />
                </SettingRow>

                <SettingRow label="Operational Role" desc="Role-based access control determining command authority level">
                  <select
                    value={currentRole}
                    onChange={(e) => onRoleChange(e.target.value as Role)}
                    style={{ ...inputStyle, width: 240, cursor: 'pointer' }}
                  >
                    {roles.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </SettingRow>

                <SettingRow label="Interface Language" desc="Local language localization for clinical duty staff">
                  <select
                    value={language}
                    onChange={(e) => onLanguageChange(e.target.value as Language)}
                    style={{ ...inputStyle, width: 160, cursor: 'pointer' }}
                  >
                    <option value="en">English (Official)</option>
                    <option value="hi">हिंदी (Hindi)</option>
                    <option value="te">తెలుగు (Telugu)</option>
                  </select>
                </SettingRow>
              </>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <>
                <SettingRow label="Government SSO Status" desc="Authenticated via Ministry of Health and Family Welfare OAuth 2.0 / SAML 2.0">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <CheckCircle2 size={16} color="var(--color-green)" />
                    <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--color-green-deep)' }}>Verified Active</span>
                  </div>
                </SettingRow>

                <SettingRow label="Hardware Security Key / MFA" desc="FIDO2 WebAuthn authentication required for redistribution authorizations">
                  <ToggleSwitch enabled={true} onToggle={() => {}} label="MFA" />
                </SettingRow>

                <SettingRow label="Session Auto-Timeout" desc="Automatically locks command console after period of inactivity">
                  <select style={{ ...inputStyle, width: 140, cursor: 'pointer' }}>
                    <option>30 minutes</option>
                    <option>1 hour</option>
                    <option>4 hours</option>
                  </select>
                </SettingRow>
              </>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <>
                <SettingRow label="High-Priority Stockout Alerts" desc="Instant dispatch for facilities with &lt; 24 hours of buffer remaining">
                  <ToggleSwitch enabled={emergencyAlerts} onToggle={() => setEmergencyAlerts(!emergencyAlerts)} label="Stockout alerts" />
                </SettingRow>

                <SettingRow label="Weekly Resilience Brief Email" desc="Every Monday 08:00 IST automated PDF briefing sent to state leadership">
                  <ToggleSwitch enabled={emailDigest} onToggle={() => setEmailDigest(!emailDigest)} label="Email digest" />
                </SettingRow>

                <SettingRow label="SMS Critical Alert Escalation" desc="Direct SMS alerts to District Chief Medical Officers during severe emergencies">
                  <ToggleSwitch enabled={smsAlerts} onToggle={() => setSmsAlerts(!smsAlerts)} label="SMS alerts" />
                </SettingRow>
              </>
            )}

            {/* AI Preferences Tab */}
            {activeTab === 'ai' && (
              <>
                <SettingRow label="Autonomous Transfer Recommendations" desc="Linear programming engine computes optimal inter-depot rebalances">
                  <ToggleSwitch enabled={aiAutoSuggest} onToggle={() => setAiAutoSuggest(!aiAutoSuggest)} label="AI suggestions" />
                </SettingRow>

                <SettingRow label="Explainable AI (Shapley Attribution)" desc="Decomposes all demand and risk spikes into explainable causal factors">
                  <ToggleSwitch enabled={xaiExplain} onToggle={() => setXaiExplain(!xaiExplain)} label="XAI explanations" />
                </SettingRow>

                <SettingRow label="Confidence Threshold Filtering" desc="Suppress notifications for predictions with confidence lower than 85%">
                  <select style={{ ...inputStyle, width: 140, cursor: 'pointer' }}>
                    <option>85% (Recommended)</option>
                    <option>90% (Strict)</option>
                    <option>75% (Permissive)</option>
                  </select>
                </SettingRow>
              </>
            )}

            {/* Data & Privacy Tab */}
            {activeTab === 'data' && (
              <>
                <SettingRow label="DPDP Act 2023 Compliance Mode" desc="Ensures zero raw patient demographic telemetry leaves local PHC hardware">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <CheckCircle2 size={16} color="var(--color-green)" />
                    <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--color-green-deep)' }}>Strict Isolation Active</span>
                  </div>
                </SettingRow>

                <SettingRow label="Federated Learning Gradients" desc="Only cryptographically blinded model weight deltas transmitted across network">
                  <ToggleSwitch enabled={federatedShare} onToggle={() => setFederatedShare(!federatedShare)} label="Federated gradients" />
                </SettingRow>

                <SettingRow label="Differential Privacy Budget (ε)" desc="Mathematical privacy guarantee ensuring anonymized consumption trends">
                  <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--color-green-deep)', fontFamily: 'JetBrains Mono' }}>
                    ε = 0.85 (Strong)
                  </span>
                </SettingRow>
              </>
            )}

            {/* System Health Tab */}
            {activeTab === 'system' && (
              <>
                <SettingRow label="Active Facility Nodes" desc="Connected real-time IoT and pharmacy database endpoints">
                  <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--color-green-deep)', fontFamily: 'JetBrains Mono' }}>
                    1,248 / 1,248 Online
                  </span>
                </SettingRow>

                <SettingRow label="Average API Latency" desc="Cross-region telemetry ping between state clusters and resilience brain">
                  <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'JetBrains Mono' }}>
                    42ms
                  </span>
                </SettingRow>

                <SettingRow label="Database Replication Status" desc="Multi-region active-active PostgreSQL cluster with continuous WAL archiving">
                  <span className="ag-badge ag-badge-stable">
                    In Sync (0ms Lag)
                  </span>
                </SettingRow>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
