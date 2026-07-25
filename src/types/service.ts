export type Service = {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  longDescription: string;
  icon: string;
  features: string[];
  technologies: string[];
  deliverables: string[];
  timeframe: string;
  category: ServiceCategory;
};

export type ServiceCategory =
  | "development"
  | "ai"
  | "automation"
  | "integration"
  | "support";
