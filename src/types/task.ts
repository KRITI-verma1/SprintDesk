export type TaskStatus = 'backlog' | 'in-progress' | 'review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId: number;
  dueDate: string;
  sprintId: number;
  order: number;
  createdAt: string;
  completedAt?: string | null;
  updatedAt?: string;
}

export interface TaskFilters {
  search: string;
  priority: string; // 'all' | TaskPriority
  assigneeId: string; // 'all' | number string
}
