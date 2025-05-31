export interface TavilySearchResponse {
  answer?: string;
}

export interface TimelineSearchResponse {
  answer: string;
}

export interface HistoryMessage {
  role: 'user' | 'assistant';
  content: string;
}

/**
 * Performs a web search via the internal Next.js API route which proxies the
 * request to Tavily. Keeping the API key safe on the server.
 *
 * @param query - The search query string
 */
export async function fetchWebSearch(
  query: string,
  history: HistoryMessage[] = [],
): Promise<TavilySearchResponse> {
  const res = await fetch('/api/search/web', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, history }),
  });

  if (!res.ok) {
    throw new Error(`Web search failed: ${res.status} ${res.statusText}`);
  }

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
export async function fetchTimelineSearch(
  query: string,
  history: HistoryMessage[] = [],
): Promise<TimelineSearchResponse> {
  const res = await fetch('/api/search/pinecone', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, history }),
  });

  if (!res.ok) {
    throw new Error(`Timeline search failed: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return { answer: data.answer } as TimelineSearchResponse;
}
