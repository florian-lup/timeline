import { useState, useEffect } from 'react';
import { getReactionsCount, trackReaction } from '@/services/analytics/reactionTracking';

export function useReactionsCount(skipInitialFetch = false) {
  const [reactionsCount, setReactionsCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch the current reactions count
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

  // Function to record a reaction and refresh count
  const addReaction = async () => {
    try {
      await trackReaction();
      // Refresh the count after successfully tracking
      await fetchReactionsCount();
    } catch (err) {
      console.error('Failed to add reaction:', err);
    }
  };

  // Load reactions count once on initial mount if not skipped
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
