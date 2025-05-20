import clientPromise from '@/lib/mongodb';
import type { TimelineEntry } from '@/types/timeline/TimelineEntry';

export interface ListTimelineOptions {
  page: number;
  limit: number;
  skip: number;
}

export async function listTimelineEntries({ page, limit, skip }: ListTimelineOptions): Promise<{
  entries: TimelineEntry[];
  pagination: { total: number; page: number; limit: number; totalPages: number };
}> {
  const client = await clientPromise;
  const db = client.db('events');

  const docs = await db
    .collection('global')
    .find({})
    .sort({ date: -1, _id: -1 })
    .skip(skip)
    .limit(limit)
    .toArray();

  // Convert MongoDB documents → TimelineEntry (ObjectId → string)
  const entries: TimelineEntry[] = docs.map((doc) => {
    // The driver returns `Document`, we know the shape matches TimelineEntry
    const { _id, ...rest } = doc as unknown as { _id: { toString(): string } } & Omit<TimelineEntry, '_id'>;

    return {
      ...rest,
      _id: _id.toString(),
    } satisfies TimelineEntry;
  });

  const total = await db.collection('global').countDocuments({});

  return {
    entries,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}
