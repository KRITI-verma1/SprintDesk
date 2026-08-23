import React, { useRef, useEffect } from 'react';
import { useNotificationStore } from '../../store/useNotificationStore';
import { CheckCheck, Bell, ChevronLeft, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';

export const NotificationPopover: React.FC = () => {
  const {
    notifications,
    isOpen,
    setIsOpen,
    page,
    pageSize,
    setPage,
    markAsRead,
    markAllAsRead,
  } = useNotificationStore();

  const popoverRef = useRef<HTMLDivElement>(null);

  // Close when clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, setIsOpen]);

  if (!isOpen) return null;

  const totalPages = Math.max(1, Math.ceil(notifications.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const currentNotifs = notifications.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div
      ref={popoverRef}
      className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Notifications
          </h3>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 text-[10px] font-bold bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 rounded-full">
              {unreadCount} unread
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={() => markAllAsRead()}
            className="text-xs text-brand-600 dark:text-brand-400 hover:text-brand-700 font-medium flex items-center gap-1 transition-colors"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            Mark all read
          </button>
        )}
      </div>

      {/* List */}
      <div className="divide-y divide-slate-100 dark:divide-slate-800/60 max-h-80 overflow-y-auto">
        {currentNotifs.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No notifications available.
          </div>
        ) : (
          currentNotifs.map((item) => (
            <div
              key={item.id}
              onClick={() => !item.read && markAsRead(item.id)}
              className={clsx(
                'p-3.5 transition-colors cursor-pointer flex items-start gap-3',
                item.read
                  ? 'opacity-70 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  : 'bg-brand-50/40 dark:bg-brand-950/30 hover:bg-brand-50/80 dark:hover:bg-brand-950/50'
              )}
            >
              <span
                className={clsx(
                  'w-2 h-2 mt-1.5 rounded-full shrink-0',
                  item.read ? 'bg-transparent' : 'bg-brand-600 dark:bg-brand-400'
                )}
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 line-clamp-1">
                  {item.title}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mt-0.5">
                  {item.message}
                </p>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  {new Date(item.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="p-2.5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(Math.max(1, currentPage - 1))}
              disabled={currentPage <= 1}
              className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40"
              aria-label="Previous notification page"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage >= totalPages}
              className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40"
              aria-label="Next notification page"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
