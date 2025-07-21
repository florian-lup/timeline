import { getLatestPodcast } from '@/lib/services/podcast-repository';
import { successResponse, errorResponse } from '@/utils/api-helper';

/**
 * Fetches the latest podcast data
 */
export async function GET() {
  try {
    const podcast = await getLatestPodcast();

    if (!podcast) {
      return errorResponse('No podcast found', 404);
    }

    return successResponse(podcast);
  } catch (error) {
    return errorResponse('Failed to fetch latest podcast', 500, error);
  }
}
