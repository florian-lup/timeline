import { ArticlesData } from '@/types/events/articles';

export interface PaginationMetadata {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ArticlesResponse {
  entries: ArticlesData[];
  pagination: PaginationMetadata;
}

/**
 * Fetches paginated timeline entries via API
 * @param page - Page number (default: 1)
 * @param limit - Items per page (default: 12)
 */
export async function fetchEvents(page = 1, limit = 12): Promise<ArticlesResponse> {
  try {
    const response = await fetch(`/api/events?page=${page}&limit=${limit}`);

    if (!response.ok) {
      throw new Error(`Error fetching timeline data: ${response.statusText}`);
    }

    const data = await response.json();
    return data as ArticlesResponse;
  } catch (error) {
    console.error('Failed to fetch timeline entries:', error);
    throw error;
  }
}
