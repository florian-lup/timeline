import { hasRequiredConfig } from '@/lib/config';
import { EventData, PipelineResult } from './types/types';
import { 
  fetchEvents, 
  generateEmbedding, 
  isDuplicate, 
  indexEvent, 
  storeEvent 
} from './eventService';

/**
 * Main pipeline that fetches, processes, and stores event data
 * @returns Pipeline result with statistics
 */
export async function runEventPipeline(): Promise<PipelineResult> {
  console.log('Starting event pipeline...');
  
  // Check that all required configuration is present
  if (!hasRequiredConfig()) {
    return {
      totalEvents: 0,
      uniqueEvents: 0,
      success: false,
      error: 'Missing required configuration'
    };
  }

  try {
    // Step 1: Fetch events
    const events = await fetchEvents();
    console.log(`Fetched ${events.length} events`);
    
    // Early exit if no events were found
    if (events.length === 0) {
      return {
        totalEvents: 0,
        uniqueEvents: 0,
        success: true,
        message: 'No events found'
      };
    }
    
    let uniqueEventsCount = 0;
    const processedEvents: EventData[] = [];
    
    // Step 2: Process each event
    for (const event of events) {
      try {
        // Generate embedding
        const eventWithEmbedding = await generateEmbedding(event);
        
        // Skip if there's no embedding (shouldn't happen, but just in case)
        if (!eventWithEmbedding.embedding) {
          console.warn(`Skipping event without embedding: ${event.event_headline}`);
          continue;
        }

        // Check for duplicates
        const duplicate = await isDuplicate(eventWithEmbedding.embedding);
        
        if (duplicate) {
          console.log(`Skipping duplicate event: ${event.event_headline}`);
          continue;
        }
        
        // Index in Pinecone
        await indexEvent(eventWithEmbedding);
        
        // Store in MongoDB
        await storeEvent(eventWithEmbedding);
        
        // Track successfully processed events
        processedEvents.push(eventWithEmbedding);
        uniqueEventsCount++;
      } catch (error) {
        // Continue with other events if one fails
        console.error(`Error processing event "${event.event_headline}":`, error);
      }
    }
    
    console.log(`Pipeline completed. Processed ${events.length} events, found ${uniqueEventsCount} unique events.`);
    
    return {
      totalEvents: events.length,
      uniqueEvents: uniqueEventsCount,
      success: true,
      message: uniqueEventsCount > 0 
        ? `Successfully processed ${uniqueEventsCount} unique events` 
        : 'All events were duplicates'
    };
  } catch (error) {
    console.error('Error in event pipeline:', error);
    
    return {
      totalEvents: 0,
      uniqueEvents: 0,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error in pipeline'
    };
  }
} 