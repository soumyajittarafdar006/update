import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BarChart3, CheckCircle2, Clock, MoveRight, ChevronLeft, ChevronRight, AlertTriangle, Calendar } from 'lucide-react';

export const WeeklyReviewPage: React.FC = () => {
  const {
    tasks,
    members,
    currentWeek,
    roadmap,
    carryForwardTasks,
    getMemberById
  } = useApp();

  const [reviewWeek, setReviewWeek] = useState<number>(currentWeek);

  const weekTasks = tasks.filter(t => t.week === reviewWeek);
  const completedTasks = weekTasks.filter(t => t.status === 'Completed');
  const inProgressTasks = weekTasks.filter(t => t.status === 'In Progress');
  const notCompletedTasks = weekTasks.filter(t => t.status !== 'Completed');
  const blockedTasks = weekTasks.filter(t => t.status === 'Blocked' || Boolean(t.blocker));

  const weekCompletionPct = weekTasks.length > 0
    ? Math.round(weekTasks.reduce((sum, t) => sum + t.completionPercentage, 0) / weekTasks.length)
    : 0;

  const nextWeekNum = Math.min(10, reviewWeek + 1);
  const nextWeekRoadmap = roadmap.find(r => r.weekNumber === nextWeekNum);
  const nextWeekTasks = tasks.filter(t => t.week === nextWeekNum);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header & Week Selector */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl font-bold text-white">CanSat Weekly Review</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            End-of-week performance summary, member completion breakdown, and task rollover management.
          </p>
        </div>

        <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1 shrink-0">
          <button
            onClick={() => setReviewWeek(w => Math.max(1, w - 1))}
            disabled={reviewWeek === 1}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-4 text-xs font-bold text-cyan-400 font-mono">
            Reviewing Week {reviewWeek}
          </span>
          <button
            onClick={() => setReviewWeek(w => Math.min(10, w + 1))}
            disabled={reviewWeek === 10}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* TEAM SUMMARY CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl text-center">
          <span className="text-[10px] text-slate-500 uppercase font-mono block">Total Tasks</span>
          <span className="text-2xl font-black text-white font-mono mt-1 block">{weekTasks.length}</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl text-center">
          <span className="text-[10px] text-slate-500 uppercase font-mono block">Completed</span>
          <span className="text-2xl font-black text-emerald-400 font-mono mt-1 block">{completedTasks.length}</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl text-center">
          <span className="text-[10px] text-slate-500 uppercase font-mono block">In Progress</span>
          <span className="text-2xl font-black text-cyan-400 font-mono mt-1 block">{inProgressTasks.length}</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl text-center">
          <span className="text-[10px] text-slate-500 uppercase font-mono block">Blocked</span>
          <span className="text-2xl font-black text-rose-400 font-mono mt-1 block">{blockedTasks.length}</span>
        </div>
        <div className="col-span-2 sm:col-span-1 bg-gradient-to-br from-slate-900 to-indigo-950/60 border border-indigo-500/30 rounded-2xl p-4 shadow-xl text-center">
          <span className="text-[10px] text-indigo-300 uppercase font-mono block">Overall Completion</span>
          <span className="text-2xl font-black text-indigo-300 font-mono mt-1 block">{weekCompletionPct}%</span>
        </div>
      </div>

      {/* MEMBER COMPLETION BREAKDOWN */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <h2 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
          Individual Member Performance (Week {reviewWeek})
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {members.map(member => {
            const mTasks = weekTasks.filter(t => t.assignedMemberId === member.id);
            const mCompletion = mTasks.length > 0
              ? Math.round(mTasks.reduce((acc, t) => acc + t.completionPercentage, 0) / mTasks.length)
              : 0;

            return (
              <div key={member.id} className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                    {member.avatar}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white">{member.name}</h3>
                    <p className="text-[10px] text-cyan-400 font-medium">{member.role}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80">
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-slate-400">Score</span>
                    <span className="font-extrabold text-cyan-400">{mCompletion}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5">
                    <div
                      className="bg-cyan-400 h-1.5 rounded-full"
                      style={{ width: `${mCompletion}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    {mTasks.filter(t => t.status === 'Completed').length} / {mTasks.length} tasks completed
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* COMPLETED VS NOT COMPLETED & CARRY FORWARD */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Completed This Week */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Completed This Week ({completedTasks.length})
            </h3>
          </div>

          <div className="space-y-2.5 max-h-[300px] overflow-y-auto">
            {completedTasks.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">No tasks completed in Week {reviewWeek} yet.</p>
            ) : (
              completedTasks.map(t => {
                const assigned = getMemberById(t.assignedMemberId);
                return (
                  <div key={t.id} className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-800/40 text-xs">
                    <div className="flex justify-between font-bold text-white">
                      <span>{t.title}</span>
                      <span className="text-emerald-400 font-mono">100%</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">{t.notes || t.description}</p>
                    <span className="text-[10px] text-slate-500 mt-1 block">Assigned: {assigned?.name}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Not Completed & Carry Forward Button */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
              <Clock className="w-4 h-4" /> Unfinished Tasks ({notCompletedTasks.length})
            </h3>
            {notCompletedTasks.length > 0 && reviewWeek < 10 && (
              <button
                onClick={() => carryForwardTasks(reviewWeek)}
                className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-xs font-bold text-white flex items-center gap-1.5 shadow-md shadow-amber-600/30 transition-all"
              >
                <MoveRight className="w-3.5 h-3.5" /> Carry Forward to Week {reviewWeek + 1}
              </button>
            )}
          </div>

          <div className="space-y-2.5 max-h-[300px] overflow-y-auto">
            {notCompletedTasks.length === 0 ? (
              <p className="text-xs text-emerald-400 py-6 text-center font-bold">
                🎉 All tasks completed for Week {reviewWeek}!
              </p>
            ) : (
              notCompletedTasks.map(t => {
                const assigned = getMemberById(t.assignedMemberId);
                return (
                  <div key={t.id} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
                    <div className="flex justify-between font-bold text-white">
                      <span>{t.title}</span>
                      <span className="text-cyan-400 font-mono">{t.completionPercentage}%</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">{t.description}</p>
                    {t.blocker && (
                      <span className="text-[10px] text-rose-400 mt-1 block">
                        Blocker: {t.blocker}
                      </span>
                    )}
                    <span className="text-[10px] text-slate-500 mt-1 block">Assigned: {assigned?.name}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* BLOCKERS REPORTED & NEXT WEEK PREVIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Blockers Summary */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <h3 className="text-sm font-bold text-rose-400 flex items-center gap-2 pb-3 border-b border-slate-800">
            <AlertTriangle className="w-4 h-4" /> Reported Blockers ({blockedTasks.length})
          </h3>
          {blockedTasks.length === 0 ? (
            <p className="text-xs text-slate-500 py-4 text-center">No active blockers reported for Week {reviewWeek}.</p>
          ) : (
            <div className="space-y-2">
              {blockedTasks.map(t => {
                const m = getMemberById(t.assignedMemberId);
                return (
                  <div key={t.id} className="p-3 rounded-xl bg-rose-950/30 border border-rose-800/40 text-xs text-rose-300">
                    <div className="font-bold text-white">{t.title} ({m?.name})</div>
                    <p className="mt-1">{t.blocker}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Next Week Preview */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <h3 className="text-sm font-bold text-cyan-400 flex items-center gap-2 pb-3 border-b border-slate-800">
            <Calendar className="w-4 h-4" /> Next Week Preview (Week {nextWeekNum})
          </h3>
          {nextWeekRoadmap ? (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-white">{nextWeekRoadmap.title}</h4>
              <p className="text-xs text-slate-400">{nextWeekRoadmap.objective}</p>
              <div className="text-[11px] text-cyan-300 font-mono pt-2">
                {nextWeekTasks.length} tasks scheduled for Week {nextWeekNum}.
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-500">Mission complete!</p>
          )}
        </div>
      </div>
    </div>
  );
};
