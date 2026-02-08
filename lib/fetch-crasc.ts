import {
  ICrasc,
  ICrascDetail,
  IRegionCiv,
  IOscType,
  IOsc,
  IOscDetail,
  INews,
  SpotlightNews
} from "@/types/api.types";

// Get API base URL from environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Fetch all Crasc
export async function fetchAllCrasc(): Promise<ICrasc[]> {
  const res = await fetch(`${API_BASE_URL}/api/v1/crasc/crasc`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
    cache: "no-store"
  });
  if (!res.ok) {
    throw new Error("Échec du chargement des régions Crasc à partir de l'API");
  }
  return res.json();
}

// Fetch specific Crasc by slug with OSCs and Region CIVs from API
export async function getCrascBySlug(crasc_slug: string): Promise<ICrascDetail> {
  const response = await fetch(`${API_BASE_URL}/api/v1/crasc/crasc/${crasc_slug}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
    cache: "no-store"
  });
  if (!response.ok) {
    throw new Error("Échec du chargement des détails de la région Crasc à partir de l'API");
  }
  return response.json();
}

// Fetch all RegionCIV from API
export async function fetchAllRegion(): Promise<IRegionCiv[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/crasc/region`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
    cache: "no-store"
  });
  if (!response.ok) {
    throw new Error("Échec du chargement des régions CIV à partir de l'API");
  }
  return response.json();
}

// Fetch all OscType from API
export async function fetchAllOscType(): Promise<IOscType[]> {
  const res = await fetch(`${API_BASE_URL}/api/v1/crasc/osc-type`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
    cache: "no-store"
  });
  if (!res.ok) {
    throw new Error("Échec du chargement des types de OSC à partir de l'API");
  }
  return res.json();
}

// Fetch all OSC from API
export async function fetchAllOsc(): Promise<IOsc[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/crasc/osc?skip=0&limit=100`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
    cache: "no-store"
  });
  if (!response.ok) {
    throw new Error("Échec du chargement des types de OSC à partir de l'API");
  }
  return response.json();
}

// Fetch specific Osc by slug from API
export async function getOscBySlug(osc_slug: string): Promise<IOscDetail> {
  const response = await fetch(`${API_BASE_URL}/api/v1/crasc/osc/${osc_slug}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
    cache: "no-store"
  });
  if (!response.ok) {
    throw new Error("Échec du chargement des détails de l'OSC à partir de l'API");
  }
  return response.json();
}

// Fetch all News from API - Now using dedicated /news endpoint
export async function fetchAllNews(): Promise<INews[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/news?skip=0&limit=100`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
    cache: "no-store"
  });
  if (!response.ok) {
    throw new Error("Échec du chargement des actualités à partir de l'API");
  }
  return response.json();
}


// Fetch spotlight news: single (latest) news per crasc - Updated to use /news/spotlight
export async function fetchSpotlightNews(): Promise<SpotlightNews[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/news/spotlight`, {
      next: { revalidate: 3600 }, // Revalidate every hour for SSG/ISR
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error("Échec du chargement des actualités à partir de l'API");
    }

    return await response.json();
  } catch (error) {
    console.error("Échec du chargement des actualités à partir de l'API: ", error);
    return [];
  }
}

// Update CRASC by slug
export async function updateCrasc(
  slug: string,
  data: { name?: string; description?: string; osc_count?: number }
): Promise<ICrasc> {
  const response = await fetch(`${API_BASE_URL}/api/v1/crasc/crasc/${slug}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Échec de la mise à jour du CRASC");
  }

  return response.json();
}

// Delete CRASC by slug
export async function deleteCrasc(slug: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/v1/crasc/crasc/${slug}`, {
    method: "DELETE"
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Échec de la suppression du CRASC");
  }
}

// Get Region by slug
export async function getRegionBySlug(slug: string): Promise<IRegionCiv> {
  const response = await fetch(`${API_BASE_URL}/api/v1/crasc/region/${slug}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error("Région non trouvée");
  }

  return response.json();
}

// Update Region by slug
export async function updateRegion(
  slug: string,
  data: { name?: string; crasc_id?: number }
): Promise<IRegionCiv> {
  const response = await fetch(`${API_BASE_URL}/api/v1/crasc/region/${slug}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Échec de la mise à jour de la région");
  }

  return response.json();
}

// Delete Region by slug
export async function deleteRegion(slug: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/v1/crasc/region/${slug}`, {
    method: "DELETE"
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Échec de la suppression de la région");
  }
}