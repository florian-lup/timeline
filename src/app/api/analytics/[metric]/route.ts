import type { NextRequest } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { successResponse, errorResponse } from '@/utils/apiHelpers';

// Allowed metric names that can be queried / updated
const ALLOWED_METRICS = ['views', 'shares', 'reactions'] as const;
type Metric = (typeof ALLOWED_METRICS)[number];

function isMetric(str: string): str is Metric {
  return ALLOWED_METRICS.includes(str as Metric);
}

/**
 * GET /api/analytics/[metric]
 * Returns the current count for the given metric (views, shares, reactions) on the timeline page.
 */
export async function GET(_req: NextRequest, { params }: { params: Promise<{ metric: string }> }) {
  const { metric } = await params;

  if (!isMetric(metric)) {
    return errorResponse('Unknown metric', 400);
  }

  try {
    const client = await clientPromise;
    const db = client.db('analytics');

    // Each metric is stored as a document keyed by pageId + metric
    const doc = await db.collection('metrics').findOne({ pageId: 'timeline', metric });

    return successResponse({ count: doc?.count ?? 0 });
  } catch (error) {
    console.error(`Error fetching ${metric} count:`, error);
    return errorResponse(`Failed to fetch ${metric} count`, 500, error);
  }
}

/**
 * POST /api/analytics/[metric]
 * Increments the counter for the given metric (views, shares, reactions) on the timeline page.
 */
export async function POST(_req: NextRequest, { params }: { params: Promise<{ metric: string }> }) {
  const { metric } = await params;

  if (!isMetric(metric)) {
    return errorResponse('Unknown metric', 400);
  }

  try {
    const client = await clientPromise;
    const db = client.db('analytics');

    // Increment atomically and upsert if doc doesn't exist
    await db.collection('metrics').updateOne(
      { pageId: 'timeline', metric },
      { $inc: { count: 1 } },
      { upsert: true }
    );

    // Fetch updated count
    const doc = await db.collection('metrics').findOne({ pageId: 'timeline', metric });

    return successResponse({ count: doc?.count ?? 0 });
  } catch (error) {
    console.error(`Error updating ${metric} count:`, error);
    return errorResponse(`Failed to update ${metric} count`, 500, error);
  }
} 