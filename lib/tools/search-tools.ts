// Search tools for OpenAI function calling
export const searchTools = [
  {
    type: 'function' as const,
    function: {
      name: 'search_pinecone',
      description:
        'Search through historical timeline data for past events and stories',
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description:
              'The search query to find relevant historical information',
          },
        },
        required: ['query'],
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'search_tavily',
      description: 'Search the web for current events and recent news',
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'The search query to find current web information',
          },
        },
        required: ['query'],
      },
    },
  },
];
