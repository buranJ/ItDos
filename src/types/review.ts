export type Review = {
  id: string;
  author: string;
  position: string;
  company: string;
  text: string;
  rating: number;
  project?: string;
  date: string;
};
