import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from 'openai';
import axios from 'axios';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

// API keys and configuration
const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;
const OPENAI_API = process.env.OPENAI_API;
const PINECONE_API_KEY = process.env.PINECONE_API_KEY;
const PINECONE_INDEX_NAME = process.env.PINECONE_INDEX_NAME || 'events';
const MONGODB_URI = process.env.MONGODB_URI || '';

// Check for required environment variables
if (!PERPLEXITY_API_KEY || !OPENAI_API || !PINECONE_API_KEY || !MONGODB_URI) {
  console.error('Missing required environment variables');
  console.error('Required: PERPLEXITY_API_KEY, OPENAI_API, PINECONE_API_KEY, MONGODB_URI');
  process.exit(1);
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
  sources: string[];
  embedding?: number[];
  timestamp: Date;
}

// Function to fetch events from Perplexity API
async function fetchEvents(): Promise<EventData[]> {
  console.log('Fetching events from Perplexity API...');
  
  const today = new Date();
  const formattedDate = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
  
  // Format today's date for Perplexity's date filter (MM/DD/YYYY)
  const month = today.getMonth() + 1;
  const day = today.getDate();
  const year = today.getFullYear();
  const perplexityDateFormat = `${month}/${day}/${year}`;
  
  console.log(`Using date format: ${formattedDate} (ISO) and ${perplexityDateFormat} (Perplexity)`);
  
  try {
    // Fixed API request based on error message
    const response = await axios.post(
      'https://api.perplexity.ai/chat/completions',
      {
        model: "sonar",
        messages: [
          { 
            role: "user", 
            content: `What are the major global events happening today (${formattedDate})? Please list the top 5 major global events happening right now. For each event, provide a headline and a 1-2 sentence summary.`
          }
        ],
        // Simplified response format to use text
        response_format: { 
          type: "text" 
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
      
      // Since we're using text format, we'll need to parse the textual response
      // into structured data
      try {
        // Extract events from the text response
        const events = parseTextIntoEvents(content);
        console.log(`Parsed ${events.length} events from text response`);
        
        // Add sources (if available) and timestamp to each event
        const sources = response.data.sources || [];
        return events.map((event: EventData) => ({
          ...event,
          sources,
          timestamp: new Date()
        }));
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
  
  try {
    await index.upsert([{
      id: `event-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      values: event.embedding!,
      metadata: {
        headline: event.event_headline,
        summary: event.event_summary,
        sources: event.sources,
        timestamp: event.timestamp.toISOString()
      }
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
      sources: event.sources,
      timestamp: event.timestamp
    });
    
    console.log(`Stored event in MongoDB: ${event.event_headline}`);
  } catch (error) {
    console.error('Error storing event in MongoDB:', error);
    throw error;
  } finally {
    await client.close();
  }
}

// Function to parse text response into structured events
function parseTextIntoEvents(text: string): EventData[] {
  console.log('Parsing text into events:', text.substring(0, 100) + '...');
  
  // Initialize an empty array for events
  const events: EventData[] = [];
  
  try {
    // Simple pattern matching: Look for numbered or bulleted items
    // This is a basic implementation that can be enhanced
    
    // Split by lines or paragraphs
    const lines = text.split(/\n+/);
    
    let currentHeadline = '';
    let currentSummary = '';
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Skip empty lines
      if (!line) continue;
      
      // Check if this is a headline (numbered or with a special character)
      const headlineMatch = line.match(/^(\d+[\.\):]|[\*\-•])?\s*(.+?):(.*)$/);
      
      if (headlineMatch) {
        // If we already have a headline and summary, save the previous event
        if (currentHeadline && currentSummary) {
          events.push({
            event_headline: currentHeadline,
            event_summary: currentSummary,
            sources: [],
            timestamp: new Date()
          });
        }
        
        // Set the new headline and summary
        currentHeadline = headlineMatch[2].trim();
        currentSummary = headlineMatch[3].trim();
      } else if (line.match(/^(\d+[\.\):]|[\*\-•])\s+(.+)$/)) {
        // Handle bullet point format without colon
        const bulletMatch = line.match(/^(\d+[\.\):]|[\*\-•])\s+(.+)$/);
        
        if (bulletMatch) {
          // If we already have a headline and summary, save the previous event
          if (currentHeadline && currentSummary) {
            events.push({
              event_headline: currentHeadline,
              event_summary: currentSummary,
              sources: [],
              timestamp: new Date()
            });
          }
          
          // Set the new headline and prepare for the summary in the next lines
          currentHeadline = bulletMatch[2].trim();
          currentSummary = '';
          
          // Look ahead to the next line for the summary
          if (i + 1 < lines.length) {
            currentSummary = lines[i + 1].trim();
            i++; // Skip the next line since we've used it as summary
          }
        }
      } else if (currentHeadline && !currentSummary) {
        // If we have a headline but no summary, this line is the summary
        currentSummary = line;
      } else if (currentHeadline && currentSummary) {
        // If we already have both, append to the summary
        currentSummary += ' ' + line;
      }
    }
    
    // Add the last event if there is one
    if (currentHeadline && currentSummary) {
      events.push({
        event_headline: currentHeadline,
        event_summary: currentSummary,
        sources: [],
        timestamp: new Date()
      });
    }
    
    console.log(`Found ${events.length} events in the text`);
    return events;
  } catch (error) {
    console.error('Error parsing text into events:', error);
    return [];
  }
}

// Main pipeline function
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
    process.exit(1);
  }
}

// Run the pipeline if this file is executed directly
console.log('Checking if this module should run the pipeline...');
console.log('import.meta.url:', import.meta.url);
try {
  console.log('process.argv[1]:', process.argv[1]);
  console.log('import.meta.resolve(process.argv[1]):', import.meta.resolve(process.argv[1]));
} catch (error: unknown) {
  console.log('Error resolving process.argv[1]:', error instanceof Error ? error.message : String(error));
}

// Always run the pipeline when imported
runEventPipeline();

export { runEventPipeline }; 