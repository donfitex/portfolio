import type { Experience, Project, SearchResponse, SiteSettings } from "./types";

export const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000/api").replace(/\/+$/, "");
export const ADMIN_URL = `${API_URL.replace(/\/api$/, "")}/admin/`;

async function apiGet<T>(path: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    signal,
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`API request failed (${res.status})`);
  return (await res.json()) as T;
}

export const getProjects = (category?: string, signal?: AbortSignal) =>
  apiGet<Project[]>(
    `/projects/${category && category !== "all" ? `?category=${encodeURIComponent(category)}` : ""}`,
    signal
  );

export const searchProjects = (q: string, signal?: AbortSignal) =>
  apiGet<SearchResponse>(`/projects/search/?q=${encodeURIComponent(q)}`, signal);

export const getExperiences = (signal?: AbortSignal) => apiGet<Experience[]>("/experiences/", signal);

export const getSiteSettings = (signal?: AbortSignal) => apiGet<SiteSettings>("/site/", signal);