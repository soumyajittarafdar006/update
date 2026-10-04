import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Bell, CheckCheck, Trash2, AlertCircle, AlertTriangle, CheckCircle2, Info } from 'lucide-react';

export const NotificationDrawer: React.FC<{
  onClose: () => void;
  onNavigate: (tab: string) => void;
}> = ({ onClose, onNavigate }) => {
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearNotification
  } = useApp();

  const getIcon = (type: string) => {
    switch (type) {
      case 'danger':
        return <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />;
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
      default:
        return <Info className="w-5 h-5 text-cyan-400 shrink-0" />;
    }
  };

  const getBgClass = (type: string, read: boolean) => {
    if (read) return 'bg-slate-900/50 border-slate-800/80 opacity-75';
    switch (type) {
      case 'danger':
        return 'bg-rose-950/30 border-rose-800/40 ring-1 ring-rose-500/20';
      case 'warning':
        return 'bg-amber-950/30 border-amber-800/40 ring-1 ring-amber-500/20';
      case 'success':
        return 'bg-emerald-950/30 border-emerald-800/40';
      default:
        return 'bg-cyan-950/30 border-cyan-800/40';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white">Notifications & Reminders</h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-cyan-400 font-semibold">
              {notifications.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Actions bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-slate-950/60 border-b border-slate-800 text-xs">
          <button
            onClick={markAllNotificationsAsRead}
            className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-medium"
          >
            <CheckCheck className="w-4 h-4" /> Mark all as read
          </button>
          <span className="text-slate-500">Auto-synced</span>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Bell className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No notifications right now</p>
            </div>
          ) : (
            notifications.map(notif => (
              <div
                key={notif.id}
                onClick={() => markNotificationAsRead(notif.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer relative group ${getBgClass(
                  notif.type,
                  notif.read
                )}`}
              >
                <div className="flex items-start gap-3">
                  {getIcon(notif.type)}
                  <div className="flex-1 min-w-0 pr-6">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-white">{notif.title}</h4>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                      )}
                    </div>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">{notif.message}</p>
                    <span className="text-[10px] text-slate-400 mt-2 block">
                      {new Date(notif.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    clearNotification(notif.id);
                  }}
                  className="absolute top-3 right-3 p-1 rounded text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Clear notification"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-900 border-t border-slate-800">
          <button
            onClick={() => {
              onNavigate('notifications');
              onClose();
            }}
            className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-xs font-bold text-white transition-colors"
          >
            View Full Reminder Logs
          </button>
        </div>
      </div>
    </div>
  );
};
