import React from 'react';
import {
  LayoutDashboard,
  Calendar,
  CheckSquare,
  UserCheck,
  FileText,
  Users,
  GitMerge,
  BarChart3,
  Bell,
  Settings,
  ChevronRight,
  Satellite
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isMobileOpen,
  setIsMobileOpen
}) => {
  const { notifications } = useApp();
  const unreadNotifs = notifications.filter(n => !n.read).length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'schedule', label: 'Weekly Schedule', icon: Calendar },
    { id: 'todaysWork', label: "Today's Work", icon: CheckSquare },
    { id: 'workspace', label: 'Member Workspace', icon: UserCheck },
    { id: 'dailyLogs', label: 'Daily Work Log', icon: FileText },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'roadmap', label: 'Project Roadmap', icon: GitMerge },
    { id: 'weeklyReview', label: 'Weekly Review', icon: BarChart3 },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadNotifs },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-slate-900 border-r border-slate-800/90 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-cyan-500/20">
              <Satellite className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-wider uppercase font-mono">
                CanSat V1.0
              </h2>
              <p className="text-[10px] text-cyan-400 font-medium">Aerospace Engineering</p>
            </div>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 px-3 py-1 mb-1 font-mono">
            Navigation Menu
          </div>

          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all ${
                  isActive
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />}
                </div>
              </button>
            );
          })}
        </nav>

        {/* Footer Mission badge */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-mono block">
              Mission Phase
            </span>
            <span className="text-xs font-bold text-cyan-400 mt-0.5 block">
              Phase 1: Architecture & Testing
            </span>
            <div className="w-full bg-slate-700 rounded-full h-1.5 mt-2">
              <div className="bg-cyan-400 h-1.5 rounded-full w-[10%]" />
            </div>
            <span className="text-[9px] text-slate-500 mt-1 block">Week 1 of 10</span>
          </div>
        </div>
      </aside>
    </>
  );
};
