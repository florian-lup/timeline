import axios from 'axios';
import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from 'openai';
import { config } from '@/lib/config';
import { stripMarkdown } from '@/utils/textProcessing';
import { EventData, PerplexityResponse } from './types/types';
import clientPromise from '@/lib/mongodb';

// Initialize clients
const openai = new OpenAI({
  apiKey: config.api.openai.key,
});

const pinecone = new Pinecone({
  apiKey: config.storage.pinecone.apiKey,
});

/**
 * Fetches recent events from Perplexity API
 * @returns Array of event data objects
 */
export async function fetchEvents(): Promise<EventData[]> {
  console.log('Fetching events from Perplexity API...');
  
  const today = new Date();
  
  // Format date as MM/DD/YYYY for Perplexity API date filter
  const formattedDate = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;
  // Keep ISO format for display in the prompt
  const isoDate = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
  
  console.log(`Using date filters: ${formattedDate} (formatted), ${isoDate} (ISO)`);
  
  try {
    // API request with date filter instead of recency filter
    const response = await axios.post<PerplexityResponse>(
      `${config.api.perplexity.baseUrl}/chat/completions`,
      {
        model: "sonar-reasoning",
        messages: [
          { 
            role: "user", 
            content: `Research and identify at least 5 or more of the most significant global events happening TODAY ONLY (${isoDate}). Focus on truly impactful events that occurred specifically today. Include a diverse range of topics that matter on a global scale. For each event:
1. Provide a clear, compelling headline (under 100 characters)
2. Write a concise summary (approximately 500 characters) that captures the key details and significance
3. Include events from diverse geographical regions
4. Prioritize accuracy and factual information from reliable sources

You MUST return a properly formatted JSON array of events, with each event having event_headline and event_summary fields.`
          }
        ],
        search_after_date_filter: formattedDate, // Filter for events on current date only
        search_before_date_filter: formattedDate, // Filter for events on current date only
        response_format: {
          type: "json_schema",
          json_schema: {
            schema: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  event_headline: { type: "string" },
                  event_summary: { type: "string" }
                },
                required: ["event_headline", "event_summary"]
              }
            }
          }
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${config.api.perplexity.key}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('API response status:', response.status);
    console.log('Response structure:', JSON.stringify({
      choices_length: response.data?.choices?.length || 0
    }));
    
    if (response.data?.choices?.length > 0) {
      const content = response.data.choices[0].message.content;
      console.log('Content starts with:', content.substring(0, 100) + '...');
      
      try {
        // Parse the JSON response
        let jsonContent = content;
        
        // Extract JSON portion after </think> tag if present
        if (content.includes('</think>')) {
          console.log('Found </think> tag, extracting JSON content after it');
          jsonContent = content.split('</think>')[1].trim();
          console.log('Extracted content starts with:', jsonContent.substring(0, 100) + '...');
        }
        
        // Check if jsonContent looks like JSON and extract if needed
        if (!jsonContent.trim().startsWith('[') && !jsonContent.trim().startsWith('{')) {
          console.log('Content does not appear to be valid JSON, trying to extract JSON portion');
          // Try to find JSON array in the content
          const jsonMatch = content.match(/(\[[\s\S]*\])/g) || content.match(/(\{[\s\S]*\})/g);
          if (jsonMatch) {
            jsonContent = jsonMatch[0];
            console.log('Extracted potential JSON content');
          } else {
            console.error('Could not find valid JSON in the response');
            console.log('Full content:', content);
            return [];
          }
        }
        
        // Parse JSON content
        const events: EventData[] = JSON.parse(jsonContent);
        console.log(`Found ${events.length} events in JSON response`);
        
        // Validate that events have required properties
        const validEvents = events.filter(event => 
          event && 
          typeof event === 'object' && 
          'event_headline' in event && 
          'event_summary' in event
        );
        
        if (validEvents.length !== events.length) {
          console.warn(`Found ${events.length} events but only ${validEvents.length} have valid properties`);
        }
        
        console.log(`Parsed ${validEvents.length} events successfully`);
        
        // Log events
        validEvents.forEach((event, index) => {
          console.log(`Event ${index + 1}: "${event.event_headline}"`);
        });
        
        // Clean markdown formatting from headlines and summaries
        return validEvents.map(event => ({
          ...event,
          event_headline: stripMarkdown(event.event_headline),
          event_summary: stripMarkdown(event.event_summary)
        }));
      } catch (error) {
        console.error('Error parsing events from response:', error);
        console.log('Raw content:', content);
        return [];
      }
    } else {
      console.log('No choices found in API response');
      console.log('Response data structure:', JSON.stringify(Object.keys(response.data || {})));
      return [];
    }
  } catch (error) {
    logApiError(error);
    return [];
  }
}

/**
 * Generates embeddings for an event using OpenAI
 * @param event Event data to generate embeddings for
 * @returns Event with embedding field populated
 */
export async function generateEmbedding(event: EventData): Promise<EventData> {
  const text = `${event.event_headline} ${event.event_summary}`;
  
  try {
    const response = await openai.embeddings.create({
      model: config.api.openai.embeddingModel,
      input: text,
      dimensions: config.api.openai.embeddingDimensions
    });
    
    return {
      ...event,
      embedding: response.data[0].embedding
    };
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
}

/**
 * Checks if an event is a duplicate based on embedding similarity
 * @param embedding Embedding vector to check
 * @param threshold Similarity threshold (0-1)
 * @returns Whether the event is a duplicate
 */
export async function isDuplicate(embedding: number[], threshold = config.storage.pinecone.similarityThreshold): Promise<boolean> {
  const index = pinecone.index(config.storage.pinecone.indexName);
  
  try {
    const queryResponse = await index.query({
      vector: embedding,
      topK: 1,
      includeMetadata: true,
    });
    
    if (queryResponse.matches?.length > 0) {
      const match = queryResponse.matches[0];
      if (match.score && match.score >= threshold) {
        console.log(`Duplicate found with similarity score: ${match.score}`);
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error('Error checking for duplicates:', error);
    return false;
  }
}

/**
 * Stores an event in Pinecone vector database
 * @param event Event data with embedding to store
 */
export async function indexEvent(event: EventData): Promise<void> {
  if (!event.embedding) {
    throw new Error('Cannot index event without embedding');
  }
  
  const index = pinecone.index(config.storage.pinecone.indexName);
  
  // Prepare metadata
  const metadata: Record<string, string | number | boolean> = {
    headline: event.event_headline,
    summary: event.event_summary
  };
  
  try {
    await index.upsert([{
      id: `event-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      values: event.embedding,
      metadata
    }]);
    
    console.log(`Indexed event: ${event.event_headline}`);
  } catch (error) {
    console.error('Error indexing event in Pinecone:', error);
    throw error;
  }
}

/**
 * Stores an event in MongoDB
 * @param event Event data to store
 */
export async function storeEvent(event: EventData): Promise<void> {
  try {
    const client = await clientPromise;
    const database = client.db(config.storage.mongodb.dbNames.events);
    const collection = database.collection(config.storage.mongodb.collections.events);
    
    await collection.insertOne({
      headline: event.event_headline,
      summary: event.event_summary
    });
    
    console.log(`Stored event in MongoDB: ${event.event_headline}`);
  } catch (error) {
    console.error('Error storing event in MongoDB:', error);
    throw error;
  }
}

/**
 * Helper function to log API errors in a consistent way
 */
function logApiError(error: unknown): void {
  if (error && typeof error === 'object' && 'response' in error) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    const axiosError = error as { 
      response: { 
        status: number; 
        data: Record<string, unknown>; 
        headers: Record<string, string>; 
      } 
    };
    console.error('API Error Response:', {
      status: axiosError.response.status,
      data: axiosError.response.data
    });
  } else if (error && typeof error === 'object' && 'request' in error) {
    // The request was made but no response was received
    console.error('No response received from API');
  } else {
    // Something happened in setting up the request
    console.error('Error setting up request:', error instanceof Error ? error.message : String(error));
  }
} 