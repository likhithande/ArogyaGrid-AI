import React from 'react';

export interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showTagline?: boolean;
  iconOnly?: boolean;
  lightMode?: boolean;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showTagline = true,
  iconOnly = false,
  lightMode = false,
  className = '',
}) => {
  const iconSize = size === 'sm' ? 26 : size === 'lg' ? 42 : size === 'hero' ? 56 : 34;
  const titleSize = size === 'sm' ? 13 : size === 'lg' ? 18 : size === 'hero' ? 24 : 15;
  const tagSize = size === 'sm' ? 9.5 : size === 'lg' ? 11 : size === 'hero' ? 12 : 10;

  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: size === 'sm' ? 8 : 12,
        userSelect: 'none',
      }}
    >
      {/* ── Minimal healthcare network symbol connecting 4 nodes (Section 1 & 2 Spec) ── */}
      <div
        style={{
          width: iconSize,
          height: iconSize,
          borderRadius: size === 'hero' ? 12 : 8,
          background: 'var(--color-green-light)',
          border: '1px solid var(--color-green-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <svg
          width={iconSize * 0.62}
          height={iconSize * 0.62}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Connecting resilience network pathways */}
          <line x1="6" y1="6" x2="18" y2="6" stroke="#0B8F6A" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="6" y1="18" x2="18" y2="18" stroke="#0B8F6A" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="6" y1="6" x2="6" y2="18" stroke="#0B8F6A" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="18" y1="6" x2="18" y2="18" stroke="#0B8F6A" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="6" y1="6" x2="18" y2="18" stroke="#075E4F" strokeWidth="1.2" strokeDasharray="2 2" />

          {/* 4 network nodes */}
          <circle cx="6" cy="6" r="2.8" fill="#0B8F6A" />
          <circle cx="18" cy="6" r="2.8" fill="#075E4F" />
          <circle cx="6" cy="18" r="2.8" fill="#075E4F" />
          <circle cx="18" cy="18" r="2.8" fill="#0B8F6A" />
        </svg>
      </div>

      {/* ── Typography: AROGYAGRID AI + Healthcare Resilience Intelligence ── */}
      {!iconOnly && (
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
            <span
              style={{
                fontSize: titleSize,
                fontWeight: 800,
                color: 'var(--text-primary)',
                letterSpacing: '-0.02em',
              }}
            >
              AROGYAGRID
            </span>
            <span
              style={{
                fontSize: titleSize * 0.72,
                fontWeight: 800,
                color: 'var(--color-green)',
                fontFamily: 'JetBrains Mono, monospace',
              }}
            >
              AI
            </span>
          </div>

          {showTagline && (
            <span
              style={{
                fontSize: tagSize,
                color: 'var(--text-secondary)',
                fontWeight: 500,
                marginTop: 1,
              }}
            >
              Healthcare Resilience Intelligence
            </span>
          )}
        </div>
      )}
    </div>
  );
};
