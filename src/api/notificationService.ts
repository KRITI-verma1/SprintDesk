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
    const notificationMessages = [
      {
        title: 'New sprint activity',
        message: 'A new activity update is available for your sprint.',
      },
      {
        title: 'Sprint update available',
        message: 'Your sprint activity feed has a new update to review.',
      },
      {
        title: 'Team activity update',
        message: 'A teammate has posted a new update in the activity feed.',
      },
    ];
    const copy = notificationMessages[post.id % notificationMessages.length];

    return {
      id: post.id + 1000, // Offset to avoid collisions with mock notifications
      title: copy.title,
      message: copy.message,
      type: 'general',
      read: false,
      createdAt: new Date().toISOString(),
    };
  },
};
