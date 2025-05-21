import clientPromise from '@/lib/mongodb';
import type { Metric } from '@/types/analytics/metrics';

/**
 * Retrieves metric value from MongoDB
 */
export async function getMetric(metric: Metric): Promise<number> {
  const client = await clientPromise;
  const db = client.db('analytics');

  const doc = await db.collection('metrics').findOne({ pageId: 'timeline', metric });

  return doc?.count ?? 0;
}

/**
 * Increments metric value in MongoDB
 */
export async function incrementMetric(metric: Metric): Promise<number> {
  const client = await clientPromise;
  const db = client.db('analytics');

  await db
    .collection('metrics')
    .updateOne({ pageId: 'timeline', metric }, { $inc: { count: 1 } }, { upsert: true });

  const doc = await db.collection('metrics').findOne({ pageId: 'timeline', metric });

  return doc?.count ?? 0;
}
