export interface ArticleData {
  _id: string;
  title: string;
  summary: string;
  date: string | Date;
  sources: string[];
  story: string;
}
