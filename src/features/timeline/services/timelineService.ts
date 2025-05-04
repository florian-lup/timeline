import { TimelineEntry } from '../types/TimelineEntry';

export interface PaginationMetadata {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface TimelineResponse {
  entries: TimelineEntry[];
  pagination: PaginationMetadata;
}

/**
 * Fetches timeline entries from the MongoDB Atlas database via API
 * @param {number} page - Page number to fetch (starting from 1)
 * @param {number} limit - Number of items per page
 * @returns {Promise<TimelineResponse>} A promise that resolves to timeline entries and pagination metadata
 */
export async function fetchTimelineEntries(page = 1, limit = 12): Promise<TimelineResponse> {
  try {
    const response = await fetch(`/api/timeline?page=${page}&limit=${limit}`);
    
    if (!response.ok) {
      throw new Error(`Error fetching timeline data: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data as TimelineResponse;
  } catch (error) {
    console.error('Failed to fetch timeline entries:', error);
    throw error;
  }
} 