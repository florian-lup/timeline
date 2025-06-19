import type { NextRequest } from 'next/server';

import { getStoryById } from '@/lib/services/story-repository';
import { successResponse, errorResponse } from '@/utils/api-helper';

/**
 * Fetches a single story by its ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!id) {
      return errorResponse('Story ID is required', 400);
    }

    const story = await getStoryById(id);

    if (!story) {
      return errorResponse('Story not found', 404);
    }

    return successResponse(story);
  } catch (error) {
    return errorResponse('Failed to fetch story', 500, error);
  }
}
