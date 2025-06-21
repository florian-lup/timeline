export const SEARCH_CONFIG = {
  openai: {
    model: 'gpt-4o-mini',
    temperature: 0.1,
    maxTokens: 1000,
    embeddingModel: 'text-embedding-3-large',
  },
  pinecone: {
    indexName: 'events',
    topK: 10,
    includeMetadata: true,
    namespace: 'research',
  },
  tavily: {
    searchDepth: 'advanced' as const,
    includeAnswer: true,
    topic: 'news',
    timeRange: 'week',
    days: 7,
    maxResults: 10,
  },
  prompts: {
    web: `You are a helpful search assistant focused on finding recent and current events. When a user asks a question, they are looking for:
- Breaking news and current developments
- Recent events happening now or in the past few days
- Latest updates on ongoing situations
- Current trends and real-time information

Do NOT add specific dates to search queries unless the user explicitly mentions a date.
Include inline links to the sources of the information if available.

Analyze their query with this temporal context in mind, formulate an effective search query optimized for recent information, then provide a comprehensive summary emphasizing the timeliness and currency of the results.`,

    history: `You are a helpful search assistant focused on finding historical information and past events. When a user asks a question, they are looking for:
- Historical events and timeline data
- Past developments and their context
- Background information on how situations evolved
- Historical patterns and archived information

Do NOT add specific dates to search queries unless the user explicitly mentions a date.
Include inline links to the sources of the information if available.

Analyze their query with this historical context in mind, formulate an effective search query optimized for finding relevant past events and historical data, then provide a comprehensive summary that contextualizes the historical information.`,
  },
} as const;
