import React, { useState, useEffect } from 'react';
import {
  Network, Flame, AlertOctagon, RefreshCw, Truck, ArrowRight,
  ShieldAlert, Activity, CheckCircle2, XCircle, Filter, Zap,
  Layers, MapPin, Eye, Route, ChevronRight, HelpCircle
} from 'lucide-react';
import {
  fetchEcosystemGraph, fetchPropagationSimulation, fetchSmartRoutes, fetchLiveVehicles
} from '../services/api';
import {
  EcosystemNode, EcosystemEdge, PropagationStep, FutureBottleneck,
  SmartRouteItem, LiveMovingVehicle, EcosystemNodeType
} from '../types';

export const HealthcareGraphIntelligenceView: React.FC = () => {
  const [nodes, setNodes] = useState<EcosystemNode[]>([]);
  const [edges, setEdges] = useState<EcosystemEdge[]>([]);
  const [bottlenecks, setBottlenecks] = useState<FutureBottleneck[]>([]);
  const [propagationSteps, setPropagationSteps] = useState<PropagationStep[]>([]);
  const [smartRoutes, setSmartRoutes] = useState<SmartRouteItem[]>([]);
  const [vehicles, setVehicles] = useState<LiveMovingVehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filters & State
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedNode, setSelectedNode] = useState<EcosystemNode | null>(null);
  const [activeTab, setActiveTab] = useState<'graph' | 'propagation' | 'flow' | 'routes'>('graph');
  const [isSimulatingPropagation, setIsSimulatingPropagation] = useState<boolean>(false);
  const [propagationCurrentStep, setPropagationCurrentStep] = useState<number>(0);
  const [isNh216Blocked, setIsNh216Blocked] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [graphData, propData, routeData, vehData] = await Promise.all([
        fetchEcosystemGraph(),
        fetchPropagationSimulation(),
        fetchSmartRoutes(),
        fetchLiveVehicles()
      ]);
      setNodes(graphData.nodes);
      setEdges(graphData.edges);
      setBottlenecks(graphData.bottlenecks);
      setPropagationSteps(propData);
      setSmartRoutes(routeData);
      setVehicles(vehData);
      if (graphData.nodes.length > 0) {
        setSelectedNode(graphData.nodes[7]); // Machilipatnam PHC default
      }
      setLoading(false);
    }
    loadData();
  }, []);

  // Filtered nodes
  const filteredNodes = selectedType === 'ALL'
    ? nodes
    : nodes.filter(n => n.type === selectedType);

  // Trigger automated propagation step progression
  useEffect(() => {
    let timer: any;
    if (isSimulatingPropagation) {
      if (propagationCurrentStep < propagationSteps.length) {
        timer = setTimeout(() => {
          setPropagationCurrentStep(prev => prev + 1);
        }, 1600);
      } else {
        setIsSimulatingPropagation(false);
      }
    }
    return () => clearTimeout(timer);
  }, [isSimulatingPropagation, propagationCurrentStep, propagationSteps.length]);

  const handleStartPropagation = () => {
    setPropagationCurrentStep(1);
    setIsSimulatingPropagation(true);
  };

  const handleResetPropagation = () => {
    setIsSimulatingPropagation(false);
    setPropagationCurrentStep(0);
  };

  const getNodeColor = (type: EcosystemNodeType, status: string) => {
    if (status === 'CRITICAL' || status === 'FAILED' || status === 'BLOCKED') return 'border-red-500 bg-red-950/70 text-red-300';
    if (status === 'WARNING' || status === 'CONGESTED') return 'border-amber-500 bg-amber-950/70 text-amber-300';
    switch (type) {
      case 'STATE': return 'border-indigo-500 bg-indigo-950/70 text-indigo-300';
      case 'DISTRICT': return 'border-blue-500 bg-blue-950/70 text-blue-300';
      case 'WAREHOUSE': return 'border-cyan-500 bg-cyan-950/70 text-cyan-300';
      case 'SUPPLIER': return 'border-purple-500 bg-purple-950/70 text-purple-300';
      case 'PHC': return 'border-emerald-500 bg-emerald-950/70 text-emerald-300';
      case 'MEDICINE': return 'border-teal-500 bg-teal-950/70 text-teal-300';
      case 'BED': return 'border-sky-500 bg-sky-950/70 text-sky-300';
      case 'PERSONNEL': return 'border-violet-500 bg-violet-950/70 text-violet-300';
      case 'ROUTE': return 'border-orange-500 bg-orange-950/70 text-orange-300';
      case 'EMERGENCY': return 'border-rose-500 bg-rose-950/70 text-rose-300';
      case 'DEMAND': return 'border-pink-500 bg-pink-950/70 text-pink-300';
      default: return 'border-slate-700 bg-slate-900 text-slate-300';
    }
  };

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
      <div className="rounded-2xl border border-cyan-800/40 bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/50 p-6 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-cyan-500/20 px-3 py-0.5 text-xs font-semibold text-cyan-400 border border-cyan-500/30">
                MODULE 1, 2, 50, 51, 52
              </span>
              <span className="rounded-full bg-emerald-500/20 px-3 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/30">
                GRAPH ENGINE ONLINE
              </span>
            </div>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-white lg:text-3xl">
              Healthcare Graph Intelligence & Risk Propagation
            </h1>
            <p className="mt-1 text-sm text-slate-300">
              Topological digital twin connecting 11 entity types: PHCs, Districts, Warehouses, Suppliers, Medicines, Beds, Personnel, Routes, Emergencies, and Patient Demand.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab('graph')}
              className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                activeTab === 'graph'
                  ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/25'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Interactive Graph
            </button>
            <button
              onClick={() => setActiveTab('propagation')}
              className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                activeTab === 'propagation'
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/25'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Risk Propagation Simulator
            </button>
            <button
              onClick={() => setActiveTab('flow')}
              className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                activeTab === 'flow'
                  ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/25'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Resource Flow & Live Vehicles
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: INTERACTIVE GRAPH EXPLORER */}
      {activeTab === 'graph' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main Visual Graph Panel */}
          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg backdrop-blur-md">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <Network className="h-5 w-5 text-cyan-400" />
                  <h2 className="text-base font-semibold text-white">Ecosystem Topological Canvas</h2>
                  <span className="text-xs text-slate-400">({filteredNodes.length} Nodes, {edges.length} Relationships)</span>
                </div>

                {/* Filter Selector */}
                <div className="flex items-center gap-2">
                  <Filter className="h-3.5 w-3.5 text-slate-400" />
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs text-white focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="ALL">All 11 Entity Types</option>
                    <option value="PHC">PHCs</option>
                    <option value="DISTRICT">Districts</option>
                    <option value="WAREHOUSE">Warehouses</option>
                    <option value="SUPPLIER">Suppliers</option>
                    <option value="MEDICINE">Medicines</option>
                    <option value="ROUTE">Routes</option>
                    <option value="EMERGENCY">Emergencies</option>
                  </select>
                </div>
              </div>

              {/* Node Cluster Grid Visualization */}
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {filteredNodes.map((node) => {
                  const isSelected = selectedNode?.id === node.id;
                  const colorClass = getNodeColor(node.type, node.status);
                  return (
                    <button
                      key={node.id}
                      onClick={() => setSelectedNode(node)}
                      className={`relative flex flex-col items-start rounded-xl border p-3 text-left transition-all duration-200 ${colorClass} ${
                        isSelected ? 'ring-2 ring-cyan-400 scale-[1.03] shadow-lg' : 'hover:scale-[1.01]'
                      }`}
                    >
                      <div className="flex w-full items-center justify-between">
                        <span className="rounded px-1.5 py-0.5 text-[9px] font-bold tracking-wider uppercase bg-black/40">
                          {node.type}
                        </span>
                        <span className={`h-2 w-2 rounded-full ${
                          node.status === 'CRITICAL' || node.status === 'BLOCKED' ? 'bg-red-400 animate-ping' :
                          node.status === 'WARNING' ? 'bg-amber-400' : 'bg-emerald-400'
                        }`} />
                      </div>
                      <span className="mt-2 line-clamp-2 text-xs font-bold leading-snug text-white">
                        {node.name}
                      </span>
                      <div className="mt-2 flex w-full items-center justify-between text-[10px] text-slate-300">
                        <span>Risk: {node.risk_score}/100</span>
                        <span>{node.connections_count} links</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Graph Relationships / Edges Explorer */}
              <div className="mt-6 border-t border-slate-800 pt-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Critical Dependency Corridors & Choke Points
                </h3>
                <div className="mt-3 space-y-2 max-h-56 overflow-y-auto pr-1">
                  {edges.map((edge) => {
                    const src = nodes.find(n => n.id === edge.source);
                    const tgt = nodes.find(n => n.id === edge.target);
                    return (
                      <div
                        key={edge.id}
                        className={`flex items-center justify-between rounded-lg border px-3 py-2 text-xs transition-colors ${
                          edge.is_bottleneck
                            ? 'border-red-900/50 bg-red-950/20 text-red-200'
                            : 'border-slate-800 bg-slate-950/50 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white">{src?.name || edge.source}</span>
                          <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-mono text-cyan-400">
                            --[{edge.relationship}]--&gt;
                          </span>
                          <span className="font-semibold text-white">{tgt?.name || edge.target}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          {edge.latency_hrs > 0 && (
                            <span className="text-[11px] text-slate-400">+{edge.latency_hrs}h latency</span>
                          )}
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                            edge.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-400' :
                            edge.status === 'CONGESTED' ? 'bg-amber-500/20 text-amber-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {edge.status}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: Selected Node Details & Bottleneck Forecasting */}
          <div className="space-y-4">
            {selectedNode && (
              <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg backdrop-blur-md">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="rounded-full bg-cyan-500/20 px-2.5 py-0.5 text-xs font-semibold text-cyan-400">
                    {selectedNode.type} NODE
                  </span>
                  <span className={`text-xs font-bold ${
                    selectedNode.status === 'CRITICAL' ? 'text-red-400' :
                    selectedNode.status === 'WARNING' ? 'text-amber-400' : 'text-emerald-400'
                  }`}>
                    {selectedNode.status} STATUS
                  </span>
                </div>

                <h3 className="mt-3 text-lg font-bold text-white">{selectedNode.name}</h3>
                <p className="mt-1 text-xs text-slate-300">{selectedNode.details}</p>

                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-lg bg-slate-950 p-2.5 border border-slate-800">
                    <span className="text-slate-400">Vulnerability Score</span>
                    <p className="mt-1 text-base font-bold text-rose-400">{selectedNode.risk_score} / 100</p>
                  </div>
                  <div className="rounded-lg bg-slate-950 p-2.5 border border-slate-800">
                    <span className="text-slate-400">Connected Hubs</span>
                    <p className="mt-1 text-base font-bold text-cyan-400">{selectedNode.connections_count} Corridors</p>
                  </div>
                </div>

                {/* Algorithmic Node Role */}
                <div className="mt-4 rounded-xl border border-cyan-900/40 bg-cyan-950/20 p-3 text-xs text-cyan-200">
                  <div className="flex items-center gap-1.5 font-semibold text-cyan-300">
                    <Zap className="h-3.5 w-3.5" />
                    <span>Graph Centrality Metric</span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-300">
                    Degree Centrality: 0.84 | Betweenness: 0.72. Node acts as a primary bridge between inland district reserves and coastal dispensaries.
                  </p>
                </div>
              </div>
            )}

            {/* Predictive Bottleneck Forecast Box */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg backdrop-blur-md">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <AlertOctagon className="h-4 w-4 text-amber-400" />
                <h3 className="text-sm font-semibold text-white">Predictive Bottleneck Forecasting (5-Day Horizon)</h3>
              </div>
              <div className="mt-3 space-y-3">
                {bottlenecks.map((bot) => (
                  <div key={bot.id} className="rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{bot.facility_name}</span>
                      <span className="rounded bg-rose-500/20 px-2 py-0.5 text-[10px] font-bold text-rose-400">
                        {bot.risk_window}
                      </span>
                    </div>
                    <div className="mt-2 space-y-1 text-slate-300 text-[11px]">
                      <div className="flex justify-between">
                        <span>Current Utilization:</span>
                        <span className="font-semibold text-white">{bot.current_utilization_pct}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Projected Utilization (T+5d):</span>
                        <span className="font-semibold text-rose-400">{bot.predicted_utilization_5d}% (OVERLOAD)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Expected Inflow / Demand:</span>
                        <span className="text-slate-400">{bot.expected_inflow} in / {bot.expected_demand} draw</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: GRAPH-BASED RISK PROPAGATION SIMULATOR */}
      {activeTab === 'propagation' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl backdrop-blur-md">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Flame className="h-5 w-5 text-rose-500" />
                  Systemic Failure Propagation Simulator
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Models cascading disruptions from Warehouse/Supplier failures down to frontline clinic shortages and hospital bed saturation.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleStartPropagation}
                  disabled={isSimulatingPropagation}
                  className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-rose-600/30 hover:bg-rose-500 disabled:opacity-50"
                >
                  {isSimulatingPropagation ? 'Simulating Wave...' : 'Trigger Failure Cascade'}
                </button>
                <button
                  onClick={handleResetPropagation}
                  className="rounded-xl bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Step-by-Step Cascading Propagation Chain */}
            <div className="mt-6 space-y-4">
              {propagationSteps.map((step, idx) => {
                const isActive = propagationCurrentStep >= step.step_num;
                return (
                  <div
                    key={step.step_num}
                    className={`relative rounded-xl border p-4 transition-all duration-300 ${
                      isActive
                        ? 'border-rose-500/80 bg-rose-950/30 shadow-lg shadow-rose-950/50'
                        : 'border-slate-800/80 bg-slate-950/40 opacity-40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-black ${
                          isActive ? 'bg-rose-500 text-white animate-pulse' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {step.step_num}
                        </span>
                        <div>
                          <span className="text-xs font-mono uppercase tracking-wider text-rose-400">
                            {step.title}
                          </span>
                          <h4 className="text-sm font-bold text-white">{step.facility}</h4>
                        </div>
                      </div>

                      <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        step.severity === 'CATASTROPHIC' ? 'bg-red-500 text-white' :
                        step.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400' :
                        'bg-amber-500/20 text-amber-400'
                      }`}>
                        {step.severity}
                      </span>
                    </div>

                    <p className="mt-2 text-xs text-slate-300 pl-11">
                      {step.effect}
                    </p>

                    {idx < propagationSteps.length - 1 && (
                      <div className="flex justify-center -mb-5 mt-2">
                        <ArrowRight className="h-4 w-4 rotate-90 text-rose-400/60" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: RESOURCE FLOW & LIVE MOVEMENT */}
      {activeTab === 'flow' && (
        <div className="space-y-6">
          {/* Multi-Echelon Animated Flow Pipeline */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl backdrop-blur-md">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="h-5 w-5 text-emerald-400" />
              Multi-Echelon Pharmaceutical Flow Pipeline
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Deterministic flow from National & Regional API manufacturers down to Primary Health Centres.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-6">
              {[
                { stage: "Tier-1 Suppliers", entity: "Cipla / Dr. Reddy's", status: "Active (2.5d Delay)", color: "border-purple-500/50 bg-purple-950/20" },
                { stage: "Apex National Hub", entity: "Vijayawada Center", status: "92% Stock Health", color: "border-blue-500/50 bg-blue-950/20" },
                { stage: "State Depots", entity: "Andhra Central Depot", status: "Operational", color: "border-indigo-500/50 bg-indigo-950/20" },
                { stage: "District Stores", entity: "Krishna & Guntur W-17", status: "Choke Point Warning", color: "border-cyan-500/50 bg-cyan-950/20" },
                { stage: "Frontline PHCs", entity: "694 Clinics", status: "89.9% Available", color: "border-emerald-500/50 bg-emerald-950/20" },
                { stage: "Patient Care", entity: "138k Daily Outpatients", status: "High Demand", color: "border-teal-500/50 bg-teal-950/20" }
              ].map((step, i) => (
                <div key={i} className={`rounded-xl border p-3.5 text-center ${step.color}`}>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{step.stage}</span>
                  <h4 className="mt-1 text-xs font-bold text-white">{step.entity}</h4>
                  <span className="mt-2 inline-block rounded bg-black/40 px-2 py-0.5 text-[9px] font-semibold text-slate-300">
                    {step.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Smart Route Failover & Live Moving Vehicles */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Route Failure Simulator */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Route className="h-4 w-4 text-orange-400" />
                  <h3 className="text-sm font-bold text-white">Smart Routing & Route Failure Toggle</h3>
                </div>
                <button
                  onClick={() => setIsNh216Blocked(!isNh216Blocked)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                    isNh216Blocked ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  }`}
                >
                  {isNh216Blocked ? 'NH-216: BLOCKED' : 'NH-216: OPERATIONAL'}
                </button>
              </div>

              <div className="mt-4 space-y-3">
                {smartRoutes.map((rt) => (
                  <div key={rt.id} className="rounded-xl border border-slate-800 bg-slate-950/70 p-3.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{rt.origin} &rarr; {rt.destination}</span>
                      <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-cyan-300">
                        {rt.distance_km} km
                      </span>
                    </div>

                    <div className="mt-2 grid grid-cols-2 gap-2 text-[11px]">
                      <div className="rounded border border-red-900/30 bg-red-950/20 p-2">
                        <span className="text-slate-400">Primary Route:</span>
                        <p className="font-semibold text-rose-300">{rt.primary_route}</p>
                        <span className="text-[10px] text-red-400 font-bold">{isNh216Blocked && rt.id === 'SR-01' ? 'WATERLOGGED / DETOUR ACTIVE' : rt.primary_status}</span>
                      </div>
                      <div className="rounded border border-emerald-900/30 bg-emerald-950/20 p-2">
                        <span className="text-slate-400">AI Alternate Route:</span>
                        <p className="font-semibold text-emerald-300">{rt.alt_route}</p>
                        <span className="text-[10px] text-emerald-400 font-bold">ETA: {rt.eta_hours}h (Clear)</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Moving Transit Vehicles */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-cyan-400" />
                  <h3 className="text-sm font-bold text-white">Live Dispatched Movement Telematics</h3>
                </div>
                <span className="rounded-full bg-cyan-500/20 px-2 py-0.5 text-[10px] font-semibold text-cyan-400">
                  {vehicles.length} Active Convoys
                </span>
              </div>

              <div className="mt-4 space-y-3">
                {vehicles.map((veh) => (
                  <div key={veh.id} className="rounded-xl border border-slate-800 bg-slate-950/70 p-3.5 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-cyan-300">{veh.vehicle_no}</span>
                        <span className={`rounded px-1.5 py-0.5 text-[9px] font-bold ${
                          veh.priority === 'EMERGENCY' ? 'bg-red-500/20 text-red-400' :
                          veh.priority === 'HIGH' ? 'bg-amber-500/20 text-amber-400' :
                          'bg-slate-700 text-slate-300'
                        }`}>
                          {veh.priority}
                        </span>
                      </div>
                      <span className="text-[10px] font-semibold text-emerald-400">{veh.eta_str}</span>
                    </div>

                    <p className="mt-2 text-slate-300 text-[11px]">
                      <span className="text-slate-400">Cargo:</span> {veh.cargo}
                    </p>
                    <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400">
                      <span>From: {veh.origin}</span>
                      <span>To: {veh.destination}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
