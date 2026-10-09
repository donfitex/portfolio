export type Category = "ai_ml" | "backend" | "frontend" | "fullstack" | "data" | "other";

export interface Project {
  id: number;
  title: string;
  slug: string;
  description: string;
  category: Category;
  category_label: string;
  tech_stack: string[];
  github_url: string;
  live_url: string;
  image_url: string;
  metrics: Record<string, string | number | boolean>;
  problem_statement: string;
  solution: string;
  featured: boolean;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface SearchResult extends Project {
  relevance: number;
}

export interface SearchResponse {
  query: string;
  count: number;
  results: SearchResult[];
}

export interface Experience {
  id: number;
  company: string;
  role: string;
  location: string;
  start_date: string;
  end_date: string | null;
  current: boolean;
  bullet_points: string[];
}

export interface SiteSettings {
  name: string;
  hero_tagline: string;
  hero_subtext: string;
  github_url: string;
  linkedin_url: string;
  email: string;
}

export const CATEGORY_FILTERS: { value: string; label: string }[] = [
  { value: "all", label: "All" },
  { value: "ai_ml", label: "AI / ML" },
  { value: "backend", label: "Backend" },
  { value: "frontend", label: "Frontend" },
  { value: "fullstack", label: "Full-Stack" },
  { value: "data", label: "Data Engineering" },
  { value: "other", label: "Other" },
];