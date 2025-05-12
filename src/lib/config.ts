/**
 * Application configuration from environment variables
 */
export const config = {
  api: {
    perplexity: {
      key: process.env.PERPLEXITY_API_KEY || '',
      baseUrl: 'https://api.perplexity.ai'
    },
    openai: {
      key: process.env.OPENAI_API || '',
      embeddingModel: 'text-embedding-3-small',
      embeddingDimensions: 1536
    }
  },
  storage: {
    pinecone: {
      apiKey: process.env.PINECONE_API_KEY || '',
      indexName: process.env.PINECONE_INDEX_NAME || 'events',
      similarityThreshold: 0.9
    },
    mongodb: {
      uri: process.env.MONGODB_URI || '',
      dbNames: {
        events: 'events',
        analytics: 'analytics'
      },
      collections: {
        events: 'global',
        views: 'views'
      }
    }
  },
  security: {
    cronSecret: process.env.CRON_SECRET || ''
  }
};

/**
 * Validates that all required configuration is present
 * @returns Array of missing configuration keys or empty array if all required values are present
 */
export function validateConfig(): string[] {
  const requiredKeys = [
    { path: 'api.perplexity.key', label: 'PERPLEXITY_API_KEY' },
    { path: 'api.openai.key', label: 'OPENAI_API' },
    { path: 'storage.pinecone.apiKey', label: 'PINECONE_API_KEY' },
    { path: 'storage.mongodb.uri', label: 'MONGODB_URI' }
  ];
  
  return requiredKeys
    .filter(({ path }) => {
      const parts = path.split('.');
      let current: Record<string, unknown> = config as Record<string, unknown>;
      
      // Navigate the config object path
      for (const part of parts) {
        if (typeof current !== 'object' || current === null || !(part in current)) {
          return true; // Invalid path or missing value
        }
        current = current[part] as Record<string, unknown>;
        if (!current) return true; // Empty value
      }
      
      return false; // Value exists
    })
    .map(({ label }) => label);
}

/**
 * Checks if all required configuration values are present
 * Logs any missing values
 * @returns true if all required values are present, false otherwise
 */
export function hasRequiredConfig(): boolean {
  const missingKeys = validateConfig();
  
  if (missingKeys.length > 0) {
    console.error('Missing required environment variables:');
    console.error(`Required: ${missingKeys.join(', ')}`);
    return false;
  }
  
  return true;
} 