import { useState, useEffect } from 'react';
import { getSharesCount } from '@/services/analytics/shareTracking';

export function useSharesCount() {
  const [sharesCount, setSharesCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch the current shares count
  const fetchSharesCount = async () => {
    try {
      setLoading(true);
      const count = await getSharesCount();
      setSharesCount(count);
      return count;
    } catch (err) {
      console.error('Failed to fetch shares count:', err);
      setError(err instanceof Error ? err.message : 'Unknown error fetching shares count');
      return 0;
    } finally {
      setLoading(false);
    }
  };

  // Load shares count once on initial mount (no polling)
  useEffect(() => {
    fetchSharesCount();
  }, []);

  return {
    sharesCount,
    loading,
    error,
    refreshSharesCount: fetchSharesCount,
  };
}
