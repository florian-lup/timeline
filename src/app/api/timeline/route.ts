import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { NextRequest } from 'next/server';
import { ObjectId } from 'mongodb';

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
    // Sort by _id which corresponds to creation timestamp in descending order (newest first)
    const timelineEntries = await db
      .collection('worldwide')
      .find({})
      .sort({ _id: -1 })  // Changed from date: -1 to _id: -1
      .skip(skip)
      .limit(limit)
      .toArray();
    
    // Add creation timestamp from ObjectId
    const entriesWithCreationTime = timelineEntries.map(entry => {
      let creationTimestamp = null;
      let creationDate = null;
      let creationTime = null;
      
      if (entry._id instanceof ObjectId) {
        const timestamp = entry._id.getTimestamp();
        creationTimestamp = Math.floor(timestamp.getTime() / 1000);
        // Format date with month name
        creationDate = timestamp.toLocaleDateString([], { 
          month: 'long', 
          day: 'numeric', 
          year: 'numeric' 
        });
        // Format time without seconds
        creationTime = timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } else if (typeof entry._id === 'string') {
        // If _id is a string representation of ObjectId
        try {
          // Fix for deprecated constructor: ensure we're passing a valid hex string
          const objectId = new ObjectId(String(entry._id));
          const timestamp = objectId.getTimestamp();
          creationTimestamp = Math.floor(timestamp.getTime() / 1000);
          // Format date with month name
          creationDate = timestamp.toLocaleDateString([], { 
            month: 'long', 
            day: 'numeric', 
            year: 'numeric' 
          });
          // Format time without seconds
          creationTime = timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } catch {
          // Not a valid ObjectId string
        }
      }
      return {
        ...entry,
        createdAt: creationTimestamp,
        creationDate,
        creationTime
      };
    });
    
    // Get total count for pagination metadata
    const total = await db.collection('worldwide').countDocuments({});
    
    return NextResponse.json({
      entries: entriesWithCreationTime,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching timeline data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch timeline data' },
      { status: 500 }
    );
  }
} 