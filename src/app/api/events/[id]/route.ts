import type { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/utils/apiHelpers';
import { findEventById } from '@/services/events/articlesDb';

/**
 * Fetches single timeline event by id
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const event = await findEventById(id);

    if (!event) {
      return errorResponse('Event not found', 404);
    }

    return successResponse(event);
  } catch (error) {
    return errorResponse('Failed to fetch event', 500, error);
  }
} 