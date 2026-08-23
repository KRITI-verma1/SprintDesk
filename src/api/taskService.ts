import rawMockData from '../data/mock-data.json';
import { Task, User, Sprint, Comment, NotificationItem } from '../types';

export interface AppMockData {
  users: User[];
  sprints: Sprint[];
  tasks: Task[];
  comments: Comment[];
  notifications: NotificationItem[];
}

export const taskService = {
  async getInitialData(): Promise<AppMockData> {
    try {
      // Simulate network request latency (150ms) to model real-world API
      await new Promise((resolve) => setTimeout(resolve, 150));
      
      return {
        users: rawMockData.users as User[],
        sprints: rawMockData.sprints as Sprint[],
        // Grab first 30 tasks as required by Task 02
        tasks: (rawMockData.tasks as Task[]).slice(0, 30),
        comments: rawMockData.comments as Comment[],
        notifications: rawMockData.notifications as NotificationItem[],
      };
    } catch {
      // Fallback via fetch
      const res = await fetch('/mock-data.json');
      const data = await res.json();
      return {
        users: data.users,
        sprints: data.sprints,
        tasks: data.tasks.slice(0, 30),
        comments: data.comments,
        notifications: data.notifications,
      };
    }
  },

  async fetchUsers(): Promise<User[]> {
    return (rawMockData.users as User[]) || [];
  },

  async fetchSprints(): Promise<Sprint[]> {
    return (rawMockData.sprints as Sprint[]) || [];
  },
};
