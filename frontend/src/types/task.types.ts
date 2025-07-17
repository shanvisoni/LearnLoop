export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Date;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  priority?: TaskPriority;
  dueDate?: Date;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  priority?: TaskPriority;
  dueDate?: Date;
}

export interface UpdateTaskStatusRequest {
  status: TaskStatus;
}

export interface TaskStats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
}

export interface TaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  search?: string;
  sortBy?: 'createdAt' | 'dueDate' | 'priority' | 'title';
  sortOrder?: 'asc' | 'desc';
}

export const TASK_STATUS_LABELS = {
  [TaskStatus.PENDING]: 'Pending',
  [TaskStatus.IN_PROGRESS]: 'In Progress',
  [TaskStatus.COMPLETED]: 'Completed',
} as const;

export const TASK_PRIORITY_LABELS = {
  [TaskPriority.LOW]: 'Low',
  [TaskPriority.MEDIUM]: 'Medium',
  [TaskPriority.HIGH]: 'High',
} as const;

export const TASK_STATUS_COLORS = {
  [TaskStatus.PENDING]: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  [TaskStatus.IN_PROGRESS]: 'bg-blue-100 text-blue-800 border-blue-200',
  [TaskStatus.COMPLETED]: 'bg-green-100 text-green-800 border-green-200',
} as const;

export const TASK_PRIORITY_COLORS = {
  [TaskPriority.LOW]: 'bg-gray-100 text-gray-800 border-gray-200',
  [TaskPriority.MEDIUM]: 'bg-orange-100 text-orange-800 border-orange-200',
  [TaskPriority.HIGH]: 'bg-red-100 text-red-800 border-red-200',
} as const;