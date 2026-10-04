export type Priority = 'Low' | 'Medium' | 'High' | 'Critical';
export type TaskStatus = 'Not Started' | 'In Progress' | 'Completed' | 'Blocked' | 'Overdue';
export type MemberStatusToday = 'On Track' | 'Needs Attention' | 'Blocked';
export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  shortRole: string;
  team: 'Software' | 'Hardware' | '3D Design & Mechanical';
  responsibility: string;
  avatar: string;
  email: string;
  statusToday: MemberStatusToday;
  statusReason?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedMemberId: string;
  week: number;
  day?: DayOfWeek;
  startDate: string;
  dueDate: string;
  priority: Priority;
  status: TaskStatus;
  completionPercentage: number;
  hoursWorked?: number;
  notes?: string;
  blocker?: string;
  completedAt?: string;
}

export interface DailyWorkLog {
  id: string;
  date: string;
  memberId: string;
  taskId: string;
  taskTitle: string;
  workCompleted: string;
  progressPercentage: number;
  hoursWorked: number;
  status: TaskStatus;
  blocker?: string;
  nextStep?: string;
  attachmentName?: string;
  createdAt: string;
}

export interface RoadmapWeek {
  weekNumber: number;
  title: string;
  objective: string;
  phase: string;
  startDate: string;
  endDate: string;
  responsibleMemberIds: string[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'danger' | 'success';
  timestamp: string;
  read: boolean;
  relatedMemberId?: string;
  relatedTaskId?: string;
}
