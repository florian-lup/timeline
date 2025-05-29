export interface AllMetricsResponse {
  views: number;
  shares: number;
  reactions: number;
  entries: number;
}

/**
 * Retrieves the counts for all analytics metrics with a single API call to /api/analytics
 */
export const getAllMetrics = async (): Promise<AllMetricsResponse> => {
  try {
    const response = await fetch('/api/analytics');

    if (!response.ok) {
      throw new Error(`Error fetching analytics metrics: ${response.statusText}`);
    }

    const data = (await response.json()) as AllMetricsResponse;

    return {
      views: data.views ?? 0,
      shares: data.shares ?? 0,
      reactions: data.reactions ?? 0,
      entries: data.entries ?? 0,
    };
  } catch (error) {
    console.error('Failed to fetch analytics metrics:', error);
    return {
      views: 0,
      shares: 0,
      reactions: 0,
      entries: 0,
    };
  }
}; 