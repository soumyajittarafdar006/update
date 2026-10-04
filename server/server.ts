import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import {
  INITIAL_MEMBERS,
  INITIAL_ROADMAP,
  INITIAL_TASKS,
  INITIAL_DAILY_LOGS,
  INITIAL_NOTIFICATIONS
} from '../src/data/seedData';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

const DB_FILE = path.join(__dirname, 'database.json');

interface DatabaseSchema {
  members: typeof INITIAL_MEMBERS;
  tasks: typeof INITIAL_TASKS;
  dailyLogs: typeof INITIAL_DAILY_LOGS;
  notifications: typeof INITIAL_NOTIFICATIONS;
  roadmap: typeof INITIAL_ROADMAP;
  currentWeek: number;
  updatedAt: string;
}

// Ensure database file exists with initial seed data if missing
function loadDatabase(): DatabaseSchema {
  if (!fs.existsSync(DB_FILE)) {
    const defaultData: DatabaseSchema = {
      members: INITIAL_MEMBERS,
      tasks: INITIAL_TASKS,
      dailyLogs: INITIAL_DAILY_LOGS,
      notifications: INITIAL_NOTIFICATIONS,
      roadmap: INITIAL_ROADMAP,
      currentWeek: 1,
      updatedAt: new Date().toISOString()
    };
    saveDatabase(defaultData);
    return defaultData;
  }

  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (!parsed.tasks || parsed.tasks.length < 20) {
      parsed.tasks = INITIAL_TASKS;
      parsed.roadmap = INITIAL_ROADMAP;
      saveDatabase(parsed);
    }
    return parsed;
  } catch (err) {
    console.error('Error reading database file, recreating seed DB:', err);
    const defaultData: DatabaseSchema = {
      members: INITIAL_MEMBERS,
      tasks: INITIAL_TASKS,
      dailyLogs: INITIAL_DAILY_LOGS,
      notifications: INITIAL_NOTIFICATIONS,
      roadmap: INITIAL_ROADMAP,
      currentWeek: 1,
      updatedAt: new Date().toISOString()
    };
    saveDatabase(defaultData);
    return defaultData;
  }
}

function saveDatabase(db: DatabaseSchema) {
  db.updatedAt = new Date().toISOString();
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
}

// ------------------------------------------------------------------
// REST API ENDPOINTS
// ------------------------------------------------------------------

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', server: 'CanSat V1 Express Backend', timestamp: new Date().toISOString() });
});

// 2. Get Full State
app.get('/api/state', (req, res) => {
  const db = loadDatabase();
  res.json(db);
});

// 3. Members API
app.get('/api/members', (req, res) => {
  const db = loadDatabase();
  res.json(db.members);
});

// 4. Tasks API (GET, POST, PUT, DELETE)
app.get('/api/tasks', (req, res) => {
  const db = loadDatabase();
  res.json(db.tasks);
});

app.post('/api/tasks', (req, res) => {
  const db = loadDatabase();
  const newTask = {
    ...req.body,
    id: req.body.id || `task-${Date.now()}`
  };
  db.tasks.unshift(newTask);

  const assignedMember = db.members.find(m => m.id === newTask.assignedMemberId);
  db.notifications.unshift({
    id: `notif-${Date.now()}`,
    title: 'New Task Created',
    message: `Task '${newTask.title}' assigned to ${assignedMember?.name || 'Member'}.`,
    type: 'info',
    timestamp: new Date().toISOString(),
    read: false,
    relatedMemberId: newTask.assignedMemberId,
    relatedTaskId: newTask.id
  });

  saveDatabase(db);
  res.status(201).json(newTask);
});

app.put('/api/tasks/:id', (req, res) => {
  const db = loadDatabase();
  const taskId = req.params.id;
  const index = db.tasks.findIndex(t => t.id === taskId);

  if (index === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const updatedTask = { ...db.tasks[index], ...req.body };
  if (updatedTask.completionPercentage === 100 && updatedTask.status !== 'Completed') {
    updatedTask.status = 'Completed';
    updatedTask.completedAt = new Date().toISOString().split('T')[0];
  }

  db.tasks[index] = updatedTask;
  saveDatabase(db);
  res.json(updatedTask);
});

app.delete('/api/tasks/:id', (req, res) => {
  const db = loadDatabase();
  const taskId = req.params.id;
  db.tasks = db.tasks.filter(t => t.id !== taskId);
  saveDatabase(db);
  res.json({ success: true, deletedId: taskId });
});

// 5. Update Progress Workflow (Task + Daily Log + Notification)
app.post('/api/tasks/update-progress', (req, res) => {
  const db = loadDatabase();
  const {
    taskId,
    progressPercentage,
    status,
    workCompleted,
    hoursWorked,
    blocker,
    nextStep,
    attachmentName
  } = req.body;

  const targetTask = db.tasks.find(t => t.id === taskId);
  if (!targetTask) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const finalStatus = progressPercentage === 100 ? 'Completed' : (blocker ? 'Blocked' : status);
  const todayStr = new Date().toISOString().split('T')[0];

  // Update Task
  targetTask.completionPercentage = progressPercentage;
  targetTask.status = finalStatus;
  targetTask.hoursWorked = (targetTask.hoursWorked || 0) + (hoursWorked || 0);
  targetTask.blocker = blocker || '';
  targetTask.notes = workCompleted;
  if (progressPercentage === 100) {
    targetTask.completedAt = todayStr;
  }

  // Create Daily Work Log
  const newLog = {
    id: `log-${Date.now()}`,
    date: todayStr,
    memberId: targetTask.assignedMemberId,
    taskId: targetTask.id,
    taskTitle: targetTask.title,
    workCompleted: workCompleted || 'Daily work progress update',
    progressPercentage,
    hoursWorked: hoursWorked || 0,
    status: finalStatus,
    blocker,
    nextStep,
    attachmentName,
    createdAt: new Date().toISOString()
  };
  db.dailyLogs.unshift(newLog);

  // Trigger Notifications
  const memberObj = db.members.find(m => m.id === targetTask.assignedMemberId);
  if (blocker) {
    db.notifications.unshift({
      id: `notif-${Date.now()}`,
      title: 'Blocker Alert',
      message: `${memberObj?.name || 'Member'} reported a blocker on '${targetTask.title}': ${blocker}`,
      type: 'danger',
      timestamp: new Date().toISOString(),
      read: false,
      relatedMemberId: targetTask.assignedMemberId,
      relatedTaskId: targetTask.id
    });
  } else if (progressPercentage === 100) {
    db.notifications.unshift({
      id: `notif-${Date.now()}`,
      title: 'Task Completed',
      message: `${memberObj?.name || 'Member'} completed '${targetTask.title}' (100%)!`,
      type: 'success',
      timestamp: new Date().toISOString(),
      read: false,
      relatedMemberId: targetTask.assignedMemberId,
      relatedTaskId: targetTask.id
    });
  }

  saveDatabase(db);
  res.json({ success: true, task: targetTask, dailyLog: newLog });
});

// 6. Daily Work Logs API
app.get('/api/logs', (req, res) => {
  const db = loadDatabase();
  res.json(db.dailyLogs);
});

app.post('/api/logs', (req, res) => {
  const db = loadDatabase();
  const newLog = {
    ...req.body,
    id: `log-${Date.now()}`,
    createdAt: new Date().toISOString()
  };
  db.dailyLogs.unshift(newLog);
  saveDatabase(db);
  res.status(201).json(newLog);
});

app.delete('/api/logs/:id', (req, res) => {
  const db = loadDatabase();
  const logId = req.params.id;
  db.dailyLogs = db.dailyLogs.filter(l => l.id !== logId);
  saveDatabase(db);
  res.json({ success: true, deletedId: logId });
});

// 7. Notifications API
app.get('/api/notifications', (req, res) => {
  const db = loadDatabase();
  res.json(db.notifications);
});

app.put('/api/notifications/read-all', (req, res) => {
  const db = loadDatabase();
  db.notifications.forEach(n => { n.read = true; });
  saveDatabase(db);
  res.json({ success: true });
});

app.delete('/api/notifications/:id', (req, res) => {
  const db = loadDatabase();
  const id = req.params.id;
  db.notifications = db.notifications.filter(n => n.id !== id);
  saveDatabase(db);
  res.json({ success: true });
});

// 8. Carry Forward Unfinished Tasks
app.post('/api/tasks/carry-forward', (req, res) => {
  const db = loadDatabase();
  const { fromWeek } = req.body;
  const targetNextWeek = Math.min(10, fromWeek + 1);
  let count = 0;

  db.tasks.forEach(t => {
    if (t.week === fromWeek && t.status !== 'Completed') {
      t.week = targetNextWeek;
      count++;
    }
  });

  if (count > 0) {
    db.notifications.unshift({
      id: `notif-${Date.now()}`,
      title: 'Tasks Carried Forward',
      message: `${count} unfinished task(s) from Week ${fromWeek} carried forward to Week ${targetNextWeek}.`,
      type: 'warning',
      timestamp: new Date().toISOString(),
      read: false
    });
  }

  saveDatabase(db);
  res.json({ success: true, count, targetNextWeek });
});

// 9. Reset API
app.post('/api/reset', (req, res) => {
  const defaultData: DatabaseSchema = {
    members: INITIAL_MEMBERS,
    tasks: INITIAL_TASKS,
    dailyLogs: INITIAL_DAILY_LOGS,
    notifications: INITIAL_NOTIFICATIONS,
    roadmap: INITIAL_ROADMAP,
    currentWeek: 1,
    updatedAt: new Date().toISOString()
  };
  saveDatabase(defaultData);
  res.json({ success: true, message: 'Database reset to initial seed data.' });
});

// 10. Import JSON Backup API
app.post('/api/import', (req, res) => {
  const { members, tasks, dailyLogs, notifications } = req.body;
  if (!members || !tasks) {
    return res.status(400).json({ error: 'Invalid backup JSON schema' });
  }

  const db: DatabaseSchema = {
    members,
    tasks,
    dailyLogs: dailyLogs || INITIAL_DAILY_LOGS,
    notifications: notifications || INITIAL_NOTIFICATIONS,
    roadmap: INITIAL_ROADMAP,
    currentWeek: 1,
    updatedAt: new Date().toISOString()
  };

  saveDatabase(db);
  res.json({ success: true, message: 'Database imported successfully.' });
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`🚀 CanSat Express Backend API server running on http://localhost:${PORT}`);
});
