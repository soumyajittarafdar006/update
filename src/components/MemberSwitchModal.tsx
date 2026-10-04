import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Check, ShieldCheck, UserCheck } from 'lucide-react';

export const MemberSwitchModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { members, activeMemberId, setActiveMemberId } = useApp();

  const handleSelect = (id: string) => {
    setActiveMemberId(id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white">Select Active Team Member / Role</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info banner */}
        <div className="px-6 py-3 bg-cyan-950/30 border-b border-cyan-800/30 text-xs text-cyan-300">
          Select a member to view the website from their perspective, update their daily progress, add daily logs, or view their dedicated member workspace.
        </div>

        {/* Member list */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto">
          {members.map(member => {
            const isSelected = activeMemberId === member.id;
            return (
              <button
                key={member.id}
                onClick={() => handleSelect(member.id)}
                className={`flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-cyan-950/40 border-cyan-500 shadow-md shadow-cyan-500/10 ring-1 ring-cyan-500/50'
                    : 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-800 hover:border-slate-600'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-600 text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-sm">
                  {member.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white truncate">{member.name}</h3>
                    {isSelected && <Check className="w-4 h-4 text-cyan-400 shrink-0" />}
                  </div>
                  <p className="text-xs text-cyan-400 font-medium">{member.role}</p>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{member.responsibility}</p>
                </div>
              </button>
            );
          })}

          {/* Admin Option */}
          <button
            onClick={() => handleSelect('admin')}
            className={`col-span-1 sm:col-span-2 flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${
              activeMemberId === 'admin'
                ? 'bg-indigo-950/50 border-indigo-500 ring-1 ring-indigo-500/50'
                : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800 hover:border-slate-600'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white font-bold text-sm flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">Project Administrator</h3>
                {activeMemberId === 'admin' && <Check className="w-4 h-4 text-indigo-400" />}
              </div>
              <p className="text-xs text-indigo-300 font-medium">Full Lead Permissions</p>
              <p className="text-[11px] text-slate-400">
                Create & edit all schedules, assign tasks, manage deadlines & overall CanSat progress.
              </p>
            </div>
          </button>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-900 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm font-medium text-slate-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
