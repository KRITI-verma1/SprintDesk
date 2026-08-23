import { NotificationItem } from '../types';

export interface JSONPlaceholderPost {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export const notificationService = {
  async fetchLivePosts(): Promise<JSONPlaceholderPost[]> {
    const res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5');
    if (!res.ok) {
      throw new Error(`Failed to fetch notifications: ${res.status}`);
    }
    return res.json();
  },

  postToNotification(post: JSONPlaceholderPost): NotificationItem {
    return {
      id: post.id + 1000, // Offset to avoid collisions with mock notifications
      title: post.title.slice(0, 30) + (post.title.length > 30 ? '...' : ''),
      message: post.body.slice(0, 80) + '...',
      type: 'general',
      read: false,
      createdAt: new Date().toISOString(),
    };
  },
};
