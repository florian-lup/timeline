import type { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/utils/apiHelpers';
import { getPagination } from '@/utils/pagination';
import { listTimelineEntries } from '@/services/timeline/timelineDb';

export async function GET(request: NextRequest) {
  try {
    const { page, limit, skip } = getPagination(request.nextUrl.searchParams);

    const data = await listTimelineEntries({ page, limit, skip });

    return successResponse(data);
  } catch (error) {
    return errorResponse('Failed to fetch timeline data', 500, error);
  }
}
