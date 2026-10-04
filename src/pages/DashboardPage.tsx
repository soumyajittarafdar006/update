import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { Task } from '../types';
import {
  CheckCircle2,
  Clock,
  AlertOctagon,
  TrendingUp,
  Calendar,
  AlertTriangle,
  PlayCircle,
  BarChart2,
  ChevronRight
} from 'lucide-react';
import { UpdateProgressModal } from '../components/UpdateProgressModal';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, PieChart, Pie } from 'recharts';

export const DashboardPage: React.FC<{ setActiveTab: (tab: string) => void }> = ({ setActiveTab }) => {
  const {
    members,
    tasks,
    currentWeek,
    getMemberStatusToday,
    overallCompletionPercentage,
    toggleTaskComplete
  } = useApp();

  const [selectedTaskForUpdate, setSelectedTaskForUpdate] = useState<Task | null>(null);

  // Calculated Stats
  const completedCount = tasks.filter(t => t.status === 'Completed').length;
  const inProgressCount = tasks.filter(t => t.status === 'In Progress').length;
  const pendingCount = tasks.filter(t => t.status === 'Not Started').length;
  const blockedCount = tasks.filter(t => t.status === 'Blocked' || Boolean(t.blocker)).length;

  // Chart Data: Member Progress breakdown
  const memberProgressData = members.map(m => {
    const mTasks = tasks.filter(t => t.assignedMemberId === m.id);
    const avgProg = mTasks.length > 0
      ? Math.round(mTasks.reduce((acc, t) => acc + t.completionPercentage, 0) / mTasks.length)
      : 0;
    return {
      name: m.shortRole,
      fullName: m.name,
      progress: avgProg,
      tasksCount: mTasks.length
    };
  });

  // Task Status Pie Chart Data
  const statusPieData = [
    { name: 'Completed', value: completedCount, color: '#10B981' },
    { name: 'In Progress', value: inProgressCount, color: '#06B6D4' },
    { name: 'Not Started', value: pendingCount, color: '#64748B' },
    { name: 'Blocked', value: blockedCount, color: '#F43F5E' }
  ].filter(d => d.value > 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'In Progress':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      case 'Blocked':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default:
        return 'bg-slate-700/40 text-slate-300 border-slate-600/40';
    }
  };

  const getMemberStatusIcon = (status: string) => {
    switch (status) {
      case 'On Track':
        return <span className="text-emerald-400 font-bold flex items-center gap-1">🟢 On Track</span>;
      case 'Needs Attention':
        return <span className="text-amber-400 font-bold flex items-center gap-1">🟡 Needs Attention</span>;
      case 'Blocked':
        return <span className="text-rose-400 font-bold flex items-center gap-1">🔴 Blocked</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* SECTION 9: AUTOMATIC DAILY STATUS */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 lg:p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <ActivityIcon className="w-4 h-4 text-cyan-400" /> Team Status Today
            </h2>
            <p className="text-xs text-slate-400">
              Live automated status evaluated from overdue tasks, progress rates & reported blockers.
            </p>
          </div>
          <span className="text-xs text-slate-500 font-mono">Auto-Updated</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {members.map(member => {
            const statusToday = getMemberStatusToday(member.id);
            return (
              <div
                key={member.id}
                onClick={() => setActiveTab('workspace')}
                className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600/80 text-white text-xs font-bold flex items-center justify-center shrink-0">
                    {member.avatar}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xs font-bold text-white truncate group-hover:text-cyan-400 transition-colors">
                      {member.name.split(' ')[0]}
                    </h3>
                    <p className="text-[10px] text-slate-400 font-medium">{member.role}</p>
                  </div>
                </div>
                <div className="text-xs mt-1">{getMemberStatusIcon(statusToday)}</div>
                {member.statusReason && (
                  <p className="text-[10px] text-slate-400 mt-1 line-clamp-1 italic">
                    "{member.statusReason}"
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: PROJECT PROGRESS METRICS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Overall Completion Card */}
        <div className="col-span-2 sm:col-span-3 lg:col-span-2 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 border border-cyan-500/30 rounded-2xl p-4 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">
              Overall CanSat Completion
            </span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white font-mono">{overallCompletionPercentage}%</span>
            <span className="text-xs text-slate-400">of 10-Week Goal</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2.5 mt-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${overallCompletionPercentage}%` }}
            />
          </div>
        </div>

        {/* Current Week Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-medium uppercase font-mono">Phase Week</span>
            <Calendar className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-white font-mono">Week {currentWeek}</div>
          <span className="text-[10px] text-indigo-400 font-medium">Architecture Study</span>
        </div>

        {/* Completed Tasks Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-medium uppercase font-mono">Completed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-emerald-400 font-mono">{completedCount}</div>
          <span className="text-[10px] text-slate-400">Verified tasks</span>
        </div>

        {/* In Progress Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-medium uppercase font-mono">In Progress</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-cyan-400 font-mono">{inProgressCount}</div>
          <span className="text-[10px] text-slate-400">Active execution</span>
        </div>

        {/* Blocked Tasks Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-medium uppercase font-mono">Blocked</span>
            <AlertOctagon className="w-4 h-4 text-rose-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-rose-400 font-mono">{blockedCount}</div>
          <span className="text-[10px] text-rose-300 font-medium">Requires resolution</span>
        </div>
      </div>

      {/* SECTION 2: TODAY'S WORK SECTION */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <PlayCircle className="w-5 h-5 text-cyan-400" /> Today's Assigned Tasks
            </h2>
            <p className="text-xs text-slate-400">
              Live view of tasks assigned to each team member for Week {currentWeek}.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('todaysWork')}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            Full Task View <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map(member => {
            const memberTask = tasks.find(t => t.assignedMemberId === member.id && t.week === currentWeek)
              || tasks.find(t => t.assignedMemberId === member.id);

            return (
              <div
                key={member.id}
                className="bg-slate-950/70 border border-slate-800/90 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition-all shadow-sm"
              >
                <div>
                  {/* Member Header */}
                  <div className="flex items-center justify-between pb-2.5 border-b border-slate-800/80 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                        {member.avatar}
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-white">{member.name}</h3>
                        <p className="text-[10px] text-cyan-400 font-semibold">{member.role}</p>
                      </div>
                    </div>
                  </div>

                  {/* Task details */}
                  {memberTask ? (
                    <div className="space-y-2.5">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-semibold text-slate-200 line-clamp-2">
                          {memberTask.title}
                        </h4>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold shrink-0 ${getStatusBadge(
                            memberTask.status
                          )}`}
                        >
                          {memberTask.status}
                        </span>
                      </div>

                      {/* Progress bar */}
                      <div>
                        <div className="flex justify-between text-[11px] mb-1 font-mono">
                          <span className="text-slate-400">Completion</span>
                          <span className="font-bold text-cyan-400">{memberTask.completionPercentage}%</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-cyan-400 h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${memberTask.completionPercentage}%` }}
                          />
                        </div>
                      </div>

                      {/* Short Note or Blocker */}
                      {memberTask.blocker ? (
                        <div className="p-2 rounded-lg bg-rose-950/40 border border-rose-800/50 text-[11px] text-rose-300 flex items-start gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                          <span className="line-clamp-2">{memberTask.blocker}</span>
                        </div>
                      ) : memberTask.notes ? (
                        <p className="text-[11px] text-slate-400 bg-slate-900/60 p-2 rounded-lg border border-slate-800 line-clamp-2 italic">
                          "{memberTask.notes}"
                        </p>
                      ) : null}

                      <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                        <span>Due: {memberTask.dueDate}</span>
                        <span className="font-mono text-cyan-400/80">{memberTask.priority} Priority</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 py-4 text-center">No assigned task today</p>
                  )}
                </div>

                {/* Quick Action */}
                {memberTask && (
                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <button
                      onClick={() => toggleTaskComplete(memberTask.id)}
                      className="text-[11px] font-medium text-slate-400 hover:text-emerald-400 flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Toggle Complete
                    </button>
                    <button
                      onClick={() => setSelectedTaskForUpdate(memberTask)}
                      className="px-3 py-1.5 rounded-lg bg-cyan-600/90 hover:bg-cyan-500 text-[11px] font-bold text-white transition-all shadow-sm"
                    >
                      Update Progress
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* DASHBOARD VISUALIZATION CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Member Progress Comparison */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-cyan-400" /> Member Progress Breakdown
              </h3>
              <p className="text-xs text-slate-400">Average completion % per team member role</p>
            </div>
            <span className="text-xs text-slate-500 font-mono">5 Team Members</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={memberProgressData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} domain={[0, 100]} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    fontSize: '12px',
                    color: '#fff'
                  }}
                  formatter={(val: any) => [`${val}%`, 'Completion']}
                />
                <Bar dataKey="progress" radius={[6, 6, 0, 0]}>
                  {memberProgressData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        index === 0
                          ? '#06B6D4'
                          : index === 1
                          ? '#6366F1'
                          : index === 2
                          ? '#10B981'
                          : index === 3
                          ? '#F59E0B'
                          : '#EC4899'
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Task Status Distribution Pie */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-1">
              Task Status Distribution
            </h3>
            <p className="text-xs text-slate-400 mb-4">Overall project status ratio</p>

            <div className="h-48 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {statusPieData.map((entry, index) => (
                      <Cell key={`pie-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      borderColor: '#334155',
                      borderRadius: '0.75rem',
                      fontSize: '12px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-xs">
            {statusPieData.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-300 font-medium">{item.name}:</span>
                <span className="font-bold text-white font-mono">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal for Update Progress */}
      {selectedTaskForUpdate && (
        <UpdateProgressModal
          task={selectedTaskForUpdate}
          onClose={() => setSelectedTaskForUpdate(null)}
        />
      )}
    </div>
  );
};

function ActivityIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}
