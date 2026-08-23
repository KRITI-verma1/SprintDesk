import { useEffect, useRef } from 'react';
import { notificationService } from '../api/notificationService';
import { useNotificationStore } from '../store/useNotificationStore';
import { useToast } from './useToast';

export const usePollingNotifications = (pollIntervalMs = 20000) => {
  const { addNotifications, isOpen } = useNotificationStore();
  const { toast } = useToast();
  const timerRef = useRef<any>(null);

  const fetchAndProcess = async () => {
    // If tab is not visible, skip polling
    if (document.hidden) return;

    try {
      const posts = await notificationService.fetchLivePosts();
      const notifs = posts.map(notificationService.postToNotification);
      const { addedCount, newItems } = addNotifications(notifs);

      // If new notifications arrived and panel is closed, show toast
      if (addedCount > 0 && !isOpen) {
        toast.info(
          `${addedCount} New Notification${addedCount > 1 ? 's' : ''}`,
          newItems[0]?.title || 'You have new activity'
        );
      }
    } catch {
      // Network issues during polling handled silently
    }
  };

  useEffect(() => {
    // Initial fetch after 2s
    const initialTimer = setTimeout(fetchAndProcess, 2000);

    const interval = setInterval(fetchAndProcess, pollIntervalMs);
    timerRef.current = interval;

    // Listen for tab visibility changes
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchAndProcess();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [pollIntervalMs, isOpen]);
};
