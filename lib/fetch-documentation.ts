// lib/fetch-documentation.ts | Functions to fetch documentation from API

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface IDocumentation {
  id: number;
  title: string;
  description: string | null;
  type: string; // 'documentation' or 'fiche'
  category: string | null;
  file_path: string | null;
  file_type: string | null;
  file_size: number | null;
  thumbnail_path: string | null;
  file_url: string | null;
  download_url: string | null;
  thumbnail_url: string;
  crasc_id: number | null;
  osc_id: number | null;
  slug: string | null;
  created_at: string;
  updated_at: string;
  crasc?: {
    id: number;
    name: string;
    slug: string;
  } | null;
  osc?: {
    id: number;
    name: string;
    slug: string;
  } | null;
}

export interface DocumentationFilters {
  skip?: number;
  limit?: number;
  type?: string; // 'documentation' or 'fiche'
  category?: string;
  crasc_id?: number;
  osc_id?: number;
  search?: string;
  sort_by?: "created_at" | "title";
  sort_order?: "asc" | "desc";
}

/**
 * Fetch all documentation with optional filters
 */
export async function fetchAllDocumentation(
  filters: DocumentationFilters = {}
): Promise<IDocumentation[]> {
  const params = new URLSearchParams();

  if (filters.skip !== undefined) params.append("skip", filters.skip.toString());
  if (filters.limit !== undefined) params.append("limit", filters.limit.toString());
  if (filters.type) params.append("type", filters.type);
  if (filters.category) params.append("category", filters.category);
  if (filters.crasc_id !== undefined) params.append("crasc_id", filters.crasc_id.toString());
  if (filters.osc_id !== undefined) params.append("osc_id", filters.osc_id.toString());
  if (filters.search) params.append("search", filters.search);
  if (filters.sort_by) params.append("sort_by", filters.sort_by);
  if (filters.sort_order) params.append("sort_order", filters.sort_order);

  const url = `${API_BASE_URL}/api/v1/documentation${params.toString() ? `?${params.toString()}` : ""}`;
  
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Problème de chargement des documents.");
  }

  return response.json();
}

/**
 * Fetch a single documentation by slug
 */
export async function getDocumentationBySlug(
  doc_slug: string
): Promise<IDocumentation> {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/documentation/${doc_slug}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Problème de chargement du document.");
  }

  return response.json();
}

/**
 * Fetch all available categories
 */
export async function fetchDocumentationCategories(): Promise<string[]> {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/documentation/categories`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Problème de chargement des catégories.");
  }

  return response.json();
}
