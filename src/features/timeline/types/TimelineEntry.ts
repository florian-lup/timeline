/**
 * Interface representing a timeline event with all necessary properties
 * to render in the timeline feed
 */

export interface TimelineEntry {
  _id: string;
  location: string;
  headline: string;
  summary: string;
  // Creation timestamp fields extracted from ObjectId
  createdAt?: number;
  creationDate?: string;
  creationTime?: string;
  citations?: string[]; // Array of citation URLs
}
