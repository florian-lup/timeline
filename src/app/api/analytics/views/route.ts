import clientPromise from '@/lib/mongodb';
import { successResponse, errorResponse } from '@/utils/apiHelpers';

// Get the total view count
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('analytics');

    // Get the view count document for the timeline
    const viewData = await db.collection('views').findOne({ pageId: 'timeline' });

    return successResponse({
      count: viewData?.count || 0
    });
  } catch (error) {
    console.error('Error fetching view count:', error);
    return errorResponse('Failed to fetch view count', 500, error);
  }
}

// Increment the view count
export async function POST() {
  try {
    const client = await clientPromise;
    const db = client.db('analytics');

    // Update view count using upsert (create if doesn't exist)
    const result = await db.collection('views').updateOne(
      { pageId: 'timeline' },
      { $inc: { count: 1 } },
      { upsert: true }
    );

    const viewData = await db.collection('views').findOne({ pageId: 'timeline' });

    return successResponse({
      count: viewData?.count || 0,
      updated: result.modifiedCount > 0 || result.upsertedCount > 0
    });
  } catch (error) {
    console.error('Error updating view count:', error);
    return errorResponse('Failed to update view count', 500, error);
  }
} 