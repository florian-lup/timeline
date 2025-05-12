import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from 'openai';
import axios from 'axios';
import { MongoClient } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

// API keys and configuration
const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;
const OPENAI_API = process.env.OPENAI_API || '';
const PINECONE_API_KEY = process.env.PINECONE_API_KEY || '';
const PINECONE_INDEX_NAME = process.env.PINECONE_INDEX_NAME || 'events';
const MONGODB_URI = process.env.MONGODB_URI || '';
const CRON_SECRET = process.env.CRON_SECRET || '';

// Check for required environment variables
if (!PERPLEXITY_API_KEY || !OPENAI_API || !PINECONE_API_KEY || !MONGODB_URI) {
  console.error('Missing required environment variables');
  console.error('Required: PERPLEXITY_API_KEY, OPENAI_API, PINECONE_API_KEY, MONGODB_URI');
}

// Initialize clients
const openai = new OpenAI({
  apiKey: OPENAI_API,
});

const pinecone = new Pinecone({
  apiKey: PINECONE_API_KEY,
});

interface EventData {
  event_headline: string;
  event_summary: string;
  citations?: string[];
  embedding?: number[];
}

// Function to strip markdown formatting (like ** for bold)
function stripMarkdown(text: string): string {
  if (!text) return '';
  
  // Remove common markdown formatting
  return text
    .replace(/\*\*/g, '')         // Bold: **text**
    .replace(/\*/g, '')           // Italics: *text*
    .replace(/\_\_/g, '')         // Bold: __text__
    .replace(/\_/g, '')           // Italics: _text_
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')  // Links: [text](url) -> text
    .replace(/\[(\d+)\]/g, '')    // Citation references: [5]
    .replace(/\`\`\`[^`]*\`\`\`/g, '')        // Code blocks: ```code```
    .replace(/\`([^`]+)\`/g, '$1')            // Inline code: `code`
    .replace(/\#{1,6}\s?/g, '')               // Headers: # Heading
    .trim();
}

// Function to fetch events from Perplexity API
async function fetchEvents(): Promise<EventData[]> {
  console.log('Fetching events from Perplexity API...');
  
  const today = new Date();
  const formattedDate = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
  
  // Note: Perplexity API only supports "day" as the most granular recency filter
  // It doesn't support hour-level filtering (e.g., "3 hours")
  console.log(`Using recency filter: day (last 24 hours)`);
  
  try {
    // API request with day recency filter
    const response = await axios.post(
      'https://api.perplexity.ai/chat/completions',
      {
        model: "sonar",
        messages: [
          { 
            role: "user", 
            // Adjust prompt to request the most recent events (last few hours)
            content: `What are the major global events happening in the last few hours today (${formattedDate})? Please list the top 5 very recent major global events happening right now. For each event, provide a headline and a summary.`
          }
        ],
        search_recency_filter: "day", // Most granular option available
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
          'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('API response status:', response.status);
    
    if (response.data && response.data.choices && response.data.choices.length > 0) {
      const content = response.data.choices[0].message.content;
      console.log('Received content from API:', typeof content);
      console.log('Content preview:', typeof content === 'string' ? content.substring(0, 300) + '...' : JSON.stringify(content).substring(0, 300) + '...');
      
      // Extract citations from the response - Perplexity provides them at the top level
      const citations = response.data.citations || [];
      
      console.log(`Found ${citations.length} citations in response`);
      
      let events: EventData[] = [];
      
      try {
        // Parse the JSON response
        events = JSON.parse(content);
        console.log('Successfully parsed events from response');
        console.log('Parsed events count:', events.length);
        
        // Clean markdown formatting from headlines and summaries
        events = events.map(event => ({
          ...event,
          event_headline: stripMarkdown(event.event_headline),
          event_summary: stripMarkdown(event.event_summary),
          citations: citations
        }));
        
        if (events.length > 0) {
          console.log('First event:', JSON.stringify(events[0], null, 2));
        }
        
        // Return the events with citations
        return events;
      } catch (error) {
        console.error('Error parsing events from response:', error);
        console.log('Raw content:', content);
        return [];
      }
    } else {
      console.log('No choices in response data:', JSON.stringify(response.data, null, 2));
      return [];
    }
  } catch (error: unknown) {
    // More detailed error logging
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
        data: axiosError.response.data,
        headers: axiosError.response.headers
      });
    } else if (error && typeof error === 'object' && 'request' in error) {
      // The request was made but no response was received
      console.error('No response received:', (error as { request: unknown }).request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error setting up request:', error instanceof Error ? error.message : String(error));
    }
    return [];
  }
}

// Function to generate embeddings for an event
async function generateEmbedding(event: EventData): Promise<number[]> {
  const text = `${event.event_headline} ${event.event_summary}`;
  
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
      dimensions: 1536 // Default for text-embedding-3-small
    });
    
    return response.data[0].embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
}

// Function to detect duplicates in Pinecone
async function isDuplicate(embedding: number[], threshold = 0.9): Promise<boolean> {
  const index = pinecone.index(PINECONE_INDEX_NAME);
  
  try {
    const queryResponse = await index.query({
      vector: embedding,
      topK: 1,
      includeMetadata: true,
    });
    
    if (queryResponse.matches && queryResponse.matches.length > 0) {
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

// Function to index event in Pinecone
async function indexEvent(event: EventData): Promise<void> {
  const index = pinecone.index(PINECONE_INDEX_NAME);
  
  // Prepare metadata with citations if available
  const metadata: Record<string, string | number | boolean> = {
    headline: event.event_headline,
    summary: event.event_summary
  };
  
  // Only add citations if they exist
  if (event.citations && event.citations.length > 0) {
    metadata.citations = JSON.stringify(event.citations);
  }
  
  try {
    await index.upsert([{
      id: `event-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      values: event.embedding!,
      metadata
    }]);
    
    console.log(`Indexed event: ${event.event_headline}`);
  } catch (error) {
    console.error('Error indexing event in Pinecone:', error);
    throw error;
  }
}

// Function to store event in MongoDB
async function storeEvent(event: EventData): Promise<void> {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    const database = client.db('events');
    const collection = database.collection('global');
    
    await collection.insertOne({
      headline: event.event_headline,
      summary: event.event_summary,
      citations: event.citations || []
    });
    
    console.log(`Stored event in MongoDB: ${event.event_headline}`);
  } catch (error) {
    console.error('Error storing event in MongoDB:', error);
    throw error;
  } finally {
    await client.close();
  }
}

// Main pipeline function - removing the export keyword
async function runEventPipeline() {
  console.log('Starting event pipeline...');
  console.log(`Using API keys: Perplexity (${PERPLEXITY_API_KEY ? '✓' : '✗'}), OpenAI (${OPENAI_API ? '✓' : '✗'}), Pinecone (${PINECONE_API_KEY ? '✓' : '✗'})`);
  console.log(`Using MongoDB URI: ${MONGODB_URI ? MONGODB_URI.substring(0, 15) + '...' : '✗'}`);
  
  try {
    // Fetch events
    console.log('Attempting to fetch events from Perplexity API...');
    const events = await fetchEvents();
    console.log(`Fetched ${events.length} events`);
    
    if (events.length === 0) {
      console.log('No events found. Exiting pipeline.');
      return;
    }
    
    let uniqueEventsCount = 0;
    
    // Process each event
    for (const event of events) {
      // Generate embedding
      event.embedding = await generateEmbedding(event);
      
      // Check for duplicates
      const duplicate = await isDuplicate(event.embedding);
      
      if (duplicate) {
        console.log(`Skipping duplicate event: ${event.event_headline}`);
        continue;
      }
      
      // Index in Pinecone
      await indexEvent(event);
      
      // Store in MongoDB
      await storeEvent(event);
      
      uniqueEventsCount++;
    }
    
    console.log(`Pipeline completed. Processed ${events.length} events, found ${uniqueEventsCount} unique events.`);
    
    if (uniqueEventsCount === 0) {
      console.log('All events were duplicates. Stopping the circuit.');
    }
  } catch (error) {
    console.error('Error in event pipeline:', error);
    throw error;
  }
}

// GET handler for cron job
export async function GET(request: NextRequest) {
  // Check authorization if CRON_SECRET is set
  if (CRON_SECRET) {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${CRON_SECRET}`) {
      return new Response('Unauthorized', {
        status: 401,
      });
    }
  }

  try {
    await runEventPipeline();
    return NextResponse.json({ success: true, message: 'Event pipeline executed successfully' });
  } catch (error) {
    console.error('Error executing event pipeline:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to execute event pipeline', error: String(error) },
      { status: 500 }
    );
  }
} 