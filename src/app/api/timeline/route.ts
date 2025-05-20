import { NextRequest } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { successResponse, errorResponse } from '@/utils/apiHelpers';

export async function GET(request: NextRequest) {
  try {
    // Get pagination parameters from URL
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '12', 10);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const skip = (page - 1) * limit;

    const client = await clientPromise;
    const db = client.db('events');

    // Fetch timeline entries from MongoDB collection with pagination
    // Sort by the explicit date field in descending order (newest first)
    const timelineEntries = await db
      .collection('global')
      .find({})
      .sort({ date: -1, _id: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    // Entries already contain the date field, no additional processing required
    const entriesWithDate = timelineEntries;

    // Get total count for pagination metadata
    const total = await db.collection('global').countDocuments({});

    return successResponse({
      entries: entriesWithDate,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching timeline data:', error);
    return errorResponse('Failed to fetch timeline data', 500, error);
  }
} 