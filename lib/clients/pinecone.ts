import { Pinecone } from '@pinecone-database/pinecone';

import { SEARCH_CONFIG } from '@/lib/config/search-config';

// Pinecone SDK automatically reads from PINECONE_API_KEY environment variable
export const pinecone = new Pinecone();

export const pineconeIndex = pinecone.index(SEARCH_CONFIG.pinecone.indexName);
