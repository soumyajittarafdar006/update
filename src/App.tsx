import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DashboardPage } from './pages/DashboardPage';
import { WeeklySchedulePage } from './pages/WeeklySchedulePage';
import { TodaysWorkPage } from './pages/TodaysWorkPage';
import { MemberWorkspacePage } from './pages/MemberWorkspacePage';
import { DailyWorkLogPage } from './pages/DailyWorkLogPage';
import { TeamPage } from './pages/TeamPage';
import { ProjectRoadmapPage } from './pages/ProjectRoadmapPage';
import { WeeklyReviewPage } from './pages/WeeklyReviewPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { SettingsPage } from './pages/SettingsPage';
import { Menu } from 'lucide-react';

const MainLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardPage setActiveTab={setActiveTab} />;
      case 'schedule':
        return <WeeklySchedulePage />;
      case 'todaysWork':
        return <TodaysWorkPage />;
      case 'workspace':
        return <MemberWorkspacePage />;
      case 'dailyLogs':
        return <DailyWorkLogPage />;
      case 'team':
        return <TeamPage setActiveTab={setActiveTab} />;
      case 'roadmap':
        return <ProjectRoadmapPage />;
      case 'weeklyReview':
        return <WeeklyReviewPage />;
      case 'notifications':
        return <NotificationsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans bg-grid-pattern selection:bg-cyan-500 selection:text-slate-950">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Container */}
      <div className="lg:pl-64 flex-1 flex flex-col min-w-0">
        {/* Mobile Header Bar */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800">
          <button
            onClick={() => setIsMobileOpen(true)}
            className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="text-xs font-bold text-white font-mono uppercase tracking-wider">
            CanSat V1 Dashboard
          </span>
          <div className="w-5" />
        </div>

        {/* Top Navbar */}
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Content Area */}
        <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto">
          {renderContent()}
        </main>

        {/* Mission Footer */}
        <footer className="py-4 px-6 border-t border-slate-800/80 text-center text-xs text-slate-500 font-mono">
          CanSat Version 1 Team Work Management System • 5-Member Engineering Portal
        </footer>
      </div>
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

export default App;
