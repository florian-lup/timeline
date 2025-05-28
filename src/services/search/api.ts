export interface TavilySearchResponse {
  answer?: string;
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