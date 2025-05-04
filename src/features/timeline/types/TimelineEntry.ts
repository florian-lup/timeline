/**
 * Interface representing a timeline event with all necessary properties
 * to render in the timeline feed
 */
export interface TimelineEntry {
  _id: string;
  date: string;
  time: string;
  location: string;
  title: string;
  content: string;
}
