import { useState } from 'react';
import { trackReaction } from '@/services/analytics/reactionTracking';

/**
 * Hook that lets the user react to a timeline event only once per browser session.
 *
 * Usage:
 *   const { hasReacted, react } = useSessionReaction(eventId);
 *
 * `react()` performs an optimistic update – it immediately marks the event as reacted
 * locally and then fires the analytics request in the background.
 */
export function useSessionReaction(eventId: string) {
  // Determine the initial reacted state from sessionStorage (run once per mount)
  const [hasReacted, setHasReacted] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;

    try {
      const raw = window.sessionStorage.getItem('reactedEvents');
      if (!raw) return false;

      const list: string[] = JSON.parse(raw);
      return list.includes(eventId);
    } catch {
      return false;
    }
  });

  // Persist the eventId in sessionStorage so the user can't react again this session
  const persistReaction = () => {
    try {
      const raw = window.sessionStorage.getItem('reactedEvents');
      const list: string[] = raw ? JSON.parse(raw) : [];

      if (!list.includes(eventId)) {
        list.push(eventId);
        window.sessionStorage.setItem('reactedEvents', JSON.stringify(list));
      }
    } catch {
      /* ignore */
    }
  };

  /**
   * Performs the reaction. If the user has already reacted, this is a no-op.
   * Returns a promise that resolves when the analytics call has finished.
   */
  const react = async () => {
    if (hasReacted) return;

    // Optimistic UI
    setHasReacted(true);
    persistReaction();

    // Send analytics in the background – don't block the UI
    try {
      await trackReaction();
    } catch (err) {
      // Non-critical: log but do not rollback the optimistic UI
      console.error('Failed to track reaction:', err);
    }
  };

  return { hasReacted, react } as const;
} 