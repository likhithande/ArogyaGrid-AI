import React from 'react';
import { useLiveSocket } from '../hooks/useLiveSocket';

export const LiveConnection: React.FC = () => {
  const { isConnected, isReconnecting, lastSyncTime } = useLiveSocket();

  if (isConnected) {
    return null; // Silent when perfectly connected
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 16px',
        background: isReconnecting ? '#FFFBEB' : '#FEF2F2',
        borderBottom: `1px solid ${isReconnecting ? '#FDE68A' : '#FECACA'}`,
        color: isReconnecting ? '#92400E' : '#991B1B',
        fontSize: 12,
        fontWeight: 500,
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: isReconnecting ? '#F59E0B' : '#EF4444',
            animation: 'pulse 1.5s infinite'
          }}
        />
        <span>
          {isReconnecting
            ? 'Backend reconnecting... Offline telemetry fallback active.'
            : 'Backend Disconnected. Running on in-browser simulated telemetry.'}
        </span>
      </div>
      <div style={{ fontSize: 11, opacity: 0.85 }}>
        Last synchronized: {lastSyncTime}
      </div>
    </div>
  );
};

export default LiveConnection;
