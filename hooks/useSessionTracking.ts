import { useState } from 'react';

/**
 * Configuration for session tracking behavior
 */
interface SessionTrackingConfig {
  /** The sessionStorage key to use */
  storageKey: string;
  /** The type of tracking: 'list' for arrays, 'keyValue' for individual keys */
  type: 'list' | 'keyValue';
}

/**
 * Hook for tracking user actions in sessionStorage to prevent duplicates within a session.
 * Only handles session storage - analytics calls should be handled separately by the component.
 * Supports both list-based tracking (like reactions) and key-value tracking (like page views).
 *
 * @param identifier - The ID/key to track (eventId for reactions, pathname for views, etc.)
 * @param config - Configuration object for tracking behavior
 *
 * Usage for reactions:
 *   const { hasTracked, track } = useSessionTracking(eventId, {
 *     storageKey: 'reactedEvents',
 *     type: 'list'
 *   });
 *
 * Usage for page views:
 *   const { hasTracked, track } = useSessionTracking(pathname, {
 *     storageKey: 'pageViews',
 *     type: 'keyValue'
 *   });
 */
export function useSessionTracking(
  identifier: string,
  config: SessionTrackingConfig,
) {
  const { storageKey, type } = config;

  // Determine initial tracked state from sessionStorage
  const [hasTracked, setHasTracked] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;

    try {
      if (type === 'list') {
        const raw = window.sessionStorage.getItem(storageKey);
        if (!raw) return false;
        const list: string[] = JSON.parse(raw);
        return list.includes(identifier);
      } else {
        // keyValue type - check if specific key exists
        const key = `${storageKey}_${identifier}`;
        return !!window.sessionStorage.getItem(key);
      }
    } catch {
      return false;
    }
  });

  // Persist the identifier in sessionStorage

  const persistTracking = () => {
    try {
      if (type === 'list') {
        const raw = window.sessionStorage.getItem(storageKey);
        const list: string[] = raw ? JSON.parse(raw) : [];

        if (!list.includes(identifier)) {
          list.push(identifier);
          window.sessionStorage.setItem(storageKey, JSON.stringify(list));
        }
      } else {
        // keyValue type - set individual key
        const key = `${storageKey}_${identifier}`;
        window.sessionStorage.setItem(key, 'true');
      }
    } catch {
      /* ignore storage errors */
    }
  };

  /**
   * Marks the item as tracked in session storage. If already tracked, this is a no-op.
   * Only handles session storage - caller is responsible for analytics calls.
   * React 19 will automatically memoize this function
   */
  const track = () => {
    if (hasTracked) return;

    // Optimistic UI update
    setHasTracked(true);
    persistTracking();
  };

  return { hasTracked, track } as const;
}
