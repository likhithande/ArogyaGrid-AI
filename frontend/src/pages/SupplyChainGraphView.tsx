import React, { useState, useEffect } from 'react';
import {
  GitFork, Truck, Building2, Warehouse, MapPin, AlertTriangle,
  CheckCircle2, ArrowRight, ShieldCheck, Activity, Search
} from 'lucide-react';
import { fetchSupplyChain } from '../services/api';
import { SupplyChainNode, SupplyChainEdge } from '../types';

interface SupplyChainGraphViewProps {
  onOpenCopilot: () => void;
  onNavigateToView: (view: string) => void;
}

export const SupplyChainGraphView: React.FC<SupplyChainGraphViewProps> = ({
  onOpenCopilot,
  onNavigateToView
}) => {
  const [nodes, setNodes] = useState<SupplyChainNode[]>([]);
  const [edges, setEdges] = useState<SupplyChainEdge[]>([]);
  const [selectedNode, setSelectedNode] = useState<SupplyChainNode | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<SupplyChainEdge | null>(null);

  useEffect(() => {
    loadGraph();
  }, []);

  const loadGraph = async () => {
    const data = await fetchSupplyChain();
    setNodes(data.nodes);
    setEdges(data.edges);
    if (data.nodes.length > 0) setSelectedNode(data.nodes[0]);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Healthcare Supply Chain Network Graph
            </h2>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/80 font-mono font-semibold">
              MULTI-ECHELON TOPOLOGY
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Interconnected visualization of central distribution hubs, regional depots, district stores, and frontline rural dispensaries.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Total Nodes:</span>
          <span className="text-xs font-mono font-bold text-cyan-400">{nodes.length} Nodes</span>
          <span className="text-slate-600">•</span>
          <span className="text-xs text-slate-400">Corridors:</span>
          <span className="text-xs font-mono font-bold text-cyan-400">{edges.length} Routes</span>
        </div>
      </div>

      {/* Main Grid: Interactive Graph Layout + Node Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Graph Visual Canvas */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col min-h-[500px]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
            <span className="font-bold text-slate-300">Topological Flow: National Hub → State Depot → District Store → PHC</span>
            <span className="text-slate-400 font-mono text-[11px]">Click nodes to inspect capacity</span>
          </div>

          {/* Abstract Network Graph Layout */}
          <div className="relative flex-1 mt-4 rounded-xl bg-slate-950/80 border border-slate-800/80 p-6 flex flex-col justify-between min-h-[380px] overflow-hidden">
            {/* Level 1: National Central Hub */}
            <div className="flex justify-center">
              {nodes.filter((n) => n.type === 'CENTRAL_HUB').map((node) => (
                <div
                  key={node.id}
                  onClick={() => { setSelectedNode(node); setSelectedEdge(null); }}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 shadow-xl ${
                    selectedNode?.id === node.id
                      ? 'bg-cyan-950 border-cyan-400 ring-2 ring-cyan-500/20'
                      : 'bg-slate-900/90 border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <Warehouse className="w-6 h-6 text-cyan-400" />
                  <div>
                    <div className="text-[10px] text-cyan-400 font-mono font-bold uppercase">National Strategic Hub</div>
                    <div className="font-bold text-white text-xs">{node.name}</div>
                    <div className="text-[10px] text-slate-400">Cap: {node.capacity.toLocaleString()} units • {node.utilization_pct}% Utilized</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Connecting lines indicator */}
            <div className="flex justify-center my-2">
              <div className="w-0.5 h-8 bg-gradient-to-b from-cyan-500 to-slate-700" />
            </div>

            {/* Level 2: State Depots */}
            <div className="flex justify-center gap-4 flex-wrap">
              {nodes.filter((n) => n.type === 'STATE_DEPOT').slice(0, 2).map((node) => (
                <div
                  key={node.id}
                  onClick={() => { setSelectedNode(node); setSelectedEdge(null); }}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center gap-2.5 ${
                    selectedNode?.id === node.id
                      ? 'bg-cyan-950 border-cyan-400 ring-2 ring-cyan-500/20'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <Building2 className="w-5 h-5 text-sky-400" />
                  <div>
                    <div className="text-[9px] text-sky-400 font-mono font-bold uppercase">State Depot</div>
                    <div className="font-bold text-white text-xs">{node.name}</div>
                    <div className="text-[10px] text-slate-400">{node.utilization_pct}% Capacity Used</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Connecting lines indicator */}
            <div className="flex justify-center my-2">
              <div className="w-0.5 h-8 bg-gradient-to-b from-sky-500 to-slate-700" />
            </div>

            {/* Level 3: District Stores */}
            <div className="flex justify-around gap-3 flex-wrap">
              {nodes.filter((n) => n.type === 'DISTRICT_STORE').slice(0, 2).map((node) => (
                <div
                  key={node.id}
                  onClick={() => { setSelectedNode(node); setSelectedEdge(null); }}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center gap-2.5 ${
                    node.stock_health === 'VULNERABLE'
                      ? 'bg-rose-950/40 border-rose-800/80 shadow-rose-950/30'
                      : 'bg-slate-900 border-slate-800'
                  } ${selectedNode?.id === node.id ? 'ring-2 ring-cyan-400' : ''}`}
                >
                  <Warehouse className={`w-5 h-5 ${node.stock_health === 'VULNERABLE' ? 'text-rose-400' : 'text-emerald-400'}`} />
                  <div>
                    <div className="text-[9px] font-mono font-bold uppercase text-slate-400">District Warehouse</div>
                    <div className="font-bold text-white text-xs">{node.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{node.utilization_pct}% Full • {node.stock_health}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Level 4: Frontline PHC Destination */}
            <div className="flex justify-center mt-4">
              {nodes.filter((n) => n.type === 'PHC').map((node) => (
                <div
                  key={node.id}
                  onClick={() => { setSelectedNode(node); setSelectedEdge(null); }}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center gap-2.5 bg-rose-950/60 border-rose-500 ${
                    selectedNode?.id === node.id ? 'ring-2 ring-rose-400' : ''
                  }`}
                >
                  <MapPin className="w-5 h-5 text-rose-400 animate-bounce" />
                  <div>
                    <div className="text-[9px] text-rose-300 font-mono font-bold uppercase">Frontline Target PHC</div>
                    <div className="font-bold text-white text-xs">{node.name}</div>
                    <div className="text-[10px] text-rose-300 font-mono">CRITICAL DEFICIT (3.2d ORS Left)</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Corridors Ticker */}
          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">Highlighted Route Vulnerability:</span>
            <span className="text-rose-400 font-mono font-semibold flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              NH-216 Waterlogged Choke Point (+2.2h transit delay)
            </span>
          </div>
        </div>

        {/* Selected Node / Route Details Card */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div className="pb-3 border-b border-slate-800">
            <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider block">
              Logistics Entity Telemetry
            </span>
            <h3 className="font-bold text-white text-base mt-1">
              {selectedNode ? selectedNode.name : "Select a node"}
            </h3>
            <p className="text-xs text-slate-400">
              Type: {selectedNode?.type.replace('_', ' ')}
            </p>
          </div>

          {selectedNode && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Inventory Count</span>
                  <span className="font-bold text-white font-mono text-sm">
                    {selectedNode.inventory_count.toLocaleString()} units
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Capacity Utilization</span>
                  <span className="font-bold text-cyan-300 font-mono text-sm">
                    {selectedNode.utilization_pct}%
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
                <div className="font-bold text-slate-300">Health & Buffer Status</div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold uppercase ${
                    selectedNode.stock_health === 'HEALTHY'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : 'bg-rose-950 text-rose-300 border border-rose-800'
                  }`}>
                    {selectedNode.stock_health}
                  </span>
                  <span className="text-slate-400 text-[11px]">District {selectedNode.district}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-800/40 text-[11px] text-cyan-300 space-y-1">
                <div className="font-bold">Automated Re-Route Option:</div>
                <p className="text-slate-400">
                  In case of route disruption along NH-216, automated algorithms recommend diverting priority medicine carriers via State Highway 42 (+18 km, +35 mins).
                </p>
              </div>

              <button
                onClick={() => onNavigateToView('redistribution')}
                className="w-full py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Generate Route Transfer Plan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
