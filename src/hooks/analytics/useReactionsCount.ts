import { useState, useEffect } from 'react';
import { getReactionsCount, trackReaction } from '@/services/analytics/reactionTracking';

/**
 * Hook for managing reactions count
 */
export function useReactionsCount(skipInitialFetch = false) {
  const [reactionsCount, setReactionsCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch current reactions count
  const fetchReactionsCount = async () => {
    try {
      setLoading(true);
      const count = await getReactionsCount();
      setReactionsCount(count);
      return count;
    } catch (err) {
      console.error('Failed to fetch reactions count:', err);
      setError(err instanceof Error ? err.message : 'Unknown error fetching reactions count');
      return 0;
    } finally {
      setLoading(false);
    }
  };

  // Track reaction and refresh count
  const addReaction = async () => {
    try {
      await trackReaction();
      await fetchReactionsCount();
    } catch (err) {
      console.error('Failed to add reaction:', err);
    }
  };

  // Fetch count on mount if not skipped
  useEffect(() => {
    if (!skipInitialFetch) {
      fetchReactionsCount();
    }
  }, [skipInitialFetch]);

  return {
    reactionsCount,
    loading,
    error,
    refreshReactionsCount: fetchReactionsCount,
    addReaction,
  };
}
