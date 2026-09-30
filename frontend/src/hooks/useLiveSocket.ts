import { useState, useEffect, useCallback } from 'react';
import { liveSocket, LiveSocketStatus, LiveEventMessage } from '../services/liveSocket';

export function useLiveSocket(onEvent?: (event: LiveEventMessage) => void) {
  const [status, setStatus] = useState<LiveSocketStatus>(liveSocket.getStatus());
  const [lastSyncTime, setLastSyncTime] = useState<string>(liveSocket.getLastSyncTime());
  const [lastEvent, setLastEvent] = useState<LiveEventMessage | null>(null);

  useEffect(() => {
    liveSocket.connect();

    const unsubscribeStatus = liveSocket.subscribeStatus((newStatus, syncTime) => {
      setStatus(newStatus);
      if (syncTime) setLastSyncTime(syncTime);
    });

    const unsubscribeEvents = liveSocket.subscribe((event) => {
      setLastEvent(event);
      if (event.timestamp) {
        setLastSyncTime(event.timestamp.includes('IST') ? event.timestamp : `${event.timestamp} IST`);
      }
      if (onEvent) {
        onEvent(event);
      }
    });

    return () => {
      unsubscribeStatus();
      unsubscribeEvents();
    };
  }, [onEvent]);

  const send = useCallback((msg: any) => {
    liveSocket.send(msg);
  }, []);

  return {
    status,
    isConnected: status === 'CONNECTED',
    isReconnecting: status === 'RECONNECTING',
    isDisconnected: status === 'DISCONNECTED',
    lastSyncTime,
    lastEvent,
    send
  };
}

export default useLiveSocket;
