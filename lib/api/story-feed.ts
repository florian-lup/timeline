import type { StoryData } from '@/types/story';

export interface PaginatedStories {
  entries: StoryData[];
  nextPage?: string;
  hasMore: boolean;
}

/**
 * Fetches stories using cursor-based pagination
 * Uses _id as cursor since it encodes creation time
 */
export async function fetchStories(
  before?: string,
  limit: number = 20,
): Promise<PaginatedStories> {
  const params = new URLSearchParams({
    limit: limit.toString(),
  });

  if (before !== undefined) {
    params.set('before', before);
  }

  const response = await fetch(`/api/feed?${params}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch stories: ${response.statusText}`);
  }

  return response.json() as Promise<PaginatedStories>;
}
