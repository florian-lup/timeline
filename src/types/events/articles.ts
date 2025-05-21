/**
 * Timeline event interface with display properties
 */

export interface ArticlesData {
  _id: string;
  title: string;
  summary: string;
  date: string | Date;
  sources?: string[];
  research?: string;
}
