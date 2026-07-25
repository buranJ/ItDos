export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: BlogCategory;
  tags: string[];
  author: string;
  publishedAt: string;
  readTime: number;
};

export type BlogCategory =
  | "development"
  | "ai"
  | "automation"
  | "crm"
  | "business"
  | "bots";
