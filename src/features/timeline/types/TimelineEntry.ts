/**
 * Interface representing a timeline event with all necessary properties
 * to render in the timeline feed
 */
export interface TimelineEntry {
  _id: string;
  location: string;
  title: string;
  content: string;
  // Creation timestamp fields extracted from ObjectId
  createdAt?: number;
  creationDate?: string;
  creationTime?: string;
}
