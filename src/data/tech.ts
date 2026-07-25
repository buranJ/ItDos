export type TechItem = {
  name: string;
  category: "frontend" | "backend" | "ai" | "devops" | "database";
};

export const techStack: TechItem[] = [
  { name: "Next.js", category: "frontend" },
  { name: "React", category: "frontend" },
  { name: "TypeScript", category: "frontend" },
  { name: "TailwindCSS", category: "frontend" },
  { name: "Framer Motion", category: "frontend" },
  { name: "Three.js", category: "frontend" },
  { name: "Python", category: "backend" },
  { name: "FastAPI", category: "backend" },
  { name: "Django", category: "backend" },
  { name: "Node.js", category: "backend" },
  { name: "PostgreSQL", category: "database" },
  { name: "Redis", category: "database" },
  { name: "ClickHouse", category: "database" },
  { name: "Elasticsearch", category: "database" },
  { name: "OpenAI", category: "ai" },
  { name: "LangChain", category: "ai" },
  { name: "LangGraph", category: "ai" },
  { name: "Claude API", category: "ai" },
  { name: "Docker", category: "devops" },
  { name: "GitHub Actions", category: "devops" },
  { name: "Nginx", category: "devops" },
  { name: "Sentry", category: "devops" },
];

export const marqueeItems = [
  "Используем только современные технологии которые отвечают международным стандартам",
  "Используем только современные технологии которые отвечают международным стандартам",
  "Используем только современные технологии которые отвечают международным стандартам",
];
