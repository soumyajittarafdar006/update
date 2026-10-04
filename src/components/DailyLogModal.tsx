import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { TaskStatus } from '../types';
import { X, FileText, Save } from 'lucide-react';

export const DailyLogModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { members, tasks, activeMemberId, addDailyLog, updateProgress } = useApp();

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [memberId, setMemberId] = useState(activeMemberId === 'admin' ? members[0].id : activeMemberId);

  const memberTasks = tasks.filter(t => t.assignedMemberId === memberId);
  const [taskId, setTaskId] = useState(memberTasks[0]?.id || tasks[0]?.id || '');
  
  const selectedTask = tasks.find(t => t.id === taskId);
  const [taskTitle, setTaskTitle] = useState(selectedTask?.title || '');
  const [workCompleted, setWorkCompleted] = useState('');
  const [progressPercentage, setProgressPercentage] = useState<number>(selectedTask?.completionPercentage || 50);
  const [hoursWorked, setHoursWorked] = useState<number>(3);
  const [status, setStatus] = useState<TaskStatus>(selectedTask?.status || 'In Progress');
  const [blocker, setBlocker] = useState('');
  const [nextStep, setNextStep] = useState('');
  const [attachmentName, setAttachmentName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetTitle = selectedTask?.title || taskTitle || 'General Engineering Task';

    addDailyLog({
      date,
      memberId,
      taskId: taskId || 'general',
      taskTitle: targetTitle,
      workCompleted,
      progressPercentage,
      hoursWorked,
      status,
      blocker,
      nextStep,
      attachmentName
    });

    if (taskId && selectedTask) {
      updateProgress(
        taskId,
        progressPercentage,
        status,
        workCompleted,
        hoursWorked,
        blocker,
        nextStep,
        attachmentName
      );
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white">Add New Daily Work Log</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Team Member</label>
              <select
                value={memberId}
                onChange={(e) => {
                  setMemberId(e.target.value);
                  const mTasks = tasks.filter(t => t.assignedMemberId === e.target.value);
                  if (mTasks.length > 0) setTaskId(mTasks[0].id);
                }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-medium text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              >
                {members.map(m => (
                  <option key={m.id} value={m.id}>{m.name} ({m.role})</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Associated Task</label>
            <select
              value={taskId}
              onChange={(e) => {
                setTaskId(e.target.value);
                const t = tasks.find(x => x.id === e.target.value);
                if (t) {
                  setTaskTitle(t.title);
                  setProgressPercentage(t.completionPercentage);
                  setStatus(t.status);
                }
              }}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-medium text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            >
              {memberTasks.map(t => (
                <option key={t.id} value={t.id}>{t.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Work Completed Today *</label>
            <textarea
              rows={3}
              required
              placeholder="Detailed summary of tasks performed today..."
              value={workCompleted}
              onChange={(e) => setWorkCompleted(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Progress %</label>
              <input
                type="number"
                min="0"
                max="100"
                value={progressPercentage}
                onChange={(e) => setProgressPercentage(parseInt(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Hours Worked</label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                max="16"
                value={hoursWorked}
                onChange={(e) => setHoursWorked(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
              >
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Blocked">Blocked</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-rose-300 mb-1.5">Problems / Blockers (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Component shipping delay or sensor failure..."
              value={blocker}
              onChange={(e) => setBlocker(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Next Step</label>
            <input
              type="text"
              placeholder="e.g. Conduct ground station telemetry range test..."
              value={nextStep}
              onChange={(e) => setNextStep(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Optional Attachment</label>
            <input
              type="text"
              placeholder="e.g. test_results.png or flight_data.csv"
              value={attachmentName}
              onChange={(e) => setAttachmentName(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
            />
          </div>

          <div className="pt-3 flex justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-xs font-bold text-white flex items-center gap-2 shadow-lg shadow-cyan-600/30"
            >
              <Save className="w-4 h-4" /> Save Log Entry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
