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
  crasc_id: string;
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

// Interface for News
export interface INews {
  id: string;
  title: string;
  crasc: ICrascRegion;
  osc: IOsc
}
// Interface for Spotlight News 
export interface SpotlightNews {
  id: string;
  title: string;
  thumbnail_url: string;
  crasc: ICrascRegion;
  osc?: IOsc;
}