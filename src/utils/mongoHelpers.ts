import { ObjectId } from 'mongodb';

/**
 * Extracts timestamp information from MongoDB ObjectId
 * @param id MongoDB ObjectId or string representation
 * @returns Object containing timestamp information or null values if invalid
 */
export function extractTimeFromObjectId(id: ObjectId | string) {
  let creationTimestamp = null;
  let creationDate = null;
  let creationTime = null;
  
  try {
    let timestamp;
    
    if (id instanceof ObjectId) {
      timestamp = id.getTimestamp();
    } else if (typeof id === 'string') {
      // If id is a string representation of ObjectId
      const objectId = new ObjectId(String(id));
      timestamp = objectId.getTimestamp();
    }
    
    if (timestamp) {
      creationTimestamp = Math.floor(timestamp.getTime() / 1000);
      // Format date with month name
      creationDate = timestamp.toLocaleDateString([], { 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
      });
      // Format time without seconds
      creationTime = timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  } catch {
    // Not a valid ObjectId
  }
  
  return {
    createdAt: creationTimestamp,
    creationDate,
    creationTime
  };
} 