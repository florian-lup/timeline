import { TimelineEntry } from '../types/TimelineEntry';

/**
 * Fetches timeline entries from the MongoDB Atlas database via API
 * @returns {Promise<TimelineEntry[]>} A promise that resolves to an array of timeline entries
 */
export async function fetchTimelineEntries(): Promise<TimelineEntry[]> {
  try {
    const response = await fetch('/api/timeline');
    
    if (!response.ok) {
      throw new Error(`Error fetching timeline data: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data as TimelineEntry[];
  } catch (error) {
    console.error('Failed to fetch timeline entries:', error);
    throw error;
  }
} 