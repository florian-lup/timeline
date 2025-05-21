import clientPromise from '@/lib/mongodb';
import type { ArticlesData } from '@/types/events/articles';

export interface ListArticlesOptions {
  page: number;
  limit: number;
  skip: number;
}

/**
 * Fetches paginated timeline events from MongoDB
 */
export async function listEvents({ page, limit, skip }: ListArticlesOptions): Promise<{
  entries: ArticlesData[];
  pagination: { total: number; page: number; limit: number; totalPages: number };
}> {
  const client = await clientPromise;
  const db = client.db('events');

  const docs = await db
    .collection('articles')
    .find({})
    .sort({ date: -1, _id: -1 })
    .skip(skip)
    .limit(limit)
    .toArray();

  // Convert MongoDB documents → ArticlesData (ObjectId → string)
  const entries: ArticlesData[] = docs.map((doc) => {
    // The driver returns `Document`, we know the shape matches ArticlesData
    const { _id, ...rest } = doc as unknown as { _id: { toString(): string } } & Omit<ArticlesData, '_id'>;

    return {
      ...rest,
      _id: _id.toString(),
    } satisfies ArticlesData;
  });

  const total = await db.collection('articles').countDocuments({});

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
