import { create } from 'zustand';
import { Task, TaskStatus, TaskPriority, User, Sprint, Comment, TaskFilters } from '../types';

interface MoveHistory {
  taskId: number;
  fromStatus: TaskStatus;
  toStatus: TaskStatus;
  fromOrder: number;
  toOrder: number;
}

interface BoardStore {
  tasks: Task[];
  users: User[];
  sprints: Sprint[];
  comments: Comment[];
  filters: TaskFilters;
  isInitialized: boolean;
  selectedTaskId: number | null;
  lastMove: MoveHistory | null;

  // Actions
  initializeBoard: (data: { tasks: Task[]; users: User[]; sprints: Sprint[]; comments: Comment[] }) => void;
  setSelectedTaskId: (id: number | null) => void;
  setFilters: (filters: Partial<TaskFilters>) => void;
  resetFilters: () => void;
  
  // Task CRUD
  addTask: (task: Omit<Task, 'id' | 'order' | 'createdAt'>) => Task;
  updateTask: (id: number, updates: Partial<Task>) => void;
  deleteTask: (id: number) => void;
  moveTask: (taskId: number, newStatus: TaskStatus, newIndex?: number) => void;
  undoLastMove: () => void;

  // Comments
  addComment: (taskId: number, authorId: number, message: string) => Comment;
}

const STORAGE_KEY_TASKS = 'sprintdesk_tasks_state_v1';
const STORAGE_KEY_COMMENTS = 'sprintdesk_comments_state_v1';

const getStoredTasks = (): Task[] | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_TASKS);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const saveStoredTasks = (tasks: Task[]) => {
  try {
    localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(tasks));
  } catch {
    // Ignore storage quota errors
  }
};

const getStoredComments = (): Comment[] | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_COMMENTS);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const saveStoredComments = (comments: Comment[]) => {
  try {
    localStorage.setItem(STORAGE_KEY_COMMENTS, JSON.stringify(comments));
  } catch {
    // Ignore storage quota errors
  }
};

export const useBoardStore = create<BoardStore>((set, get) => ({
  tasks: [],
  users: [],
  sprints: [],
  comments: [],
  filters: {
    search: '',
    priority: 'all',
    assigneeId: 'all',
  },
  isInitialized: false,
  selectedTaskId: null,
  lastMove: null,

  initializeBoard: (data) => {
    const storedTasks = getStoredTasks();
    const storedComments = getStoredComments();

    const finalTasks = storedTasks && storedTasks.length > 0 ? storedTasks : data.tasks;
    const finalComments = storedComments && storedComments.length > 0 ? storedComments : data.comments;

    saveStoredTasks(finalTasks);
    saveStoredComments(finalComments);

    set({
      tasks: finalTasks,
      users: data.users,
      sprints: data.sprints,
      comments: finalComments,
      isInitialized: true,
    });
  },

  setSelectedTaskId: (id) => set({ selectedTaskId: id }),

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    }));
  },

  resetFilters: () => {
    set({
      filters: { search: '', priority: 'all', assigneeId: 'all' },
    });
  },

  addTask: (newTaskData) => {
    const { tasks } = get();
    const newId = tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) + 1 : 1;
    const sameColumnTasks = tasks.filter((t) => t.status === newTaskData.status);
    const maxOrder = sameColumnTasks.length > 0 ? Math.max(...sameColumnTasks.map((t) => t.order)) : 0;

    const newTask: Task = {
      ...newTaskData,
      id: newId,
      order: maxOrder + 1,
      createdAt: new Date().toISOString(),
      completedAt: newTaskData.status === 'done' ? new Date().toISOString() : null,
      updatedAt: new Date().toISOString(),
    };

    const updatedTasks = [...tasks, newTask];
    saveStoredTasks(updatedTasks);
    set({ tasks: updatedTasks });
    return newTask;
  },

  updateTask: (id, updates) => {
    const { tasks } = get();
    const updatedTasks = tasks.map((t) => {
      if (t.id === id) {
        const completedAt =
          updates.status === 'done' && t.status !== 'done'
            ? new Date().toISOString()
            : updates.status && updates.status !== 'done'
            ? null
            : t.completedAt;

        return {
          ...t,
          ...updates,
          completedAt,
          updatedAt: new Date().toISOString(),
        };
      }
      return t;
    });

    saveStoredTasks(updatedTasks);
    set({ tasks: updatedTasks });
  },

  deleteTask: (id) => {
    const { tasks, selectedTaskId } = get();
    const updatedTasks = tasks.filter((t) => t.id !== id);
    saveStoredTasks(updatedTasks);
    set({
      tasks: updatedTasks,
      selectedTaskId: selectedTaskId === id ? null : selectedTaskId,
    });
  },

  moveTask: (taskId, newStatus, newIndex) => {
    const { tasks } = get();
    const currentTask = tasks.find((t) => t.id === taskId);
    if (!currentTask) return;

    const oldStatus = currentTask.status;
    const oldOrder = currentTask.order;

    // Filter out the moving task
    const remainingTasks = tasks.filter((t) => t.id !== taskId);

    // Get tasks in the destination column ordered
    const destTasks = remainingTasks
      .filter((t) => t.status === newStatus)
      .sort((a, b) => a.order - b.order);

    const targetIndex =
      typeof newIndex === 'number' && newIndex >= 0 && newIndex <= destTasks.length
        ? newIndex
        : destTasks.length;

    const completedAt =
      newStatus === 'done' && oldStatus !== 'done'
        ? new Date().toISOString()
        : newStatus !== 'done'
        ? null
        : currentTask.completedAt;

    const updatedCurrentTask: Task = {
      ...currentTask,
      status: newStatus,
      completedAt,
      updatedAt: new Date().toISOString(),
    };

    // Insert task at targetIndex
    destTasks.splice(targetIndex, 0, updatedCurrentTask);

    // Reassign sequential orders in target column
    const reorderedDest = destTasks.map((t, idx) => ({
      ...t,
      order: idx + 1,
    }));

    // Reorder source column if it changed
    let reorderedSource: Task[] = [];
    if (oldStatus !== newStatus) {
      const sourceTasks = remainingTasks
        .filter((t) => t.status === oldStatus)
        .sort((a, b) => a.order - b.order);
      reorderedSource = sourceTasks.map((t, idx) => ({
        ...t,
        order: idx + 1,
      }));
    }

    // Combine all tasks
    const otherTasks = remainingTasks.filter(
      (t) => t.status !== newStatus && t.status !== oldStatus
    );

    const finalTasks = [...otherTasks, ...reorderedSource, ...reorderedDest];
    saveStoredTasks(finalTasks);

    set({
      tasks: finalTasks,
      lastMove: {
        taskId,
        fromStatus: oldStatus,
        toStatus: newStatus,
        fromOrder: oldOrder,
        toOrder: targetIndex + 1,
      },
    });
  },

  undoLastMove: () => {
    const { lastMove } = get();
    if (!lastMove) return;
    const { taskId, fromStatus, fromOrder } = lastMove;
    get().moveTask(taskId, fromStatus, fromOrder - 1);
    set({ lastMove: null });
  },

  addComment: (taskId, authorId, message) => {
    const { comments } = get();
    const newId = comments.length > 0 ? Math.max(...comments.map((c) => c.id)) + 1 : 1;
    const newComment: Comment = {
      id: newId,
      taskId,
      authorId,
      message,
      createdAt: new Date().toISOString(),
    };
    const updatedComments = [newComment, ...comments];
    saveStoredComments(updatedComments);
    set({ comments: updatedComments });
    return newComment;
  },
}));
