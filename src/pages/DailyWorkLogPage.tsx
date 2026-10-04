import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FileText, Plus, Search, Filter, Trash2, Clock, AlertTriangle, Paperclip } from 'lucide-react';
import { DailyLogModal } from '../components/DailyLogModal';

export const DailyWorkLogPage: React.FC = () => {
  const { dailyLogs, members, deleteDailyLog, getMemberById } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMemberFilter, setSelectedMemberFilter] = useState('all');
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  const filteredLogs = dailyLogs
    .filter(log => {
      if (selectedMemberFilter !== 'all' && log.memberId !== selectedMemberFilter) return false;
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        return (
          log.taskTitle.toLowerCase().includes(query) ||
          log.workCompleted.toLowerCase().includes(query) ||
          (log.blocker && log.blocker.toLowerCase().includes(query))
        );
      }
      return true;
    })
    .sort((a, b) => new Date(b.createdAt || b.date).getTime() - new Date(a.createdAt || a.date).getTime());

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'In Progress': return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      case 'Blocked': return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default: return 'bg-slate-700/40 text-slate-300 border-slate-600/40';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header & New Log Button */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl font-bold text-white">Daily Work Log History</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Chronological audit trail of all team members' daily completed work & progress updates.
          </p>
        </div>
        <button
          onClick={() => setIsLogModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-xs font-bold text-white flex items-center gap-2 shadow-lg shadow-cyan-600/30 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Daily Log Entry
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search work logs, tasks or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold">
            <Filter className="w-3.5 h-3.5 text-cyan-400" /> Member:
          </div>
          <select
            value={selectedMemberFilter}
            onChange={(e) => setSelectedMemberFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-medium text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
          >
            <option value="all">All Members</option>
            {members.map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Daily Logs List */}
      <div className="space-y-4">
        {filteredLogs.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-500">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm font-medium">No daily work logs match your filter criteria.</p>
          </div>
        ) : (
          filteredLogs.map(log => {
            const member = getMemberById(log.memberId);
            return (
              <div
                key={log.id}
                className="bg-slate-900 border border-slate-800/90 rounded-2xl p-5 shadow-xl hover:border-slate-700 transition-all space-y-3"
              >
                {/* Header info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                      {member?.avatar || 'ST'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-white">{member?.name || 'Member'}</h3>
                        <span className="text-[10px] text-cyan-400 font-medium">({member?.role})</span>
                      </div>
                      <span className="text-xs text-slate-400 font-mono">Date: {log.date}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] px-2.5 py-1 rounded-full border font-bold ${getStatusBadge(log.status)}`}>
                      {log.status}
                    </span>
                    <span className="text-sm font-black text-cyan-400 font-mono">
                      {log.progressPercentage}% Progress
                    </span>
                    <button
                      onClick={() => deleteDailyLog(log.id)}
                      className="p-1 rounded text-slate-500 hover:text-rose-400"
                      title="Delete log"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Task Title & Details */}
                <div>
                  <span className="text-[10px] uppercase font-mono text-cyan-400 font-bold">
                    Target Task
                  </span>
                  <h4 className="text-sm font-bold text-slate-200">{log.taskTitle}</h4>
                </div>

                {/* Work Completed */}
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
                  <span className="text-[10px] uppercase font-mono text-slate-400 font-semibold block mb-1">
                    Work Completed Today
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed">{log.workCompleted}</p>
                </div>

                {/* Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-1">
                  <div className="flex items-center gap-2 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800">
                    <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span className="text-slate-400">Hours Worked:</span>
                    <strong className="text-white font-mono">{log.hoursWorked} hrs</strong>
                  </div>

                  {log.blocker ? (
                    <div className="flex items-start gap-2 bg-rose-950/30 p-2.5 rounded-lg border border-rose-800/40 text-rose-300 col-span-1 md:col-span-2">
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="block text-[10px] uppercase font-mono text-rose-400">
                          Blockers / Issues:
                        </strong>
                        <span>{log.blocker}</span>
                      </div>
                    </div>
                  ) : log.nextStep ? (
                    <div className="flex items-start gap-2 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800 text-slate-300 col-span-1 md:col-span-2">
                      <span className="text-cyan-400 font-bold">Next Step:</span>
                      <span>{log.nextStep}</span>
                    </div>
                  ) : null}
                </div>

                {log.attachmentName && (
                  <div className="flex items-center gap-1.5 text-xs text-cyan-400 bg-cyan-950/30 px-3 py-1.5 rounded-lg border border-cyan-800/30 w-fit">
                    <Paperclip className="w-3.5 h-3.5" />
                    <span>Attachment: {log.attachmentName}</span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {isLogModalOpen && <DailyLogModal onClose={() => setIsLogModalOpen(false)} />}
    </div>
  );
};
