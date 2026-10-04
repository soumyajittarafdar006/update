import React from 'react';
import { useApp } from '../context/AppContext';
import { Users, ArrowRight, Cpu, HardDrive, Wrench } from 'lucide-react';

export const TeamPage: React.FC<{ setActiveTab: (tab: string) => void }> = ({ setActiveTab }) => {
  const { members, tasks, currentWeek, getMemberStatusToday, setActiveMemberId } = useApp();

  const getTeamIcon = (team: string) => {
    switch (team) {
      case 'Software': return <Cpu className="w-4 h-4 text-cyan-400" />;
      case 'Hardware': return <HardDrive className="w-4 h-4 text-indigo-400" />;
      default: return <Wrench className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl font-bold text-white">CanSat Engineering Team</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            5 Core Engineering Team Members & Subsystem Leads for CanSat Version 1.
          </p>
        </div>
        <div className="px-3.5 py-1.5 rounded-xl bg-indigo-950/60 border border-indigo-500/30 text-xs text-indigo-300 font-mono">
          5 Active Leads
        </div>
      </div>

      {/* Team Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map(member => {
          const memberTasks = tasks.filter(t => t.assignedMemberId === member.id);
          const completedTasksCount = memberTasks.filter(t => t.status === 'Completed').length;
          const remainingTasksCount = memberTasks.length - completedTasksCount;

          const currentTask =
            tasks.find(t => t.assignedMemberId === member.id && t.week === currentWeek) ||
            memberTasks[0];

          const statusToday = getMemberStatusToday(member.id);

          return (
            <div
              key={member.id}
              onClick={() => {
                setActiveMemberId(member.id);
                setActiveTab('workspace');
              }}
              className="bg-slate-900 border border-slate-800/90 hover:border-cyan-500/60 rounded-2xl p-6 flex flex-col justify-between transition-all cursor-pointer group shadow-xl hover:shadow-cyan-500/5"
            >
              <div>
                {/* Header Avatar & Role */}
                <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-800 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 via-cyan-500 to-indigo-700 text-white font-black text-base flex items-center justify-center shadow-md ring-2 ring-cyan-400/30 group-hover:scale-105 transition-transform">
                      {member.avatar}
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors">
                        {member.name}
                      </h2>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        {getTeamIcon(member.team)}
                        <span className="text-xs font-semibold text-cyan-400">{member.role}</span>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] px-2.5 py-1 rounded-full font-bold font-mono ${
                      statusToday === 'On Track'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : statusToday === 'Needs Attention'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {statusToday}
                  </span>
                </div>

                {/* Subsystem Responsibility */}
                <div className="mb-4">
                  <span className="text-[10px] uppercase font-mono text-slate-500 font-semibold block mb-1">
                    Key Responsibility
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                    {member.responsibility}
                  </p>
                </div>

                {/* Current Active Task */}
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 mb-4 space-y-2">
                  <span className="text-[10px] uppercase font-mono text-cyan-400 font-bold block">
                    Current Task (Week {currentWeek})
                  </span>
                  {currentTask ? (
                    <div>
                      <h4 className="text-xs font-bold text-white leading-snug">{currentTask.title}</h4>
                      <div className="mt-2">
                        <div className="flex justify-between text-[10px] font-mono mb-1">
                          <span className="text-slate-400">Progress</span>
                          <span className="text-cyan-400 font-bold">
                            {currentTask.completionPercentage}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-1.5">
                          <div
                            className="bg-cyan-400 h-1.5 rounded-full"
                            style={{ width: `${currentTask.completionPercentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500">No active task</p>
                  )}
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase font-mono block">
                      Tasks Completed
                    </span>
                    <span className="text-base font-black text-emerald-400 font-mono mt-0.5 block">
                      {completedTasksCount}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase font-mono block">
                      Tasks Remaining
                    </span>
                    <span className="text-base font-black text-amber-400 font-mono mt-0.5 block">
                      {remainingTasksCount}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Footer Button */}
              <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-cyan-400 font-semibold group-hover:text-cyan-300">
                <span>Open Member Workspace</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
