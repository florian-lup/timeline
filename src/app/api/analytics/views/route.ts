import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

// Get the total view count
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('analytics');
    
    // Get the view count document for the timeline
    const viewData = await db.collection('views').findOne({ pageId: 'timeline' });
    
    return NextResponse.json({
      count: viewData?.count || 0
    });
  } catch (error) {
    console.error('Error fetching view count:', error);
    return NextResponse.json(
      { error: 'Failed to fetch view count' },
      { status: 500 }
    );
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
    
    return NextResponse.json({
      count: viewData?.count || 0,
      updated: result.modifiedCount > 0 || result.upsertedCount > 0
    });
  } catch (error) {
    console.error('Error updating view count:', error);
    return NextResponse.json(
      { error: 'Failed to update view count' },
      { status: 500 }
    );
  }
} 