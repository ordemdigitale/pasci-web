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
  crasc_region: ICrascRegion;
}

export interface IOsc {
  id: string;
  name: string;
  description: string;
  crascRegionId: string;
  region: ICrascRegion;
  type: IOscType;
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

// Interface for OscType
export interface IOscType {
  id: string;
  name: string;
  description: string;
}