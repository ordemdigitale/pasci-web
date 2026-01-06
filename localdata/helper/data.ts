import db from "@/localdata/crasc.json";

export interface ICrascRegion {
  id: string;
  crasc_region_name: string;
  slug: string;
}

export interface IRegionCiv {
  id: string;
  region_name: string;
  crascRegionId: string;
}

export interface IOsc {
  id: string;
  name: string;
  description: string;
  crascRegionId: string;
}

export interface ICrascRegionWithOscs extends ICrascRegion {
  oscs: IOsc[];
}

// Load all Crasc Regions
export function getAllCrascRegions(): ICrascRegion[] {
  return db.CrascRegion;
}
// Load all Crasc Regions from API route
export async function fetchAllCrascRegionsFromApi(): Promise<ICrascRegion[]> {
  const response = await fetch("http://localhost:8000/api/v1/crasc/region-crasc", {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
    cache: "no-store"
  });
  if (!response.ok) {
    throw new Error("Failed to fetch Crasc Regions from API");
  }
  return response.json();
}

// Load a specific Crasc Region by ID
export function getCrascRegionById(id: string): ICrascRegion | undefined {
  return db.CrascRegion.find(region => region.id === id);
}

// Load a specific Crasc Region by slug
export function getCrascRegionBySlug(slug: string): ICrascRegion | undefined {
  return db.CrascRegion.find(crascRegion => crascRegion.slug === slug);
}
// Load a specific Crasc Region by slug from API route
export async function fetchSpecificCrascRegionbySlugFromApi(slug: string): Promise<ICrascRegion[]> {
  const response = await fetch(`http://localhost:8000/api/v1/crasc/region-crasc/${slug}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
    cache: "no-store"
  });
  if (!response.ok) {
    throw new Error("Failed to fetch Crasc Region by slug from API");
  }
  return response.json();
}

// Load all civs for a specific region
export function getCivsByRegionId(crascId: string): IRegionCiv[] {
  return db.RegionCiv.filter(civ => civ.crascRegionId === crascId);
}

// Load all civs
export function getAllCivs(): IRegionCiv[] {
  return db.RegionCiv;
}

// Get Crasc Region data with its civs (combined)
export function getCrascRegionWithCivs(id: string) {
  const region = getCrascRegionById(id);
  if (!region) return null;
  
  const civs = getCivsByRegionId(id);
  return { ...region, civs };
}

// Get Crasc Region data with its civs (combined) by slug
export function getCrascRegionWithCivsBySlug(slug: string) {
  const region = getCrascRegionBySlug(slug);
  if (!region) return null;
  const civs = getCivsByRegionId(region.id);
  return { ...region, civs };
}

// Load all OSCs for a specific Crasc Region
export function getOscsByCrascRegionId(crascId: string): IOsc[] {
  return db.Osc.filter(osc => osc.crascRegionId === crascId);
}

// Get OSCs for a Crasc Region
export function getCrascRegionOscs(id: string) {
  const crascRegion = getCrascRegionById(id);
  if (!crascRegion) return null;

  const oscs = getOscsByCrascRegionId(id);
  return { ...crascRegion, oscs };
}

// Get OSCs for a Crasc Region by slug
export function getCrascRegionOscsBySlug(slug: string) {
  const crascRegion = getCrascRegionBySlug(slug);
  if (!crascRegion) return null;
  const oscs = getOscsByCrascRegionId(crascRegion.id);
  return { ...crascRegion, oscs };
}
// Get OSCs for a Crasc Region by slug from API route
export async function fetchCrascRegionBySlugWithOscsFromApi(slug: string): Promise<ICrascRegionWithOscs> {
  const response = await fetch(`http://localhost:8000/api/v1/crasc/region-crasc/${slug}/oscs`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
    cache: "no-store"
  });
  if (!response.ok) {
    throw new Error("Failed to fetch OSCs for this Crasc Region by slug from API");
  }
  return response.json();
}