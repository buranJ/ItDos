export type PortfolioProject = {
  slug: string;
  title: string;
  tagline: string;
  category: ProjectCategory;
  tags: string[];
  year: string;

  /** Per-project signature accent (hex). Themes the mockup + case study. */
  accent?: string;
  /** Which generative placeholder to render when real media is absent. */
  mockup: MockupKind;
  /** One-line headline result for the index, e.g. "+340% трафика". */
  highlight?: string;
  featured?: boolean;

  /* ── Real assets (all optional — drop in later, mockups fill the gaps) ── */
  coverImage?: string;
  coverVideo?: string;
  gallery?: string[];
  desktopScreens?: string[];
  mobileScreens?: string[];
  videos?: string[];

  /* ── Case-study meta ── */
  client?: string;
  services?: string[];
  role?: string;
  liveUrl?: string;

  /* ── Case-study content ── */
  overview: string;
  goals: string[];
  challenges: string[];
  solutions: string[];
  stack: string[];
  results: ProjectResult[];
  process: ProcessStep[];
  nextProject?: string;
};

export type ProjectCategory =
  | "website"
  | "webapp"
  | "crm"
  | "ai"
  | "bot"
  | "marketplace";

/** Generative placeholder kinds (treated as temporary, not final assets). */
export type MockupKind =
  | "browser"
  | "dashboard"
  | "marketplace"
  | "portal"
  | "chat"
  | "iframe"
  | "phone"
  | "laptop"
  | "showcase"
  | "flow"
  | "agent"
  | "neural"
  | "command"
  | "unified"
  | "assistant";

export type ProjectResult = {
  label: string;
  value: string;
  description: string;
};

export type ProcessStep = {
  phase: string;
  title: string;
  description: string;
  duration: string;
};
