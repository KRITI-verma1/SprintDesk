import { describe, it, expect, beforeEach } from 'vitest';
import { useBoardStore } from '../store/useBoardStore';
import { Task } from '../types';

const initialMockTasks: Task[] = [
  {
    id: 1,
    title: 'Initial Backlog Task',
    description: 'Test description',
    status: 'backlog',
    priority: 'high',
    assigneeId: 1,
    dueDate: '2026-08-25',
    sprintId: 3,
    order: 1,
    createdAt: '2026-08-15T09:30:00Z',
    completedAt: null,
  },
  {
    id: 2,
    title: 'In Progress Task',
    description: 'Testing progress',
    status: 'in-progress',
    priority: 'medium',
    assigneeId: 2,
    dueDate: '2026-08-26',
    sprintId: 3,
    order: 1,
    createdAt: '2026-08-15T10:00:00Z',
    completedAt: null,
  },
];

describe('useBoardStore', () => {
  beforeEach(() => {
    localStorage.clear();
    useBoardStore.getState().initializeBoard({
      tasks: [...initialMockTasks],
      users: [],
      sprints: [],
      comments: [],
    });
  });

  it('should initialize board with mock tasks', () => {
    const tasks = useBoardStore.getState().tasks;
    expect(tasks).toHaveLength(2);
  });

  it('should add a new task to the board', () => {
    const newTask = useBoardStore.getState().addTask({
      title: 'Newly added task',
      description: 'Brand new task description',
      status: 'review',
      priority: 'low',
      assigneeId: 3,
      dueDate: '2026-08-30',
      sprintId: 3,
    });

    const tasks = useBoardStore.getState().tasks;
    expect(tasks).toHaveLength(3);
    expect(newTask.id).toBeDefined();
    expect(newTask.title).toBe('Newly added task');
    expect(newTask.status).toBe('review');
  });

  it('should move a task between columns', () => {
    // Move task 1 from 'backlog' to 'done'
    useBoardStore.getState().moveTask(1, 'done', 0);

    const task1 = useBoardStore.getState().tasks.find((t) => t.id === 1);
    expect(task1).toBeDefined();
    expect(task1?.status).toBe('done');
    expect(task1?.completedAt).not.toBeNull();
  });

  it('should delete a task from the board', () => {
    useBoardStore.getState().deleteTask(1);

    const tasks = useBoardStore.getState().tasks;
    expect(tasks).toHaveLength(1);
    expect(tasks.find((t) => t.id === 1)).toBeUndefined();
  });

  it('should update task details', () => {
    useBoardStore.getState().updateTask(2, {
      title: 'Updated title',
      priority: 'urgent',
    });

    const task2 = useBoardStore.getState().tasks.find((t) => t.id === 2);
    expect(task2?.title).toBe('Updated title');
    expect(task2?.priority).toBe('urgent');
  });
});
