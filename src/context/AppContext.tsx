import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  TeamMember,
  Task,
  DailyWorkLog,
  RoadmapWeek,
  NotificationItem,
  MemberStatusToday,
  TaskStatus
} from '../types';
import {
  INITIAL_MEMBERS,
  INITIAL_ROADMAP,
  INITIAL_TASKS,
  INITIAL_DAILY_LOGS,
  INITIAL_NOTIFICATIONS
} from '../data/seedData';

const API_BASE_URL = 'http://localhost:3001/api';

interface AppContextType {
  members: TeamMember[];
  tasks: Task[];
  dailyLogs: DailyWorkLog[];
  roadmap: RoadmapWeek[];
  notifications: NotificationItem[];
  activeMemberId: string;
  currentWeek: number;
  currentPhase: string;
  isBackendConnected: boolean;
  setActiveMemberId: (id: string) => void;
  
  // Task Actions
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  updateProgress: (
    taskId: string,
    progressPercentage: number,
    status: TaskStatus,
    workCompleted: string,
    hoursWorked: number,
    blocker?: string,
    nextStep?: string,
    attachmentName?: string
  ) => void;
  moveTaskWeek: (taskId: string, targetWeek: number) => void;
  toggleTaskComplete: (taskId: string) => void;
  
  // Daily Work Log Actions
  addDailyLog: (log: Omit<DailyWorkLog, 'id' | 'createdAt'>) => void;
  deleteDailyLog: (logId: string) => void;
  
  // Notification Actions
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  clearNotification: (id: string) => void;
  addNotification: (notif: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => void;
  
  // Weekly Review Actions
  carryForwardTasks: (fromWeek: number) => void;
  
  // Utilities
  resetAllData: () => void;
  exportData: () => string;
  importData: (jsonString: string) => boolean;
  
  // Calculated Helpers
  getMemberById: (id: string) => TeamMember | undefined;
  getTasksByMember: (memberId: string) => Task[];
  getTasksByWeek: (week: number) => Task[];
  getMemberStatusToday: (memberId: string) => MemberStatusToday;
  overallCompletionPercentage: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  MEMBERS: 'cansat_v3_members',
  TASKS: 'cansat_v3_tasks',
  LOGS: 'cansat_v3_logs',
  NOTIFS: 'cansat_v3_notifications',
  ACTIVE_USER: 'cansat_v3_active_user',
  CURRENT_WEEK: 'cansat_v3_current_week'
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [members, setMembers] = useState<TeamMember[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MEMBERS);
    return saved ? JSON.parse(saved) : INITIAL_MEMBERS;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TASKS);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length >= 20) return parsed;
    }
    return INITIAL_TASKS;
  });

  const [dailyLogs, setDailyLogs] = useState<DailyWorkLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LOGS);
    return saved ? JSON.parse(saved) : INITIAL_DAILY_LOGS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFS);
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [activeMemberId, setActiveMemberId] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_USER) || 'soumyajit';
  });

  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(false);
  const [currentWeek] = useState<number>(1);
  const roadmap = INITIAL_ROADMAP;
  const currentPhase = INITIAL_ROADMAP.find(w => w.weekNumber === currentWeek)?.phase || 'Phase 1: Architecture';

  // 1. Fetch State from Express Backend on Mount
  useEffect(() => {
    async function syncBackendState() {
      try {
        const res = await fetch(`${API_BASE_URL}/state`);
        if (res.ok) {
          const data = await res.json();
          if (data.members) setMembers(data.members);
          if (data.tasks && data.tasks.length > 0) setTasks(data.tasks);
          if (data.dailyLogs) setDailyLogs(data.dailyLogs);
          if (data.notifications) setNotifications(data.notifications);
          setIsBackendConnected(true);
        }
      } catch {
        setIsBackendConnected(false);
      }
    }
    syncBackendState();
  }, []);

  // 2. Sync to LocalStorage as offline fallback
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(dailyLogs));
  }, [dailyLogs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_USER, activeMemberId);
  }, [activeMemberId]);

  // Status calculator
  const getMemberStatusToday = (memberId: string): MemberStatusToday => {
    const memberTasks = tasks.filter(t => t.assignedMemberId === memberId && t.week === currentWeek);
    const hasBlocker = memberTasks.some(t => t.status === 'Blocked' || Boolean(t.blocker));
    if (hasBlocker) return 'Blocked';

    const hasOverdueOrNotStarted = memberTasks.some(t => t.status === 'Overdue' || (t.status === 'Not Started' && t.priority === 'Critical'));
    if (hasOverdueOrNotStarted) return 'Needs Attention';

    return 'On Track';
  };

  const getMemberById = (id: string) => members.find(m => m.id === id);
  const getTasksByMember = (memberId: string) => tasks.filter(t => t.assignedMemberId === memberId);
  const getTasksByWeek = (week: number) => tasks.filter(t => t.week === week);

  const overallCompletionPercentage = tasks.length > 0
    ? Math.round(tasks.reduce((sum, t) => sum + t.completionPercentage, 0) / tasks.length)
    : 0;

  // Task Actions (Client + Server Sync)
  const addTask = async (newTaskData: Omit<Task, 'id'>) => {
    const newId = `task-${Date.now()}`;
    const newTask: Task = { ...newTaskData, id: newId };

    setTasks(prev => [newTask, ...prev]);

    addNotification({
      title: 'New Task Created',
      message: `Task '${newTask.title}' assigned to ${getMemberById(newTask.assignedMemberId)?.name || 'Team member'}.`,
      type: 'info',
      relatedMemberId: newTask.assignedMemberId,
      relatedTaskId: newId
    });

    try {
      await fetch(`${API_BASE_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask)
      });
    } catch (e) {
      console.warn('Backend sync failed, stored locally:', e);
    }
  };

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === taskId) {
          const updated = { ...t, ...updates };
          if (updated.completionPercentage === 100 && updated.status !== 'Completed') {
            updated.status = 'Completed';
            updated.completedAt = new Date().toISOString().split('T')[0];
          }
          return updated;
        }
        return t;
      })
    );

    try {
      await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
    } catch (e) {
      console.warn('Backend sync failed, stored locally:', e);
    }
  };

  const deleteTask = async (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    try {
      await fetch(`${API_BASE_URL}/tasks/${taskId}`, { method: 'DELETE' });
    } catch (e) {
      console.warn('Backend sync failed, stored locally:', e);
    }
  };

  const toggleTaskComplete = (taskId: string) => {
    const target = tasks.find(t => t.id === taskId);
    if (!target) return;
    const isCompleted = target.status === 'Completed';
    updateTask(taskId, {
      status: isCompleted ? 'In Progress' : 'Completed',
      completionPercentage: isCompleted ? 50 : 100,
      completedAt: isCompleted ? undefined : new Date().toISOString().split('T')[0]
    });
  };

  const moveTaskWeek = (taskId: string, targetWeek: number) => {
    updateTask(taskId, { week: targetWeek });
  };

  const updateProgress = async (
    taskId: string,
    progressPercentage: number,
    status: TaskStatus,
    workCompleted: string,
    hoursWorked: number,
    blocker?: string,
    nextStep?: string,
    attachmentName?: string
  ) => {
    const targetTask = tasks.find(t => t.id === taskId);
    if (!targetTask) return;

    const finalStatus: TaskStatus = progressPercentage === 100 ? 'Completed' : (blocker ? 'Blocked' : status);
    const todayStr = new Date().toISOString().split('T')[0];

    updateTask(taskId, {
      completionPercentage: progressPercentage,
      status: finalStatus,
      hoursWorked: (targetTask.hoursWorked || 0) + hoursWorked,
      blocker: blocker || '',
      notes: workCompleted,
      completedAt: progressPercentage === 100 ? todayStr : undefined
    });

    addDailyLog({
      date: todayStr,
      memberId: targetTask.assignedMemberId,
      taskId: targetTask.id,
      taskTitle: targetTask.title,
      workCompleted,
      progressPercentage,
      hoursWorked,
      status: finalStatus,
      blocker,
      nextStep,
      attachmentName
    });

    const memberObj = getMemberById(targetTask.assignedMemberId);
    if (blocker) {
      addNotification({
        title: 'Blocker Alert',
        message: `${memberObj?.name || 'Member'} reported a blocker on '${targetTask.title}': ${blocker}`,
        type: 'danger',
        relatedMemberId: targetTask.assignedMemberId,
        relatedTaskId: targetTask.id
      });
    } else if (progressPercentage === 100) {
      addNotification({
        title: 'Task Completed',
        message: `${memberObj?.name || 'Member'} completed '${targetTask.title}' (100%)!`,
        type: 'success',
        relatedMemberId: targetTask.assignedMemberId,
        relatedTaskId: targetTask.id
      });
    }

    try {
      await fetch(`${API_BASE_URL}/tasks/update-progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskId,
          progressPercentage,
          status,
          workCompleted,
          hoursWorked,
          blocker,
          nextStep,
          attachmentName
        })
      });
    } catch (e) {
      console.warn('Backend sync failed:', e);
    }
  };

  const addDailyLog = async (logData: Omit<DailyWorkLog, 'id' | 'createdAt'>) => {
    const newLog: DailyWorkLog = {
      ...logData,
      id: `log-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setDailyLogs(prev => [newLog, ...prev]);

    try {
      await fetch(`${API_BASE_URL}/logs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLog)
      });
    } catch (e) {
      console.warn('Backend sync failed:', e);
    }
  };

  const deleteDailyLog = async (logId: string) => {
    setDailyLogs(prev => prev.filter(l => l.id !== logId));
    try {
      await fetch(`${API_BASE_URL}/logs/${logId}`, { method: 'DELETE' });
    } catch (e) {
      console.warn('Backend sync failed:', e);
    }
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    try {
      await fetch(`${API_BASE_URL}/notifications/read-all`, { method: 'PUT' });
    } catch (e) {
      console.warn('Backend sync failed:', e);
    }
  };

  const clearNotification = async (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    try {
      await fetch(`${API_BASE_URL}/notifications/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.warn('Backend sync failed:', e);
    }
  };

  const addNotification = (notifData: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: NotificationItem = {
      ...notifData,
      id: `notif-${Date.now()}`,
      timestamp: new Date().toISOString(),
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const carryForwardTasks = async (fromWeek: number) => {
    const targetNextWeek = Math.min(10, fromWeek + 1);
    let count = 0;
    setTasks(prev =>
      prev.map(t => {
        if (t.week === fromWeek && t.status !== 'Completed') {
          count++;
          return { ...t, week: targetNextWeek };
        }
        return t;
      })
    );

    if (count > 0) {
      addNotification({
        title: 'Tasks Carried Forward',
        message: `${count} unfinished task(s) from Week ${fromWeek} carried forward to Week ${targetNextWeek}.`,
        type: 'warning'
      });
    }

    try {
      await fetch(`${API_BASE_URL}/tasks/carry-forward`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fromWeek })
      });
    } catch (e) {
      console.warn('Backend sync failed:', e);
    }
  };

  const resetAllData = async () => {
    setMembers(INITIAL_MEMBERS);
    setTasks(INITIAL_TASKS);
    setDailyLogs(INITIAL_DAILY_LOGS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setActiveMemberId('soumyajit');
    localStorage.clear();

    try {
      await fetch(`${API_BASE_URL}/reset`, { method: 'POST' });
    } catch (e) {
      console.warn('Backend sync failed:', e);
    }
  };

  const exportData = () => {
    return JSON.stringify(
      {
        members,
        tasks,
        dailyLogs,
        notifications,
        exportedAt: new Date().toISOString()
      },
      null,
      2
    );
  };

  const importData = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.members && parsed.tasks) {
        setMembers(parsed.members);
        setTasks(parsed.tasks);
        if (parsed.dailyLogs) setDailyLogs(parsed.dailyLogs);
        if (parsed.notifications) setNotifications(parsed.notifications);

        fetch(`${API_BASE_URL}/import`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(parsed)
        }).catch(e => console.warn('Backend sync failed:', e));

        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  return (
    <AppContext.Provider
      value={{
        members,
        tasks,
        dailyLogs,
        roadmap,
        notifications,
        activeMemberId,
        currentWeek,
        currentPhase,
        isBackendConnected,
        setActiveMemberId,
        addTask,
        updateTask,
        deleteTask,
        updateProgress,
        moveTaskWeek,
        toggleTaskComplete,
        addDailyLog,
        deleteDailyLog,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        clearNotification,
        addNotification,
        carryForwardTasks,
        resetAllData,
        exportData,
        importData,
        getMemberById,
        getTasksByMember,
        getTasksByWeek,
        getMemberStatusToday,
        overallCompletionPercentage
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
