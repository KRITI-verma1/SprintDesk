export interface NotificationItem {
  id: number;
  title: string;
  message: string;
  type?: 'task' | 'review' | 'system' | 'general';
  read: boolean;
  createdAt: string;
}
