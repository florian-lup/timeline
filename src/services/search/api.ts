export interface TavilySearchResponse {
  answer?: string;
}

export interface PineconeSearchResponse {
  id: string;
  score: number;
  metadata?: Record<string, unknown>;
}

export interface TimelineSearchResponse {
  answer: string;
}

/**
 * Performs a web search via the internal Next.js API route which proxies the
 * request to Tavily. Keeping the API key safe on the server.
 *
 * @param query - The search query string
 */
export async function fetchWebSearch(query: string): Promise<TavilySearchResponse> {
  const res = await fetch(`/api/search/web?query=${encodeURIComponent(query)}`);

  if (!res.ok) {
    throw new Error(`Web search failed: ${res.status} ${res.statusText}`);
  }

  // We only care about the answer field
  const data = await res.json();
  return { answer: data.answer } as TavilySearchResponse;
}

/**
 * Performs a semantic search against the Timeline Pinecone index via the
 * internal API route. The server handles embedding generation and querying
 * Pinecone so we only need to pass the user query.
 *
 * @param query - The search query string
 */
export async function fetchTimelineSearch(query: string): Promise<TimelineSearchResponse> {
  const res = await fetch(`/api/search/timeline?query=${encodeURIComponent(query)}`);

  if (!res.ok) {
    throw new Error(`Timeline search failed: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return { answer: data.answer } as TimelineSearchResponse;
} 