import { useEffect, useState } from 'react';
import { getAllMetrics, AllMetricsResponse } from '@/services/analytics/api';

/**
 * React hook that retrieves all timeline analytics metrics (views, shares, reactions) in one request.
 */
export function useMetrics() {
  const [metrics, setMetrics] = useState<AllMetricsResponse>({
    views: 0,
    shares: 0,
    reactions: 0,
    entries: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const data = await getAllMetrics();
      setMetrics(data);
      return data;
    } catch (err) {
      console.error('Failed to fetch timeline metrics:', err);
      setError(err instanceof Error ? err.message : 'Unknown error fetching metrics');
      return { views: 0, shares: 0, reactions: 0, entries: 0 };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  return {
    ...metrics,
    loading,
    error,
    refreshMetrics: fetchMetrics,
  };
} 