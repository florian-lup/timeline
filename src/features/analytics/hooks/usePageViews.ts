import { useState, useEffect } from 'react';
import { trackPageView, getViewCount } from '@/features/analytics/viewTracking';

export function usePageViews() {
  const [viewCount, setViewCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch the current view count
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

  // Load view count on initial mount and track the view
  useEffect(() => {
    // Track the page view and then fetch the updated count
    const initializeTracking = async () => {
      // First track the view
      await trackPageView();

      // Then fetch the updated count
      await fetchViewCount();
    };

    initializeTracking();

    // Optionally set up an interval to refresh the count periodically
    // const intervalId = setInterval(fetchViewCount, 60000); // Refresh every minute

    // return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    viewCount,
    loading,
    error,
    refreshViewCount: fetchViewCount
  };
} 