import type { NextRequest } from 'next/server';

import { getStories } from '@/lib/services/story-repository';
import { successResponse, errorResponse } from '@/utils/api-helper';

/**
 * Cursor-based pagination utilities for more efficient querying
 * Uses _id as cursor since it encodes creation time and provides unique ordering
 */
interface CursorPaginationParams {
  before?: string;
  limit: number;
}

function getCursorPagination(
  searchParams: URLSearchParams,
  defaultLimit = 20,
): CursorPaginationParams {
  const rawLimit = Number(searchParams.get('limit'));
  const limit = Number.isInteger(rawLimit)
    ? Math.min(Math.max(rawLimit, 1), 50)
    : defaultLimit;
  const beforeParam = searchParams.get('before');
  const before =
    beforeParam !== null && beforeParam !== '' ? beforeParam : undefined;

  return {
    ...(before !== undefined && { before }),
    limit,
  };
}

/**
 * Fetches cursor-based paginated stories data
 */
export async function GET(request: NextRequest) {
  try {
    const { before, limit } = getCursorPagination(request.nextUrl.searchParams);

    const data = await getStories({
      ...(before !== undefined && { before }),
      limit,
    });

    return successResponse(data);
  } catch (error) {
    return errorResponse('Failed to fetch stories', 500, error);
  }
}
