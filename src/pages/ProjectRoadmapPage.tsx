import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GitMerge } from 'lucide-react';

export const ProjectRoadmapPage: React.FC = () => {
  const { roadmap, tasks, currentWeek, getMemberById } = useApp();
  const [selectedWeekNum, setSelectedWeekNum] = useState<number>(currentWeek);

  const selectedRoadmapWeek = roadmap.find(w => w.weekNumber === selectedWeekNum) || roadmap[0];
  const weekTasks = tasks.filter(t => t.week === selectedWeekNum);

  const getWeekCompletionPct = (wNum: number) => {
    const wTasks = tasks.filter(t => t.week === wNum);
    if (wTasks.length === 0) return wNum < currentWeek ? 100 : 0;
    return Math.round(wTasks.reduce((sum, t) => sum + t.completionPercentage, 0) / wTasks.length);
  };

  const getWeekStatusBadge = (wNum: number) => {
    if (wNum === currentWeek) {
      return <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-[10px] font-bold font-mono">ACTIVE WEEK</span>;
    }
    if (wNum < currentWeek) {
      return <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold font-mono">COMPLETED</span>;
    }
    return <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 text-[10px] font-bold font-mono">UPCOMING</span>;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <GitMerge className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl font-bold text-white">CanSat V1 10-Week Master Roadmap</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Visual milestone breakdown from initial component selection to mission flight freeze.
          </p>
        </div>
        <div className="px-3.5 py-1.5 rounded-xl bg-cyan-950/50 border border-cyan-500/30 text-xs text-cyan-300 font-mono">
          10 Master Milestones
        </div>
      </div>

      {/* Visual Timeline Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Timeline List (5 cols) */}
        <div className="lg:col-span-5 space-y-3 max-h-[700px] overflow-y-auto pr-1">
          {roadmap.map(item => {
            const isSelected = item.weekNumber === selectedWeekNum;
            const completion = getWeekCompletionPct(item.weekNumber);
            const isCurrent = item.weekNumber === currentWeek;

            return (
              <div
                key={item.weekNumber}
                onClick={() => setSelectedWeekNum(item.weekNumber)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                  isSelected
                    ? 'bg-cyan-950/30 border-cyan-500 ring-1 ring-cyan-500/40 shadow-lg'
                    : 'bg-slate-900 border-slate-800/90 hover:border-slate-700'
                }`}
              >
                {isCurrent && (
                  <div className="absolute top-0 left-0 bottom-0 w-1 bg-cyan-400 shadow-lg shadow-cyan-400" />
                )}

                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-slate-800 text-cyan-400 font-extrabold text-xs flex items-center justify-center font-mono border border-slate-700">
                      W{item.weekNumber}
                    </span>
                    <div>
                      <h3 className="text-xs font-bold text-white">{item.title}</h3>
                      <span className="text-[10px] text-slate-400 font-mono">{item.phase}</span>
                    </div>
                  </div>
                  {getWeekStatusBadge(item.weekNumber)}
                </div>

                <p className="text-[11px] text-slate-400 mt-2 line-clamp-2">{item.objective}</p>

                <div className="mt-3">
                  <div className="flex justify-between text-[10px] font-mono mb-1">
                    <span className="text-slate-400">Completion</span>
                    <span className="text-cyan-400 font-bold">{completion}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-1.5 rounded-full"
                      style={{ width: `${completion}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Week Detail Panel (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs font-bold text-cyan-400 uppercase font-mono tracking-wider">
                  Week {selectedRoadmapWeek.weekNumber} Detailed View
                </span>
                <h2 className="text-lg font-bold text-white">{selectedRoadmapWeek.title}</h2>
                <p className="text-xs text-indigo-300 font-medium">{selectedRoadmapWeek.phase}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-right">
                <span className="text-[10px] text-slate-500 uppercase font-mono block">Schedule</span>
                <span className="text-xs font-bold text-white font-mono">
                  {selectedRoadmapWeek.startDate} to {selectedRoadmapWeek.endDate}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] uppercase font-mono text-cyan-400 font-bold block mb-1">
                Main Objective
              </span>
              <p className="text-xs text-slate-200 leading-relaxed">
                {selectedRoadmapWeek.objective}
              </p>
            </div>

            <div>
              <span className="text-[10px] uppercase font-mono text-slate-400 font-bold block mb-2">
                Responsible Team Members
              </span>
              <div className="flex flex-wrap gap-2">
                {selectedRoadmapWeek.responsibleMemberIds.map(id => {
                  const m = getMemberById(id);
                  return (
                    <div
                      key={id}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-white"
                    >
                      <div className="w-5 h-5 rounded bg-indigo-600 text-[10px] flex items-center justify-center">
                        {m?.avatar || 'ST'}
                      </div>
                      <span>{m?.name}</span>
                      <span className="text-[10px] text-cyan-400">({m?.shortRole})</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase font-mono text-slate-400 font-bold">
                  Scheduled Tasks ({weekTasks.length})
                </span>
              </div>

              {weekTasks.length === 0 ? (
                <p className="text-xs text-slate-500 py-6 text-center bg-slate-950/40 rounded-xl border border-slate-800">
                  No specific tasks scheduled in the tracker for Week {selectedRoadmapWeek.weekNumber} yet.
                </p>
              ) : (
                <div className="space-y-2.5 max-h-[300px] overflow-y-auto">
                  {weekTasks.map(t => {
                    const assigned = getMemberById(t.assignedMemberId);
                    return (
                      <div
                        key={t.id}
                        className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-white truncate">{t.title}</h4>
                          <p className="text-[11px] text-slate-400 truncate">{t.description}</p>
                          <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-1">
                            <span>Assigned: {assigned?.name}</span>
                            <span>•</span>
                            <span className="font-mono text-cyan-400">{t.priority} Priority</span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="font-mono font-bold text-cyan-400 block">{t.completionPercentage}%</span>
                          <span className="text-[10px] text-slate-400">{t.status}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
