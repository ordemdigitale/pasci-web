import {
  ICrasc,
  ICrascDetail,
  IRegionCiv,
  IOscType,
  IOsc,
  IOscDetail,
  INews,
  IEvenement,
  ICrascVideo,
  SpotlightNews
} from "@/types/api.types";

export type { ICrasc, ICrascDetail, IRegionCiv, IOscType, IOsc, IOscDetail, INews, IEvenement, ICrascVideo, SpotlightNews };

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

// Fetch paginated OSC from API
export async function fetchAllOsc(page = 1, size = 20): Promise<{ items: IOsc[]; total: number; page: number; size: number; pages: number }> {
  const response = await fetch(`${API_BASE_URL}/api/v1/crasc/osc?page=${page}&size=${size}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
    cache: "no-store"
  });
  if (!response.ok) {
    throw new Error("Échec du chargement des OSC à partir de l'API");
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

// Fetch events for a CRASC (upcoming by default)
export async function fetchEvenements(crasc_id?: number, a_venir = true): Promise<IEvenement[]> {
  const params = new URLSearchParams();
  if (crasc_id) params.set("crasc_id", String(crasc_id));
  params.set("a_venir", String(a_venir));
  const response = await fetch(`${API_BASE_URL}/api/v1/crasc/evenement?${params}`, {
    cache: "no-store"
  });
  if (!response.ok) throw new Error("Échec du chargement des événements");
  return response.json();
}

// Create an event (requires auth token)
export async function createEvenement(
  data: { title: string; description?: string; date_debut: string; date_fin?: string; lieu?: string; crasc_id?: number },
  token: string
): Promise<IEvenement> {
  const response = await fetch(`${API_BASE_URL}/api/v1/crasc/evenement`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.detail || "Échec de la création de l'événement");
  }
  return response.json();
}

// Delete an event (requires auth token)
export async function deleteEvenement(id: number, token: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/v1/crasc/evenement/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.detail || "Échec de la suppression de l'événement");
  }
}

// Fetch videos for a CRASC
export async function fetchCrascVideos(crasc_id: number): Promise<ICrascVideo[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/crasc/video?crasc_id=${crasc_id}`, {
    cache: "no-store"
  });
  if (!response.ok) throw new Error("Échec du chargement des vidéos");
  return response.json();
}

// Create a CRASC video (requires auth token)
export async function createCrascVideo(
  data: { crasc_id: number; titre: string; url: string; description?: string; ordre?: number },
  token: string
): Promise<ICrascVideo> {
  const response = await fetch(`${API_BASE_URL}/api/v1/crasc/video`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.detail || "Échec de l'ajout de la vidéo");
  }
  return response.json();
}

// Delete a CRASC video (requires auth token)
export async function deleteCrascVideo(id: number, token: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/v1/crasc/video/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.detail || "Échec de la suppression de la vidéo");
  }
}