import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Bell, Satellite, User, ChevronDown, Calendar, ShieldCheck, Database } from 'lucide-react';
import { MemberSwitchModal } from './MemberSwitchModal';
import { NotificationDrawer } from './NotificationDrawer';

export const Navbar: React.FC<{ activeTab: string; setActiveTab: (tab: string) => void }> = ({
  setActiveTab
}) => {
  const { activeMemberId, members, notifications, currentWeek, currentPhase, isBackendConnected } = useApp();
  const [showSwitchModal, setShowSwitchModal] = useState(false);
  const [showNotifDrawer, setShowNotifDrawer] = useState(false);

  const activeMember = members.find(m => m.id === activeMemberId);
  const unreadCount = notifications.filter(n => !n.read).length;

  const todayDateFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <>
      <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-6 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Left Title & Phase */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400/30">
              <Satellite className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
                  CanSat Version 1
                </h1>
                <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  Engineering V1.0
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Team Work Management Dashboard & Progress Tracker
              </p>
            </div>
          </div>

          {/* Center Info Pill (Date, Week, Phase & Backend Status) */}
          <div className="hidden lg:flex items-center gap-3 bg-slate-950/60 border border-slate-800 rounded-lg px-3.5 py-1.5 text-xs text-slate-300">
            <div className="flex items-center gap-1.5 text-slate-400 border-r border-slate-800 pr-3">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              <span>{todayDateFormatted}</span>
            </div>
            <div className="flex items-center gap-2 font-medium border-r border-slate-800 pr-3">
              <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[11px] font-semibold">
                Week {currentWeek}
              </span>
              <span className="text-slate-400 text-xs font-mono truncate max-w-[180px]">
                {currentPhase}
              </span>
            </div>
            {/* Backend Connection Indicator */}
            <div className="flex items-center gap-1.5 text-[11px] font-mono">
              <Database className="w-3.5 h-3.5 text-slate-400" />
              {isBackendConnected ? (
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Express API
                </span>
              ) : (
                <span className="text-amber-400 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Local Database
                </span>
              )}
            </div>
          </div>

          {/* Right Controls: User Switcher + Notifications */}
          <div className="flex items-center justify-between md:justify-end gap-3">
            {/* Notifications Icon */}
            <button
              onClick={() => setShowNotifDrawer(true)}
              className="relative p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-slate-300 hover:text-white transition-all group"
              title="Notifications & Alerts"
            >
              <Bell className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-[11px] font-bold flex items-center justify-center animate-bounce shadow-md shadow-rose-500/50">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Active User Switcher Pill */}
            <button
              onClick={() => setShowSwitchModal(true)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700/80 text-left transition-all hover:border-cyan-500/40 shadow-sm"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center ring-2 ring-indigo-400/40 shadow-sm">
                {activeMember ? activeMember.avatar : <User className="w-4 h-4" />}
              </div>
              <div className="text-left leading-tight hidden sm:block">
                <div className="text-xs font-bold text-slate-100 flex items-center gap-1">
                  {activeMember ? activeMember.name : 'Project Admin'}
                  {activeMemberId === 'admin' && (
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  )}
                </div>
                <div className="text-[10px] text-cyan-400 font-medium">
                  {activeMember ? activeMember.role : 'Administrator'}
                </div>
              </div>
              <div className="flex items-center text-slate-400 pl-1 border-l border-slate-700/60 ml-1">
                <span className="text-[10px] text-slate-400 mr-1 hidden md:inline">Switch</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Switch User Modal */}
      {showSwitchModal && (
        <MemberSwitchModal onClose={() => setShowSwitchModal(false)} />
      )}

      {/* Notifications Drawer */}
      {showNotifDrawer && (
        <NotificationDrawer
          onClose={() => setShowNotifDrawer(false)}
          onNavigate={(tab) => {
            setActiveTab(tab);
            setShowNotifDrawer(false);
          }}
        />
      )}
    </>
  );
};
