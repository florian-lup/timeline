import { successResponse, errorResponse } from '@/utils/apiHelpers';
import { ALLOWED_METRICS, Metric } from '@/types/analytics/metrics';
import { getMetric } from '@/services/analytics/metricsDb';

/**
 * GET /api/analytics – returns the current count for all metrics in one payload
 * Response format:
 * {
 *   views: number,
 *   shares: number,
 *   reactions: number
 * }
 */
export async function GET() {
  try {
    // Fetch counts for every allowed metric in parallel
    const counts = await Promise.all(ALLOWED_METRICS.map((m: Metric) => getMetric(m)));

    const [views, shares, reactions, entries] = counts;

    return successResponse({ views, shares, reactions, entries });
  } catch (e) {
    return errorResponse('Failed to fetch analytics metrics', 500, e);
  }
} 