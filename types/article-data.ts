export interface ArticleData {
  _id: string;
  headline: string;
  summary: string;
  date: string | Date;
  sources: string[];
  story: string;
}
