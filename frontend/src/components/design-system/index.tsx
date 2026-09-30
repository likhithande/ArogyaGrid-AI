import React from 'react';
import {
  TrendingUp, TrendingDown, Minus, AlertTriangle, AlertCircle,
  CheckCircle2, Info, ArrowRight, X, ChevronRight, Sliders, Shield
} from 'lucide-react';

/* ── 1. PageHeader ── */
export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  badge,
  actions,
}) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 4 }}>
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: 0 }}>
          {title}
        </h1>
        {badge}
      </div>
      {subtitle && (
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2, margin: 0 }}>
          {subtitle}
        </p>
      )}
    </div>
    {actions && (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {actions}
      </div>
    )}
  </div>
);

/* ── 2. Metric & Trend ── */
export interface TrendProps {
  value: string | number;
  direction?: 'up' | 'down' | 'neutral';
  isGood?: boolean;
}

export const Trend: React.FC<TrendProps> = ({ value, direction = 'up', isGood = true }) => {
  const color = direction === 'neutral'
    ? 'var(--text-secondary)'
    : isGood
    ? 'var(--color-green)'
    : 'var(--color-critical)';

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 3,
        fontSize: 11.5,
        fontWeight: 700,
        color,
        fontFamily: 'JetBrains Mono, monospace',
      }}
    >
      {direction === 'up' && <TrendingUp size={13} />}
      {direction === 'down' && <TrendingDown size={13} />}
      {direction === 'neutral' && <Minus size={13} />}
      {value}
    </span>
  );
};

export interface MetricProps {
  label: string;
  value: string | number;
  unit?: string;
  trend?: TrendProps;
  subtext?: string;
  color?: string;
}

export const Metric: React.FC<MetricProps> = ({
  label,
  value,
  unit,
  trend,
  subtext,
  color = 'var(--text-primary)',
}) => (
  <div className="ag-card" style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 6 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
      <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
        {label}
      </span>
      {trend && <Trend {...trend} />}
    </div>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
      <span style={{ fontSize: 24, fontWeight: 900, color, fontFamily: 'JetBrains Mono, monospace', letterSpacing: '-0.03em' }}>
        {value}
      </span>
      {unit && (
        <span style={{ fontSize: 11.5, color: 'var(--text-muted)', fontWeight: 600 }}>
          {unit}
        </span>
      )}
    </div>
    {subtext && (
      <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: 0 }}>
        {subtext}
      </p>
    )}
  </div>
);

/* ── 3. RiskBadge & StatusBadge ── */
export type RiskLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export const RiskBadge: React.FC<{ level: RiskLevel }> = ({ level }) => {
  const badgeClass =
    level === 'CRITICAL' || level === 'HIGH'
      ? 'ag-badge-critical'
      : level === 'MEDIUM'
      ? 'ag-badge-warning'
      : 'ag-badge-stable';

  return (
    <span className={`ag-badge ${badgeClass}`}>
      {level === 'CRITICAL' || level === 'HIGH' ? (
        <AlertTriangle size={11} />
      ) : level === 'MEDIUM' ? (
        <AlertCircle size={11} />
      ) : (
        <CheckCircle2 size={11} />
      )}
      {level}
    </span>
  );
};

export type SystemStatus = 'STABLE' | 'WARNING' | 'CRITICAL' | 'OPERATIONAL' | 'DISRUPTED' | 'BLOCKED' | 'PENDING' | 'RESOLVED';

export const StatusBadge: React.FC<{ status: SystemStatus }> = ({ status }) => {
  let badgeClass = 'ag-badge-neutral';
  if (status === 'STABLE' || status === 'OPERATIONAL' || status === 'RESOLVED') {
    badgeClass = 'ag-badge-stable';
  } else if (status === 'WARNING' || status === 'DISRUPTED' || status === 'PENDING') {
    badgeClass = 'ag-badge-warning';
  } else if (status === 'CRITICAL' || status === 'BLOCKED') {
    badgeClass = 'ag-badge-critical';
  }

  return (
    <span className={`ag-badge ${badgeClass}`}>
      {status}
    </span>
  );
};

/* ── 4. Breadcrumbs ── */
export interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
  active?: boolean;
}

export const Breadcrumbs: React.FC<{ items: BreadcrumbItem[] }> = ({ items }) => (
  <nav style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600 }}>
    {items.map((it, idx) => (
      <React.Fragment key={it.label}>
        {idx > 0 && <span style={{ color: 'var(--text-muted)' }}>›</span>}
        <button
          onClick={it.onClick}
          disabled={!it.onClick}
          style={{
            background: 'transparent',
            border: 'none',
            padding: 0,
            cursor: it.onClick ? 'pointer' : 'default',
            color: it.active ? 'var(--color-green-deep)' : 'var(--text-secondary)',
            fontWeight: it.active ? 700 : 500,
          }}
        >
          {it.label}
        </button>
      </React.Fragment>
    ))}
  </nav>
);

/* ── 5. AIRecommendation ── */
export interface AIRecommendationProps {
  title?: string;
  recommendation: string;
  impactExplanation?: string;
  confidence?: string | number;
  actionText?: string;
  onAction?: () => void;
}

export const AIRecommendation: React.FC<AIRecommendationProps> = ({
  title = 'AI RECOMMENDATION',
  recommendation,
  impactExplanation,
  confidence,
  actionText,
  onAction,
}) => (
  <div
    style={{
      padding: '14px 18px',
      background: 'var(--color-green-light)',
      border: '1px solid var(--color-green-border)',
      borderRadius: 'var(--radius-sm)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 14,
    }}
  >
    <div style={{ flex: 1, minWidth: 260 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
        <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--color-green-deep)', textTransform: 'uppercase', fontFamily: 'JetBrains Mono, monospace' }}>
          {title}
        </span>
        {confidence && (
          <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-green-deep)', background: '#FFFFFF', padding: '1px 6px', borderRadius: 4, border: '1px solid var(--color-green-border)' }}>
            {confidence}% Confidence
          </span>
        )}
      </div>
      <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-green-deep)', margin: 0 }}>
        "{recommendation}"
      </p>
      {impactExplanation && (
        <p style={{ fontSize: 12, color: 'var(--color-green-deep)', opacity: 0.85, marginTop: 3, margin: 0 }}>
          {impactExplanation}
        </p>
      )}
    </div>

    {actionText && onAction && (
      <button
        onClick={onAction}
        className="ag-btn-primary"
        style={{ padding: '6px 14px', fontSize: 12 }}
      >
        {actionText} <ArrowRight size={13} />
      </button>
    )}
  </div>
);

/* ── 6. AlertRow ── */
export interface AlertRowProps {
  medicine: string;
  location: string;
  stockLevel: string;
  stockoutTime: string;
  risk: RiskLevel;
  actionText: string;
  onAction: () => void;
}

export const AlertRow: React.FC<AlertRowProps> = ({
  medicine,
  location,
  stockLevel,
  stockoutTime,
  risk,
  actionText,
  onAction,
}) => {
  const borderColor =
    risk === 'CRITICAL' || risk === 'HIGH'
      ? 'var(--color-critical)'
      : risk === 'MEDIUM'
      ? 'var(--color-warning)'
      : 'var(--color-green)';

  return (
    <div
      style={{
        padding: '12px 18px',
        background: '#FFFFFF',
        border: '1px solid var(--border-default)',
        borderLeft: `4px solid ${borderColor}`,
        borderRadius: 'var(--radius-sm)',
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr 1fr 1fr 1.2fr auto',
        alignItems: 'center',
        gap: 16,
      }}
    >
      <div>
        <p style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
          {medicine}
        </p>
        <p style={{ fontSize: 11.5, color: 'var(--text-secondary)', marginTop: 2, margin: 0 }}>
          {location}
        </p>
      </div>

      <div>
        <span style={{ fontSize: 10.5, color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>
          Stock Level
        </span>
        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'JetBrains Mono' }}>
          {stockLevel}
        </span>
      </div>

      <div>
        <span style={{ fontSize: 10.5, color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>
          Predicted Stock-out
        </span>
        <span
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: risk === 'CRITICAL' || risk === 'HIGH' ? 'var(--color-critical)' : 'var(--text-primary)',
            fontFamily: 'JetBrains Mono',
          }}
        >
          {stockoutTime}
        </span>
      </div>

      <div>
        <span style={{ fontSize: 10.5, color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>
          Risk
        </span>
        <RiskBadge level={risk} />
      </div>

      <div>
        <span style={{ fontSize: 10.5, color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>
          Recommended Action
        </span>
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>
          {actionText}
        </span>
      </div>

      <button
        onClick={onAction}
        className={risk === 'CRITICAL' || risk === 'HIGH' ? 'ag-btn-primary' : 'ag-btn-secondary'}
        style={{ padding: '6px 14px', fontSize: 12 }}
      >
        Execute
      </button>
    </div>
  );
};

/* ── 7. FilterBar ── */
export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterBarProps {
  searchValue: string;
  onSearchChange: (val: string) => void;
  searchPlaceholder?: string;
  filters?: {
    id: string;
    label: string;
    value: string;
    options: FilterOption[];
    onChange: (val: string) => void;
  }[];
  actions?: React.ReactNode;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search...',
  filters = [],
  actions,
}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 10,
      padding: '10px 14px',
      background: '#FFFFFF',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-sm)',
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 240 }}>
      <input
        type="text"
        value={searchValue}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={searchPlaceholder}
        style={{
          width: '100%',
          maxWidth: 320,
          padding: '6px 12px',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-default)',
          background: 'var(--bg-surface-elevated)',
          fontSize: 12.5,
          color: 'var(--text-primary)',
          outline: 'none',
        }}
      />

      {filters.map((f) => (
        <select
          key={f.id}
          value={f.value}
          onChange={(e) => f.onChange(e.target.value)}
          style={{
            padding: '6px 10px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-default)',
            background: '#FFFFFF',
            fontSize: 12,
            fontWeight: 600,
            color: 'var(--text-primary)',
            cursor: 'pointer',
            outline: 'none',
          }}
        >
          {f.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ))}
    </div>

    {actions && (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {actions}
      </div>
    )}
  </div>
);

/* ── 8. EmptyState (Section 18) ── */
export interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'NO ACTIVE INCIDENTS',
  description = 'The healthcare network is operating normally within standard resilience thresholds.',
  icon,
  actionText,
  onAction,
}) => (
  <div
    className="ag-card"
    style={{
      padding: '48px 24px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      gap: 12,
    }}
  >
    <div
      style={{
        width: 48,
        height: 48,
        borderRadius: '50%',
        background: 'var(--color-green-light)',
        border: '1px solid var(--color-green-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--color-green)',
      }}
    >
      {icon || <Shield size={24} />}
    </div>
    <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.01em', margin: 0 }}>
      {title}
    </h3>
    <p style={{ fontSize: 13, color: 'var(--text-secondary)', maxWidth: 440, margin: 0 }}>
      {description}
    </p>
    {actionText && onAction && (
      <button onClick={onAction} className="ag-btn-secondary" style={{ marginTop: 8 }}>
        {actionText}
      </button>
    )}
  </div>
);

/* ── 9. ErrorBanner (Section 20) ── */
export interface ErrorBannerProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({
  title = 'DATA SYNC INTERRUPTED',
  description = 'Latest facility telemetry was received 7 minutes ago.',
  onRetry,
}) => (
  <div
    style={{
      padding: '12px 18px',
      background: 'var(--color-critical-light)',
      border: '1px solid var(--color-critical-border)',
      borderRadius: 'var(--radius-sm)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <AlertTriangle size={18} color="var(--color-critical)" />
      <div>
        <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-critical)', margin: 0 }}>
          {title}
        </p>
        <p style={{ fontSize: 12, color: 'var(--color-critical)', opacity: 0.9, marginTop: 1, margin: 0 }}>
          {description}
        </p>
      </div>
    </div>
    {onRetry && (
      <button
        onClick={onRetry}
        style={{
          padding: '5px 12px',
          background: '#FFFFFF',
          border: '1px solid var(--color-critical-border)',
          borderRadius: 4,
          fontSize: 12,
          fontWeight: 700,
          color: 'var(--color-critical)',
          cursor: 'pointer',
        }}
      >
        Retry Sync
      </button>
    )}
  </div>
);

/* ── 10. Drawer (Section 22) ── */
export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
}) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        justifyContent: 'flex-end',
        background: 'rgba(11, 18, 32, 0.4)',
        backdropFilter: 'blur(3px)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 440,
          height: '100%',
          background: '#FFFFFF',
          boxShadow: 'var(--shadow-dropdown)',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-default)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>{title}</h3>
            {subtitle && <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2, margin: 0 }}>{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: 4 }}
          >
            <X size={16} />
          </button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
          {children}
        </div>
      </div>
    </div>
  );
};
