import React, { useState, useEffect } from 'react';
import {
  Radio, Activity, Zap, Thermometer, ShieldAlert, Cpu,
  CheckCircle2, Play, Pause, RefreshCw, Layers, ArrowRight
} from 'lucide-react';
import { fetchIotSensorEvents } from '../services/api';
import { IotSensorEvent } from '../types';

export const RealtimeIotStreamView: React.FC = () => {
  const [events, setEvents] = useState<IotSensorEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isStreaming, setIsStreaming] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const ev = await fetchIotSensorEvents();
      setEvents(ev);
      setLoading(false);
    }
    loadData();
  }, []);

  // Live event ticker simulation
  useEffect(() => {
    let interval: any;
    if (isStreaming) {
      interval = setInterval(() => {
        const sampleLocations = ["Machilipatnam PHC", "Tenali CHC", "Avanigadda Clinic", "Guntur Central Store", "Bapatla PHC"];
        const sampleTypes: any[] = ['TEMPERATURE', 'POWER_GRID', 'INVENTORY_SCANNER', 'COLD_STORAGE', 'EQUIPMENT'];
        const randomType = sampleTypes[Math.floor(Math.random() * sampleTypes.length)];
        const randomLoc = sampleLocations[Math.floor(Math.random() * sampleLocations.length)];
        const isAnomaly = Math.random() < 0.25;

        const newEv: IotSensorEvent = {
          sensor_id: `IOT-${randomType.substring(0, 4)}-${Math.floor(10 + Math.random() * 90)}`,
          sensor_type: randomType,
          location: randomLoc,
          reading_value: randomType === 'TEMPERATURE' || randomType === 'COLD_STORAGE'
            ? `${(isAnomaly ? 8.8 + Math.random() * 2 : 3.5 + Math.random() * 3).toFixed(1)}°C`
            : randomType === 'POWER_GRID'
            ? (isAnomaly ? 'Grid Voltage Fluctuation' : '230V Nominal Grid')
            : (isAnomaly ? 'Low Pressure Alert' : 'Nominal Operational'),
          normal_range: randomType === 'TEMPERATURE' || randomType === 'COLD_STORAGE' ? '2.0°C – 8.0°C' : 'Normal Tier',
          is_anomaly: isAnomaly,
          timestamp: 'Just now'
        };

        setEvents(prev => [newEv, ...prev.slice(0, 19)]);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isStreaming]);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl border border-emerald-800/40 bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/50 p-6 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-emerald-500/20 px-3 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/30">
                MODULES 84, 85, 86, 87, 88
              </span>
              <span className="rounded-full bg-cyan-500/20 px-3 py-0.5 text-xs font-semibold text-cyan-400 border border-cyan-500/30">
                REAL-TIME TELEMETRY BUS
              </span>
            </div>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-white lg:text-3xl">
              IoT Sensor Simulator, Event Pipeline & Correlation Engine
            </h1>
            <p className="mt-1 text-sm text-slate-300">
              Live edge stream ingesting temperature, cold-chain ILR, backup power, barcode inventory scanners, and oxygen plants through a 6-stage real-time predictive pipeline.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsStreaming(!isStreaming)}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all flex items-center gap-1.5 ${
                isStreaming
                  ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30'
                  : 'bg-slate-800 text-slate-300'
              }`}
            >
              {isStreaming ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              {isStreaming ? 'Streaming Active' : 'Stream Paused'}
            </button>
          </div>
        </div>
      </div>

      {/* 6-Stage Real-Time Pipeline Visualizer */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl backdrop-blur-md">
        <h2 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
          <Layers className="h-4 w-4 text-emerald-400" />
          6-Stage Real-Time Event Processing Architecture
        </h2>

        <div className="mt-4 grid grid-cols-2 md:grid-cols-6 gap-2 text-center text-xs">
          {[
            { step: "1. INGEST", label: "Edge IoT / EHR", latency: "1.2ms", color: "bg-slate-800" },
            { step: "2. VALIDATE", label: "Schema & DP Clip", latency: "0.8ms", color: "bg-slate-800" },
            { step: "3. TRANSFORM", label: "Window Aggregation", latency: "2.4ms", color: "bg-slate-800" },
            { step: "4. ANALYZE", label: "Z-Score Sentinel", latency: "3.1ms", color: "bg-slate-800" },
            { step: "5. PREDICT", label: "LSTM-FedNet", latency: "14.2ms", color: "bg-teal-950/60 border-teal-500/50" },
            { step: "6. ALERT", label: "Command Center Bus", latency: "0.5ms", color: "bg-emerald-950/60 border-emerald-500/50" }
          ].map((s, idx) => (
            <div key={idx} className={`rounded-xl border border-slate-800 p-3 ${s.color}`}>
              <span className="text-[10px] font-bold font-mono text-cyan-400">{s.step}</span>
              <h4 className="mt-1 font-bold text-white text-xs">{s.label}</h4>
              <span className="text-[10px] text-slate-400 mt-1 block">Latency: {s.latency}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Live Ingesting Sensor Events */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Radio className="h-4 w-4 text-cyan-400 animate-pulse" />
              <h3 className="text-sm font-bold text-white">Live Ingesting Sensor Stream</h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">Sampling every 3.0s</span>
          </div>

          <div className="mt-4 space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
            {events.map((ev, i) => (
              <div
                key={i}
                className={`flex items-center justify-between rounded-xl border p-3 text-xs transition-all ${
                  ev.is_anomaly
                    ? 'border-rose-900/60 bg-rose-950/20 text-rose-200'
                    : 'border-slate-800/80 bg-slate-950/70 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`h-2 w-2 rounded-full ${ev.is_anomaly ? 'bg-rose-400 animate-ping' : 'bg-emerald-400'}`} />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-cyan-300">{ev.sensor_id}</span>
                      <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[9px] font-semibold text-slate-300">
                        {ev.sensor_type}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400">{ev.location}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className={`font-bold ${ev.is_anomaly ? 'text-rose-400 font-mono' : 'text-white'}`}>
                    {ev.reading_value}
                  </div>
                  <span className="text-[10px] text-slate-500">{ev.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: AI Event Correlation Engine */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl backdrop-blur-md">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Zap className="h-4 w-4 text-amber-400" />
              Multivariate Event Correlation Engine
            </h3>
            <p className="mt-2 text-xs text-slate-300">
              Combines disparate telemetry anomalies across domain silos to synthesize root-cause event incident alerts.
            </p>

            <div className="mt-4 space-y-3">
              <div className="rounded-xl border border-rose-900/40 bg-rose-950/20 p-3.5 text-xs">
                <span className="rounded bg-rose-500/20 px-2 py-0.5 text-[9px] font-bold text-rose-400">
                  CORRELATED INCIDENT #4421
                </span>
                <h4 className="mt-1 font-bold text-white text-xs">Cold-Chain Power Depletion Vulnerability</h4>
                <div className="mt-2 space-y-1 text-[11px] text-slate-300">
                  <div>&bull; Signal 1: ILR Temp reached <strong>9.2°C</strong> (Breach &gt; 8°C)</div>
                  <div>&bull; Signal 2: Grid Outage logged (DG fuel at 4 hours)</div>
                  <div>&bull; Signal 3: Patient Footfall up <strong>+38%</strong></div>
                </div>
                <div className="mt-3 rounded bg-black/40 p-2 text-[10px] text-amber-300">
                  AI Action: Dispatched priority mobile DG refuel convoy & alert to District Cold-Chain Officer.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
