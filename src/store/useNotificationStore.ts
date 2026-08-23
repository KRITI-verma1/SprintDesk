import { create } from 'zustand';
import { NotificationItem } from '../types/notification';

interface NotificationStore {
  notifications: NotificationItem[];
  isOpen: boolean;
  page: number;
  pageSize: number;

  // Actions
  initializeNotifications: (initial: NotificationItem[]) => void;
  setIsOpen: (isOpen: boolean) => void;
  toggleOpen: () => void;
  setPage: (page: number) => void;
  markAsRead: (id: number) => void;
  markAllAsRead: () => void;
  addNotifications: (newItems: NotificationItem[]) => { addedCount: number; newItems: NotificationItem[] };
}

const STORAGE_KEY_NOTIFS = 'sprintdesk_notifications_v2';

const getStoredNotifications = (): NotificationItem[] | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_NOTIFS);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const saveStoredNotifications = (notifs: NotificationItem[]) => {
  try {
    localStorage.setItem(STORAGE_KEY_NOTIFS, JSON.stringify(notifs));
  } catch {
    // Ignore storage quota
  }
};

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  isOpen: false,
  page: 1,
  pageSize: 5,

  initializeNotifications: (initial) => {
    const stored = getStoredNotifications();
    const finalNotifs = stored && stored.length > 0 ? stored : initial;
    saveStoredNotifications(finalNotifs);
    set({ notifications: finalNotifs });
  },

  setIsOpen: (isOpen) => set({ isOpen }),
  toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),
  setPage: (page) => set({ page }),

  markAsRead: (id) => {
    const updated = get().notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    saveStoredNotifications(updated);
    set({ notifications: updated });
  },

  markAllAsRead: () => {
    const updated = get().notifications.map((n) => ({ ...n, read: true }));
    saveStoredNotifications(updated);
    set({ notifications: updated });
  },

  addNotifications: (newItems) => {
    const current = get().notifications;
    const currentIds = new Set(current.map((n) => n.id));
    const trulyNew = newItems.filter((n) => !currentIds.has(n.id));

    if (trulyNew.length === 0) {
      return { addedCount: 0, newItems: [] };
    }

    const updated = [...trulyNew, ...current];
    saveStoredNotifications(updated);
    set({ notifications: updated });

    return { addedCount: trulyNew.length, newItems: trulyNew };
  },
}));
