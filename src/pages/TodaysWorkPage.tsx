import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { Task } from '../types';
import { CheckSquare, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { UpdateProgressModal } from '../components/UpdateProgressModal';

export const TodaysWorkPage: React.FC = () => {
  const { members, tasks, currentWeek, toggleTaskComplete } = useApp();
  const [updatingTask, setUpdatingTask] = useState<Task | null>(null);

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

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl font-bold text-white">Today's Assigned Work</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Active daily tasks and progress breakdown for all 5 CanSat team members.
          </p>
        </div>
        <div className="px-3.5 py-1.5 rounded-xl bg-cyan-950/50 border border-cyan-500/30 text-xs text-cyan-300 font-mono">
          Week {currentWeek} Active
        </div>
      </div>

      {/* Member Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {members.map(member => {
          const memberTask =
            tasks.find(t => t.assignedMemberId === member.id && t.week === currentWeek) ||
            tasks.find(t => t.assignedMemberId === member.id);

          return (
            <div
              key={member.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-700 transition-all shadow-xl"
            >
              <div>
                {/* Profile Header */}
                <div className="flex items-center gap-3 pb-3 border-b border-slate-800 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-600 text-white font-bold text-sm flex items-center justify-center shadow-md ring-1 ring-cyan-400/30">
                    {member.avatar}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{member.name}</h3>
                    <p className="text-xs text-cyan-400 font-semibold">{member.role}</p>
                    <span className="text-[10px] text-slate-400 font-mono">{member.team}</span>
                  </div>
                </div>

                {/* Task Body */}
                {memberTask ? (
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-bold text-slate-100">{memberTask.title}</h4>
                      <span
                        className={`text-[10px] px-2.5 py-0.5 rounded-full border font-bold ${getStatusBadge(
                          memberTask.status
                        )}`}
                      >
                        {memberTask.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed">{memberTask.description}</p>

                    {/* Progress Display */}
                    <div>
                      <div className="flex justify-between text-xs font-mono mb-1">
                        <span className="text-slate-400">Progress</span>
                        <span className="font-extrabold text-cyan-400">
                          {memberTask.completionPercentage}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${memberTask.completionPercentage}%` }}
                        />
                      </div>
                    </div>

                    {/* Blocker alert or Notes */}
                    {memberTask.blocker ? (
                      <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-800/60 text-xs text-rose-300 flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="block text-[10px] uppercase font-mono text-rose-400">
                            Blocker Reported:
                          </strong>
                          <span>{memberTask.blocker}</span>
                        </div>
                      </div>
                    ) : memberTask.notes ? (
                      <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 italic">
                        "{memberTask.notes}"
                      </div>
                    ) : null}

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                      <span>Due: {memberTask.dueDate}</span>
                      <span className="font-mono text-cyan-400/90 font-semibold">
                        {memberTask.priority} Priority
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="py-8 text-center text-xs text-slate-500">
                    No active task assigned today.
                  </div>
                )}
              </div>

              {/* Action buttons */}
              {memberTask && (
                <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <button
                    onClick={() => toggleTaskComplete(memberTask.id)}
                    className="text-xs font-semibold text-slate-400 hover:text-emerald-400 flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Toggle Complete
                  </button>
                  <button
                    onClick={() => setUpdatingTask(memberTask)}
                    className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-xs font-bold text-white shadow-md shadow-cyan-600/30 transition-all"
                  >
                    Update Progress
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {updatingTask && (
        <UpdateProgressModal task={updatingTask} onClose={() => setUpdatingTask(null)} />
      )}
    </div>
  );
};
