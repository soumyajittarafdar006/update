import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { Task, TaskStatus, Priority, DayOfWeek } from '../types';
import { X, Calendar, User, Save, Trash2 } from 'lucide-react';

interface TaskModalProps {
  task?: Task | null;
  defaultWeek?: number;
  onClose: () => void;
}

export const TaskModal: React.FC<TaskModalProps> = ({ task, defaultWeek = 1, onClose }) => {
  const { members, addTask, updateTask, deleteTask } = useApp();

  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [assignedMemberId, setAssignedMemberId] = useState(task?.assignedMemberId || members[0]?.id || 'soumyajit');
  const [week, setWeek] = useState<number>(task?.week || defaultWeek);
  const [day, setDay] = useState<DayOfWeek>(task?.day || 'Wednesday');
  const [startDate] = useState(task?.startDate || new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(task?.dueDate || new Date().toISOString().split('T')[0]);
  const [priority, setPriority] = useState<Priority>(task?.priority || 'High');
  const [status, setStatus] = useState<TaskStatus>(task?.status || 'Not Started');
  const [completionPercentage, setCompletionPercentage] = useState<number>(task?.completionPercentage || 0);
  const [notes, setNotes] = useState(task?.notes || '');
  const [blocker, setBlocker] = useState(task?.blocker || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (task) {
      updateTask(task.id, {
        title,
        description,
        assignedMemberId,
        week,
        day,
        startDate,
        dueDate,
        priority,
        status,
        completionPercentage,
        notes,
        blocker
      });
    } else {
      addTask({
        title,
        description,
        assignedMemberId,
        week,
        day,
        startDate,
        dueDate,
        priority,
        status,
        completionPercentage,
        notes,
        blocker
      });
    }
    onClose();
  };

  const handleDelete = () => {
    if (task && window.confirm(`Are you sure you want to delete '${task.title}'?`)) {
      deleteTask(task.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white">
              {task ? 'Edit CanSat Task' : 'Create New CanSat Task'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Task Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. ESP32-S3 sensor communication"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Description</label>
            <textarea
              rows={3}
              placeholder="Detailed engineering requirements and deliverables..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            />
          </div>

          {/* Assigned Member & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-cyan-400" />
                Assigned Team Member
              </label>
              <select
                value={assignedMemberId}
                onChange={(e) => setAssignedMemberId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-medium text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              >
                {members.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.role})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-medium text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>

          {/* Week & Schedule Day */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Roadmap Week</label>
              <select
                value={week}
                onChange={(e) => setWeek(parseInt(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-medium text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              >
                {Array.from({ length: 10 }, (_, i) => i + 1).map(w => (
                  <option key={w} value={w}>
                    Week {w}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Day of Week</label>
              <select
                value={day}
                onChange={(e) => setDay(e.target.value as DayOfWeek)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-medium text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              >
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Status & Progress % */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-medium text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              >
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Blocked">Blocked</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Completion ({completionPercentage}%)
              </label>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={completionPercentage}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setCompletionPercentage(val);
                  if (val === 100) setStatus('Completed');
                }}
                className="w-full h-2.5 mt-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>
          </div>

          {/* Notes & Blocker */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Progress Notes</label>
              <input
                type="text"
                placeholder="Key technical notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-rose-300 mb-1.5">Blocker Description</label>
              <input
                type="text"
                placeholder="Hardware issues, delay, etc..."
                value={blocker}
                onChange={(e) => setBlocker(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500"
              />
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="pt-3 flex items-center justify-between border-t border-slate-800">
            {task ? (
              <button
                type="button"
                onClick={handleDelete}
                className="px-3.5 py-2 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" /> Delete Task
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
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
                <Save className="w-4 h-4" /> {task ? 'Save Changes' : 'Create Task'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
