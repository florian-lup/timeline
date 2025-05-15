import clientPromise from '@/lib/mongodb';
import { successResponse, errorResponse } from '@/utils/apiHelpers';

// Get the total reactions count
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('analytics');

    // Get the reactions count document for the timeline
    const reactionData = await db.collection('reactions').findOne({ pageId: 'timeline' });

    return successResponse({
      count: reactionData?.count || 0,
    });
  } catch (error) {
    console.error('Error fetching reactions count:', error);
    return errorResponse('Failed to fetch reactions count', 500, error);
  }
}

// Increment the reactions count
export async function POST() {
  try {
    const client = await clientPromise;
    const db = client.db('analytics');

    // Update reactions count using upsert (create if doesn't exist)
    const result = await db.collection('reactions').updateOne(
      { pageId: 'timeline' },
      { $inc: { count: 1 } },
      { upsert: true }
    );

    const reactionData = await db.collection('reactions').findOne({ pageId: 'timeline' });

    return successResponse({
      count: reactionData?.count || 0,
      updated: result.modifiedCount > 0 || result.upsertedCount > 0,
    });
  } catch (error) {
    console.error('Error updating reactions count:', error);
    return errorResponse('Failed to update reactions count', 500, error);
  }
} 