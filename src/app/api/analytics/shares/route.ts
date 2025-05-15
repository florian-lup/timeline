import clientPromise from '@/lib/mongodb';
import { successResponse, errorResponse } from '@/utils/apiHelpers';

// Get the total shares count
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('analytics');

    // Get the shares count document for the timeline
    const shareData = await db.collection('shares').findOne({ pageId: 'timeline' });

    return successResponse({
      count: shareData?.count || 0
    });
  } catch (error) {
    console.error('Error fetching shares count:', error);
    return errorResponse('Failed to fetch shares count', 500, error);
  }
}

// Increment the shares count
export async function POST() {
  try {
    const client = await clientPromise;
    const db = client.db('analytics');

    // Update shares count using upsert (create if doesn't exist)
    const result = await db.collection('shares').updateOne(
      { pageId: 'timeline' },
      { $inc: { count: 1 } },
      { upsert: true }
    );

    const shareData = await db.collection('shares').findOne({ pageId: 'timeline' });

    return successResponse({
      count: shareData?.count || 0,
      updated: result.modifiedCount > 0 || result.upsertedCount > 0
    });
  } catch (error) {
    console.error('Error updating shares count:', error);
    return errorResponse('Failed to update shares count', 500, error);
  }
} 