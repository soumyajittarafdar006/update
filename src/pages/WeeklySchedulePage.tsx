import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { Task, DayOfWeek } from '../types';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  MoveRight,
  Filter,
  Grid,
  Table as TableIcon
} from 'lucide-react';
import { TaskModal } from '../components/TaskModal';
import { UpdateProgressModal } from '../components/UpdateProgressModal';

const DAYS_OF_WEEK: DayOfWeek[] = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
];

export const WeeklySchedulePage: React.FC = () => {
  const {
    tasks,
    members,
    currentWeek,
    deleteTask,
    toggleTaskComplete,
    moveTaskWeek,
    getMemberById
  } = useApp();

  const [viewMode, setViewMode] = useState<'calendar' | 'matrix'>('calendar');
  const [selectedWeek, setSelectedWeek] = useState<number>(currentWeek);
  const [memberFilter, setMemberFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [updatingTask, setUpdatingTask] = useState<Task | null>(null);

  const filteredTasks = tasks.filter(task => {
    if (task.week !== selectedWeek) return false;
    if (memberFilter !== 'all' && task.assignedMemberId !== memberFilter) return false;
    if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;
    if (statusFilter !== 'all' && task.status !== statusFilter) return false;
    return true;
  });

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'Critical':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'High':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'Medium':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      default:
        return 'bg-slate-700/40 text-slate-300 border-slate-600/40';
    }
  };

  const getStatusCardBorder = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'border-emerald-500/50 bg-emerald-950/10';
      case 'In Progress':
        return 'border-cyan-500/50 bg-cyan-950/10';
      case 'Blocked':
        return 'border-rose-500/50 bg-rose-950/20';
      default:
        return 'border-slate-800 bg-slate-900/60';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header & Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl font-bold text-white">CanSat Weekly Schedule</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Complete schedule view for all 10 weeks & 5 engineering team member roles.
          </p>
        </div>

        {/* View Mode Switcher + Week Selector + Add Task */}
        <div className="flex items-center flex-wrap gap-3">
          {/* View Mode Buttons */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1">
            <button
              onClick={() => setViewMode('calendar')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'calendar'
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Grid className="w-3.5 h-3.5" /> Day Grid
            </button>
            <button
              onClick={() => setViewMode('matrix')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'matrix'
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" /> 10-Week Matrix
            </button>
          </div>

          {/* Week Switcher (only for calendar view) */}
          {viewMode === 'calendar' && (
            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1">
              <button
                onClick={() => setSelectedWeek(w => Math.max(1, w - 1))}
                disabled={selectedWeek === 1}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-3 text-xs font-bold text-cyan-400 font-mono">
                Week {selectedWeek} of 10
              </span>
              <button
                onClick={() => setSelectedWeek(w => Math.min(10, w + 1))}
                disabled={selectedWeek === 10}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-xs font-bold text-white flex items-center gap-2 shadow-lg shadow-cyan-600/30 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" /> Add Task
          </button>
        </div>
      </div>

      {/* MATRIX VIEW TABLE */}
      {viewMode === 'matrix' ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 overflow-x-auto">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
                Full 10-Week Master Schedule Matrix
              </h2>
              <p className="text-xs text-slate-400">
                Click any task cell to update progress, edit requirements, or mark complete.
              </p>
            </div>
            <span className="text-xs text-cyan-400 font-mono font-bold">50 Master Tasks</span>
          </div>

          <table className="w-full text-left text-xs border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase font-mono text-[11px]">
                <th className="p-3 w-16 text-center">Week</th>
                {members.map(m => (
                  <th key={m.id} className="p-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded bg-indigo-600 text-white font-bold text-[9px] flex items-center justify-center">
                        {m.avatar}
                      </div>
                      <div>
                        <span className="font-bold text-white">{m.name.split(' ')[0]}</span>
                        <span className="text-[10px] text-cyan-400 block font-normal">{m.shortRole}</span>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {Array.from({ length: 10 }, (_, i) => i + 1).map(wNum => {
                const isCurrentWeek = wNum === currentWeek;
                return (
                  <tr
                    key={wNum}
                    className={`transition-colors hover:bg-slate-800/40 ${
                      isCurrentWeek ? 'bg-cyan-950/20' : ''
                    }`}
                  >
                    <td className="p-3 font-mono font-bold text-center">
                      <span className={`px-2 py-1 rounded-lg ${isCurrentWeek ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'bg-slate-800 text-slate-300'}`}>
                        W{wNum}
                      </span>
                    </td>

                    {members.map(m => {
                      const mTask = tasks.find(t => t.assignedMemberId === m.id && t.week === wNum);
                      return (
                        <td key={m.id} className="p-2.5 vertical-top">
                          {mTask ? (
                            <div
                              onClick={() => setUpdatingTask(mTask)}
                              className={`p-2.5 rounded-xl border transition-all cursor-pointer group hover:scale-[1.02] ${getStatusCardBorder(
                                mTask.status
                              )}`}
                            >
                              <div className="flex items-start justify-between gap-1 mb-1">
                                <h4 className="font-bold text-white text-[11px] leading-tight group-hover:text-cyan-300">
                                  {mTask.title}
                                </h4>
                                <span className={`text-[8px] px-1 py-0.2 rounded font-mono ${getPriorityBadge(mTask.priority)}`}>
                                  {mTask.priority}
                                </span>
                              </div>
                              
                              <div className="flex items-center justify-between text-[10px] font-mono mt-2">
                                <span className="text-slate-400">{mTask.status}</span>
                                <span className="font-bold text-cyan-400">{mTask.completionPercentage}%</span>
                              </div>
                              <div className="w-full bg-slate-800 rounded-full h-1 mt-1">
                                <div
                                  className="bg-cyan-400 h-1 rounded-full"
                                  style={{ width: `${mTask.completionPercentage}%` }}
                                />
                              </div>
                            </div>
                          ) : (
                            <div className="p-2.5 text-center text-slate-600 text-[10px] italic bg-slate-950/30 rounded-xl border border-slate-800/50">
                              No task
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <>
          {/* Filters Bar */}
          <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-3 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold pr-2 border-r border-slate-800">
              <Filter className="w-3.5 h-3.5 text-cyan-400" /> Filters:
            </div>

            {/* Member Filter */}
            <select
              value={memberFilter}
              onChange={(e) => setMemberFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs font-medium text-slate-200 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            >
              <option value="all">All Members</option>
              {members.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>

            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs font-medium text-slate-200 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            >
              <option value="all">All Priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs font-medium text-slate-200 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Blocked">Blocked</option>
            </select>
          </div>

          {/* Monday - Sunday Calendar Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3">
            {DAYS_OF_WEEK.map(dayName => {
              const dayTasks = filteredTasks.filter(t => t.day === dayName || (!t.day && dayName === 'Wednesday'));

              return (
                <div
                  key={dayName}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col min-h-[350px]"
                >
                  <div className="pb-2 mb-3 border-b border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-bold text-white uppercase font-mono tracking-wider">
                      {dayName}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-cyan-400">
                      {dayTasks.length}
                    </span>
                  </div>

                  <div className="flex-1 space-y-3">
                    {dayTasks.length === 0 ? (
                      <div className="h-full flex items-center justify-center text-[11px] text-slate-600 italic py-8">
                        No tasks scheduled
                      </div>
                    ) : (
                      dayTasks.map(task => {
                        const member = getMemberById(task.assignedMemberId);
                        return (
                          <div
                            key={task.id}
                            className={`p-3 rounded-xl border transition-all ${getStatusCardBorder(
                              task.status
                            )}`}
                          >
                            <div className="flex items-center justify-between gap-1 mb-2">
                              <div className="flex items-center gap-1.5">
                                <div className="w-5 h-5 rounded bg-indigo-600 text-white font-bold text-[9px] flex items-center justify-center">
                                  {member?.avatar || 'ST'}
                                </div>
                                <span className="text-[10px] text-slate-300 font-bold truncate max-w-[80px]">
                                  {member?.name.split(' ')[0]}
                                </span>
                              </div>
                              <span
                                className={`text-[9px] px-1.5 py-0.5 rounded font-mono border font-semibold ${getPriorityBadge(
                                  task.priority
                                )}`}
                              >
                                {task.priority}
                              </span>
                            </div>

                            <h4 className="text-xs font-bold text-white leading-snug">{task.title}</h4>
                            <p className="text-[10px] text-slate-400 line-clamp-2 mt-1">
                              {task.description}
                            </p>

                            <div className="mt-2">
                              <div className="flex justify-between text-[9px] font-mono mb-1">
                                <span className="text-slate-400">Status: {task.status}</span>
                                <span className="text-cyan-400 font-bold">{task.completionPercentage}%</span>
                              </div>
                              <div className="w-full bg-slate-800 rounded-full h-1">
                                <div
                                  className="bg-cyan-400 h-1 rounded-full"
                                  style={{ width: `${task.completionPercentage}%` }}
                                />
                              </div>
                            </div>

                            {task.blocker && (
                              <div className="mt-2 p-1.5 rounded bg-rose-950/60 border border-rose-800 text-[10px] text-rose-300 flex items-start gap-1">
                                <AlertTriangle className="w-3 h-3 text-rose-400 shrink-0 mt-0.5" />
                                <span className="line-clamp-2">{task.blocker}</span>
                              </div>
                            )}

                            <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between gap-1">
                              <button
                                onClick={() => toggleTaskComplete(task.id)}
                                className="p-1 rounded text-slate-400 hover:text-emerald-400"
                                title="Mark Complete"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setUpdatingTask(task)}
                                className="p-1 rounded text-slate-400 hover:text-cyan-400 text-[10px] font-semibold"
                                title="Update Progress"
                              >
                                Progress
                              </button>
                              <button
                                onClick={() => setEditingTask(task)}
                                className="p-1 rounded text-slate-400 hover:text-white"
                                title="Edit Task"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  const targetWeek = Math.min(10, selectedWeek + 1);
                                  moveTaskWeek(task.id, targetWeek);
                                }}
                                className="p-1 rounded text-slate-400 hover:text-indigo-400"
                                title="Move to Next Week"
                              >
                                <MoveRight className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => deleteTask(task.id)}
                                className="p-1 rounded text-slate-400 hover:text-rose-400"
                                title="Delete Task"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {isCreateModalOpen && (
        <TaskModal defaultWeek={selectedWeek} onClose={() => setIsCreateModalOpen(false)} />
      )}

      {editingTask && (
        <TaskModal task={editingTask} onClose={() => setEditingTask(null)} />
      )}

      {updatingTask && (
        <UpdateProgressModal task={updatingTask} onClose={() => setUpdatingTask(null)} />
      )}
    </div>
  );
};
