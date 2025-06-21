import type {
  SearchRequest,
  SearchResponse,
} from '@/lib/services/search-service';

/**
 * Client-side search API helper
 */
export async function performSearch({
  query,
  searchType,
}: SearchRequest): Promise<SearchResponse> {
  const response = await fetch('/api/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      searchType,
    }),
  });

  if (!response.ok) {
    throw new Error(`Search failed: ${response.statusText}`);
  }

  return response.json() as Promise<SearchResponse>;
}
