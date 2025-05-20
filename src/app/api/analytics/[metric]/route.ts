import type { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/utils/apiHelpers';
import { isMetric, Metric } from '@/types/analytics/metrics';
import { getMetric, incrementMetric } from '@/services/analytics/metricsDb';

/**
 * GET /api/analytics/[metric]
 */
export async function GET(_req: NextRequest, { params }: { params: { metric: string } }) {
  const { metric } = params;

  if (!isMetric(metric)) {
    return errorResponse('Unknown metric', 400);
  }

  try {
    const count = await getMetric(metric as Metric);
    return successResponse({ count });
  } catch (e) {
    return errorResponse(`Failed to fetch ${metric} count`, 500, e);
  }
}

/**
 * POST /api/analytics/[metric]
 */
export async function POST(_req: NextRequest, { params }: { params: { metric: string } }) {
  const { metric } = params;

  if (!isMetric(metric)) {
    return errorResponse('Unknown metric', 400);
  }

  try {
    const count = await incrementMetric(metric as Metric);
    return successResponse({ count });
  } catch (e) {
    return errorResponse(`Failed to update ${metric} count`, 500, e);
  }
}
