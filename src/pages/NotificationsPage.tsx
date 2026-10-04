import React from 'react';
import { useApp } from '../context/AppContext';
import { Bell, CheckCheck, Trash2, AlertCircle, AlertTriangle, CheckCircle2, Info } from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead, clearNotification } = useApp();

  const getIcon = (type: string) => {
    switch (type) {
      case 'danger': return <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />;
      case 'success': return <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
      default: return <Info className="w-5 h-5 text-cyan-400 shrink-0" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl font-bold text-white">CanSat Reminder System & Alerts</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Automated notifications for task deadlines, reported blockers, and daily updates.
          </p>
        </div>

        <button
          onClick={markAllNotificationsAsRead}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-cyan-400 border border-slate-700 flex items-center gap-2"
        >
          <CheckCheck className="w-4 h-4" /> Mark All Read
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
        {notifications.length === 0 ? (
          <div className="py-12 text-center text-slate-500">
            <Bell className="w-12 h-12 mx-auto mb-2 opacity-30" />
            <p className="text-sm font-medium">No system notifications currently stored.</p>
          </div>
        ) : (
          notifications.map(notif => (
            <div
              key={notif.id}
              onClick={() => markNotificationAsRead(notif.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                notif.read
                  ? 'bg-slate-950/40 border-slate-800 text-slate-400'
                  : 'bg-slate-950/80 border-slate-700 text-slate-100 ring-1 ring-cyan-500/20'
              }`}
            >
              <div className="flex items-start gap-3">
                {getIcon(notif.type)}
                <div>
                  <h3 className="text-xs font-bold text-white flex items-center gap-2">
                    {notif.title}
                    {!notif.read && <span className="w-2 h-2 rounded-full bg-cyan-400" />}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">{notif.message}</p>
                  <span className="text-[10px] text-slate-500 font-mono mt-2 block">
                    {new Date(notif.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  clearNotification(notif.id);
                }}
                className="p-1 rounded text-slate-500 hover:text-rose-400"
                title="Dismiss"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
