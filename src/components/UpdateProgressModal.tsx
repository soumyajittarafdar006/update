import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { Task, TaskStatus } from '../types';
import { X, Clock, AlertTriangle, FileText, Upload, Save } from 'lucide-react';

interface UpdateProgressModalProps {
  task: Task;
  onClose: () => void;
}

export const UpdateProgressModal: React.FC<UpdateProgressModalProps> = ({ task, onClose }) => {
  const { updateProgress, getMemberById } = useApp();
  const assignedMember = getMemberById(task.assignedMemberId);

  const [progressPercentage, setProgressPercentage] = useState<number>(task.completionPercentage || 0);
  const [status, setStatus] = useState<TaskStatus>(task.status || 'In Progress');
  const [hoursWorked, setHoursWorked] = useState<number>(2);
  const [workCompleted, setWorkCompleted] = useState<string>(task.notes || '');
  const [blocker, setBlocker] = useState<string>(task.blocker || '');
  const [nextStep, setNextStep] = useState<string>('');
  const [attachmentName, setAttachmentName] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProgress(
      task.id,
      progressPercentage,
      status,
      workCompleted || 'Updated work progress',
      hoursWorked,
      blocker,
      nextStep,
      attachmentName
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/80">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-cyan-400 font-semibold">
              Daily Progress Update
            </span>
            <h2 className="text-base font-bold text-white leading-tight">{task.title}</h2>
            <p className="text-xs text-slate-400">Assigned: {assignedMember?.name || 'Member'}</p>
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
          {/* Progress Slider */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-200">Progress Percentage</label>
              <span className="text-base font-extrabold font-mono text-cyan-400">
                {progressPercentage}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={progressPercentage}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                setProgressPercentage(val);
                if (val === 100) setStatus('Completed');
                else if (val > 0 && status === 'Not Started') setStatus('In Progress');
              }}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0% (Not Started)</span>
              <span>50% (Halfway)</span>
              <span>100% (Completed)</span>
            </div>
          </div>

          {/* Status & Hours Worked */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Task Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-medium text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              >
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Blocked">Blocked</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Hours Worked Today
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0.5"
                  max="16"
                  step="0.5"
                  value={hoursWorked}
                  onChange={(e) => setHoursWorked(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 pl-9 rounded-xl bg-slate-800 border border-slate-700 text-xs font-medium text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                />
                <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>
          </div>

          {/* Work Completed Today */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              What I completed today
            </label>
            <textarea
              rows={3}
              required
              placeholder="e.g. Tested I2C communication and verified sensor readings..."
              value={workCompleted}
              onChange={(e) => setWorkCompleted(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            />
          </div>

          {/* Problems / Blockers */}
          <div>
            <label className="block text-xs font-bold text-rose-300 mb-1.5 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              Problems / Blockers (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Voltage regulator heating up under RF load..."
              value={blocker}
              onChange={(e) => {
                setBlocker(e.target.value);
                if (e.target.value.trim().length > 0) setStatus('Blocked');
              }}
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-rose-500 focus:outline-none"
            />
          </div>

          {/* Next Step */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              What I will do next
            </label>
            <input
              type="text"
              placeholder="e.g. Mount heatsink and conduct 1-hour stress test..."
              value={nextStep}
              onChange={(e) => setNextStep(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            />
          </div>

          {/* Optional Attachment */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5 text-slate-400" />
              Optional Attachment / Reference File
            </label>
            <input
              type="text"
              placeholder="e.g. amg8833_test_log.csv or CAD_v1_shell.stl"
              value={attachmentName}
              onChange={(e) => setAttachmentName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            />
          </div>

          {/* Submit */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-xs font-bold text-white flex items-center gap-2 shadow-lg shadow-cyan-600/30 transition-all"
            >
              <Save className="w-4 h-4" /> Save Update & Sync Dashboard
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
