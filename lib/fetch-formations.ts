// lib/fetch-formations.ts | Functions to fetch formations from API

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface IFormation {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  trainer: string | null;
  location: string | null;
  start_date: string | null;
  end_date: string | null;
  registration_deadline: string | null;
  max_participants: number | null;
  current_participants: number;
  is_published: boolean;
  is_full: boolean;
  is_completed: boolean;
  thumbnail_path: string;
  thumbnail_url: string;
  registration_link: string | null;
  materials_link: string | null;
  crasc_id: number | null;
  osc_id: number | null;
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
  created_at: string;
  updated_at: string;
}

export interface FormationFilters {
  skip?: number;
  limit?: number;
  published_only?: boolean;
  upcoming_only?: boolean;
  search?: string;
  crasc_id?: number;
  osc_id?: number;
}

/**
 * Fetch all formations with optional filters
 */
export async function fetchAllFormations(
  filters: FormationFilters = {}
): Promise<IFormation[]> {
  const params = new URLSearchParams();

  if (filters.skip !== undefined) params.append("skip", filters.skip.toString());
  if (filters.limit !== undefined) params.append("limit", filters.limit.toString());
  if (filters.published_only) params.append("published_only", "true");
  if (filters.upcoming_only) params.append("upcoming_only", "true");
  if (filters.search) params.append("search", filters.search);
  if (filters.crasc_id !== undefined) params.append("crasc_id", filters.crasc_id.toString());
  if (filters.osc_id !== undefined) params.append("osc_id", filters.osc_id.toString());

  const url = `${API_BASE_URL}/api/v1/formations${params.toString() ? `?${params.toString()}` : ""}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Problème de chargement des formations.");
  }

  return response.json();
}

/**
 * Fetch upcoming published formations
 */
export async function fetchUpcomingFormations(
  limit: number = 5
): Promise<IFormation[]> {
  const params = new URLSearchParams();
  params.append("limit", limit.toString());

  const url = `${API_BASE_URL}/api/v1/formations/upcoming?${params.toString()}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Problème de chargement des formations à venir.");
  }

  return response.json();
}

/**
 * Fetch a single formation by slug
 */
export async function getFormationBySlug(
  formation_slug: string
): Promise<IFormation> {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/formations/${formation_slug}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Problème de chargement de la formation.");
  }

  return response.json();
}

/**
 * Register to a formation (increments participant count)
 */
export async function registerToFormation(
  formation_slug: string
): Promise<{
  message: string;
  formation: string;
  current_participants: number;
  is_full: boolean;
}> {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/formations/${formation_slug}/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Erreur lors de l'inscription.");
  }

  return response.json();
}
