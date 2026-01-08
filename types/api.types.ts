export interface ICrascRegion {
  id: string;
  name: string;
  slug: string;
  order: number;
  osc_count: number;
}

export interface IRegionCiv {
  id: string;
  name: string;
  crascRegionId: string;
}

export interface IOsc {
  id: string;
  name: string;
  description: string;
  crascRegionId: string;
}

// Interface for Crasc region by slug with OSCs and Region CIVs
export interface ICrascRegionDetails {
  id: string;
  name: string;
  slug: string;
  osc_count: number;
  oscs: IOsc[];
  regions_civ: IRegionCiv[];
}