export interface StoryData {
  _id: string;
  title: string;
  summary: string;
  date: string | Date;
  sources?: string[];
  research?: string;
}
