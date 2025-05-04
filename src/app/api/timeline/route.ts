import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('events');
    
    // Fetch timeline entries from MongoDB collection
    const timelineEntries = await db
      .collection('world_events')
      .find({})
      .sort({ date: -1 })
      .toArray();
    
    return NextResponse.json(timelineEntries);
  } catch (error) {
    console.error('Error fetching timeline data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch timeline data' },
      { status: 500 }
    );
  }
} 