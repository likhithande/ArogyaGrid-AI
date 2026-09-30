/**
 * Unified Live WebSocket Service for ArogyaGrid AI
 * Connects to /ws/live with robust exponential backoff auto-reconnect.
 */

export type LiveSocketStatus = 'CONNECTED' | 'RECONNECTING' | 'DISCONNECTED';

export interface LiveEventMessage {
  type: string;
  timestamp: string;
  [key: string]: any;
}

type Listener = (data: LiveEventMessage) => void;
type StatusListener = (status: LiveSocketStatus, lastSyncTime?: string) => void;

class LiveSocketService {
  private ws: WebSocket | null = null;
  private listeners: Set<Listener> = new Set();
  private statusListeners: Set<StatusListener> = new Set();
  private status: LiveSocketStatus = 'DISCONNECTED';
  private lastSyncTime: string = '';
  private reconnectAttempts = 0;
  private reconnectTimer: any = null;
  private isExplicitlyClosed = false;

  constructor() {
    this.updateLastSyncTime();
  }

  private updateLastSyncTime() {
    const d = new Date();
    const timeStr = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).format(d);
    this.lastSyncTime = `${timeStr} IST`;
  }

  public connect() {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }

    this.isExplicitlyClosed = false;
    this.setStatus('RECONNECTING');

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host || 'localhost:8000';
    const url = `${protocol}//${host}/ws/live`;

    try {
      this.ws = new WebSocket(url);

      this.ws.onopen = () => {
        this.reconnectAttempts = 0;
        this.updateLastSyncTime();
        this.setStatus('CONNECTED');
      };

      this.ws.onmessage = (event) => {
        this.updateLastSyncTime();
        try {
          const parsed: LiveEventMessage = JSON.parse(event.data);
          this.notifyListeners(parsed);
        } catch {
          // Non-JSON message or raw ping
        }
      };

      this.ws.onerror = () => {
        // Socket error handled in onclose
      };

      this.ws.onclose = () => {
        if (!this.isExplicitlyClosed) {
          this.setStatus('RECONNECTING');
          this.scheduleReconnect();
        } else {
          this.setStatus('DISCONNECTED');
        }
      };
    } catch {
      this.scheduleReconnect();
    }
  }

  private scheduleReconnect() {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    const delay = Math.min(1000 * Math.pow(1.5, this.reconnectAttempts), 8000);
    this.reconnectAttempts++;

    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, delay);
  }

  public disconnect() {
    this.isExplicitlyClosed = true;
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.setStatus('DISCONNECTED');
  }

  private setStatus(status: LiveSocketStatus) {
    this.status = status;
    this.statusListeners.forEach((listener) => listener(status, this.lastSyncTime));
  }

  private notifyListeners(data: LiveEventMessage) {
    this.listeners.forEach((listener) => {
      try {
        listener(data);
      } catch (err) {
        console.error('Error in liveSocket listener', err);
      }
    });
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    if (this.status === 'DISCONNECTED') {
      this.connect();
    }
    return () => {
      this.listeners.delete(listener);
    };
  }

  public subscribeStatus(listener: StatusListener): () => void {
    this.statusListeners.add(listener);
    listener(this.status, this.lastSyncTime);
    return () => {
      this.statusListeners.delete(listener);
    };
  }

  public getStatus(): LiveSocketStatus {
    return this.status;
  }

  public getLastSyncTime(): string {
    return this.lastSyncTime;
  }

  public send(msg: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(typeof msg === 'string' ? msg : JSON.stringify(msg));
    }
  }
}

export const liveSocket = new LiveSocketService();
