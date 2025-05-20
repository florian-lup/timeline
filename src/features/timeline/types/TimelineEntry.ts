/**
 * Interface representing a timeline event with all necessary properties
 * to render in the timeline feed
 */

export interface TimelineEntry {
  _id: string;
  title: string;
  summary: string;
  date: string | Date;
  sources?: string[];
  research?: string;
}
