/**
 * Event data as fetched from Perplexity API
 */
export interface EventData {
  event_headline: string;
  event_summary: string;
  citations?: string[];
  embedding?: number[];
}

/**
 * Perplexity API response structure
 */
export interface PerplexityResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
  citations?: string[];
}

/**
 * Pipeline result with processing statistics
 */
export interface PipelineResult {
  totalEvents: number;
  uniqueEvents: number;
  success: boolean;
  message?: string;
  error?: string;
} 