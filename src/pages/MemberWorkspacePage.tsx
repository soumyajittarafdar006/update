import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { TaskStatus } from '../types';
import {
  CheckSquare,
  Send,
  Layers,
  FileText,
  CheckCircle2
} from 'lucide-react';
import { UpdateProgressModal } from '../components/UpdateProgressModal';

export const MemberWorkspacePage: React.FC = () => {
  const {
    members,
    activeMemberId,
    tasks,
    dailyLogs,
    currentWeek,
    updateProgress,
    getMemberById,
    toggleTaskComplete
  } = useApp();

  const [selectedMemberId, setSelectedMemberId] = useState<string>(
    activeMemberId === 'admin' ? 'soumyajit' : activeMemberId
  );

  const selectedMember = getMemberById(selectedMemberId) || members[0];

  const memberTasksThisWeek = tasks.filter(
    t => t.assignedMemberId === selectedMember.id && t.week === currentWeek
  );

  const allMemberTasks = tasks.filter(t => t.assignedMemberId === selectedMember.id);
  const memberLogs = dailyLogs.filter(l => l.memberId === selectedMember.id);

  const [selectedTaskId, setSelectedTaskId] = useState<string>(
    memberTasksThisWeek[0]?.id || allMemberTasks[0]?.id || ''
  );

  const activeTask = tasks.find(t => t.id === selectedTaskId);

  const [progressPct, setProgressPct] = useState<number>(activeTask?.completionPercentage || 50);
  const [taskStatus, setTaskStatus] = useState<TaskStatus>(activeTask?.status || 'In Progress');
  const [hours, setHours] = useState<number>(3);
  const [completedText, setCompletedText] = useState<string>('');
  const [blockerText, setBlockerText] = useState<string>('');
  const [nextStepText, setNextStepText] = useState<string>('');

  const [showModal, setShowModal] = useState(false);

  const handleQuickUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTask) return;

    updateProgress(
      activeTask.id,
      progressPct,
      taskStatus,
      completedText || 'Daily progress update',
      hours,
      blockerText,
      nextStepText
    );

    setCompletedText('');
    setBlockerText('');
    setNextStepText('');
    alert(`Progress updated for ${activeTask.title}! Dashboard refreshed.`);
  };

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'Critical': return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
      case 'High': return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      default: return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Member Selector Tabs */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
        <div className="text-xs font-bold text-slate-400 uppercase font-mono mb-3">
          Select Member Workspace
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {members.map(member => {
            const isSelected = member.id === selectedMember.id;
            return (
              <button
                key={member.id}
                onClick={() => {
                  setSelectedMemberId(member.id);
                  const mTask = tasks.find(t => t.assignedMemberId === member.id);
                  if (mTask) setSelectedTaskId(mTask.id);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  isSelected
                    ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/60'
                }`}
              >
                <div className="w-6 h-6 rounded-md bg-slate-950/40 text-white font-bold text-[10px] flex items-center justify-center">
                  {member.avatar}
                </div>
                <span>{member.name}</span>
                <span className="text-[10px] opacity-75">({member.shortRole})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Member Banner Card */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/50 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 via-cyan-500 to-blue-600 text-white font-bold text-xl flex items-center justify-center shadow-lg shadow-cyan-500/20 ring-2 ring-cyan-400/40">
            {selectedMember.avatar}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-white">{selectedMember.name}</h1>
              <span className="text-xs px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-semibold font-mono">
                {selectedMember.role}
              </span>
            </div>
            <p className="text-xs text-cyan-300 font-medium mt-1">
              Team: <span className="text-slate-300">{selectedMember.team}</span>
            </p>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              <strong className="text-slate-300">Responsibility:</strong> {selectedMember.responsibility}
            </p>
          </div>
        </div>

        {/* Member Status Badge */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-right shrink-0">
          <span className="text-[10px] text-slate-500 uppercase font-mono block">Status Today</span>
          <span className="text-sm font-bold text-emerald-400 mt-1 block">
            🟢 {selectedMember.statusToday}
          </span>
          <span className="text-[11px] text-slate-400 mt-1 block font-mono">
            {memberTasksThisWeek.filter(t => t.status === 'Completed').length} / {memberTasksThisWeek.length} Completed
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: THIS WEEK'S ASSIGNED TASKS (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" /> Assigned Tasks (Week {currentWeek})
            </h2>
            <span className="text-xs font-mono text-slate-400">{memberTasksThisWeek.length} Tasks</span>
          </div>

          <div className="space-y-3 max-h-[550px] overflow-y-auto pr-1">
            {memberTasksThisWeek.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">No tasks assigned this week.</p>
            ) : (
              memberTasksThisWeek.map(task => {
                const isSelected = task.id === selectedTaskId;
                return (
                  <div
                    key={task.id}
                    onClick={() => {
                      setSelectedTaskId(task.id);
                      setProgressPct(task.completionPercentage);
                      setTaskStatus(task.status);
                      setCompletedText(task.notes || '');
                      setBlockerText(task.blocker || '');
                    }}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-950/30 border-cyan-500 ring-1 ring-cyan-500/40 shadow-md'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-xs font-bold text-white">{task.title}</h3>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{task.description}</p>

                    <div className="mt-3">
                      <div className="flex justify-between text-[10px] font-mono mb-1">
                        <span className="text-slate-400">Status: {task.status}</span>
                        <span className="text-cyan-400 font-bold">{task.completionPercentage}%</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-cyan-400 h-1.5 rounded-full"
                          style={{ width: `${task.completionPercentage}%` }}
                        />
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
                      <span>Due: {task.dueDate}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleTaskComplete(task.id);
                        }}
                        className="text-xs text-slate-400 hover:text-emerald-400 font-medium flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Toggle
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: TODAY'S UPDATE FORM (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-cyan-400" /> Daily Work & Progress Form
              </h2>
              <p className="text-xs text-slate-400">
                Update progress for <strong className="text-cyan-300">{selectedMember.name}</strong>
              </p>
            </div>
            {activeTask && (
              <button
                onClick={() => setShowModal(true)}
                className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-cyan-400 border border-slate-700"
              >
                Open Full Modal
              </button>
            )}
          </div>

          {activeTask ? (
            <form onSubmit={handleQuickUpdate} className="space-y-4">
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-[10px] uppercase font-mono text-cyan-400 font-bold">
                  Currently Selected Task
                </span>
                <h3 className="text-sm font-bold text-white">{activeTask.title}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{activeTask.description}</p>
              </div>

              {/* Progress Slider */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-200">Progress Percentage</label>
                  <span className="text-lg font-extrabold font-mono text-cyan-400">
                    {progressPct}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={progressPct}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setProgressPct(val);
                    if (val === 100) setTaskStatus('Completed');
                    else if (val > 0 && taskStatus === 'Not Started') setTaskStatus('In Progress');
                  }}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>

              {/* Status & Hours */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Status</label>
                  <select
                    value={taskStatus}
                    onChange={(e) => setTaskStatus(e.target.value as TaskStatus)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-medium text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  >
                    <option value="Not Started">Not Started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Blocked">Blocked</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Hours Worked Today</label>
                  <input
                    type="number"
                    min="0.5"
                    max="16"
                    step="0.5"
                    value={hours}
                    onChange={(e) => setHours(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-medium text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Completed Work */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">What I completed</label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Completed telemetry frame decoding logic..."
                  value={completedText}
                  onChange={(e) => setCompletedText(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                />
              </div>

              {/* Problems / Blockers */}
              <div>
                <label className="block text-xs font-bold text-rose-300 mb-1">Problems / Blockers (if any)</label>
                <input
                  type="text"
                  placeholder="e.g. Waiting for sensor wiring matrix from Hardware team..."
                  value={blockerText}
                  onChange={(e) => {
                    setBlockerText(e.target.value);
                    if (e.target.value.trim()) setTaskStatus('Blocked');
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              {/* Next Steps */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">What I will do next</label>
                <input
                  type="text"
                  placeholder="e.g. Test baud rate synchronization..."
                  value={nextStepText}
                  onChange={(e) => setNextStepText(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-xs font-bold text-white flex items-center gap-2 shadow-lg shadow-cyan-600/30 transition-all"
                >
                  <Send className="w-4 h-4" /> Update Progress
                </button>
              </div>
            </form>
          ) : (
            <p className="text-xs text-slate-500 py-12 text-center">
              Select a task from the left list to update progress.
            </p>
          )}

          {/* Member Recent Daily Logs History */}
          <div className="pt-4 border-t border-slate-800 space-y-2">
            <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-cyan-400" /> Recent Daily Log History
            </h3>
            {memberLogs.length === 0 ? (
              <p className="text-[11px] text-slate-500">No previous work logs recorded.</p>
            ) : (
              <div className="space-y-2 max-h-[180px] overflow-y-auto">
                {memberLogs.map(log => (
                  <div key={log.id} className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-xs">
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                      <span>{log.date}</span>
                      <span className="text-cyan-400 font-bold">{log.progressPercentage}%</span>
                    </div>
                    <p className="text-slate-200 font-medium mt-1">{log.workCompleted}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {showModal && activeTask && (
        <UpdateProgressModal task={activeTask} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
};
