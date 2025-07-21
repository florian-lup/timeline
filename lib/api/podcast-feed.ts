import type { PodcastData } from '@/types/podcast-data';

/**
 * Fetches the latest podcast from the API
 */
export async function fetchLatestPodcast(): Promise<PodcastData> {
  const response = await fetch('/api/podcast/latest');

  if (!response.ok) {
    throw new Error(`Failed to fetch latest podcast: ${response.statusText}`);
  }

  return response.json() as Promise<PodcastData>;
}
