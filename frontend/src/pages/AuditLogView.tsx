import React, { useState, useEffect } from 'react';
import {
  History, ShieldCheck, Lock, Search, Filter,
  CheckCircle2, Clock, Terminal, User
} from 'lucide-react';
import { fetchAuditLogs } from '../services/api';
import { AuditLog } from '../types';

export const AuditLogView: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    const list = await fetchAuditLogs();
    setLogs(list);
  };

  const filteredLogs = logs.filter((l) =>
    l.user_name.toLowerCase().includes(search.toLowerCase()) ||
    l.action.toLowerCase().includes(search.toLowerCase()) ||
    l.resource.toLowerCase().includes(search.toLowerCase()) ||
    l.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Cryptographic Audit Trails & Administrative Governance
            </h2>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/80 font-mono font-semibold">
              IMMUTABLE AUDIT LOG
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Tamper-evident record of all manual approvals, emergency activations, threshold modifications, and automated federated rounds.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-emerald-400 font-mono">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>DP-SGD PRIVACY VERIFIED</span>
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by officer name, action keyword, role, or resource..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Logs Table */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-[10px] uppercase font-mono text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Event ID & Timestamp</th>
                <th className="py-3 px-3">Officer & Role</th>
                <th className="py-3 px-3">Action Type</th>
                <th className="py-3 px-4">Resource Target / Directive</th>
                <th className="py-3 px-3">State Transition</th>
                <th className="py-3 px-3">IP / Host</th>
                <th className="py-3 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-850/60 transition-colors">
                  <td className="py-3.5 px-4 font-mono">
                    <div className="font-bold text-cyan-400">{log.id}</div>
                    <div className="text-[10px] text-slate-400">{log.timestamp}</div>
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="font-bold text-white">{log.user_name}</div>
                    <span className="text-[10px] text-slate-400 font-mono">{log.role}</span>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-slate-950 text-slate-300 border border-slate-800">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-200 leading-snug">
                    {log.resource}
                  </td>
                  <td className="py-3.5 px-3 font-mono text-[11px]">
                    <span className="text-slate-400">{log.previous_state || 'N/A'}</span>
                    <span className="text-slate-500 mx-1">→</span>
                    <span className="text-emerald-400 font-bold">{log.new_state}</span>
                  </td>
                  <td className="py-3.5 px-3 font-mono text-slate-400 text-[11px]">
                    {log.ip_address}
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
