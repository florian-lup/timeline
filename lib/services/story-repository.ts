import { ObjectId } from 'mongodb';

import mongodb from '@/lib/clients/mongodb';
import type { StoryData } from '@/types/story';

/**
 * Cursor-based pagination interfaces
 */
interface StoryPagination {
  before?: string; // lastId from previous page
  limit: number;
}

/**
 * Fetches cursor-based paginated stories from MongoDB
 * Uses _id as cursor since it encodes creation time and provides unique ordering
 */
export async function getStories({ before, limit }: StoryPagination): Promise<{
  entries: StoryData[];
  nextPage?: string;
  hasMore: boolean;
}> {
  const client = await mongodb;
  const db = client.db('events');

  let query = {};

  // If before cursor exists, find items with _id less than that cursor
  if (before !== undefined) {
    try {
      // Convert string cursor back to ObjectId for proper comparison
      query = { _id: { $lt: new ObjectId(before) } };
    } catch (error) {
      console.error('Invalid cursor provided:', before, error);
      // If cursor is invalid, start from beginning
      query = {};
    }
  }

  // Fetch one extra item to determine if there are more
  const docs = await db
    .collection('articles')
    .find(query)
    .sort({ _id: -1 }) // newest first - _id already encodes creation time
    .limit(limit + 1)
    .toArray();

  // Check if there are more items
  const hasMore = docs.length > limit;
  const itemsToReturn = hasMore ? docs.slice(0, limit) : docs;

  // Convert MongoDB documents → StoryData (ObjectId → string)
  const entries: StoryData[] = itemsToReturn.map(doc => {
    const typedDoc = doc as unknown as { _id: { toString(): string } } & Omit<
      StoryData,
      '_id'
    >;
    const { _id: documentId, ...rest } = typedDoc;

    return {
      ...rest,
      _id: documentId.toString(),
    } satisfies StoryData;
  });

  // Generate next cursor if there are more items
  let nextPage: string | undefined;
  if (hasMore && entries.length > 0) {
    const lastItem = entries[entries.length - 1];
    if (lastItem) {
      nextPage = lastItem._id; // Just use the _id directly as cursor
    }
  }

  return {
    entries,
    ...(nextPage !== undefined && { nextPage }),
    hasMore,
  };
}
