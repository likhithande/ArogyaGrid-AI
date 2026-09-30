import React from 'react';
import { useLiveSocket } from '../hooks/useLiveSocket';

interface LiveStatusIndicatorProps {
  showSyncTime?: boolean;
  showDemoNotice?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LiveStatusIndicator: React.FC<LiveStatusIndicatorProps> = ({
  showSyncTime = true,
  showDemoNotice = true,
  className = '',
  size = 'md'
}) => {
  const { isConnected, isReconnecting, lastSyncTime } = useLiveSocket();

  let dotColor = '#10B981'; // Green
  let statusText = 'LIVE';
  let dotAnimation = 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite';

  if (isReconnecting) {
    dotColor = '#F59E0B'; // Amber
    statusText = 'RECONNECTING...';
    dotAnimation = 'pulse 1s infinite';
  } else if (!isConnected) {
    dotColor = '#94A3B8'; // Slate/offline
    statusText = 'OFFLINE';
    dotAnimation = 'none';
  }

  const isSmall = size === 'sm';

  return (
    <div
      className={`live-status-badge ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: isSmall ? 8 : 12,
        padding: isSmall ? '4px 8px' : '6px 12px',
        backgroundColor: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: 8,
        fontSize: isSmall ? 11 : 12,
        color: '#1E293B',
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        lineHeight: 1.2
      }}
    >
      {/* Live Status Pill */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700 }}>
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            backgroundColor: dotColor,
            animation: dotAnimation,
            boxShadow: isConnected ? '0 0 6px rgba(16, 185, 129, 0.6)' : 'none'
          }}
        />
        <span style={{ letterSpacing: '0.04em', color: isConnected ? '#065F46' : '#64748B' }}>
          {statusText}
        </span>
      </div>

      {/* Last Synchronized Timestamp */}
      {showSyncTime && (
        <div
          style={{
            borderLeft: '1px solid #E2E8F0',
            paddingLeft: 8,
            color: '#64748B',
            fontSize: isSmall ? 10 : 11,
            whiteSpace: 'nowrap'
          }}
        >
          <span>Last synchronized: </span>
          <span style={{ fontWeight: 600, color: '#334155', fontVariantNumeric: 'tabular-nums' }}>
            {lastSyncTime || 'Synchronizing...'}
          </span>
        </div>
      )}

      {/* Subtle Demo Notice */}
      {showDemoNotice && (
        <div
          style={{
            borderLeft: '1px solid #E2E8F0',
            paddingLeft: 8,
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            color: '#0284C7',
            background: '#F0F9FF',
            padding: '2px 6px',
            borderRadius: 4
          }}
        >
          DEMO MODE · SYNTHETIC TELEMETRY
        </div>
      )}
    </div>
  );
};

export default LiveStatusIndicator;
