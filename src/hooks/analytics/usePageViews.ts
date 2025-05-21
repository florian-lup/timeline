import { useState, useEffect } from 'react';
import { trackPageView, getViewCount } from '@/services/analytics/viewTracking';

/**
 * Hook for tracking and retrieving page view counts
 */
export function usePageViews() {
  const [viewCount, setViewCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch current view count
  const fetchViewCount = async () => {
    try {
      setLoading(true);
      const count = await getViewCount();
      setViewCount(count);
      return count;
    } catch (err) {
      console.error('Failed to fetch view count:', err);
      setError(err instanceof Error ? err.message : 'Unknown error fetching view count');
      return 0;
    } finally {
      setLoading(false);
    }
  };

  // Track view and load count on mount
  useEffect(() => {
    const initializeTracking = async () => {
      await trackPageView();
      await fetchViewCount();
    };

    initializeTracking();

    // Optionally set up an interval to refresh the count periodically
    // const intervalId = setInterval(fetchViewCount, 60000); // Refresh every minute

    // return () => clearInterval(intervalId);
  }, []);

  return {
    viewCount,
    loading,
    error,
    refreshViewCount: fetchViewCount,
  };
}
