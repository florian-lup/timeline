/**
 * Chat message interface for the news search chatbot
 */
export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  sources?: string[];
}

/**
 * Perplexity API request interface
 */
export interface PerplexityRequest {
  model: string;
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
  stream?: boolean;
  search_after_date_filter?: string;
  search_before_date_filter?: string;
  last_updated_after_filter?: string;
  last_updated_before_filter?: string;
  return_citations?: boolean;
  return_images?: boolean;
  return_related_questions?: boolean;
}

/**
 * Perplexity API response interface
 */
export interface PerplexityResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    finish_reason: string;
    message: {
      role: 'assistant';
      content: string;
    };
    delta?: {
      role?: string;
      content?: string;
    };
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  citations?: string[];
  search_results?: Array<{
    title: string;
    url: string;
    date?: string;
    last_updated?: string;
  }>;
}

/**
 * Chat API request/response types for our internal API
 */
export interface ChatApiRequest {
  message: string;
  conversation?: ChatMessage[];
}

export interface ChatApiResponse {
  message: ChatMessage;
  error?: string;
} 