declare namespace NodeJS {
  interface ProcessEnv {
    // Next.js
    NEXT_PUBLIC_BASE_URL?: string;

    // Database
    MONGODB_URI?: string;

    // Pinecone
    PINECONE_API_KEY?: string;
    PINECONE_ENVIRONMENT?: string;
    PINECONE_INDEX?: string;

    // OpenAI
    OPENAI_API_KEY?: string;

    // Add other environment variables as needed
  }
} 