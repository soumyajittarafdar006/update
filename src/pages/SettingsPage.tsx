import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Settings, Download, Upload, RefreshCw, Database } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { exportData, importData, resetAllData, members, tasks } = useApp();
  const [importJsonText, setImportJsonText] = useState('');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleExport = () => {
    const json = exportData();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CanSat_V1_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMessage({ text: 'Backup JSON downloaded successfully!', type: 'success' });
  };

  const handleImport = () => {
    if (!importJsonText.trim()) return;
    const success = importData(importJsonText);
    if (success) {
      setMessage({ text: 'Data imported successfully! Dashboard updated.', type: 'success' });
      setImportJsonText('');
    } else {
      setMessage({ text: 'Invalid JSON data format. Please check file content.', type: 'error' });
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all data back to initial seed state?')) {
      resetAllData();
      setMessage({ text: 'Application state reset to initial seed data.', type: 'success' });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-cyan-400" />
          <h1 className="text-xl font-bold text-white">System Settings & Data Management</h1>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Configure data persistence, export backups, and manage CanSat V1 team data.
        </p>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl text-xs font-bold border ${
            message.type === 'success'
              ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
              : 'bg-rose-950/40 border-rose-500/50 text-rose-300'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Database Stats Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <h2 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
          <Database className="w-4 h-4 text-cyan-400" /> Local Storage Database Status
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase font-mono block">Registered Members</span>
            <span className="text-lg font-black text-cyan-400 font-mono mt-1 block">{members.length}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase font-mono block">Total Tasks</span>
            <span className="text-lg font-black text-indigo-400 font-mono mt-1 block">{tasks.length}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase font-mono block">Roadmap Weeks</span>
            <span className="text-lg font-black text-emerald-400 font-mono mt-1 block">10 Weeks</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase font-mono block">Persistence</span>
            <span className="text-xs font-bold text-cyan-400 mt-1 block">LocalStorage API</span>
          </div>
        </div>
      </div>

      {/* Backup & Restore */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Download className="w-4 h-4 text-cyan-400" /> Export Backup
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Download a full JSON backup file containing all members, schedules, daily logs, and status updates.
          </p>
          <button
            onClick={handleExport}
            className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-xs font-bold text-white flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/30 transition-all"
          >
            <Download className="w-4 h-4" /> Export CanSat Data (.json)
          </button>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Upload className="w-4 h-4 text-indigo-400" /> Import JSON Data
          </h3>
          <textarea
            rows={2}
            placeholder="Paste JSON content here to import..."
            value={importJsonText}
            onChange={(e) => setImportJsonText(e.target.value)}
            className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-mono text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          <button
            onClick={handleImport}
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all"
          >
            <Upload className="w-4 h-4" /> Import & Restore
          </button>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
        <h3 className="text-sm font-bold text-rose-400 flex items-center gap-2">
          <RefreshCw className="w-4 h-4" /> Reset to Initial Seed Data
        </h3>
        <p className="text-xs text-slate-400">
          Restores the app state to the original 5 team members, 10-week roadmap, and sample tasks.
        </p>
        <button
          onClick={handleReset}
          className="px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-xs font-bold text-rose-400 flex items-center gap-2 transition-colors"
        >
          <RefreshCw className="w-4 h-4" /> Reset All Data to Default Seeds
        </button>
      </div>
    </div>
  );
};
