import React, { useState, useEffect } from 'react';
import {
  Flame, Clock, CheckSquare, FileText, BookOpen, AlertOctagon,
  Users, MessageSquare, Send, CheckCircle2, ShieldAlert,
  ArrowRight, Sparkles, Filter, ChevronRight, AlertTriangle
} from 'lucide-react';
import {
  fetchCrisisTimeline, fetchIncidentTasks, fetchPostMortemInsight
} from '../services/api';
import {
  CrisisTimelineEvent, IncidentTask, PostMortemInsight
} from '../types';

export const IncidentWarRoomView: React.FC = () => {
  const [timeline, setTimeline] = useState<CrisisTimelineEvent[]>([]);
  const [tasks, setTasks] = useState<IncidentTask[]>([]);
  const [postMortem, setPostMortem] = useState<PostMortemInsight | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Tabs
  const [activeTab, setActiveTab] = useState<'timeline' | 'tasks' | 'postmortem' | 'lessons'>('timeline');

  // New task input
  const [newTaskTitle, setNewTaskTitle] = useState<string>('');
  const [newTaskAssignee, setNewTaskAssignee] = useState<string>('Dr. K. Srinivas');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [tl, ts, pm] = await Promise.all([
        fetchCrisisTimeline(),
        fetchIncidentTasks(),
        fetchPostMortemInsight()
      ]);
      setTimeline(tl);
      setTasks(ts);
      setPostMortem(pm);
      setLoading(false);
    }
    loadData();
  }, []);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const newTask: IncidentTask = {
      id: `TASK-0${tasks.length + 1}`,
      title: newTaskTitle.trim(),
      assignee: newTaskAssignee,
      status: 'OPEN',
      priority: 'HIGH'
    };
    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
  };

  const handleToggleTaskStatus = (taskId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const nextStatus = t.status === 'OPEN' ? 'INVESTIGATING' :
          t.status === 'INVESTIGATING' ? 'MITIGATING' :
          t.status === 'MITIGATING' ? 'RECOVERING' : 'CLOSED';
        return { ...t, status: nextStatus };
      }
      return t;
    }));
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
      <div className="rounded-2xl border border-rose-800/40 bg-gradient-to-r from-slate-900 via-slate-900 to-rose-950/50 p-6 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-rose-500/20 px-3 py-0.5 text-xs font-semibold text-rose-400 border border-rose-500/30">
                MODULES 40, 41, 42, 43, 44
              </span>
              <span className="rounded-full bg-red-500/20 px-3 py-0.5 text-xs font-semibold text-red-400 border border-red-500/30">
                INCIDENT ROOM: FLOOD-2026-001 ACTIVE
              </span>
            </div>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-white lg:text-3xl">
              Tactical AI Incident Room & Crisis Post-Mortem
            </h1>
            <p className="mt-1 text-sm text-slate-300">
              Dedicated collaborative emergency room for active disasters, real-time crisis timelines, task orchestration, AI post-mortems, and historical lessons-learned.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'timeline', label: 'Crisis Timeline' },
              { id: 'tasks', label: 'Incident Collaboration Tasks' },
              { id: 'postmortem', label: 'AI Incident Post-Mortem' },
              { id: 'lessons', label: 'Lessons-Learned Engine' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30 font-bold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* TAB 1: CRISIS TIMELINE */}
      {activeTab === 'timeline' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl backdrop-blur-md">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Clock className="h-5 w-5 text-rose-400" />
                Live Incident Response Timeline (FLOOD-2026-001)
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Minute-by-minute autonomous telemetry from initial meteorological anomaly detection to emergency redistribution arrival.
              </p>
            </div>

            <div className="mt-6 space-y-4">
              {timeline.map((item, idx) => (
                <div
                  key={idx}
                  className="relative flex items-start gap-4 rounded-xl border border-slate-800 bg-slate-950/70 p-4 transition-all hover:border-slate-700"
                >
                  <div className="flex flex-col items-center">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 font-mono text-xs font-bold text-cyan-300">
                      {idx + 1}
                    </span>
                    {idx < timeline.length - 1 && (
                      <div className="h-10 w-0.5 bg-slate-800 mt-2" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-rose-400">{item.time_str}</span>
                        <span className="text-xs font-bold text-white">&bull; {item.event_title}</span>
                      </div>
                      <span className={`rounded px-2 py-0.5 text-[9px] font-bold ${
                        item.status === 'DONE' ? 'bg-emerald-500/20 text-emerald-400' :
                        item.status === 'IN_PROGRESS' ? 'bg-cyan-500/20 text-cyan-400 animate-pulse' :
                        'bg-slate-800 text-slate-400'
                      }`}>
                        {item.status}
                      </span>
                    </div>

                    <p className="mt-1.5 text-xs text-slate-300">{item.description}</p>
                    <span className="mt-1 block text-[10px] text-slate-500">Unit: {item.department}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: INCIDENT TASKS & COLLABORATION */}
      {activeTab === 'tasks' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl backdrop-blur-md">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <CheckSquare className="h-5 w-5 text-indigo-400" />
                  Incident Response Collaboration Board
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Assign tasks, escalate containment actions, and update progress across civil administration and healthcare officers.
                </p>
              </div>

              <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-300 mt-2 md:mt-0">
                {tasks.length} Operational Directives
              </span>
            </div>

            {/* Quick Task Creation Form */}
            <form onSubmit={handleAddTask} className="mt-4 flex flex-col md:flex-row gap-3">
              <input
                type="text"
                placeholder="Enter new incident mitigation task..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
              />
              <select
                value={newTaskAssignee}
                onChange={(e) => setNewTaskAssignee(e.target.value)}
                className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
              >
                <option value="Dr. K. Srinivas">Dr. K. Srinivas (DHO)</option>
                <option value="Dr. N. Rajender">Dr. N. Rajender (Emergency)</option>
                <option value="Transport Officer Prasad">Transport Officer Prasad</option>
                <option value="Staff Nurse Shanti">Staff Nurse Shanti</option>
              </select>
              <button
                type="submit"
                className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-500 transition-colors"
              >
                Assign Task
              </button>
            </form>

            <div className="mt-6 space-y-3">
              {tasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-xs">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleToggleTaskStatus(task.id)}
                      className={`h-4 w-4 rounded border flex items-center justify-center transition-colors ${
                        task.status === 'CLOSED'
                          ? 'border-emerald-500 bg-emerald-500 text-slate-950'
                          : 'border-slate-600 hover:border-indigo-400'
                      }`}
                    >
                      {task.status === 'CLOSED' && '✓'}
                    </button>
                    <div>
                      <h4 className={`font-bold ${task.status === 'CLOSED' ? 'line-through text-slate-500' : 'text-white'}`}>
                        {task.title}
                      </h4>
                      <span className="text-[11px] text-slate-400">Assigned: {task.assignee}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`rounded px-2 py-0.5 text-[9px] font-bold ${
                      task.priority === 'CRITICAL' ? 'bg-red-500/20 text-red-400' :
                      task.priority === 'HIGH' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-slate-700 text-slate-300'
                    }`}>
                      {task.priority}
                    </span>

                    <button
                      onClick={() => handleToggleTaskStatus(task.id)}
                      className="rounded bg-slate-800 px-2 py-1 text-[10px] font-mono text-cyan-300 hover:bg-slate-700 transition-colors"
                    >
                      {task.status} &rarr;
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: POST-MORTEM AI */}
      {activeTab === 'postmortem' && postMortem && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl backdrop-blur-md">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <FileText className="h-5 w-5 text-teal-400" />
                AI Incident Post-Mortem Report Generator
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Synthesizes root causes, resource deficits, response bottlenecks, and structural preventive recommendations.
              </p>
            </div>

            <div className="mt-6 space-y-4 text-xs">
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Executive Summary</span>
                <p className="mt-1 text-slate-200 text-sm">{postMortem.timeline_summary}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                  <span className="text-rose-400 font-bold uppercase tracking-wider text-[10px]">Root Causes Identified</span>
                  <ul className="mt-2 space-y-1.5 list-disc pl-4 text-slate-300">
                    {postMortem.root_causes.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                  <span className="text-amber-400 font-bold uppercase tracking-wider text-[10px]">Critical Resource Gaps</span>
                  <ul className="mt-2 space-y-1.5 list-disc pl-4 text-slate-300">
                    {postMortem.resource_gaps.map((g, i) => (
                      <li key={i}>{g}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="rounded-xl border border-teal-900/40 bg-teal-950/20 p-4">
                <span className="text-teal-300 font-bold uppercase tracking-wider text-[10px]">AI Preventive SOP Directives</span>
                <ul className="mt-2 space-y-1.5 list-disc pl-4 text-slate-200">
                  {postMortem.preventive_measures.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: LESSONS-LEARNED ENGINE */}
      {activeTab === 'lessons' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl backdrop-blur-md">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-indigo-400" />
                Continuous Lessons-Learned Engine
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Archives previous crisis simulations and uses historical patterns to proactively alert operators during new developing emergencies.
              </p>
            </div>

            <div className="mt-6 space-y-4">
              {[
                { incident: "CYCLONE-MICHAUNG-2023", lesson: "Coastal power failures disabled vaccine deep freezers within 18 hours.", ai_inference: "Autonomous trigger now mandates diesel generator refueling confirmation at T-24h." },
                { incident: "DELTA-HEATWAVE-2024", lesson: "Elderly heatstroke admissions tripled daily ORS draw rate across 22 PHCs.", ai_inference: "AI Demand Model now dynamically incorporates land-surface temperature anomalies into reorder points." },
                { incident: "KRISHNA-MONSOON-2025", lesson: "NH-216 Mile 44 bridge became impassable for 4 continuous days.", ai_inference: "System automatically reroutes logistics through State Highway 42 corridor upon 100mm rain alert." }
              ].map((item, idx) => (
                <div key={idx} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-cyan-300 font-bold">{item.incident}</span>
                    <span className="rounded bg-indigo-500/20 px-2 py-0.5 text-[9px] font-bold text-indigo-300">
                      Archived Experience
                    </span>
                  </div>
                  <p className="mt-2 text-slate-300">
                    <strong className="text-slate-400">Historical Lesson:</strong> {item.lesson}
                  </p>
                  <div className="mt-2 rounded-lg bg-indigo-950/30 p-2.5 border border-indigo-900/40 text-[11px] text-indigo-200">
                    <span className="font-semibold text-indigo-400">Proactive Automated Rule:</span> {item.ai_inference}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
