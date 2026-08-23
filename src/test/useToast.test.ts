import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useToastStore } from '../hooks/useToast';

describe('useToast / useToastStore', () => {
  beforeEach(() => {
    useToastStore.getState().clearToasts();
    vi.useFakeTimers();
  });

  it('should add a new toast with unique ID', () => {
    const id = useToastStore.getState().addToast({
      type: 'success',
      title: 'Task Created',
      message: 'New task added to backlog',
      duration: 3000,
    });

    const toasts = useToastStore.getState().toasts;
    expect(toasts).toHaveLength(1);
    expect(toasts[0].id).toBe(id);
    expect(toasts[0].title).toBe('Task Created');
    expect(toasts[0].type).toBe('success');
  });

  it('should remove a toast manually by ID', () => {
    const id = useToastStore.getState().addToast({
      type: 'error',
      title: 'Error Occurred',
      duration: 5000,
    });

    expect(useToastStore.getState().toasts).toHaveLength(1);

    useToastStore.getState().removeToast(id);
    expect(useToastStore.getState().toasts).toHaveLength(0);
  });

  it('should auto-dismiss toast after specified duration', () => {
    useToastStore.getState().addToast({
      type: 'info',
      title: 'Auto Dismiss',
      duration: 2000,
    });

    expect(useToastStore.getState().toasts).toHaveLength(1);

    // Fast-forward 2500ms
    vi.advanceTimersByTime(2500);

    expect(useToastStore.getState().toasts).toHaveLength(0);
  });
});
