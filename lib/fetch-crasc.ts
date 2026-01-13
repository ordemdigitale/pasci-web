import {
  ICrascRegion,
  ICrascRegionDetails,
  IRegionCiv,
  IOscType,
  IOsc,
  INews,
  SpotlightNews
} from "@/types/api.types";

// Fetch all Crasc regions data
export async function fetchAllCrascRegions(): Promise<ICrascRegion[]> {
  const res = await fetch("http://localhost:8000/api/v1/crasc/region-crasc", {
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

// Fetch specific Crasc region by slug with OSCs and Region CIVs from API
export async function getCrascRegionBySlugWithOscsFromApi(slug: string): Promise<ICrascRegionDetails> {
  const response = await fetch(`http://localhost:8000/api/v1/crasc/region-crasc/${slug}/details`, {
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
export async function fetchAllRegionCiv(): Promise<IRegionCiv[]> {
  const response = await fetch("http://localhost:8000/api/v1/crasc/region-civ", {
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
  const res = await fetch("http://localhost:8000/api/v1/crasc/osc-type", {
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
  const response = await fetch("http://localhost:8000/api/v1/crasc/osc-with-region-and-type?skip=0&limit=100", {
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

// Fetch all News from API
export async function fetchAllNews(): Promise<INews[]> {
  const response = await fetch("http://localhost:8000/api/v1/crasc/news-with-crasc-and-osc?skip=0&limit=100", {
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

// Fetch spotlight news: single (latest) news per crasc
export async function fetchSpotlightNews(): Promise<SpotlightNews[]> {
  try {
    const response = await fetch("http://localhost:8000/api/v1/crasc/news-spotlight-per-crasc", { 
        next: { revalidate: 3600 }, // Revalidate every hour for SSG/ISR
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
        cache: "no-store"
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